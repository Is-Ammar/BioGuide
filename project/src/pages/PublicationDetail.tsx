import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Download, Star, Bookmark, Calendar, Users, Building2, FlaskConical } from 'lucide-react';
import Navigation from '../components/Navigation';
import { loadPublications, type Publication } from '../lib/searchEngine';
import { useAuth } from '../lib/auth';

const PublicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, toggleFavorite, savePublication, openAuthModal } = useAuth();
  const [publication, setPublication] = useState<Publication | null>(null);
  const [relatedPublications, setRelatedPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const publications = await loadPublications();
        const found = publications.find(pub => pub.id === id);
        
        if (found) {
          setPublication(found);
          
          // Find related publications based on shared facets
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

  const isFavorited = user?.favoritePublications.includes(publication.id) ?? false;
  const isSaved = user?.savedPublications.includes(publication.id) ?? false;

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
    savePublication(publication.id);
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
    <div className="min-h-screen bg-slate-950">
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Abstract */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h2 className="text-xl font-semibold text-white mb-4">Abstract</h2>
                <p className="text-slate-300 leading-relaxed">
                  {publication.abstract}
                </p>
              </motion.section>

              {/* Keywords */}
              {publication.keywords && publication.keywords.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h2 className="text-xl font-semibold text-white mb-4">Keywords</h2>
                  <div className="flex flex-wrap gap-2">
                    {publication.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-lg text-sm hover:bg-slate-600/50 transition-colors"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Related Publications */}
              {relatedPublications.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h2 className="text-xl font-semibold text-white mb-4">Related Publications</h2>
                  <div className="space-y-4">
                    {relatedPublications.map((related) => (
                      <Link
                        key={related.id}
                        to={`/publication/${related.id}`}
                        className="block glass-dark p-4 rounded-lg hover:border-cosmic-400/50 transition-all duration-200 group"
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
                    ))}
                  </div>
                </motion.section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publication Details */}
              <motion.div
                className="glass-dark p-6 rounded-xl"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
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
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicationDetail;