import { useCallback, useEffect, useRef } from 'react';

let Speech: any = null;
try { Speech = require('expo-speech'); } catch {}

export type CoachMetrics = {
  elapsedSec: number;
  distanceKm: number;
  paceStr: string;
  heartRate?: number;
};

export function useAudioCoach({ enabled, getMetrics, intervalSec = 60 }: { enabled: boolean; getMetrics: () => CoachMetrics; intervalSec?: number }) {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const speak = useCallback((msg: string) => {
    if (!enabled) return;
    if (Speech?.speak) Speech.speak(msg, { language: 'pt-BR', pitch: 1.0 });
  }, [enabled]);

  const cheer = useCallback((km: number) => {
    speak(`${km} quilômetros completos! Mantenha o ritmo!`);
  }, [speak]);

  useEffect(() => {
    if (!enabled) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const m = getMetrics();
      if (!m) return;
      const mins = Math.floor(m.elapsedSec / 60);
      const tip = mins % 2 === 0 ? 'Respire pelo nariz e solte pela boca.' : 'Relaxe os ombros e mantenha a passada leve.';
      speak(`Tempo ${mins} minutos. Ritmo ${m.paceStr} por quilômetro. ${tip}`);
    }, intervalSec * 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); timerRef.current = null; };
  }, [enabled, getMetrics, speak, intervalSec]);

  return { speak, cheer };
}