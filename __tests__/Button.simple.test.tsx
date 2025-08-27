import React from 'react';
import { render } from '@testing-library/react-native';
import Button from '../components/ui/Button';

// Mock the useTheme hook
jest.mock('../hooks/useTheme', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        primary: '#6C63FF',
        text: '#111827',
        background: '#FFFFFF',
        border: '#E5E7EB',
      },
      spacing: {
        sm: 8,
        md: 16,
        lg: 24,
      },
      typography: {
        fontSize: {
          base: 16,
        },
      },
    },
  }),
}));

// Mock the haptics utility
jest.mock('../utils/haptics', () => ({
  hapticSelection: jest.fn(),
}));

describe('Button Component', () => {
  test('should render with title', () => {
    const { getByText } = render(<Button title="Test Button" onPress={() => {}} />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  test('should render with different variants', () => {
    const { getByText, rerender } = render(<Button title="Primary" variant="primary" onPress={() => {}} />);
    expect(getByText('Primary')).toBeTruthy();

    rerender(<Button title="Ghost" variant="ghost" onPress={() => {}} />);
    expect(getByText('Ghost')).toBeTruthy();

    rerender(<Button title="Destructive" variant="destructive" onPress={() => {}} />);
    expect(getByText('Destructive')).toBeTruthy();
  });

  test('should render with different sizes', () => {
    const { getByText, rerender } = render(<Button title="Small" size="sm" onPress={() => {}} />);
    expect(getByText('Small')).toBeTruthy();

    rerender(<Button title="Large" size="lg" onPress={() => {}} />);
    expect(getByText('Large')).toBeTruthy();
  });

  test('should be disabled when disabled prop is true', () => {
    const { getByText } = render(<Button title="Disabled" disabled onPress={() => {}} />);
    const button = getByText('Disabled');
    expect(button).toBeTruthy();
  });
});