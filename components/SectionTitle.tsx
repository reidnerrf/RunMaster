import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function SectionTitle({ title, subtitle, actionLabel, onAction }: { title: string; subtitle?: string; actionLabel?: string; onAction?: () => void }) {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      <View>
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        {!!subtitle && <Text style={{ color: theme.colors.muted }}>{subtitle}</Text>}
      </View>
      {!!actionLabel && (
        <Pressable onPress={onAction} style={[styles.action, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}> 
          <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontWeight: '900', fontSize: 16 },
  action: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
});