import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

jest.mock('../hooks/useOnboarding', () => ({
  useOnboarding: () => ({ onboardingDone: false, hydrated: true })
}));
jest.mock('../hooks/useAuth', () => ({ useAuth: () => ({ user: null }) }));

describe('App routing guards', () => {
  it('shows Onboarding when not done', () => {
    const { getByText } = render(<App />);
    expect(getByText(/Configuração Inicial|Qual é seu objetivo/i)).toBeTruthy();
  });
});

