import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

jest.mock('../hooks/useOnboarding', () => ({
  useOnboarding: () => ({ onboardingDone: true, hydrated: true })
}));
jest.mock('../hooks/useAuth', () => ({ useAuth: () => ({ user: { id: '1' } }) }));

describe('App main', () => {
  it('shows main tabs when authenticated and onboarded', () => {
    const { getByText } = render(<App />);
    // Expect some tab label or screen content
    expect(getByText(/Pronto para correr|Estatísticas|Comunidades/i)).toBeTruthy();
  });
});

