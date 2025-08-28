import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, RefreshControl } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { getRoutes, SavedRoute, deleteRouteLocal, updateRouteLocal, insertRouteAt } from '../../Lib/routeStore';
import { syncRoutes } from '../../Lib/sync';
import { useNavigation } from '@react-navigation/native';
import SectionTitle from '../../components/SectionTitle';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../Lib/api';
import { importGpxFromUrl } from '../../Lib/gpx';
import Skeleton from '../../components/ui/Skeleton';
import PressableScale from '../../components/ui/PressableScale';
import { useRefresh } from '../../hooks/useRefresh';
import { useSWRStorage } from '../../hooks/useSWRStorage';
import Snackbar from '../../components/ui/Snackbar';

export default function SavedRoutesScreen() {
  const { theme } = useTheme();
  const nav = useNavigation();
  const { user } = useAuth();
  const [routes, setRoutes] = useState<SavedRoute[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [snack, setSnack] = useState<{ visible: boolean; message: string; action?: () => void }>({ visible: false, message: '' });
  const snackTimer = React.useRef<any>(null);

  const load = useCallback(async () => {
    const data = await getRoutes();
    setRoutes(data);
  }, []);

  const swr = useSWRStorage<SavedRoute[]>('routes:list', async () => await getRoutes(), 60_000);
  useEffect(() => { if (swr.data) setRoutes(swr.data); }, [swr.data]);

  const { refreshing, onRefresh } = useRefresh(load);

  const onDelete = async (r: SavedRoute) => {
    const all = await getRoutes();
    const idx = all.findIndex(x => x.id === r.id);
    if (r.remoteId) { try { await api.deleteRoute(r.remoteId); } catch {} }
    await deleteRouteLocal(r.id);
    setRoutes(await getRoutes());
    if (snackTimer.current) { clearTimeout(snackTimer.current); snackTimer.current = null; }
    setSnack({
      visible: true,
      message: 'Rota excluída',
      action: async () => {
        setSnack({ visible: false, message: '' });
        // restore
        await insertRouteAt(r, Math.max(0, idx));
        setRoutes(await getRoutes());
      },
    });
    snackTimer.current = setTimeout(() => setSnack({ visible: false, message: '' }), 10000);
  };

  const onRename = async (r: SavedRoute) => {
    const doUpdate = async (nextName: string) => {
      await updateRouteLocal(r.id, { name: nextName });
      // push to server if already synced
      if (r.remoteId && user) {
        try { await api.updateRoute(r.remoteId, { name: nextName }); } catch {}
      }
      setRoutes(await getRoutes());
    };

    const anyAlert: any = Alert as any;
    if (anyAlert.prompt) {
      anyAlert.prompt(
        'Renomear rota',
        undefined,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'OK', onPress: (value: string) => { if (value && value.trim()) doUpdate(value.trim()); } },
        ],
        'plain-text',
        r.name
      );
    } else {
      // Fallback: quick suffix rename
      doUpdate(r.name + ' *');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: theme.colors.background }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <SectionTitle title="Rotas Salvas" subtitle={`${routes.length} favoritas`} />
      <PressableScale onPress={async () => { if (!user) return; setSyncing(true); await syncRoutes(user.id); setRoutes(await getRoutes()); setSyncing(false); }} style={[styles.sync, { borderColor: theme.colors.border }]}>
        <Text style={{ color: theme.colors.muted }}>{syncing ? 'Sincronizando...' : 'Sincronizar com a nuvem'}</Text>
      </PressableScale>
      <PressableScale onPress={async () => {
        const anyAlert: any = Alert as any;
        const doImport = async (url: string) => {
          try {
            const added = await importGpxFromUrl(url);
            setRoutes(await getRoutes());
          } catch (e) {}
        };
        if (anyAlert.prompt) {
          anyAlert.prompt(
            'Importar GPX por URL',
            'Cole a URL do arquivo .gpx',
            [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'OK', onPress: (value: string) => { if (value && value.trim()) doImport(value.trim()); } },
            ],
            'plain-text'
          );
        }
      }} style={[styles.sync, { borderColor: theme.colors.border }]}>
        <Text style={{ color: theme.colors.muted }}>Importar GPX (URL)</Text>

      </PressableScale>
      {routes.length === 0 ? (
        <View>
          <View style={[styles.empty, { borderColor: theme.colors.border }]}> 
            <Text style={{ color: theme.colors.muted }}>Você ainda não salvou rotas.</Text>
          </View>
          <View style={{ marginTop: 10, gap: 8 }}>
            <Skeleton height={50} />
            <Skeleton height={50} />
            <Skeleton height={50} />
          </View>
        </View>
      ) : null}
      <View style={{ gap: 10 }}>
        {routes.map((r) => (
          <View key={r.id} style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}> 
            <PressableScale onPress={() => nav.navigate('RouteDetail' as never, { id: r.id } as never)} accessibilityRole="button" accessibilityLabel={`Abrir rota ${r.name}`} style={{ flex: 1 }}>
              <Text style={[styles.title, { color: theme.colors.text }]}>{r.name}</Text>
              <Text style={{ color: theme.colors.muted }}>{r.distance_km.toFixed(1)} km • {new Date(r.savedAt).toLocaleDateString()} {r.synced ? '' : '• Não sincronizado'}</Text>
            </PressableScale>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable onPress={() => onRename(r)} style={[styles.smallBtn, { backgroundColor: theme.colors.secondary }]}><Text style={{ color: 'white' }}>Renomear</Text></Pressable>
              <Pressable onPress={() => onDelete(r)} style={[styles.smallBtn, { backgroundColor: theme.colors.danger }]}><Text style={{ color: 'white' }}>Excluir</Text></Pressable>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
    <Snackbar visible={snack.visible} message={snack.message} actionLabel={snack.action ? 'Desfazer' : undefined} onAction={snack.action} />
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontWeight: '800', marginBottom: 4 },
  empty: { borderWidth: 1, borderRadius: 14, padding: 14, alignItems: 'center' },
  sync: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 12, marginBottom: 10 },
  smallBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
});