import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginPage from './page';

// Mock the AuthContext so we don't need a real provider for this simple test
jest.mock('../../../contexts/auth-context', () => ({
  useAuth: () => ({
    login: jest.fn(),
  }),
}));

describe('LoginPage', () => {
  it('renders the login page heading correctly', () => {
    render(<LoginPage />);
    const heading = screen.getByRole('heading', { name: /sign in to nova/i });
    expect(heading).toBeInTheDocument();
  });
});
