import React from 'react';

export const PublicationSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl p-6 bg-slate-900/50 border border-slate-700/50 backdrop-blur-md"
        >
          <div className="h-5 w-2/3 bg-slate-700/60 rounded mb-3" />
          <div className="h-4 w-1/2 bg-slate-700/50 rounded mb-4" />
          <div className="flex gap-2 mb-4">
            <div className="h-6 w-16 bg-slate-700/40 rounded-full" />
            <div className="h-6 w-20 bg-slate-700/40 rounded-full" />
            <div className="h-6 w-20 bg-slate-700/40 rounded-full" />
          </div>
          <div className="h-3 w-1/3 bg-slate-700/40 rounded" />
        </div>
      ))}
    </div>
  );
};

export const StatSkeletons: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
      {[1,2].map(i => (
        <div key={i} className="animate-pulse rounded-xl p-6 bg-slate-900/50 border border-slate-700/50 backdrop-blur-md">
          <div className="h-4 w-28 bg-slate-700/60 rounded mb-6" />
          <div className="h-10 w-24 bg-slate-700/50 rounded" />
        </div>
      ))}
    </div>
  );
};
