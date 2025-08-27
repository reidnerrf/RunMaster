import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, ScrollView, RefreshControl } from 'react-native';
import SectionTitle from '../../components/SectionTitle';
import { useGate } from '../../hooks/useGate';
import { useTheme } from '../../hooks/useTheme';
import { summarize, getRuns } from '../../Lib/runStore';
import { useAuth } from '../../hooks/useAuth';
import { pushUnsyncedRuns } from '../../Lib/sync';
import PaceHrChart from '../../components/Charts';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ListItem from '../../components/ui/ListItem';
import SparkBar from '../../components/ui/SparkBar';
import AppBar from '../../components/ui/AppBar';
import { t as tt } from '../../utils/i18n';

export default function StatsScreen() {
  const { requirePremium } = useGate();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [mode, setMode] = useState<'week' | 'month'>('week');
  const [summary, setSummary] = useState({ totalDistanceKm: 0, totalDurationSec: 0, weekDistanceKm: 0, monthDistanceKm: 0 });
  const [refreshing, setRefreshing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);
  const [lastRunSplits, setLastRunSplits] = useState<{ km: number; paceSec: number; avgHr?: number }[] | null>(null);

  const load = async () => {
    setSummary(await summarize());
    const runs = await getRuns();
    const last = runs[0];
    setLastRunSplits(last?.splits ? last.splits.map(s => ({ km: s.km, paceSec: s.paceSec, avgHr: s.avgHr })) : null);
  };

  useEffect(() => {
    load();
  }, []);

  const bars = new Array(7).fill(0).map(() => Math.random() * 100 + 40);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const doSync = async () => {
    if (!user) return;
    setSyncMsg('Sincronizando...');
    try {
      const res = await pushUnsyncedRuns(user.id);
      setSyncMsg(res.pushed > 0 ? `Enviado ${res.pushed}` : 'Tudo sincronizado');
    } catch {
      setSyncMsg('Falha ao sincronizar');
    }
    setTimeout(() => setSyncMsg(null), 1500);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={{ padding: 16 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}>
      <AppBar title={tt('stats_title')} subtitle={tt('stats_subtitle')} />
      <SectionTitle title={tt('stats_title')} subtitle="Desempenho e progresso" />

      <View style={[styles.syncRow]}> 
        <Button title={syncMsg ?? 'Sincronizar corridas'} variant="outline" onPress={doSync} />
      </View>

      <View style={[styles.switcher, { backgroundColor: theme.colors.backgroundCard, borderColor: theme.colors.border }]}> 
        <Pressable onPress={() => setMode('week')} style={[styles.switchBtn, { backgroundColor: mode === 'week' ? theme.colors.primary : 'transparent' }]}> 
          <Text style={{ color: mode === 'week' ? 'white' : theme.colors.text }}>Semanal</Text>
        </Pressable>
        <Pressable onPress={() => setMode('month')} style={[styles.switchBtn, { backgroundColor: mode === 'month' ? theme.colors.primary : 'transparent' }]}> 
          <Text style={{ color: mode === 'month' ? 'white' : theme.colors.text }}>Mensal</Text>
        </Pressable>
      </View>

      <Card>
        <Text style={[styles.title, { color: theme.colors.text }]}>Distância total</Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>{summary.totalDistanceKm.toFixed(2)} km</Text>
        <Text style={{ color: theme.colors.muted }}>Esta semana: {summary.weekDistanceKm.toFixed(2)} km • Este mês: {summary.monthDistanceKm.toFixed(2)} km</Text>
      </Card>

      <SectionTitle title="Gráfico" subtitle="Ritmo/Distância" />
      <Card>
        <SparkBar data={bars} />
      </Card>

      {lastRunSplits && lastRunSplits.length > 0 && (
        <>
          <SectionTitle title="Último treino" subtitle="Pace/BPM por km" />
          <PaceHrChart data={lastRunSplits} />
        </>
      )}

      <Button title="Exportar Relatório (PDF - Premium)" variant="outline" onPress={requirePremium(() => {}, 'stats_export')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  syncRow: { marginBottom: 10 },
  syncBtn: { borderWidth: 1, borderRadius: 12, padding: 10, alignSelf: 'flex-start' },
  switcher: { flexDirection: 'row', borderWidth: 1, borderRadius: 12, padding: 6, gap: 6 },
  switchBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  card: { borderRadius: 16, padding: 14, marginTop: 10 },
  title: { fontWeight: '800' },
  value: { fontSize: 28, fontWeight: '900' },
  exportBtn: { borderWidth: 1, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 14 },
});