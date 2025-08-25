import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Share } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getRuns, Run } from '../Lib/runStore';
import { useTheme } from '../hooks/useTheme';
import MapTrace from '../components/MapTrace';
import PaceHrChart from '../components/Charts';
import ActionButton from '../components/ActionButton';
import { addRoute } from '../Lib/routeStore';
import GeneratedImage from '../components/GeneratedImage';
import { getRecoveryAdvice } from '../Lib/analysis';

export default function RunSummaryScreen() {
  const route = useRoute<any>();
  const nav = useNavigation();
  const { theme } = useTheme();
  const { runId } = route.params || {};
  const [run, setRun] = useState<Run | null>(null);
  const [allRuns, setAllRuns] = useState<Run[]>([]);

  useEffect(() => {
    (async () => {
      const all = await getRuns();
      setAllRuns(all);
      setRun(all.find(r => r.id === runId) || null);
    })();
  }, [runId]);

  if (!run) return null;

  const splitData = (run.splits || []).map(s => ({ km: s.km, paceSec: s.paceSec, avgHr: s.avgHr }));
  const advice = getRecoveryAdvice(allRuns, run);

  const onShare = async () => {
    try {
      await Share.share({ message: `Acabei de correr ${run.distanceKm.toFixed(2)} km com pace médio ${run.avgPace}! #RunMaster` });
    } catch {}
  };

  const saveAsRoute = async () => {
    await addRoute({ name: `Rota ${new Date(run.startedAt).toLocaleDateString()}`, distance_km: run.distanceKm, notes: 'Criada a partir de treino' });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={{ padding: 16 }}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Treino Finalizado</Text>
      <MapTrace points={run.path || []} />

      <View style={[styles.card, { backgroundColor: theme.colors.card }]}> 
        <Text style={[styles.metric, { color: theme.colors.text }]}>{run.distanceKm.toFixed(2)} km</Text>
        <Text style={{ color: theme.colors.muted }}>Pace médio {run.avgPace} • {Math.round(run.calories)} kcal</Text>
      </View>

      {splitData.length > 0 && (
        <>
          <Text style={[styles.section, { color: theme.colors.text }]}>Pace e BPM por km</Text>
          <PaceHrChart data={splitData} />
        </>
      )}

      <Text style={[styles.section, { color: theme.colors.text }]}>Análise e recuperação</Text>
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}> 
        <Text style={{ color: theme.colors.muted }}>Risco: <Text style={{ color: theme.colors.text, fontWeight: '800', textTransform: 'capitalize' }}>{advice.risk}</Text></Text>
        {advice.messages.map((m, i) => (
          <Text key={i} style={{ color: theme.colors.text, marginTop: 4 }}>• {m}</Text>
        ))}
      </View>

      <Text style={[styles.section, { color: theme.colors.text }]}>Compartilhar</Text>
      <View style={[styles.shareCard, { backgroundColor: theme.colors.card }]}> 
        <GeneratedImage text={`Cartão de corrida: ${run.distanceKm.toFixed(2)} km, pace ${run.avgPace}, estilo esportivo com gradientes vibrantes` as any} aspect="1:1" style={{ width: '100%', height: 200, borderRadius: 12 }} />
        <ActionButton label="Compartilhar" onPress={onShare} />
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
        <ActionButton label="Salvar como rota" onPress={saveAsRoute} />
        <ActionButton label="Fechar" color="#eee" textColor="#111" onPress={() => nav.goBack()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '900', marginBottom: 8 },
  section: { fontSize: 16, fontWeight: '800', marginTop: 12, marginBottom: 6 },
  card: { borderRadius: 16, padding: 14, marginTop: 10 },
  metric: { fontSize: 28, fontWeight: '900' },
  shareCard: { borderRadius: 16, padding: 14 },
});