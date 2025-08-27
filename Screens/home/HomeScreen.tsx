import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import FadeInUp from '../../components/FadeInUp';
import FlowHint from '../../components/FlowHint';
import GeneratedImage from '../../components/GeneratedImage';
import IconButton from '../../components/IconButton';
import PulsingButton from '../../components/PulsingButton';
import SectionTitle from '../../components/SectionTitle';
import GeneratedImage from '../../components/GeneratedImage';
import FadeInUp from '../../components/FadeInUp';

import { useGate } from '../../hooks/useGate';
import { useTheme } from '../../hooks/useTheme';
import { AISuggestions, suggestPlan } from '../../Lib/ai';
import { addRoute, getRoutes, SavedRoute } from '../../Lib/routeStore';
import { getSettings, setSettings } from '../../Lib/settings';
import { updateDailyGoalWidget } from '../../Lib/background';
import Shimmer from '../../components/ui/Shimmer';
import BlurCard from '../../components/ui/BlurCard';
import { initNavigationSdk, requestOfflineTiles, startTurnByTurn } from '../../Lib/navigation';
import { t } from '../../Lib/i18n';
import { getNearbyEvents, enrichRoutesWithEvents } from '../../Lib/events';
import RitualPicker from '../../components/RitualPicker';
import { RunnerProfileType } from '../../Lib/rituals';


export default function HomeScreen() {
  const nav = useNavigation();
  const { theme } = useTheme();
  const { isPremium, open } = useGate();
  const [ai, setAI] = useState<AISuggestions | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [dailyGoalKm, setDailyGoalKm] = useState<number>(5);
  const [showRitualPicker, setShowRitualPicker] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<RunnerProfileType>('endurance');
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    suggestPlan({ city: 'São Paulo', goal: 'easy', distancePreferenceKm: 5 }).then(setAI).catch(() => {});
    (async () => setSavedRoutes(await getRoutes()))();
    getSettings().then((s) => setDailyGoalKm(s.widgetDailyGoalKm || 5)).catch(() => {});
    initNavigationSdk('mapbox').catch(() => {});
  }, []);

  const saveCurrentRoute = async () => {
    if (!ai) return;
    const next = await addRoute({ name: ai.route[0].name, distance_km: ai.route[0].distance_km, notes: ai.route[0].notes.join(', ') });
    setSavedRoutes(next);
    setSavedMsg('Rota salva!');
    setTimeout(() => setSavedMsg(null), 1500);
  };

  const handleStartRun = () => {
    setShowRitualPicker(true);
  };

  const handleRitualSelect = (ritual: any) => {
    console.log('Ritual selecionado:', ritual);
    // Aqui você pode salvar o ritual selecionado e navegar para a corrida
    nav.navigate('Run' as never);
  };


  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={[styles.map, theme.shadows.heavy, { backgroundColor: theme.colors.card, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }]}> 
        <GeneratedImage text="Pulse mapa com rotas urbanas brilhantes, estilo esportivo moderno" aspect="16:9" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        <View style={[styles.gradientOverlay]} />
        <Text style={{ color: theme.colors.text, fontWeight: '800' }}>Mapa Interativo (mock)</Text>
        <View style={styles.fabRow}>
          <IconButton onPress={() => nav.navigate('ConnectSpotify' as never)} style={theme.shadows.heavy}>
            <Text style={{ color: 'white' }}>🎵</Text>
          </IconButton>
          <IconButton onPress={() => nav.navigate('ConnectWatch' as never)} color={theme.colors.secondary} style={theme.shadows.heavy}>
            <Text style={{ color: 'white' }}>⌚</Text>
          </IconButton>
        </View>
        <View style={styles.centerBtn}>
          <PulsingButton 
            label={t('start_run')} 
            onPress={handleStartRun} 
          />
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
        {!ai ? (
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}> 
            <Shimmer height={18} style={{ marginBottom: 10 }} />
            <Shimmer height={14} width={'80%'} />
          </View>
        ) : (
        <FadeInUp>
          <BlurCard>
            <Text style={[styles.routeTitle, { color: theme.colors.text }]}>{ai?.route?.[0]?.name ?? 'Parque Central • 5.2 km'}</Text>
            <Text style={{ color: theme.colors.muted }}>{ai ? `${ai.route[0].distance_km} km • ${ai.route[0].notes.join(' • ')}` : 'Plano, bem iluminado, pontos de água'}</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <Pressable onPress={() => isPremium ? nav.navigate('Run' as never) : open('smart_routes')} style={[styles.routeBtn, { backgroundColor: theme.colors.primary }]}> 
                <Text style={{ color: 'white', fontWeight: '800' }}>Ir agora</Text>
              </Pressable>
              <Pressable onPress={saveCurrentRoute} style={[styles.routeBtn, { backgroundColor: theme.colors.secondary }]}> 
                <Text style={{ color: 'white', fontWeight: '800' }}>{savedMsg ?? 'Salvar'}</Text>
              </Pressable>
              <Pressable onPress={() => requestOfflineTiles({ north: -23.5, south: -23.7, east: -46.5, west: -46.7 })} style={[styles.routeBtn, { backgroundColor: '#6C63FF' }]}> 
                <Text style={{ color: 'white', fontWeight: '800' }}>Offline</Text>
              </Pressable>
              <Pressable onPress={() => ai && startTurnByTurn({ name: ai.route[0].name, points: ai.route[0].points || [] })} style={[styles.routeBtn, { backgroundColor: '#00B894' }]}> 
                <Text style={{ color: 'white', fontWeight: '800' }}>TBT</Text>
              </Pressable>
            </View>
            {ai && (
              <View style={{ marginTop: 8, gap: 4 }}>
                <Text style={{ color: theme.colors.muted }}>Clima: {ai.climate.summary} • {ai.climate.temperature_c}°C • AQ {ai.climate.air_quality}</Text>
                <Text style={{ color: theme.colors.muted }}>Pacing sugerido: {ai.pacing.target_min_per_km} • Dica: {ai.pacing.tip}</Text>
              </View>
            )}
          </BlurCard>
        </FadeInUp>
        )}

        <SectionTitle title="Meta diária" subtitle="Widget" />
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}> 
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Meta de hoje: {dailyGoalKm} km</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[3,5,8,10].map((g) => (
              <Pressable key={g} onPress={async () => { setDailyGoalKm(g); await setSettings({ widgetDailyGoalKm: g }); await updateDailyGoalWidget(g); }} style={[styles.playBtn, { borderColor: theme.colors.border }]}> 
                <Text style={{ color: theme.colors.text }}>{g} km</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Rotas Temáticas com Eventos */}
        <SectionTitle title="Rotas Temáticas" subtitle="Recomendadas para você" />
        {recommendations && recommendations.length > 0 ? (
          recommendations.slice(0, 3).map((route, index) => (
            <BlurCard key={route.id} style={styles.routeCard}>
              <View style={styles.routeHeader}>
                <View style={styles.routeInfo}>
                  <Text style={[styles.routeTitle, { color: theme.colors.text }]}>{route.name}</Text>
                  <Text style={{ color: theme.colors.muted }}>
                    {route.distance}km • {route.estimatedTime}min • {route.difficulty}
                  </Text>
                  {/* Event Badge */}
                  {route.name.includes('•') && (
                    <View style={styles.eventBadge}>
                      <Text style={styles.eventIcon}>🎉</Text>
                      <Text style={[styles.eventText, { color: theme.colors.primary }]}>Evento Local</Text>
                    </View>
                  )}
                </View>
                <View style={styles.routeTheme}>
                  <Text style={styles.themeIcon}>
                    {route.theme === 'parks' ? '🌳' : 
                     route.theme === 'historical' ? '🏛️' : 
                     route.theme === 'gastronomic' ? '🍕' : '🏃'}
                  </Text>
                </View>
              </View>
            </BlurCard>
          ))
        ) : (
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <Text style={{ color: theme.colors.muted }}>Carregando rotas temáticas...</Text>
          </View>
        )}

        <SectionTitle title="Favoritos" subtitle="Rotas salvas" actionLabel="Ver todas" onAction={() => nav.navigate('SavedRoutes' as never)} />
        {savedRoutes.length === 0 ? (
          <View style={[styles.card, { backgroundColor: theme.colors.card, alignItems: 'center' }]}> 
            <Text style={{ color: theme.colors.muted, marginBottom: 8 }}>Nenhuma rota salva ainda</Text>
            <Pressable onPress={saveCurrentRoute} style={[styles.playBtn, { borderColor: theme.colors.border }]}> 
              <Text style={{ color: theme.colors.text }}>Gerar e salvar uma rota</Text>
            </Pressable>
          </View>
        ) : (
          savedRoutes.slice(0, 3).map((r) => (
            <Pressable key={r.id} onPress={() => (nav as any).navigate('RouteDetail', { id: r.id })} style={[styles.savedItem, { backgroundColor: theme.colors.card }]}> 
              <Text style={{ color: theme.colors.text, fontWeight: '800' }}>{r.name}</Text>
              <Text style={{ color: theme.colors.muted }}>{r.distance_km.toFixed(2)} km</Text>
            </Pressable>
          ))
        )}
      </ScrollView>
      <RitualPicker
        visible={showRitualPicker}
        onClose={() => setShowRitualPicker(false)}
        onSelect={handleRitualSelect}
        currentProfile={currentProfile}
      />
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
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  routeInfo: {
    flex: 1,
  },
  routeTheme: {
    marginLeft: 12,
  },
  themeIcon: {
    fontSize: 24,
  },
  eventBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    alignSelf: 'flex-start',
  },
  eventIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  eventText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

