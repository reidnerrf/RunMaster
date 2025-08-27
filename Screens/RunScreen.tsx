import { useNavigation, useRoute } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import AppBar from '../components/ui/AppBar';
import { t as tt } from '../../utils/i18n';
import { Cloud, Thermometer, Wind, MapPin, Timer, Activity as ActivityIcon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AchievementToast from '../components/AchievementToast';
import ActionButton from '../components/ActionButton';
import AnimatedBadge from '../components/AnimatedBadge';
import CoachAudio from '../components/CoachAudio';
import IconButton from '../components/IconButton';
import MapLive from '../components/MapLive';
import { MetricGrid } from '../components/Metrics';
import POIOverlay from '../components/POIOverlay';
import { useAuth } from '../hooks/useAuth';
import { useGate } from '../hooks/useGate';
import { formatHHMMSS, useRunTracker } from '../hooks/useRunTracker';
import { useTheme } from '../hooks/useTheme';
import { addRun } from '../Lib/runStore';
import { getSettings, setSafetyLayers } from '../Lib/settings';
import { buildMockRoute, nextTbt, TbtStep } from '../Lib/tbt';
import TbtOverlay from '../components/TbtOverlay';
import { cueHaptic, speakInstruction } from '../Lib/tbt_voice';
import BackToStartBadge from '../components/BackToStartBadge';
import { buildShareUrl, getLive, pingLive, startLive, stopLive } from '../Lib/live';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { getCurrentWeather } from '@/utils/weatherService';
import { track } from '@/utils/analyticsClient';
import { handleEvent as handleGameEvent } from '@/utils/gamificationEngine';

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
  const [tbtInfo, setTbtInfo] = useState<{ instruction?: string; distanceM?: number; offRoute?: boolean } | null>(null);
  const lastCueRef = useRef<'100'|'20'|null>(null);

  const [liveLink, setLiveLink] = useState<string | null>(null);
  const startPointRef = useRef<{ lat: number; lon: number } | null>(null);
  const [weather, setWeather] = useState<{ temp?: number; desc?: string } | null>(null);

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
    setTbtInfo({ instruction: nxt.nextInstruction, distanceM: nxt.distanceToNextM, offRoute: nxt.offRoute });
    if (nxt.nextInstruction && typeof nxt.distanceToNextM === 'number') {
      const d = nxt.distanceToNextM;
      if (d <= 25 && lastCueRef.current !== '20') { lastCueRef.current = '20'; cueHaptic(20); speakInstruction('Agora ' + nxt.nextInstruction.toLowerCase()); }
      else if (d <= 120 && lastCueRef.current !== '100') { lastCueRef.current = '100'; cueHaptic(100); speakInstruction('Em 100 metros: ' + nxt.nextInstruction.toLowerCase()); }
      if (d > 150) lastCueRef.current = null;
    }
  }, [state.path, tbtSteps]);

  useEffect(() => {
    (async () => {
      const last = state.path[state.path.length - 1] || state.path[0];
      if (!last) return;
      const w = await getCurrentWeather(last.latitude, last.longitude);
      if (w?.current) setWeather({ temp: w.current.temperature, desc: w.current.description });
    })().catch(() => {});
  }, [state.path]);

  useEffect(() => {
    getSettings().then((s) => setLayers(s.safetyLayers)).catch(() => {});
  }, []);

  useEffect(() => {
    if (state.path[0] && !startPointRef.current) startPointRef.current = { lat: state.path[0].latitude, lon: state.path[0].longitude };
  }, [state.path]);

  useEffect(() => { (async () => { const s = await getLive(); if (s?.active) setLiveLink(buildShareUrl(s.id)); })(); }, []);
  useEffect(() => {
    if (!liveLink) return; const t = setInterval(() => { pingLive().catch(() => {}); }, 15000); return () => clearInterval(t);
  }, [liveLink]);

  const toggleLive = async () => {
    if (liveLink) { await stopLive(); setLiveLink(null); return; }
    const s = await startLive(); setLiveLink(buildShareUrl(s.id));
  };

  const shareOrCopy = async () => {
    if (!liveLink) return; try { await Clipboard.setStringAsync(liveLink); } catch {}
  };

  const callSOS = async () => {
    const tel = 'tel:190'; try { await Linking.openURL(tel); } catch {}
  };

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
    try {
      await track('run_completed', {
        distance_km: Number(state.distanceKm.toFixed(3)),
        duration_s: state.elapsedSec,
        calories: state.calories,
      });
    } catch {}
    try {
      handleGameEvent({ type: 'run_completed', distanceKm: Number(state.distanceKm.toFixed(3)), durationMin: Math.round(state.elapsedSec / 60) });
    } catch {}
    // Navigate to summary/share screen
    // @ts-ignore
    (nav as any).navigate('RunSummary', { runId: newId });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <AppBar title={tt('run_title')} />
      <View style={{ position: 'relative' }}>        <MapLive points={state.path} showLighting={layers.lighting} showAirQuality={layers.airQuality} showWeather={layers.weather} pois={livePois} overlayMetrics={{ distanceKm: state.distanceKm, paceStr: state.paceStr, calories: state.calories }} />
        <TbtOverlay instruction={tbtInfo?.instruction} distanceM={tbtInfo?.distanceM} offRoute={tbtInfo?.offRoute} />
        <BackToStartBadge start={startPointRef.current || undefined} current={state.path[state.path.length-1] ? { lat: state.path[state.path.length-1].latitude, lon: state.path[state.path.length-1].longitude } : undefined} />
        {weather && (
          <View style={{ position: 'absolute', right: 12, top: 12, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.border }}> 
            <Text style={{ color: theme.colors.text, fontWeight: '800' }}>{Math.round(weather.temp!)}°C</Text>
            <Text style={{ color: theme.colors.muted, fontSize: 12 }}>{weather.desc}</Text>
          </View>
        )}
        {state.isAutoPaused && (
          <View style={[styles.autoPauseBadge, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}> 
            <Text style={{ color: theme.colors.muted }}>Pausado automaticamente</Text>
          </View>
        )}
      </View>
      {isPremium && <CoachAudio active={state.status === 'running'} paceStr={state.paceStr} distanceKm={state.distanceKm} heartRate={state.heartRate} elapsedSec={state.elapsedSec} />}
      {isPremium && <POIOverlay path={state.path} enabled={state.status === 'running'} onPoisChanged={(pois) => {
        setLivePois(pois.filter(p => !p.collected).map(p => ({ id: p.id, latitude: p.latitude, longitude: p.longitude, type: 'collectible' as const, label: p.type === 'coin' ? 'Moeda' : 'Estrela' })));
      }} />}

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 + insets.bottom }}>
        <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}> 
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#3b82f611', alignItems: 'center', justifyContent: 'center' }}>
                <Cloud size={20} color={'#3b82f6'} />
              </View>
              <View>
                <Text style={{ color: theme.colors.text, fontWeight: '800' }}>São Paulo</Text>
                <Text style={{ color: theme.colors.muted, fontSize: 12 }}>{weather?.desc || 'Parcialmente nublado'}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Thermometer size={14} color={'#ef4444'} />
                <Text style={{ color: theme.colors.text }}>{Math.round(weather?.temp || 22)}°C</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Wind size={14} color={'#3b82f6'} />
                <Text style={{ color: theme.colors.text }}>15 km/h</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.topRow}>
          <View style={styles.topBlock}>
            <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: theme.colors.primary + '11', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
              <Timer size={18} color={theme.colors.primary} />
            </View>
            <Text style={[styles.topValue, { color: theme.colors.text }]}>{formatHHMMSS(state.elapsedSec)}</Text>
            <Text style={[styles.topLabel, { color: theme.colors.muted }]}>Tempo</Text>
          </View>
          <View style={styles.topBlock}>
            <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#ef444411', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
              <ActivityIcon size={18} color={'#ef4444'} />
            </View>
            <Text style={[styles.topValue, { color: theme.colors.text }]}>{state.paceStr}</Text>
            <Text style={[styles.topLabel, { color: theme.colors.muted }]}>Pace /km</Text>
          </View>
        </View>

        <View style={styles.bigMetricBox}>
          <Text style={[styles.bigMetric, { color: theme.colors.text }]}>{state.paceStr}</Text>
          <Text style={{ color: theme.colors.muted }}>min/km</Text>
        </View>

        <MetricGrid items={[
          { label: 'Distância', value: `${state.distanceKm.toFixed(2)} km`, icon: <MapPin size={14} color={theme.colors.text} /> },
          { label: 'Calorias', value: `${state.calories}`, icon: <ActivityIcon size={14} color={theme.colors.text} /> },
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

        <View style={[styles.coachBox, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}> 
          <Text style={[styles.coachTitle, { color: theme.colors.text }]}>Visibilidade</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <Text style={{ color: theme.colors.text }}>Modo alto contraste</Text>
            <Switch value={(useTheme() as any).mode === 'high'} onValueChange={(v) => (useTheme() as any).setMode(v ? 'high' : 'light')} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <Text style={{ color: theme.colors.text }}>Auto outdoor à noite</Text>
            <Switch value={(useTheme() as any).autoOutdoor} onValueChange={(v) => (useTheme() as any).setAutoOutdoor(v)} />
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
        <IconButton onPress={toggleLive} color={liveLink ? '#FF7E47' : '#95A5A6'}><Text>📡</Text></IconButton>
        <IconButton onPress={shareOrCopy} color="#8E44AD"><Text>🔗</Text></IconButton>
        <IconButton onPress={callSOS} color="#E74C3C"><Text>🆘</Text></IconButton>
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