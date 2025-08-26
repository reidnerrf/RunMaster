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

export interface UserProfile {
  id: string;
  userId: string;
  gender: 'male' | 'female';
  age: number;
  weight: number; // kg
  height: number; // cm
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  fitnessGoal: 'weight_loss' | 'maintenance' | 'muscle_gain' | 'endurance' | 'performance';
  dietaryRestrictions: string[];
  allergies: string[];
  preferences: {
    cuisine: string[];
    mealTiming: {
      breakfast: string;
      lunch: string;
      dinner: string;
      snacks: string[];
    };
    hydrationReminders: boolean;
    supplementReminders: boolean;
    restReminders: boolean;
  };
  healthMetrics: {
    bmi: number;
    bmr: number; // Taxa Metabólica Basal
    tdee: number; // Total Daily Energy Expenditure
    bodyFatPercentage?: number;
    muscleMass?: number;
    hydrationLevel?: number; // 0-100
    sleepQuality?: number; // 0-100
    stressLevel?: number; // 0-100
  };
  lastUpdated: number;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  type: 'running' | 'strength' | 'flexibility' | 'recovery' | 'mixed';
  intensity: 'low' | 'moderate' | 'high' | 'extreme';
  duration: number; // minutos
  distance?: number; // km
  caloriesBurned: number;
  heartRate: {
    average: number;
    max: number;
    zones: {
      zone1: number; // 50-60% max
      zone2: number; // 60-70% max
      zone3: number; // 70-80% max
      zone4: number; // 80-90% max
      zone5: number; // 90-100% max
    };
  };
  terrain: 'flat' | 'hilly' | 'mountainous' | 'mixed';
  weather: {
    temperature: number;
    humidity: number;
    conditions: string;
  };
  startTime: number;
  endTime: number;
  recoveryTime?: number; // minutos estimados
  hydrationLost?: number; // ml
  nutritionNeeds: {
    calories: number;
    protein: number; // g
    carbs: number; // g
    fats: number; // g
    hydration: number; // ml
  };
}

export interface NutritionPlan {
  id: string;
  userId: string;
  date: number;
  workoutSessions: string[];
  totalCaloriesBurned: number;
  meals: {
    breakfast: NutritionMeal;
    lunch: NutritionMeal;
    dinner: NutritionMeal;
    snacks: NutritionMeal[];
    preWorkout?: NutritionMeal;
    postWorkout?: NutritionMeal;
  };
  hydration: {
    totalNeeded: number; // ml
    totalConsumed: number; // ml
    remaining: number; // ml
    reminders: HydrationReminder[];
  };
  supplements: SupplementRecommendation[];
  restRecommendations: RestRecommendation[];
  dailyGoals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    hydration: number;
    sleep: number;
    recovery: number;
  };
  progress: {
    caloriesConsumed: number;
    proteinConsumed: number;
    carbsConsumed: number;
    fatsConsumed: number;
    hydrationConsumed: number;
    sleepHours: number;
    recoveryQuality: number;
  };
}

export interface NutritionMeal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout';
  timing: string; // "30min before workout", "immediately after", etc.
  calories: number;
  macronutrients: {
    protein: number; // g
    carbs: number; // g
    fats: number; // g
    fiber: number; // g
    sugar: number; // g
  };
  micronutrients: {
    vitamins: { [key: string]: number };
    minerals: { [key: string]: number };
  };
  ingredients: NutritionIngredient[];
  preparation: string;
  alternatives: string[];
  isCompleted: boolean;
  completedAt?: number;
  notes?: string;
}

export interface NutritionIngredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  category: 'protein' | 'carbohydrate' | 'fat' | 'vegetable' | 'fruit' | 'dairy' | 'grain' | 'supplement';
  benefits: string[];
  alternatives: string[];
}

export interface HydrationReminder {
  id: string;
  time: string; // "09:00", "11:00", etc.
  amount: number; // ml
  message: string;
  isCompleted: boolean;
  completedAt?: number;
}

export interface SupplementRecommendation {
  id: string;
  name: string;
  type: 'vitamin' | 'mineral' | 'protein' | 'amino_acid' | 'herb' | 'other';
  dosage: string;
  timing: string;
  purpose: string;
  benefits: string[];
  sideEffects?: string[];
  contraindications?: string[];
  isRecommended: boolean;
  reason: string;
  priority: 'low' | 'medium' | 'high';
}

export interface RestRecommendation {
  id: string;
  type: 'sleep' | 'recovery' | 'stress_management' | 'stretching' | 'meditation';
  title: string;
  description: string;
  duration: number; // minutos
  timing: string;
  benefits: string[];
  techniques: string[];
  isCompleted: boolean;
  completedAt?: number;
  quality?: number; // 0-100
}

export interface WellnessManager {
  userProfiles: Map<string, UserProfile>;
  workoutSessions: WorkoutSession[];
  nutritionPlans: NutritionPlan[];
  recommendations: {
    nutrition: NutritionRecommendation[];
    hydration: HydrationRecommendation[];
    supplements: SupplementRecommendation[];
    rest: RestRecommendation[];
  };
}

export interface NutritionRecommendation {
  id: string;
  userId: string;
  type: 'meal_plan' | 'snack' | 'pre_workout' | 'post_workout' | 'recovery';
  title: string;
  description: string;
  reasoning: string;
  calories: number;
  macronutrients: {
    protein: number;
    carbs: number;
    fats: number;
  };
  timing: string;
  alternatives: string[];
  isPersonalized: boolean;
  priority: 'low' | 'medium' | 'high';
  expiresAt?: number;
}

export interface HydrationRecommendation {
  id: string;
  userId: string;
  type: 'daily' | 'workout' | 'recovery' | 'climate';
  title: string;
  description: string;
  totalAmount: number; // ml
  schedule: {
    time: string;
    amount: number;
    message: string;
  }[];
  factors: {
    workoutIntensity: number;
    climate: number;
    bodyWeight: number;
    activityLevel: number;
  };
  isPersonalized: boolean;
  priority: 'low' | 'medium' | 'high';
}

export class WellnessManager {
  private userProfiles: Map<string, UserProfile> = new Map();
  private workoutSessions: WorkoutSession[] = [];
  private nutritionPlans: NutritionPlan[] = [];
  private recommendations: {
    nutrition: NutritionRecommendation[];
    hydration: HydrationRecommendation[];
    supplements: SupplementRecommendation[];
    rest: RestRecommendation[];
  } = {
    nutrition: [],
    hydration: [],
    supplements: [],
    rest: []
  };

  constructor() {
    this.initializeWellnessData();
  }

  private initializeWellnessData() {
    // Inicializar perfil de exemplo
    const sampleProfile: UserProfile = {
      id: 'profile_1',
      userId: 'user_1',
      gender: 'female',
      age: 28,
      weight: 65,
      height: 165,
      activityLevel: 'moderately_active',
      fitnessGoal: 'endurance',
      dietaryRestrictions: ['vegetarian'],
      allergies: ['nuts'],
      preferences: {
        cuisine: ['mediterranean', 'asian', 'italian'],
        mealTiming: {
          breakfast: '07:00',
          lunch: '12:30',
          dinner: '19:00',
          snacks: ['10:00', '15:00', '21:00']
        },
        hydrationReminders: true,
        supplementReminders: true,
        restReminders: true
      },
      healthMetrics: {
        bmi: 23.9,
        bmr: 1450,
        tdee: 2030,
        bodyFatPercentage: 22,
        muscleMass: 45,
        hydrationLevel: 75,
        sleepQuality: 80,
        stressLevel: 30
      },
      lastUpdated: Date.now()
    };

    this.userProfiles.set('user_1', sampleProfile);

    // Inicializar sessão de treino de exemplo
    const sampleWorkout: WorkoutSession = {
      id: 'workout_1',
      userId: 'user_1',
      type: 'running',
      intensity: 'high',
      duration: 45,
      distance: 8.5,
      caloriesBurned: 680,
      heartRate: {
        average: 155,
        max: 178,
        zones: {
          zone1: 15,
          zone2: 25,
          zone3: 40,
          zone4: 15,
          zone5: 5
        }
      },
      terrain: 'hilly',
      weather: {
        temperature: 22,
        humidity: 65,
        conditions: 'partly_cloudy'
      },
      startTime: Date.now() - 3600000, // 1 hora atrás
      endTime: Date.now() - 900000, // 15 minutos atrás
      recoveryTime: 60,
      hydrationLost: 850,
      nutritionNeeds: {
        calories: 850,
        protein: 42,
        carbs: 106,
        fats: 28,
        hydration: 1200
      }
    };

    this.workoutSessions.push(sampleWorkout);
  }

  // Criar ou atualizar perfil do usuário
  public createUserProfile(profile: Omit<UserProfile, 'id' | 'lastUpdated'>): UserProfile {
    const newProfile: UserProfile = {
      ...profile,
      id: `profile_${Date.now()}`,
      lastUpdated: Date.now()
    };

    // Calcular métricas de saúde
    newProfile.healthMetrics.bmi = this.calculateBMI(profile.weight, profile.height);
    newProfile.healthMetrics.bmr = this.calculateBMR(profile.gender, profile.age, profile.weight, profile.height);
    newProfile.healthMetrics.tdee = this.calculateTDEE(newProfile.healthMetrics.bmr, profile.activityLevel);

    this.userProfiles.set(profile.userId, newProfile);
    return newProfile;
  }

  // Calcular IMC
  private calculateBMI(weight: number, height: number): number {
    const heightInMeters = height / 100;
    return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
  }

  // Calcular Taxa Metabólica Basal (Fórmula de Mifflin-St Jeor)
  private calculateBMR(gender: string, age: number, weight: number, height: number): number {
    if (gender === 'male') {
      return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    } else {
      return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
    }
  }

  // Calcular Total Daily Energy Expenditure
  private calculateTDEE(bmr: number, activityLevel: string): number {
    const multipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9
    };

    return Math.round(bmr * multipliers[activityLevel as keyof typeof multipliers]);
  }

  // Registrar sessão de treino
  public recordWorkoutSession(workout: Omit<WorkoutSession, 'id' | 'nutritionNeeds'>): WorkoutSession {
    const userProfile = this.userProfiles.get(workout.userId);
    if (!userProfile) {
      throw new Error('User profile not found');
    }

    // Calcular necessidades nutricionais baseadas no treino
    const nutritionNeeds = this.calculateNutritionNeeds(workout, userProfile);

    const newWorkout: WorkoutSession = {
      ...workout,
      id: `workout_${Date.now()}`,
      nutritionNeeds
    };

    this.workoutSessions.push(newWorkout);

    // Gerar recomendações nutricionais
    this.generateNutritionRecommendations(workout.userId, newWorkout);

    return newWorkout;
  }

  // Calcular necessidades nutricionais
  private calculateNutritionNeeds(workout: WorkoutSession, profile: UserProfile): WorkoutSession['nutritionNeeds'] {
    const { caloriesBurned, duration, intensity, terrain, weather } = workout;
    const { weight, fitnessGoal } = profile;

    // Calorias baseadas no gasto calórico
    let calories = caloriesBurned * 0.7; // 70% do gasto para reposição

    // Ajustar baseado no objetivo
    switch (fitnessGoal) {
      case 'weight_loss':
        calories *= 0.8; // Reduzir 20%
        break;
      case 'muscle_gain':
        calories *= 1.2; // Aumentar 20%
        break;
      case 'maintenance':
        calories *= 1.0; // Manter
        break;
      case 'endurance':
        calories *= 1.1; // Aumentar 10%
        break;
      case 'performance':
        calories *= 1.15; // Aumentar 15%
        break;
    }

    // Proteína baseada no peso e intensidade
    let proteinMultiplier = 1.6; // g/kg base
    if (intensity === 'high' || intensity === 'extreme') {
      proteinMultiplier = 2.0;
    }
    if (fitnessGoal === 'muscle_gain') {
      proteinMultiplier = 2.2;
    }

    const protein = Math.round((weight * proteinMultiplier) * 10) / 10;

    // Carboidratos baseados no tipo de treino
    let carbMultiplier = 4.0; // g/kg base
    if (workout.type === 'running' && duration > 30) {
      carbMultiplier = 6.0;
    }
    if (intensity === 'high' || intensity === 'extreme') {
      carbMultiplier += 1.0;
    }

    const carbs = Math.round((weight * carbMultiplier) * 10) / 10;

    // Gorduras (resto das calorias)
    const fatCalories = calories - (protein * 4) - (carbs * 4);
    const fats = Math.round((fatCalories / 9) * 10) / 10;

    // Hidratação baseada no peso, duração e clima
    let hydrationBase = weight * 15; // 15ml/kg base
    hydrationBase += duration * 10; // 10ml/minuto de exercício
    
    if (weather.temperature > 25) {
      hydrationBase *= 1.2; // 20% mais em clima quente
    }
    if (terrain === 'hilly' || terrain === 'mountainous') {
      hydrationBase *= 1.1; // 10% mais em terreno difícil
    }

    const hydration = Math.round(hydrationBase);

    return {
      calories: Math.round(calories),
      protein,
      carbs,
      fats,
      hydration
    };
  }

  // Gerar recomendações nutricionais
  private generateNutritionRecommendations(userId: string, workout: WorkoutSession) {
    const userProfile = this.userProfiles.get(userId);
    if (!userProfile) return;

    const { nutritionNeeds, type, intensity, startTime } = workout;
    const { gender, age, weight, dietaryRestrictions } = userProfile;

    // Recomendação pré-treino
    if (type === 'running' && intensity === 'high') {
      const preWorkout: NutritionRecommendation = {
        id: `rec_${Date.now()}_1`,
        userId,
        type: 'pre_workout',
        title: 'Refeição Pré-Treino Energética',
        description: 'Refeição rica em carboidratos para fornecer energia durante o treino',
        reasoning: `Baseado no treino de ${workout.duration}min de alta intensidade`,
        calories: Math.round(nutritionNeeds.calories * 0.3),
        macronutrients: {
          protein: Math.round(nutritionNeeds.protein * 0.3),
          carbs: Math.round(nutritionNeeds.carbs * 0.4),
          fats: Math.round(nutritionNeeds.fats * 0.2)
        },
        timing: '2-3 horas antes do treino',
        alternatives: ['Banana com aveia', 'Pão integral com mel', 'Smoothie de frutas'],
        isPersonalized: true,
        priority: 'high',
        expiresAt: startTime + 3600000 // 1 hora após o treino
      };

      this.recommendations.nutrition.push(preWorkout);
    }

    // Recomendação pós-treino
    const postWorkout: NutritionRecommendation = {
      id: `rec_${Date.now()}_2`,
      userId,
      type: 'post_workout',
      title: 'Recuperação Pós-Treino',
      description: 'Refeição para recuperar energia e reparar músculos',
      reasoning: `Reposição de ${nutritionNeeds.calories} calorias queimadas`,
      calories: nutritionNeeds.calories,
      macronutrients: {
        protein: nutritionNeeds.protein,
        carbs: nutritionNeeds.carbs,
        fats: nutritionNeeds.fats
      },
      timing: '30 minutos após o treino',
      alternatives: ['Whey protein com banana', 'Frango com arroz', 'Iogurte com granola'],
      isPersonalized: true,
      priority: 'high',
      expiresAt: startTime + 7200000 // 2 horas após o treino
    };

    this.recommendations.nutrition.push(postWorkout);

    // Recomendação de hidratação
    const hydrationRec: HydrationRecommendation = {
      id: `rec_${Date.now()}_3`,
      userId,
      type: 'workout',
      title: 'Hidratação Durante e Pós-Treino',
      description: `Reponha ${nutritionNeeds.hydration}ml de líquidos perdidos`,
      totalAmount: nutritionNeeds.hydration,
      schedule: [
        {
          time: 'Durante o treino',
          amount: Math.round(nutritionNeeds.hydration * 0.6),
          message: 'Beba água a cada 15-20 minutos'
        },
        {
          time: 'Imediatamente após',
          amount: Math.round(nutritionNeeds.hydration * 0.3),
          message: 'Reponha eletrólitos perdidos'
        },
        {
          time: 'Nas próximas 2 horas',
          amount: Math.round(nutritionNeeds.hydration * 0.1),
          message: 'Continue hidratando gradualmente'
        }
      ],
      factors: {
        workoutIntensity: intensity === 'high' || intensity === 'extreme' ? 1.2 : 1.0,
        climate: workout.weather.temperature > 25 ? 1.2 : 1.0,
        bodyWeight: weight,
        activityLevel: 1.5
      },
      isPersonalized: true,
      priority: 'high'
    };

    this.recommendations.hydration.push(hydrationRec);

    // Recomendações de suplementos baseadas no gênero
    this.generateGenderBasedRecommendations(userId, workout, userProfile);
  }

  // Gerar recomendações baseadas no gênero
  private generateGenderBasedRecommendations(userId: string, workout: WorkoutSession, profile: UserProfile) {
    const { gender, age } = profile;
    const { type, intensity, duration } = workout;

    if (gender === 'female') {
      // Suplementos específicos para mulheres
      const ironSupplement: SupplementRecommendation = {
        id: `supp_${Date.now()}_1`,
        name: 'Suplemento de Ferro',
        type: 'mineral',
        dosage: '15-18mg por dia',
        timing: 'Com o estômago vazio, preferencialmente pela manhã',
        purpose: 'Prevenir anemia e melhorar performance',
        benefits: ['Aumenta energia', 'Melhora resistência', 'Previne fadiga'],
        sideEffects: ['Pode causar constipação', 'Pode escurecer as fezes'],
        contraindications: ['Não tomar se tiver hemocromatose'],
        isRecommended: true,
        reason: 'Mulheres em idade reprodutiva têm maior necessidade de ferro',
        priority: 'medium'
      };

      this.recommendations.supplements.push(ironSupplement);

      // Recomendações baseadas no ciclo menstrual
      if (age >= 12 && age <= 55) {
        const cycleRecommendation: RestRecommendation = {
          id: `rest_${Date.now()}_1`,
          type: 'recovery',
          title: 'Recuperação Adaptada ao Ciclo Menstrual',
          description: 'Ajuste sua intensidade de treino baseado na fase do ciclo',
          duration: 60,
          timing: 'Durante a fase lútea (dias 15-28)',
          benefits: ['Melhor recuperação', 'Reduz risco de lesão', 'Otimiza performance'],
          techniques: [
            'Reduza intensidade em 20%',
            'Aumente tempo de recuperação',
            'Foque em alongamento e flexibilidade',
            'Mantenha hidratação extra'
          ],
          isCompleted: false,
          priority: 'high'
        };

        this.recommendations.rest.push(cycleRecommendation);
      }
    } else {
      // Suplementos específicos para homens
      const creatineSupplement: SupplementRecommendation = {
        id: `supp_${Date.now()}_2`,
        name: 'Creatina Monohidratada',
        type: 'amino_acid',
        dosage: '5g por dia',
        timing: 'Qualquer momento do dia, com ou sem comida',
        purpose: 'Aumentar força e potência muscular',
        benefits: ['Aumenta força', 'Melhora explosão', 'Acelera recuperação'],
        sideEffects: ['Pode causar retenção de água'],
        contraindications: ['Não tomar se tiver problemas renais'],
        isRecommended: true,
        reason: 'Homens têm maior massa muscular e podem se beneficiar mais da creatina',
        priority: 'high'
      };

      this.recommendations.supplements.push(creatineSupplement);
    }

    // Suplementos gerais baseados no tipo de treino
    if (type === 'running' && duration > 45) {
      const electrolyteSupplement: SupplementRecommendation = {
        id: `supp_${Date.now()}_3`,
        name: 'Eletrólitos',
        type: 'mineral',
        dosage: '1 sachê durante treinos longos',
        timing: 'Durante treinos de mais de 45 minutos',
        purpose: 'Repor minerais perdidos no suor',
        benefits: ['Previne cãibras', 'Mantém hidratação', 'Melhora performance'],
        sideEffects: ['Pode causar náusea se tomado em excesso'],
        contraindications: ['Não tomar se tiver problemas cardíacos'],
        isRecommended: true,
        reason: 'Treinos longos causam perda significativa de eletrólitos',
        priority: 'high'
      };

      this.recommendations.supplements.push(electrolyteSupplement);
    }
  }

  // Gerar plano nutricional diário
  public generateDailyNutritionPlan(userId: string, date: number): NutritionPlan | null {
    const userProfile = this.userProfiles.get(userId);
    if (!userProfile) return null;

    // Buscar treinos do dia
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const dayWorkouts = this.workoutSessions.filter(w => 
      w.userId === userId &&
      w.startTime >= dayStart.getTime() &&
      w.startTime <= dayEnd.getTime()
    );

    const totalCaloriesBurned = dayWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0);

    // Calcular necessidades diárias
    const dailyCalories = userProfile.healthMetrics.tdee + totalCaloriesBurned * 0.7;
    const dailyProtein = userProfile.weight * 1.8; // 1.8g/kg para atletas
    const dailyCarbs = userProfile.weight * 6.0; // 6g/kg para atletas
    const dailyFats = (dailyCalories - (dailyProtein * 4) - (dailyCarbs * 4)) / 9;

    // Gerar refeições
    const breakfast: NutritionMeal = this.generateMeal('breakfast', dailyCalories * 0.25, dailyProtein * 0.25, dailyCarbs * 0.25, dailyFats * 0.25);
    const lunch: NutritionMeal = this.generateMeal('lunch', dailyCalories * 0.35, dailyProtein * 0.35, dailyCarbs * 0.35, dailyFats * 0.35);
    const dinner: NutritionMeal = this.generateMeal('dinner', dailyCalories * 0.25, dailyProtein * 0.25, dailyCarbs * 0.25, dailyFats * 0.25);
    const snacks: NutritionMeal[] = [
      this.generateMeal('snack', dailyCalories * 0.075, dailyProtein * 0.075, dailyCarbs * 0.075, dailyFats * 0.075),
      this.generateMeal('snack', dailyCalories * 0.075, dailyProtein * 0.075, dailyCarbs * 0.075, dailyFats * 0.075)
    ];

    // Adicionar refeições pré/pós-treino se houver treinos
    let preWorkout: NutritionMeal | undefined;
    let postWorkout: NutritionMeal | undefined;

    if (dayWorkouts.length > 0) {
      const mainWorkout = dayWorkouts[0]; // Assumir primeiro treino do dia
      preWorkout = this.generateMeal('pre_workout', mainWorkout.nutritionNeeds.calories * 0.3, mainWorkout.nutritionNeeds.protein * 0.3, mainWorkout.nutritionNeeds.carbs * 0.4, mainWorkout.nutritionNeeds.fats * 0.2);
      postWorkout = this.generateMeal('post_workout', mainWorkout.nutritionNeeds.calories, mainWorkout.nutritionNeeds.protein, mainWorkout.nutritionNeeds.carbs, mainWorkout.nutritionNeeds.fats);
    }

    const nutritionPlan: NutritionPlan = {
      id: `plan_${Date.now()}`,
      userId,
      date,
      workoutSessions: dayWorkouts.map(w => w.id),
      totalCaloriesBurned,
      meals: {
        breakfast,
        lunch,
        dinner,
        snacks,
        preWorkout,
        postWorkout
      },
      hydration: {
        totalNeeded: userProfile.weight * 35, // 35ml/kg base
        totalConsumed: 0,
        remaining: userProfile.weight * 35,
        reminders: this.generateHydrationReminders(userProfile.weight * 35)
      },
      supplements: this.recommendations.supplements.filter(s => s.userId === userId),
      restRecommendations: this.recommendations.rest.filter(r => r.userId === userId),
      dailyGoals: {
        calories: Math.round(dailyCalories),
        protein: Math.round(dailyProtein * 10) / 10,
        carbs: Math.round(dailyCarbs * 10) / 10,
        fats: Math.round(dailyFats * 10) / 10,
        hydration: Math.round(userProfile.weight * 35),
        sleep: 8,
        recovery: 60
      },
      progress: {
        caloriesConsumed: 0,
        proteinConsumed: 0,
        carbsConsumed: 0,
        fatsConsumed: 0,
        hydrationConsumed: 0,
        sleepHours: 0,
        recoveryQuality: 0
      }
    };

    this.nutritionPlans.push(nutritionPlan);
    return nutritionPlan;
  }

  // Gerar refeição
  private generateMeal(type: string, calories: number, protein: number, carbs: number, fats: number): NutritionMeal {
    const mealNames = {
      breakfast: ['Aveia com Frutas', 'Omelete com Pão Integral', 'Smoothie Proteico'],
      lunch: ['Frango com Arroz Integral', 'Salmão com Quinoa', 'Lentilhas com Vegetais'],
      dinner: ['Atum com Batata Doce', 'Tofu com Legumes', 'Peito de Peru com Abóbora'],
      snack: ['Iogurte com Granola', 'Mix de Castanhas', 'Frutas com Manteiga de Amendoim'],
      pre_workout: ['Banana com Aveia', 'Pão com Mel', 'Smoothie Energético'],
      post_workout: ['Whey Protein', 'Frango com Arroz', 'Iogurte com Granola']
    };

    const names = mealNames[type as keyof typeof mealNames] || ['Refeição'];
    const name = names[Math.floor(Math.random() * names.length)];

    return {
      id: `meal_${Date.now()}_${Math.random()}`,
      name,
      type: type as any,
      timing: this.getMealTiming(type),
      calories: Math.round(calories),
      macronutrients: {
        protein: Math.round(protein * 10) / 10,
        carbs: Math.round(carbs * 10) / 10,
        fats: Math.round(fats * 10) / 10,
        fiber: Math.round(carbs * 0.1 * 10) / 10,
        sugar: Math.round(carbs * 0.2 * 10) / 10
      },
      micronutrients: {
        vitamins: { 'C': 50, 'D': 10, 'E': 5 },
        minerals: { 'Calcium': 200, 'Iron': 5, 'Zinc': 3 }
      },
      ingredients: [],
      preparation: 'Preparar conforme receita',
      alternatives: ['Opção vegetariana', 'Opção sem glúten', 'Opção low-carb'],
      isCompleted: false
    };
  }

  // Obter horário da refeição
  private getMealTiming(type: string): string {
    const timings = {
      breakfast: '07:00 - 08:00',
      lunch: '12:00 - 13:00',
      dinner: '19:00 - 20:00',
      snack: '10:00 ou 15:00',
      pre_workout: '2-3 horas antes do treino',
      post_workout: '30 minutos após o treino'
    };

    return timings[type as keyof typeof timings] || 'Horário flexível';
  }

  // Gerar lembretes de hidratação
  private generateHydrationReminders(totalAmount: number): HydrationReminder[] {
    const reminders: HydrationReminder[] = [];
    const intervals = 8; // 8 lembretes por dia
    const amountPerReminder = Math.round(totalAmount / intervals);

    for (let i = 0; i < intervals; i++) {
      const hour = 8 + (i * 2); // Começar às 8h, a cada 2 horas
      reminders.push({
        id: `reminder_${Date.now()}_${i}`,
        time: `${hour.toString().padStart(2, '0')}:00`,
        amount: amountPerReminder,
        message: `Beba ${amountPerReminder}ml de água para manter-se hidratado`,
        isCompleted: false
      });
    }

    return reminders;
  }

  // Marcar refeição como completada
  public completeMeal(planId: string, mealType: string): boolean {
    const plan = this.nutritionPlans.find(p => p.id === planId);
    if (!plan) return false;

    let meal: NutritionMeal | undefined;

    switch (mealType) {
      case 'breakfast':
        meal = plan.meals.breakfast;
        break;
      case 'lunch':
        meal = plan.meals.lunch;
        break;
      case 'dinner':
        meal = plan.meals.dinner;
        break;
      case 'pre_workout':
        meal = plan.meals.preWorkout;
        break;
      case 'post_workout':
        meal = plan.meals.postWorkout;
        break;
      default:
        // Procurar nos snacks
        const snackIndex = parseInt(mealType.replace('snack_', ''));
        if (!isNaN(snackIndex) && plan.meals.snacks[snackIndex]) {
          meal = plan.meals.snacks[snackIndex];
        }
    }

    if (meal) {
      meal.isCompleted = true;
      meal.completedAt = Date.now();

      // Atualizar progresso
      plan.progress.caloriesConsumed += meal.calories;
      plan.progress.proteinConsumed += meal.macronutrients.protein;
      plan.progress.carbsConsumed += meal.macronutrients.carbs;
      plan.progress.fatsConsumed += meal.macronutrients.fats;

      return true;
    }

    return false;
  }

  // Marcar hidratação como completada
  public completeHydration(planId: string, reminderId: string, amount: number): boolean {
    const plan = this.nutritionPlans.find(p => p.id === planId);
    if (!plan) return false;

    const reminder = plan.hydration.reminders.find(r => r.id === reminderId);
    if (!reminder) return false;

    reminder.isCompleted = true;
    reminder.completedAt = Date.now();

    // Atualizar progresso de hidratação
    plan.progress.hydrationConsumed += amount;
    plan.hydration.totalConsumed += amount;
    plan.hydration.remaining = Math.max(0, plan.hydration.totalNeeded - plan.hydration.totalConsumed);

    return true;
  }

  // Obter plano nutricional do dia
  public getDailyNutritionPlan(userId: string, date: number): NutritionPlan | undefined {
    return this.nutritionPlans.find(p => 
      p.userId === userId && 
      new Date(p.date).toDateString() === new Date(date).toDateString()
    );
  }

  // Obter recomendações do usuário
  public getUserRecommendations(userId: string): {
    nutrition: NutritionRecommendation[];
    hydration: HydrationRecommendation[];
    supplements: SupplementRecommendation[];
    rest: RestRecommendation[];
  } {
    return {
      nutrition: this.recommendations.nutrition.filter(r => r.userId === userId),
      hydration: this.recommendations.hydration.filter(r => r.userId === userId),
      supplements: this.recommendations.supplements.filter(r => r.userId === userId),
      rest: this.recommendations.rest.filter(r => r.userId === userId)
    };
  }

  // Obter estatísticas de bem-estar
  public getWellnessStats(userId: string): {
    totalWorkouts: number;
    totalCaloriesBurned: number;
    averageWorkoutDuration: number;
    nutritionPlansCompleted: number;
    hydrationGoalMet: number;
    supplementAdherence: number;
    restQuality: number;
  } {
    const userWorkouts = this.workoutSessions.filter(w => w.userId === userId);
    const userPlans = this.nutritionPlans.filter(p => p.userId === userId);

    const totalWorkouts = userWorkouts.length;
    const totalCaloriesBurned = userWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
    const averageWorkoutDuration = totalWorkouts > 0 ? 
      userWorkouts.reduce((sum, w) => sum + w.duration, 0) / totalWorkouts : 0;

    const nutritionPlansCompleted = userPlans.filter(p => 
      p.meals.breakfast.isCompleted && 
      p.meals.lunch.isCompleted && 
      p.meals.dinner.isCompleted
    ).length;

    const hydrationGoalMet = userPlans.filter(p => 
      p.progress.hydrationConsumed >= p.dailyGoals.hydration * 0.8
    ).length;

    const supplementAdherence = userPlans.reduce((sum, p) => 
      sum + p.supplements.filter(s => s.isRecommended).length, 0
    );

    const restQuality = userPlans.reduce((sum, p) => 
      sum + (p.progress.recoveryQuality || 0), 0
    ) / Math.max(userPlans.length, 1);

    return {
      totalWorkouts,
      totalCaloriesBurned,
      averageWorkoutDuration: Math.round(averageWorkoutDuration * 10) / 10,
      nutritionPlansCompleted,
      hydrationGoalMet,
      supplementAdherence,
      restQuality: Math.round(restQuality * 10) / 10
    };
  }
}

export function createWellnessManager(): WellnessManager {
  return new WellnessManager();
}