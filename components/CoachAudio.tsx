import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { getSettings } from '../Lib/settings';

let Speech: any = null;
try { Speech = require('expo-speech'); } catch {}


export default function CoachAudio({ active, paceStr, distanceKm }: { active: boolean; paceStr: string; distanceKm: number; }) {
  const spokenRef = useRef<number>(0);
  const lastBpmRef = useRef<number>(0);

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

  // Music adaptive stub: compute target BPM from pace and emit logs
  useEffect(() => {
    if (!active) return;
    // simple conversion: pace mm:ss -> bpm ≈ 180 - 20*(min/km - 5)
    const [mm, ss] = paceStr.split(':').map((x) => parseInt(x || '0', 10));
    const minPerKm = (mm || 0) + (ss || 0) / 60;
    const targetBpm = Math.max(110, Math.min(190, Math.round(180 - 20 * (minPerKm - 5))));
    if (Math.abs(targetBpm - lastBpmRef.current) >= 5) {
      lastBpmRef.current = targetBpm;
      // This is where an integration with Spotify/Apple Music would adjust playback BPM/playlist
      console.log('[music-adaptive] target BPM ->', targetBpm);
    }
  }, [active, paceStr]);

  return null;
}

const styles = StyleSheet.create({});