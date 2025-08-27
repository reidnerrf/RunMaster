import React from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { useAppSelector } from '@/store/hooks';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { track } from '@/utils/analyticsClient';
import { useGate } from '@/hooks/useGate';

type Period = 'week' | 'month' | 'year';

export default function InsightsDashboardScreen() {
  const stats = useAppSelector((s) => (s as any).user?.stats);
  const runs = useAppSelector((s) => (s as any).workout?.sessions ?? []);
  const [period, setPeriod] = React.useState<Period>('week');
  const community = useAppSelector((s) => (s as any).community?.rankings ?? []);
  const { isPremium, open } = useGate();
  const [normalize, setNormalize] = React.useState<'absolute' | 'per_session'>('absolute');

  const trend = React.useMemo(() => {
    if (!stats) return null;
    if (period === 'week') {
      const weeks = stats.weeklyProgress.slice(-6);
      const distances = weeks.map((w: any) => normalize === 'per_session' && (w as any).totalRuns ? w.distance / (w as any).totalRuns : w.distance);
      const delta = distances.length >= 2 ? distances[distances.length - 1] - distances[0] : 0;
      return { labels: weeks.map((w: any) => w.week.slice(-2)), values: distances, delta };
    }
    if (period === 'month') {
      const months = stats.monthlyProgress.slice(-6);
      const distances = months.map((m: any) => normalize === 'per_session' && (m as any).totalRuns ? m.distance / (m as any).totalRuns : m.distance);
      const delta = distances.length >= 2 ? distances[distances.length - 1] - distances[0] : 0;
      return { labels: months.map((m: any) => m.month.slice(-2)), values: distances, delta };
    }
    const years = stats.yearlyProgress.slice(-5);
    const distances = years.map((y: any) => normalize === 'per_session' && (y as any).totalRuns ? y.distance / (y as any).totalRuns : y.distance);
    const delta = distances.length >= 2 ? distances[distances.length - 1] - distances[0] : 0;
    return { labels: years.map((y: any) => y.year), values: distances, delta };
  }, [stats, period, normalize]);

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

  const exportImage = async () => {
    if (!isPremium) { open('insights_export'); return; }
    try { await track('action_performed', { action_name: 'export_chart_image', context: 'insights' }); console.log('Export image (placeholder)'); } catch {}
  };

  const exportPdf = async () => {
    if (!isPremium) { open('insights_export'); return; }
    try { await track('action_performed', { action_name: 'export_chart_pdf', context: 'insights' }); console.log('Export PDF (placeholder)'); } catch {}
  };

  const smartGoal = React.useMemo(() => {
    if (!stats) return null;
    const base = Math.round((stats.averageDistance || 5) * 1.1);
    return { label: `Meta semanal sugerida: ${base} km`, value: base };
  }, [stats]);

  const paceSeries = React.useMemo(() => {
    if (!stats) return null;
    const sample = (period === 'week' ? stats.weeklyProgress : period === 'month' ? stats.monthlyProgress : stats.yearlyProgress).slice(-6);
    const values = sample.map((_: any, i: number) => {
      const r = runs[runs.length - 1 - i];
      return r ? (r.durationSec / (r.distanceKm || 1)) : 0;
    }).reverse();
    return { labels: sample.map((_: any, i: number) => `${i+1}`), values };
  }, [stats, runs, period]);

  const timeSeries = React.useMemo(() => {
    if (!stats) return null;
    const sample = (period === 'week' ? stats.weeklyProgress : period === 'month' ? stats.monthlyProgress : stats.yearlyProgress).slice(-6);
    const values = sample.map((s: any) => s.time || 0);
    return { labels: sample.map((_: any, i: number) => `${i+1}`), values };
  }, [stats, period]);

  const caloriesSeries = React.useMemo(() => {
    if (!stats) return null;
    const sample = (period === 'week' ? stats.weeklyProgress : period === 'month' ? stats.monthlyProgress : stats.yearlyProgress).slice(-6);
    const values = sample.map((s: any) => s.calories || 0);
    return { labels: sample.map((_: any, i: number) => `${i+1}`), values };
  }, [stats, period]);

  const communityAvg = React.useMemo(() => {
    const top = (community?.[0]?.rankings || []).slice(0, 10);
    if (!top.length) return null;
    const avg = top.reduce((a: number, r: any) => a + (r.value || 0), 0) / top.length;
    return Math.round(avg * 10) / 10;
  }, [community]);

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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <ThemedText type="subtitle">Tendências</ThemedText>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {(['week','month','year'] as Period[]).map((p) => (
              <Pressable key={p} onPress={() => setPeriod(p)} style={[styles.pill, { backgroundColor: period === p ? '#111827' : 'transparent', borderColor: '#E5E7EB' }]}> 
                <Text style={{ color: period === p ? 'white' : '#111827', fontWeight: '800', textTransform: 'capitalize' }}>{p}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <ThemedText>Normalização</ThemedText>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {(['absolute','per_session'] as Array<'absolute'|'per_session'>).map((m) => (
              <Pressable key={m} onPress={() => setNormalize(m)} style={[styles.pill, { backgroundColor: normalize === m ? '#111827' : 'transparent', borderColor: '#E5E7EB' }]}> 
                <Text style={{ color: normalize === m ? 'white' : '#111827', fontWeight: '800' }}>{m === 'absolute' ? 'Absoluto' : '/sessão'}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        {trend && (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginTop: 8 }}>
              {trend.values.map((v: number, i: number) => (
                <View key={i} style={{ width: 16, height: Math.max(4, Math.min(80, v)), backgroundColor: '#6C63FF', borderRadius: 4, opacity: 0.9 }} />
              ))}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
              {trend.labels.map((l: string, i: number) => (
                <Text key={i} style={{ color: '#6B7280', fontSize: 12 }}>{l}</Text>
              ))}
            </View>
            <ThemedText style={{ marginTop: 6 }}>Δ distância: {trend.delta.toFixed(1)} km</ThemedText>
          </>
        )}
      </ThemedView>

      {paceSeries && (
        <ThemedView style={styles.card}> 
          <ThemedText type="subtitle">Pace (s/km)</ThemedText>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginTop: 8 }}>
            {paceSeries.values.map((v: number, i: number) => (
              <View key={i} style={{ width: 16, height: Math.max(4, Math.min(80, v / 10)), backgroundColor: '#10B981', borderRadius: 4, opacity: 0.9 }} />
            ))}
          </View>
        </ThemedView>
      )}

      {timeSeries && (
        <ThemedView style={styles.card}> 
          <ThemedText type="subtitle">Tempo (min)</ThemedText>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginTop: 8 }}>
            {timeSeries.values.map((v: number, i: number) => (
              <View key={i} style={{ width: 16, height: Math.max(4, Math.min(80, v / 10)), backgroundColor: '#3B82F6', borderRadius: 4, opacity: 0.9 }} />
            ))}
          </View>
        </ThemedView>
      )}

      {caloriesSeries && (
        <ThemedView style={styles.card}> 
          <ThemedText type="subtitle">Calorias</ThemedText>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginTop: 8 }}>
            {caloriesSeries.values.map((v: number, i: number) => (
              <View key={i} style={{ width: 16, height: Math.max(4, Math.min(80, v / 20)), backgroundColor: '#F59E0B', borderRadius: 4, opacity: 0.9 }} />
            ))}
          </View>
        </ThemedView>
      )}

      {communityAvg !== null && trend && (
        <ThemedView style={styles.card}> 
          <ThemedText type="subtitle">Comparação com comunidade</ThemedText>
          <ThemedText>Sua última {period === 'week' ? 'semana' : period === 'month' ? 'mês' : 'ano'}: {trend.values[trend.values.length - 1]?.toFixed?.(1) ?? trend.values[trend.values.length - 1]}</ThemedText>
          <ThemedText>Média comunidade: {communityAvg} km</ThemedText>
        </ThemedView>
      )}

      <ThemedView style={styles.card}> 
        <ThemedText type="subtitle">Exportar</ThemedText>
        <View style={styles.row}> 
          <Pressable onPress={exportCsv} style={styles.btn}><Text style={styles.btnText}>CSV</Text></Pressable>
          <Pressable onPress={exportJson} style={styles.btn}><Text style={styles.btnText}>JSON</Text></Pressable>
          <Pressable onPress={exportImage} style={[styles.btn, { backgroundColor: '#6C63FF' }]}><Text style={styles.btnText}>Imagem</Text></Pressable>
          <Pressable onPress={exportPdf} style={[styles.btn, { backgroundColor: '#6C63FF' }]}><Text style={styles.btnText}>PDF</Text></Pressable>
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
  pill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
});

