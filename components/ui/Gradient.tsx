import React from 'react';
import { ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientProps {
  style?: ViewStyle;
  from?: string;
  to?: string;
}

export default function Gradient({ style, from = '#6C63FF', to = '#00B894' }: GradientProps) {
  return (
    <LinearGradient colors={[from, to]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={style} />
  );
}

