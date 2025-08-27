import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { getSettings } from '../Lib/settings';
import * as Haptics from 'expo-haptics';

let Speech: any = null;
try { Speech = require('expo-speech'); } catch {}

export default function CoachAudio({ active, paceStr, distanceKm, heartRate, elapsedSec }: { active: boolean; paceStr: string; distanceKm: number; heartRate?: number; elapsedSec?: number; }) {
  const kmSpokenRef = useRef<number>(0);
  const phaseRef = useRef<string | null>(null);
  const lastTempoRef = useRef<number>(0);
  const [connected, setConnected] = useState({ spotify: false, health: false });
  const metroTimerRef = useRef<any>(null);

  useEffect(() => {
    getSettings().then((s) => setConnected({ spotify: !!s.spotifyConnected, health: !!s.healthConnected })).catch(() => {});
  }, []);

  const minPerKm = useMemo(() => {
    if (!paceStr || paceStr.includes('--')) return null as number | null;
    const [mm, ss] = paceStr.split(':').map((x) => parseInt(x, 10));
    if (Number.isNaN(mm) || Number.isNaN(ss)) return null as number | null;
    return mm + ss / 60;
  }, [paceStr]);

  const targetBpm = useMemo(() => {
    if (!minPerKm) return null as number | null;
    // Map pace to music tempo: ~180 BPM at 4:00, ~150 at 6:00, clamp 120-180
    const bpm = 180 - Math.max(0, (minPerKm - 4)) * 15;
    return Math.max(120, Math.min(180, Math.round(bpm)));
  }, [minPerKm]);

  const phase = useMemo(() => {
    const t = elapsedSec ?? 0;
    if (t < 300) return 'aquecimento';
    if (t > 1800) return 'desacelerar';
    return 'ritmo';
  }, [elapsedSec]);

  // Kilometer cheers
  useEffect(() => {
    if (!active || !Speech) return;
    const km = Math.floor(distanceKm);
    if (km > 0 && km !== kmSpokenRef.current) {
      kmSpokenRef.current = km;
      const msg = `Você completou ${km} quilômetros. Ritmo ${paceStr} por quilômetro.`;
      try { Speech.speak(msg, { language: 'pt-BR' }); } catch {}
    }
  }, [active, distanceKm, paceStr]);

  // Phase and tempo guidance (stub for adaptive music controller)
  useEffect(() => {
    if (!active || !Speech) return;
    const prev = phaseRef.current;
    if (prev !== phase) {
      phaseRef.current = phase;
      const msg = connected.spotify
        ? `Trocando playlist para ${phase}.`
        : `Modo ${phase}. Ajuste seu ritmo.`;
      try { Speech.speak(msg, { language: 'pt-BR' }); } catch {}
    }
  }, [active, phase, connected.spotify]);

  useEffect(() => {
    if (!active || !Speech || targetBpm == null) return;
    const last = lastTempoRef.current || 0;
    if (Math.abs(targetBpm - last) >= 8) {
      lastTempoRef.current = targetBpm;
      const msg = connected.spotify
        ? `Ajustando a batida para ${targetBpm} BPM.`
        : `Alvo de cadência musical ${targetBpm} BPM.`;
      try { Speech.speak(msg, { language: 'pt-BR' }); } catch {}
    }
  }, [active, targetBpm, connected.spotify]);

  // Simple HR zone warnings when health is connected (stub)
  useEffect(() => {
    if (!active || !Speech || !connected.health || !heartRate) return;
    const hr = Math.round(heartRate);
    if (hr >= 180) {
      try { Speech.speak('Atenção: frequência muito alta. Reduza o ritmo.', { language: 'pt-BR' }); } catch {}
    }
  }, [active, connected.health, heartRate]);

  // Haptic metronome ticks
  useEffect(() => {
    if (!active || !targetBpm) { if (metroTimerRef.current) { clearInterval(metroTimerRef.current); metroTimerRef.current = null; } return; }
    const intervalMs = Math.max(250, Math.round(60000 / targetBpm));
    if (metroTimerRef.current) clearInterval(metroTimerRef.current);
    metroTimerRef.current = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }, intervalMs);
    return () => { if (metroTimerRef.current) { clearInterval(metroTimerRef.current); metroTimerRef.current = null; } };
  }, [active, targetBpm]);

  return null;
}

const styles = StyleSheet.create({});