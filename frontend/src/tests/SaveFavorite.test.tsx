import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ResultCard from '../components/ResultCard';
import { Publication } from '../lib/searchEngine';

// Create a lightweight mock Auth context provider since original provider couples to API
import { createContext } from 'react';

const mockToggleSave = jest.fn();
const mockToggleFavorite = jest.fn();
const AuthContext: any = createContext({});

const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthContext.Provider value={{
    user: { _id: 'u1', email: 'test@example.com' },
    openAuthModal: jest.fn(),
    savedIds: ['PUB1'],
    favoriteIds: [],
    toggleSave: mockToggleSave,
    toggleFavorite: mockToggleFavorite
  }}>{children}</AuthContext.Provider>
);

jest.mock('../lib/auth', () => ({
  useAuth: () => React.useContext(AuthContext)
}));

const publication: Publication = {
  id: 'PUB2',
  title: 'Sample Publication',
  authors: [{ surname: 'Doe', givenNames: 'John' }],
  year: 2020,
  abstract: 'Abstract',
  mission: 'Mission',
  organism: 'Organism',
  assay: 'Assay',
  source: 'Source',
  license: 'CC',
  url: '#',
  publisher: 'Publisher',
  keywords: []
};

describe('Save/Favorite integration', () => {
  test('calls toggleFavorite when star clicked', () => {
    render(<MockAuthProvider><ResultCard publication={publication} viewMode="grid" onSelect={() => {}} /></MockAuthProvider>);
    const starButton = screen.getByTitle(/Add to favorites/);
    fireEvent.click(starButton);
    expect(mockToggleFavorite).toHaveBeenCalledWith('PUB2');
  });

  test('calls toggleSave when bookmark clicked', () => {
    render(<MockAuthProvider><ResultCard publication={publication} viewMode="grid" onSelect={() => {}} /></MockAuthProvider>);
    const saveButton = screen.getByTitle(/Save to library/);
    fireEvent.click(saveButton);
    expect(mockToggleSave).toHaveBeenCalledWith('PUB2');
  });
});
