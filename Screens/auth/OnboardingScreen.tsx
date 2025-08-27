import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { t as tt } from '../../utils/i18n';
import { useOnboarding } from '../../hooks/useOnboarding';
import { MapPin, ArrowLeft, ArrowRight, Check, Heart, Target, Zap, Bell, Trophy } from 'lucide-react-native';

type Goal = 'weight-loss' | '10k' | 'performance';
type PreferredTime = 'morning' | 'afternoon' | 'evening';
type Terrain = 'road' | 'trail' | 'track';

export default function OnboardingScreen() {
  const { theme } = useTheme();
  const nav = useNavigation();
  const { markDone } = useOnboarding();

  const [currentStep, setCurrentStep] = useState(0);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [preferredTime, setPreferredTime] = useState<PreferredTime | null>(null);
  const [terrain, setTerrain] = useState<Terrain | null>(null);
  const [gpsPermission, setGpsPermission] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [healthPermission, setHealthPermission] = useState(false);

  const stepsCount = 4;
  const canProceed = useMemo(() => {
    if (currentStep === 0) return !!goal;
    if (currentStep === 1) return !!preferredTime;
    if (currentStep === 2) return !!terrain;
    if (currentStep === 3) return gpsPermission; // obrigatório no final
    return false;
  }, [currentStep, goal, preferredTime, terrain, gpsPermission]);

  const progressPct = useMemo(() => ((currentStep + 1) / stepsCount) * 100, [currentStep]);

  const goNext = async () => {
    if (currentStep < stepsCount - 1) {
      setCurrentStep(s => s + 1);
      return;
    }
    await markDone();
    (nav as any).navigate('Welcome');
  };

  const goBack = () => setCurrentStep(s => Math.max(0, s - 1));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={styles.header}> 
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{tt('onboarding_title')}</Text>
        <View style={styles.headerRight}>
          <Text style={[styles.badge, { color: theme.colors.muted }]}>{currentStep + 1} de {stepsCount}</Text>
        </View>
        <View style={[styles.progress, { backgroundColor: theme.colors.border }]}>
          <View style={[styles.progressFill, { width: `${progressPct}%`, backgroundColor: theme.colors.primary }]} />
        </View>
      </View>

      <View style={styles.content}> 
        {currentStep === 0 && (
          <View>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>{tt('onboarding_step_1')}</Text>
            <Text style={[styles.stepSubtitle, { color: theme.colors.muted }]}>Vamos personalizar sua experiência</Text>
            <View style={styles.cards}>
              <SelectableCard
                active={goal === 'weight-loss'}
                onPress={() => setGoal('weight-loss')}
                title={tt('onboarding_goal_weight_loss')}
                subtitle="Queimar calorias e manter forma"
                icon={<Heart size={20} color={'#fff'} />}
                chipColor="#ef4444"
                themeColors={{ card: theme.colors.card, ring: theme.colors.primary, text: theme.colors.text, muted: theme.colors.muted }}
              />
              <SelectableCard
                active={goal === '10k'}
                onPress={() => setGoal('10k')}
                title={tt('onboarding_goal_competition')}
                subtitle="Completar uma corrida de 10 quilômetros"
                icon={<Target size={20} color={'#fff'} />} 
                chipColor="#3b82f6"
                themeColors={{ card: theme.colors.card, ring: theme.colors.primary, text: theme.colors.text, muted: theme.colors.muted }}
              />
              <SelectableCard
                active={goal === 'performance'}
                onPress={() => setGoal('performance')}
                title={tt('onboarding_goal_fitness')}
                subtitle="Aumentar velocidade e resistência"
                icon={<Zap size={20} color={'#fff'} />} 
                chipColor="#a855f7"
                themeColors={{ card: theme.colors.card, ring: theme.colors.primary, text: theme.colors.text, muted: theme.colors.muted }}
              />
            </View>
          </View>
        )}

        {currentStep === 1 && (
          <View>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>{tt('onboarding_step_2')}</Text>
            <Text style={[styles.stepSubtitle, { color: theme.colors.muted }]}>Configuraremos lembretes personalizados</Text>
            <View style={styles.cards}>
              <SelectableCard
                active={preferredTime === 'morning'}
                onPress={() => setPreferredTime('morning')}
                title={tt('onboarding_time_morning')}
                subtitle="06:00 - 10:00"
                emoji="🌅"
                themeColors={{ card: theme.colors.card, ring: theme.colors.primary, text: theme.colors.text, muted: theme.colors.muted }}
              />
              <SelectableCard
                active={preferredTime === 'afternoon'}
                onPress={() => setPreferredTime('afternoon')}
                title={tt('onboarding_time_afternoon')}
                subtitle="12:00 - 17:00"
                emoji="☀️"
                themeColors={{ card: theme.colors.card, ring: theme.colors.primary, text: theme.colors.text, muted: theme.colors.muted }}
              />
              <SelectableCard
                active={preferredTime === 'evening'}
                onPress={() => setPreferredTime('evening')}
                title={tt('onboarding_time_evening')}
                subtitle="18:00 - 21:00"
                emoji="🌙"
                themeColors={{ card: theme.colors.card, ring: theme.colors.primary, text: theme.colors.text, muted: theme.colors.muted }}
              />
            </View>
          </View>
        )}

        {currentStep === 2 && (
          <View>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>{tt('onboarding_step_3')}</Text>
            <Text style={[styles.stepSubtitle, { color: theme.colors.muted }]}>Recomendaremos rotas adequadas</Text>
            <View style={styles.cards}>
              <SelectableCard
                active={terrain === 'road'}
                onPress={() => setTerrain('road')}
                title={tt('onboarding_terrain_road')}
                subtitle="Ruas e avenidas urbanas"
                chipColor="#6b7280"
                icon={<MapPin size={20} color={'#fff'} />}
                themeColors={{ card: theme.colors.card, ring: theme.colors.primary, text: theme.colors.text, muted: theme.colors.muted }}
              />
              <SelectableCard
                active={terrain === 'trail'}
                onPress={() => setTerrain('trail')}
                title={tt('onboarding_terrain_trail')}
                subtitle="Parques e áreas naturais"
                chipColor="#22c55e"
                icon={<MapPin size={20} color={'#fff'} />}
                themeColors={{ card: theme.colors.card, ring: theme.colors.primary, text: theme.colors.text, muted: theme.colors.muted }}
              />
              <SelectableCard
                active={terrain === 'track'}
                onPress={() => setTerrain('track')}
                title={tt('onboarding_terrain_mixed')}
                subtitle="Pistas de atletismo"
                chipColor="#f59e0b"
                icon={<MapPin size={20} color={'#fff'} />}
                themeColors={{ card: theme.colors.card, ring: theme.colors.primary, text: theme.colors.text, muted: theme.colors.muted }}
              />
            </View>
          </View>
        )}

        {currentStep === 3 && (
          <View>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>{tt('onboarding_step_4')}</Text>
            <Text style={[styles.stepSubtitle, { color: theme.colors.muted }]}>Para melhor experiência do app</Text>
            <View style={{ height: 12 }} />
            <PermissionRow
              title={tt('onboarding_permissions_gps')}
              subtitle="Para rastrear suas corridas"
              icon={<MapPin size={18} color={theme.colors.primary} />}
              actionLabel={gpsPermission ? '' : 'Permitir'}
              active={gpsPermission}
              onPress={() => setGpsPermission(true)}
              themeColors={theme.colors}
            />
            <PermissionRow
              title={tt('onboarding_permissions_notifications')}
              subtitle="Lembretes e atualizações"
              icon={<Bell size={18} color={theme.colors.secondary || theme.colors.text} />}
              actionLabel={notifications ? '' : 'Permitir'}
              active={notifications}
              onPress={() => setNotifications(v => !v)}
              themeColors={theme.colors}
            />
            <PermissionRow
              title={tt('onboarding_permissions_health')}
              subtitle="Sincronizar dados de saúde"
              icon={<Heart size={18} color={theme.colors.accent || theme.colors.text} />}
              actionLabel={healthPermission ? '' : 'Permitir'}
              active={healthPermission}
              onPress={() => setHealthPermission(v => !v)}
              themeColors={theme.colors}
            />
            <View style={styles.tipBox}>
              <Text style={[styles.tipText, { color: theme.colors.muted }]}>✨ Dica: Todas as permissões podem ser alteradas depois nas configurações.</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.footer}> 
        <Pressable onPress={goBack} disabled={currentStep === 0} style={[styles.secondaryBtn, { borderColor: theme.colors.border, opacity: currentStep === 0 ? 0.5 : 1 }]}> 
          <ArrowLeft size={16} color={theme.colors.text} />
          <Text style={[styles.secondaryBtnText, { color: theme.colors.text }]}>Voltar</Text>
        </Pressable>
        <Pressable onPress={goNext} disabled={!canProceed} style={[styles.primaryBtn, { backgroundColor: canProceed ? theme.colors.primary : theme.colors.border }]}> 
          <Text style={styles.primaryBtnText}>{currentStep === stepsCount - 1 ? 'Começar' : 'Continuar'}</Text>
          {currentStep === stepsCount - 1 ? (
            <Trophy size={16} color={'#fff'} />
          ) : (
            <ArrowRight size={16} color={'#fff'} />
          )}
        </Pressable>
      </View>
    </View>
  );
}

function SelectableCard(props: {
  active: boolean;
  onPress: () => void;
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  emoji?: string;
  chipColor?: string;
  themeColors: { card: string; ring: string; text: string; muted: string };
}) {
  const { active, onPress, title, subtitle, icon, emoji, chipColor, themeColors } = props;
  return (
    <Pressable onPress={onPress} style={[styles.card, { backgroundColor: themeColors.card, borderColor: active ? themeColors.ring : 'transparent' }]}>
      <View style={styles.cardRow}>
        <View style={[styles.iconBox, { backgroundColor: chipColor || '#e5e7eb' }]}>
          {emoji ? <Text style={styles.emoji}>{emoji}</Text> : icon}
        </View>
        <View style={styles.cardTextBox}>
          <Text style={[styles.cardTitle, { color: themeColors.text }]}>{title}</Text>
          <Text style={[styles.cardSubtitle, { color: themeColors.muted }]}>{subtitle}</Text>
        </View>
        {active ? <Check size={18} color={themeColors.ring} /> : null}
      </View>
    </Pressable>
  );
}

function PermissionRow(props: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  actionLabel: string;
  active: boolean;
  onPress: () => void;
  themeColors: any;
}) {
  const { title, subtitle, icon, actionLabel, active, onPress, themeColors } = props;
  return (
    <View style={[styles.permRow, { backgroundColor: themeColors.card }]}> 
      <View style={styles.permLeft}>
        <View style={[styles.permIcon, { backgroundColor: themeColors.primary + '22' }]}>{icon}</View>
        <View>
          <Text style={[styles.permTitle, { color: themeColors.text }]}>{title}</Text>
          <Text style={[styles.permSubtitle, { color: themeColors.muted }]}>{subtitle}</Text>
        </View>
      </View>
      <Pressable onPress={onPress} disabled={active} style={[styles.smallBtn, { backgroundColor: active ? '#16a34a' : 'transparent', borderColor: active ? 'transparent' : themeColors.border }]}> 
        {active ? <Check size={14} color={'#fff'} /> : <Text style={[styles.smallBtnText, { color: themeColors.text }]}>{actionLabel}</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  header: { paddingTop: 24, paddingBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800' },
  headerRight: { position: 'absolute', right: 0, top: 24 },
  badge: { fontSize: 12, fontWeight: '600' },
  progress: { height: 8, borderRadius: 6, overflow: 'hidden', marginTop: 12 },
  progressFill: { height: '100%' },
  content: { flex: 1, gap: 16 },
  stepTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  stepSubtitle: { fontSize: 14, marginTop: 4, textAlign: 'center' },
  cards: { marginTop: 16, gap: 12 },
  card: { borderRadius: 16, padding: 14, borderWidth: 2 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 22 },
  cardTextBox: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardSubtitle: { fontSize: 13, marginTop: 2 },
  permRow: { borderRadius: 16, padding: 14, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  permLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  permIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  permTitle: { fontSize: 15, fontWeight: '700' },
  permSubtitle: { fontSize: 13, marginTop: 2 },
  tipBox: { marginTop: 8, borderRadius: 14, padding: 12, backgroundColor: '#00000010' },
  tipText: { fontSize: 13 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  secondaryBtn: { borderWidth: 1, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 8 },
  secondaryBtnText: { fontSize: 14, fontWeight: '700' },
  primaryBtn: { borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 8 },
  primaryBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
});