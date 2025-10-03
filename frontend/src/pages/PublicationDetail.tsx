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
  const [viewMode, setViewMode] = useState<'abstract' | 'pdf'>('abstract');
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    const fetchPublication = async () => {
      try {
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
    } else {
      setViewMode('abstract');
    }
  }, [publication?.pdfUrl]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cosmic-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Loading publication...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!publication) {
    return (
      <div className="min-h-screen bg-slate-950">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Publication Not Found</h1>
            <p className="text-slate-400 mb-6">The requested publication could not be found.</p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cosmic-500 text-white rounded-lg hover:bg-cosmic-600 transition-colors"
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
    <motion.div className="min-h-screen bg-slate-950" variants={pageIntro} initial="hidden" animate="show">
      <Navigation />
      
      <div className="pt-16">
        {/* Header */}
        <div className="glass-dark border-b border-slate-700/50">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <motion.div
              variants={itemFade}
            >
              <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
                {publication.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-slate-300 mb-6">
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isFavorited 
                      ? 'bg-yellow-500/20 text-yellow-400' 
                      : 'bg-slate-700/50 text-slate-400 hover:text-yellow-400 hover:bg-yellow-500/10'
                  }`}
                >
                  <Star className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                  <span>{isFavorited ? 'Starred' : 'Star'}</span>
                </button>

                <button
                  onClick={handleSave}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isSaved 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'bg-slate-700/50 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>

                {publication.pdfUrl && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all duration-200"
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
                    className="flex items-center gap-2 px-4 py-2 bg-cosmic-500/20 text-cosmic-400 hover:bg-cosmic-500/30 rounded-lg transition-all duration-200"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Source</span>
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
                {(publication.abstract || publication.pdfUrl) && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {publication.pdfUrl && (
                      <button
                        onClick={() => setViewMode('pdf')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${viewMode === 'pdf' ? 'bg-cosmic-500/20 border-cosmic-500 text-cosmic-300' : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-700/60'}`}
                      >
                        PDF
                      </button>
                    )}
                    {publication.abstract && (
                      <button
                        onClick={() => setViewMode('abstract')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${viewMode === 'abstract' ? 'bg-cosmic-500/20 border-cosmic-500 text-cosmic-300' : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-700/60'}`}
                      >
                        Abstract
                      </button>
                    )}
                  </div>
                )}

                {viewMode === 'abstract' && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Abstract</h2>
                    <p className="text-slate-300 leading-relaxed">{publication.abstract}</p>
                  </div>
                )}

                {viewMode === 'pdf' && publication.pdfUrl && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Full Text PDF</h2>
                    <div className="relative w-full h-[75vh] rounded-xl overflow-hidden border border-slate-700/60 bg-gradient-to-b from-slate-900/80 to-slate-900/40 backdrop-blur-sm">
                      {!pdfLoaded && !pdfError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                          <div className="w-12 h-12 border-4 border-cosmic-400/40 border-t-transparent rounded-full animate-spin" />
                          <p className="text-xs tracking-wide text-slate-400">Loading PDF…</p>
                        </div>
                      )}
                      {pdfError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center gap-3">
                          <p className="text-sm text-slate-300">This PDF cannot be embedded (provider blocks framing).</p>
                          <a
                            href={publication.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cosmic-500/20 text-cosmic-300 hover:bg-cosmic-500/30 transition-colors text-sm"
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
                      <div className="absolute top-0 inset-x-0 h-10 bg-slate-950/60 backdrop-blur-md flex items-center justify-between px-3 border-b border-slate-700/60">
                        <span className="text-xs font-medium tracking-wide text-slate-300">Embedded PDF Viewer</span>
                        <div className="flex items-center gap-2">
                          <a
                            href={publication.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-3 py-1 rounded-md bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 transition-colors"
                          >
                            Open Tab
                          </a>
                          <button
                            onClick={handleDownload}
                            className="text-xs px-3 py-1 rounded-md bg-cosmic-500/20 hover:bg-cosmic-500/30 text-cosmic-300 transition-colors"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500 leading-snug">If the PDF does not display, it may be restricted from embedding. Use the Open Tab button above.</p>
                  </div>
                )}
              </motion.section>

              {/* Keywords */}
              {publication.keywords && publication.keywords.length > 0 && (
                <motion.section variants={itemFade}>
                  <h2 className="text-xl font-semibold text-white mb-4">Keywords</h2>
                  <div className="flex flex-wrap gap-2">
                    {publication.keywords.map((keyword, index) => (
                      <motion.span
                        key={index}
                        className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-lg text-sm hover:bg-slate-600/50 transition-colors"
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
                  <h2 className="text-xl font-semibold text-white mb-4">Related Publications</h2>
                  <motion.div className="space-y-4" variants={listStagger} initial="hidden" animate="show">
                    {relatedPublications.map((related) => (
                      <motion.div key={related.id} variants={relatedItem}>
                        <Link
                          to={`/publication/${related.id}`}
                          className="block glass-dark p-4 rounded-lg hover:border-cosmic-400/50 transition-colors duration-300 group border border-transparent"
                        >
                          <h3 className="font-inter text-white mb-2 group-hover:text-cosmic-300 transition-colors line-clamp-2">
                            {related.title}
                          </h3>
                          <p className="text-slate-400 text-sm mb-2">
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
                className="glass-dark p-6 rounded-xl"
                variants={subtlePanel}
                initial="hidden"
                animate="show"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Publication Details</h3>
                <div className="space-y-3 text-sm">
                  {publication.doi && (
                    <div>
                      <span className="text-slate-400 block">DOI</span>
                      <a 
                        href={`https://doi.org/${publication.doi}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-cosmic-400 hover:text-cosmic-300 transition-colors break-all"
                      >
                        {publication.doi}
                      </a>
                    </div>
                  )}
                  
                  {publication.pmid && (
                    <div>
                      <span className="text-slate-400 block">PMID</span>
                      <span className="text-white font-mono">{publication.pmid}</span>
                    </div>
                  )}
                  
                  {publication.pmc && (
                    <div>
                      <span className="text-slate-400 block">PMC</span>
                      <span className="text-white font-mono">{publication.pmc}</span>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-slate-400 block">Published</span>
                    <span className="text-white">{publication.year}</span>
                  </div>
                  
                  {publication.volume && (
                    <div>
                      <span className="text-slate-400 block">Volume</span>
                      <span className="text-white">{publication.volume}</span>
                    </div>
                  )}
                  
                  {publication.issue && (
                    <div>
                      <span className="text-slate-400 block">Issue</span>
                      <span className="text-white">{publication.issue}</span>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-slate-400 block">Publisher</span>
                    <span className="text-white">{publication.publisher}</span>
                  </div>
                  
                  <div>
                    <span className="text-slate-400 block">License</span>
                    <span className="text-white">{publication.license}</span>
                  </div>
                </div>
              </motion.div>

              {/* Research Context */}
              <motion.div
                className="glass-dark p-6 rounded-xl"
                variants={subtlePanel}
                initial="hidden"
                animate="show"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Research Context</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FlaskConical className="w-4 h-4 text-bio-400" />
                      <span className="text-slate-400 text-sm font-inter">Organism</span>
                    </div>
                    <span className="text-white">{publication.organism}</span>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FlaskConical className="w-4 h-4 text-purple-400" />
                      <span className="text-slate-400 text-sm font-inter">Assay Type</span>
                    </div>
                    <span className="text-white">{publication.assay}</span>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FlaskConical className="w-4 h-4 text-cosmic-400" />
                      <span className="text-slate-400 text-sm font-inter">Mission</span>
                    </div>
                    <span className="text-white">{publication.mission}</span>
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