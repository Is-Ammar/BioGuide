import React from 'react';
import { motion } from 'framer-motion';
import { Star, Bookmark, Download, Eye, ExternalLink } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { type Publication } from '../lib/searchEngine';
import { useNavigate } from 'react-router-dom';

interface ResultCardProps {
  publication: Publication;
  isSelected?: boolean;
  viewMode: 'grid' | 'list';
  onSelect: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ 
  publication, 
  isSelected = false, 
  viewMode,
  onSelect 
}) => {
  const { user, toggleFavorite, savePublication, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const isFavorited = user?.favoritePublications.includes(publication.id) ?? false;
  const isSaved = user?.savedPublications.includes(publication.id) ?? false;

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      openAuthModal();
      return;
    }
    toggleFavorite(publication.id);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      openAuthModal();
      return;
    }
    savePublication(publication.id);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      openAuthModal();
      return;
    }
    
    if (publication.pdfUrl) {
      // Trigger download
      const link = document.createElement('a');
      link.href = publication.pdfUrl;
      link.download = `${publication.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Show tooltip or notification that no PDF is available
      alert('No PDF available for this publication');
    }
  };

  const handleInspect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/publication/${publication.id}`);
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const authorNames = publication.authors
    .slice(0, 3)
    .map(author => `${author.givenNames} ${author.surname}`)
    .join(', ') + (publication.authors.length > 3 ? ' et al.' : '');

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`
        glass-dark rounded-xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] border
        ${isSelected 
          ? 'border-cosmic-400 neon-glow' 
          : 'border-slate-700/50 hover:border-slate-600/50'
        }
        ${viewMode === 'list' ? 'flex gap-6 items-start' : ''}
      `}
      onClick={onSelect}
      role="article"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-label={`Publication: ${publication.title}`}
    >
      {/* Content */}
      <div className={`flex-1 ${viewMode === 'list' ? '' : 'mb-4'}`}>
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 hover:text-cosmic-300 transition-colors">
              {publication.title}
            </h3>
            <p className="text-slate-400 text-sm mb-2">
              {authorNames}
            </p>
          </div>
          <div className="text-right text-slate-400 text-sm ml-4">
            <div className="font-mono">{publication.pmc || publication.pmid || publication.id}</div>
            <div>{publication.year}</div>
          </div>
        </div>

        {/* Abstract */}
        <p className="text-slate-300 text-sm mb-4 line-clamp-3">
          {publication.abstract}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 bg-bio-500/20 text-bio-300 rounded text-xs font-medium">
            {publication.organism}
          </span>
          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-medium">
            {publication.assay}
          </span>
          <span className="px-2 py-1 bg-cosmic-500/20 text-cosmic-300 rounded text-xs font-medium">
            {publication.mission}
          </span>
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs font-medium">
            {publication.source}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className={`flex ${viewMode === 'list' ? 'flex-col gap-2' : 'justify-between items-center'}`}>
        <div className="flex gap-2">
          <motion.button
            onClick={handleFavorite}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isFavorited 
                ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                : 'text-slate-400 hover:text-yellow-400 hover:bg-yellow-500/10'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </motion.button>

          <motion.button
            onClick={handleSave}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isSaved 
                ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
                : 'text-slate-400 hover:text-blue-400 hover:bg-blue-500/10'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={isSaved ? 'Remove from library' : 'Save to library'}
            aria-label={isSaved ? 'Remove from library' : 'Save to library'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </motion.button>

          <motion.button
            onClick={handleDownload}
            className={`p-2 rounded-lg transition-all duration-200 ${
              publication.pdfUrl
                ? 'text-slate-400 hover:text-green-400 hover:bg-green-500/10'
                : 'text-slate-600 cursor-not-allowed'
            }`}
            whileHover={publication.pdfUrl ? { scale: 1.1 } : {}}
            whileTap={publication.pdfUrl ? { scale: 0.9 } : {}}
            disabled={!publication.pdfUrl}
            title={publication.pdfUrl ? 'Download PDF' : 'No PDF available'}
            aria-label={publication.pdfUrl ? 'Download PDF' : 'No PDF available'}
          >
            <Download className="w-4 h-4" />
          </motion.button>

          <motion.button
            onClick={handleInspect}
            className="p-2 rounded-lg text-slate-400 hover:text-cosmic-400 hover:bg-cosmic-500/10 transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Inspect"
            aria-label="Open inspector"
          >
            <Eye className="w-4 h-4" />
          </motion.button>

          <motion.button
            onClick={handleViewDetails}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="View Details"
            aria-label="View publication details"
          >
            <ExternalLink className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultCard;