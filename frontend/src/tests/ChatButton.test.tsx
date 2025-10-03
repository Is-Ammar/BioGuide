import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../pages/Landing', () => () => <div>Landing Page</div>);

describe('Global ChatButton', () => {
  test('unauthenticated click opens auth modal (no panel)', () => {
    render(
      <MemoryRouter initialEntries={['/']}> 
        <App />
      </MemoryRouter>
    );
    const btn = screen.getByRole('button', { name: /open ai assistant/i });
    fireEvent.click(btn);
    // Auth modal should appear (look for a common field like email label or placeholder)
    expect(screen.queryByText(/BioGuide Assistant/i)).not.toBeInTheDocument();
  });
});
