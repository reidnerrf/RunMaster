import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';

interface AppBarProps {
  title?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  style?: ViewStyle;
}

export default function AppBar({ title, left, right, style }: AppBarProps) {
  const { theme } = useTheme();
  const nav = useNavigation();
  return (
    <View style={[styles.base, { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border }, style]}> 
      <View style={styles.side}>{left}</View>
      <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>{title}</Text>
      <View style={[styles.side, { justifyContent: 'flex-end' }]}>
        {right}
        <Pressable onPress={() => nav.navigate('Search' as never)} accessibilityRole="button" accessibilityLabel="Buscar" style={{ marginLeft: 12, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.border }}>
          <Text allowFontScaling maxFontSizeMultiplier={1.6} style={{ color: theme.colors.text }}>Buscar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { height: 56, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  side: { width: 80, flexDirection: 'row', alignItems: 'center' },
  title: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700' },
});

