import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Image } from 'react-native';
import SectionTitle from '../../components/SectionTitle';
import AnimatedBadge from '../../components/AnimatedBadge';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import BadgeChip from '../../components/BadgeChip';
import ActionButton from '../../components/ActionButton';
import { getRuns } from '../../Lib/runStore';
import RunList from '../../components/RunList';
import EmptyState from '../../components/ui/EmptyState';
import Banner from '../../components/ui/Banner';
import Skeleton from '../../components/ui/Skeleton';
import { pushUnsyncedRuns } from '../../Lib/sync';
import * as Storage from '../../Lib/storage';
import { getGoals } from '../../Lib/goals';
import { connectHealth } from '../../Lib/health';
import PermissionSheet from '../../components/ui/PermissionSheet';
let ImagePicker: any = null; try { ImagePicker = require('expo-image-picker'); } catch {}

const PROFILE_KEY = 'runmaster_profile_v1';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const nav = useNavigation();
  const { mode, toggle, theme } = useTheme() as any;
  const [runs, setRuns] = useState<any[]>([]);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [goals, setLocalGoals] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permVisible, setPermVisible] = useState(false);

  useEffect(() => { (async () => { try { setRuns(await getRuns()); const raw = await Storage.getItem(PROFILE_KEY); if (raw) try { const p = JSON.parse(raw); setPhotoUri(p.photoUri ?? null); } catch {} setLocalGoals(await getGoals()); } catch { setError('Falha ao carregar perfil'); } finally { setLoading(false); } })(); }, []);

  const pickPhoto = async () => {
    if (!ImagePicker || !ImagePicker.launchImageLibraryAsync) return;
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.7, allowsEditing: true, mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!res.canceled && res.assets?.[0]?.uri) {
      setPhotoUri(res.assets[0].uri);
      await Storage.setItem(PROFILE_KEY, JSON.stringify({ photoUri: res.assets[0].uri }));
    }
  };

  const syncRuns = async () => {
    if (!user) return;
    setSyncMsg('Sincronizando...');
    const res = await pushUnsyncedRuns(user.id).catch(() => ({ pushed: 0 }));
    setSyncMsg(res.pushed > 0 ? `Enviado ${res.pushed}` : 'Tudo sincronizado');
    setTimeout(async () => { setSyncMsg(null); setRuns(await getRuns()); }, 1200);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: theme.colors.background }}>
      <View style={styles.header}> 
        <Pressable onPress={pickPhoto} style={[styles.avatar, { backgroundColor: theme.colors.primary, overflow: 'hidden' }]}> 
          {photoUri ? (
            <Image style={{ width: '100%', height: '100%' }} source={{ uri: photoUri }} />
          ) : (
            <Text style={{ color: 'white', fontWeight: '800' }}>{user?.name?.[0] ?? 'R'}</Text>
          )}
        </Pressable>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={[styles.name, { color: theme.colors.text }]}>{user?.name ?? 'Runner'}</Text>
            {user?.isPremium && <BadgeChip label="Premium" />}
          </View>
          <Text style={[styles.email, { color: theme.colors.muted }]}>{user?.email}</Text>
        </View>
        {!user?.isPremium && (
          <ActionButton label="Assinar Premium" onPress={() => nav.navigate('Upgrade' as never)} />
        )}
      </View>

      <SectionTitle title="Metas" actionLabel="Editar" onAction={() => (nav as any).navigate('Goals')} />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={[styles.goalCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}> 
          <Text style={{ color: theme.colors.muted }}>Diária: Calorias</Text>
          <Text style={{ color: theme.colors.text, fontWeight: '800' }}>{goals?.daily?.calories ?? '—'}</Text>
        </View>
        <View style={[styles.goalCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}> 
          <Text style={{ color: theme.colors.muted }}>Diária: Distância</Text>
          <Text style={{ color: theme.colors.text, fontWeight: '800' }}>{goals?.daily?.distanceKm ?? '—'} km</Text>
        </View>
      </View>

      <SectionTitle title="Badges" />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <AnimatedBadge label="5k" />
        <AnimatedBadge label="10k" />
        <AnimatedBadge label="21k" />
      </View>

      <SectionTitle title="Histórico" />
      {error ? <Banner type="error" title={error} /> : null}
      {loading ? (
        <View style={{ gap: 8 }}>
          <Skeleton height={18} />
          <Skeleton height={18} />
        </View>
      ) : runs.length === 0 ? (
        <EmptyState title="Sem corridas ainda" description="Inicie uma corrida para ver seu histórico aqui." ctaLabel="Iniciar corrida" onCtaPress={() => (nav as any).navigate('Run')} />
      ) : (
        <RunList runs={runs} onPressItem={(r) => (nav as any).navigate('RunSummary', { runId: r.id })} />
      )}
      <Pressable onPress={syncRuns} style={[styles.syncBtn, { borderColor: theme.colors.border }]}> 
        <Text style={{ color: theme.colors.muted }}>{syncMsg ?? 'Sincronizar agora'}</Text>
      </Pressable>

      <SectionTitle title="Configurações" />
      <View style={[styles.settingRow, { backgroundColor: theme.colors.card }]}><Text style={{ color: theme.colors.text }}>Modo escuro</Text><Switch value={mode === 'dark'} onValueChange={toggle} /></View>
      <View style={[styles.settingRow, { backgroundColor: theme.colors.card }]}><Text style={{ color: theme.colors.text }}>Notificações</Text><Switch value /></View>
      <View style={[styles.settingRow, { backgroundColor: theme.colors.card }]}><Text style={{ color: theme.colors.text }}>Spotify</Text><Switch /></View>
      <View style={[styles.settingRow, { backgroundColor: theme.colors.card }]}><Text style={{ color: theme.colors.text }}>Smartwatch</Text><Switch /></View>
      <View style={[styles.settingRow, { backgroundColor: theme.colors.card }]}><Text style={{ color: theme.colors.text }}>Conectar Apple Health/Google Fit</Text><Pressable onPress={connectHealth}><Text style={{ color: theme.colors.primary, fontWeight: '800' }}>Conectar</Text></Pressable></View>
      <View style={[styles.settingRow, { backgroundColor: theme.colors.card }]}><Text style={{ color: theme.colors.text }}>Permissões</Text><Pressable onPress={() => setPermVisible(true)}><Text style={{ color: theme.colors.primary, fontWeight: '800' }}>Gerenciar</Text></Pressable></View>
      <SectionTitle title="Preferências de Rota" />
      <View style={[styles.settingRow, { backgroundColor: theme.colors.card }]}><Text style={{ color: theme.colors.text }}>Mais segura à noite</Text><Switch value={false} /></View>
      <View style={[styles.settingRow, { backgroundColor: theme.colors.card }]}><Text style={{ color: theme.colors.text }}>Evitar aclives</Text><Switch value={false} /></View>
      <View style={[styles.settingRow, { backgroundColor: theme.colors.card }]}><Text style={{ color: theme.colors.text }}>Circuito circular</Text><Switch value={true} /></View>

      <ActionButton label="Sair" color="#eee" textColor="#111" onPress={logout} />
      <PermissionSheet visible={permVisible} onClose={() => setPermVisible(false)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginRight: 2 },
  name: { fontSize: 20, fontWeight: '800' },
  email: { },
  card: { borderRadius: 16, padding: 14, marginBottom: 10 },
  cardTitle: { fontWeight: '800', marginBottom: 4 },
  cardBody: { },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 12, marginBottom: 8 },
  syncBtn: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 12, marginTop: 8 },
  goalCard: { flex: 1, padding: 12, borderRadius: 12, borderWidth: 1 },
});