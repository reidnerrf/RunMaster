import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface AppBarProps {
  title?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  style?: ViewStyle;
}

export default function AppBar({ title, left, right, style }: AppBarProps) {
  const { theme } = useTheme();
  return (
    <View style={[styles.base, { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border }, style]}> 
      <View style={styles.side}>{left}</View>
      <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>{title}</Text>
      <View style={[styles.side, { justifyContent: 'flex-end' }]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { height: 56, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  side: { width: 80, flexDirection: 'row', alignItems: 'center' },
  title: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700' },
});

