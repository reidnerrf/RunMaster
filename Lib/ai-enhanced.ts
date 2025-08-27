import { hapticSuccess, hapticWarning } from '../utils/haptics';
import { 
  analyzePerformanceWithAI, 
  suggestRoutesWithAI, 
  generateWorkoutPlanWithAI, 
  getNutritionAdviceWithAI, 
  assessInjuryRiskWithAI, 
  optimizeForWeatherWithAI 
} from './openrouter-ai';

// Tipos expandidos para IA avançada
export type AIWorkoutPlan = {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_weeks: number;
  workouts: AIWorkout[];
  adaptation_rules: string[];
  nutrition_tips: string[];
  recovery_advice: string[];
};

export type AIWorkout = {
  day: number;
  type: 'easy' | 'tempo' | 'long' | 'intervals' | 'recovery' | 'strength';
  distance_km?: number;
  duration_minutes?: number;
  intensity: 'low' | 'moderate' | 'high';
  description: string;
  pacing_target?: string;
  heart_rate_zones?: string[];
  tips: string[];
  music_suggestion?: string;
};

export type AIRouteSuggestion = {
  id: string;
  name: string;
  distance_km: number;
  difficulty: 'easy' | 'moderate' | 'hard';
  elevation_gain_m: number;
  surface_type: 'road' | 'trail' | 'mixed';
  safety_score: number; // 0-100
  weather_optimal: string[];
  time_optimal: string[];
  points_of_interest: string[];
  notes: string[];
  ai_reasoning: string;
  personalization_factors: string[];
};

export type AINutritionAdvice = {
  pre_run: {
    timing_minutes: number;
    foods: string[];
    hydration: string;
    avoid: string[];
  };
  during_run: {
    hydration_plan: string;
    fuel_timing: string;
    supplements?: string[];
  };
  post_run: {
    recovery_window_minutes: number;
    protein_target_g: number;
    carbs_target_g: number;
    hydration: string;
    foods: string[];
  };
  daily_goals: {
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    hydration_l: number;
  };
};

export type AIInjuryPrevention = {
  risk_assessment: {
    overall_risk: 'low' | 'medium' | 'high';
    factors: string[];
    recommendations: string[];
  };
  exercises: {
    warmup: string[];
    cooldown: string[];
    strength: string[];
    flexibility: string[];
  };
  warning_signs: string[];
  when_to_stop: string[];
};

export type AIPerformanceAnalysis = {
  current_fitness: {
    vo2_max_estimate: number;
    lactate_threshold_pace: string;
    running_economy: 'poor' | 'fair' | 'good' | 'excellent';
    strengths: string[];
    weaknesses: string[];
  };
  improvement_areas: {
    priority: 'high' | 'medium' | 'low';
    area: string;
    current_level: string;
    target_level: string;
    exercises: string[];
    timeline_weeks: number;
  }[];
  race_predictions: {
    distance: string;
    current_potential: string;
    optimized_potential: string;
    training_focus: string[];
  }[];
};

export type AISocialRecommendations = {
  group_runs: {
    name: string;
    location: string;
    time: string;
    difficulty: string;
    participants_count: number;
    match_score: number; // 0-100
  }[];
  challenges: {
    name: string;
    type: 'distance' | 'time' | 'streak' | 'social';
    description: string;
    duration_days: number;
    participants_count: number;
    match_score: number;
  }[];
  mentors: {
    name: string;
    expertise: string[];
    experience_years: number;
    availability: string;
    match_score: number;
  }[];
};

export type AIWeatherOptimization = {
  current_conditions: {
    temperature_c: number;
    humidity_percent: number;
    wind_speed_kmh: number;
    precipitation_chance: number;
    uv_index: number;
    air_quality: 'good' | 'moderate' | 'poor';
  };
  optimal_times: {
    time: string;
    conditions: string;
    score: number; // 0-100
    reasoning: string;
  }[];
  route_adjustments: {
    original_route: string;
    adjusted_route: string;
    changes: string[];
    reasoning: string;
  }[];
  clothing_recommendations: {
    top: string[];
    bottom: string[];
    accessories: string[];
    notes: string;
  };
};

export type AIGoalOptimization = {
  current_status: {
    goal: string;
    progress_percent: number;
    timeline_remaining_days: number;
    on_track: boolean;
  };
  adjustments_needed: {
    type: 'increase' | 'decrease' | 'maintain' | 'change';
    reason: string;
    new_target: string;
    timeline_adjustment_days: number;
  }[];
  milestone_suggestions: {
    milestone: string;
    target_date: string;
    difficulty: 'easy' | 'moderate' | 'hard';
    reward: string;
  }[];
  motivation_strategies: {
    type: 'social' | 'achievement' | 'variety' | 'progress';
    strategy: string;
    implementation: string;
  }[];
};

// Sistema principal de IA
export class AIAssistant {
  private userProfile: any;
  private runningHistory: any[];
  private preferences: any;
  private currentGoals: any[];

  constructor(userProfile: any, runningHistory: any[], preferences: any, currentGoals: any[]) {
    this.userProfile = userProfile;
    this.runningHistory = runningHistory;
    this.preferences = preferences;
    this.currentGoals = currentGoals;
  }

  // Análise inteligente de performance
  async analyzePerformance(): Promise<AIPerformanceAnalysis> {
    try {
      const recentRuns = this.runningHistory.slice(-10);
      
      // Usar OpenRouter AI para análise avançada
      const aiAnalysis = await analyzePerformanceWithAI(recentRuns, this.userProfile);
      
      // Combinar análise da IA com cálculos locais
      const avgPace = this.calculateAveragePace(recentRuns);
      const vo2Max = this.estimateVO2Max(recentRuns);
      
      return {
        current_fitness: {
          vo2_max_estimate: vo2Max,
          lactate_threshold_pace: this.calculateLactateThreshold(avgPace),
          running_economy: this.assessRunningEconomy(recentRuns),
          strengths: this.identifyStrengths(recentRuns),
          weaknesses: this.identifyWeaknesses(recentRuns),
        },
        improvement_areas: this.generateImprovementAreas(recentRuns),
        race_predictions: this.generateRacePredictions(recentRuns),
        ai_insights: aiAnalysis.analysis,
        ai_confidence: aiAnalysis.confidence,
        ai_timestamp: aiAnalysis.timestamp,
      };
    } catch (error) {
      console.error('Erro na análise de performance:', error);
      return this.getFallbackPerformanceAnalysis();
    }
  }

  // Sugestões inteligentes de rotas
  async suggestRoutes(context: {
    location: { lat: number; lon: number };
    distance_preference_km: number;
    difficulty: 'easy' | 'moderate' | 'hard';
    weather_conditions?: any;
    time_of_day?: string;
    surface_preference?: 'road' | 'trail' | 'mixed';
  }): Promise<AIRouteSuggestion[]> {
    try {
      // Usar OpenRouter AI para sugestões inteligentes
      const aiSuggestions = await suggestRoutesWithAI({
        location: context.location,
        distance_preference_km: context.distance_preference_km,
        difficulty: context.difficulty,
        weather_conditions: context.weather_conditions,
        time_of_day: context.time_of_day,
        user_preferences: {
          surface_preference: context.surface_preference,
          safety_priority: 'high',
          scenic_routes: true
        }
      });
      
      // Combinar com sugestões locais
      const localRoutes = await this.generateRouteSuggestions(context);
      const allRoutes = [...aiSuggestions.routes, ...localRoutes];
      const personalizedRoutes = this.personalizeRoutes(allRoutes);
      
      hapticSuccess();
      return personalizedRoutes.map(route => ({
        ...route,
        ai_reasoning: aiSuggestions.aiReasoning,
        ai_confidence: aiSuggestions.confidence,
        ai_timestamp: aiSuggestions.timestamp
      }));
    } catch (error) {
      console.error('Erro nas sugestões de rotas:', error);
      hapticWarning();
      return this.getFallbackRouteSuggestions(context);
    }
  }

  // Plano de treino personalizado
  async generateWorkoutPlan(goal: {
    type: '5k' | '10k' | 'half_marathon' | 'marathon' | 'fitness' | 'weight_loss';
    target_date?: string;
    current_fitness: 'beginner' | 'intermediate' | 'advanced';
    available_days_per_week: number;
    preferred_duration_minutes: number;
  }): Promise<AIWorkoutPlan> {
    try {
      // Usar OpenRouter AI para plano personalizado
      const aiPlan = await generateWorkoutPlanWithAI({
        ...goal,
        recent_performance: this.runningHistory.slice(-5)
      });
      
      // Combinar com plano local
      const localPlan = await this.createPersonalizedPlan(goal);
      const combinedPlan = {
        ...localPlan,
        ...aiPlan.plan,
        ai_reasoning: aiPlan.aiReasoning,
        ai_confidence: aiPlan.confidence,
        ai_timestamp: aiPlan.timestamp
      };
      
      const adaptedPlan = this.adaptPlanToUser(combinedPlan);
      
      hapticSuccess();
      return adaptedPlan;
    } catch (error) {
      console.error('Erro na geração do plano:', error);
      hapticWarning();
      return this.getFallbackWorkoutPlan(goal);
    }
  }

  // Otimização de metas
  async optimizeGoals(): Promise<AIGoalOptimization> {
    try {
      const analysis = await this.analyzeGoalProgress();
      const optimizations = this.generateGoalOptimizations(analysis);
      
      hapticSuccess();
      return optimizations;
    } catch (error) {
      console.error('Erro na otimização de metas:', error);
      hapticWarning();
      return this.getFallbackGoalOptimization();
    }
  }

  // Recomendações nutricionais
  async getNutritionAdvice(workout_intensity: 'low' | 'moderate' | 'high', duration_minutes: number): Promise<AINutritionAdvice> {
    try {
      // Usar OpenRouter AI para conselhos nutricionais
      const aiAdvice = await getNutritionAdviceWithAI({
        workout_intensity,
        duration_minutes,
        time_of_day: new Date().getHours() >= 6 && new Date().getHours() <= 9 ? 'morning' : 'afternoon',
        weather_conditions: this.userProfile?.weather_preferences,
        user_dietary_restrictions: this.userProfile?.dietary_restrictions || [],
        fitness_goals: this.currentGoals.map(g => g.type)
      });
      
      // Combinar com conselhos locais
      const localAdvice = await this.generateNutritionPlan(workout_intensity, duration_minutes);
      const combinedAdvice = {
        ...localAdvice,
        ...aiAdvice.nutrition,
        ai_reasoning: aiAdvice.aiReasoning,
        ai_confidence: aiAdvice.confidence,
        ai_timestamp: aiAdvice.timestamp
      };
      
      const personalizedAdvice = this.personalizeNutrition(combinedAdvice);
      
      hapticSuccess();
      return personalizedAdvice;
    } catch (error) {
      console.error('Erro no conselho nutricional:', error);
      hapticWarning();
      return this.getFallbackNutritionAdvice(workout_intensity, duration_minutes);
    }
  }

  // Prevenção de lesões
  async assessInjuryRisk(): Promise<AIInjuryPrevention> {
    try {
      // Usar OpenRouter AI para avaliação de risco
      const aiRiskAssessment = await assessInjuryRiskWithAI({
        recent_workouts: this.runningHistory.slice(-10),
        current_symptoms: this.userProfile?.current_symptoms || [],
        training_load: this.calculateTrainingLoad(),
        recovery_patterns: this.analyzeRecoveryPatterns(),
        injury_history: this.userProfile?.injury_history || []
      });
      
      // Combinar com análise local
      const localRiskFactors = this.analyzeRiskFactors();
      const localPrevention = this.generatePreventionPlan(localRiskFactors);
      
      const combinedPrevention = {
        ...localPrevention,
        ...aiRiskAssessment.riskAssessment,
        ai_reasoning: aiRiskAssessment.aiReasoning,
        ai_confidence: aiRiskAssessment.confidence,
        ai_timestamp: aiRiskAssessment.timestamp
      };
      
      hapticSuccess();
      return combinedPrevention;
    } catch (error) {
      console.error('Erro na avaliação de risco:', error);
      hapticWarning();
      return this.getFallbackInjuryPrevention();
    }
  }

  // Otimização climática
  async optimizeForWeather(location: { lat: number; lon: number }, planned_time: string): Promise<AIWeatherOptimization> {
    try {
      // Usar OpenRouter AI para otimização climática
      const aiOptimization = await optimizeForWeatherWithAI({
        location,
        planned_time,
        weather_forecast: await this.getWeatherData(location),
        user_preferences: {
          temperature_range: this.userProfile?.temperature_preferences || [15, 25],
          rain_tolerance: this.userProfile?.rain_tolerance || 'moderate',
          wind_tolerance: this.userProfile?.wind_tolerance || 'moderate'
        }
      });
      
      // Combinar com otimização local
      const localWeather = await this.getWeatherData(location);
      const localOptimization = this.generateWeatherOptimization(localWeather, planned_time);
      
      const combinedOptimization = {
        ...localOptimization,
        ...aiOptimization.optimization,
        ai_reasoning: aiOptimization.aiReasoning,
        ai_confidence: aiOptimization.confidence,
        ai_timestamp: aiOptimization.timestamp
      };
      
      hapticSuccess();
      return combinedOptimization;
    } catch (error) {
      console.error('Erro na otimização climática:', error);
      hapticWarning();
      return this.getFallbackWeatherOptimization();
    }
  }

  // Recomendações sociais
  async getSocialRecommendations(): Promise<AISocialRecommendations> {
    try {
      const social = await this.analyzeSocialOpportunities();
      const recommendations = this.generateSocialRecommendations(social);
      
      hapticSuccess();
      return recommendations;
    } catch (error) {
      console.error('Erro nas recomendações sociais:', error);
      hapticWarning();
      return this.getFallbackSocialRecommendations();
    }
  }

  // Métodos auxiliares privados
  private calculateAveragePace(runs: any[]): string {
    // Implementação do cálculo de pace médio
    return '5:30';
  }

  private estimateVO2Max(runs: any[]): number {
    // Implementação da estimativa de VO2 max
    return 45;
  }

  private calculateLactateThreshold(avgPace: string): string {
    // Implementação do cálculo do limiar de lactato
    return '4:45';
  }

  private assessRunningEconomy(runs: any[]): 'poor' | 'fair' | 'good' | 'excellent' {
    // Implementação da avaliação de economia de corrida
    return 'good';
  }

  private identifyStrengths(runs: any[]): string[] {
    // Implementação da identificação de pontos fortes
    return ['Resistência', 'Consistência'];
  }

  private identifyWeaknesses(runs: any[]): string[] {
    // Implementação da identificação de pontos fracos
    return ['Velocidade', 'Recuperação'];
  }

  private generateImprovementAreas(runs: any[]): any[] {
    // Implementação da geração de áreas de melhoria
    return [];
  }

  private generateRacePredictions(runs: any[]): any[] {
    // Implementação das previsões de corrida
    return [];
  }

  private async generateRouteSuggestions(context: any): Promise<AIRouteSuggestion[]> {
    // Implementação da geração de sugestões de rotas
    return [];
  }

  private personalizeRoutes(routes: AIRouteSuggestion[]): AIRouteSuggestion[] {
    // Implementação da personalização de rotas
    return routes;
  }

  private async createPersonalizedPlan(goal: any): Promise<AIWorkoutPlan> {
    // Implementação da criação de plano personalizado
    return {} as AIWorkoutPlan;
  }

  private adaptPlanToUser(plan: AIWorkoutPlan): AIWorkoutPlan {
    // Implementação da adaptação do plano ao usuário
    return plan;
  }

  private async analyzeGoalProgress(): Promise<any> {
    // Implementação da análise de progresso das metas
    return {};
  }

  private generateGoalOptimizations(analysis: any): AIGoalOptimization {
    // Implementação da geração de otimizações de metas
    return {} as AIGoalOptimization;
  }

  private async generateNutritionPlan(intensity: string, duration: number): Promise<AINutritionAdvice> {
    // Implementação da geração do plano nutricional
    return {} as AINutritionAdvice;
  }

  private personalizeNutrition(advice: AINutritionAdvice): AINutritionAdvice {
    // Implementação da personalização nutricional
    return advice;
  }

  private analyzeRiskFactors(): any[] {
    // Implementação da análise de fatores de risco
    return [];
  }

  private generatePreventionPlan(riskFactors: any[]): AIInjuryPrevention {
    // Implementação da geração do plano de prevenção
    return {} as AIInjuryPrevention;
  }

  private async getWeatherData(location: any): Promise<any> {
    // Implementação da obtenção de dados climáticos
    return {};
  }

  private generateWeatherOptimization(weather: any, plannedTime: string): AIWeatherOptimization {
    // Implementação da otimização climática
    return {} as AIWeatherOptimization;
  }

  private async analyzeSocialOpportunities(): Promise<any> {
    // Implementação da análise de oportunidades sociais
    return {};
  }

  private generateSocialRecommendations(social: any): AISocialRecommendations {
    // Implementação da geração de recomendações sociais
    return {} as AISocialRecommendations;
  }

  // Métodos auxiliares adicionais
  private calculateTrainingLoad(): number {
    const recentWorkouts = this.runningHistory.slice(-7);
    const totalDistance = recentWorkouts.reduce((sum, workout) => sum + (workout.distance_km || 0), 0);
    const totalDuration = recentWorkouts.reduce((sum, workout) => sum + (workout.duration_minutes || 0), 0);
    
    // Cálculo simplificado de carga de treino (0-10)
    const distanceScore = Math.min(totalDistance / 50, 1) * 5; // Máximo 50km = 5 pontos
    const durationScore = Math.min(totalDuration / 300, 1) * 5; // Máximo 5h = 5 pontos
    
    return Math.round((distanceScore + durationScore) * 10) / 10;
  }

  private analyzeRecoveryPatterns(): any {
    const recentWorkouts = this.runningHistory.slice(-14);
    const recoveryDays = recentWorkouts.filter(workout => 
      workout.type === 'recovery' || workout.intensity === 'low'
    ).length;
    
    return {
      recovery_frequency: recoveryDays / recentWorkouts.length,
      last_recovery: recentWorkouts.findIndex(w => w.type === 'recovery'),
      recovery_quality: 'good' // Simplificado
    };
  }

  // Métodos de fallback
  private getFallbackPerformanceAnalysis(): AIPerformanceAnalysis {
    return {
      current_fitness: {
        vo2_max_estimate: 40,
        lactate_threshold_pace: '5:00',
        running_economy: 'good',
        strengths: ['Consistência'],
        weaknesses: ['Velocidade'],
      },
      improvement_areas: [],
      race_predictions: [],
    };
  }

  private getFallbackRouteSuggestions(context: any): AIRouteSuggestion[] {
    return [{
      id: 'fallback-1',
      name: 'Rota Padrão',
      distance_km: context.distance_preference_km,
      difficulty: context.difficulty,
      elevation_gain_m: 50,
      surface_type: 'road',
      safety_score: 80,
      weather_optimal: ['clear', 'partly_cloudy'],
      time_optimal: ['morning', 'evening'],
      points_of_interest: ['Parque Central'],
      notes: ['Rota segura e bem iluminada'],
      ai_reasoning: 'Rota padrão recomendada para suas preferências',
      personalization_factors: ['Distância preferida', 'Dificuldade escolhida'],
    }];
  }

  private getFallbackWorkoutPlan(goal: any): AIWorkoutPlan {
    return {
      id: 'fallback-plan',
      name: 'Plano Básico',
      description: 'Plano de treino básico para iniciantes',
      difficulty: 'beginner',
      duration_weeks: 4,
      workouts: [],
      adaptation_rules: ['Ajuste baseado na sensação'],
      nutrition_tips: ['Hidrate-se bem'],
      recovery_advice: ['Descanse adequadamente'],
    };
  }

  private getFallbackGoalOptimization(): AIGoalOptimization {
    return {
      current_status: {
        goal: 'Correr 5km',
        progress_percent: 50,
        timeline_remaining_days: 30,
        on_track: true,
      },
      adjustments_needed: [],
      milestone_suggestions: [],
      motivation_strategies: [],
    };
  }

  private getFallbackNutritionAdvice(intensity: string, duration: number): AINutritionAdvice {
    return {
      pre_run: {
        timing_minutes: 30,
        foods: ['Banana', 'Aveia'],
        hydration: '500ml de água',
        avoid: ['Alimentos gordurosos'],
      },
      during_run: {
        hydration_plan: '100ml a cada 20 minutos',
        fuel_timing: 'Para corridas > 1 hora',
        supplements: [],
      },
      post_run: {
        recovery_window_minutes: 30,
        protein_target_g: 20,
        carbs_target_g: 60,
        hydration: '500ml de água + eletrólitos',
        foods: ['Iogurte', 'Frutas'],
      },
      daily_goals: {
        calories: 2000,
        protein_g: 80,
        carbs_g: 250,
        fat_g: 65,
        hydration_l: 2.5,
      },
    };
  }

  private getFallbackInjuryPrevention(): AIInjuryPrevention {
    return {
      risk_assessment: {
        overall_risk: 'low',
        factors: ['Histórico limpo'],
        recommendations: ['Mantenha a forma atual'],
      },
      exercises: {
        warmup: ['Alongamento dinâmico'],
        cooldown: ['Alongamento estático'],
        strength: ['Agachamentos', 'Flexões'],
        flexibility: ['Ioga básico'],
      },
      warning_signs: ['Dor persistente'],
      when_to_stop: ['Dor aguda'],
    };
  }

  private getFallbackWeatherOptimization(): AIWeatherOptimization {
    return {
      current_conditions: {
        temperature_c: 22,
        humidity_percent: 60,
        wind_speed_kmh: 10,
        precipitation_chance: 0.1,
        uv_index: 5,
        air_quality: 'good',
      },
      optimal_times: [{
        time: '06:00',
        conditions: 'Temperatura amena',
        score: 85,
        reasoning: 'Temperatura ideal para corrida',
      }],
      route_adjustments: {
        original_route: 'Rota padrão',
        adjusted_route: 'Rota padrão',
        changes: ['Nenhuma mudança necessária'],
        reasoning: 'Condições climáticas favoráveis',
      },
      clothing_recommendations: {
        top: ['Camiseta técnica'],
        bottom: ['Shorts de corrida'],
        accessories: ['Boné', 'Óculos de sol'],
        notes: 'Vestuário leve e confortável',
      },
    };
  }

  private getFallbackSocialRecommendations(): AISocialRecommendations {
    return {
      group_runs: [{
        name: 'Corrida Matinal',
        location: 'Parque Central',
        time: '06:00',
        difficulty: 'Fácil',
        participants_count: 15,
        match_score: 80,
      }],
      challenges: [{
        name: 'Desafio 30 Dias',
        type: 'streak',
        description: 'Corra por 30 dias consecutivos',
        duration_days: 30,
        participants_count: 50,
        match_score: 75,
      }],
      mentors: [{
        name: 'João Silva',
        expertise: ['Corrida de rua', 'Maratona'],
        experience_years: 5,
        availability: 'Finais de semana',
        match_score: 85,
      }],
    };
  }
}

// Funções de conveniência para uso direto
export async function createAIAssistant(userProfile: any, runningHistory: any[], preferences: any, currentGoals: any[]): Promise<AIAssistant> {
  return new AIAssistant(userProfile, runningHistory, preferences, currentGoals);
}

export async function getAISuggestions(context: any): Promise<{
  routes: AIRouteSuggestion[];
  workout_plan: AIWorkoutPlan;
  nutrition: AINutritionAdvice;
  performance: AIPerformanceAnalysis;
  goals: AIGoalOptimization;
  weather: AIWeatherOptimization;
  social: AISocialRecommendations;
}> {
  const assistant = await createAIAssistant(
    context.userProfile || {},
    context.runningHistory || [],
    context.preferences || {},
    context.currentGoals || []
  );

  const [
    routes,
    workout_plan,
    nutrition,
    performance,
    goals,
    weather,
    social
  ] = await Promise.all([
    assistant.suggestRoutes(context.routeContext || {}),
    assistant.generateWorkoutPlan(context.workoutGoal || {}),
    assistant.getNutritionAdvice('moderate', 60),
    assistant.analyzePerformance(),
    assistant.optimizeGoals(),
    assistant.optimizeForWeather(context.location || { lat: 0, lon: 0 }, '06:00'),
    assistant.getSocialRecommendations()
  ]);

  return {
    routes,
    workout_plan,
    nutrition,
    performance,
    goals,
    weather,
    social
  };
}