import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import type { Split } from '../Lib/runStore';

let SvgLib: any = null;
try { SvgLib = require('react-native-svg'); } catch {}

export default function PaceHrChart({ splits, height = 180 }: { splits: Split[]; height?: number }) {
  const { theme } = useTheme();

  const data = useMemo(() => {
    const paces = splits.map((s) => s.paceSec);
    const maxP = Math.max(1, ...paces);
    const minP = Math.min(...paces);
    const pad = 8;
    const w = Math.max(1, splits.length - 1);
    const pacePoints = splits.map((s, i) => ({ x: i / w, y: (s.sec - minP) / (maxP - minP || 1) }));

    return { pacePoints };
  }, [splits]);

  if (!SvgLib || splits.length === 0) {
    return (
      <View style={[styles.fallback, { height, backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}> 
        <Text style={{ color: theme.colors.muted }}>Gráfico de ritmo/FC</Text>
      </View>
    );
  }

  const { Svg, Polyline, Line, Defs, LinearGradient, Stop, Rect } = SvgLib;

  const toStr = (pts: { x: number; y: number }[]) => pts.map((p) => `${p.x},${1 - p.y}`).join(' ');
  const paceStr = toStr(data.pacePoints);
  

  return (
    <View style={[styles.container, { height }]}> 
      <Svg width="100%" height="100%" viewBox={`0 0 1 1`} preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="pace" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={theme.colors.primary} />
            <Stop offset="100%" stopColor={theme.colors.secondary} />
          </LinearGradient>
          <LinearGradient id="hr" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#FF6B6B" />
            <Stop offset="100%" stopColor="#FF8E53" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="1" height="1" fill={theme.colors.card} rx="0.02" />
        {/* grid */}
        {[0.25,0.5,0.75].map((g) => <Line key={g} x1={0} y1={g} x2={1} y2={g} stroke={theme.colors.border} strokeWidth={0.002} />)}
        {/* pace polyline */}
        {data.pacePoints.length > 1 && <Polyline points={paceStr} stroke="url(#pace)" strokeWidth={0.01} fill="none" strokeLinejoin="round" strokeLinecap="round" />}
        {/* hr polyline (disabled until health integration provides series) */}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', overflow: 'hidden', borderRadius: 16 },
  fallback: { borderWidth: 1, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});