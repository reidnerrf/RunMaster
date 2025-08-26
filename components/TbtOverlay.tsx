import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function TbtOverlay({ instruction, distanceM, offRoute }: { instruction?: string; distanceM?: number; offRoute?: boolean }) {
  const { theme } = useTheme();
  if (!instruction) return null;
  return (
    <View style={[styles.wrap, { backgroundColor: 'rgba(38,38,38,0.9)', borderColor: theme.colors.border }]}> 
      <Text style={[styles.instr, { color: '#fff' }]}>{instruction}</Text>
      {typeof distanceM === 'number' && <Text style={{ color: '#fff' }}>{distanceM} m</Text>}
      {offRoute && <Text style={{ color: '#FFD166', marginTop: 4 }}>Fora da rota — recalculando…</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', top: 12, left: 12, right: 12, borderRadius: 16, padding: 12, borderWidth: 1 },
  instr: { fontSize: 18, fontWeight: '800' },
});