import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import FlowHint from '../components/FlowHint';
import ActionButton from '../components/ActionButton';
import { useTheme } from '../hooks/useTheme';

export default function UpgradeScreen() {
  const { upgradeToPremium } = useAuth();
  const [plan, setPlan] = useState<'Mensal' | 'Anual'>('Mensal');
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <Text style={[styles.title, { color: theme.colors.text }]}>Desbloqueie o Premium</Text>
      <Text style={[styles.sub, { color: theme.colors.muted }]}>Teste grátis por 7 dias • Cancele quando quiser</Text>

      <View style={styles.planRow}> 
        <Pressable onPress={() => setPlan('Mensal')} style={[styles.plan, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }, plan === 'Mensal' && { borderColor: theme.colors.primary }]}>
          <Text style={[styles.planTitle, { color: theme.colors.text }]}>Mensal</Text>
          <Text style={[styles.planPrice, { color: theme.colors.text }]}>R$ 19,90</Text>
        </Pressable>
        <Pressable onPress={() => setPlan('Anual')} style={[styles.plan, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }, plan === 'Anual' && { borderColor: theme.colors.primary }]}>
          <Text style={[styles.planTitle, { color: theme.colors.text }]}>Anual</Text>
          <Text style={[styles.planPrice, { color: theme.colors.text }]}>R$ 149,90</Text>
          <Text style={[styles.badge, { color: theme.colors.primary }]}>Mais econômico</Text>
        </Pressable>
      </View>

      <ActionButton label={`Assinar ${plan}`} onPress={upgradeToPremium} style={{ marginTop: 10 }} />

      <Text style={[styles.legal, { color: theme.colors.muted }]}>Pagamento via App Store / Google Play. Cancele a qualquer momento.</Text>

      <FlowHint steps={["Feature bloqueada", "Pop-up Premium", "Escolher plano", "Pagamento", "Desbloqueado"]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '900' },
  sub: { marginBottom: 12 },
  planRow: { flexDirection: 'row', gap: 10, marginVertical: 12 },
  plan: { width: 150, borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 1 },
  planActive: { borderColor: '#FF6B00' },
  planTitle: { fontWeight: '800', marginBottom: 4 },
  planPrice: { fontSize: 16 },
  badge: { marginTop: 6, fontWeight: '800' },
  cta: { backgroundColor: '#FF6B00', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 24, marginTop: 10 },
  ctaText: { color: 'white', fontWeight: '800', fontSize: 16 },
  legal: { marginTop: 10, textAlign: 'center' },
});