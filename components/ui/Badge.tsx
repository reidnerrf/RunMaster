import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface BadgeProps {
  label: string;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  style?: ViewStyle;
}

export default function Badge({ label, color = 'primary', style }: BadgeProps) {
  const { theme } = useTheme();
  const bg = color === 'primary' ? theme.colors.primary :
             color === 'secondary' ? theme.colors.secondary :
             color === 'success' ? theme.colors.success :
             color === 'warning' ? theme.colors.warning :
             color === 'error' ? '#EF4444' : theme.colors.pace;
  return (
    <View style={[styles.base, { backgroundColor: bg } , style]}> 
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  text: { color: '#fff', fontSize: 12, fontWeight: '700' },
});

