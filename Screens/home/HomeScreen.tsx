import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PulsingButton from '../../components/PulsingButton';
import IconButton from '../../components/IconButton';
import SectionTitle from '../../components/SectionTitle';
import GeneratedImage from '../../components/GeneratedImage';
import FadeInUp from '../../components/FadeInUp';
import { useGate } from '../../hooks/useGate';
import { useTheme } from '../../hooks/useTheme';
import { suggestPlan, AISuggestions } from '../../Lib/ai';
import { addRoute, getRoutes, SavedRoute } from '../../Lib/routeStore';
import { summarize } from '../../Lib/runStore';
import { getGoals } from '../../Lib/goals';

export default function HomeScreen() {
  const nav = useNavigation();
  const { theme } = useTheme();
  const { isPremium, open } = useGate();
  const [ai, setAI] = useState<AISuggestions | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [stats, setStats] = useState<{ totalDistanceKm: number; weekDistanceKm: number } | null>(null);
  const [goals, setGoals] = useState<any>(null);

  useEffect(() => {
    suggestPlan({ city: 'São Paulo', goal: 'easy', distancePreferenceKm: 5 }).then(setAI).catch(() => {});
    (async () => { setSavedRoutes(await getRoutes()); setStats(await summarize()); setGoals(await getGoals()); })();
  }, []);

  const saveCurrentRoute = async () => {
    if (!ai) return;
    const next = await addRoute({ name: ai.route[0].name, distance_km: ai.route[0].distance_km, notes: ai.route[0].notes.join(', ') });
    setSavedRoutes(next);
    setSavedMsg('Rota salva!');
    setTimeout(() => setSavedMsg(null), 1500);
  };

  const GoalCard = ({ title, value }: any) => (
    <View style={[styles.goalCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}> 
      <Text style={{ color: theme.colors.muted }}>{title}</Text>
      <Text style={{ color: theme.colors.text, fontWeight: '800' }}>{value}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={[styles.map, theme.shadows.heavy, { backgroundColor: theme.colors.card, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }]}> 
        <GeneratedImage text="RunMaster mapa com rotas urbanas brilhantes, estilo esportivo moderno" aspect="16:9" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        <View style={[styles.gradientOverlay]} />
        <Text style={{ color: '#fff', fontWeight: '800' }}>Mapa Interativo (mock)</Text>
        <View style={styles.fabRow}>
          <IconButton onPress={() => nav.navigate('ConnectSpotify' as never)} style={theme.shadows.heavy}>
            <Text style={{ color: 'white' }}>🎵</Text>
          </IconButton>
          <IconButton onPress={() => nav.navigate('ConnectWatch' as never)} color={theme.colors.secondary} style={theme.shadows.heavy}>
            <Text style={{ color: 'white' }}>⌚</Text>
          </IconButton>
        </View>
        <View style={styles.centerBtn}>
          <PulsingButton label="INICIAR CORRIDA" onPress={() => nav.navigate('Run' as never)} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <SectionTitle title="Metas" actionLabel="Editar" onAction={() => (nav as any).navigate('Goals')} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <GoalCard title="Diária: Calorias" value={goals?.daily?.calories ? `${goals.daily.calories} kcal` : '—'} />
          <GoalCard title="Diária: Distância" value={goals?.daily?.distanceKm ? `${goals.daily.distanceKm} km` : '—'} />
          <GoalCard title="Diária: Passos" value={goals?.daily?.steps ? `${goals.daily.steps}` : '—'} />
        </View>

        <SectionTitle title="Estatísticas" subtitle="Resumo rápido" />
        <View style={[styles.statsRow]}> 
          <GoalCard title="Total (km)" value={stats?.totalDistanceKm?.toFixed(1) ?? '0'} />
          <GoalCard title="Semana (km)" value={stats?.weekDistanceKm?.toFixed(1) ?? '0'} />
        </View>

        <SectionTitle title="Rotas Inteligentes" subtitle="Sugestões rápidas perto de você" />
        <FadeInUp>
          <View style={[styles.routeCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}> 
            <Text style={[styles.routeTitle, { color: theme.colors.text }]}>{ai?.route?.[0]?.name ?? 'Parque Central • 5.2 km'}</Text>
            <Text style={{ color: theme.colors.muted }}>{ai ? `${ai.route[0].distance_km} km • ${ai.route[0].notes.join(' • ')}` : 'Plano, bem iluminado, pontos de água'}</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <Pressable onPress={() => isPremium ? nav.navigate('Run' as never) : open('smart_routes')} style={[styles.routeBtn, { backgroundColor: theme.colors.primary }]}>
                <Text style={{ color: 'white', fontWeight: '800' }}>Ir agora</Text>
              </Pressable>
              <Pressable onPress={saveCurrentRoute} style={[styles.routeBtn, { backgroundColor: theme.colors.secondary }]}>
                <Text style={{ color: 'white', fontWeight: '800' }}>{savedMsg ?? 'Salvar'}</Text>
              </Pressable>
              <Pressable onPress={() => (nav as any).navigate('CreateRoute')} style={[styles.routeBtn, { backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.border }]}>
                <Text style={{ color: theme.colors.text, fontWeight: '800' }}>Criar rota</Text>
              </Pressable>
            </View>
          </View>
        </FadeInUp>

        <SectionTitle title="Favoritos" subtitle="Rotas salvas" actionLabel="Ver todas" onAction={() => nav.navigate('SavedRoutes' as never)} />
        {savedRoutes.length === 0 ? (
          <Text style={{ color: theme.colors.muted, marginBottom: 8 }}>Nenhuma rota salva ainda</Text>
        ) : (
          savedRoutes.slice(0, 3).map((r) => (
            <Pressable key={r.id} onPress={() => (nav as any).navigate('RouteDetail', { id: r.id })} style={[styles.savedItem, { backgroundColor: theme.colors.card }]}> 
              <Text style={{ color: theme.colors.text, fontWeight: '800' }}>{r.name}</Text>
              <Text style={{ color: theme.colors.muted }}>{r.distance_km.toFixed(2)} km</Text>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { height: 260, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  gradientOverlay: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 120, backgroundColor: 'rgba(0,0,0,0.25)' },
  centerBtn: { position: 'absolute', bottom: 14 },
  fabRow: { position: 'absolute', top: 14, right: 14, flexDirection: 'row', gap: 10 },
  card: { borderRadius: 16, padding: 14, marginBottom: 12 },
  cardTitle: { fontWeight: '800', marginBottom: 6 },
  cardBody: { },
  routeCard: { borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1 },
  routeTitle: { fontSize: 16, fontWeight: '800', marginBottom: 6 },
  routeBtn: { alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  savedItem: { borderRadius: 12, padding: 12, marginBottom: 8 },
  goalCard: { flex: 1, padding: 12, borderRadius: 12, borderWidth: 1 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
});