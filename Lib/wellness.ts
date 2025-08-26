export interface WellnessMetrics {
  id: string;
  userId: string;
  timestamp: number;
  mood: number; // 0-100
  stress: number; // 0-100
  energy: number; // 0-100
  sleep: {
    hours: number;
    quality: number; // 0-100
    deepSleep: number; // hours
    remSleep: number; // hours
  };
  hydration: {
    waterIntake: number; // liters
    lastDrink: number; // timestamp
  };
  nutrition: {
    calories: number;
    protein: number; // grams
    carbs: number; // grams
    fat: number; // grams
    lastMeal: number; // timestamp
  };
  physical: {
    hrv: number; // Heart Rate Variability (ms)
    restingHeartRate: number;
    bodyTemperature: number;
    steps: number;
    activeMinutes: number;
  };
  mental: {
    focus: number; // 0-100
    motivation: number; // 0-100
    socialConnections: number; // 0-100
    gratitude: number; // 0-100
  };
  runImpact: {
    preRunMood: number;
    postRunMood: number;
    runSatisfaction: number;
    recoveryFeeling: number;
  };
}

export interface GratitudeEntry {
  id: string;
  userId: string;
  timestamp: number;
  type: 'run' | 'life' | 'achievement' | 'relationship' | 'nature' | 'health';
  title: string;
  description: string;
  intensity: number; // 0-100
  tags: string[];
  photoUrl?: string;
  location?: { lat: number; lng: number };
  relatedRunId?: string;
  isPublic: boolean;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  timestamp: number;
  likes: number;
}

export interface WellnessInsight {
  id: string;
  type: 'trend' | 'correlation' | 'recommendation' | 'achievement';
  title: string;
  description: string;
  data: any;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  actionText?: string;
  actionUrl?: string;
}

export interface WellnessGoal {
  id: string;
  userId: string;
  type: 'mood' | 'stress' | 'sleep' | 'hydration' | 'gratitude' | 'social';
  target: number;
  current: number;
  unit: string;
  deadline: number;
  progress: number; // 0-100
  completed: boolean;
  completedAt?: number;
}

export interface WellnessStreak {
  id: string;
  userId: string;
  type: 'gratitude' | 'hydration' | 'sleep' | 'mood';
  currentStreak: number;
  longestStreak: number;
  lastUpdate: number;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  days: number;
  unlocked: boolean;
  unlockedAt?: number;
  reward: string;
  icon: string;
}

export class WellnessManager {
  private wellnessData: WellnessMetrics[] = [];
  private gratitudeEntries: GratitudeEntry[] = [];
  private goals: WellnessGoal[] = [];
  private streaks: WellnessStreak[] = [];
  private insights: WellnessInsight[] = [];

  constructor() {
    this.initializeWellnessData();
    this.generateInsights();
  }

  private initializeWellnessData() {
    // Dados simulados de bem-estar
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    for (let i = 0; i < 30; i++) {
      const timestamp = now - (i * oneDay);
      const dayOfWeek = new Date(timestamp).getDay();
      
      // Simula variação por dia da semana
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const baseMood = isWeekend ? 75 : 65;
      const baseStress = isWeekend ? 30 : 50;
      
      this.wellnessData.push({
        id: `wellness_${timestamp}`,
        userId: 'user_1',
        timestamp,
        mood: Math.max(0, Math.min(100, baseMood + (Math.random() - 0.5) * 30)),
        stress: Math.max(0, Math.min(100, baseStress + (Math.random() - 0.5) * 20)),
        energy: Math.max(0, Math.min(100, 70 + (Math.random() - 0.5) * 40)),
        sleep: {
          hours: 7 + (Math.random() - 0.5) * 2,
          quality: Math.max(0, Math.min(100, 75 + (Math.random() - 0.5) * 30)),
          deepSleep: 1.5 + (Math.random() - 0.5) * 1,
          remSleep: 2 + (Math.random() - 0.5) * 1
        },
        hydration: {
          waterIntake: 2 + Math.random() * 1.5,
          lastDrink: timestamp - Math.random() * 3600000
        },
        nutrition: {
          calories: 1800 + (Math.random() - 0.5) * 400,
          protein: 80 + (Math.random() - 0.5) * 40,
          carbs: 200 + (Math.random() - 0.5) * 100,
          fat: 60 + (Math.random() - 0.5) * 30,
          lastMeal: timestamp - Math.random() * 7200000
        },
        physical: {
          hrv: 45 + (Math.random() - 0.5) * 30,
          restingHeartRate: 60 + (Math.random() - 0.5) * 20,
          bodyTemperature: 36.8 + (Math.random() - 0.5) * 0.8,
          steps: 8000 + Math.random() * 4000,
          activeMinutes: 30 + Math.random() * 60
        },
        mental: {
          focus: Math.max(0, Math.min(100, 70 + (Math.random() - 0.5) * 40)),
          motivation: Math.max(0, Math.min(100, 75 + (Math.random() - 0.5) * 30)),
          socialConnections: Math.max(0, Math.min(100, 80 + (Math.random() - 0.5) * 40)),
          gratitude: Math.max(0, Math.min(100, 85 + (Math.random() - 0.5) * 30))
        },
        runImpact: {
          preRunMood: Math.max(0, Math.min(100, 60 + (Math.random() - 0.5) * 40)),
          postRunMood: Math.max(0, Math.min(100, 80 + (Math.random() - 0.5) * 20)),
          runSatisfaction: Math.max(0, Math.min(100, 85 + (Math.random() - 0.5) * 30)),
          recoveryFeeling: Math.max(0, Math.min(100, 75 + (Math.random() - 0.5) * 40))
        }
      });
    }

    // Inicializa streaks
    this.streaks = [
      this.createStreak('gratitude'),
      this.createStreak('hydration'),
      this.createStreak('sleep'),
      this.createStreak('mood')
    ];

    // Inicializa goals
    this.goals = [
      this.createGoal('mood', 80, 100, 'pontos', now + 30 * oneDay),
      this.createGoal('sleep', 7.5, 8, 'horas', now + 30 * oneDay),
      this.createGoal('gratitude', 3, 5, 'entradas/semana', now + 7 * oneDay)
    ];
  }

  private createStreak(type: string): WellnessStreak {
    const milestones = [
      { id: 'm1', days: 7, unlocked: false, reward: '7 dias consecutivos', icon: '🔥' },
      { id: 'm2', days: 21, unlocked: false, reward: '21 dias - hábito formado', icon: '💪' },
      { id: 'm3', days: 30, unlocked: false, reward: '30 dias - consistência', icon: '🏆' },
      { id: 'm4', days: 100, unlocked: false, reward: '100 dias - mestre', icon: '👑' }
    ];

    return {
      id: `streak_${type}`,
      userId: 'user_1',
      type: type as any,
      currentStreak: Math.floor(Math.random() * 15),
      longestStreak: Math.floor(Math.random() * 30) + 10,
      lastUpdate: Date.now(),
      milestones
    };
  }

  private createGoal(type: string, current: number, target: number, unit: string, deadline: number): WellnessGoal {
    const progress = Math.min(100, (current / target) * 100);
    
    return {
      id: `goal_${type}`,
      userId: 'user_1',
      type: type as any,
      target,
      current,
      unit,
      deadline,
      progress,
      completed: progress >= 100
    };
  }

  public addWellnessData(data: Partial<WellnessMetrics>): WellnessMetrics {
    const newData: WellnessMetrics = {
      id: `wellness_${Date.now()}`,
      userId: 'user_1',
      timestamp: Date.now(),
      mood: 50,
      stress: 50,
      energy: 50,
      sleep: { hours: 7, quality: 50, deepSleep: 1.5, remSleep: 2 },
      hydration: { waterIntake: 2, lastDrink: Date.now() },
      nutrition: { calories: 1800, protein: 80, carbs: 200, fat: 60, lastMeal: Date.now() },
      physical: { hrv: 50, restingHeartRate: 70, bodyTemperature: 36.8, steps: 8000, activeMinutes: 45 },
      mental: { focus: 50, motivation: 50, socialConnections: 50, gratitude: 50 },
      runImpact: { preRunMood: 50, postRunMood: 50, runSatisfaction: 50, recoveryFeeling: 50 },
      ...data
    };

    this.wellnessData.push(newData);
    this.updateStreaks(newData);
    this.updateGoals(newData);
    this.generateInsights();

    return newData;
  }

  public addGratitudeEntry(entry: Omit<GratitudeEntry, 'id' | 'timestamp' | 'likes' | 'comments'>): GratitudeEntry {
    const newEntry: GratitudeEntry = {
      ...entry,
      id: `gratitude_${Date.now()}`,
      timestamp: Date.now(),
      likes: 0,
      comments: []
    };

    this.gratitudeEntries.push(newEntry);
    this.updateGratitudeStreak();
    this.generateInsights();

    return newEntry;
  }

  private updateStreaks(data: WellnessMetrics) {
    // Atualiza streak de gratidão
    const gratitudeStreak = this.streaks.find(s => s.type === 'gratitude');
    if (gratitudeStreak && data.mental.gratitude > 70) {
      gratitudeStreak.currentStreak++;
      gratitudeStreak.lastUpdate = Date.now();
      
      if (gratitudeStreak.currentStreak > gratitudeStreak.longestStreak) {
        gratitudeStreak.longestStreak = gratitudeStreak.currentStreak;
      }

      // Verifica milestones
      gratitudeStreak.milestones.forEach(milestone => {
        if (!milestone.unlocked && gratitudeStreak.currentStreak >= milestone.days) {
          milestone.unlocked = true;
          milestone.unlockedAt = Date.now();
        }
      });
    } else if (gratitudeStreak && data.mental.gratitude <= 70) {
      gratitudeStreak.currentStreak = 0;
    }

    // Atualiza outros streaks baseado nos dados
    this.updateOtherStreaks(data);
  }

  private updateOtherStreaks(data: WellnessMetrics) {
    // Streak de hidratação
    const hydrationStreak = this.streaks.find(s => s.type === 'hydration');
    if (hydrationStreak && data.hydration.waterIntake >= 2.5) {
      hydrationStreak.currentStreak++;
      this.checkMilestones(hydrationStreak);
    } else if (hydrationStreak) {
      hydrationStreak.currentStreak = 0;
    }

    // Streak de sono
    const sleepStreak = this.streaks.find(s => s.type === 'sleep');
    if (sleepStreak && data.sleep.hours >= 7 && data.sleep.quality >= 70) {
      sleepStreak.currentStreak++;
      this.checkMilestones(sleepStreak);
    } else if (sleepStreak) {
      sleepStreak.currentStreak = 0;
    }

    // Streak de humor
    const moodStreak = this.streaks.find(s => s.type === 'mood');
    if (moodStreak && data.mood >= 70) {
      moodStreak.currentStreak++;
      this.checkMilestones(moodStreak);
    } else if (moodStreak) {
      moodStreak.currentStreak = 0;
    }
  }

  private checkMilestones(streak: WellnessStreak) {
    streak.milestones.forEach(milestone => {
      if (!milestone.unlocked && streak.currentStreak >= milestone.days) {
        milestone.unlocked = true;
        milestone.unlockedAt = Date.now();
      }
    });
  }

  private updateGratitudeStreak() {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    
    const todayEntries = this.gratitudeEntries.filter(entry => 
      new Date(entry.timestamp).toDateString() === today
    );
    
    const yesterdayEntries = this.gratitudeEntries.filter(entry => 
      new Date(entry.timestamp).toDateString() === yesterday
    );

    const gratitudeStreak = this.streaks.find(s => s.type === 'gratitude');
    if (gratitudeStreak) {
      if (todayEntries.length > 0) {
        gratitudeStreak.currentStreak++;
        this.checkMilestones(gratitudeStreak);
      } else if (yesterdayEntries.length === 0) {
        gratitudeStreak.currentStreak = 0;
      }
    }
  }

  private updateGoals(data: WellnessMetrics) {
    this.goals.forEach(goal => {
      switch (goal.type) {
        case 'mood':
          goal.current = data.mood;
          break;
        case 'sleep':
          goal.current = data.sleep.hours;
          break;
        case 'gratitude':
          const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
          goal.current = this.gratitudeEntries.filter(e => e.timestamp >= weekAgo).length;
          break;
      }

      goal.progress = Math.min(100, (goal.current / goal.target) * 100);
      goal.completed = goal.progress >= 100;
      
      if (goal.completed && !goal.completedAt) {
        goal.completedAt = Date.now();
      }
    });
  }

  private generateInsights() {
    this.insights = [];

    if (this.wellnessData.length < 7) return;

    const recent = this.wellnessData.slice(-7);
    const avgMood = recent.reduce((sum, d) => sum + d.mood, 0) / recent.length;
    const avgStress = recent.reduce((sum, d) => sum + d.stress, 0) / recent.length;
    const avgSleep = recent.reduce((sum, d) => sum + d.sleep.hours, 0) / recent.length;

    // Insight de tendência de humor
    if (avgMood < 60) {
      this.insights.push({
        id: 'insight_mood_trend',
        type: 'trend',
        title: 'Humor em declínio',
        description: 'Seu humor tem estado baixo nos últimos 7 dias. Considere atividades que elevem seu espírito.',
        data: { avgMood, trend: 'declining' },
        priority: 'medium',
        actionable: true,
        actionText: 'Ver sugestões',
        actionUrl: '/wellness/suggestions'
      });
    }

    // Insight de correlação corrida-humor
    const runsWithMood = recent.filter(d => d.runImpact.postRunMood > d.runImpact.preRunMood);
    if (runsWithMood.length > 0) {
      const improvement = runsWithMood.reduce((sum, d) => 
        sum + (d.runImpact.postRunMood - d.runImpact.preRunMood), 0
      ) / runsWithMood.length;

      if (improvement > 15) {
        this.insights.push({
          id: 'insight_run_mood_correlation',
          type: 'correlation',
          title: 'Corridas melhoram seu humor',
          description: `Suas corridas têm melhorado seu humor em média ${Math.round(improvement)} pontos!`,
          data: { improvement, correlation: 'positive' },
          priority: 'low',
          actionable: false
        });
      }
    }

    // Insight de sono
    if (avgSleep < 7) {
      this.insights.push({
        id: 'insight_sleep_deficit',
        type: 'recommendation',
        title: 'Déficit de sono detectado',
        description: 'Você está dormindo menos que o recomendado. Sono adequado melhora performance e recuperação.',
        data: { avgSleep, recommended: 7.5 },
        priority: 'high',
        actionable: true,
        actionText: 'Ver dicas de sono',
        actionUrl: '/wellness/sleep-tips'
      });
    }

    // Insight de estresse
    if (avgStress > 70) {
      this.insights.push({
        id: 'insight_high_stress',
        type: 'recommendation',
        title: 'Níveis de estresse elevados',
        description: 'Seu estresse está alto. Considere técnicas de relaxamento e atividades físicas moderadas.',
        data: { avgStress, threshold: 70 },
        priority: 'high',
        actionable: true,
        actionText: 'Técnicas de relaxamento',
        actionUrl: '/wellness/relaxation'
      });
    }

    // Insight de conquista
    const completedGoals = this.goals.filter(g => g.completed);
    if (completedGoals.length > 0) {
      this.insights.push({
        id: 'insight_goals_completed',
        type: 'achievement',
        title: 'Metas alcançadas!',
        description: `Parabéns! Você completou ${completedGoals.length} meta(s) de bem-estar.`,
        data: { completedGoals: completedGoals.length },
        priority: 'low',
        actionable: false
      });
    }
  }

  public getWellnessSummary(): {
    currentMood: number;
    currentStress: number;
    currentEnergy: number;
    weeklyTrend: 'improving' | 'stable' | 'declining';
    insights: WellnessInsight[];
    streaks: WellnessStreak[];
    goals: WellnessGoal[];
  } {
    const latest = this.wellnessData[this.wellnessData.length - 1];
    if (!latest) return this.getDefaultSummary();

    const weekly = this.wellnessData.slice(-7);
    const avgMood = weekly.reduce((sum, d) => sum + d.mood, 0) / weekly.length;
    const weeklyTrend = latest.mood > avgMood ? 'improving' : 
                       latest.mood < avgMood ? 'declining' : 'stable';

    return {
      currentMood: latest.mood,
      currentStress: latest.stress,
      currentEnergy: latest.energy,
      weeklyTrend,
      insights: this.insights.slice(0, 5), // Top 5 insights
      streaks: this.streaks,
      goals: this.goals
    };
  }

  private getDefaultSummary() {
    return {
      currentMood: 50,
      currentStress: 50,
      currentEnergy: 50,
      weeklyTrend: 'stable' as const,
      insights: [],
      streaks: this.streaks,
      goals: this.goals
    };
  }

  public getGratitudeFeed(limit: number = 20): GratitudeEntry[] {
    return this.gratitudeEntries
      .filter(entry => entry.isPublic)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  public getWellnessTrends(days: number = 30): {
    mood: number[];
    stress: number[];
    energy: number[];
    sleep: number[];
    dates: string[];
  } {
    const data = this.wellnessData.slice(-days);
    
    return {
      mood: data.map(d => d.mood),
      stress: data.map(d => d.stress),
      energy: data.map(d => d.energy),
      sleep: data.map(d => d.sleep.hours),
      dates: data.map(d => new Date(d.timestamp).toLocaleDateString())
    };
  }

  public getRunImpactAnalysis(): {
    averageMoodImprovement: number;
    satisfactionTrend: string;
    recoveryInsights: string[];
  } {
    const runs = this.wellnessData.filter(d => d.runImpact.postRunMood > 0);
    
    if (runs.length === 0) {
      return {
        averageMoodImprovement: 0,
        satisfactionTrend: 'Sem dados suficientes',
        recoveryInsights: []
      };
    }

    const avgImprovement = runs.reduce((sum, d) => 
      sum + (d.runImpact.postRunMood - d.runImpact.preRunMood), 0
    ) / runs.length;

    const satisfactionTrend = runs[runs.length - 1].runImpact.runSatisfaction > 
                             runs[0].runImpact.runSatisfaction ? 'Melhorando' : 'Estável';

    const recoveryInsights = [];
    const avgRecovery = runs.reduce((sum, d) => sum + d.runImpact.recoveryFeeling, 0) / runs.length;
    
    if (avgRecovery < 60) {
      recoveryInsights.push('Considere mais tempo de recuperação entre treinos');
    }
    if (avgRecovery > 80) {
      recoveryInsights.push('Excelente recuperação! Você está se adaptando bem');
    }

    return {
      averageMoodImprovement: Math.round(avgImprovement),
      satisfactionTrend,
      recoveryInsights
    };
  }
}

// Função helper para criar gerenciador de bem-estar
export function createWellnessManager(): WellnessManager {
  return new WellnessManager();
}