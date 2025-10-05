import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../lib/theme';

// simple consumer for test
const Consumer = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} data-theme={theme}>Current: {theme}</button>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('initializes with system preference when no stored value', () => {
    // jsdom doesn't implement matchMedia by default; mock light
    (window as any).matchMedia = (q: string) => ({
      matches: q.includes('dark') ? false : true,
      media: q,
      addEventListener: () => {},
      removeEventListener: () => {},
    });
    render(<ThemeProvider><Consumer /></ThemeProvider>);
    const btn = screen.getByRole('button');
    expect(btn.getAttribute('data-theme')).toBe('light');
  });

  it('toggles theme and persists', () => {
    (window as any).matchMedia = (q: string) => ({
      matches: false,
      media: q,
      addEventListener: () => {},
      removeEventListener: () => {},
    });
    render(<ThemeProvider><Consumer /></ThemeProvider>);
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    expect(btn.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('FF_BioGuide_theme')).toBe('dark');
  });
});
