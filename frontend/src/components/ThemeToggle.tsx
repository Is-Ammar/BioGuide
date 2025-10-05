import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../lib/theme';

interface ThemeToggleProps {
  className?: string;
  allowSystem?: boolean; // future extension
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      type="button"
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={theme === 'dark'}
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center w-10 h-10 rounded-xl border border-semantic-border-muted hover:border-semantic-border-accent bg-semantic-surface-1/70 hover:bg-semantic-surface-2/70 backdrop-blur-md shadow-sm transition-colors group ${className || ''}`}
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'dark' ? (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: -40, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 40, scale: 0.6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className="text-semantic-text-primary"
          >
            <Moon className="w-5 h-5" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: 40, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -40, scale: 0.6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className="text-semantic-text-primary"
          >
            <Sun className="w-5 h-5" />
          </motion.span>
        )}
      </AnimatePresence>
      <span className="absolute -bottom-8 text-[10px] font-medium text-semantic-text-secondary opacity-0 group-hover:opacity-100 transition-opacity select-none">{theme === 'dark' ? 'Dark' : 'Light'}</span>
    </motion.button>
  );
};

export default ThemeToggle;
