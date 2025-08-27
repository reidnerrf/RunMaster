import React from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { useAppSelector } from '@/store/hooks';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { track } from '@/utils/analyticsClient';

export default function InsightsDashboardScreen() {
  const stats = useAppSelector((s) => (s as any).user?.stats);
  const runs = useAppSelector((s) => (s as any).workout?.sessions ?? []);

  const trend = React.useMemo(() => {
    if (!stats) return null;
    const weeks = stats.weeklyProgress.slice(-6);
    const distances = weeks.map((w: any) => w.distance);
    const delta = distances.length >= 2 ? distances[distances.length - 1] - distances[0] : 0;
    return { weeks, delta };
  }, [stats]);

  const exportJson = async () => {
    try {
      const payload = JSON.stringify({ stats, runs });
      await track('action_performed', { action_name: 'export_json', context: 'insights' });
      console.log(payload.length);
    } catch {}
  };

  const exportCsv = async () => {
    try {
      const header = 'id,startedAt,durationSec,distanceKm,calories\n';
      const rows = runs.map((r: any) => `${r.id},${r.startedAt},${r.durationSec},${r.distanceKm},${r.calories}`).join('\n');
      const csv = header + rows;
      await track('action_performed', { action_name: 'export_csv', context: 'insights' });
      console.log(csv.length);
    } catch {}
  };

  const smartGoal = React.useMemo(() => {
    if (!stats) return null;
    const base = Math.round((stats.averageDistance || 5) * 1.1);
    return { label: `Meta semanal sugerida: ${base} km`, value: base };
  }, [stats]);

  if (!stats) return null;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <ThemedView style={styles.card}> 
        <ThemedText type="title">Dashboard</ThemedText>
        <ThemedText>Total corridas: {stats.totalRuns}</ThemedText>
        <ThemedText>Distância total: {stats.totalDistance} km</ThemedText>
        <ThemedText>Pace médio: {stats.averagePace}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.card}> 
        <ThemedText type="subtitle">Tendências (6 semanas)</ThemedText>
        {trend && <ThemedText>Δ distância: {trend.delta.toFixed(1)} km</ThemedText>}
      </ThemedView>

      <ThemedView style={styles.card}> 
        <ThemedText type="subtitle">Exportar</ThemedText>
        <View style={styles.row}> 
          <Pressable onPress={exportCsv} style={styles.btn}><Text style={styles.btnText}>CSV</Text></Pressable>
          <Pressable onPress={exportJson} style={styles.btn}><Text style={styles.btnText}>JSON</Text></Pressable>
        </View>
      </ThemedView>

      {smartGoal && (
        <ThemedView style={styles.card}> 
          <ThemedText type="subtitle">Metas Inteligentes</ThemedText>
          <ThemedText>{smartGoal.label}</ThemedText>
          <Pressable onPress={async () => { await track('ml_suggestion_accepted', { type: 'smart_goal', value: smartGoal.value }); }} style={[styles.btn, { backgroundColor: '#6C63FF' }]}><Text style={styles.btnText}>Aceitar</Text></Pressable>
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, marginBottom: 12 },
  row: { flexDirection: 'row', gap: 8, marginTop: 8 },
  btn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#111827' },
  btnText: { color: 'white', fontWeight: '800' },
});

