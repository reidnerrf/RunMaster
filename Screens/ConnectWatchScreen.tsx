import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { getSettings, setSettings } from '../Lib/settings';
import { sendWatchCommand } from '../Lib/background';
import { connectHealth } from '../Lib/health';

export default function ConnectWatchScreen() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    getSettings().then((s) => setConnected(!!s.healthConnected)).catch(() => {});
  }, []);

  const handleConnect = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    const next = !connected;
    setConnected(next);
    try { await setSettings({ healthConnected: next }); } catch {}

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conectar Smartwatch</Text>
      <Text style={styles.sub}>Apple Watch, Garmin, Fitbit, Wear OS</Text>
      <View style={styles.statusRow}>
        <View style={[styles.dot, { backgroundColor: connected ? '#34C759' : '#FF3B30' }]} />
        <Text style={{ fontWeight: '700' }}>{connected ? 'Conectado' : 'Desconectado'}</Text>
      </View>
      <Pressable onPress={handleConnect} style={[styles.btn, connected && styles.btnConnected]}> 
        <Text style={styles.btnText}>{connected ? 'Desconectar' : 'Conectar'}</Text>
      </Pressable>

      {connected && (
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
          <Pressable onPress={() => sendWatchCommand('start')} style={[styles.smallBtn]}><Text style={styles.smallText}>Start</Text></Pressable>
          <Pressable onPress={() => sendWatchCommand('pause')} style={[styles.smallBtn]}><Text style={styles.smallText}>Pause</Text></Pressable>
          <Pressable onPress={() => sendWatchCommand('resume')} style={[styles.smallBtn]}><Text style={styles.smallText}>Resume</Text></Pressable>
        </View>
      )}
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
        <Pressable onPress={() => connectHealth('apple')} style={[styles.smallBtn]}><Text style={styles.smallText}>Apple Health</Text></Pressable>
        <Pressable onPress={() => connectHealth('google')} style={[styles.smallBtn]}><Text style={styles.smallText}>Google Fit</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: '900' },
  sub: { color: '#666', marginTop: 6 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  btn: { marginTop: 16, backgroundColor: '#00CFFF', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12 },
  btnConnected: { backgroundColor: '#00B7E6' },
  btnText: { color: 'white', fontWeight: '800' },
  smallBtn: { backgroundColor: '#2A2A2A', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  smallText: { color: 'white', fontWeight: '800' },
});