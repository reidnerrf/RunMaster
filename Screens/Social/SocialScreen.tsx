import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Image } from 'react-native';
import SectionTitle from '../../components/SectionTitle';
import FadeInUp from '../../components/FadeInUp';
import { useGate } from '../../hooks/useGate';
import BadgeChip from '../../components/BadgeChip';
import ActionButton from '../../components/ActionButton';
import { useTheme } from '../../hooks/useTheme';
import * as Storage from '../../Lib/storage';
import { api, ApiChallenge } from '../../Lib/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { followUser, unfollowUser } from '@/store/slices/userSlice';
import { track } from '@/utils/analyticsClient';
import { useScreenMetrics } from '../../hooks/useScreenMetrics';
import { getSuggestions } from '@/utils/navigationInsights';

const FEED_KEY = 'runmaster_feed_v1';

type Post = { id: string; user: string; text: string; photo?: string; date: number };

type BoardTab = 'city' | 'neighborhood' | 'route';

export default function SocialScreen() {
  useScreenMetrics('Social');
  const { isPremium, open } = useGate();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const following = useAppSelector((s) => s.user.profile?.socialProfile.following || []);
  const [posts, setPosts] = useState<Post[]>([]);
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [cityBoard, setCityBoard] = useState<{ user: string; distanceKm: number; city?: string }[]>([]);
  const [neighborhoodBoard, setNeighborhoodBoard] = useState<{ user: string; distanceKm: number; city?: string }[]>([]);
  const [routeBoard, setRouteBoard] = useState<{ user: string; distanceKm: number; routeId?: string }[]>([]);
  const [tab, setTab] = useState<BoardTab>('city');
  const [neighborhood, setNeighborhood] = useState('Pinheiros');
  const [routeId, setRouteId] = useState<string>('demo-route');
  const [challenges, setChallenges] = useState<ApiChallenge[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try { setCityBoard(await api.leaderboard('city', { city: 'São Paulo' })); } catch {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try { setNeighborhoodBoard(await api.leaderboard('neighborhood', { neighborhood })); } catch {}
    })();
  }, [neighborhood]);

  useEffect(() => {
    (async () => {
      try { setRouteBoard(await api.leaderboard('route', { routeId })); } catch {}
    })();
  }, [routeId]);

  useEffect(() => {
    (async () => {
      const raw = await Storage.getItem(FEED_KEY);
      if (raw) try { setPosts(JSON.parse(raw)); } catch {}
      try { setChallenges(await api.listChallenges()); } catch {}
      try { setSuggestions(await getSuggestions(undefined, 3)); } catch {}
    })();
  }, []);

  const addPost = async () => {
    const newPost: Post = { id: Date.now().toString(), user: 'Você', text, photo, date: Date.now() };
    const next = [newPost, ...posts];
    setPosts(next);
    await Storage.setItem(FEED_KEY, JSON.stringify(next));
    setText(''); setPhoto(undefined);
  };

  const toggleFollow = async (userId: string) => {
    if (following.includes(userId)) {
      dispatch(unfollowUser({ targetUserId: userId }));
    } else {
      dispatch(followUser({ targetUserId: userId }));
    }
    try { await track('action_performed', { action_name: following.includes(userId) ? 'unfollow_clicked' : 'follow_clicked', context: 'social_screen' }); } catch {}
  };

  const createNeighborhoodChallenge = async () => {
    const start = Date.now();
    const end = start + 7 * 24 * 3600 * 1000;
    try {
      const chal = await api.createChallenge({ title: `Desafio ${neighborhood} 7 dias`, scope: `neighborhood:${neighborhood}`, startAt: start, endAt: end, participants: [] });
      setChallenges([chal, ...challenges]);
      setMsg('Desafio criado!'); setTimeout(() => setMsg(null), 1200);
    } catch { setMsg('Falha ao criar'); setTimeout(() => setMsg(null), 1200); }
  };

  const joinFirstChallenge = async () => {
    try {
      const chal = challenges[0];
      if (!chal) return;
      await api.joinChallenge(chal._id!, 'me');
      setMsg('Participando!'); setTimeout(() => setMsg(null), 1200);
    } catch { setMsg('Falha ao participar'); setTimeout(() => setMsg(null), 1200); }
  };

  const boardData = tab === 'city' ? cityBoard : tab === 'neighborhood' ? neighborhoodBoard : routeBoard;

  return (
    <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: theme.colors.background }}>
      <SectionTitle title="Comunidade" subtitle="Poste fotos, rotas e conquistas" />

      {suggestions.length > 0 && (
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}> 
          <Text style={[styles.title, { color: theme.colors.text }]}>Sugestões para você</Text>
          {suggestions.map((s) => (
            <Text key={s} style={{ color: theme.colors.muted }}>• {s}</Text>
          ))}
        </View>
      )}

      {/* Composer */}
      <View style={[styles.composer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}> 
        <TextInput value={text} onChangeText={setText} placeholder="Compartilhe sua conquista..." placeholderTextColor={theme.colors.muted} style={{ color: theme.colors.text, paddingVertical: 8 }} />
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <ActionButton label="Foto" color={theme.colors.secondary} onPress={() => setPhoto(`https://api.a0.dev/assets/image?text=${encodeURIComponent('foto de corrida estilizada')} &aspect=1:1`)} />
          <ActionButton label="Publicar" onPress={addPost} />
        </View>
        {photo && <Image source={{ uri: photo }} style={{ width: '100%', height: 160, borderRadius: 12, marginTop: 8 }} />}
      </View>

      <SectionTitle title="Feed" subtitle={isPremium ? 'Completo' : 'Limitado na versão grátis'} />
      {(isPremium ? [...posts].sort((a, b) => {
        const aFollow = following.includes(a.user);
        const bFollow = following.includes(b.user);
        if (aFollow && !bFollow) return -1; if (!aFollow && bFollow) return 1; return b.date - a.date;
      }) : posts.slice(0, 3)).map((p, i) => (
        <FadeInUp key={p.id} delay={i * 40}>
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}> 
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={[styles.title, { color: theme.colors.text }]}>{p.user} • {new Date(p.date).toLocaleDateString()}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {isPremium && <BadgeChip label="Premium" />}
                <Pressable onPress={() => toggleFollow(p.user)} style={{ paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: following.includes(p.user) ? theme.colors.border : theme.colors.primary }}>
                  <Text style={{ color: following.includes(p.user) ? theme.colors.text : 'white', fontWeight: '800' }}>{following.includes(p.user) ? 'Seguindo' : 'Seguir'}</Text>
                </Pressable>
              </View>
            </View>
            <Text style={[styles.body, { color: theme.colors.muted }]}>{p.text}</Text>
            {p.photo && <Image source={{ uri: p.photo }} style={{ width: '100%', height: 200, borderRadius: 12, marginTop: 8 }} />}
          </View>
        </FadeInUp>
      ))}

      {!isPremium && (
        <Pressable onPress={() => open('social_feed_more')} style={[styles.locked, { borderColor: theme.colors.border }]}> 
          <Text style={{ color: theme.colors.muted }}>Ver mais posts (Premium)</Text>
        </Pressable>
      )}

      <SectionTitle title="Ranking" subtitle="Cidade • Bairro • Rota" />
      <View style={styles.tabs}> 
        {(['city','neighborhood','route'] as BoardTab[]).map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={[styles.tab, { backgroundColor: tab === t ? theme.colors.primary : theme.colors.card, borderColor: theme.colors.border }]}> 
            <Text style={{ color: tab === t ? 'white' : theme.colors.text, fontWeight: '800', textTransform: 'capitalize' }}>{t}</Text>
          </Pressable>
        ))}
      </View>
      {tab === 'neighborhood' && (
        <TextInput value={neighborhood} onChangeText={setNeighborhood} placeholder="Bairro" placeholderTextColor={theme.colors.muted} style={{ borderWidth: 1, borderColor: theme.colors.border, color: theme.colors.text, padding: 8, borderRadius: 8, marginBottom: 8 }} />
      )}
      {tab === 'route' && (
        <TextInput value={routeId} onChangeText={setRouteId} placeholder="ID da rota" placeholderTextColor={theme.colors.muted} style={{ borderWidth: 1, borderColor: theme.colors.border, color: theme.colors.text, padding: 8, borderRadius: 8, marginBottom: 8 }} />
      )}
      <View style={styles.ranking}> 
        {boardData.length > 0 ? (
          boardData.map((row, i) => (
            <View key={`${row.user}-${i}`} style={[styles.rankRow, { width: `${90 - i * 12}%`, backgroundColor: theme.colors.card }]}> 
              <Text style={{ fontWeight: '700', color: theme.colors.text }}>{i + 1}. {row.user}</Text>
              <Text style={{ color: theme.colors.muted }}>{row.distanceKm.toFixed(1)} km</Text>
            </View>
          ))
        ) : (
          ['Você', 'Ana', 'Carlos', 'Mia'].map((n, i) => (
            <View key={n} style={[styles.rankRow, { width: `${90 - i * 12}%`, backgroundColor: theme.colors.card }]}> 
              <Text style={{ fontWeight: '700', color: theme.colors.text }}>{i + 1}. {n}</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.actions}> 
        <ActionButton label="Criar desafio do bairro" onPress={createNeighborhoodChallenge} />
        <ActionButton label="Participar do 1º" onPress={joinFirstChallenge} />
      </View>
      {msg && <Text style={{ color: theme.colors.muted, marginTop: 6 }}>{msg}</Text>}

      {challenges.length > 0 && (
        <View style={{ marginTop: 10 }}>
          <SectionTitle title="Desafios" subtitle={`${challenges.length} ativos`} />
          {challenges.map((c) => (
            <View key={c._id} style={[styles.rankRow, { backgroundColor: theme.colors.card }]}> 
              <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{c.title}</Text>
              <Text style={{ color: theme.colors.muted }}>{c.scope}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  composer: { borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 12 },
  card: { borderRadius: 16, padding: 14, marginBottom: 12 },
  title: { fontWeight: '800', marginBottom: 6 },
  body: { },
  ranking: { paddingVertical: 6, gap: 8 },
  rankRow: { padding: 10, borderRadius: 10 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 10 },
  locked: { borderRadius: 12, borderWidth: 1, padding: 14, alignItems: 'center', marginTop: 8 },
  tabs: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  tab: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
});