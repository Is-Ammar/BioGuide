import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  accent?: 'cosmic' | 'bio' | 'yellow' | 'purple' | 'slate';
  delay?: number;
}

const accentMap: Record<string, string> = {
  cosmic: 'from-cosmic-400/20 to-cosmic-500/10 text-cosmic-300 border-cosmic-400/40',
  bio: 'from-bio-400/20 to-bio-500/10 text-bio-300 border-bio-400/40',
  yellow: 'from-yellow-400/20 to-yellow-500/10 text-yellow-300 border-yellow-400/40',
  purple: 'from-purple-400/20 to-purple-600/10 text-purple-300 border-purple-400/40',
  slate: 'from-slate-500/20 to-slate-600/10 text-slate-300 border-slate-400/40'
};

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, accent = 'slate', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay }}
      className={`relative overflow-hidden rounded-xl p-[1px] bg-gradient-to-br ${accentMap[accent]}`}
    >
      <div className="relative h-full w-full rounded-xl bg-slate-900/80 backdrop-blur-xl border border-slate-600/60 px-5 py-6 flex flex-col shadow-[0_8px_40px_-10px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-slate-800/70 border border-slate-700/60 flex items-center justify-center shadow-inner">
              {icon}
            </div>
            <span className="text-sm font-medium tracking-wide text-slate-400 uppercase">{label}</span>
          </div>
        </div>
        <div className="text-4xl font-semibold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">{value}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
