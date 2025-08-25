import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

let SvgLib: any = null;
try { SvgLib = require('react-native-svg'); } catch {}

export type SplitDatum = { km: number; paceSec: number; avgHr?: number };

export default function PaceHrChart({ data, height = 180 }: { data: SplitDatum[]; height?: number }) {
  const { theme } = useTheme();
  if (!data || data.length === 0) return null;

  if (!SvgLib) {
    return (
      <View style={[styles.fallback, { height, backgroundColor: theme.colors.card }]}> 
        <Text style={{ color: theme.colors.muted }}>Gráfico (instale react-native-svg para visual avançada)</Text>
      </View>
    );
  }

  const { Svg, Rect, Defs, LinearGradient, Stop, Polyline, Text: SvgText, Circle } = SvgLib;

  const maxKm = data[data.length - 1].km;
  const maxHr = Math.max(...data.map(d => d.avgHr || 0), 160);
  const paceVals = data.map(d => d.paceSec);
  const minPace = Math.min(...paceVals);
  const maxPace = Math.max(...paceVals);

  const padX = 8; const padY = 8;
  const W = maxKm * 40 + padX * 2; // 40px per km
  const H = height;

  const x = (km: number) => padX + ((km - 0.5) * 40);
  const yPace = (val: number) => padY + (H - padY * 2) * (1 - (val - minPace) / Math.max(1, (maxPace - minPace)));
  const yHr = (val: number) => padY + (H - padY * 2) * (1 - (val - 100) / Math.max(1, (maxHr - 100)));

  const pacePoints = data.map(d => `${x(d.km)},${yPace(d.paceSec)}`).join(' ');
  const hrPoints = data.filter(d => d.avgHr).map(d => `${x(d.km)},${yHr(d.avgHr as number)}`).join(' ');

  return (
    <View style={[styles.container]}> 
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs>
          <LinearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={theme.colors.card} />
            <Stop offset="100%" stopColor={theme.colors.background} />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={W} height={H} fill="url(#bg)" rx={12} />
        {/* Pace line */}
        <Polyline points={pacePoints} fill="none" stroke={theme.colors.primary} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {/* HR line */}
        {hrPoints && <Polyline points={hrPoints} fill="none" stroke={theme.colors.secondary} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />}
        {/* Markers */}
        {data.map(d => (
          <Circle key={`p-${d.km}`} cx={x(d.km)} cy={yPace(d.paceSec)} r={3} fill={theme.colors.primary} />
        ))}
        {data.filter(d => d.avgHr).map(d => (
          <Circle key={`h-${d.km}`} cx={x(d.km)} cy={yHr(d.avgHr as number)} r={3} fill={theme.colors.secondary} />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  fallback: { width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
});