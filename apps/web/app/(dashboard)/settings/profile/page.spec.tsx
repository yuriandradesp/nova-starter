import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfileSettingsPage from './page';
import '@testing-library/jest-dom';

// Mock the Auth Context
jest.mock('../../../../contexts/auth-context', () => ({
  useAuth: () => ({
    user: { name: 'Nova User', email: 'user@nova.com' },
  }),
}));

// Mock the Toast Context
jest.mock('../../../../src/components/ui/toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('ProfileSettingsPage', () => {
  it('renders the profile settings form cleanly with user data populated', () => {
    render(<ProfileSettingsPage />);
    
    // Check main titles and descriptions
    expect(screen.getByText('Profile Settings')).toBeInTheDocument();
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();

    // Check if the custom inputs are rendered using their labels
    expect(screen.getByLabelText('Full name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('New password')).toBeInTheDocument();

    // Verify initial values are loaded correctly from context
    expect(screen.getByDisplayValue('Nova User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('user@nova.com')).toBeInTheDocument();

    // Ensure the submit button exists
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });
});
