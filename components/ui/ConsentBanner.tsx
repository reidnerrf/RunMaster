import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import * as Storage from '../../Lib/storage';

const KEY = 'consent_analytics_v1';

export default function ConsentBanner() {
  const { theme } = useTheme();
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => { (async () => { const v = await Storage.getItem(KEY); setVisible(v !== '1'); })(); }, []);
  if (!visible) return null;
  return (
    <View style={[styles.base, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}> 
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Privacidade</Text>
        <Text style={{ color: theme.colors.textSecondary, fontSize: 12 }}>Usamos analytics para melhorar o app. Você pode optar.</Text>
      </View>
      <Pressable onPress={async () => { await Storage.setItem(KEY, '1'); setVisible(false); }} style={[styles.cta, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.ctaText}>Aceitar</Text>
      </Pressable>
      <Pressable onPress={async () => { await Storage.setItem(KEY, '0'); setVisible(false); }} style={[styles.cta, { borderWidth: 1, borderColor: theme.colors.border, backgroundColor: 'transparent' }]}>
        <Text style={[styles.ctaText, { color: theme.colors.text }]}>Negar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { position: 'absolute', bottom: 12, left: 12, right: 12, borderRadius: 16, borderWidth: 1, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontWeight: '800', marginBottom: 2 },
  cta: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginLeft: 6 },
  ctaText: { color: '#fff', fontWeight: '800' },
});

