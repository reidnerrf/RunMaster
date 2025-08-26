import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
  Dimensions
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { createAICoach, RunnerProfile, PhysiologicalData } from '../Lib/aiCoach';
import { createTerritoryManager, Territory, ThematicRoute } from '../Lib/territory';
import { createSafetyManager } from '../Lib/safety';
import { createWellnessManager, WellnessMetrics } from '../Lib/wellness';
import { createCharityManager } from '../Lib/charity';
import { ThemedText } from '../components/ThemedText';
import { ActionButton } from '../components/ActionButton';
import { IconButton } from '../components/IconButton';
import { Shimmer } from '../components/ui/Shimmer';
import { BlurCard } from '../components/ui/BlurCard';
import { Heart, MapPin, Shield, Trophy, Leaf, Users, TrendingUp, Target } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function WellnessScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [aiCoach, setAiCoach] = useState<any>(null);
  const [territoryManager, setTerritoryManager] = useState<any>(null);
  const [safetyManager, setSafetyManager] = useState<any>(null);
  const [wellnessManager, setWellnessManager] = useState<any>(null);
  const [charityManager, setCharityManager] = useState<any>(null);
  
  // Estados dos dados
  const [wellnessSummary, setWellnessSummary] = useState<any>(null);
  const [territoryProgress, setTerritoryProgress] = useState<any>(null);
  const [charityStats, setCharityStats] = useState<any>(null);
  const [safetyAlerts, setSafetyAlerts] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    initializeManagers();
  }, []);

  const initializeManagers = async () => {
    try {
      // Inicializa todos os gerenciadores
      const coach = createAICoach({
        type: 'endurance',
        experience: 12,
        weeklyGoal: 30,
        preferredTime: 'morning',
        terrain: 'mixed',
        social: true
      });

      const territory = createTerritoryManager();
      const safety = createSafetyManager();
      const wellness = createWellnessManager();
      const charity = createCharityManager();

      setAiCoach(coach);
      setTerritoryManager(territory);
      setSafetyManager(safety);
      setWellnessManager(wellness);
      setCharityManager(charity);

      // Carrega dados iniciais
      await loadInitialData(coach, territory, safety, wellness, charity);
      
    } catch (error) {
      console.error('Error initializing managers:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInitialData = async (coach: any, territory: any, safety: any, wellness: any, charity: any) => {
    try {
      // Dados de bem-estar
      const summary = wellness.getWellnessSummary();
      setWellnessSummary(summary);

      // Progresso territorial
      const progress = territory.getTerritoryProgress();
      setTerritoryProgress(progress);

      // Estatísticas de caridade
      if (user?.id) {
        const stats = charity.getUserCharityStats(user.id);
        setCharityStats(stats);
      }

      // Alertas de segurança
      const alerts = safety.getSafetyAlerts();
      setSafetyAlerts(alerts);

      // Recomendações de rotas temáticas
      const userLocation = { lat: -23.5505, lng: -46.6333 }; // São Paulo
      const routes = territory.getRecommendations(userLocation);
      setRecommendations(routes);

    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const getTrainingRecommendation = async () => {
    if (!aiCoach) return;

    try {
      // Dados fisiológicos simulados
      const physiologicalData: PhysiologicalData = {
        hrv: 65,
        sleepHours: 7.5,
        sleepQuality: 80,
        fatigue: 30,
        stress: 40,
        mood: 75,
        lastWorkoutIntensity: 60,
        lastWorkoutDistance: 8,
        lastWorkoutDate: Date.now() - 86400000 // 1 dia atrás
      };

      const recommendation = await aiCoach.getTrainingRecommendation(physiologicalData);
      
      Alert.alert(
        'Recomendação do Coach IA',
        `${recommendation.reason}\n\nDistância: ${recommendation.distance}km\nIntensidade: ${recommendation.intensity}%\n\nDicas:\n${recommendation.tips.join('\n')}`,
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Error getting recommendation:', error);
    }
  };

  const startLiveTracking = () => {
    if (!safetyManager || !user?.id) return;

    try {
      const session = safetyManager.startLiveTracking(user.id, true);
      Alert.alert(
        'Live Tracking Ativado',
        `Sessão iniciada: ${session.id}\n\nSeus contatos de emergência serão notificados se necessário.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error starting live tracking:', error);
    }
  };

  const addGratitudeEntry = () => {
    if (!wellnessManager) return;

    try {
      const entry = wellnessManager.addGratitudeEntry({
        userId: user?.id || 'user_1',
        type: 'run',
        title: 'Corrida matinal incrível!',
        description: 'Hoje acordei cedo e corri 5km. O nascer do sol estava lindo e me senti muito bem!',
        intensity: 85,
        tags: ['corrida', 'manhã', 'natureza', 'energia'],
        isPublic: true
      });

      Alert.alert(
        'Gratidão Registrada!',
        'Sua entrada foi adicionada com sucesso. Continue cultivando a gratidão!',
        [{ text: 'OK' }]
      );

      // Recarrega dados
      loadInitialData(aiCoach, territoryManager, safetyManager, wellnessManager, charityManager);

    } catch (error) {
      console.error('Error adding gratitude entry:', error);
    }
  };

  const createCharityRun = () => {
    if (!charityManager || !user?.id) return;

    try {
      const charityRun = charityManager.createCharityRun(
        user.id,
        `run_${Date.now()}`,
        'charity_1', // Corrida pela Água
        5.2, // km
        1800, // 30 minutos
        450, // calorias
        'per_km',
        'Corrida solidária pela água potável!'
      );

      Alert.alert(
        'Corrida Solidária Criada!',
        `Você doou R$ ${charityRun.donationAmount.toFixed(2)} para água potável!\n\nDistância: ${charityRun.distance}km`,
        [{ text: 'Ver Impacto' }]
      );

      // Recarrega estatísticas
      const stats = charityManager.getUserCharityStats(user.id);
      setCharityStats(stats);

    } catch (error) {
      console.error('Error creating charity run:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <Shimmer height={24} width={200} />
          <Shimmer height={16} width={150} />
        </View>
        <View style={styles.content}>
          <Shimmer height={120} style={styles.card} />
          <Shimmer height={100} style={styles.card} />
          <Shimmer height={100} style={styles.card} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>Bem-estar & Impacto</ThemedText>
        <ThemedText style={styles.subtitle}>
          Monitore sua saúde e faça a diferença correndo
        </ThemedText>
      </View>

      {/* Coach IA */}
      <BlurCard style={styles.card}>
        <View style={styles.cardHeader}>
          <Heart color={theme.colors.primary} size={24} />
          <ThemedText style={styles.cardTitle}>Coach IA Personalizado</ThemedText>
        </View>
        <ThemedText style={styles.cardDescription}>
          Receba recomendações de treino baseadas em seus dados fisiológicos
        </ThemedText>
        <ActionButton
          label="Receber Recomendação"
          onPress={getTrainingRecommendation}
          style={styles.actionButton}
        />
      </BlurCard>

      {/* Resumo de Bem-estar */}
      {wellnessSummary && (
        <BlurCard style={styles.card}>
          <View style={styles.cardHeader}>
            <TrendingUp color={theme.colors.primary} size={24} />
            <ThemedText style={styles.cardTitle}>Seu Bem-estar Hoje</ThemedText>
          </View>
          
          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <ThemedText style={styles.metricValue}>{wellnessSummary.currentMood}</ThemedText>
              <ThemedText style={styles.metricLabel}>Humor</ThemedText>
            </View>
            <View style={styles.metric}>
              <ThemedText style={styles.metricValue}>{wellnessSummary.currentEnergy}</ThemedText>
              <ThemedText style={styles.metricLabel}>Energia</ThemedText>
            </View>
            <View style={styles.metric}>
              <ThemedText style={styles.metricValue}>{wellnessSummary.currentStress}</ThemedText>
              <ThemedText style={styles.metricLabel}>Estresse</ThemedText>
            </View>
          </View>

          <View style={styles.trendContainer}>
            <ThemedText style={styles.trendLabel}>
              Tendência semanal: {wellnessSummary.weeklyTrend === 'improving' ? '📈 Melhorando' : 
                                wellnessSummary.weeklyTrend === 'declining' ? '📉 Declinando' : '➡️ Estável'}
            </ThemedText>
          </View>
        </BlurCard>
      )}

      {/* Territórios e Conquistas */}
      {territoryProgress && (
        <BlurCard style={styles.card}>
          <View style={styles.cardHeader}>
            <Trophy color={theme.colors.primary} size={24} />
            <ThemedText style={styles.cardTitle}>Conquistas Territoriais</ThemedText>
          </View>
          
          <View style={styles.progressRow}>
            <View style={styles.progressItem}>
              <ThemedText style={styles.progressValue}>{territoryProgress.unlockedTerritories}</ThemedText>
              <ThemedText style={styles.progressLabel}>Desbloqueados</ThemedText>
            </View>
            <View style={styles.progressItem}>
              <ThemedText style={styles.progressValue}>{territoryProgress.totalPoints}</ThemedText>
              <ThemedText style={styles.progressLabel}>Pontos</ThemedText>
            </View>
            <View style={styles.progressItem}>
              <ThemedText style={styles.progressValue}>#{territoryProgress.rank}</ThemedText>
              <ThemedText style={styles.progressLabel}>Ranking</ThemedText>
            </View>
          </View>

          {territoryProgress.nextUnlock && (
            <View style={styles.nextUnlock}>
              <ThemedText style={styles.nextUnlockLabel}>
                Próximo: {territoryProgress.nextUnlock.name}
              </ThemedText>
              <ThemedText style={styles.nextUnlockDesc}>
                {territoryProgress.nextUnlock.description}
              </ThemedText>
            </View>
          )}
        </BlurCard>
      )}

      {/* Rotas Temáticas */}
      {recommendations.length > 0 && (
        <BlurCard style={styles.card}>
          <View style={styles.cardHeader}>
            <MapPin color={theme.colors.primary} size={24} />
            <ThemedText style={styles.cardTitle}>Rotas Temáticas Recomendadas</ThemedText>
          </View>
          
          {recommendations.slice(0, 3).map((route, index) => (
            <View key={route.id} style={styles.routeItem}>
              <View style={styles.routeInfo}>
                <ThemedText style={styles.routeName}>{route.name}</ThemedText>
                <ThemedText style={styles.routeDetails}>
                  {route.distance}km • {route.estimatedTime}min • {route.difficulty}
                </ThemedText>
              </View>
              <View style={styles.routeTheme}>
                <Text style={styles.themeIcon}>
                  {route.theme === 'parks' ? '🌳' : 
                   route.theme === 'historical' ? '🏛️' : 
                   route.theme === 'gastronomic' ? '🍕' : '🏃'}
                </Text>
              </View>
            </View>
          ))}
        </BlurCard>
      )}

      {/* Segurança e Live Tracking */}
      <BlurCard style={styles.card}>
        <View style={styles.cardHeader}>
          <Shield color={theme.colors.primary} size={24} />
          <ThemedText style={styles.cardTitle}>Segurança & Live Tracking</ThemedText>
        </View>
        
        <View style={styles.safetyRow}>
          <View style={styles.safetyItem}>
            <ThemedText style={styles.safetyLabel}>Alertas Ativos</ThemedText>
            <ThemedText style={styles.safetyValue}>{safetyAlerts.length}</ThemedText>
          </View>
          <View style={styles.safetyItem}>
            <ThemedText style={styles.safetyLabel}>Check-ins</ThemedText>
            <ThemedText style={styles.safetyValue}>Automático</ThemedText>
          </View>
        </View>

        <ActionButton
          label="Ativar Live Tracking"
          onPress={startLiveTracking}
          style={styles.actionButton}
        />
      </BlurCard>

      {/* Caridade e Impacto */}
      {charityStats && (
        <BlurCard style={styles.card}>
          <View style={styles.cardHeader}>
            <Leaf color={theme.colors.primary} size={24} />
            <ThemedText style={styles.cardTitle}>Seu Impacto Social</ThemedText>
          </View>
          
          <View style={styles.charityRow}>
            <View style={styles.charityItem}>
              <ThemedText style={styles.charityValue}>{charityStats.totalKm}</ThemedText>
              <ThemedText style={styles.charityLabel}>Km Corridos</ThemedText>
            </View>
            <View style={styles.charityItem}>
              <ThemedText style={styles.charityValue}>R$ {charityStats.totalDonations}</ThemedText>
              <ThemedText style={styles.charityLabel}>Doações</ThemedText>
            </View>
            <View style={styles.charityItem}>
              <ThemedText style={styles.charityValue}>#{charityStats.rank}</ThemedText>
              <ThemedText style={styles.charityLabel}>Ranking</ThemedText>
            </View>
          </View>

          <ThemedText style={styles.impactText}>{charityStats.impact}</ThemedText>

          <View style={styles.charityActions}>
            <ActionButton
              label="Criar Corrida Solidária"
              onPress={createCharityRun}
              style={styles.actionButton}
            />
            <ActionButton
              label="Ver Campanhas"
              onPress={() => Alert.alert('Campanhas', 'Lista de campanhas ativas')}
              style={[styles.actionButton, styles.secondaryButton]}
            />
          </View>
        </BlurCard>
      )}

      {/* Ações Rápidas */}
      <View style={styles.quickActions}>
        <Pressable
          style={[styles.quickAction, { backgroundColor: theme.colors.card }]}
          onPress={addGratitudeEntry}
        >
          <Text style={styles.quickActionIcon}>🙏</Text>
          <ThemedText style={styles.quickActionLabel}>Gratidão</ThemedText>
        </Pressable>

        <Pressable
          style={[styles.quickAction, { backgroundColor: theme.colors.card }]}
          onPress={() => Alert.alert('Metas', 'Configurar metas de bem-estar')}
        >
          <Text style={styles.quickActionIcon}>🎯</Text>
          <ThemedText style={styles.quickActionLabel}>Metas</ThemedText>
        </Pressable>

        <Pressable
          style={[styles.quickAction, { backgroundColor: theme.colors.card }]}
          onPress={() => Alert.alert('Comunidade', 'Conectar com outros corredores')}
        >
          <Text style={styles.quickActionIcon}>👥</Text>
          <ThemedText style={styles.quickActionLabel}>Comunidade</ThemedText>
        </Pressable>
      </View>

      {/* Insights */}
      {wellnessSummary?.insights && wellnessSummary.insights.length > 0 && (
        <BlurCard style={styles.card}>
          <View style={styles.cardHeader}>
            <Target color={theme.colors.primary} size={24} />
            <ThemedText style={styles.cardTitle}>Insights Personalizados</ThemedText>
          </View>
          
          {wellnessSummary.insights.slice(0, 3).map((insight: any, index: number) => (
            <View key={insight.id} style={styles.insightItem}>
              <ThemedText style={styles.insightTitle}>{insight.title}</ThemedText>
              <ThemedText style={styles.insightDescription}>{insight.description}</ThemedText>
              {insight.actionable && (
                <Pressable style={styles.insightAction}>
                  <ThemedText style={[styles.insightActionText, { color: theme.colors.primary }]}>
                    {insight.actionText}
                  </ThemedText>
                </Pressable>
              )}
            </View>
          ))}
        </BlurCard>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  content: {
    padding: 20,
  },
  card: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  cardDescription: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 16,
    lineHeight: 20,
  },
  actionButton: {
    marginTop: 8,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6C63FF',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  metricLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  trendContainer: {
    alignItems: 'center',
    paddingTop: 8,
  },
  trendLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  progressItem: {
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  progressLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  nextUnlock: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  nextUnlockLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  nextUnlockDesc: {
    fontSize: 12,
    opacity: 0.8,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  routeDetails: {
    fontSize: 12,
    opacity: 0.7,
  },
  routeTheme: {
    marginLeft: 12,
  },
  themeIcon: {
    fontSize: 24,
  },
  safetyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  safetyItem: {
    alignItems: 'center',
  },
  safetyLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  safetyValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  charityRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  charityItem: {
    alignItems: 'center',
  },
  charityValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00B894',
  },
  charityLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  impactText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  charityActions: {
    gap: 12,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickAction: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    minWidth: 80,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  insightItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  insightDescription: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
    marginBottom: 12,
  },
  insightAction: {
    alignSelf: 'flex-start',
  },
  insightActionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});