import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TabNavProps {
  tabs: { id: string; label: string; count?: number }[];
  active: string;
  onChange: (id: string) => void;
}

export const TabNav: React.FC<TabNavProps> = ({ tabs, active, onChange }) => {
  return (
    <div className="relative">
      <div className="flex gap-1 md:gap-3">
        {tabs.map(tab => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`relative px-5 py-3 rounded-xl text-sm font-medium tracking-wide transition group focus:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-400/60
                ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="flex items-center gap-2">
                {tab.label}
                {typeof tab.count === 'number' && (
                  <span className={`inline-flex min-w-[1.75rem] justify-center rounded-md text-[10px] px-1.5 py-0.5 font-semibold border
                    ${isActive ? 'bg-cosmic-500/20 text-cosmic-200 border-cosmic-400/40' : 'bg-slate-700/50 border-slate-600/60 text-slate-300 group-hover:border-cosmic-400/40 group-hover:text-cosmic-200'}`}>{tab.count}</span>
                )}
              </span>
              {isActive && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-cosmic-500/15 via-cosmic-400/10 to-bio-400/10 border border-cosmic-400/40 shadow-[0_0_0_1px_rgba(56,189,248,0.25),0_4px_24px_-6px_rgba(56,189,248,0.5)]"/>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNav;
