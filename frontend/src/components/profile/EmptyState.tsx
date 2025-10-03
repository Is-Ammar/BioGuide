import React from 'react';
import { Bookmark, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  type: 'saved' | 'favorites';
}

export const EmptyState: React.FC<EmptyStateProps> = ({ type }) => {
  const isSaved = type === 'saved';
  return (
    <div className="relative rounded-2xl border border-slate-600/60 bg-slate-900/70 backdrop-blur-xl p-12 text-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-cosmic-500/15 via-bio-400/10 to-cosmic-400/15 blur-3xl" />
      </div>
      <div className="relative">
        {isSaved ? <Bookmark className="w-20 h-20 mx-auto text-slate-600 mb-6" /> : <Star className="w-20 h-20 mx-auto text-slate-600 mb-6" />}
        <h3 className="text-2xl font-semibold mb-3 tracking-tight">{isSaved ? 'No Saved Publications Yet' : 'No Favorites Yet'}</h3>
        <p className="text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
          {isSaved ? 'Start curating your personalized research library by saving publications that matter to your work.' : 'Star the most impactful publications to quickly access and highlight them here.'}
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-cosmic-500/90 to-cosmic-600/90 hover:from-cosmic-400 hover:to-cosmic-500 px-6 py-3 text-sm font-semibold shadow-[0_10px_40px_-10px_rgba(56,189,248,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-400/60"
        >
          Explore Publications
        </Link>
      </div>
    </div>
  );
};

export default EmptyState;
