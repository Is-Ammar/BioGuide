import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CountrySelect from '../components/CountrySelect';

describe('CountrySelect', () => {
  it('renders placeholder and options', () => {
    const handleChange = jest.fn();
    render(<CountrySelect value="" onChange={handleChange} />);
    expect(screen.getByText('Select Country')).toBeInTheDocument();
    // Spot check a few options
    expect(screen.getByRole('option', { name: 'United States' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Canada' })).toBeInTheDocument();
  });

  it('calls onChange when selecting a country', () => {
    const handleChange = jest.fn();
    render(<CountrySelect value="" onChange={handleChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Canada' } });
    expect(handleChange).toHaveBeenCalledWith('Canada');
  });
});
