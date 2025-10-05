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
  const { user, openAuthModal, toggleSave, toggleFavorite, savedIds, favoriteIds } = useAuth();
  const navigate = useNavigate();

  const isFavorited = favoriteIds?.includes(publication.id);
  const isSaved = savedIds?.includes(publication.id);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      openAuthModal();
      return;
    }
    await toggleFavorite(publication.id);
  };
  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      openAuthModal();
      return;
    }
    await toggleSave(publication.id);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    } else {
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
    <motion.article
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
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
      className={`group relative cursor-pointer transform transition-all duration-500 hover:scale-[1.03] hover:-rotate-[0.5deg] 
        ${viewMode === 'list' ? 'flex gap-6 items-start' : ''}
        ${isSelected ? 'z-20' : 'z-10'}
        focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-400/60 rounded-3xl`}
    >
      <div className={`rounded-3xl border shadow-2xl duration-700 relative backdrop-blur-xl overflow-hidden w-full bg-semantic-surface-1/95
        ${isSelected ? 'border-semantic-border-accent shadow-[0_0_0_1px_var(--color-border-accent),0_8px_28px_-8px_rgba(0,0,0,0.45)]' : 'border-semantic-border-muted hover:border-semantic-border-accent/60'}
      `}>
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-cosmic-400/10 via-bio-400/5 to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
          <div style={{animationDelay: '0.4s'}} className="absolute -bottom-24 -left-24 w-56 h-56 rounded-full bg-gradient-to-tr from-bio-400/20 to-transparent blur-3xl opacity-20 group-hover:opacity-40 transform group-hover:scale-110 transition-all duration-700" />
            <div className="absolute top-10 left-10 w-16 h-16 rounded-full bg-cosmic-400/15 blur-xl animate-pulse" />
            <div style={{animationDelay: '0.8s'}} className="absolute bottom-16 right-16 w-14 h-14 rounded-full bg-bio-400/15 blur-lg animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cosmic-400/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-220%] transition-transform duration-[1600ms]" />
        </div>

        <div className={`relative z-10 p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="relative mb-2">
                <h3 className="text-lg font-semibold line-clamp-2 group-hover:tracking-wide transition-all duration-500 text-semantic-text-primary">
                  {publication.title}
                </h3>
                <span className="absolute -inset-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-cosmic-400/0 via-cosmic-400/30 to-bio-400/0 blur" />
              </div>
              <p className="text-semantic-text-secondary text-sm mb-2 group-hover:text-accent transition-colors">
                {authorNames}
              </p>
            </div>
            <div className="text-right text-semantic-text-dim text-xs ml-4 space-y-1">
              <div className="font-mono tracking-tight text-accent group-hover:text-accent-alt transition-colors">{publication.pmc || publication.pmid || publication.id}</div>
              <div className="text-semantic-text-secondary group-hover:text-accent-secondary transition-colors">{publication.year}</div>
            </div>
          </div>

          <p className="text-semantic-text-secondary text-sm mb-4 line-clamp-3 group-hover:text-semantic-text-primary transition-colors">
            {publication.abstract}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {[publication.organism, publication.assay, publication.mission, publication.source]
              .filter(Boolean)
              .map((val, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded-full bg-semantic-surface-2/70 text-semantic-text-dim group-hover:text-semantic-text-secondary text-[11px] font-medium tracking-wide border border-semantic-border-muted hover:border-semantic-border-accent transition-colors"
                >
                  {val}
                </span>
              ))}
          </div>

          <div className={`flex ${viewMode === 'list' ? 'flex-col gap-2 items-start' : 'items-center justify-between'}`}>
            <div className="flex gap-2">
              {[{
                icon: <Star className={`w-4 h-4 ${isFavorited ? 'fill-cosmic-300' : ''}`} />, handler: handleFavorite, active: isFavorited, label: 'favorite'
              }, {
                icon: <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-bio-300' : ''}`} />, handler: handleSave, active: isSaved, label: 'save'
              }, {
                icon: <Download className="w-4 h-4" />, handler: handleDownload, disabled: !publication.pdfUrl, label: 'download'
              }, {
                icon: <Eye className="w-4 h-4" />, handler: handleInspect, label: 'inspect'
              }, {
                icon: <ExternalLink className="w-4 h-4" />, handler: handleViewDetails, label: 'details'
              }].map((btn, i) => (
                <motion.button
                  key={i}
                  onClick={btn.handler}
                  disabled={btn.disabled}
                  className={`relative p-2 rounded-xl transition-all duration-300 border border-semantic-border-muted hover:border-semantic-border-accent
                    ${btn.disabled ? 'text-semantic-text-dim cursor-not-allowed' : 'text-semantic-text-secondary hover:text-semantic-text-primary'}
                    ${btn.active ? 'bg-semantic-surface-2/70 text-semantic-text-primary border-semantic-border-accent shadow-inner' : 'bg-semantic-surface-2/30 hover:bg-semantic-surface-2/60'}
                  `}
                  whileHover={!btn.disabled ? { scale: 1.05 } : {}}
                  whileTap={!btn.disabled ? { scale: 0.9 } : {}}
                  title={btn.label}
                  aria-label={btn.label}
                >
                  {btn.icon}
                </motion.button>
              ))}
            </div>
          </div>
          <div className="mt-5 w-1/3 h-0.5 bg-gradient-to-r from-transparent via-cosmic-400/40 to-transparent rounded-full group-hover:w-1/2 group-hover:h-[3px] transition-all duration-700" />
        </div>

  <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-cosmic-400/20 to-transparent rounded-br-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
  <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-bio-400/20 to-transparent rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {isSelected && (
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-2 ring-cosmic-400/40 ring-offset-0 animate-pulse" />
        )}
      </div>
    </motion.article>
  );
};

export default ResultCard;