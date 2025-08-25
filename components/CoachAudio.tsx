import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';

let Speech: any = null;
try { Speech = require('expo-speech'); } catch {}

export default function CoachAudio({ active, paceStr, distanceKm }: { active: boolean; paceStr: string; distanceKm: number; }) {
  const spokenRef = useRef<number>(0);

  useEffect(() => {
    if (!active || !Speech) return;
    const km = Math.floor(distanceKm);
    if (km > 0 && km !== spokenRef.current) {
      spokenRef.current = km;
      const msg = `Você completou ${km} quilômetros. Ritmo médio ${paceStr} por quilômetro. Continue!`;
      try { Speech.speak(msg, { language: 'pt-BR' }); } catch {}
    }
  }, [active, distanceKm, paceStr]);

  return null;
}

const styles = StyleSheet.create({});