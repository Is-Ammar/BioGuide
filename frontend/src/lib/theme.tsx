import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Possible themes
export type Theme = 'light' | 'dark';
interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: Theme; // after system resolution
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
  system: Theme; // system preferred
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'FF_BioGuide_theme';

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyHtmlClass(theme: Theme) {
  const html = document.documentElement;
  html.classList.remove('theme-light', 'theme-dark');
  html.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
  // mark readiness for transitions
  if (!html.classList.contains('theme-ready')) {
    requestAnimationFrame(() => html.classList.add('theme-ready'));
  }
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const system = getSystemTheme();
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      return stored || system;
    } catch { return system; }
  });

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    try { localStorage.setItem(STORAGE_KEY, t); } catch {}
    applyHtmlClass(t);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  useEffect(() => {
    applyHtmlClass(theme);
  }, []); // eslint-disable-line

  // Watch system preference changes if user hasn't explicitly chosen
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        const sys = getSystemTheme();
        applyHtmlClass(sys);
        setThemeState(sys);
      }
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme: theme, toggleTheme, setTheme, system }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
