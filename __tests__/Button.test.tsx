import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../components/ui/Button';

describe('Button', () => {
  it('renders title and handles press', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Tap" onPress={onPress} />);
    fireEvent.press(getByText('Tap'));
    expect(onPress).toHaveBeenCalled();
  });
});

