import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Input from '../components/ui/Input';

describe('Input', () => {
  it('updates value on change', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(<Input value="" onChangeText={onChangeText} placeholder="Email" />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'a@b.com');
    expect(onChangeText).toHaveBeenCalledWith('a@b.com');
  });
});

