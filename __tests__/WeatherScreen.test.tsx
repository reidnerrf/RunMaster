import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import WeatherScreen from '../Screens/WeatherScreen';

jest.mock('../utils/weather', () => ({
  getCurrentWeather: jest.fn(async () => ({
    location: { name: 'Testville', country: 'BR' },
    current: { temp_c: 25, condition: { text: 'Clear' }, wind_kph: 5, humidity: 40 }
  })),
  makeLatLonQuery: jest.fn((a: number, b: number) => `${a},${b}`)
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(async () => {}),
  getItem: jest.fn(async () => null),
}));

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: (fn: any) => { fn({ isConnected: true }); return () => {}; }
}));

describe('WeatherScreen', () => {
  it('renders fetched data', async () => {
    const { getByText } = render(<WeatherScreen />);
    await waitFor(() => getByText(/Clima agora/i));
    await waitFor(() => getByText(/Clear/i));
  });
});

