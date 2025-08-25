import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Share, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { getRuns, Run } from '../Lib/runStore';
import SectionTitle from '../components/SectionTitle';
import MapTrace from '../components/MapTrace';

export default function ShareRunScreen() {
  const { theme } = useTheme();
  const route = useRoute<any>();
  const nav = useNavigation();
  const id = route.params?.id as string;
  const [run, setRun] = useState<Run | null>(null);

  useEffect(() => {
    (async () => {
      const all = await getRuns();
      setRun(all.find((r) => r.id === id) || null);
    })();
  }, [id]);

  const onShare = async () => {
    if (!run) return;
    const msg = `🏃‍♂️ Minha corrida: ${run.distanceKm.toFixed(2)} km em ${run.durationSec/60 | 0} min • Pace ${run.avgPace} • via RunMaster`;
    await Share.share({ message: msg });
  };

  if (!run) return <View style={{ flex: 1, backgroundColor: theme.colors.background }} />;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 16 }}>
      <SectionTitle title="Compartilhar" subtitle="Mostre sua conquista" />

      <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}> 
        <Text style={[styles.title, { color: theme.colors.text }]}>RunMaster</Text>
        <Text style={{ color: theme.colors.muted }}>{new Date(run.startedAt).toLocaleString()}</Text>
        <View style={{ marginVertical: 10 }}>
          <MapTrace points={run.path || []} height={160} />
        </View>
        <Text style={[styles.metric, { color: theme.colors.text }]}>{run.distanceKm.toFixed(2)} km</Text>
        <Text style={{ color: theme.colors.muted }}>Pace {run.avgPace} • {Math.round(run.calories)} kcal</Text>
      </View>

      <Pressable onPress={onShare} style={[styles.btn, { backgroundColor: theme.colors.primary }]}> 
        <Text style={{ color: 'white', fontWeight: '800' }}>Compartilhar</Text>
      </Pressable>
      <Pressable onPress={() => nav.goBack()} style={[styles.btn, { backgroundColor: theme.colors.secondary }]}> 
        <Text style={{ color: 'white', fontWeight: '800' }}>Concluir</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 16, padding: 14 },
  title: { fontSize: 16, fontWeight: '900' },
  metric: { fontSize: 32, fontWeight: '900' },
  btn: { marginTop: 12, borderRadius: 14, padding: 12, alignItems: 'center' },
});