import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';

function openRegistration() {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
  const toggle = screen.getByRole('button', { name: /sign up/i });
  fireEvent.click(toggle);
}

describe('Registration profession selection', () => {
  it('requires selecting profession and age', () => {
    openRegistration();
    const professionSelect = screen.getByLabelText(/profession/i) as HTMLSelectElement;
    expect(professionSelect).toBeInTheDocument();
    fireEvent.change(professionSelect, { target: { value: 'student' } });
    expect(professionSelect.value).toBe('student');

    const ageInput = screen.getByLabelText(/age/i) as HTMLInputElement;
    fireEvent.change(ageInput, { target: { value: '30' } });
    expect(ageInput.value).toBe('30');
  });
});
