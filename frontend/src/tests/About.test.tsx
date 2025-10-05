import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import About from '../pages/About';

// Minimal mock for framer-motion to speed tests if needed
jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: new Proxy({}, {
      get: () => (props: any) => <div {...props} />
    })
  };
});

describe('About Page', () => {
  it('renders team members', () => {
    render(<About />);
    expect(screen.getByText(/El Bouzidi Youssef/i)).toBeInTheDocument();
    expect(screen.getByText(/ismail ammar/i)).toBeInTheDocument();
    expect(screen.getByText(/Ayoub diri/i)).toBeInTheDocument();
    expect(screen.getByText(/AKARKAOU MOHAMMED/i)).toBeInTheDocument();
    expect(screen.getByText(/Marouane Brouk/i)).toBeInTheDocument();
  });
});
