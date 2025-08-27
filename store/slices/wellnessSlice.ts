import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interfaces
export interface NutritionPlan {
  id: string;
  userId: string;
  date: string;
  totalCalories: number;
  totalProtein: number; // gramas
  totalCarbs: number; // gramas
  totalFat: number; // gramas
  totalFiber: number; // gramas
  totalSugar: number; // gramas
  totalSodium: number; // mg
  meals: NutritionMeal[];
  hydration: HydrationPlan;
  supplements: SupplementRecommendation[];
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NutritionMeal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout';
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  ingredients: NutritionIngredient[];
  instructions: string[];
  prepTime: number; // minutos
  cookTime: number; // minutos
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  photo?: string;
  isCompleted: boolean;
  completedAt?: string;
  rating?: number; // 1-5
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
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  category: 'protein' | 'carb' | 'fat' | 'vegetable' | 'fruit' | 'dairy' | 'grain' | 'spice';
  isOrganic: boolean;
  allergens: string[];
}

export interface HydrationPlan {
  id: string;
  userId: string;
  date: string;
  targetIntake: number; // ml
  currentIntake: number; // ml
  reminders: HydrationReminder[];
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HydrationReminder {
  id: string;
  time: string; // HH:MM
  amount: number; // ml
  message: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface SupplementRecommendation {
  id: string;
  userId: string;
  name: string;
  category: 'vitamin' | 'mineral' | 'protein' | 'amino_acid' | 'herb' | 'other';
  dosage: string;
  frequency: 'daily' | 'twice_daily' | 'weekly' | 'as_needed';
  timing: 'morning' | 'afternoon' | 'evening' | 'with_meals' | 'empty_stomach';
  purpose: string;
  benefits: string[];
  sideEffects: string[];
  interactions: string[];
  isRecommended: boolean;
  isTaken: boolean;
  takenAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RestRecommendation {
  id: string;
  userId: string;
  type: 'sleep' | 'recovery' | 'active_rest' | 'meditation';
  duration: number; // minutos
  frequency: string;
  description: string;
  benefits: string[];
  tips: string[];
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WellnessStats {
  totalDays: number;
  averageCalories: number;
  averageProtein: number;
  averageCarbs: number;
  averageFat: number;
  averageHydration: number;
  mealCompletionRate: number;
  hydrationCompletionRate: number;
  supplementAdherence: number;
  restCompletionRate: number;
  weeklyProgress: Array<{
    week: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    hydration: number;
    mealsCompleted: number;
    supplementsTaken: number;
    restSessions: number;
  }>;
  monthlyProgress: Array<{
    month: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    hydration: number;
    mealsCompleted: number;
    supplementsTaken: number;
    restSessions: number;
  }>;
  personalBests: {
    calories: { value: number; date: string };
    protein: { value: number; date: string };
    hydration: { value: number; date: string };
    mealsCompleted: { value: number; date: string };
  };
}

interface WellnessState {
  currentPlan: NutritionPlan | null;
  nutritionHistory: NutritionPlan[];
  hydrationHistory: HydrationPlan[];
  supplementHistory: SupplementRecommendation[];
  restHistory: RestRecommendation[];
  stats: WellnessStats | null;
  isLoading: boolean;
  error: string | null;
  lastSync: string | null;
  pendingChanges: string[];
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
}

// Estado inicial
const initialState: WellnessState = {
  currentPlan: null,
  nutritionHistory: [],
  hydrationHistory: [],
  supplementHistory: [],
  restHistory: [],
  stats: null,
  isLoading: false,
  error: null,
  lastSync: null,
  pendingChanges: [],
  syncStatus: 'idle',
};

// Thunks assíncronos
export const generateNutritionPlan = createAsyncThunk(
  'wellness/generatePlan',
  async (userData: {
    age: number;
    gender: 'male' | 'female';
    weight: number; // kg
    height: number; // cm
    activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
    fitnessGoal: 'lose_weight' | 'maintain_weight' | 'gain_weight' | 'build_muscle';
    workoutIntensity: 'low' | 'medium' | 'high';
    dietaryRestrictions: string[];
    allergies: string[];
    preferences: string[];
  }, { rejectWithValue }) => {
    try {
      // Simular geração de plano nutricional
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Calcula necessidades calóricas baseadas no perfil
      const bmr = calculateBMR(userData.weight, userData.height, userData.age, userData.gender);
      const tdee = calculateTDEE(bmr, userData.activityLevel);
      const targetCalories = adjustCaloriesForGoal(tdee, userData.fitnessGoal, userData.workoutIntensity);
      
      // Calcula macronutrientes
      const protein = calculateProtein(userData.weight, userData.fitnessGoal);
      const fat = calculateFat(targetCalories);
      const carbs = calculateCarbs(targetCalories, protein, fat);
      
      // Gera plano nutricional
      const plan: NutritionPlan = {
        id: `plan_${Date.now()}`,
        userId: 'user_123',
        date: new Date().toISOString().split('T')[0],
        totalCalories: targetCalories,
        totalProtein: protein,
        totalCarbs: carbs,
        totalFat: fat,
        totalFiber: 25,
        totalSugar: 50,
        totalSodium: 2300,
        meals: generateMeals(targetCalories, protein, carbs, fat, userData),
        hydration: generateHydrationPlan(userData.weight, userData.activityLevel),
        supplements: generateSupplementRecommendations(userData),
        isCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return plan;
    } catch (error) {
      return rejectWithValue('Erro ao gerar plano nutricional');
    }
  }
);

export const completeMeal = createAsyncThunk(
  'wellness/completeMeal',
  async (mealId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { wellness: WellnessState };
      
      if (!state.wellness.currentPlan) {
        throw new Error('Nenhum plano ativo');
      }
      
      const updatedPlan = { ...state.wellness.currentPlan };
      const mealIndex = updatedPlan.meals.findIndex(meal => meal.id === mealId);
      
      if (mealIndex === -1) {
        throw new Error('Refeição não encontrada');
      }
      
      updatedPlan.meals[mealIndex].isCompleted = true;
      updatedPlan.meals[mealIndex].completedAt = new Date().toISOString();
      
      // Verifica se todas as refeições foram completadas
      const allMealsCompleted = updatedPlan.meals.every(meal => meal.isCompleted);
      if (allMealsCompleted) {
        updatedPlan.isCompleted = true;
        updatedPlan.completedAt = new Date().toISOString();
      }
      
      updatedPlan.updatedAt = new Date().toISOString();
      
      // Salva no AsyncStorage
      await AsyncStorage.setItem('currentWellnessPlan', JSON.stringify(updatedPlan));
      
      return updatedPlan;
    } catch (error) {
      return rejectWithValue('Erro ao completar refeição');
    }
  }
);

export const updateHydrationIntake = createAsyncThunk(
  'wellness/updateHydration',
  async (amount: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { wellness: WellnessState };
      
      if (!state.wellness.currentPlan?.hydration) {
        throw new Error('Plano de hidratação não encontrado');
      }
      
      const updatedHydration = {
        ...state.wellness.currentPlan.hydration,
        currentIntake: state.wellness.currentPlan.hydration.currentIntake + amount,
        updatedAt: new Date().toISOString(),
      };
      
      // Verifica se a meta foi atingida
      if (updatedHydration.currentIntake >= updatedHydration.targetIntake) {
        updatedHydration.isCompleted = true;
        updatedHydration.completedAt = new Date().toISOString();
      }
      
      // Atualiza o plano atual
      const updatedPlan = {
        ...state.wellness.currentPlan,
        hydration: updatedHydration,
        updatedAt: new Date().toISOString(),
      };
      
      // Salva no AsyncStorage
      await AsyncStorage.setItem('currentWellnessPlan', JSON.stringify(updatedPlan));
      
      return { updatedPlan, updatedHydration };
    } catch (error) {
      return rejectWithValue('Erro ao atualizar hidratação');
    }
  }
);

export const takeSupplement = createAsyncThunk(
  'wellness/takeSupplement',
  async (supplementId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { wellness: WellnessState };
      
      if (!state.wellness.currentPlan) {
        throw new Error('Nenhum plano ativo');
      }
      
      const updatedPlan = { ...state.wellness.currentPlan };
      const supplementIndex = updatedPlan.supplements.findIndex(s => s.id === supplementId);
      
      if (supplementIndex === -1) {
        throw new Error('Suplemento não encontrado');
      }
      
      updatedPlan.supplements[supplementIndex].isTaken = true;
      updatedPlan.supplements[supplementIndex].takenAt = new Date().toISOString();
      updatedPlan.updatedAt = new Date().toISOString();
      
      // Salva no AsyncStorage
      await AsyncStorage.setItem('currentWellnessPlan', JSON.stringify(updatedPlan));
      
      return updatedPlan;
    } catch (error) {
      return rejectWithValue('Erro ao registrar suplemento');
    }
  }
);

export const completeRestSession = createAsyncThunk(
  'wellness/completeRest',
  async (restId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { wellness: WellnessState };
      
      if (!state.wellness.currentPlan) {
        throw new Error('Nenhum plano ativo');
      }
      
      const updatedPlan = { ...state.wellness.currentPlan };
      const restIndex = updatedPlan.supplements.findIndex(r => r.id === restId);
      
      if (restIndex === -1) {
        throw new Error('Sessão de descanso não encontrada');
      }
      
      updatedPlan.supplements[restIndex].isCompleted = true;
      updatedPlan.supplements[restIndex].completedAt = new Date().toISOString();
      updatedPlan.updatedAt = new Date().toISOString();
      
      // Salva no AsyncStorage
      await AsyncStorage.setItem('currentWellnessPlan', JSON.stringify(updatedPlan));
      
      return updatedPlan;
    } catch (error) {
      return rejectWithValue('Erro ao completar sessão de descanso');
    }
  }
);

export const fetchWellnessHistory = createAsyncThunk(
  'wellness/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados mockados para demonstração
      const mockHistory: NutritionPlan[] = [
        {
          id: 'plan_1',
          userId: 'user_123',
          date: '2024-01-15',
          totalCalories: 2200,
          totalProtein: 150,
          totalCarbs: 250,
          totalFat: 70,
          totalFiber: 25,
          totalSugar: 45,
          totalSodium: 2100,
          meals: [],
          hydration: {
            id: 'hydration_1',
            userId: 'user_123',
            date: '2024-01-15',
            targetIntake: 2500,
            currentIntake: 2500,
            reminders: [],
            isCompleted: true,
            completedAt: '2024-01-15T20:00:00Z',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T20:00:00Z',
          },
          supplements: [],
          isCompleted: true,
          completedAt: '2024-01-15T21:00:00Z',
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-01-15T21:00:00Z',
        },
      ];
      
      return mockHistory;
    } catch (error) {
      return rejectWithValue('Erro ao carregar histórico');
    }
  }
);

// Funções utilitárias para cálculos nutricionais
function calculateBMR(weight: number, height: number, age: number, gender: 'male' | 'female'): number {
  // Fórmula de Mifflin-St Jeor
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

function calculateTDEE(bmr: number, activityLevel: string): number {
  const multipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9,
  };
  
  return bmr * multipliers[activityLevel as keyof typeof multipliers];
}

function adjustCaloriesForGoal(tdee: number, goal: string, intensity: string): number {
  let adjustment = 0;
  
  switch (goal) {
    case 'lose_weight':
      adjustment = -500;
      break;
    case 'gain_weight':
      adjustment = 300;
      break;
    case 'build_muscle':
      adjustment = 200;
      break;
    default:
      adjustment = 0;
  }
  
  // Ajusta baseado na intensidade do treino
  switch (intensity) {
    case 'high':
      adjustment += 200;
      break;
    case 'medium':
      adjustment += 100;
      break;
    case 'low':
      adjustment -= 100;
      break;
  }
  
  return Math.max(tdee + adjustment, 1200); // Mínimo de 1200 calorias
}

function calculateProtein(weight: number, goal: string): number {
  let proteinPerKg = 1.6; // Padrão
  
  switch (goal) {
    case 'build_muscle':
      proteinPerKg = 2.0;
      break;
    case 'lose_weight':
      proteinPerKg = 2.2;
      break;
    case 'maintain_weight':
      proteinPerKg = 1.8;
      break;
  }
  
  return Math.round(weight * proteinPerKg);
}

function calculateFat(calories: number): number {
  // 25% das calorias de gordura
  return Math.round((calories * 0.25) / 9);
}

function calculateCarbs(calories: number, protein: number, fat: number): number {
  // Restante das calorias de carboidratos
  const proteinCalories = protein * 4;
  const fatCalories = fat * 9;
  const carbCalories = calories - proteinCalories - fatCalories;
  
  return Math.max(Math.round(carbCalories / 4), 50); // Mínimo de 50g
}

function generateMeals(calories: number, protein: number, carbs: number, fat: number, userData: any): NutritionMeal[] {
  // Gera refeições baseadas nas necessidades nutricionais
  const meals: NutritionMeal[] = [];
  
  // Distribui calorias entre as refeições
  const mealDistribution = {
    breakfast: 0.25,
    lunch: 0.3,
    dinner: 0.3,
    snack: 0.15,
  };
  
  Object.entries(mealDistribution).forEach(([mealType, percentage]) => {
    const mealCalories = Math.round(calories * percentage);
    const mealProtein = Math.round(protein * percentage);
    const mealCarbs = Math.round(carbs * percentage);
    const mealFat = Math.round(fat * percentage);
    
    meals.push({
      id: `${mealType}_${Date.now()}`,
      type: mealType as any,
      name: `Refeição ${mealType}`,
      description: `Plano personalizado para ${mealType}`,
      calories: mealCalories,
      protein: mealProtein,
      carbs: mealCarbs,
      fat: mealFat,
      fiber: Math.round(25 * percentage),
      sugar: Math.round(50 * percentage),
      sodium: Math.round(2300 * percentage),
      ingredients: [],
      instructions: [],
      prepTime: 15,
      cookTime: 20,
      servings: 1,
      difficulty: 'medium',
      tags: [mealType, 'healthy', 'balanced'],
      isCompleted: false,
    });
  });
  
  return meals;
}

function generateHydrationPlan(weight: number, activityLevel: string): HydrationPlan {
  // 35ml por kg de peso corporal + ajuste por atividade
  let baseHydration = weight * 35;
  
  switch (activityLevel) {
    case 'lightly_active':
      baseHydration += 500;
      break;
    case 'moderately_active':
      baseHydration += 1000;
      break;
    case 'very_active':
      baseHydration += 1500;
      break;
    case 'extremely_active':
      baseHydration += 2000;
      break;
  }
  
  return {
    id: `hydration_${Date.now()}`,
    userId: 'user_123',
    date: new Date().toISOString().split('T')[0],
    targetIntake: Math.round(baseHydration),
    currentIntake: 0,
    reminders: generateHydrationReminders(),
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function generateHydrationReminders(): HydrationReminder[] {
  const reminders: HydrationReminder[] = [];
  const times = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
  
  times.forEach((time, index) => {
    reminders.push({
      id: `reminder_${index}`,
      time,
      amount: 300,
      message: `Hora de se hidratar! Beba 300ml de água.`,
      isCompleted: false,
    });
  });
  
  return reminders;
}

function generateSupplementRecommendations(userData: any): SupplementRecommendation[] {
  const supplements: SupplementRecommendation[] = [];
  
  // Suplementos básicos recomendados para todos
  supplements.push({
    id: 'supp_1',
    userId: 'user_123',
    name: 'Multivitamínico',
    category: 'vitamin',
    dosage: '1 cápsula',
    frequency: 'daily',
    timing: 'morning',
    purpose: 'Suplementação de vitaminas e minerais essenciais',
    benefits: ['Suporte imunológico', 'Energia', 'Saúde geral'],
    sideEffects: ['Pode causar náusea em estômago vazio'],
    interactions: ['Consulte médico se estiver tomando outros medicamentos'],
    isRecommended: true,
    isTaken: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  
  // Suplementos específicos baseados no gênero
  if (userData.gender === 'female') {
    supplements.push({
      id: 'supp_2',
      userId: 'user_123',
      name: 'Ferro',
      category: 'mineral',
      dosage: '18mg',
      frequency: 'daily',
      timing: 'with_meals',
      purpose: 'Prevenção de anemia, especialmente importante para mulheres',
      benefits: ['Previne anemia', 'Energia', 'Saúde do sangue'],
      sideEffects: ['Pode causar constipação'],
      interactions: ['Não tomar com café ou chá'],
      isRecommended: true,
      isTaken: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  
  // Suplementos baseados no objetivo
  if (userData.fitnessGoal === 'build_muscle') {
    supplements.push({
      id: 'supp_3',
      userId: 'user_123',
      name: 'Whey Protein',
      category: 'protein',
      dosage: '30g',
      frequency: 'daily',
      timing: 'post_workout',
      purpose: 'Suporte para construção muscular e recuperação',
      benefits: ['Construção muscular', 'Recuperação', 'Saciedade'],
      sideEffects: ['Pode causar gases em pessoas sensíveis'],
      interactions: ['Pode ser tomado com outros suplementos'],
      isRecommended: true,
      isTaken: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  
  return supplements;
}

// Slice
const wellnessSlice = createSlice({
  name: 'wellness',
  initialState,
  reducers: {
    // Ações síncronas
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    setCurrentPlan: (state, action: PayloadAction<NutritionPlan>) => {
      state.currentPlan = action.payload;
    },
    
    clearCurrentPlan: (state) => {
      state.currentPlan = null;
    },
    
    addPendingChange: (state, action: PayloadAction<string>) => {
      if (!state.pendingChanges.includes(action.payload)) {
        state.pendingChanges.push(action.payload);
      }
    },
    
    removePendingChange: (state, action: PayloadAction<string>) => {
      state.pendingChanges = state.pendingChanges.filter(
        change => change !== action.payload
      );
    },
    
    clearPendingChanges: (state) => {
      state.pendingChanges = [];
    },
    
    // Ações para refeições
    updateMealRating: (state, action: PayloadAction<{ mealId: string; rating: number; notes?: string }>) => {
      if (state.currentPlan) {
        const mealIndex = state.currentPlan.meals.findIndex(meal => meal.id === action.payload.mealId);
        if (mealIndex >= 0) {
          state.currentPlan.meals[mealIndex].rating = action.payload.rating;
          state.currentPlan.meals[mealIndex].notes = action.payload.notes;
          state.currentPlan.updatedAt = new Date().toISOString();
        }
      }
    },
    
    // Ações para hidratação
    updateHydrationReminder: (state, action: PayloadAction<{ reminderId: string; isCompleted: boolean }>) => {
      if (state.currentPlan?.hydration) {
        const reminderIndex = state.currentPlan.hydration.reminders.findIndex(
          r => r.id === action.payload.reminderId
        );
        if (reminderIndex >= 0) {
          state.currentPlan.hydration.reminders[reminderIndex].isCompleted = action.payload.isCompleted;
          if (action.payload.isCompleted) {
            state.currentPlan.hydration.reminders[reminderIndex].completedAt = new Date().toISOString();
          }
          state.currentPlan.updatedAt = new Date().toISOString();
        }
      }
    },
    
    // Ações para suplementos
    updateSupplementNotes: (state, action: PayloadAction<{ supplementId: string; notes: string }>) => {
      if (state.currentPlan) {
        const supplementIndex = state.currentPlan.supplements.findIndex(
          s => s.id === action.payload.supplementId
        );
        if (supplementIndex >= 0) {
          state.currentPlan.supplements[supplementIndex].notes = action.payload.notes;
          state.currentPlan.updatedAt = new Date().toISOString();
        }
      }
    },
    
    // Ações para estatísticas
    updateWellnessStats: (state, action: PayloadAction<Partial<WellnessStats>>) => {
      if (state.stats) {
        state.stats = { ...state.stats, ...action.payload };
      }
    },
    
    // Limpeza de dados antigos
    cleanupOldData: (state, action: PayloadAction<{ maxAge: number }>) => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - action.payload.maxAge);
      
      state.nutritionHistory = state.nutritionHistory.filter(plan => 
        new Date(plan.createdAt) > cutoffDate
      );
      
      state.hydrationHistory = state.hydrationHistory.filter(plan => 
        new Date(plan.createdAt) > cutoffDate
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // generateNutritionPlan
      .addCase(generateNutritionPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateNutritionPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPlan = action.payload;
        state.error = null;
      })
      .addCase(generateNutritionPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // completeMeal
      .addCase(completeMeal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeMeal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPlan = action.payload;
        state.error = null;
      })
      .addCase(completeMeal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // updateHydrationIntake
      .addCase(updateHydrationIntake.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateHydrationIntake.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPlan = action.payload.updatedPlan;
        state.error = null;
      })
      .addCase(updateHydrationIntake.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // takeSupplement
      .addCase(takeSupplement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(takeSupplement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPlan = action.payload;
        state.error = null;
      })
      .addCase(takeSupplement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // completeRestSession
      .addCase(completeRestSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeRestSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPlan = action.payload;
        state.error = null;
      })
      .addCase(completeRestSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // fetchWellnessHistory
      .addCase(fetchWellnessHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWellnessHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.nutritionHistory = action.payload;
        state.error = null;
      })
      .addCase(fetchWellnessHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Exporta actions e reducer
export const {
  setLoading,
  setError,
  setCurrentPlan,
  clearCurrentPlan,
  addPendingChange,
  removePendingChange,
  clearPendingChanges,
  updateMealRating,
  updateHydrationReminder,
  updateSupplementNotes,
  updateWellnessStats,
  cleanupOldData,
} = wellnessSlice.actions;

export default wellnessSlice.reducer;