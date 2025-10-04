export interface Publication {
  id: string;
  title: string;
  authors: Array<{ surname: string; givenNames: string; }>; // legacy local shape
  year: number;
  doi?: string;
  pmid?: string;
  pmc?: string;
  abstract: string;
  mission: string;
  organism: string;
  assay: string;
  source: string;
  license: string;
  url: string;
  pdfUrl?: string | null;
  volume?: string;
  issue?: string;
  publisher: string;
  keywords: string[];
}

export interface SearchQuery {
  text?: string;
  organism?: string;
  assay?: string;
  mission?: string;
  source?: string;
  yearFrom?: number;
  yearTo?: number;
}

export interface SearchResult {
  publications: Publication[];
  total: number;
  facets: {
    organisms: Record<string, number>;
    assays: Record<string, number>;
    missions: Record<string, number>;
    sources: Record<string, number>;
    years: Record<number, number>;
  };
}

export function parseAdvancedQuery(query: string): SearchQuery {
  const result: SearchQuery = {};
  
  // Extract special tokens
  const tokens: { [key: string]: RegExp } = {
    organism: /organism:([^\s"]+|"[^"]*")/gi,
    assay: /assay:([^\s"]+|"[^"]*")/gi,
    mission: /mission:([^\s"]+|"[^"]*")/gi,
    source: /source:([^\s"]+|"[^"]*")/gi,
    yearFrom: /year>=(\d{4})/gi,
    yearTo: /year<=(\d{4})/gi,
  };

  let remainingQuery = query;

  for (const [key, regex] of Object.entries(tokens)) {
    const matches = [...query.matchAll(regex)];
    if (matches.length > 0) {
      const lastMatch = matches[matches.length - 1];
      let value = lastMatch[1];
      
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      
      if (key === 'yearFrom' || key === 'yearTo') {
        (result as any)[key] = parseInt(value);
      } else {
        (result as any)[key] = value;
      }
      
      // Remove this token from the remaining query
      remainingQuery = remainingQuery.replace(regex, '').trim();
    }
  }

  // What's left is free text search
  if (remainingQuery.trim()) {
    result.text = remainingQuery.trim();
  }

  return result;
}

export function searchPublications(
  publications: Publication[],
  query: SearchQuery,
  page: number = 1,
  limit: number = 10
): SearchResult {
  let filtered = publications;

  // Apply filters
  if (query.text) {
    const searchTerms = query.text.toLowerCase().split(/\s+/);
    filtered = filtered.filter(pub =>
      searchTerms.every(term =>
        pub.title.toLowerCase().includes(term) ||
        pub.abstract.toLowerCase().includes(term) ||
        pub.authors.some(author =>
          `${author.givenNames} ${author.surname}`.toLowerCase().includes(term)
        ) ||
        pub.keywords.some(keyword => keyword.toLowerCase().includes(term))
      )
    );
  }

  if (query.organism) {
    filtered = filtered.filter(pub =>
      pub.organism.toLowerCase().includes(query.organism!.toLowerCase())
    );
  }

  if (query.assay) {
    filtered = filtered.filter(pub =>
      pub.assay.toLowerCase().includes(query.assay!.toLowerCase())
    );
  }

  if (query.mission) {
    filtered = filtered.filter(pub =>
      pub.mission.toLowerCase().includes(query.mission!.toLowerCase())
    );
  }

  if (query.source) {
    filtered = filtered.filter(pub =>
      pub.source.toLowerCase().includes(query.source!.toLowerCase())
    );
  }

  if (query.yearFrom) {
    filtered = filtered.filter(pub => pub.year >= query.yearFrom!);
  }

  if (query.yearTo) {
    filtered = filtered.filter(pub => pub.year <= query.yearTo!);
  }

  // Calculate facets
  const facets = {
    organisms: {} as Record<string, number>,
    assays: {} as Record<string, number>,
    missions: {} as Record<string, number>,
    sources: {} as Record<string, number>,
    years: {} as Record<number, number>,
  };

  filtered.forEach(pub => {
    facets.organisms[pub.organism] = (facets.organisms[pub.organism] || 0) + 1;
    facets.assays[pub.assay] = (facets.assays[pub.assay] || 0) + 1;
    facets.missions[pub.mission] = (facets.missions[pub.mission] || 0) + 1;
    facets.sources[pub.source] = (facets.sources[pub.source] || 0) + 1;
    facets.years[pub.year] = (facets.years[pub.year] || 0) + 1;
  });

  // Pagination
  const start = (page - 1) * limit;
  const paginatedResults = filtered.slice(start, start + limit);

  return {
    publications: paginatedResults,
    total: filtered.length,
    facets
  };
}

export async function loadPublications(): Promise<Publication[]> {
  try {
    // Prefer backend dynamic publications endpoint
    const resp = await fetch('http://localhost:3000/api/publications');
    if (resp.ok) {
      const data = await resp.json(); // { publications: [...] }
      if (Array.isArray(data.publications)) {
        // Map backend minimal pub objects to local Publication interface (best-effort)
        return data.publications.map((p: any) => ({
          id: p.id,
            title: p.title || '',
            authors: (p.authors || []).map((full: string) => {
              const parts = full.split(' ');
              return { givenNames: parts.slice(0, -1).join(' ') || '', surname: parts.slice(-1)[0] || '' };
            }),
            year: Number(p.year) || 0,
            abstract: p.abstract || '',
            mission: '',
            organism: '',
            assay: '',
            source: p.journal || p.file || 'Unknown',
            license: '',
            url: '',
            publisher: p.journal || 'Unknown',
            keywords: [],
            volume: undefined,
            issue: undefined,
            pmc: p.id,
            pmid: undefined,
            doi: undefined,
            pdfUrl: null
        }));
      }
    }
  } catch (err) {
    console.warn('Backend publications endpoint failed, falling back to static JSON.', err);
  }
  try {
    const response = await fetch('/src/data/publications.json');
    if (!response.ok) {
      throw new Error('Failed to load publications');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading publications:', error);
    return [];
  }
}