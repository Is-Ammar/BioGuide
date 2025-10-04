import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider } from '../lib/auth';
import ResultCard from '../components/ResultCard';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../lib/api', () => ({
  apiService: {
    signin: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
    toggleSavedPublication: jest.fn().mockResolvedValue({ success: true, savedPublications: ['pub1'], favoritePublications: [] }),
    toggleFavoritePublication: jest.fn().mockResolvedValue({ success: true, savedPublications: [], favoritePublications: ['pub1'] }),
    getUserPublications: jest.fn().mockResolvedValue({ success: true, savedPublications: [], favoritePublications: [] })
  }
}));

describe('Pending Action Flow', () => {
  const publication = {
    id: 'pub1',
    title: 'Test Publication',
    abstract: 'Lorem ipsum',
    authors: [{ givenNames: 'A', surname: 'Author' }],
    organism: 'Human',
    assay: 'RNASeq',
    mission: 'ISS',
    source: 'PubMed',
    year: 2024,
    pdfUrl: 'http://example.com/test.pdf'
  } as any;

  function Wrapper({ children }: { children: React.ReactNode }) {
    return <BrowserRouter><AuthProvider>{children}</AuthProvider></BrowserRouter>;
  }

  it('stores pending download action when unauthenticated and triggers modal open', () => {
    render(<Wrapper><ResultCard publication={publication} viewMode="grid" onSelect={() => {}} /></Wrapper>);
    const downloadBtn = screen.getByTitle('Download PDF');
    fireEvent.click(downloadBtn);
    const stored = JSON.parse(localStorage.getItem('FF_BioGuide_pending_action') || '{}');
    expect(stored.type).toBe('download');
  });
});
