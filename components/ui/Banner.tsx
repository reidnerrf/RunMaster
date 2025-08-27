import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

type BannerType = 'info' | 'error' | 'success' | 'premium';

interface BannerProps {
  type?: BannerType;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export default function Banner({ type = 'info', title, description, actionLabel, onAction, style }: BannerProps) {
  const { theme } = useTheme();
  const bg = type === 'error' ? '#FEE2E2' : type === 'success' ? '#DCFCE7' : type === 'premium' ? '#F5F3FF' : '#EFF6FF';
  const fg = type === 'error' ? '#991B1B' : type === 'success' ? '#065F46' : type === 'premium' ? '#4C1D95' : '#1E3A8A';
  return (
    <View style={[styles.base, { backgroundColor: bg, borderColor: theme.colors.border }, style]}> 
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: fg }]}>{title}</Text>
        {description ? <Text style={[styles.desc, { color: fg }]}>{description}</Text> : null}
      </View>
      {actionLabel ? (
        <Pressable onPress={onAction} style={[styles.cta, { borderColor: fg }]}>
          <Text style={[styles.ctaText, { color: fg }]}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { borderWidth: 1, borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontWeight: '800' },
  desc: { marginTop: 2, fontSize: 12 },
  cta: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  ctaText: { fontWeight: '800', fontSize: 12 },
});

