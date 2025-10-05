import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Download, Star, Bookmark, BarChart3 } from 'lucide-react';
import { type Publication } from '../lib/searchEngine';
import { useAuth } from '../lib/auth';
import { useNavigate } from 'react-router-dom';

interface InspectorProps {
  isOpen: boolean;
  publication: Publication | null;
  onClose: () => void;
}

const PANEL_EASE = [0.22, 1, 0.36, 1] as const;
const backdropVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};
const panelVariants = {
  hidden: { x: 40, opacity: 0, filter: 'blur(6px)' },
  show: { x: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: 0.45, ease: PANEL_EASE } },
  exit: { x: 32, opacity: 0, filter: 'blur(6px)', transition: { duration: 0.3, ease: PANEL_EASE } }
};

const Inspector: React.FC<InspectorProps> = ({ isOpen, publication, onClose }) => {
  const { user, openAuthModal, toggleSave, toggleFavorite, savedIds, favoriteIds } = useAuth();
  const navigate = useNavigate();
  const [confidenceScore, setConfidenceScore] = useState(0.85);

  if (!publication) return null;

  const isFavorited = favoriteIds?.includes(publication.id);
  const isSaved = savedIds?.includes(publication.id);

  const handleFavorite = async () => {
    if (!user) {
      openAuthModal();
      return;
    }
    await toggleFavorite(publication.id);
  };

  const handleSave = async () => {
    if (!user) {
      openAuthModal();
      return;
    }
    await toggleSave(publication.id);
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

  const handleViewFull = () => {
    navigate(`/publication/${publication.id}`);
    onClose();
  };

  const authorNames = publication.authors.map(author => 
    `${author.givenNames} ${author.surname}`
  ).join(', ');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-[color:var(--color-surface-0)]/20 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={onClose}
          />

          {/* Inspector Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-2xl overflow-y-auto
            bg-gradient-to-b from-semantic-surface-1/90 via-semantic-surface-1/80 to-semantic-surface-2/90
            backdrop-blur-xl border-l border-semantic-border-muted shadow-[0_0_0_1px_var(--color-border-muted),0_8px_40px_-10px_rgba(0,0,0,0.55)]"
            variants={panelVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-semantic-text-primary mb-2 leading-tight tracking-wide">
                    {publication.title}
                  </h2>
                  <p className="text-semantic-text-secondary text-sm">
                    {authorNames} • <span className="text-semantic-text-dim">{publication.year}</span>
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="ml-4 p-2 rounded-lg text-semantic-text-secondary hover:text-semantic-text-primary bg-semantic-surface-2/40 hover:bg-semantic-surface-2/70 border border-transparent hover:border-semantic-border-accent transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={handleFavorite}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border
                    ${isFavorited
                      ? 'bg-accent/20 border-semantic-border-accent text-semantic-text-primary'
                      : 'bg-semantic-surface-2/40 border-semantic-border-muted text-semantic-text-secondary hover:text-semantic-text-primary hover:border-semantic-border-accent hover:bg-semantic-surface-2/70'}`}
                >
                  <Star className={`w-4 h-4 ${isFavorited ? 'fill-accent text-accent' : ''}`} />
                  <span>{isFavorited ? 'Starred' : 'Star'}</span>
                </button>

                <button
                  onClick={handleSave}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border
                    ${isSaved
                      ? 'bg-accent-alt/20 border-semantic-border-accent text-semantic-text-primary'
                      : 'bg-semantic-surface-2/40 border-semantic-border-muted text-semantic-text-secondary hover:text-semantic-text-primary hover:border-semantic-border-accent hover:bg-semantic-surface-2/70'}`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-accent-alt text-accent-alt' : ''}`} />
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>

                {publication.pdfUrl && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border bg-semantic-surface-2/40 border-semantic-border-muted text-semantic-text-secondary hover:text-success hover:border-semantic-border-accent hover:bg-semantic-surface-2/70"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                )}

                <button
                  onClick={handleViewFull}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border
                  bg-accent/20 border-semantic-border-accent text-semantic-text-primary hover:bg-accent/30"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Full View</span>
                </button>
              </div>

              {/* Metadata */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-semantic-text-secondary mb-1 tracking-wide">Organism</h3>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-semantic-surface-2/60 border border-semantic-border-muted text-semantic-text-secondary">
                      {publication.organism}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-semantic-text-secondary mb-1 tracking-wide">Assay Type</h3>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-semantic-surface-2/60 border border-semantic-border-muted text-semantic-text-secondary">
                      {publication.assay}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-semantic-text-secondary mb-1 tracking-wide">Mission</h3>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-semantic-surface-2/60 border border-semantic-border-muted text-semantic-text-secondary">
                      {publication.mission}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-semantic-text-secondary mb-1 tracking-wide">Source</h3>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-semantic-surface-2/60 border border-semantic-border-muted text-semantic-text-secondary">
                      {publication.source}
                    </span>
                  </div>
                </div>

                {/* Publication Details */}
                <div className="space-y-2 text-sm">
                  {publication.doi && (
                    <div>
                      <span className="text-semantic-text-dim">DOI: </span>
                      <a 
                        href={`https://doi.org/${publication.doi}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-accent hover:text-accent-alt transition-colors"
                      >
                        {publication.doi}
                      </a>
                    </div>
                  )}
                  {publication.pmid && (
                    <div>
                      <span className="text-semantic-text-dim">PMID: </span>
                      <span className="text-semantic-text-primary font-mono">{publication.pmid}</span>
                    </div>
                  )}
                  {publication.pmc && (
                    <div>
                      <span className="text-semantic-text-dim">PMC: </span>
                      <span className="text-semantic-text-primary font-mono">{publication.pmc}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-semantic-text-dim">Published: </span>
                    <span className="text-semantic-text-primary">{publication.publisher} • {publication.year}</span>
                  </div>
                </div>
              </div>

              {/* Abstract */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-semantic-text-secondary mb-2 tracking-wide">Abstract</h3>
                <p className="text-semantic-text-secondary text-sm leading-relaxed">
                  {publication.abstract}
                </p>
              </div>

              {/* Confidence Score */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="w-4 h-4 text-accent" />
                  <h3 className="text-sm font-semibold text-semantic-text-secondary tracking-wide">Relevance Confidence</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-semantic-text-dim">Match Score</span>
                    <span className="text-semantic-text-primary font-mono">{(confidenceScore * 100).toFixed(1)}%</span>
                  </div>
                  <div className="relative">
                    <div className="w-full h-2 rounded-full overflow-hidden bg-semantic-surface-2/60 border border-semantic-border-muted">
                      <div 
                        className="h-full bg-gradient-to-r from-accent to-accent-alt rounded-full transition-all duration-300"
                        style={{ width: `${confidenceScore * 100}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={confidenceScore}
                      onChange={(e) => setConfidenceScore(parseFloat(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Keywords */}
              {publication.keywords && publication.keywords.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-semantic-text-secondary mb-2 tracking-wide">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {publication.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded text-[11px] font-medium bg-semantic-surface-2/50 text-semantic-text-secondary border border-semantic-border-muted hover:border-semantic-border-accent/60 transition-colors"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Knowledge Graph Preview */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-semantic-text-secondary mb-3 tracking-wide">Related Concepts</h3>
                <div className="relative h-32 rounded-lg overflow-hidden border border-semantic-border-muted bg-semantic-surface-1/70 backdrop-blur-sm">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-semantic-text-dim">
                      <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50 text-accent" />
                      <p className="text-xs">Knowledge graph visualization</p>
                      <p className="text-xs opacity-75">Coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Inspector;