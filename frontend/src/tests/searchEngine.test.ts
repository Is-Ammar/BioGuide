import { parseAdvancedQuery, searchPublications } from '../lib/searchEngine';
import type { Publication } from '../lib/searchEngine';

// Mock data for testing
const mockPublications: Publication[] = [
  {
    id: 'PMC4136787',
    title: 'Mice in Bion-M 1 Space Mission',
    authors: [{ surname: 'Smith', givenNames: 'John' }],
    year: 2014,
    abstract: 'Study of mice in space microgravity conditions',
    mission: 'Bion-M 1',
    organism: 'Mus musculus',
    assay: 'Behavioral Assessment',
    source: 'PMC',
    license: 'CC BY 4.0',
    url: 'https://example.com',
    publisher: 'Test Publisher',
    keywords: ['microgravity', 'space', 'mice'],
    pdfUrl: null
  },
  {
    id: 'PMC5234567',
    title: 'Protein Expression in Human Cells',
    authors: [{ surname: 'Johnson', givenNames: 'Jane' }],
    year: 2018,
    abstract: 'Analysis of protein expression in human cell cultures',
    mission: 'ISS Expedition 52',
    organism: 'Homo sapiens',
    assay: 'Proteomics',
    source: 'Nature',
    license: 'CC BY 4.0',
    url: 'https://example.com',
    publisher: 'Nature Publishing',
    keywords: ['proteomics', 'cells', 'ISS'],
    pdfUrl: 'https://example.com/paper.pdf'
  }
];

describe('parseAdvancedQuery', () => {
  test('parses free text query', () => {
    const result = parseAdvancedQuery('microgravity space research');
    expect(result).toEqual({
      text: 'microgravity space research'
    });
  });

  test('parses organism filter', () => {
    const result = parseAdvancedQuery('organism:mice');
    expect(result).toEqual({
      organism: 'mice'
    });
  });

  test('parses quoted organism filter', () => {
    const result = parseAdvancedQuery('organism:"Mus musculus"');
    expect(result).toEqual({
      organism: 'Mus musculus'
    });
  });

  test('parses multiple filters', () => {
    const result = parseAdvancedQuery('organism:mice assay:proteomics mission:"ISS Expedition"');
    expect(result).toEqual({
      organism: 'mice',
      assay: 'proteomics',
      mission: 'ISS Expedition'
    });
  });

  test('parses year range filters', () => {
    const result = parseAdvancedQuery('year>=2015 year<=2020');
    expect(result).toEqual({
      yearFrom: 2015,
      yearTo: 2020
    });
  });

  test('parses complex query with text and filters', () => {
    const result = parseAdvancedQuery('protein expression organism:human year>=2018');
    expect(result).toEqual({
      text: 'protein expression',
      organism: 'human',
      yearFrom: 2018
    });
  });

  test('handles empty query', () => {
    const result = parseAdvancedQuery('');
    expect(result).toEqual({});
  });

  test('handles whitespace-only query', () => {
    const result = parseAdvancedQuery('   ');
    expect(result).toEqual({});
  });
});

describe('searchPublications', () => {
  test('returns all publications for empty query', () => {
    const result = searchPublications(mockPublications, {});
    expect(result.publications).toHaveLength(2);
    expect(result.total).toBe(2);
  });

  test('filters by text search', () => {
    const result = searchPublications(mockPublications, { text: 'mice' });
    expect(result.publications).toHaveLength(1);
    expect(result.publications[0].id).toBe('PMC4136787');
  });

  test('filters by organism', () => {
    const result = searchPublications(mockPublications, { organism: 'human' });
    expect(result.publications).toHaveLength(1);
    expect(result.publications[0].organism).toBe('Homo sapiens');
  });

  test('filters by assay', () => {
    const result = searchPublications(mockPublications, { assay: 'proteomics' });
    expect(result.publications).toHaveLength(1);
    expect(result.publications[0].assay).toBe('Proteomics');
  });

  test('filters by year range', () => {
    const result = searchPublications(mockPublications, { yearFrom: 2015 });
    expect(result.publications).toHaveLength(1);
    expect(result.publications[0].year).toBe(2018);
  });

  test('applies pagination', () => {
    const result = searchPublications(mockPublications, {}, 1, 1);
    expect(result.publications).toHaveLength(1);
    expect(result.total).toBe(2);
  });

  test('generates correct facets', () => {
    const result = searchPublications(mockPublications, {});
    expect(result.facets.organisms).toEqual({
      'Mus musculus': 1,
      'Homo sapiens': 1
    });
    expect(result.facets.assays).toEqual({
      'Behavioral Assessment': 1,
      'Proteomics': 1
    });
  });

  test('combines multiple filters', () => {
    const result = searchPublications(mockPublications, {
      text: 'protein',
      organism: 'human'
    });
    expect(result.publications).toHaveLength(1);
    expect(result.publications[0].id).toBe('PMC5234567');
  });
});