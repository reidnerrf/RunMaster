import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import type { TrackPoint } from '../hooks/useRunTracker';

// Attempt to load react-native-svg lazily to avoid hard crash if missing
let SvgLib: any = null;
try { SvgLib = require('react-native-svg'); } catch {}

export type MapTraceProps = {
  points: TrackPoint[];
  height?: number;
};

export default function MapTrace({ points, height = 240 }: MapTraceProps) {
  const { theme } = useTheme();

  const { viewBox, polyPoints, start, end } = useMemo(() => {
    if (!points || points.length === 0) return { viewBox: '0 0 100 100', polyPoints: '', start: null as any, end: null as any };
    const lats = points.map((p) => p.latitude);
    const lons = points.map((p) => p.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const pad = 0.0005; // padding degrees
    const w = Math.max(0.00001, maxLon - minLon) + pad * 2;
    const h = Math.max(0.00001, maxLat - minLat) + pad * 2;

    const vb = `0 0 ${w} ${h}`;
    const mapPoint = (p: TrackPoint) => {
      const x = p.longitude - (minLon - pad);
      // Invert Y so north is up; lat increases northwards so we invert because SVG y grows downward
      const y = (maxLat + pad) - p.latitude;
      return `${x},${y}`;
    };
    const poly = points.map(mapPoint).join(' ');
    return { viewBox: vb, polyPoints: poly, start: mapPoint(points[0]), end: mapPoint(points[points.length - 1]) };
  }, [points]);

  if (!SvgLib || points.length === 0) {
    return (
      <View style={[styles.fallback, { height, backgroundColor: theme.colors.card }]}> 
        <Text style={{ color: theme.colors.muted }}>Mapa (visualização)</Text>
      </View>
    );
  }

  const { Svg, Polyline, Circle, Defs, LinearGradient, Stop, Rect } = SvgLib;

  return (
    <View style={[styles.container, { height }]}> 
      <Svg width="100%" height="100%" viewBox={viewBox} preserveAspectRatio="xMidYMid meet">
        <Defs>
          <LinearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={theme.colors.card} stopOpacity="1" />
            <Stop offset="100%" stopColor={theme.colors.background} stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="trace" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={theme.colors.primary} />
            <Stop offset="100%" stopColor={theme.colors.secondary} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#bg)" rx="8" />
        <Polyline points={polyPoints} fill="none" stroke="url(#trace)" strokeWidth={0.0001} strokeLinejoin="round" strokeLinecap="round" />
        {start && <Circle cx={start.split(',')[0]} cy={start.split(',')[1]} r={0.0002} fill="#2ECC71" />}
        {end && <Circle cx={end.split(',')[0]} cy={end.split(',')[1]} r={0.0002} fill="#E74C3C" />}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', overflow: 'hidden', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  fallback: { width: '100%', alignItems: 'center', justifyContent: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
});