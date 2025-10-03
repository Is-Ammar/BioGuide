import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PublicationCard from '../components/profile/PublicationCard';
import { Publication } from '../lib/searchEngine';

const publication: Publication = {
  id: 'test-1',
  title: 'High-Resolution Mapping of Cellular Structures',
  authors: [
    { givenNames: 'Ada', surname: 'Lovelace' },
    { givenNames: 'Alan', surname: 'Turing' }
  ],
  year: 2024,
  doi: '10.1000/test',
  pmid: undefined,
  pmc: undefined,
  abstract: 'Example abstract',
  mission: 'MissionX',
  organism: 'Human',
  assay: 'scRNA-seq',
  source: 'BioArchive',
  license: 'CC-BY',
  url: 'https://example.com',
  pdfUrl: undefined,
  volume: undefined,
  issue: undefined,
  publisher: 'Science Press',
  keywords: ['cell', 'mapping']
};

describe('PublicationCard', () => {
  it('renders publication title and metadata', () => {
    render(
      <MemoryRouter>
        <PublicationCard publication={publication} index={0} />
      </MemoryRouter>
    );
    expect(screen.getByText(/High-Resolution Mapping/i)).toBeInTheDocument();
    expect(screen.getByText(/Lovelace/i)).toBeInTheDocument();
    expect(screen.getByText(/2024/)).toBeInTheDocument();
  });
});
