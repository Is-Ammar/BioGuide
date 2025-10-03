import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';

// Helper to switch to registration mode
function setupRegistration() {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
  // Click sign up toggle
  const toggle = screen.getByRole('button', { name: /sign up/i });
  fireEvent.click(toggle);
}

describe('Registration phone placeholder', () => {
  it('disables phone input until country selected and updates placeholder', () => {
    setupRegistration();
    const phoneInput = screen.getByLabelText(/phone number/i) as HTMLInputElement;
    expect(phoneInput).toBeDisabled();
    expect(phoneInput.placeholder.toLowerCase()).toContain('select country');

    // Select Canada
    const countrySelect = screen.getByLabelText(/country/i);
    fireEvent.change(countrySelect, { target: { value: 'Canada' } });

    expect(phoneInput).not.toBeDisabled();
    // Expect placeholder includes +1 and (since format for Canada exists) pattern or +1
    expect(phoneInput.placeholder.startsWith('+1')).toBe(true);
  });
});
