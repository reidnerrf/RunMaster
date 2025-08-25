import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SectionTitle from '../../components/SectionTitle';
import IconButton from '../../components/IconButton';
import FlowHint from '../../components/FlowHint';
import FadeInUp from '../../components/FadeInUp';
import { useGate } from '../../hooks/useGate';
import ActionButton from '../../components/ActionButton';
import { useTheme } from '../../hooks/useTheme';

export default function WorkoutsScreen() {
  const nav = useNavigation();
  const { isPremium, open } = useGate();
  const { theme } = useTheme();

  return (
    <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: theme.colors.background }}>
      <SectionTitle title="Treinos" subtitle="Monte seu plano" />

      <View style={[styles.calendar, { backgroundColor: theme.colors.card }]}><Text style={{ color: theme.colors.muted }}>Calendário (mock)</Text></View>

      {['Intervalado', 'Resistência', 'Velocidade'].map((t, i) => (
        <FadeInUp key={t} delay={i * 70}>
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}> 
            <Text style={[styles.title, { color: theme.colors.text }]}>{t}</Text>
            <View style={styles.row}> 
              <IconButton onPress={() => nav.navigate('ConnectSpotify' as never)}><Text style={{ color: 'white' }}>🎵</Text></IconButton>
              <IconButton onPress={() => nav.navigate('ConnectWatch' as never)}><Text style={{ color: 'white' }}>⌚</Text></IconButton>
              <ActionButton label="Iniciar" onPress={() => nav.navigate('Run' as never, { from: 'Workouts' } as never)} style={{ flex: 1 }} />
            </View>
          </View>
        </FadeInUp>
      ))}

      {!isPremium && (
        <Pressable onPress={() => open('workouts_personalized')} style={[styles.locked, { borderColor: theme.colors.border }]}> 
          <Text style={{ color: theme.colors.muted }}>Treinos personalizados e música adaptativa (Premium)</Text>
        </Pressable>
      )}

      <FlowHint steps={["Escolher treino", "3…2…1 (contagem)", "Tela Corrida"]} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  calendar: { height: 120, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  card: { borderRadius: 16, padding: 14, marginBottom: 12 },
  title: { fontWeight: '800', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  locked: { borderRadius: 12, borderWidth: 1, padding: 14, alignItems: 'center' },
});