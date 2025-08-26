import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export interface PhysiologicalData {
  hrv: number;
  sleepHours: number;
  sleepQuality: number;
  fatigue: number; // 0-100
  stress: number; // 0-100
  mood: number; // 0-100
  lastWorkoutIntensity: number; // 0-100
  lastWorkoutDistance: number;
  lastWorkoutDate: number;
  // Novos campos para análise preditiva
  weeklyDistance: number;
  weeklyIntensity: number;
  weeklyFrequency: number;
  recentPaces: number[]; // min/km
  recentHeartRates: number[];
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  menstrualPhase?: 'follicular' | 'ovulation' | 'luteal' | 'menstruation';
  hydrationLevel: number; // 0-100
  nutritionQuality: number; // 0-100
}

export interface TrainingRecommendation {
  type: 'easy_run' | 'tempo_run' | 'long_run' | 'interval' | 'recovery' | 'strength' | 'rest';
  distance: number;
  duration: number; // minutes
  intensity: number; // 0-100
  pace: string; // "5:00-5:30 min/km"
  heartRateZones: string[];
  reason: string;
  tips: string[];
  nutritionAdvice: string[];
  hydrationAdvice: string[];
  warmup: string[];
  cooldown: string[];
  expectedCalories: number;
  expectedDifficulty: 'easy' | 'moderate' | 'hard';
}

export interface NutritionRecommendation {
  preRun: {
    timing: string; // "2-3 horas antes"
    foods: string[];
    hydration: string;
    avoid: string[];
  };
  duringRun: {
    ifNeeded: string[];
    hydration: string;
    timing: string;
  };
  postRun: {
    timing: string; // "30 minutos após"
    foods: string[];
    hydration: string;
    protein: string;
    carbs: string;
  };
  daily: {
    calories: number;
    protein: number; // grams
    carbs: number; // grams
    fats: number; // grams
    hydration: number; // liters
    supplements: string[];
  };
}

export interface PerformancePrediction {
  nextWeek: {
    predictedDistance: number;
    predictedPace: number;
    confidence: number; // 0-100
  };
  nextMonth: {
    predictedDistance: number;
    predictedPace: number;
    predictedVO2Max: number;
    confidence: number;
  };
  racePredictions: {
    distance: number;
    predictedTime: string;
    confidence: number;
    strategy: string[];
  }[];
}

export interface VoiceCommand {
  id: string;
  trigger: string; // "mais rápido", "mais lento", "parar"
  action: string;
  response: string;
  hapticFeedback: boolean;
}

export interface RunnerProfile {
  type: 'speedster' | 'endurance' | 'trail' | 'social' | 'beginner' | 'intermediate' | 'advanced';
  experience: number; // months
  weeklyGoal: number; // km
  preferredTime: 'morning' | 'afternoon' | 'evening' | 'night';
  terrain: 'road' | 'trail' | 'mixed' | 'track';
  social: boolean;
  goals: string[];
  limitations: string[];
  preferences: {
    music: boolean;
    voiceCoaching: boolean;
    hapticFeedback: boolean;
    detailedStats: boolean;
  };
}

export class AICoach {
  private runnerProfile: RunnerProfile;
  private physiologicalHistory: PhysiologicalData[] = [];
  private trainingHistory: any[] = [];
  private voiceCommands: VoiceCommand[] = [];
  private learningModel: any = {};

  constructor(profile: RunnerProfile) {
    this.runnerProfile = profile;
    this.initializeVoiceCommands();
    this.initializeLearningModel();
  }

  private initializeVoiceCommands() {
    this.voiceCommands = [
      {
        id: 'speed_up',
        trigger: 'mais rápido',
        action: 'increase_pace',
        response: 'Aumentando o ritmo! Vamos acelerar!',
        hapticFeedback: true
      },
      {
        id: 'slow_down',
        trigger: 'mais lento',
        action: 'decrease_pace',
        response: 'Reduzindo o ritmo. Mantenha-se confortável.',
        hapticFeedback: true
      },
      {
        id: 'stop',
        trigger: 'parar',
        action: 'stop_run',
        response: 'Parando a corrida. Desacelere gradualmente.',
        hapticFeedback: true
      },
      {
        id: 'status',
        trigger: 'status',
        action: 'get_status',
        response: 'Você está a {distance}km com ritmo de {pace} min/km.',
        hapticFeedback: false
      },
      {
        id: 'motivation',
        trigger: 'motivação',
        action: 'motivate',
        response: 'Você está incrível! Continue assim!',
        hapticFeedback: true
      },
      {
        id: 'hydration',
        trigger: 'hidratação',
        action: 'check_hydration',
        response: 'Lembre-se de se hidratar!',
        hapticFeedback: false
      }
    ];
  }

  private initializeLearningModel() {
    this.learningModel = {
      pacePreferences: {},
      intensityPatterns: {},
      recoveryNeeds: {},
      nutritionPreferences: {},
      voiceCommandUsage: {}
    };
  }

  // Obter recomendação de treino personalizada
  public async getTrainingRecommendation(physiologicalData: PhysiologicalData): Promise<TrainingRecommendation> {
    this.physiologicalHistory.push(physiologicalData);
    
    // Analisar dados fisiológicos
    const healthScore = this.calculateHealthScore(physiologicalData);
    const trainingLoad = this.calculateTrainingLoad();
    const recoveryStatus = this.assessRecoveryStatus(physiologicalData);
    
    // Determinar tipo de treino baseado no status
    let recommendation: TrainingRecommendation;
    
    if (recoveryStatus === 'needs_rest') {
      recommendation = this.generateRestDayRecommendation(physiologicalData);
    } else if (recoveryStatus === 'ready_for_intensity') {
      recommendation = this.generateIntensityWorkoutRecommendation(physiologicalData);
    } else {
      recommendation = this.generateEasyRunRecommendation(physiologicalData);
    }
    
    // Personalizar baseado no perfil do corredor
    recommendation = this.personalizeRecommendation(recommendation, physiologicalData);
    
    // Atualizar modelo de aprendizado
    this.updateLearningModel(recommendation, physiologicalData);
    
    return recommendation;
  }

  // Obter recomendação nutricional
  public getNutritionRecommendation(physiologicalData: PhysiologicalData, workoutType: string): NutritionRecommendation {
    const dailyCalories = this.calculateDailyCalories(physiologicalData);
    const workoutCalories = this.calculateWorkoutCalories(workoutType);
    
    return {
      preRun: {
        timing: workoutType === 'long_run' ? '3-4 horas antes' : '2-3 horas antes',
        foods: this.getPreRunFoods(workoutType, physiologicalData),
        hydration: this.getPreRunHydration(workoutType),
        avoid: ['Alimentos gordurosos', 'Fibras excessivas', 'Cafeína em excesso']
      },
      duringRun: {
        ifNeeded: workoutType === 'long_run' ? ['Géis energéticos', 'Banana', 'Barras energéticas'] : [],
        hydration: this.getDuringRunHydration(workoutType),
        timing: workoutType === 'long_run' ? 'A cada 20-30 minutos' : 'Conforme necessário'
      },
      postRun: {
        timing: '30 minutos após',
        foods: this.getPostRunFoods(workoutType, physiologicalData),
        hydration: this.getPostRunHydration(workoutType),
        protein: this.getPostRunProtein(workoutType),
        carbs: this.getPostRunCarbs(workoutType)
      },
      daily: {
        calories: dailyCalories + workoutCalories,
        protein: this.calculateProteinNeeds(physiologicalData),
        carbs: this.calculateCarbNeeds(physiologicalData, workoutType),
        fats: this.calculateFatNeeds(physiologicalData),
        hydration: this.calculateHydrationNeeds(physiologicalData),
        supplements: this.getRecommendedSupplements(physiologicalData)
      }
    };
  }

  // Análise preditiva de performance
  public getPerformancePrediction(physiologicalData: PhysiologicalData): PerformancePrediction {
    const currentFitness = this.calculateCurrentFitness(physiologicalData);
    const trainingTrend = this.analyzeTrainingTrend();
    const recoveryPattern = this.analyzeRecoveryPattern();
    
    return {
      nextWeek: {
        predictedDistance: this.predictNextWeekDistance(currentFitness, trainingTrend),
        predictedPace: this.predictNextWeekPace(currentFitness, trainingTrend),
        confidence: this.calculatePredictionConfidence('weekly')
      },
      nextMonth: {
        predictedDistance: this.predictNextMonthDistance(currentFitness, trainingTrend),
        predictedPace: this.predictNextMonthPace(currentFitness, trainingTrend),
        predictedVO2Max: this.predictVO2Max(currentFitness, trainingTrend),
        confidence: this.calculatePredictionConfidence('monthly')
      },
      racePredictions: this.generateRacePredictions(currentFitness, trainingTrend)
    };
  }

  // Processar comando de voz
  public processVoiceCommand(command: string, currentRunData: any): string {
    const voiceCommand = this.voiceCommands.find(vc => 
      command.toLowerCase().includes(vc.trigger.toLowerCase())
    );
    
    if (!voiceCommand) {
      return 'Comando não reconhecido. Tente: "mais rápido", "mais lento", "status"';
    }
    
    // Executar ação
    const response = this.executeVoiceAction(voiceCommand, currentRunData);
    
    // Atualizar modelo de aprendizado
    this.updateVoiceCommandUsage(voiceCommand.id);
    
    return response;
  }

  // Calcular score de saúde
  private calculateHealthScore(data: PhysiologicalData): number {
    let score = 100;
    
    // HRV (0-100)
    if (data.hrv < 40) score -= 30;
    else if (data.hrv < 55) score -= 15;
    
    // Sono
    if (data.sleepHours < 6) score -= 25;
    else if (data.sleepHours < 7) score -= 10;
    
    if (data.sleepQuality < 60) score -= 20;
    else if (data.sleepQuality < 75) score -= 10;
    
    // Fadiga e estresse
    if (data.fatigue > 70) score -= 20;
    if (data.stress > 70) score -= 15;
    
    // Humor
    if (data.mood < 50) score -= 10;
    
    return Math.max(0, score);
  }

  // Calcular carga de treino
  private calculateTrainingLoad(): number {
    if (this.trainingHistory.length === 0) return 0;
    
    const recentRuns = this.trainingHistory.slice(-7); // Últimos 7 dias
    return recentRuns.reduce((load, run) => {
      return load + (run.distance * run.intensity / 100);
    }, 0);
  }

  // Avaliar status de recuperação
  private assessRecoveryStatus(data: PhysiologicalData): 'needs_rest' | 'ready_for_intensity' | 'ready_for_easy' {
    const healthScore = this.calculateHealthScore(data);
    const trainingLoad = this.calculateTrainingLoad();
    
    if (healthScore < 50 || trainingLoad > 80) return 'needs_rest';
    if (healthScore > 80 && trainingLoad < 40) return 'ready_for_intensity';
    return 'ready_for_easy';
  }

  // Gerar recomendação de descanso
  private generateRestDayRecommendation(data: PhysiologicalData): TrainingRecommendation {
    return {
      type: 'rest',
      distance: 0,
      duration: 0,
      intensity: 0,
      pace: 'N/A',
      heartRateZones: ['Zona 1'],
      reason: 'Seu corpo precisa de recuperação. Priorize descanso e sono.',
      tips: [
        'Faça alongamentos leves',
        'Hidrate-se bem',
        'Priorize o sono',
        'Considere meditação ou yoga'
      ],
      nutritionAdvice: [
        'Foque em alimentos anti-inflamatórios',
        'Consuma proteínas de qualidade',
        'Hidrate-se adequadamente'
      ],
      hydrationAdvice: ['2-3 litros de água por dia'],
      warmup: [],
      cooldown: ['Alongamentos leves', 'Respiração profunda'],
      expectedCalories: 0,
      expectedDifficulty: 'easy'
    };
  }

  // Gerar recomendação de treino intenso
  private generateIntensityWorkoutRecommendation(data: PhysiologicalData): TrainingRecommendation {
    const baseDistance = this.runnerProfile.weeklyGoal / 7;
    const intensity = Math.min(85, 70 + (data.hrv - 40) / 2);
    
    return {
      type: 'tempo_run',
      distance: baseDistance * 1.2,
      duration: Math.round(baseDistance * 1.2 * 5), // Assumindo 5 min/km
      intensity,
      pace: this.calculateTargetPace(intensity),
      heartRateZones: ['Zona 3', 'Zona 4'],
      reason: 'Você está bem recuperado. Hora de desafiar seus limites!',
      tips: [
        'Mantenha ritmo constante',
        'Foque na respiração',
        'Mantenha boa postura'
      ],
      nutritionAdvice: [
        'Carboidratos 2-3 horas antes',
        'Hidratação adequada',
        'Proteína após o treino'
      ],
      hydrationAdvice: ['500ml 2 horas antes', '200ml a cada 20 min'],
      warmup: ['10 min corrida leve', 'Alongamentos dinâmicos', 'Drills de corrida'],
      cooldown: ['5 min corrida leve', 'Alongamentos estáticos'],
      expectedCalories: Math.round(baseDistance * 1.2 * 100),
      expectedDifficulty: 'hard'
    };
  }

  // Gerar recomendação de corrida fácil
  private generateEasyRunRecommendation(data: PhysiologicalData): TrainingRecommendation {
    const baseDistance = this.runnerProfile.weeklyGoal / 7;
    const intensity = Math.max(50, 60 - (data.fatigue / 10));
    
    return {
      type: 'easy_run',
      distance: baseDistance * 0.8,
      duration: Math.round(baseDistance * 0.8 * 6), // Assumindo 6 min/km
      intensity,
      pace: this.calculateTargetPace(intensity),
      heartRateZones: ['Zona 2'],
      reason: 'Treino de recuperação ativa. Mantenha-se confortável.',
      tips: [
        'Ritmo conversável',
        'Foque na técnica',
        'Aproveite o momento'
      ],
      nutritionAdvice: [
        'Hidratação leve antes',
        'Refeição leve 1-2 horas antes'
      ],
      hydrationAdvice: ['300ml 1 hora antes'],
      warmup: ['5 min caminhada', 'Alongamentos leves'],
      cooldown: ['5 min caminhada', 'Alongamentos estáticos'],
      expectedCalories: Math.round(baseDistance * 0.8 * 80),
      expectedDifficulty: 'easy'
    };
  }

  // Personalizar recomendação
  private personalizeRecommendation(recommendation: TrainingRecommendation, data: PhysiologicalData): TrainingRecommendation {
    // Adaptar baseado no perfil do corredor
    if (this.runnerProfile.type === 'speedster') {
      recommendation.intensity = Math.min(100, recommendation.intensity + 10);
      recommendation.tips.push('Foque na velocidade e explosão');
    } else if (this.runnerProfile.type === 'endurance') {
      recommendation.distance = Math.round(recommendation.distance * 1.2);
      recommendation.tips.push('Construa resistência gradualmente');
    }
    
    // Adaptar baseado no ciclo menstrual (se aplicável)
    if (data.menstrualPhase === 'luteal') {
      recommendation.intensity = Math.max(50, recommendation.intensity - 15);
      recommendation.tips.push('Fase luteal - reduza intensidade');
    }
    
    // Adaptar baseado no clima e terreno
    if (this.runnerProfile.terrain === 'trail') {
      recommendation.tips.push('Atenção ao terreno irregular');
      recommendation.expectedDifficulty = 'hard';
    }
    
    return recommendation;
  }

  // Calcular pace alvo
  private calculateTargetPace(intensity: number): string {
    const basePace = 5.0; // 5 min/km base
    const paceAdjustment = (100 - intensity) / 20; // 0.5 min/km por 10% de intensidade
    
    const minPace = basePace + paceAdjustment;
    const maxPace = minPace + 0.5;
    
    return `${minPace.toFixed(1)}-${maxPace.toFixed(1)} min/km`;
  }

  // Métodos auxiliares para nutrição
  private getPreRunFoods(workoutType: string, data: PhysiologicalData): string[] {
    if (workoutType === 'long_run') {
      return ['Aveia com banana', 'Pão integral com mel', 'Iogurte grego'];
    } else if (workoutType === 'tempo_run') {
      return ['Banana', 'Barrinha de cereais', 'Chá verde'];
    } else {
      return ['Frutas leves', 'Água'];
    }
  }

  private getPreRunHydration(workoutType: string): string {
    if (workoutType === 'long_run') return '500-750ml 2-3 horas antes';
    if (workoutType === 'tempo_run') return '300-500ml 1-2 horas antes';
    return '200-300ml 1 hora antes';
  }

  private getDuringRunHydration(workoutType: string): string {
    if (workoutType === 'long_run') return '200-300ml a cada 20-30 min';
    if (workoutType === 'tempo_run') return '100-200ml a cada 15-20 min';
    return 'Conforme necessário';
  }

  private getPostRunFoods(workoutType: string, data: PhysiologicalData): string[] {
    if (workoutType === 'long_run') {
      return ['Proteína whey', 'Banana', 'Pão integral', 'Leite chocolate'];
    } else if (workoutType === 'tempo_run') {
      return ['Proteína', 'Carboidratos simples', 'Frutas'];
    } else {
      return ['Hidratação', 'Snack leve'];
    }
  }

  private getPostRunHydration(workoutType: string): string {
    if (workoutType === 'long_run') return '500-750ml imediatamente';
    if (workoutType === 'tempo_run') return '300-500ml imediatamente';
    return '200-300ml';
  }

  private getPostRunProtein(workoutType: string): string {
    if (workoutType === 'long_run') return '20-30g';
    if (workoutType === 'tempo_run') return '15-25g';
    return '10-15g';
  }

  private getPostRunCarbs(workoutType: string): string {
    if (workoutType === 'long_run') return '60-90g';
    if (workoutType === 'tempo_run') return '40-60g';
    return '20-30g';
  }

  // Cálculos nutricionais
  private calculateDailyCalories(data: PhysiologicalData): number {
    const bmr = this.calculateBMR(data);
    const activityMultiplier = this.getActivityMultiplier();
    return Math.round(bmr * activityMultiplier);
  }

  private calculateBMR(data: PhysiologicalData): number {
    if (data.gender === 'male') {
      return 88.362 + (13.397 * data.weight) + (4.799 * data.height) - (5.677 * data.age);
    } else {
      return 447.593 + (9.247 * data.weight) + (3.098 * data.height) - (4.330 * data.age);
    }
  }

  private getActivityMultiplier(): number {
    switch (this.runnerProfile.type) {
      case 'speedster': return 1.725;
      case 'endurance': return 1.725;
      case 'trail': return 1.725;
      default: return 1.55;
    }
  }

  private calculateWorkoutCalories(workoutType: string): number {
    const baseCalories = 100; // por km
    switch (workoutType) {
      case 'long_run': return baseCalories * 1.2;
      case 'tempo_run': return baseCalories * 1.1;
      case 'interval': return baseCalories * 1.3;
      default: return baseCalories;
    }
  }

  private calculateProteinNeeds(data: PhysiologicalData): number {
    return Math.round(data.weight * 1.6); // 1.6g por kg
  }

  private calculateCarbNeeds(data: PhysiologicalData, workoutType: string): number {
    const baseCarbs = data.weight * 5; // 5g por kg
    if (workoutType === 'long_run') return Math.round(baseCarbs * 1.3);
    if (workoutType === 'tempo_run') return Math.round(baseCarbs * 1.2);
    return Math.round(baseCarbs);
  }

  private calculateFatNeeds(data: PhysiologicalData): number {
    return Math.round(data.weight * 1.0); // 1g por kg
  }

  private calculateHydrationNeeds(data: PhysiologicalData): number {
    return Math.round(data.weight * 0.035); // 35ml por kg
  }

  private getRecommendedSupplements(data: PhysiologicalData): string[] {
    const supplements = ['Multivitamínico'];
    
    if (data.hrv < 50) supplements.push('Magnésio');
    if (data.sleepQuality < 70) supplements.push('Melatonina');
    if (data.stress > 60) supplements.push('Ashwagandha');
    
    return supplements;
  }

  // Métodos de predição
  private calculateCurrentFitness(data: PhysiologicalData): number {
    const healthScore = this.calculateHealthScore(data);
    const trainingConsistency = this.calculateTrainingConsistency();
    return (healthScore + trainingConsistency) / 2;
  }

  private calculateTrainingConsistency(): number {
    if (this.trainingHistory.length === 0) return 50;
    
    const recentRuns = this.trainingHistory.slice(-30); // Últimos 30 dias
    const expectedRuns = this.runnerProfile.weeklyGoal > 0 ? 4 : 3; // 4 corridas por semana
    const actualRuns = recentRuns.length;
    
    return Math.min(100, (actualRuns / (expectedRuns * 4)) * 100);
  }

  private analyzeTrainingTrend(): 'improving' | 'stable' | 'declining' {
    if (this.trainingHistory.length < 14) return 'stable';
    
    const recent = this.trainingHistory.slice(-7);
    const previous = this.trainingHistory.slice(-14, -7);
    
    const recentAvg = recent.reduce((sum, run) => sum + run.distance, 0) / recent.length;
    const previousAvg = previous.reduce((sum, run) => sum + run.distance, 0) / previous.length;
    
    if (recentAvg > previousAvg * 1.1) return 'improving';
    if (recentAvg < previousAvg * 0.9) return 'declining';
    return 'stable';
  }

  private analyzeRecoveryPattern(): 'good' | 'moderate' | 'poor' {
    if (this.physiologicalHistory.length < 7) return 'moderate';
    
    const recent = this.physiologicalHistory.slice(-7);
    const avgHRV = recent.reduce((sum, data) => sum + data.hrv, 0) / recent.length;
    const avgSleep = recent.reduce((sum, data) => sum + data.sleepQuality, 0) / recent.length;
    
    if (avgHRV > 60 && avgSleep > 80) return 'good';
    if (avgHRV < 40 || avgSleep < 60) return 'poor';
    return 'moderate';
  }

  private predictNextWeekDistance(fitness: number, trend: string): number {
    const baseDistance = this.runnerProfile.weeklyGoal;
    const fitnessMultiplier = fitness / 100;
    const trendMultiplier = trend === 'improving' ? 1.1 : trend === 'declining' ? 0.9 : 1.0;
    
    return Math.round(baseDistance * fitnessMultiplier * trendMultiplier);
  }

  private predictNextWeekPace(fitness: number, trend: string): number {
    const basePace = 5.0; // 5 min/km
    const fitnessImprovement = (fitness - 50) / 100; // -0.5 a 0.5
    const trendImprovement = trend === 'improving' ? 0.2 : trend === 'declining' ? -0.2 : 0;
    
    return Math.max(3.0, basePace - fitnessImprovement - trendImprovement);
  }

  private predictNextMonthDistance(fitness: number, trend: string): number {
    return Math.round(this.predictNextWeekDistance(fitness, trend) * 4 * 1.2);
  }

  private predictNextMonthPace(fitness: number, trend: string): number {
    return this.predictNextWeekPace(fitness, trend) - 0.3; // Melhoria mensal
  }

  private predictVO2Max(fitness: number, trend: string): number {
    const baseVO2Max = 45; // ml/kg/min
    const fitnessImprovement = (fitness - 50) / 100;
    const trendImprovement = trend === 'improving' ? 0.1 : trend === 'declining' ? -0.1 : 0;
    
    return Math.round(baseVO2Max * (1 + fitnessImprovement + trendImprovement));
  }

  private calculatePredictionConfidence(period: 'weekly' | 'monthly'): number {
    const dataPoints = this.trainingHistory.length;
    const physiologicalDataPoints = this.physiologicalHistory.length;
    
    let confidence = 50;
    
    if (dataPoints >= 14) confidence += 20;
    if (dataPoints >= 30) confidence += 15;
    if (physiologicalDataPoints >= 7) confidence += 15;
    
    return Math.min(100, confidence);
  }

  private generateRacePredictions(fitness: number, trend: string): Array<{
    distance: number;
    predictedTime: string;
    confidence: number;
    strategy: string[];
  }> {
    const predictions = [];
    
    // 5K
    const pace5k = this.predictNextWeekPace(fitness, trend);
    const time5k = Math.round(5 * pace5k * 60);
    predictions.push({
      distance: 5,
      predictedTime: `${Math.floor(time5k / 60)}:${(time5k % 60).toString().padStart(2, '0')}`,
      confidence: this.calculatePredictionConfidence('weekly'),
      strategy: ['Ritmo constante', 'Foco na respiração', 'Último km forte']
    });
    
    // 10K
    const pace10k = pace5k + 0.3;
    const time10k = Math.round(10 * pace10k * 60);
    predictions.push({
      distance: 10,
      predictedTime: `${Math.floor(time10k / 60)}:${(time10k % 60).toString().padStart(2, '0')}`,
      confidence: this.calculatePredictionConfidence('weekly') - 10,
      strategy: ['Primeira metade conservadora', 'Segunda metade progressiva', 'Hidratação a cada 3km']
    });
    
    // Meia Maratona
    const pace21k = pace10k + 0.5;
    const time21k = Math.round(21.1 * pace21k * 60);
    predictions.push({
      distance: 21.1,
      predictedTime: `${Math.floor(time21k / 60)}:${(time21k % 60).toString().padStart(2, '0')}`,
      confidence: this.calculatePredictionConfidence('monthly'),
      strategy: ['Ritmo conservador nos primeiros 10km', 'Progredir no meio', 'Últimos 5km com tudo']
    });
    
    return predictions;
  }

  // Executar ação de voz
  private executeVoiceAction(voiceCommand: VoiceCommand, currentRunData: any): string {
    let response = voiceCommand.response;
    
    // Substituir placeholders
    if (currentRunData) {
      response = response.replace('{distance}', currentRunData.distance?.toFixed(1) || '0');
      response = response.replace('{pace}', currentRunData.pace?.toFixed(1) || '0');
    }
    
    return response;
  }

  // Atualizar uso de comandos de voz
  private updateVoiceCommandUsage(commandId: string): void {
    if (!this.learningModel.voiceCommandUsage[commandId]) {
      this.learningModel.voiceCommandUsage[commandId] = 0;
    }
    this.learningModel.voiceCommandUsage[commandId]++;
  }

  // Atualizar modelo de aprendizado
  private updateLearningModel(recommendation: TrainingRecommendation, data: PhysiologicalData): void {
    // Atualizar preferências de pace
    const pace = this.parsePaceToNumber(recommendation.pace);
    if (pace > 0) {
      if (!this.learningModel.pacePreferences[recommendation.type]) {
        this.learningModel.pacePreferences[recommendation.type] = [];
      }
      this.learningModel.pacePreferences[recommendation.type].push(pace);
    }
    
    // Atualizar padrões de intensidade
    if (!this.learningModel.intensityPatterns[recommendation.type]) {
      this.learningModel.intensityPatterns[recommendation.type] = [];
    }
    this.learningModel.intensityPatterns[recommendation.type].push(recommendation.intensity);
    
    // Atualizar necessidades de recuperação
    const recoveryTime = this.calculateRecoveryTime(recommendation);
    if (!this.learningModel.recoveryNeeds[recommendation.type]) {
      this.learningModel.recoveryNeeds[recommendation.type] = [];
    }
    this.learningModel.recoveryNeeds[recommendation.type].push(recoveryTime);
  }

  // Métodos auxiliares
  private parsePaceToNumber(pace: string): number {
    const match = pace.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }

  private calculateRecoveryTime(recommendation: TrainingRecommendation): number {
    switch (recommendation.type) {
      case 'easy_run': return 12; // horas
      case 'tempo_run': return 24;
      case 'long_run': return 48;
      case 'interval': return 36;
      default: return 24;
    }
  }

  // Obter comandos de voz disponíveis
  public getAvailableVoiceCommands(): VoiceCommand[] {
    return this.voiceCommands;
  }

  // Obter histórico fisiológico
  public getPhysiologicalHistory(): PhysiologicalData[] {
    return this.physiologicalHistory;
  }

  // Obter modelo de aprendizado
  public getLearningModel(): any {
    return this.learningModel;
  }

  // Calcular score de saúde atual
  public getCurrentHealthScore(): number {
    if (this.physiologicalHistory.length === 0) return 50;
    const latest = this.physiologicalHistory[this.physiologicalHistory.length - 1];
    return this.calculateHealthScore(latest);
  }
}

export function createAICoach(profile: RunnerProfile): AICoach {
  return new AICoach(profile);
}