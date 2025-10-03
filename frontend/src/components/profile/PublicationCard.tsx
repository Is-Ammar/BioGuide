import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { Publication } from '../../lib/searchEngine';

interface PublicationCardProps {
  publication: Publication;
  onRemove?: (id: string) => void;
  layoutIdPrefix?: string;
  index: number;
}

const tagColors: Record<string, string> = {
  organism: 'bg-bio-500/15 text-bio-300 border border-bio-400/30',
  assay: 'bg-purple-500/15 text-purple-300 border border-purple-400/30',
  mission: 'bg-cosmic-500/15 text-cosmic-300 border border-cosmic-400/30'
};

export const PublicationCard: React.FC<PublicationCardProps> = memo(({ publication, onRemove, layoutIdPrefix = 'pub', index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.45, delay: index * 0.03 }}
      className="group relative rounded-2xl p-6 bg-slate-900/70 backdrop-blur-xl border border-slate-600/60 hover:border-cosmic-400/40 shadow-[0_6px_28px_-8px_rgba(0,0,0,0.55)] hover:shadow-[0_0_0_1px_rgba(56,189,248,0.25),0_10px_40px_-8px_rgba(56,189,248,0.4)] transition"
    >
      <div className="flex justify-between items-start gap-6">
        <div className="flex-1 min-w-0">
          <Link
            to={`/publication/${publication.id}`}
            className="block mb-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-400/60"
          >
            <h3 className="text-lg md:text-xl font-semibold tracking-tight leading-snug line-clamp-2 pr-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 group-hover:from-cosmic-100 group-hover:to-slate-200">
              {publication.title}
            </h3>
          </Link>
          <p className="text-slate-400 text-sm mb-3 line-clamp-2">
            {publication.authors.slice(0,5).map(a => `${a.givenNames} ${a.surname}`).join(', ')}{publication.authors.length>5 ? ' …' : ''} • {publication.year}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={"px-2.5 py-1 text-[10px] rounded-full font-medium tracking-wide uppercase " + tagColors.organism}>{publication.organism}</span>
            <span className={"px-2.5 py-1 text-[10px] rounded-full font-medium tracking-wide uppercase " + tagColors.assay}>{publication.assay}</span>
            <span className={"px-2.5 py-1 text-[10px] rounded-full font-medium tracking-wide uppercase " + tagColors.mission}>{publication.mission}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            {publication.doi && <span className="truncate max-w-[180px]" title={publication.doi}>DOI: {publication.doi}</span>}
            <span className="hidden md:inline" aria-hidden>•</span>
            <span>{publication.publisher}</span>
          </div>
        </div>
        {onRemove && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onRemove(publication.id)}
            className="p-2 rounded-lg text-slate-400 hover:text-red-300 hover:bg-red-500/10 transition border border-transparent hover:border-red-400/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
            aria-label="Remove publication"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
});

PublicationCard.displayName = 'PublicationCard';

export default PublicationCard;
