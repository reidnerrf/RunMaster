import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

jest.mock('../hooks/useOnboarding', () => ({
  useOnboarding: () => ({ onboardingDone: true, hydrated: true })
}));
jest.mock('../hooks/useAuth', () => ({ useAuth: () => ({ user: null }) }));

describe('App auth gate', () => {
  it('shows Login when not authenticated', () => {
    const { getByText } = render(<App />);
    expect(getByText(/Boas-vindas|Acesse sua conta/i)).toBeTruthy();
  });
});

