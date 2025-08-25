import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { getRoutes, SavedRoute, deleteRouteLocal, updateRouteLocal } from '../../Lib/routeStore';
import { syncRoutes } from '../../Lib/sync';
import { useNavigation } from '@react-navigation/native';
import SectionTitle from '../../components/SectionTitle';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../Lib/api';
import { importGpxFromUrl } from '../../Lib/gpx';

export default function SavedRoutesScreen() {
  const { theme } = useTheme();
  const nav = useNavigation();
  const { user } = useAuth();
  const [routes, setRoutes] = useState<SavedRoute[]>([]);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    getRoutes().then(setRoutes).catch(() => setRoutes([]));
  }, []);

  const onDelete = async (r: SavedRoute) => {
    // delete remote first if exists (best-effort)
    if (r.remoteId) { try { await api.deleteRoute(r.remoteId); } catch {} }
    await deleteRouteLocal(r.id);
    setRoutes(await getRoutes());
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
    <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: theme.colors.background }}>
      <SectionTitle title="Rotas Salvas" subtitle={`${routes.length} favoritas`} />
      <Pressable onPress={async () => { if (!user) return; setSyncing(true); await syncRoutes(user.id); setRoutes(await getRoutes()); setSyncing(false); }} style={[styles.sync, { borderColor: theme.colors.border }]}>
        <Text style={{ color: theme.colors.muted }}>{syncing ? 'Sincronizando...' : 'Sincronizar com a nuvem'}</Text>
      </Pressable>
      <Pressable onPress={async () => {
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
      </Pressable>
      {routes.length === 0 && (
        <View style={[styles.empty, { borderColor: theme.colors.border }]}> 
          <Text style={{ color: theme.colors.muted }}>Você ainda não salvou rotas.</Text>
        </View>
      )}
      <View style={{ gap: 10 }}>
        {routes.map((r) => (
          <View key={r.id} style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}> 
            <Pressable onPress={() => nav.navigate('RouteDetail' as never, { id: r.id } as never)} style={{ flex: 1 }}>
              <Text style={[styles.title, { color: theme.colors.text }]}>{r.name}</Text>
              <Text style={{ color: theme.colors.muted }}>{r.distance_km.toFixed(1)} km • {new Date(r.savedAt).toLocaleDateString()} {r.synced ? '' : '• Não sincronizado'}</Text>
            </Pressable>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable onPress={() => onRename(r)} style={[styles.smallBtn, { backgroundColor: theme.colors.secondary }]}><Text style={{ color: 'white' }}>Renomear</Text></Pressable>
              <Pressable onPress={() => onDelete(r)} style={[styles.smallBtn, { backgroundColor: theme.colors.danger }]}><Text style={{ color: 'white' }}>Excluir</Text></Pressable>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontWeight: '800', marginBottom: 4 },
  empty: { borderWidth: 1, borderRadius: 14, padding: 14, alignItems: 'center' },
  sync: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 12, marginBottom: 10 },
  smallBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
});