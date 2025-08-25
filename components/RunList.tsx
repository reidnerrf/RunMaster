import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import type { Run } from '../Lib/runStore';

let SvgLib: any = null;
try { SvgLib = require('react-native-svg'); } catch {}

export default function RunList({ runs, onPressItem }: { runs: Run[]; onPressItem?: (run: Run) => void }) {
  const { theme } = useTheme();
  const { Svg, Polyline } = SvgLib || {};
  return (
    <View style={{ gap: 10 }}>
      {runs.map((r) => (
        <Pressable key={r.id} onPress={() => onPressItem?.(r)} style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}> 
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.title, { color: theme.colors.text }]}>{new Date(r.startedAt).toLocaleDateString()}</Text>
            {!r.synced && <Text style={{ color: theme.colors.muted, fontSize: 12 }}>Não sincronizado</Text>}
          </View>
          <Text style={{ color: theme.colors.muted }}>{r.distanceKm.toFixed(2)} km • {r.avgPace} min/km • {Math.round(r.calories)} kcal</Text>
          {SvgLib && r.splits && r.splits.length > 1 && (() => {
            const secs = r.splits!.map((s) => s.paceSec);
            const minS = Math.min(...secs);
            const maxS = Math.max(...secs);
            const toStr = (r.splits!.map((s, i) => {
              const x = i / (r.splits!.length - 1);
              const yn = (s.paceSec - minS) / ((maxS - minS) || 1);
              const y = 1 - yn; // invert so faster pace is higher
              return `${x},${y}`;
            }).join(' '));
            return (
              <Svg width="100%" height={30} viewBox="0 0 1 1" preserveAspectRatio="none">
                <Polyline points={toStr} stroke={theme.colors.primary} strokeWidth={0.01} fill="none" />
              </Svg>
            );
          })()}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 14, padding: 12, borderWidth: 1 },
  title: { fontWeight: '800' },
});