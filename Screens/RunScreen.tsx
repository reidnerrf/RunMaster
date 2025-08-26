import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Switch } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AnimatedBadge from '../components/AnimatedBadge';
import IconButton from '../components/IconButton';
import { useAuth } from '../hooks/useAuth';
import { MetricGrid } from '../components/Metrics';
import ActionButton from '../components/ActionButton';
import { useGate } from '../hooks/useGate';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { addRun } from '../Lib/runStore';
import AchievementToast from '../components/AchievementToast';
import { useRunTracker, formatHHMMSS } from '../hooks/useRunTracker';
import MapLive from '../components/MapLive';
import CoachAudio from '../components/CoachAudio';
import POIOverlay from '../components/POIOverlay';
import { getSettings, setSafetyLayers } from '../Lib/settings';
import { buildMockRoute, nextTbt, TbtStep } from '../Lib/tbt';
import TbtOverlay from '../components/TbtOverlay';

export default function RunScreen() {
  const nav = useNavigation();
  const route = useRoute<any>();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { isPremium, open, requirePremium } = useGate();

  const { state, start, pause, resume, finish, getSplits } = useRunTracker({ assumedWeightKg: 72 });
  const [milestone, setMilestone] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const startedRef = useRef(false);
  const [layers, setLayers] = useState({ lighting: false, airQuality: false, weather: false });

  const [livePois, setLivePois] = useState<{ id: string; latitude: number; longitude: number; type: 'water'|'toilet'|'park'|'challenge'|'collectible'; label?: string }[]>([]);

  // TBT mock steps (centrados no primeiro ponto quando disponível)
  const [tbtSteps, setTbtSteps] = useState<TbtStep[] | null>(null);
  const [tbtIdx, setTbtIdx] = useState(0);
  const [tbtInfo, setTbtInfo] = useState<{ instruction?: string; distanceM?: number } | null>(null);

  useEffect(() => {
    const p = state.path[0];
    const center = p ? { lat: p.latitude, lon: p.longitude } : { lat: -23.55, lon: -46.63 };
    setTbtSteps(buildMockRoute(center));
  }, []);

  useEffect(() => {
    if (!tbtSteps || state.path.length === 0) return;
    const last = state.path[state.path.length - 1];
    const nxt = nextTbt({ lat: last.latitude, lon: last.longitude }, tbtSteps, tbtIdx);
    setTbtIdx(nxt.currentIndex);
    setTbtInfo({ instruction: nxt.nextInstruction, distanceM: nxt.distanceToNextM });
  }, [state.path, tbtSteps]);

  useEffect(() => {
    getSettings().then((s) => setLayers(s.safetyLayers)).catch(() => {});
  }, []);

  // Start automatically with 3-2-1 for guided workouts
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    if (route?.params?.from === 'Workouts') {
      setCountdown(3);
      const t = setInterval(() => {
        setCountdown((c) => {
          if (!c || c <= 1) { clearInterval(t); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}); start(); return null; }
          Haptics.selectionAsync().catch(() => {});
          return c - 1;
        });
      }, 800);
      return () => clearInterval(t);
    } else {
      start();
    }
  }, [route?.params, start]);

  // Show milestone toast on each new integer km
  const lastKmRef = useRef(0);
  useEffect(() => {
    const km = state.lastMilestoneKm;
    if (km > 0 && km !== lastKmRef.current) {
      lastKmRef.current = km;
      setMilestone(`${km} km 🎉`);
      setTimeout(() => setMilestone(null), 2000);
    }
  }, [state.lastMilestoneKm]);

  const finishRun = async () => {
    finish();
    const newId = Date.now().toString();
    await addRun({
      id: newId,
      startedAt: Date.now() - state.elapsedSec * 1000,
      durationSec: state.elapsedSec,
      distanceKm: Number(state.distanceKm.toFixed(3)),
      calories: state.calories,
      avgPace: state.paceStr,
      path: state.path,
      splits: getSplits(),
      synced: false,
    });
    // Navigate to summary/share screen
    // @ts-ignore
    (nav as any).navigate('RunSummary', { runId: newId });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={{ position: 'relative' }}>        <MapLive points={state.path} showLighting={layers.lighting} showAirQuality={layers.airQuality} showWeather={layers.weather} pois={livePois} overlayMetrics={{ distanceKm: state.distanceKm, paceStr: state.paceStr, calories: state.calories }} />
        <TbtOverlay instruction={tbtInfo?.instruction} distanceM={tbtInfo?.distanceM} />
        {state.isAutoPaused && (
          <View style={[styles.autoPauseBadge, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}> 
            <Text style={{ color: theme.colors.muted }}>Pausado automaticamente</Text>
          </View>
        )}
      </View>
      {isPremium && <CoachAudio active={state.status === 'running'} paceStr={state.paceStr} distanceKm={state.distanceKm} heartRate={state.heartRate} elapsedSec={state.elapsedSec} />}
      {isPremium && <POIOverlay path={state.path} enabled={state.status === 'running'} onPoisChanged={(pois) => {
        setLivePois(pois.filter(p => !p.collected).map(p => ({ id: p.id, latitude: p.latitude, longitude: p.longitude, type: 'collectible' as const, label: p.type === 'coin' ? 'Moeda' : 'Estrela' })));
      }} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 + insets.bottom }}>
        <View style={styles.topRow}>
          <View style={styles.topBlock}>
            <Text style={[styles.topLabel, { color: theme.colors.muted }]}>Tempo {state.isAutoPaused ? '(auto-pause)' : ''}</Text>
            <Text style={[styles.topValue, { color: theme.colors.text }]}>{formatHHMMSS(state.elapsedSec)}</Text>
          </View>
          <View style={styles.topBlock}>
            <Text style={[styles.topLabel, { color: theme.colors.muted }]}>BPM</Text>
            <Text style={[styles.topValue, { color: theme.colors.text }]}>{Math.round(state.heartRate)}</Text>
          </View>
        </View>

        <View style={styles.bigMetricBox}>
          <Text style={[styles.bigMetric, { color: theme.colors.text }]}>{state.paceStr}</Text>
          <Text style={{ color: theme.colors.muted }}>min/km</Text>
        </View>

        <MetricGrid items={[
          { label: 'Distância', value: `${state.distanceKm.toFixed(2)} km` },
          { label: 'Calorias', value: `${state.calories}` },
        ]} />

        <AnimatedBadge label={state.distanceKm >= 1 ? '🔥 Acelere!' : 'Vamos!'} />

        <View style={[styles.coachBox, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}> 
          <Text style={[styles.coachTitle, { color: theme.colors.text }]}>Camadas de segurança</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <Text style={{ color: theme.colors.text }}>Iluminação</Text>
            <Switch value={layers.lighting} onValueChange={async (v) => { const next = await setSafetyLayers({ lighting: v }); setLayers(next.safetyLayers); }} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <Text style={{ color: theme.colors.text }}>Qualidade do ar</Text>
            <Switch value={layers.airQuality} onValueChange={async (v) => { const next = await setSafetyLayers({ airQuality: v }); setLayers(next.safetyLayers); }} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <Text style={{ color: theme.colors.text }}>Clima</Text>
            <Switch value={layers.weather} onValueChange={async (v) => { const next = await setSafetyLayers({ weather: v }); setLayers(next.safetyLayers); }} />
          </View>
        </View>

        {!isPremium && (
          <Pressable onPress={requirePremium(() => {}, 'run_coach')} style={[styles.coachBox, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}> 
            <Text style={[styles.coachTitle, { color: theme.colors.text }]}>Coach Virtual (Premium)</Text>
            <Text style={[styles.coachBody, { color: theme.colors.muted }]}>Dicas por áudio adaptadas ao seu ritmo</Text>
          </Pressable>
        )}
      </ScrollView>

      <View style={[styles.bottomBar, theme.shadows.light, { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border, paddingBottom: 10 + insets.bottom }]}> 
        {state.status === 'running' ? (
          <ActionButton label="Pausar" color="#FFD166" textColor="#1E1E1E" onPress={pause} />
        ) : (
          <ActionButton label="Retomar" color="#06D6A0" textColor="#1E1E1E" onPress={resume} />
        )}
        <ActionButton label="Finalizar" color="#EF476F" onPress={finishRun} />
        <IconButton onPress={() => {}} color="#1DB954"><Text>🎵</Text></IconButton>
      </View>

      {countdown !== null && (
        <View style={styles.countdownOverlay}>
          <Text style={styles.countdownText}>{countdown}</Text>
        </View>
      )}
      <AchievementToast visible={!!milestone} label={milestone || ''} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  topBlock: { flex: 1, alignItems: 'center' },
  topLabel: { fontSize: 12 },
  topValue: { fontSize: 20, fontWeight: '800' },
  bigMetricBox: { alignItems: 'center', marginVertical: 10 },
  bigMetric: { fontSize: 64, fontWeight: '900' },
  coachBox: { borderWidth: 1, borderRadius: 14, padding: 12, marginTop: 14 },
  coachTitle: { fontWeight: '800' },
  coachBody: { },
  countdownOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.2)' },
  countdownText: { fontSize: 72, fontWeight: '900', color: 'white' },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 14, borderTopWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  autoPauseBadge: { position: 'absolute', top: 12, left: 12, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, borderWidth: 1 },
});