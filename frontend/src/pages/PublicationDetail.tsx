import  { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Download, Star, Bookmark, Calendar, Users, Building2, FlaskConical } from 'lucide-react';
import Navigation from '../components/Navigation';
import { loadPublications, type Publication } from '../lib/searchEngine';
import { useAuth } from '../lib/auth';

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const pageIntro = {
  hidden: { opacity: 0, filter: 'blur(10px)' },
  show: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.55, ease: EASE_OUT, when: 'beforeChildren', staggerChildren: 0.07 } }
};
const itemFade = {
  hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: EASE_OUT } }
};

const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.06 } }
};

const listStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
};

const relatedItem = {
  hidden: { opacity: 0, y: 14, scale: 0.995 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: EASE_OUT } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.3, ease: 'easeIn' } }
};

const subtlePanel = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } }
};

const PublicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, toggleFavorite, toggleSave, openAuthModal, favoriteIds, savedIds } = useAuth() as any;
  const [publication, setPublication] = useState<Publication | null>(null);
  const [relatedPublications, setRelatedPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'full' | 'abstract' | 'pdf'>('abstract');
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const singleResp = await fetch(`http://localhost:3000/api/publications/${id}`);
        if (singleResp.ok) {
          const pData = await singleResp.json(); // { publication }
          if (pData?.publication) {
            const p = pData.publication;
            const mapped: Publication = {
              id: p.id,
              title: p.title || '',
              authors: (p.authors || []).map((full: string) => {
                const parts = full.split(' ');
                return { givenNames: parts.slice(0, -1).join(' ') || '', surname: parts.slice(-1)[0] || '' };
              }),
              year: Number(p.year) || 0,
              abstract: p.abstract || '',
              fullText: p.fullText || p.full_text || '',
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
            };
            setPublication(mapped);
            if (Array.isArray(p.related) && p.related.length) {
              // Fetch related publications batch
              const relResp = await fetch('http://localhost:3000/api/publications');
              if (relResp.ok) {
                const relData = await relResp.json();
                if (Array.isArray(relData.publications)) {
                  const relMapped: Publication[] = relData.publications.filter((r: any) => p.related.includes(r.id)).slice(0,3).map((r: any) => ({
                    id: r.id,
                    title: r.title || '',
                    authors: (r.authors || []).map((full: string) => {
                      const parts = full.split(' ');
                      return { givenNames: parts.slice(0, -1).join(' ') || '', surname: parts.slice(-1)[0] || '' };
                    }),
                    year: Number(r.year) || 0,
                    abstract: r.abstract || '',
                    fullText: r.fullText || r.full_text || '',
                    mission: '',
                    organism: '',
                    assay: '',
                    source: r.journal || r.file || 'Unknown',
                    license: '',
                    url: '',
                    publisher: r.journal || 'Unknown',
                    keywords: [],
                    volume: undefined,
                    issue: undefined,
                    pmc: r.id,
                    pmid: undefined,
                    doi: undefined,
                    pdfUrl: null
                  }));
                  setRelatedPublications(relMapped);
                }
              }
              setIsLoading(false);
              return;
            }
          }
        }
        // Fallback existing logic
        const publications = await loadPublications();
        const found = publications.find(pub => pub.id === id);
        if (found) {
          setPublication(found);
          const related = publications
            .filter(pub => 
              pub.id !== found.id && (
                pub.organism === found.organism ||
                pub.assay === found.assay ||
                pub.mission === found.mission
              )
            )
            .slice(0, 3);
          setRelatedPublications(related);
        }
      } catch (error) {
        console.error('Failed to load publication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPublication();
    }
  }, [id]);

  useEffect(() => {
    if (publication?.pdfUrl) {
      setViewMode('pdf');
    } else if (publication?.fullText) {
      setViewMode('full');
    } else {
      setViewMode('abstract');
    }
  }, [publication?.pdfUrl]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-semantic-surface-0">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-semantic-text-secondary">Loading publication...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!publication) {
    return (
      <div className="min-h-screen bg-semantic-surface-0">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-semantic-text-primary mb-4">Publication Not Found</h1>
            <p className="text-semantic-text-secondary mb-6">The requested publication could not be found.</p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-white hover:bg-accent-alt transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isFavorited = !!favoriteIds?.includes(publication.id);
  const isSaved = !!savedIds?.includes(publication.id);
  // Build PMC URL if we can infer a PMC identifier
  const pmcBaseId = (publication.pmc || publication.id || '').toString();
  const pmcUrl = pmcBaseId ? `https://www.ncbi.nlm.nih.gov/pmc/articles/${pmcBaseId.startsWith('PMC') ? pmcBaseId : 'PMC' + pmcBaseId}/` : null;

  const handleFavorite = () => {
    if (!user) {
      openAuthModal();
      return;
    }
    toggleFavorite(publication.id);
  };

  const handleSave = () => {
    if (!user) {
      openAuthModal();
      return;
    }
    toggleSave(publication.id);
  };

  const handleDownload = () => {
    if (!user) {
      openAuthModal();
      return;
    }
    
    if (publication.pdfUrl) {
      const link = document.createElement('a');
      link.href = publication.pdfUrl;
      link.download = `${publication.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const authorNames = publication.authors.map(author => 
    `${author.givenNames} ${author.surname}`
  ).join(', ');

  return (
    <motion.div className="min-h-screen bg-semantic-surface-0" variants={pageIntro} initial="hidden" animate="show">
      <Navigation />
      
      <div className="pt-16">
        {/* Header */}
  <div className="border-b border-semantic-border-muted bg-semantic-surface-1/70 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-semantic-text-secondary hover:text-semantic-text-primary transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <motion.div
              variants={itemFade}
            >
              <h1 className="text-3xl font-bold text-semantic-text-primary mb-4 leading-tight">
                {publication.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-semantic-text-secondary mb-6">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{authorNames}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{publication.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>{publication.publisher}</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-bio-500/20 text-bio-300 rounded-lg text-sm font-inter">
                  {publication.organism}
                </span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm font-inter">
                  {publication.assay}
                </span>
                <span className="px-3 py-1 bg-cosmic-500/20 text-cosmic-300 rounded-lg text-sm font-inter">
                  {publication.mission}
                </span>
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-lg text-sm font-inter">
                  {publication.source}
                </span>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleFavorite}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 border ${
                    isFavorited 
                      ? 'bg-yellow-400/15 text-yellow-600 border-yellow-400/40 dark:text-yellow-300 dark:border-yellow-400/30' 
                      : 'bg-semantic-surface-2/60 text-semantic-text-secondary border-semantic-border-muted hover:border-yellow-400/50 hover:text-yellow-600 dark:hover:text-yellow-300 hover:bg-yellow-400/10'
                  }`}
                >
                  <Star className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                  <span>{isFavorited ? 'Starred' : 'Star'}</span>
                </button>

                <button
                  onClick={handleSave}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 border ${
                    isSaved 
                      ? 'bg-blue-400/15 text-blue-600 border-blue-400/40 dark:text-blue-300 dark:border-blue-400/30' 
                      : 'bg-semantic-surface-2/60 text-semantic-text-secondary border-semantic-border-muted hover:border-blue-400/50 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-400/10'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>

                {publication.pdfUrl && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 bg-semantic-surface-2/60 text-semantic-text-secondary border border-semantic-border-muted hover:text-green-600 dark:hover:text-green-300 hover:border-green-400/50 hover:bg-green-400/10"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                )}

                {publication.url && (
                  <a
                    href={publication.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 bg-cosmic-500/15 text-cosmic-600 dark:text-cosmic-300 hover:bg-cosmic-500/25 border border-cosmic-500/30"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Source</span>
                  </a>
                )}
                {pmcUrl && (
                  <a
                    href={pmcUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 bg-purple-500/15 text-purple-700 dark:text-purple-300 hover:bg-purple-500/25 border border-purple-500/30"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Source</span>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-8" variants={staggerParent} initial="hidden" animate="show">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Abstract + PDF (Tabbed) */}
              <motion.section variants={itemFade}>
                            {(publication.fullText || publication.abstract || publication.pdfUrl) && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {publication.pdfUrl && (
                      <button
                        onClick={() => setViewMode('pdf')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${viewMode === 'pdf' ? 'bg-cosmic-500/20 border-cosmic-500 text-cosmic-600 dark:text-cosmic-300' : 'bg-semantic-surface-2/70 border-semantic-border-muted text-semantic-text-secondary hover:bg-semantic-surface-2/90'}`}
                      >
                        PDF
                      </button>
                    )}
                    {publication.fullText && (
                      <button
                        onClick={() => setViewMode('full')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${viewMode === 'full' ? 'bg-cosmic-500/20 border-cosmic-500 text-cosmic-600 dark:text-cosmic-300' : 'bg-semantic-surface-2/70 border-semantic-border-muted text-semantic-text-secondary hover:bg-semantic-surface-2/90'}`}
                      >
                        Full Text
                      </button>
                    )}
                    {publication.abstract && (
                      <button
                        onClick={() => setViewMode('abstract')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${viewMode === 'abstract' ? 'bg-cosmic-500/20 border-cosmic-500 text-cosmic-600 dark:text-cosmic-300' : 'bg-semantic-surface-2/70 border-semantic-border-muted text-semantic-text-secondary hover:bg-semantic-surface-2/90'}`}
                      >
                        Abstract
                      </button>
                    )}
                  </div>
                )}

                {viewMode === 'full' && publication.fullText && (
                  <div>
                    <h2 className="text-xl font-semibold text-semantic-text-primary mb-4">Full Text</h2>
                    <div className="prose max-w-none text-semantic-text-secondary dark:prose-invert whitespace-pre-wrap leading-relaxed">
                      {publication.fullText}
                    </div>
                  </div>
                )}

                {viewMode === 'abstract' && publication.abstract && (
                  <div>
                    <h2 className="text-xl font-semibold text-semantic-text-primary mb-4">Abstract</h2>
                    <p className="text-semantic-text-secondary leading-relaxed">{publication.abstract}</p>
                  </div>
                )}

                {viewMode === 'pdf' && publication.pdfUrl && (
                  <div>
                    <h2 className="text-xl font-semibold text-semantic-text-primary mb-4">Full Text PDF</h2>
                    <div className="relative w-full h-[75vh] rounded-xl overflow-hidden border border-semantic-border-muted bg-gradient-to-b from-semantic-surface-1/90 to-semantic-surface-1/40 backdrop-blur-sm">
                      {!pdfLoaded && !pdfError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                          <div className="w-12 h-12 border-4 border-cosmic-400/40 border-t-transparent rounded-full animate-spin" />
                          <p className="text-xs tracking-wide text-semantic-text-secondary">Loading PDF…</p>
                        </div>
                      )}
                      {pdfError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center gap-3">
                          <p className="text-sm text-semantic-text-secondary">This PDF cannot be embedded (provider blocks framing).</p>
                          <a
                            href={publication.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cosmic-500/20 text-cosmic-600 dark:text-cosmic-300 hover:bg-cosmic-500/30 transition-colors text-sm"
                          >
                            Open in new tab
                          </a>
                        </div>
                      )}
                      {!pdfError && (
                        <iframe
                          title={`PDF ${publication.id}`}
                          src={`${publication.pdfUrl}${publication.pdfUrl.includes('#') ? '' : '#view=FitH'}`}
                          className={`w-full h-full transition-opacity duration-500 ${pdfLoaded ? 'opacity-100' : 'opacity-0'}`}
                          onLoad={() => setPdfLoaded(true)}
                          onError={() => setPdfError(true)}
                        />
                      )}
                      {/* Top overlay bar */}
                      <div className="absolute top-0 inset-x-0 h-10 bg-semantic-surface-1/80 backdrop-blur-md flex items-center justify-between px-3 border-b border-semantic-border-muted">
                        <span className="text-xs font-medium tracking-wide text-semantic-text-secondary">Embedded PDF Viewer</span>
                        <div className="flex items-center gap-2">
                          <a
                            href={publication.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-3 py-1 rounded-md bg-semantic-surface-2/80 hover:bg-semantic-surface-2/90 text-semantic-text-secondary hover:text-semantic-text-primary border border-semantic-border-muted transition-colors"
                          >
                            Open Tab
                          </a>
                          <button
                            onClick={handleDownload}
                            className="text-xs px-3 py-1 rounded-md bg-cosmic-500/20 hover:bg-cosmic-500/30 text-cosmic-600 dark:text-cosmic-300 transition-colors"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-[11px] text-semantic-text-dim leading-snug">If the PDF does not display, it may be restricted from embedding. Use the Open Tab button above.</p>
                  </div>
                )}
              </motion.section>

              {/* Keywords */}
              {publication.keywords && publication.keywords.length > 0 && (
                <motion.section variants={itemFade}>
                  <h2 className="text-xl font-semibold text-semantic-text-primary mb-4">Keywords</h2>
                  <div className="flex flex-wrap gap-2">
                    {publication.keywords.map((keyword, index) => (
                      <motion.span
                        key={index}
                        className="px-3 py-1 rounded-lg text-sm transition-colors bg-semantic-surface-2/60 text-semantic-text-secondary hover:bg-semantic-surface-2/80 border border-semantic-border-muted"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut', delay: 0.03 * index } }}
                      >
                        {keyword}
                      </motion.span>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Related Publications */}
              {relatedPublications.length > 0 && (
                <motion.section variants={itemFade}>
                  <h2 className="text-xl font-semibold text-semantic-text-primary mb-4">Related Publications</h2>
                  <motion.div className="space-y-4" variants={listStagger} initial="hidden" animate="show">
                    {relatedPublications.map((related) => (
                      <motion.div key={related.id} variants={relatedItem}>
                        <Link
                          to={`/publication/${related.id}`}
                          className="block glass-dark p-4 rounded-lg hover:border-cosmic-400/50 transition-colors duration-300 group border border-transparent"
                        >
                          <h3 className="font-inter text-semantic-text-primary mb-2 group-hover:text-cosmic-600 dark:group-hover:text-cosmic-300 transition-colors line-clamp-2">
                            {related.title}
                          </h3>
                          <p className="text-semantic-text-secondary text-sm mb-2">
                            {related.authors.slice(0, 2).map(author => 
                              `${author.givenNames} ${author.surname}`
                            ).join(', ')} • {related.year}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-bio-500/20 text-bio-300 rounded text-xs">
                              {related.organism}
                            </span>
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                              {related.assay}
                            </span>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publication Details */}
              <motion.div
                className="p-6 rounded-xl border border-semantic-border-muted bg-semantic-surface-1/70 backdrop-blur-sm shadow-sm"
                variants={subtlePanel}
                initial="hidden"
                animate="show"
              >
                <h3 className="text-lg font-semibold text-semantic-text-primary mb-4">Publication Details</h3>
                <div className="space-y-3 text-sm">
                  {publication.doi && (
                    <div>
                      <span className="text-semantic-text-dim block uppercase tracking-wide text-[11px] font-medium">DOI</span>
                      <a 
                        href={`https://doi.org/${publication.doi}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-cosmic-600 dark:text-cosmic-300 hover:text-cosmic-500 dark:hover:text-cosmic-200 transition-colors break-all font-mono text-[13px]"
                      >
                        {publication.doi}
                      </a>
                    </div>
                  )}
                  
                  {publication.pmid && (
                    <div>
                      <span className="text-semantic-text-dim block uppercase tracking-wide text-[11px] font-medium">PMID</span>
                      <span className="text-semantic-text-secondary font-mono text-[13px]">{publication.pmid}</span>
                    </div>
                  )}
                  
                  {publication.pmc && (
                    <div>
                      <span className="text-semantic-text-dim block uppercase tracking-wide text-[11px] font-medium">PMC</span>
                      <span className="text-semantic-text-secondary font-mono text-[13px]">{publication.pmc}</span>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-semantic-text-dim block uppercase tracking-wide text-[11px] font-medium">Published</span>
                    <span className="text-semantic-text-secondary">{publication.year}</span>
                  </div>
                  
                  {publication.volume && (
                    <div>
                      <span className="text-semantic-text-dim block uppercase tracking-wide text-[11px] font-medium">Volume</span>
                      <span className="text-semantic-text-secondary">{publication.volume}</span>
                    </div>
                  )}
                  
                  {publication.issue && (
                    <div>
                      <span className="text-semantic-text-dim block uppercase tracking-wide text-[11px] font-medium">Issue</span>
                      <span className="text-semantic-text-secondary">{publication.issue}</span>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-semantic-text-dim block uppercase tracking-wide text-[11px] font-medium">Publisher</span>
                    <span className="text-semantic-text-secondary">{publication.publisher}</span>
                  </div>
                  
                  <div>
                    <span className="text-semantic-text-dim block uppercase tracking-wide text-[11px] font-medium">License</span>
                    <span className="text-semantic-text-secondary">{publication.license || '—'}</span>
                  </div>
                </div>
              </motion.div>

              {/* Research Context */}
              <motion.div
                className="p-6 rounded-xl border border-semantic-border-muted bg-semantic-surface-1/70 backdrop-blur-sm shadow-sm"
                variants={subtlePanel}
                initial="hidden"
                animate="show"
              >
                <h3 className="text-lg font-semibold text-semantic-text-primary mb-4">Research Context</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FlaskConical className="w-4 h-4 text-bio-400" />
                      <span className="text-semantic-text-dim text-sm font-inter">Organism</span>
                    </div>
                    <span className="text-semantic-text-secondary">{publication.organism || '—'}</span>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FlaskConical className="w-4 h-4 text-purple-400" />
                      <span className="text-semantic-text-dim text-sm font-inter">Assay Type</span>
                    </div>
                    <span className="text-semantic-text-secondary">{publication.assay || '—'}</span>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FlaskConical className="w-4 h-4 text-cosmic-400" />
                      <span className="text-semantic-text-dim text-sm font-inter">Mission</span>
                    </div>
                    <span className="text-semantic-text-secondary">{publication.mission || '—'}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PublicationDetail;