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

const Inspector: React.FC<InspectorProps> = ({ isOpen, publication, onClose }) => {
  const { user, toggleFavorite, savePublication, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [confidenceScore, setConfidenceScore] = useState(0.85);

  if (!publication) return null;

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Inspector Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl glass-dark border-l border-slate-700/50 z-50 overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-white mb-2 leading-tight">
                    {publication.title}
                  </h2>
                  <p className="text-slate-400 text-sm">
                    {authorNames} • {publication.year}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="ml-4 p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={handleFavorite}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isFavorited 
                      ? 'bg-yellow-500/20 text-yellow-400' 
                      : 'bg-slate-700/50 text-slate-400 hover:text-yellow-400 hover:bg-yellow-500/10'
                  }`}
                >
                  <Star className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                  <span className="text-sm">{isFavorited ? 'Starred' : 'Star'}</span>
                </button>

                <button
                  onClick={handleSave}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isSaved 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'bg-slate-700/50 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  <span className="text-sm">{isSaved ? 'Saved' : 'Save'}</span>
                </button>

                {publication.pdfUrl && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all duration-200"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Download</span>
                  </button>
                )}

                <button
                  onClick={handleViewFull}
                  className="flex items-center gap-2 px-3 py-2 bg-cosmic-500/20 text-cosmic-400 hover:bg-cosmic-500/30 rounded-lg transition-all duration-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm">Full View</span>
                </button>
              </div>

              {/* Metadata */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-slate-300 mb-1">Organism</h3>
                    <span className="px-2 py-1 bg-bio-500/20 text-bio-300 rounded text-sm">
                      {publication.organism}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-300 mb-1">Assay Type</h3>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-sm">
                      {publication.assay}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-300 mb-1">Mission</h3>
                    <span className="px-2 py-1 bg-cosmic-500/20 text-cosmic-300 rounded text-sm">
                      {publication.mission}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-300 mb-1">Source</h3>
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-sm">
                      {publication.source}
                    </span>
                  </div>
                </div>

                {/* Publication Details */}
                <div className="space-y-2 text-sm">
                  {publication.doi && (
                    <div>
                      <span className="text-slate-400">DOI: </span>
                      <a 
                        href={`https://doi.org/${publication.doi}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-cosmic-400 hover:text-cosmic-300 transition-colors"
                      >
                        {publication.doi}
                      </a>
                    </div>
                  )}
                  {publication.pmid && (
                    <div>
                      <span className="text-slate-400">PMID: </span>
                      <span className="text-white font-mono">{publication.pmid}</span>
                    </div>
                  )}
                  {publication.pmc && (
                    <div>
                      <span className="text-slate-400">PMC: </span>
                      <span className="text-white font-mono">{publication.pmc}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400">Published: </span>
                    <span className="text-white">{publication.publisher} • {publication.year}</span>
                  </div>
                </div>
              </div>

              {/* Abstract */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-300 mb-2">Abstract</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {publication.abstract}
                </p>
              </div>

              {/* Confidence Score */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="w-4 h-4 text-cosmic-400" />
                  <h3 className="text-sm font-medium text-slate-300">Relevance Confidence</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Match Score</span>
                    <span className="text-white font-mono">{(confidenceScore * 100).toFixed(1)}%</span>
                  </div>
                  <div className="relative">
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cosmic-500 to-bio-400 rounded-full transition-all duration-300"
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
                  <h3 className="text-sm font-medium text-slate-300 mb-2">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {publication.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Knowledge Graph Preview */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-300 mb-3">Related Concepts</h3>
                <div className="relative h-32 glass rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-slate-400">
                      <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
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