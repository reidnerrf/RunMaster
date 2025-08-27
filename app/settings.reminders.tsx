import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text, Switch, StyleSheet, TextInput, Pressable, Linking } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { scheduleNotification } from '@/utils/pushNotifications';
import * as Notifications from 'expo-notifications';
import * as Calendar from 'expo-calendar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { track } from '@/utils/analyticsClient';
import { useFocusEffect } from '@react-navigation/native';

type ReminderConfig = {
  enabled: boolean;
  timeOfDay: string; // HH:MM
  days: { mon: boolean; tue: boolean; wed: boolean; thu: boolean; fri: boolean; sat: boolean; sun: boolean };
  quietHours: { enabled: boolean; start: string; end: string };
};

const KEY = 'pulse_reminders_v1';

export default function ReminderSettingsScreen() {
  const scheme = useColorScheme();
  const colors = useMemo(() => ({
    background: scheme === 'dark' ? '#0B0B0C' : '#FFFFFF',
    card: scheme === 'dark' ? '#121214' : '#F7F7F7',
    border: scheme === 'dark' ? '#2A2A2E' : '#E5E5EA',
    text: scheme === 'dark' ? '#FFFFFF' : '#111111',
    muted: scheme === 'dark' ? '#9E9EA4' : '#6B7280',
    primary: '#6C63FF',
  }), [scheme]);

  const [cfg, setCfg] = useState<ReminderConfig>({
    enabled: true,
    timeOfDay: '07:30',
    days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
    quietHours: { enabled: true, start: '22:00', end: '08:00' },
  });
  const [notifGranted, setNotifGranted] = useState<boolean>(true);
  const [calGranted, setCalGranted] = useState<boolean>(true);
  const [justGrantedMsg, setJustGrantedMsg] = useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) try { setCfg(JSON.parse(raw)); } catch {}
      // Inline permission prompts
      const notif = await Notifications.requestPermissionsAsync();
      const cal = await Calendar.requestCalendarPermissionsAsync();
      setNotifGranted(notif.status === 'granted');
      setCalGranted(cal.status === 'granted');
    })();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      let active = true;
      (async () => {
        const notif = await Notifications.getPermissionsAsync();
        const cal = await Calendar.getCalendarPermissionsAsync();
        const nextNotif = notif.status === 'granted';
        const nextCal = cal.status === 'granted';
        const wasMissing = (!notifGranted || !calGranted);
        if (active) {
          setNotifGranted(nextNotif);
          setCalGranted(nextCal);
          if (wasMissing && nextNotif && nextCal) {
            setJustGrantedMsg('Permissões concedidas. Controles ativados.');
            setTimeout(() => setJustGrantedMsg(null), 2000);
          }
        }
      })();
      return () => { active = false; };
    }, [notifGranted, calGranted])
  );

  const persist = async (next: ReminderConfig) => {
    setCfg(next);
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
    try { await track('preferences_changed', { scope: 'reminders', keys: ['enabled','timeOfDay','days','quietHours'] }); } catch {}
  };

  const scheduleDemo = async () => {
    const [hh, mm] = cfg.timeOfDay.split(':').map((v) => parseInt(v, 10));
    const now = new Date();
    const target = new Date(); target.setHours(hh, mm, 0, 0);
    if (target.getTime() <= now.getTime()) target.setTime(target.getTime() + 24 * 3600 * 1000);
    await scheduleNotification('Lembrete de Corrida', 'Prepare-se para sua corrida!', { date: target }, { reason: 'custom_time' });
  };

  const DaysRow = () => (
    <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
      {(
        [ ['mon','Seg'], ['tue','Ter'], ['wed','Qua'], ['thu','Qui'], ['fri','Sex'], ['sat','Sáb'], ['sun','Dom'] ] as Array<[keyof ReminderConfig['days'], string]>
      ).map(([k, label]) => (
        <View key={k} style={[styles.badge, { backgroundColor: cfg.days[k] ? colors.primary : colors.card, borderColor: colors.border }]}> 
          <Text onPress={() => notifGranted && persist({ ...cfg, days: { ...cfg.days, [k]: !cfg.days[k] } })} style={{ color: cfg.days[k] ? 'white' : colors.text, fontWeight: '800', opacity: notifGranted ? 1 : 0.5 }}>{label}</Text>
        </View>
      ))}
    </View>
  );

  const allGranted = notifGranted && calGranted;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 16 }}>
      <Text style={[styles.title, { color: colors.text }]}>Lembretes</Text>
      <Text style={{ color: colors.muted, marginBottom: 12 }}>Agende lembretes personalizados</Text>

      {(!notifGranted || !calGranted) && (
        <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border, alignItems: 'center' }]}> 
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.text, fontWeight: '800' }}>Permissões necessárias</Text>
            <Text style={{ color: colors.muted, marginTop: 4 }}>
              {!notifGranted ? 'Ative notificações. ' : ''}
              {!calGranted ? 'Conceda acesso ao calendário. ' : ''}
            </Text>
          </View>
          <Pressable onPress={() => Linking.openSettings?.()} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: colors.primary }}> 
            <Text style={{ color: 'white', fontWeight: '800' }}>Configurar</Text>
          </Pressable>
        </View>
      )}

      {!!justGrantedMsg && (
        <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}> 
          <Text style={{ color: colors.text }}>{justGrantedMsg}</Text>
        </View>
      )}

      <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <Text style={{ color: colors.text, fontWeight: '600' }}>Ativar</Text>
        <Switch value={cfg.enabled} onValueChange={(v) => persist({ ...cfg, enabled: v })} disabled={!allGranted} />
      </View>

      <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border, alignItems: 'center' }]}> 
        <Text style={{ color: colors.text, fontWeight: '600' }}>Horário</Text>
        <TextInput value={cfg.timeOfDay} onChangeText={(v) => persist({ ...cfg, timeOfDay: v })} editable={allGranted} placeholder="HH:MM" placeholderTextColor={colors.muted} style={{ color: colors.text, minWidth: 100, textAlign: 'right' }} />
      </View>

      <Text style={[styles.subtitle, { color: colors.text }]}>Dias</Text>
      <DaysRow />

      <Text style={[styles.subtitle, { color: colors.text }]}>Horário Silencioso</Text>
      <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <Text style={{ color: colors.text, fontWeight: '600' }}>Ativar</Text>
        <Switch value={cfg.quietHours.enabled} onValueChange={(v) => persist({ ...cfg, quietHours: { ...cfg.quietHours, enabled: v } })} disabled={!allGranted} />
      </View>
      <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border, alignItems: 'center' }]}> 
        <Text style={{ color: colors.text, fontWeight: '600' }}>Início</Text>
        <TextInput value={cfg.quietHours.start} onChangeText={(v) => persist({ ...cfg, quietHours: { ...cfg.quietHours, start: v } })} editable={allGranted} placeholder="HH:MM" placeholderTextColor={colors.muted} style={{ color: colors.text, minWidth: 100, textAlign: 'right' }} />
      </View>
      <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border, alignItems: 'center' }]}> 
        <Text style={{ color: colors.text, fontWeight: '600' }}>Fim</Text>
        <TextInput value={cfg.quietHours.end} onChangeText={(v) => persist({ ...cfg, quietHours: { ...cfg.quietHours, end: v } })} editable={allGranted} placeholder="HH:MM" placeholderTextColor={colors.muted} style={{ color: colors.text, minWidth: 100, textAlign: 'right' }} />
      </View>

      <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <Text style={{ color: colors.text, fontWeight: '600' }}>Agendar Lembrete de Teste</Text>
        <Text onPress={allGranted ? scheduleDemo : undefined} style={{ color: allGranted ? colors.primary : colors.muted, fontWeight: '800' }}>Agendar</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', marginBottom: 6 },
  subtitle: { fontSize: 16, fontWeight: '800', marginTop: 12, marginBottom: 6 },
  row: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  badge: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
});

