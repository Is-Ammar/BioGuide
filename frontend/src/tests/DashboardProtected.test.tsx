import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

jest.mock('../pages/Landing', () => () => <div>Landing Page</div>);
jest.mock('../pages/Dashboard', () => () => <div>Dashboard Content</div>);

// Because AuthModal renders conditionally, we look for its prompt text (from RequireAuth placeholder)

describe('Dashboard protection', () => {
  test('unauthenticated user does not see dashboard content', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.queryByText(/Dashboard Content/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Please sign in to access the dashboard/i)).toBeInTheDocument();
  });
});
