import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { getSettings, setSettings } from '../Lib/settings';

export default function ConnectSpotifyScreen() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    getSettings().then((s) => setConnected(!!s.spotifyConnected)).catch(() => {});
  }, []);

  const handleConnect = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    const next = !connected;
    setConnected(next);
    try { await setSettings({ spotifyConnected: next }); } catch {}

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conectar ao Spotify</Text>
      <Text style={styles.sub}>Sincronize playlists e música adaptativa</Text>
      <View style={styles.statusRow}>
        <View style={[styles.dot, { backgroundColor: connected ? '#34C759' : '#FF3B30' }]} />
        <Text style={{ fontWeight: '700' }}>{connected ? 'Conectado' : 'Desconectado'}</Text>
      </View>
      <Pressable onPress={handleConnect} style={[styles.btn, connected && styles.btnConnected]}> 
        <Text style={styles.btnText}>{connected ? 'Desconectar' : 'Conectar'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: '900' },
  sub: { color: '#666', marginTop: 6 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  btn: { marginTop: 16, backgroundColor: '#1DB954', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  btnConnected: { backgroundColor: '#1AA34A' },
  btnText: { color: 'white', fontWeight: '800' },
});