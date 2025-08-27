import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { getGoals, setGoals, Goals, setDailyNotification } from '../../Lib/goals';

export default function GoalsScreen() {
  const { theme } = useTheme();
  const [goals, setLocal] = useState<Goals>({ daily: {}, weekly: {} });
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => { getGoals().then(setLocal); }, []);

  const save = async () => {
    await setGoals(goals);
    await setDailyNotification();
    setSaved('Salvo!');
    setTimeout(() => setSaved(null), 1000);
  };

  const Field = ({ label, value, onChange }: any) => (
    <View style={styles.field}> 
      <Text style={{ color: theme.colors.text }}>{label}</Text>
      <TextInput keyboardType="numeric" value={value?.toString() || ''} onChangeText={(t) => onChange(Number(t || 0))} style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: theme.colors.background }]} />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: theme.colors.background }}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Metas</Text>

      <View style={[styles.card, { backgroundColor: theme.colors.card }]}> 
        <Text style={[styles.subtitle, { color: theme.colors.text }]}>Diárias</Text>
        <Field label="Calorias" value={goals.daily.calories} onChange={(v: number) => setLocal({ ...goals, daily: { ...goals.daily, calories: v } })} />
        <Field label="Distância (km)" value={goals.daily.distanceKm} onChange={(v: number) => setLocal({ ...goals, daily: { ...goals.daily, distanceKm: v } })} />
        <Field label="Passos" value={goals.daily.steps} onChange={(v: number) => setLocal({ ...goals, daily: { ...goals.daily, steps: v } })} />
      </View>

      <View style={[styles.card, { backgroundColor: theme.colors.card }]}> 
        <Text style={[styles.subtitle, { color: theme.colors.text }]}>Semanais</Text>
        <Field label="Calorias" value={goals.weekly.calories} onChange={(v: number) => setLocal({ ...goals, weekly: { ...goals.weekly, calories: v } })} />
        <Field label="Distância (km)" value={goals.weekly.distanceKm} onChange={(v: number) => setLocal({ ...goals, weekly: { ...goals.weekly, distanceKm: v } })} />
        <Field label="Passos" value={goals.weekly.steps} onChange={(v: number) => setLocal({ ...goals, weekly: { ...goals.weekly, steps: v } })} />
      </View>

      <Pressable onPress={save} style={[styles.btn, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.btnText}>{saved ?? 'Salvar'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '800', marginBottom: 8 },
  subtitle: { fontWeight: '800', marginBottom: 8 },
  card: { borderRadius: 16, padding: 14, marginBottom: 12 },
  field: { marginBottom: 10 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginTop: 6 },
  btn: { borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '800' },
});