import React from 'react';
import { render } from '@testing-library/react-native';
import Card from '../components/ui/Card';
import { Text } from 'react-native';

describe('Card', () => {
  it('renders children inside', () => {
    const { getByText } = render(
      <Card>
        <Text>Inside</Text>
      </Card>
    );
    expect(getByText('Inside')).toBeTruthy();
  });
});

