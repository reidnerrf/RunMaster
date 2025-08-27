import React, { useMemo } from 'react';
import { ScrollView, View, Text, Switch, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUserSettings } from '@/store/slices/userSlice';
import { useColorScheme } from '@/hooks/useColorScheme';
import { track } from '@/utils/analyticsClient';

export default function NotificationSettingsScreen() {
  const scheme = useColorScheme();
  const dispatch = useAppDispatch();
  const settings = useAppSelector((s) => s.user.settings);
  const colors = useMemo(() => ({
    background: scheme === 'dark' ? '#0B0B0C' : '#FFFFFF',
    card: scheme === 'dark' ? '#121214' : '#F7F7F7',
    border: scheme === 'dark' ? '#2A2A2E' : '#E5E5EA',
    text: scheme === 'dark' ? '#FFFFFF' : '#111111',
    muted: scheme === 'dark' ? '#9E9EA4' : '#6B7280',
    primary: '#6C63FF',
  }), [scheme]);

  if (!settings) return null;

  const update = async (field: keyof typeof settings.notifications, value: boolean) => {
    dispatch(updateUserSettings({ notifications: { ...settings.notifications, [field]: value } } as any));
    try { await track('preferences_changed', { scope: 'notifications', keys: [field] }); } catch {}
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 16 }}>
      <Text style={[styles.title, { color: colors.text }]}>Notificações</Text>
      <Text style={{ color: colors.muted, marginBottom: 12 }}>Controle granular por categoria</Text>

      {(
        [
          ['workouts', 'Treinos'],
          ['achievements', 'Conquistas'],
          ['social', 'Social'],
          ['challenges', 'Desafios'],
          ['reminders', 'Lembretes'],
          ['marketing', 'Marketing'],
        ] as Array<[keyof typeof settings.notifications, string]>
      ).map(([key, label]) => (
        <View key={key} style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}> 
          <Text style={{ color: colors.text, fontWeight: '600' }}>{label}</Text>
          <Switch value={settings.notifications[key]} onValueChange={(v) => update(key, v)} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', marginBottom: 6 },
  row: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});

