import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { useOnboarding } from '../../hooks/useOnboarding';

const slides = [
  { title: 'Defina suas metas', body: 'Crie objetivos diários e semanais de passos, km e calorias.' },
  { title: 'Acompanhe suas aventuras', body: 'Rotas inteligentes e mapa ao vivo com métricas.' },
  { title: 'Evolua todo dia', body: 'Estatísticas claras e planos para seu estilo de vida.' },
];

export default function OnboardingScreen() {
  const { theme } = useTheme();
  const nav = useNavigation();
  const { markDone } = useOnboarding();
  const [idx, setIdx] = useState(0);

  const next = async () => {
    if (idx < slides.length - 1) setIdx(idx + 1);
    else { await markDone(); (nav as any).navigate('Welcome'); }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}> 
        <Text style={[styles.title, { color: theme.colors.text }]}>{slides[idx].title}</Text>
        <Text style={[styles.body, { color: theme.colors.muted }]}>{slides[idx].body}</Text>
        <View style={{ height: 10 }} />
        <View style={styles.dots}>{slides.map((_, i) => (
          <View key={i} style={[styles.dot, { backgroundColor: i === idx ? theme.colors.primary : theme.colors.border }]} />
        ))}</View>
        <Pressable onPress={next} style={[styles.btn, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.btnText}>{idx < slides.length - 1 ? 'Próximo' : 'Começar'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  card: { borderRadius: 20, padding: 24, alignItems: 'center' },
  title: { fontSize: 26, fontWeight: '800', textAlign: 'center' },
  body: { marginTop: 8, fontSize: 16, textAlign: 'center' },
  btn: { marginTop: 24, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 16 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  dots: { flexDirection: 'row', gap: 8, marginTop: 16 },
  dot: { width: 10, height: 10, borderRadius: 5 },
});