import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export default function Chip({ label, selected, onPress, style }: ChipProps) {
  const { theme } = useTheme();
  return (
    <Pressable onPress={onPress} style={[styles.base, { backgroundColor: selected ? theme.colors.primary : theme.colors.backgroundSecondary, borderColor: selected ? theme.colors.primary : theme.colors.border }, style]}> 
      <Text style={[styles.text, { color: selected ? '#fff' : theme.colors.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  text: { fontSize: 13, fontWeight: '700' },
});

