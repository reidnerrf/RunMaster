import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import Button from './Button';
import { useTheme } from '../../hooks/useTheme';

interface EmptyStateProps {
  title: string;
  description?: string;
  illustrationUri?: string;
  ctaLabel?: string;
  onCtaPress?: () => void;
  style?: ViewStyle;
}

export default function EmptyState({ title, description, illustrationUri, ctaLabel, onCtaPress, style }: EmptyStateProps) {
  const { theme } = useTheme();
  return (
    <View style={[styles.base, style]}> 
      {illustrationUri ? <Image source={{ uri: illustrationUri }} style={styles.illus} /> : null}
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      {description ? <Text style={[styles.desc, { color: theme.colors.textSecondary }]}>{description}</Text> : null}
      {ctaLabel ? <Button title={ctaLabel} onPress={onCtaPress} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', padding: 16 },
  illus: { width: 160, height: 160, marginBottom: 12 },
  title: { fontSize: 18, fontWeight: '800', textAlign: 'center' },
  desc: { marginTop: 6, textAlign: 'center' },
});

