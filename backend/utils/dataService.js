import fs from 'fs';
import path from 'path';

// Resolve data directory with multiple fallbacks so process cwd differences don't yield 0 files.
function resolveDataDir() {
  // 1. Explicit env override
  if (process.env.BIOGUIDE_DATA_DIR) {
    return process.env.BIOGUIDE_DATA_DIR;
  }
  const candidates = [];
  const cwd = process.cwd();
  // If running from backend/ (npm start typical)
  candidates.push(path.join(cwd, '../bioc'));
  // If running from repo root
  candidates.push(path.join(cwd, 'bioc'));
  // If compiled /dist or similar (defensive)
  candidates.push(path.join(cwd, '../../bioc'));
  for (const c of candidates) {
    try {
      if (fs.existsSync(c) && fs.statSync(c).isDirectory()) {
        return c;
      }
    } catch (_) { /* ignore */ }
  }
  // Final fallback: first candidate (even if missing) so we can log
  return candidates[0];
}

const dataDir = resolveDataDir();

// In-memory caches
let allData = {}; // Raw data keyed by filename
let dashboardCache = {}; // Per-file dashboard optimized data
let inspectorCache = {}; // Per-file inspector optimized data
let publicationsArrayCache = []; // Flat list of all publications
let publicationIndex = new Map(); // pubId -> publication object
let lastLoaded = 0; // timestamp
const RELOAD_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes default staleness window

// ---- Core Loading ----
function safeReadJSON(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to read/parse ${filePath}:`, err.message);
    return null;
  }
}

function loadAllJson() {
  if (!fs.existsSync(dataDir)) {
    console.warn(`⚠️ Data directory not found: ${dataDir}`);
    return {};
  }
  const files = fs.readdirSync(dataDir);
  const merged = {};
  let count = 0;
  files.forEach(file => {
    if (file.endsWith('.json')) {
      const p = path.join(dataDir, file);
      const content = safeReadJSON(p);
      if (content) {
        merged[file] = content; // Keep original structure (often large arrays)
        count += 1;
      }
    }
  });
  if (count === 0) {
    console.warn(`⚠️ No JSON files loaded from ${dataDir}. CWD=${process.cwd()} Candidates may be incorrect. Set BIOGUIDE_DATA_DIR env variable if needed.`);
  }
  return merged;
}

function needsReload(force = false) {
  if (force) return true;
  if (!lastLoaded) return true;
  return (Date.now() - lastLoaded) > RELOAD_INTERVAL_MS;
}

export function ensureDataLoaded({ force = false } = {}) {
  if (!needsReload(force)) return; // Fresh enough
  allData = loadAllJson();
  buildDerivedCaches();
  lastLoaded = Date.now();
  console.log(`✅ Data loaded (${Object.keys(allData).length} files) from ${dataDir}`);
}

// ---- Dashboard Metrics ----
function collectAuthorsFromPassageInfons(infons = {}) {
  const authors = [];
  Object.keys(infons).forEach(k => {
    if (k.startsWith('name_')) {
      const val = infons[k];
      // Expect format surname:Valonen;given-names:P.K.
      if (typeof val === 'string') {
        const surnameMatch = val.match(/surname:([^;]+)/);
        const givenMatch = val.match(/given-names:([^;]+)/);
        const surname = surnameMatch ? surnameMatch[1] : '';
        const given = givenMatch ? givenMatch[1] : '';
        const full = [given, surname].filter(Boolean).join(' ').trim();
        if (full) authors.push(full);
      }
    }
  });
  return authors;
}

function extractDashboardMetrics(fileData) {
  // fileData can be an array of root objects that contain documents[]
  let documentCount = 0;
  let passageCount = 0;
  const sectionTypeCounts = {};
  const yearCounts = {};
  const journalCounts = {};
  const authorCounts = new Map();

  const pushAuthors = (authors) => {
    authors.forEach(a => authorCounts.set(a, (authorCounts.get(a) || 0) + 1));
  };

  (Array.isArray(fileData) ? fileData : [fileData]).forEach(root => {
    const docs = root?.documents || [];
    docs.forEach(doc => {
      documentCount += 1;
      (doc.passages || []).forEach(p => {
        passageCount += 1;
        const st = p?.infons?.section_type;
        if (st) sectionTypeCounts[st] = (sectionTypeCounts[st] || 0) + 1;
        const yr = p?.infons?.year;
        if (yr) yearCounts[yr] = (yearCounts[yr] || 0) + 1;
        const journal = p?.infons?.['journal-title'];
        if (journal) journalCounts[journal] = (journalCounts[journal] || 0) + 1;
        pushAuthors(collectAuthorsFromPassageInfons(p?.infons));
      });
    });
  });

  const topAuthors = Array.from(authorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([author, count]) => ({ author, count }));

  return {
    summary: {
      documents: documentCount,
      passages: passageCount,
      uniqueSectionTypes: Object.keys(sectionTypeCounts).length,
      uniqueJournals: Object.keys(journalCounts).length,
      uniqueYears: Object.keys(yearCounts).length,
      uniqueAuthors: authorCounts.size,
    },
    counts: {
      sectionTypes: sectionTypeCounts,
      journals: journalCounts,
      years: yearCounts
    },
    charts: {
      sectionTypeDistribution: Object.entries(sectionTypeCounts).map(([type, count]) => ({ type, count })),
      yearDistribution: Object.entries(yearCounts).map(([year, count]) => ({ year, count })).sort((a,b)=>a.year.localeCompare(b.year)),
      topAuthors
    }
  };
}

// ---- Inspector Data ----
function extractInspectorData(fileData) {
  const records = [];
  const hierarchy = {};
  const rootArray = Array.isArray(fileData) ? fileData : [fileData];
  rootArray.forEach(root => {
    (root.documents || []).forEach(doc => {
      const docId = doc.id || doc?.infons?.['article-id_pmc'];
      const docEntry = { id: docId, passages: doc.passages || [], infons: doc.infons || {} };
      records.push(docEntry);
      hierarchy[docId] = (doc.passages || []).map(p => ({
        section_type: p?.infons?.section_type || null,
        offset: p.offset,
        length: p.text?.length || 0
      }));
    });
  });

  return {
    metadata: {
      documents: records.length,
      passages: records.reduce((acc, r) => acc + r.passages.length, 0)
    },
    records,
    hierarchy
  };
}

// ---- Publication Extraction ----
function buildPublicationCaches() {
  publicationsArrayCache = [];
  publicationIndex = new Map();

  Object.entries(allData).forEach(([filename, fileData]) => {
    const rootArray = Array.isArray(fileData) ? fileData : [fileData];
    rootArray.forEach(root => {
      (root.documents || []).forEach(doc => {
        // Use PMC id first, else fallback to doc.id
        const pmcId = doc?.infons?.['article-id_pmc'] || doc.id || doc?.infons?.['article-id_pmid'];
        let title = '';
        let abstract = '';
  let authors = [];
  let year = '';
  let journal = '';
  // Collect all non-abstract body text into a single fullText field.
  // Strategy: after capturing title & abstract, concatenate passage texts whose section_type is not TITLE and not ABSTRACT.
  // Preserve original order based on appearance in file.
  const bodyChunks = [];

        (doc.passages || []).forEach(p => {
            const st = p?.infons?.section_type;
            if (st === 'TITLE' && !title) {
              title = p.text?.trim() || '';
              authors = collectAuthorsFromPassageInfons(p.infons) || authors;
              year = p?.infons?.year || year;
              journal = p?.infons?.['journal-title'] || journal;
            } else if (st === 'ABSTRACT' && !abstract) {
              abstract = p.text?.trim() || '';
            } else if (p.text && st && st !== 'TITLE' && st !== 'ABSTRACT') {
              // Accumulate other sections (INTRO, METHODS, RESULTS, etc.)
              bodyChunks.push(p.text.trim());
            } else if (p.text && !st) {
              // Passages without section_type still may contain relevant text.
              bodyChunks.push(p.text.trim());
            }
        });

        // Build publication object
        const pub = {
          id: pmcId,
          title,
          year,
          journal,
          authors,
          abstract,
          fullText: bodyChunks.join('\n\n'),
          file: filename,
          citations: [], // Placeholder / future enhancement
          related: []
        };
        if (pmcId) {
          publicationsArrayCache.push(pub);
          publicationIndex.set(pmcId, pub);
        }
      });
    });
  });

  // Simple related linking: same journal & year
  const byJournalYear = new Map();
  publicationsArrayCache.forEach(pub => {
    const key = `${pub.journal}|${pub.year}`;
    if (!byJournalYear.has(key)) byJournalYear.set(key, []);
    byJournalYear.get(key).push(pub.id);
  });
  publicationsArrayCache.forEach(pub => {
    const key = `${pub.journal}|${pub.year}`;
    const related = (byJournalYear.get(key) || []).filter(id => id !== pub.id).slice(0, 10);
    pub.related = related;
  });
}

// ---- Derived Cache Builders ----
function buildDerivedCaches() {
  dashboardCache = {};
  inspectorCache = {};
  Object.entries(allData).forEach(([filename, fileData]) => {
    dashboardCache[filename] = extractDashboardMetrics(fileData);
    inspectorCache[filename] = extractInspectorData(fileData);
  });
  buildPublicationCaches();
}

// ---- Public Finders ----
export function getAllRawData() { return allData; }
export function getDashboardData() { return dashboardCache; }
export function getInspectorData() { return inspectorCache; }
export function getAllPublications() { return publicationsArrayCache; }

export function findRecordById(id) {
  // Search across inspector cache (documents)
  for (const [filename, insp] of Object.entries(inspectorCache)) {
    const rec = insp.records.find(r => String(r.id) === String(id));
    if (rec) return { file: filename, record: rec };
  }
  return null;
}

export function findPublicationById(pubId) {
  return publicationIndex.get(pubId) || null;
}

// ---- Helper for responses ----
export function buildPublicationResponse(pub) {
  if (!pub) return null;
  return { publication: pub };
}

// Initial eager load
ensureDataLoaded({ force: true });

// Optional: watch for changes and refresh (debounced)
try {
  if (fs.existsSync(dataDir)) {
    let timer; 
    fs.watch(dataDir, { persistent: false }, () => {
      clearTimeout(timer);
      timer = setTimeout(() => ensureDataLoaded({ force: true }), 1000);
    });
  }
} catch (err) {
  console.warn('File watching not active:', err.message);
}
