import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface CardProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
}

export default function Card({ children, style, elevated = true }: CardProps) {
  const { theme } = useTheme();
  return (
    <View style={[styles.base, elevated ? { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 4 } : null, { backgroundColor: theme.colors.backgroundCard, borderColor: theme.colors.border }, style]}> 
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: 16, padding: 16, borderWidth: 1 },
});

