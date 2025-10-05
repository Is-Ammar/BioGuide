import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';

function openRegistration() {
  render(<MemoryRouter><Login /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
}

describe('Profession options filtered by age', () => {
  it('hides researcher and scientist when age < 18', () => {
    openRegistration();
    const ageInput = screen.getByLabelText(/age/i);
    fireEvent.change(ageInput, { target: { value: '16' } });

    const professionSelect = screen.getByLabelText(/profession/i);
    // Open select (jsdom won't open native dropdown, but options are in DOM)
    expect(screen.getByRole('option', { name: /student/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /other/i })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /researcher/i })).toBeNull();
    expect(screen.queryByRole('option', { name: /scientist/i })).toBeNull();
  });

  it('shows all professions when age >= 18', () => {
    openRegistration();
    const ageInput = screen.getByLabelText(/age/i);
    fireEvent.change(ageInput, { target: { value: '22' } });

    expect(screen.getByRole('option', { name: /student/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /researcher/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /scientist/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /other/i })).toBeInTheDocument();
  });
});
