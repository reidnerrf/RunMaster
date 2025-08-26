import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import type { TrackPoint } from '../hooks/useRunTracker';

export type POI = { id: string; type: 'coin' | 'star'; latitude: number; longitude: number; collected?: boolean };

function distanceMeters(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371000; // m
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const c = 2 * Math.asin(Math.sqrt(Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2));
  return R * c;
}

export default function POIOverlay({ path, enabled, onPoisChanged }: { path: TrackPoint[]; enabled: boolean; onPoisChanged?: (pois: POI[]) => void }) {
  const { theme } = useTheme();
  const [pois, setPois] = useState<POI[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    // Generate a few POIs around the first point
    if (pois.length === 0 && path.length > 0) {
      const start = path[0];
      const gen = new Array(6).fill(0).map((_, i) => ({
        id: `${Date.now()}_${i}`,
        type: i % 2 === 0 ? 'coin' : 'star',
        latitude: start.latitude + (Math.random() - 0.5) * 0.002,
        longitude: start.longitude + (Math.random() - 0.5) * 0.002,
      }));
      setPois(gen);
      if (onPoisChanged) onPoisChanged(gen);
    }
  }, [enabled, path, pois.length]);

  useEffect(() => {
    if (!enabled || pois.length === 0 || path.length === 0) return;
    const last = path[path.length - 1];
    setPois((prev) => prev.map((p) => {
      if (!p.collected && distanceMeters(p, last) < 20) {
        setScore((s) => s + (p.type === 'coin' ? 10 : 25));
        return { ...p, collected: true };
      }
      return p;
    }));
    if (onPoisChanged) onPoisChanged(pois);
  }, [enabled, path, pois.length]);

  // notify host about POIs to show markers on the map
  useEffect(() => {
    if (!enabled) return;
    onPoisChanged?.(pois);
  }, [enabled, pois, onPoisChanged]);

  if (!enabled) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <View style={[styles.badge, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <Text style={{ color: theme.colors.text, fontWeight: '800' }}>Pontos: {score}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', top: 12, left: 12, right: 12, alignItems: 'flex-start' },
  badge: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
});