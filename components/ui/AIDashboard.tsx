import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Card, Button, Badge, Skeleton } from './index';
import { 
  getAISuggestions, 
  AIRouteSuggestion, 
  AIWorkoutPlan, 
  AINutritionAdvice,
  AIPerformanceAnalysis,
  AIGoalOptimization,
  AIWeatherOptimization,
  AISocialRecommendations
} from '../../Lib/ai-enhanced';
import { 
  Brain, 
  Route, 
  Dumbbell, 
  Apple, 
  TrendingUp, 
  Target, 
  Cloud, 
  Users,
  Zap,
  Clock,
  MapPin,
  Star
} from 'lucide-react-native';

type AIDashboardProps = {
  userProfile?: any;
  runningHistory?: any[];
  preferences?: any;
  currentGoals?: any[];
};

export default function AIDashboard({ 
  userProfile, 
  runningHistory, 
  preferences, 
  currentGoals 
}: AIDashboardProps) {
  const { theme } = useTheme();
  const [aiData, setAiData] = useState<{
    routes: AIRouteSuggestion[];
    workout_plan: AIWorkoutPlan;
    nutrition: AINutritionAdvice;
    performance: AIPerformanceAnalysis;
    goals: AIGoalOptimization;
    weather: AIWeatherOptimization;
    social: AISocialRecommendations;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'routes' | 'workouts' | 'nutrition' | 'performance' | 'goals' | 'weather' | 'social'>('overview');

  useEffect(() => {
    loadAIData();
  }, []);

  const loadAIData = async () => {
    try {
      setLoading(true);
      const data = await getAISuggestions({
        userProfile,
        runningHistory,
        preferences,
        currentGoals,
        routeContext: { distance_preference_km: 5, difficulty: 'moderate' },
        workoutGoal: { type: 'fitness', current_fitness: 'intermediate', available_days_per_week: 4, preferred_duration_minutes: 45 },
        location: { lat: -23.5505, lon: -46.6333 }
      });
      setAiData(data);
    } catch (error) {
      console.error('Erro ao carregar dados de IA:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <View style={styles.overviewContainer}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        🧠 Suas Sugestões de IA
      </Text>
      
      {/* Resumo das principais sugestões */}
      <View style={styles.summaryGrid}>
        <Card style={styles.summaryCard}>
          <Route size={20} color={theme.colors.primary} />
          <Text style={[styles.summaryNumber, { color: theme.colors.text }]}>
            {aiData?.routes?.length || 0}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.colors.muted }]}>
            Rotas Sugeridas
          </Text>
        </Card>

        <Card style={styles.summaryCard}>
          <Dumbbell size={20} color={theme.colors.secondary} />
          <Text style={[styles.summaryNumber, { color: theme.colors.text }]}>
            {aiData?.workout_plan?.workouts?.length || 0}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.colors.muted }]}>
            Treinos IA
          </Text>
        </Card>

        <Card style={styles.summaryCard}>
          <TrendingUp size={20} color={theme.colors.accent} />
          <Text style={[styles.summaryNumber, { color: theme.colors.text }]}>
            {aiData?.performance?.current_fitness?.vo2_max_estimate || 0}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.colors.muted }]}>
            VO2 Max
          </Text>
        </Card>

        <Card style={styles.summaryCard}>
          <Target size={20} color={theme.colors.primary} />
          <Text style={[styles.summaryNumber, { color: theme.colors.text }]}>
            {aiData?.goals?.current_status?.progress_percent || 0}%
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.colors.muted }]}>
            Meta Atual
          </Text>
        </Card>
      </View>

      {/* Sugestão principal do dia */}
      {aiData?.routes?.[0] && (
        <Card style={styles.mainSuggestion}>
          <View style={styles.suggestionHeader}>
            <Brain size={24} color={theme.colors.primary} />
            <Text style={[styles.suggestionTitle, { color: theme.colors.text }]}>
              Sugestão do Dia
            </Text>
          </View>
          <Text style={[styles.routeName, { color: theme.colors.text }]}>
            {aiData.routes[0].name}
          </Text>
          <View style={styles.routeDetails}>
            <Badge label={`${aiData.routes[0].distance_km}km`} variant="primary" />
            <Badge label={aiData.routes[0].difficulty} variant="secondary" />
            <Badge label={`${aiData.routes[0].safety_score}%`} variant="success" />
          </View>
          <Text style={[styles.aiReasoning, { color: theme.colors.muted }]}>
            {aiData.routes[0].ai_reasoning}
          </Text>
          <Button title="Ver Detalhes" onPress={() => setActiveTab('routes')} />
        </Card>
      )}
    </View>
  );

  const renderRoutes = () => (
    <View style={styles.tabContainer}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        🗺️ Rotas Inteligentes
      </Text>
      {aiData?.routes?.map((route, index) => (
        <Card key={route.id} style={styles.routeCard}>
          <View style={styles.routeHeader}>
            <Text style={[styles.routeName, { color: theme.colors.text }]}>
              {route.name}
            </Text>
            <Star size={16} color={theme.colors.accent} />
          </View>
          <View style={styles.routeStats}>
            <View style={styles.routeStat}>
              <MapPin size={14} color={theme.colors.muted} />
              <Text style={[styles.routeStatText, { color: theme.colors.muted }]}>
                {route.distance_km}km
              </Text>
            </View>
            <View style={styles.routeStat}>
              <Zap size={14} color={theme.colors.muted} />
              <Text style={[styles.routeStatText, { color: theme.colors.muted }]}>
                {route.elevation_gain_m}m
              </Text>
            </View>
            <View style={styles.routeStat}>
              <Clock size={14} color={theme.colors.muted} />
              <Text style={[styles.routeStatText, { color: theme.colors.muted }]}>
                {route.surface_type}
              </Text>
            </View>
          </View>
          <View style={styles.routeBadges}>
            <Badge label={route.difficulty} variant="primary" />
            <Badge label={`Segurança: ${route.safety_score}%`} variant="success" />
          </View>
          <Text style={[styles.aiReasoning, { color: theme.colors.muted }]}>
            {route.ai_reasoning}
          </Text>
          <View style={styles.routeActions}>
            <Button title="Iniciar" variant="primary" onPress={() => {}} />
            <Button title="Salvar" variant="outline" onPress={() => {}} />
          </View>
        </Card>
      ))}
    </View>
  );

  const renderWorkouts = () => (
    <View style={styles.tabContainer}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        💪 Plano de Treino IA
      </Text>
      {aiData?.workout_plan && (
        <Card style={styles.workoutPlanCard}>
          <Text style={[styles.planName, { color: theme.colors.text }]}>
            {aiData.workout_plan.name}
          </Text>
          <Text style={[styles.planDescription, { color: theme.colors.muted }]}>
            {aiData.workout_plan.description}
          </Text>
          <View style={styles.planStats}>
            <Badge label={`${aiData.workout_plan.duration_weeks} semanas`} variant="primary" />
            <Badge label={aiData.workout_plan.difficulty} variant="secondary" />
          </View>
          <Text style={[styles.planSectionTitle, { color: theme.colors.text }]}>
            Treinos da Semana
          </Text>
          {aiData.workout_plan.workouts?.slice(0, 5).map((workout, index) => (
            <View key={index} style={styles.workoutItem}>
              <View style={styles.workoutHeader}>
                <Text style={[styles.workoutDay, { color: theme.colors.primary }]}>
                  Dia {workout.day}
                </Text>
                <Badge label={workout.type} variant="outline" />
              </View>
              <Text style={[styles.workoutDescription, { color: theme.colors.text }]}>
                {workout.description}
              </Text>
              {workout.pacing_target && (
                <Text style={[styles.workoutPacing, { color: theme.colors.muted }]}>
                  Pace: {workout.pacing_target}/km
                </Text>
              )}
            </View>
          ))}
        </Card>
      )}
    </View>
  );

  const renderNutrition = () => (
    <View style={styles.tabContainer}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        🍎 Conselhos Nutricionais
      </Text>
      {aiData?.nutrition && (
        <View style={styles.nutritionContainer}>
          <Card style={styles.nutritionCard}>
            <Text style={[styles.nutritionTitle, { color: theme.colors.text }]}>
              Antes da Corrida
            </Text>
            <Text style={[styles.nutritionText, { color: theme.colors.muted }]}>
              {aiData.nutrition.pre_run.timing_minutes} min antes
            </Text>
            <Text style={[styles.nutritionText, { color: theme.colors.muted }]}>
              {aiData.nutrition.pre_run.foods.join(', ')}
            </Text>
          </Card>

          <Card style={styles.nutritionCard}>
            <Text style={[styles.nutritionTitle, { color: theme.colors.text }]}>
              Durante a Corrida
            </Text>
            <Text style={[styles.nutritionText, { color: theme.colors.muted }]}>
              {aiData.nutrition.during_run.hydration_plan}
            </Text>
            <Text style={[styles.nutritionText, { color: theme.colors.muted }]}>
              {aiData.nutrition.during_run.fuel_timing}
            </Text>
          </Card>

          <Card style={styles.nutritionCard}>
            <Text style={[styles.nutritionTitle, { color: theme.colors.text }]}>
              Após a Corrida
            </Text>
            <Text style={[styles.nutritionText, { color: theme.colors.muted }]}>
              {aiData.nutrition.post_run.recovery_window_minutes} min para recuperação
            </Text>
            <Text style={[styles.nutritionText, { color: theme.colors.muted }]}>
              {aiData.nutrition.post_run.foods.join(', ')}
            </Text>
          </Card>
        </View>
      )}
    </View>
  );

  const renderPerformance = () => (
    <View style={styles.tabContainer}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        📊 Análise de Performance
      </Text>
      {aiData?.performance && (
        <View style={styles.performanceContainer}>
          <Card style={styles.performanceCard}>
            <Text style={[styles.performanceTitle, { color: theme.colors.text }]}>
              Fitness Atual
            </Text>
            <View style={styles.performanceStats}>
              <View style={styles.performanceStat}>
                <Text style={[styles.statLabel, { color: theme.colors.muted }]}>VO2 Max</Text>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {aiData.performance.current_fitness.vo2_max_estimate}
                </Text>
              </View>
              <View style={styles.performanceStat}>
                <Text style={[styles.statLabel, { color: theme.colors.muted }]}>Limiar</Text>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {aiData.performance.current_fitness.lactate_threshold_pace}
                </Text>
              </View>
              <View style={styles.performanceStat}>
                <Text style={[styles.statLabel, { color: theme.colors.muted }]}>Economia</Text>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {aiData.performance.current_fitness.running_economy}
                </Text>
              </View>
            </View>
          </Card>

          <Card style={styles.performanceCard}>
            <Text style={[styles.performanceTitle, { color: theme.colors.text }]}>
              Pontos Fortes
            </Text>
            {aiData.performance.current_fitness.strengths.map((strength, index) => (
              <Text key={index} style={[styles.strengthText, { color: theme.colors.success }]}>
                ✓ {strength}
              </Text>
            ))}
          </Card>

          <Card style={styles.performanceCard}>
            <Text style={[styles.performanceTitle, { color: theme.colors.text }]}>
              Áreas de Melhoria
            </Text>
            {aiData.performance.current_fitness.weaknesses.map((weakness, index) => (
              <Text key={index} style={[styles.weaknessText, { color: theme.colors.warning }]}>
                ⚠️ {weakness}
              </Text>
            ))}
          </Card>
        </View>
      )}
    </View>
  );

  const renderGoals = () => (
    <View style={styles.tabContainer}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        🎯 Otimização de Metas
      </Text>
      {aiData?.goals && (
        <View style={styles.goalsContainer}>
          <Card style={styles.goalCard}>
            <Text style={[styles.goalTitle, { color: theme.colors.text }]}>
              Status da Meta
            </Text>
            <Text style={[styles.goalName, { color: theme.colors.text }]}>
              {aiData.goals.current_status.goal}
            </Text>
            <View style={styles.goalProgress}>
              <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${aiData.goals.current_status.progress_percent}%`,
                      backgroundColor: theme.colors.primary 
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.progressText, { color: theme.colors.text }]}>
                {aiData.goals.current_status.progress_percent}%
              </Text>
            </View>
            <Text style={[styles.goalStatus, { color: theme.colors.muted }]}>
              {aiData.goals.current_status.on_track ? '✅ No caminho certo!' : '⚠️ Precisa de ajustes'}
            </Text>
          </Card>
        </View>
      )}
    </View>
  );

  const renderWeather = () => (
    <View style={styles.tabContainer}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        🌤️ Otimização Climática
      </Text>
      {aiData?.weather && (
        <View style={styles.weatherContainer}>
          <Card style={styles.weatherCard}>
            <Text style={[styles.weatherTitle, { color: theme.colors.text }]}>
              Condições Atuais
            </Text>
            <View style={styles.weatherStats}>
              <Text style={[styles.weatherStat, { color: theme.colors.text }]}>
                🌡️ {aiData.weather.current_conditions.temperature_c}°C
              </Text>
              <Text style={[styles.weatherStat, { color: theme.colors.text }]}>
                💨 {aiData.weather.current_conditions.wind_speed_kmh} km/h
              </Text>
              <Text style={[styles.weatherStat, { color: theme.colors.text }]}>
                💧 {Math.round(aiData.weather.current_conditions.humidity_percent)}%
              </Text>
            </View>
          </Card>

          <Card style={styles.weatherCard}>
            <Text style={[styles.weatherTitle, { color: theme.colors.text }]}>
              Melhores Horários
            </Text>
            {aiData.weather.optimal_times.map((time, index) => (
              <View key={index} style={styles.optimalTime}>
                <Text style={[styles.timeText, { color: theme.colors.text }]}>
                  🕐 {time.time}
                </Text>
                <Text style={[styles.timeScore, { color: theme.colors.muted }]}>
                  {time.score}/100
                </Text>
              </View>
            ))}
          </Card>
        </View>
      )}
    </View>
  );

  const renderSocial = () => (
    <View style={styles.tabContainer}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        👥 Recomendações Sociais
      </Text>
      {aiData?.social && (
        <View style={styles.socialContainer}>
          <Card style={styles.socialCard}>
            <Text style={[styles.socialTitle, { color: theme.colors.text }]}>
              Corridas em Grupo
            </Text>
            {aiData.social.group_runs.map((group, index) => (
              <View key={index} style={styles.groupRun}>
                <Text style={[styles.groupName, { color: theme.colors.text }]}>
                  {group.name}
                </Text>
                <Text style={[styles.groupDetails, { color: theme.colors.muted }]}>
                  📍 {group.location} • 🕐 {group.time}
                </Text>
                <View style={styles.groupStats}>
                  <Badge label={group.difficulty} variant="primary" />
                  <Badge label={`${group.participants_count} pessoas`} variant="secondary" />
                  <Badge label={`${group.match_score}% match`} variant="success" />
                </View>
              </View>
            ))}
          </Card>

          <Card style={styles.socialCard}>
            <Text style={[styles.socialTitle, { color: theme.colors.text }]}>
              Desafios
            </Text>
            {aiData.social.challenges.map((challenge, index) => (
              <View key={index} style={styles.challenge}>
                <Text style={[styles.challengeName, { color: theme.colors.text }]}>
                  {challenge.name}
                </Text>
                <Text style={[styles.challengeDescription, { color: theme.colors.muted }]}>
                  {challenge.description}
                </Text>
                <View style={styles.challengeStats}>
                  <Badge label={`${challenge.duration_days} dias`} variant="primary" />
                  <Badge label={`${challenge.participants_count} participantes`} variant="secondary" />
                  <Badge label={`${challenge.match_score}% match`} variant="success" />
                </View>
              </View>
            ))}
          </Card>
        </View>
      )}
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'routes': return renderRoutes();
      case 'workouts': return renderWorkouts();
      case 'nutrition': return renderNutrition();
      case 'performance': return renderPerformance();
      case 'goals': return renderGoals();
      case 'weather': return renderWeather();
      case 'social': return renderSocial();
      default: return renderOverview();
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Skeleton height={200} style={{ marginBottom: 16 }} />
        <Skeleton height={100} style={{ marginBottom: 16 }} />
        <Skeleton height={150} style={{ marginBottom: 16 }} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Tabs de navegação */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
        {[
          { key: 'overview', label: 'Visão Geral', icon: '🧠' },
          { key: 'routes', label: 'Rotas', icon: '🗺️' },
          { key: 'workouts', label: 'Treinos', icon: '💪' },
          { key: 'nutrition', label: 'Nutrição', icon: '🍎' },
          { key: 'performance', label: 'Performance', icon: '📊' },
          { key: 'goals', label: 'Metas', icon: '🎯' },
          { key: 'weather', label: 'Clima', icon: '🌤️' },
          { key: 'social', label: 'Social', icon: '👥' },
        ].map((tab) => (
          <Pressable
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && { backgroundColor: theme.colors.primary }
            ]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[
              styles.tabLabel,
              activeTab === tab.key && { color: 'white' }
            ]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Conteúdo da aba ativa */}
      <ScrollView style={styles.contentContainer}>
        {renderContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    padding: 16,
  },
  overviewContainer: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryCard: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: '800',
  },
  summaryLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  mainSuggestion: {
    padding: 16,
    gap: 12,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  routeName: {
    fontSize: 18,
    fontWeight: '700',
  },
  routeDetails: {
    flexDirection: 'row',
    gap: 8,
  },
  aiReasoning: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  tabContainer: {
    gap: 16,
  },
  routeCard: {
    padding: 16,
    gap: 12,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeStats: {
    flexDirection: 'row',
    gap: 16,
  },
  routeStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  routeStatText: {
    fontSize: 12,
  },
  routeBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  routeActions: {
    flexDirection: 'row',
    gap: 8,
  },
  workoutPlanCard: {
    padding: 16,
    gap: 16,
  },
  planName: {
    fontSize: 18,
    fontWeight: '700',
  },
  planDescription: {
    fontSize: 14,
  },
  planStats: {
    flexDirection: 'row',
    gap: 8,
  },
  planSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  workoutItem: {
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    gap: 8,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutDay: {
    fontSize: 14,
    fontWeight: '600',
  },
  workoutDescription: {
    fontSize: 14,
  },
  workoutPacing: {
    fontSize: 12,
  },
  nutritionContainer: {
    gap: 16,
  },
  nutritionCard: {
    padding: 16,
    gap: 8,
  },
  nutritionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  nutritionText: {
    fontSize: 14,
  },
  performanceContainer: {
    gap: 16,
  },
  performanceCard: {
    padding: 16,
    gap: 12,
  },
  performanceTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  performanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  performanceStat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  strengthText: {
    fontSize: 14,
  },
  weaknessText: {
    fontSize: 14,
  },
  goalsContainer: {
    gap: 16,
  },
  goalCard: {
    padding: 16,
    gap: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  goalName: {
    fontSize: 18,
    fontWeight: '700',
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  goalStatus: {
    fontSize: 14,
  },
  weatherContainer: {
    gap: 16,
  },
  weatherCard: {
    padding: 16,
    gap: 12,
  },
  weatherTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  weatherStats: {
    gap: 8,
  },
  weatherStat: {
    fontSize: 14,
  },
  optimalTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  timeText: {
    fontSize: 14,
  },
  timeScore: {
    fontSize: 14,
    fontWeight: '600',
  },
  socialContainer: {
    gap: 16,
  },
  socialCard: {
    padding: 16,
    gap: 16,
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  groupRun: {
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    gap: 8,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
  },
  groupDetails: {
    fontSize: 14,
  },
  groupStats: {
    flexDirection: 'row',
    gap: 8,
  },
  challenge: {
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    gap: 8,
  },
  challengeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  challengeDescription: {
    fontSize: 14,
  },
  challengeStats: {
    flexDirection: 'row',
    gap: 8,
  },
});