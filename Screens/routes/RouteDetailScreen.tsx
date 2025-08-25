import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { getRoutes, SavedRoute } from '../../lib/routesStore';
import MapTrace from '../../components/MapTrace';
import MapLive from '../../components/MapLive';
import ActionButton from '../../components/ActionButton';
import { api } from '../../lib/api';

let SvgLib: any = null;
try { SvgLib = require('react-native-svg'); } catch {}

function ElevationProfile({ values, height = 120 }: { values: number[]; height?: number }) {
  const { theme } = useTheme();
  if (!SvgLib) return <View style={[styles.elevFallback, { backgroundColor: theme.colors.card, height }]}><Text style={{ color: theme.colors.muted }}>Elevação (mock)</Text></View>;
  const { Svg, Polyline, Rect, Defs, LinearGradient, Stop } = SvgLib;
  const W = Math.max(200, values.length * 16);
  const H = height;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const norm = (v: number) => 10 + (H - 20) * (1 - (v - min) / Math.max(1, max - min));
  const pts = values.map((v, i) => `${10 + i * 16},${norm(v)}`).join(' ');
  return (
    <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
      <Defs>
        <LinearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={theme.colors.card} />
          <Stop offset="100%" stopColor={theme.colors.background} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={W} height={H} fill="url(#g)" rx={12} />
      <Polyline points={pts} fill="none" stroke={theme.colors.secondary} strokeWidth={2} />
    </Svg>
  );
}

export default function RouteDetailScreen() {
  const { theme } = useTheme();
  const nav = useNavigation();
  const route = useRoute<any>();
  const [saved, setSaved] = useState<SavedRoute | null>(null);
  const [mockPath, setMockPath] = useState<{ latitude: number; longitude: number; timestamp: number }[]>([]);
  const [elev, setElev] = useState<number[]>([]);
  const [leader, setLeader] = useState<{ user: string; distanceKm: number }[]>([]);

  useEffect(() => {
    (async () => {
      const { id } = route.params || {};
      const list = await getRoutes();
      const r = list.find(x => x.id === id) || null;
      setSaved(r);
      // mock path around a center
      const base = { latitude: -23.55, longitude: -46.63 };
      const pts = new Array(Math.max(20, Math.round((r?.distance_km || 5) * 10))).fill(0).map((_, i) => ({
        latitude: base.latitude + Math.sin(i / 5) * 0.001 + (i / 10000),
        longitude: base.longitude + Math.cos(i / 6) * 0.001 + (i / 12000),
        timestamp: Date.now() + i * 1000,
      }));
      setMockPath(pts);
      // mock elevation profile
      setElev(pts.map((_, i) => Math.round(30 + 10 * Math.sin(i / 4) + 6 * Math.cos(i / 9))));
      try { setLeader(await api.leaderboard('route', { routeId: id })); } catch {}
    })();
  }, [route.params]);

  if (!saved) return null;

  const pois = [
    { type: 'Água', atKm: 1.5 },
    { type: 'Banheiro', atKm: 2.8 },
    { type: 'Parque', atKm: 4.2 },
  ];

  const createRouteChallenge = async () => {
    try {
      await api.createChallenge({ title: `Desafio desta rota`, scope: `route:${saved?.remoteId || saved?.id}`, startAt: Date.now(), endAt: Date.now() + 7*24*3600*1000, participants: [] });
      // best-effort toast
      console.log('Desafio criado para a rota');
    } catch {}
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={{ padding: 16 }}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{saved.name}</Text>
      <Text style={{ color: theme.colors.muted }}>{saved.distance_km.toFixed(2)} km • {saved.notes}</Text>

      <MapLive points={mockPath} pois={[
        { id: 'w1', type: 'water', latitude: mockPath[5]?.latitude ?? -23.55, longitude: mockPath[5]?.longitude ?? -46.63 },
        { id: 't1', type: 'toilet', latitude: mockPath[12]?.latitude ?? -23.551, longitude: mockPath[12]?.longitude ?? -46.631 },
        { id: 'p1', type: 'park', latitude: mockPath[20]?.latitude ?? -23.552, longitude: mockPath[20]?.longitude ?? -46.632 },
      ]} />

      <Text style={[styles.section, { color: theme.colors.text }]}>Elevação (mock)</Text>
      <ElevationProfile values={elev} />

      <Text style={[styles.section, { color: theme.colors.text }]}>Pontos de interesse</Text>
      <View style={{ gap: 6 }}>
        {pois.map((p, i) => (
          <View key={i} style={[styles.poi, { backgroundColor: theme.colors.card }]}>
            <Text style={{ color: theme.colors.text }}>{p.type}</Text>
            <Text style={{ color: theme.colors.muted }}>{p.atKm} km</Text>
          </View>
        ))}
      </View>

      {leader.length > 0 && (
        <>
          <Text style={[styles.section, { color: theme.colors.text }]}>Ranking desta rota</Text>
          <View style={{ gap: 8 }}>
            {leader.map((row, i) => (
              <View key={`${row.user}-${i}`} style={[styles.poi, { backgroundColor: theme.colors.card }]}> 
                <Text style={{ color: theme.colors.text }}>{i + 1}. {row.user}</Text>
                <Text style={{ color: theme.colors.muted }}>{row.distanceKm.toFixed(1)} km</Text>
              </View>
            ))}
          </View>
        </>
      )}

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
        <ActionButton label="Correr esta rota" onPress={() => (nav as any).navigate('Run', { from: 'Home' })} />
        <ActionButton label="Criar desafio" color={theme.colors.secondary} onPress={createRouteChallenge} />
        <ActionButton label="Fechar" color="#eee" textColor="#111" onPress={() => nav.goBack()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '900', marginBottom: 6 },
  section: { fontSize: 16, fontWeight: '800', marginTop: 12, marginBottom: 6 },
  poi: { borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  elevFallback: { width: '100%', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});