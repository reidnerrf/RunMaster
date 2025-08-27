import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SectionTitle from '../../components/SectionTitle';
import IconButton from '../../components/IconButton';
import FlowHint from '../../components/FlowHint';
import FadeInUp from '../../components/FadeInUp';
import { useGate } from '../../hooks/useGate';
import ActionButton from '../../components/ActionButton';
import { useTheme } from '../../hooks/useTheme';
import { generatePlan, getWeeklyPlan, PlanDay } from '../../Lib/planner';
import EmptyState from '../../components/ui/EmptyState';
import Banner from '../../components/ui/Banner';
import Skeleton from '../../components/ui/Skeleton';
import { t as tt } from '../../utils/i18n';

export default function WorkoutsScreen() {
  const nav = useNavigation();
  const { isPremium, open } = useGate();
  const { theme } = useTheme();
  const [plan, setPlan] = useState<{ days: PlanDay[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { (async () => { try { const p = await getWeeklyPlan(); setPlan(p || await generatePlan()); } catch (e) { setError('Falha ao carregar plano'); } finally { setLoading(false); } })(); }, []);

  const today = new Date().toISOString().slice(0,10);
  const todayPlan = plan?.days.find(d => d.date === today);

  return (
    <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: theme.colors.background }}>
      <SectionTitle title={tt('workouts_title')} subtitle={tt('workouts_sub')} actionLabel="Gerar novamente" onAction={async () => setPlan(await generatePlan())} />

      {error ? <Banner type="error" title={error} /> : null}
      {loading ? (
        <View style={{ gap: 8 }}>
          <Skeleton height={84} />
          <Skeleton height={18} />
        </View>
      ) : !plan || plan.days.length === 0 ? (
        <EmptyState title={tt('workouts_no_plan')} description="Gere um novo plano para começar seus treinos." ctaLabel={tt('workouts_generate_plan')} onCtaPress={async () => { setLoading(true); try { setPlan(await generatePlan()); } finally { setLoading(false); } }} />
      ) : (
        <View style={[styles.calendar, { backgroundColor: theme.colors.card }]}>
          {plan?.days.map((d) => (
            <View key={d.date} style={[styles.day, { backgroundColor: d.date === today ? theme.colors.primary : theme.colors.card, borderColor: theme.colors.border }]}> 
              <Text style={{ color: d.date === today ? '#fff' : theme.colors.text, fontWeight: '800' }}>{new Date(d.date).toLocaleDateString('pt-BR', { weekday: 'short' })}</Text>
              <Text style={{ color: d.date === today ? '#fff' : theme.colors.muted }}>{d.type.toUpperCase()}</Text>
              {d.targetKm && <Text style={{ color: d.date === today ? '#fff' : theme.colors.text }}>{d.targetKm} km</Text>}
            </View>
          ))}
        </View>
      )}

      {todayPlan && (
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}> 
          <Text style={[styles.title, { color: theme.colors.text }]}>Hoje: {todayPlan.type.toUpperCase()}</Text>
          <Text style={{ color: theme.colors.muted }}>{todayPlan.description}</Text>
          <ActionButton label="Iniciar" onPress={() => nav.navigate('Run' as never, { from: 'Workouts' } as never)} style={{ marginTop: 8 }} />
        </View>
      )}

      {!isPremium && (
        <Pressable onPress={() => open('workouts_personalized')} style={[styles.locked, { borderColor: theme.colors.border }]}> 
          <Text style={{ color: theme.colors.muted }}>Treinos personalizados e música adaptativa (Premium)</Text>
        </Pressable>
      )}

      <FlowHint steps={["Gerar plano", "Ver treino do dia", "Iniciar treino"]} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  calendar: { borderRadius: 16, padding: 8, marginBottom: 12, flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' },
  day: { width: '31%', borderRadius: 12, padding: 10, borderWidth: 1, alignItems: 'center' },
  card: { borderRadius: 16, padding: 14, marginBottom: 12 },
  title: { fontWeight: '800', marginBottom: 8 },
  locked: { borderRadius: 12, borderWidth: 1, padding: 14, alignItems: 'center' },
});