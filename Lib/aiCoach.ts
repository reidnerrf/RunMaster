import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export interface PhysiologicalData {
  hrv: number; // Heart Rate Variability (ms)
  sleepHours: number;
  sleepQuality: number; // 0-100
  fatigue: number; // 0-100
  stress: number; // 0-100
  mood: number; // 0-100
  menstrualPhase?: 'follicular' | 'ovulatory' | 'luteal' | 'menstrual';
  lastWorkoutIntensity: number; // 0-100
  lastWorkoutDistance: number;
  lastWorkoutDate: number;
}

export interface TrainingRecommendation {
  type: 'easy' | 'moderate' | 'hard' | 'recovery' | 'skip';
  distance: number;
  intensity: number; // 0-100
  reason: string;
  tips: string[];
  adaptation: string;
  hapticFeedback: boolean;
}

export interface RunnerProfile {
  type: 'speedster' | 'endurance' | 'trail' | 'social' | 'beginner';
  experience: number; // months
  weeklyGoal: number; // km
  preferredTime: 'morning' | 'afternoon' | 'evening' | 'night';
  terrain: 'road' | 'trail' | 'mixed';
  social: boolean;
}

export class AICoach {
  private userProfile: RunnerProfile;
  private trainingHistory: any[] = [];
  private physiologicalHistory: PhysiologicalData[] = [];
  private learningModel: any = {};

  constructor(profile: RunnerProfile) {
    this.userProfile = profile;
    this.initializeLearningModel();
  }

  private initializeLearningModel() {
    // Modelo de aprendizado simples baseado em padrões
    this.learningModel = {
      optimalHRV: 50,
      optimalSleep: 7.5,
      fatigueThreshold: 70,
      stressThreshold: 60,
      recoveryPatterns: [],
      performanceTrends: [],
      adaptationRate: 0.1
    };
  }

  public async getTrainingRecommendation(
    currentData: PhysiologicalData,
    weather?: { temperature: number; humidity: number; precipitation: number }
  ): Promise<TrainingRecommendation> {
    // Analisa dados fisiológicos
    const healthScore = this.calculateHealthScore(currentData);
    const recoveryNeeded = this.assessRecoveryNeeded(currentData);
    const weatherAdjustment = this.calculateWeatherAdjustment(weather);
    
    // Aplica aprendizado do modelo
    this.updateLearningModel(currentData);
    
    // Gera recomendação personalizada
    const recommendation = this.generateRecommendation(
      healthScore,
      recoveryNeeded,
      weatherAdjustment,
      currentData
    );

    // Feedback háptico se necessário
    if (recommendation.hapticFeedback) {
      await this.provideHapticFeedback(recommendation.type);
    }

    return recommendation;
  }

  private calculateHealthScore(data: PhysiologicalData): number {
    let score = 100;
    
    // HRV (maior é melhor)
    if (data.hrv < 30) score -= 30;
    else if (data.hrv < 50) score -= 15;
    else if (data.hrv > 80) score += 10;
    
    // Sono
    if (data.sleepHours < 6) score -= 25;
    else if (data.sleepHours < 7) score -= 10;
    else if (data.sleepHours > 9) score -= 5;
    
    score += (data.sleepQuality - 50) * 0.3;
    
    // Fadiga e estresse
    score -= data.fatigue * 0.4;
    score -= data.stress * 0.3;
    
    // Humor
    score += (data.mood - 50) * 0.2;
    
    return Math.max(0, Math.min(100, score));
  }

  private assessRecoveryNeeded(data: PhysiologicalData): number {
    let recoveryScore = 0;
    
    // Fadiga alta = mais recuperação
    if (data.fatigue > 70) recoveryScore += 40;
    else if (data.fatigue > 50) recoveryScore += 20;
    
    // Estresse alto = mais recuperação
    if (data.stress > 70) recoveryScore += 30;
    else if (data.stress > 50) recoveryScore += 15;
    
    // Sono ruim = mais recuperação
    if (data.sleepHours < 6) recoveryScore += 25;
    if (data.sleepQuality < 50) recoveryScore += 20;
    
    // Treino recente intenso = mais recuperação
    const hoursSinceLastWorkout = (Date.now() - data.lastWorkoutDate) / (1000 * 60 * 60);
    if (hoursSinceLastWorkout < 24 && data.lastWorkoutIntensity > 70) {
      recoveryScore += 30;
    }
    
    return Math.min(100, recoveryScore);
  }

  private calculateWeatherAdjustment(weather?: { temperature: number; humidity: number; precipitation: number }): number {
    if (!weather) return 0;
    
    let adjustment = 0;
    
    // Temperatura
    if (weather.temperature > 30 || weather.temperature < 5) adjustment -= 20;
    else if (weather.temperature > 25 || weather.temperature < 10) adjustment -= 10;
    
    // Umidade
    if (weather.humidity > 80) adjustment -= 15;
    
    // Chuva
    if (weather.precipitation > 0) adjustment -= 10;
    
    return adjustment;
  }

  private generateRecommendation(
    healthScore: number,
    recoveryNeeded: number,
    weatherAdjustment: number,
    data: PhysiologicalData
  ): TrainingRecommendation {
    const totalScore = healthScore - recoveryNeeded + weatherAdjustment;
    
    // Adaptação ao ciclo menstrual se aplicável
    const menstrualAdjustment = this.getMenstrualAdjustment(data.menstrualPhase);
    
    if (totalScore < 30 || recoveryNeeded > 70) {
      return {
        type: 'skip',
        distance: 0,
        intensity: 0,
        reason: 'Seu corpo precisa de descanso hoje. Foque na recuperação.',
        tips: [
          'Faça alongamentos leves',
          'Hidrate-se bem',
          'Durma mais cedo',
          'Evite cafeína'
        ],
        adaptation: 'Recuperação forçada baseada em dados fisiológicos',
        hapticFeedback: true
      };
    }
    
    if (totalScore < 50 || recoveryNeeded > 50) {
      return {
        type: 'recovery',
        distance: Math.max(2, this.userProfile.weeklyGoal * 0.3),
        intensity: 20 + menstrualAdjustment,
        reason: 'Treino de recuperação para manter consistência sem sobrecarregar.',
        tips: [
          'Mantenha ritmo conversável',
          'Foque na técnica',
          'Hidrate-se durante',
          'Alongue bem após'
        ],
        adaptation: 'Intensidade reduzida para recuperação',
        hapticFeedback: false
      };
    }
    
    if (totalScore < 70) {
      return {
        type: 'easy',
        distance: this.userProfile.weeklyGoal * 0.5,
        intensity: 40 + menstrualAdjustment,
        reason: 'Treino leve para manter forma sem estresse.',
        tips: [
          'Ritmo confortável',
          'Respiração controlada',
          'Aproveite o ambiente',
          'Foque na consistência'
        ],
        adaptation: 'Volume moderado para manutenção',
        hapticFeedback: false
      };
    }
    
    // Treino moderado ou intenso baseado no perfil
    const isIntenseDay = this.shouldDoIntenseWorkout(data);
    
    if (isIntenseDay && totalScore > 80) {
      return {
        type: 'hard',
        distance: this.userProfile.weeklyGoal * 0.8,
        intensity: 80 + menstrualAdjustment,
        reason: 'Dia ideal para treino intenso! Aproveite sua energia.',
        tips: [
          'Warm-up completo',
          'Mantenha forma técnica',
          'Hidratação extra',
          'Recuperação ativa após'
        ],
        adaptation: 'Intensidade alta para desenvolvimento',
        hapticFeedback: true
      };
    }
    
    return {
      type: 'moderate',
      distance: this.userProfile.weeklyGoal * 0.6,
      intensity: 60 + menstrualAdjustment,
      reason: 'Treino equilibrado para desenvolvimento consistente.',
      tips: [
        'Ritmo desafiador mas sustentável',
        'Foque na respiração',
        'Mantenha postura',
        'Alongue após'
      ],
      adaptation: 'Volume e intensidade balanceados',
      hapticFeedback: false
    };
  }

  private getMenstrualAdjustment(phase?: string): number {
    if (!phase) return 0;
    
    switch (phase) {
      case 'menstrual':
        return -15; // Reduz intensidade
      case 'follicular':
        return 10; // Aumenta intensidade
      case 'ovulatory':
        return 5; // Pequeno aumento
      case 'luteal':
        return -5; // Pequena redução
      default:
        return 0;
    }
  }

  private shouldDoIntenseWorkout(data: PhysiologicalData): boolean {
    // Verifica se é um bom dia para treino intenso
    return data.hrv > 60 && 
           data.fatigue < 40 && 
           data.stress < 50 && 
           data.sleepQuality > 70 &&
           data.mood > 60;
  }

  private updateLearningModel(data: PhysiologicalData) {
    // Atualiza o modelo com novos dados
    this.physiologicalHistory.push(data);
    
    // Mantém apenas últimos 30 dias
    if (this.physiologicalHistory.length > 30) {
      this.physiologicalHistory.shift();
    }
    
    // Ajusta parâmetros do modelo
    const avgHRV = this.physiologicalHistory.reduce((sum, d) => sum + d.hrv, 0) / this.physiologicalHistory.length;
    this.learningModel.optimalHRV = this.learningModel.optimalHRV * 0.9 + avgHRV * 0.1;
    
    // Identifica padrões de recuperação
    this.identifyRecoveryPatterns();
  }

  private identifyRecoveryPatterns() {
    // Análise simples de padrões de recuperação
    const patterns = this.physiologicalHistory
      .filter(d => d.fatigue > 70)
      .map(d => ({
        hrv: d.hrv,
        sleep: d.sleepHours,
        recovery: d.fatigue
      }));
    
    if (patterns.length > 5) {
      this.learningModel.recoveryPatterns = patterns;
    }
  }

  private async provideHapticFeedback(type: string) {
    try {
      switch (type) {
        case 'skip':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'hard':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        default:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.log('Haptic feedback not available');
    }
  }

  public getRunnerProfile(): RunnerProfile {
    return this.userProfile;
  }

  public updateProfile(newProfile: Partial<RunnerProfile>) {
    this.userProfile = { ...this.userProfile, ...newProfile };
  }

  public getHealthInsights(): string[] {
    const insights: string[] = [];
    const recent = this.physiologicalHistory.slice(-7);
    
    if (recent.length === 0) return insights;
    
    const avgHRV = recent.reduce((sum, d) => sum + d.hrv, 0) / recent.length;
    const avgSleep = recent.reduce((sum, d) => sum + d.sleepHours, 0) / recent.length;
    const avgFatigue = recent.reduce((sum, d) => sum + d.fatigue, 0) / recent.length;
    
    if (avgHRV < 40) insights.push('Seu HRV está baixo. Considere mais descanso e redução de estresse.');
    if (avgSleep < 7) insights.push('Você está dormindo menos que o ideal. Tente dormir 7-9 horas.');
    if (avgFatigue > 60) insights.push('Fadiga acumulada detectada. Considere uma semana de recuperação.');
    
    return insights;
  }
}

// Função helper para criar coach
export function createAICoach(profile: RunnerProfile): AICoach {
  return new AICoach(profile);
}