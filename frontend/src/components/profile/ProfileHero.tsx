import React from 'react';
import { motion } from 'framer-motion';
import { Download, LogOut, Sparkles } from 'lucide-react';
import { User } from '../../lib/auth';

interface ProfileHeroProps {
  user: User;
  onExport: () => void;
  onSignOut: () => void;
  exportDisabled?: boolean;
  stats: { saved: number; favorites: number };
}

const container = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

export const ProfileHero: React.FC<ProfileHeroProps> = ({ user, onExport, onSignOut, exportDisabled, stats }) => {
  return (
    <motion.header
      variants={container}
      initial="hidden"
      animate="show"
      className="relative overflow-hidden rounded-2xl p-8 md:p-10 glass-dark border border-slate-600/60 shadow-[0_8px_40px_-4px_rgba(0,0,0,0.55)]"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cosmic-500/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-12 w-60 h-60 rounded-full bg-bio-400/10 blur-2xl" />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-cosmic-400/10 to-bio-300/10 blur-xl" />
      </div>

      <div className="relative flex flex-col md:flex-row md:items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-slate-700/70 via-slate-800/60 to-slate-900/70 border border-slate-600/60 backdrop-blur-md flex items-center justify-center shadow-inner">
              <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-tr from-cosmic-300 via-bio-200 to-cosmic-400 tracking-tight">
                {user.first_name.charAt(0)}{user.last_name.charAt(0)}
              </span>
            </div>
            <span className="absolute -bottom-2 -right-2 inline-flex items-center gap-1 rounded-full bg-slate-900/80 border border-slate-600/60 px-2 py-1 text-[10px] uppercase tracking-wider font-semibold text-cosmic-300 shadow-lg">
              <Sparkles className="w-3 h-3 text-bio-300" /> Researcher
            </span>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
              {user.first_name} {user.last_name}
            </h1>
            <p className="text-slate-400 mb-4 text-sm md:text-base">{user.email}</p>
            <div className="flex gap-3 text-xs md:text-sm">
              <span className="px-3 py-1 rounded-full bg-cosmic-500/15 text-cosmic-300 border border-cosmic-500/30">Saved {stats.saved}</span>
              <span className="px-3 py-1 rounded-full bg-bio-500/15 text-bio-300 border border-bio-500/30">Favorites {stats.favorites}</span>
              <span className="px-3 py-1 rounded-full bg-slate-700/40 text-slate-300 border border-slate-600/60">Member</span>
            </div>
          </div>
        </div>
        <div className="md:ml-auto flex gap-4 items-start md:items-center">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={onExport}
            disabled={exportDisabled}
            className="group relative inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed
              bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-600/70 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_4px_20px_-2px_rgba(0,0,0,0.5)] backdrop-blur-md
              hover:border-cosmic-400/60 hover:shadow-[0_0_0_1px_rgba(56,189,248,0.4),0_0_40px_-8px_rgba(56,189,248,0.6)] hover:text-white"
            aria-label="Export saved publications"
          >
            <Download className="w-4 h-4 text-cosmic-300 group-hover:text-cosmic-200" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cosmic-300 to-bio-300 group-hover:from-cosmic-200 group-hover:to-bio-200">Export</span>
            <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-cosmic-500/10 to-bio-400/10" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSignOut}
            className="relative inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium
              bg-gradient-to-br from-red-600/20 to-red-800/30 border border-red-600/40 text-red-300 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-md
              hover:border-red-400/60 hover:shadow-[0_0_0_1px_rgba(248,113,113,0.5),0_0_32px_-8px_rgba(248,113,113,0.5)] hover:text-red-200"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default ProfileHero;
