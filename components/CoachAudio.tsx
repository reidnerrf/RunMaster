import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';

let Speech: any = null;
try { Speech = require('expo-speech'); } catch {}

export default function CoachAudio({ active, paceStr, distanceKm }: { active: boolean; paceStr: string; distanceKm: number; }) {
  const spokenRef = useRef<number>(0);
  const lastBpmRef = useRef<number>(0);

  useEffect(() => {
    if (!active || !Speech) return;
    const km = Math.floor(distanceKm);
    if (km > 0 && km !== spokenRef.current) {
      spokenRef.current = km;
      const msg = `Você completou ${km} quilômetros. Ritmo médio ${paceStr} por quilômetro. Continue!`;
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