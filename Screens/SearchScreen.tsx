import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Pressable } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { getRoutes, SavedRoute } from '../Lib/routeStore';
import { getRuns, Run } from '../Lib/runStore';
import { useNavigation } from '@react-navigation/native';
import { addQuery, getQueries } from '../utils/searchHistory';

type ResultItem = { type: 'route'|'run'; id: string; title: string; subtitle: string };

export default function SearchScreen() {
  const { theme } = useTheme();
  const nav = useNavigation();
  const [q, setQ] = useState('');
  const [routes, setRoutes] = useState<SavedRoute[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => { getRoutes().then(setRoutes); getRuns().then(setRuns); getQueries().then(setHistory); }, []);

  const results = useMemo<ResultItem[]>(() => {
    const query = q.trim().toLowerCase();
    const list: ResultItem[] = [];
    if (query.length === 0) return list;
    for (const r of routes) {
      if (r.name.toLowerCase().includes(query) || (r.notes || '').toLowerCase().includes(query)) {
        list.push({ type: 'route', id: r.id, title: r.name, subtitle: `${r.distance_km.toFixed(1)} km` });
      }
    }
    for (const r of runs) {
      const date = new Date(r.startedAt).toLocaleString();
      if (date.toLowerCase().includes(query) || r.avgPace.toLowerCase().includes(query)) {
        list.push({ type: 'run', id: r.id, title: `Corrida • ${r.distanceKm.toFixed(1)} km`, subtitle: date });
      }
    }
    return list.slice(0, 50);
  }, [q, routes, runs]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={[styles.searchBox, { borderColor: theme.colors.border, backgroundColor: theme.colors.backgroundCard }]}> 
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Buscar rotas e treinos"
          placeholderTextColor={theme.colors.textTertiary}
          style={[styles.input, { color: theme.colors.text }]}
          autoFocus
          accessibilityLabel="Campo de busca"
          returnKeyType="search"
          onSubmitEditing={async () => { if (q.trim()) { await addQuery(q); setHistory(await getQueries()); } }}
        />
      </View>
      {q.trim().length === 0 && history.length > 0 ? (
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={{ color: theme.colors.muted, marginBottom: 8 }}>Recentes</Text>
          {history.map(h => (
            <Pressable key={h} onPress={() => setQ(h)} accessibilityRole="button" accessibilityLabel={`Buscar ${h}`} style={{ paddingVertical: 8 }}>
              <Text style={{ color: theme.colors.text }}>{h}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      <FlatList
        data={results}
        keyExtractor={(item) => item.type + ':' + item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => {
            if (item.type === 'route') nav.navigate('RouteDetail' as never, { id: item.id } as never);
            if (item.type === 'run') nav.navigate('RunSummary' as never, { id: item.id } as never);
          }} style={[styles.row, { borderBottomColor: theme.colors.divider }]}> 
            <Text style={[styles.title, { color: theme.colors.text }]}>{item.title}</Text>
            <Text style={{ color: theme.colors.muted }}>{item.subtitle}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={{ color: theme.colors.muted, padding: 16 }}>Digite para buscar…</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBox: { margin: 16, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
  input: { fontSize: 16 },
  row: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  title: { fontSize: 16, fontWeight: '700' },
});

