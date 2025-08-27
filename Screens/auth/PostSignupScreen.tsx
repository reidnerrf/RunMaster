import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { useOnboarding, Objectives } from '../../hooks/useOnboarding';

export default function PostSignupScreen() {
  const { theme } = useTheme();
  const nav = useNavigation();
  const { profile, saveProfile } = useOnboarding();
  const [height, setHeight] = useState<number>(profile.heightCm || 170);
  const [weight, setWeight] = useState<number>(profile.weightKg || 70);
  const [obj, setObj] = useState<Objectives>(profile.objectives || {});

  const toggle = (k: keyof Objectives) => setObj((p) => ({ ...p, [k]: !p[k] }));

  const inc = (k: 'height'|'weight', d: number) => {
    if (k === 'height') setHeight((v) => Math.max(120, Math.min(220, v + d)));
    else setWeight((v) => Math.max(40, Math.min(180, v + d)));
  };

  const save = async () => {
    await saveProfile({ heightCm: height, weightKg: weight, objectives: obj });
    (nav as any).navigate('Main');
  };

  const Chip = ({ label, on, onPress }: any) => (
    <Pressable onPress={onPress} style={{ paddingVertical: 10, paddingHorizontal: 14, borderRadius: 20, backgroundColor: on ? theme.colors.primary : theme.colors.card, borderWidth: 1, borderColor: theme.colors.border }}>
      <Text style={{ color: on ? '#fff' : theme.colors.text, fontWeight: '700' }}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}> 
        <Text style={[styles.title, { color: theme.colors.text }]}>Seu perfil</Text>
        <Text style={{ color: theme.colors.muted }}>Altura</Text>
        <View style={styles.row}> 
          <Pressable onPress={() => inc('height', -1)} style={[styles.step, { borderColor: theme.colors.border }]}><Text style={styles.stepText}>-</Text></Pressable>
          <Text style={[styles.value, { color: theme.colors.text }]}>{height} cm</Text>
          <Pressable onPress={() => inc('height', +1)} style={[styles.step, { borderColor: theme.colors.border }]}><Text style={styles.stepText}>+</Text></Pressable>
        </View>
        <Text style={{ color: theme.colors.muted, marginTop: 6 }}>Peso</Text>
        <View style={styles.row}> 
          <Pressable onPress={() => inc('weight', -1)} style={[styles.step, { borderColor: theme.colors.border }]}><Text style={styles.stepText}>-</Text></Pressable>
          <Text style={[styles.value, { color: theme.colors.text }]}>{weight} kg</Text>
          <Pressable onPress={() => inc('weight', +1)} style={[styles.step, { borderColor: theme.colors.border }]}><Text style={styles.stepText}>+</Text></Pressable>
        </View>

        <Text style={[styles.subtitle, { color: theme.colors.text }]}>Objetivos</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Chip label="Emagrecimento" on={!!obj.weightLoss} onPress={() => toggle('weightLoss')} />
          <Chip label="Vida saudável" on={!!obj.health} onPress={() => toggle('health')} />
          <Chip label="Competir" on={!!obj.compete} onPress={() => toggle('compete')} />
          <Chip label="Explorar lugares" on={!!obj.explore} onPress={() => toggle('explore')} />
          <Chip label="Conectar pessoas" on={!!obj.connect} onPress={() => toggle('connect')} />
        </View>

        <Pressable onPress={save} style={[styles.btn, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.btnText}>Continuar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  card: { borderRadius: 20, padding: 20, gap: 8 },
  title: { fontSize: 24, fontWeight: '800' },
  subtitle: { marginTop: 10, fontWeight: '800' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 6 },
  value: { fontSize: 18, fontWeight: '800' },
  step: { width: 42, height: 42, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  stepText: { fontSize: 18, fontWeight: '900' },
  btn: { marginTop: 14, paddingVertical: 14, alignItems: 'center', borderRadius: 16 },
  btnText: { color: '#fff', fontWeight: '800' },
});