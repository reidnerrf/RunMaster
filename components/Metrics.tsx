import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export function MetricGrid({ items }: { items: { label: string; value: string; sublabel?: string }[] }) {
  const { theme } = useTheme();
  return (
    <View style={styles.grid}>
      {items.map((it) => (
        <View key={it.label} style={[styles.item, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}> 
          <Text style={[styles.value, { color: theme.colors.text }]}>{it.value}</Text>
          {!!it.sublabel && <Text style={{ color: theme.colors.muted, fontSize: 12 }}>{it.sublabel}</Text>}
          <Text style={[styles.label, { color: theme.colors.muted }]}>{it.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', gap: 10 },
  item: { flex: 1, borderWidth: 1, borderRadius: 14, padding: 12, alignItems: 'center' },
  value: { fontSize: 18, fontWeight: '800' },
  label: { marginTop: 4 },
});