import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { computeBearing, haversineM } from '../Lib/tbt';

export default function BackToStartBadge({ start, current }: { start?: { lat: number; lon: number }, current?: { lat: number; lon: number } }) {
  const { theme } = useTheme();
  if (!start || !current) return null;
  const dist = Math.round(haversineM(current.lat, current.lon, start.lat, start.lon));
  const brg = Math.round(computeBearing(current.lat, current.lon, start.lat, start.lon));
  return (
    <View style={[styles.wrap, { backgroundColor: 'rgba(38,38,38,0.9)', borderColor: theme.colors.border }]}> 
      <Text style={{ color: '#fff', fontWeight: '800' }}>Voltar ao início</Text>
      <Text style={{ color: '#fff' }}>{dist} m • {brg}°</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', right: 12, bottom: 12, borderRadius: 16, padding: 10, borderWidth: 1 },
});