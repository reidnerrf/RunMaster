import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interfaces
export interface WorkoutSession {
  id: string;
  userId: string;
  type: 'running' | 'walking' | 'cycling' | 'swimming' | 'training';
  status: 'planned' | 'active' | 'paused' | 'completed' | 'cancelled';
  startTime: string;
  endTime?: string;
  duration: number; // segundos
  distance: number; // metros
  calories: number;
  pace: string; // min/km
  speed: number; // km/h
  elevation: {
    gain: number;
    loss: number;
    current: number;
  };
  heartRate: {
    current: number;
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
  route: {
    coordinates: Array<{
      latitude: number;
      longitude: number;
      altitude: number;
      timestamp: string;
      accuracy: number;
    }>;
    waypoints: Array<{
      id: string;
      type: 'start' | 'end' | 'checkpoint' | 'water' | 'restroom';
      coordinates: {
        latitude: number;
        longitude: number;
        altitude: number;
      };
      name?: string;
      description?: string;
    }>;
    segments: Array<{
      id: string;
      startIndex: number;
      endIndex: number;
      distance: number;
      duration: number;
      pace: string;
      elevation: number;
    }>;
  };
  metrics: {
    cadence: number; // passos/min
    strideLength: number; // metros
    groundContactTime: number; // ms
    verticalOscillation: number; // cm
    pronation: 'neutral' | 'over' | 'under';
    symmetry: number; // 0-100%
    impactForce: number; // N
    runningEfficiency: number; // 0-100%
    fatigueIndex: number; // 0-100%
  };
  weather: {
    temperature: number; // Celsius
    humidity: number; // %
    pressure: number; // hPa
    windSpeed: number; // km/h
    windDirection: number; // graus
    conditions: string;
    feelsLike: number; // Celsius
  };
  notes?: string;
  tags: string[];
  photos: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  description: string;
  type: 'beginner' | 'intermediate' | 'advanced' | 'custom';
  goal: '5k' | '10k' | 'half_marathon' | 'marathon' | 'ultra' | 'general_fitness';
  duration: number; // semanas
  difficulty: 1 | 2 | 3 | 4 | 5;
  workouts: Array<{
    id: string;
    week: number;
    day: number;
    type: 'easy' | 'tempo' | 'long' | 'speed' | 'recovery' | 'rest';
    distance?: number; // km
    duration?: number; // minutos
    pace?: string; // min/km
    description: string;
    tips: string[];
    isCompleted: boolean;
    completedAt?: string;
  }>;
  startDate: string;
  endDate: string;
  isActive: boolean;
  progress: number; // 0-100%
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutGoal {
  id: string;
  userId: string;
  type: 'distance' | 'time' | 'frequency' | 'streak' | 'race';
  target: number;
  current: number;
  unit: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  isCompleted: boolean;
  completedAt?: string;
  progress: number; // 0-100%
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalDistance: number; // km
  totalTime: number; // minutos
  totalCalories: number;
  averagePace: string; // min/km
  averageDistance: number; // km
  averageDuration: number; // minutos
  longestWorkout: {
    distance: number;
    duration: number;
    date: string;
    workoutId: string;
  };
  fastestPace: {
    pace: string;
    date: string;
    workoutId: string;
  };
  weeklyProgress: Array<{
    week: string;
    workouts: number;
    distance: number;
    time: number;
    calories: number;
  }>;
  monthlyProgress: Array<{
    month: string;
    workouts: number;
    distance: number;
    time: number;
    calories: number;
  }>;
  yearlyProgress: Array<{
    year: string;
    workouts: number;
    distance: number;
    time: number;
    calories: number;
  }>;
  personalBests: {
    distance: {
      value: number;
      date: string;
      workoutId: string;
    };
    time: {
      value: number;
      date: string;
      workoutId: string;
    };
    pace: {
      value: string;
      date: string;
      workoutId: string;
    };
    calories: {
      value: number;
      date: string;
      workoutId: string;
    };
  };
  streaks: {
    current: number; // dias
    longest: number; // dias
    lastWorkout: string;
  };
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt: string;
    progress: number; // 0-100%
  }>;
}

interface WorkoutState {
  currentSession: WorkoutSession | null;
  history: WorkoutSession[];
  plans: WorkoutPlan[];
  goals: WorkoutGoal[];
  stats: WorkoutStats | null;
  isLoading: boolean;
  error: string | null;
  isRecording: boolean;
  recordingStartTime: string | null;
  lastLocation: {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: string;
  } | null;
  pendingWorkouts: string[];
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
}

// Estado inicial
const initialState: WorkoutState = {
  currentSession: null,
  history: [],
  plans: [],
  goals: [],
  stats: null,
  isLoading: false,
  error: null,
  isRecording: false,
  recordingStartTime: null,
  lastLocation: null,
  pendingWorkouts: [],
  syncStatus: 'idle',
};

// Thunks assíncronos
export const startWorkout = createAsyncThunk(
  'workout/start',
  async (workoutData: Partial<WorkoutSession>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { workout: WorkoutState };
      
      if (state.workout.isRecording) {
        throw new Error('Já existe uma sessão ativa');
      }

      const newSession: WorkoutSession = {
        id: `workout_${Date.now()}`,
        userId: 'user_123', // Mock user ID
        type: workoutData.type || 'running',
        status: 'active',
        startTime: new Date().toISOString(),
        duration: 0,
        distance: 0,
        calories: 0,
        pace: '0:00',
        speed: 0,
        elevation: {
          gain: 0,
          loss: 0,
          current: 0,
        },
        heartRate: {
          current: 0,
          average: 0,
          max: 0,
          zones: {
            zone1: 0,
            zone2: 0,
            zone3: 0,
            zone4: 0,
            zone5: 0,
          },
        },
        route: {
          coordinates: [],
          waypoints: [],
          segments: [],
        },
        metrics: {
          cadence: 0,
          strideLength: 0,
          groundContactTime: 0,
          verticalOscillation: 0,
          pronation: 'neutral',
          symmetry: 100,
          impactForce: 0,
          runningEfficiency: 100,
          fatigueIndex: 0,
        },
        weather: {
          temperature: 20,
          humidity: 60,
          pressure: 1013,
          windSpeed: 0,
          windDirection: 0,
          conditions: 'clear',
          feelsLike: 20,
        },
        notes: workoutData.notes || '',
        tags: workoutData.tags || [],
        photos: workoutData.photos || [],
        isPublic: workoutData.isPublic || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Salva no AsyncStorage
      await AsyncStorage.setItem('currentWorkout', JSON.stringify(newSession));
      
      return newSession;
    } catch (error) {
      return rejectWithValue('Erro ao iniciar workout');
    }
  }
);

export const pauseWorkout = createAsyncThunk(
  'workout/pause',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { workout: WorkoutState };
      
      if (!state.workout.currentSession || state.workout.currentSession.status !== 'active') {
        throw new Error('Nenhuma sessão ativa para pausar');
      }

      const updatedSession = {
        ...state.workout.currentSession,
        status: 'paused' as const,
        updatedAt: new Date().toISOString(),
      };

      // Salva no AsyncStorage
      await AsyncStorage.setItem('currentWorkout', JSON.stringify(updatedSession));
      
      return updatedSession;
    } catch (error) {
      return rejectWithValue('Erro ao pausar workout');
    }
  }
);

export const resumeWorkout = createAsyncThunk(
  'workout/resume',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { workout: WorkoutState };
      
      if (!state.workout.currentSession || state.workout.currentSession.status !== 'paused') {
        throw new Error('Nenhuma sessão pausada para retomar');
      }

      const updatedSession = {
        ...state.workout.currentSession,
        status: 'active' as const,
        updatedAt: new Date().toISOString(),
      };

      // Salva no AsyncStorage
      await AsyncStorage.setItem('currentWorkout', JSON.stringify(updatedSession));
      
      return updatedSession;
    } catch (error) {
      return rejectWithValue('Erro ao retomar workout');
    }
  }
);

export const endWorkout = createAsyncThunk(
  'workout/end',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { workout: WorkoutState };
      
      if (!state.workout.currentSession) {
        throw new Error('Nenhuma sessão ativa para finalizar');
      }

      const endTime = new Date().toISOString();
      const startTime = new Date(state.workout.currentSession.startTime);
      const duration = Math.floor((new Date(endTime).getTime() - startTime.getTime()) / 1000);

      const completedSession: WorkoutSession = {
        ...state.workout.currentSession,
        status: 'completed',
        endTime,
        duration,
        updatedAt: endTime,
      };

      // Adiciona ao histórico
      const updatedHistory = [completedSession, ...state.workout.history];
      
      // Salva no AsyncStorage
      await AsyncStorage.setItem('workoutHistory', JSON.stringify(updatedHistory));
      await AsyncStorage.removeItem('currentWorkout');
      
      return { completedSession, updatedHistory };
    } catch (error) {
      return rejectWithValue('Erro ao finalizar workout');
    }
  }
);

export const updateWorkoutMetrics = createAsyncThunk(
  'workout/updateMetrics',
  async (metrics: Partial<WorkoutSession['metrics']>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { workout: WorkoutState };
      
      if (!state.workout.currentSession) {
        throw new Error('Nenhuma sessão ativa');
      }

      const updatedSession = {
        ...state.workout.currentSession,
        metrics: {
          ...state.workout.currentSession.metrics,
          ...metrics,
        },
        updatedAt: new Date().toISOString(),
      };

      // Salva no AsyncStorage
      await AsyncStorage.setItem('currentWorkout', JSON.stringify(updatedSession));
      
      return updatedSession;
    } catch (error) {
      return rejectWithValue('Erro ao atualizar métricas');
    }
  }
);

export const addWorkoutLocation = createAsyncThunk(
  'workout/addLocation',
  async (location: {
    latitude: number;
    longitude: number;
    altitude: number;
    accuracy: number;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { workout: WorkoutState };
      
      if (!state.workout.currentSession) {
        throw new Error('Nenhuma sessão ativa');
      }

      const newCoordinate = {
        ...location,
        timestamp: new Date().toISOString(),
      };

      const updatedSession = {
        ...state.workout.currentSession,
        route: {
          ...state.workout.currentSession.route,
          coordinates: [...state.workout.currentSession.route.coordinates, newCoordinate],
        },
        updatedAt: new Date().toISOString(),
      };

      // Calcula nova distância
      if (updatedSession.route.coordinates.length > 1) {
        const lastCoordinate = updatedSession.route.coordinates[updatedSession.route.coordinates.length - 2];
        const distance = calculateDistance(
          lastCoordinate.latitude,
          lastCoordinate.longitude,
          location.latitude,
          location.longitude
        );
        updatedSession.distance += distance;
      }

      // Atualiza pace
      if (updatedSession.distance > 0 && updatedSession.duration > 0) {
        const paceInSeconds = (updatedSession.duration / 60) / (updatedSession.distance / 1000);
        const minutes = Math.floor(paceInSeconds);
        const seconds = Math.floor((paceInSeconds - minutes) * 60);
        updatedSession.pace = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }

      // Salva no AsyncStorage
      await AsyncStorage.setItem('currentWorkout', JSON.stringify(updatedSession));
      
      return updatedSession;
    } catch (error) {
      return rejectWithValue('Erro ao adicionar localização');
    }
  }
);

export const fetchWorkoutHistory = createAsyncThunk(
  'workout/fetchHistory',
  async (_, { rejectWithValue }) => {
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados mockados para demonstração
      const mockHistory: WorkoutSession[] = [
        {
          id: 'workout_1',
          userId: 'user_123',
          type: 'running',
          status: 'completed',
          startTime: '2024-01-15T06:00:00Z',
          endTime: '2024-01-15T07:30:00Z',
          duration: 5400,
          distance: 10000,
          calories: 800,
          pace: '5:30',
          speed: 10.9,
          elevation: { gain: 150, loss: 150, current: 0 },
          heartRate: {
            current: 0,
            average: 145,
            max: 175,
            zones: { zone1: 0, zone2: 0, zone3: 0, zone4: 0, zone5: 0 },
          },
          route: { coordinates: [], waypoints: [], segments: [] },
          metrics: {
            cadence: 175,
            strideLength: 1.2,
            groundContactTime: 220,
            verticalOscillation: 8.5,
            pronation: 'neutral',
            symmetry: 95,
            impactForce: 850,
            runningEfficiency: 85,
            fatigueIndex: 15,
          },
          weather: {
            temperature: 18,
            humidity: 65,
            pressure: 1013,
            windSpeed: 5,
            windDirection: 180,
            conditions: 'clear',
            feelsLike: 18,
          },
          notes: 'Corrida matinal no parque',
          tags: ['morning', 'park', 'easy'],
          photos: [],
          isPublic: true,
          createdAt: '2024-01-15T06:00:00Z',
          updatedAt: '2024-01-15T07:30:00Z',
        },
      ];

      return mockHistory;
    } catch (error) {
      return rejectWithValue('Erro ao carregar histórico');
    }
  }
);

// Função utilitária para calcular distância
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Raio da Terra em metros
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Slice
const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    // Ações síncronas
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    setRecording: (state, action: PayloadAction<boolean>) => {
      state.isRecording = action.payload;
      if (action.payload) {
        state.recordingStartTime = new Date().toISOString();
      } else {
        state.recordingStartTime = null;
      }
    },
    
    updateLastLocation: (state, action: PayloadAction<{
      latitude: number;
      longitude: number;
      accuracy: number;
    }>) => {
      state.lastLocation = {
        ...action.payload,
        timestamp: new Date().toISOString(),
      };
    },
    
    updateCurrentSession: (state, action: PayloadAction<Partial<WorkoutSession>>) => {
      if (state.currentSession) {
        state.currentSession = {
          ...state.currentSession,
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    addPendingWorkout: (state, action: PayloadAction<string>) => {
      if (!state.pendingWorkouts.includes(action.payload)) {
        state.pendingWorkouts.push(action.payload);
      }
    },
    
    removePendingWorkout: (state, action: PayloadAction<string>) => {
      state.pendingWorkouts = state.pendingWorkouts.filter(
        id => id !== action.payload
      );
    },
    
    clearPendingWorkouts: (state) => {
      state.pendingWorkouts = [];
    },
    
    // Ações para métricas em tempo real
    updateHeartRate: (state, action: PayloadAction<number>) => {
      if (state.currentSession) {
        state.currentSession.heartRate.current = action.payload;
        
        // Atualiza máximo se necessário
        if (action.payload > state.currentSession.heartRate.max) {
          state.currentSession.heartRate.max = action.payload;
        }
        
        // Atualiza zonas
        const maxHR = 220 - 30; // Fórmula simplificada
        const percentage = (action.payload / maxHR) * 100;
        
        if (percentage <= 60) state.currentSession.heartRate.zones.zone1++;
        else if (percentage <= 70) state.currentSession.heartRate.zones.zone2++;
        else if (percentage <= 80) state.currentSession.heartRate.zones.zone3++;
        else if (percentage <= 90) state.currentSession.heartRate.zones.zone4++;
        else state.currentSession.heartRate.zones.zone5++;
        
        state.currentSession.updatedAt = new Date().toISOString();
      }
    },
    
    updateCadence: (state, action: PayloadAction<number>) => {
      if (state.currentSession) {
        state.currentSession.metrics.cadence = action.payload;
        state.currentSession.updatedAt = new Date().toISOString();
      }
    },
    
    updateStrideLength: (state, action: PayloadAction<number>) => {
      if (state.currentSession) {
        state.currentSession.metrics.strideLength = action.payload;
        state.currentSession.updatedAt = new Date().toISOString();
      }
    },
    
    // Ações para planos de treino
    addWorkoutPlan: (state, action: PayloadAction<WorkoutPlan>) => {
      state.plans.push(action.payload);
    },
    
    updateWorkoutPlan: (state, action: PayloadAction<{ id: string; updates: Partial<WorkoutPlan> }>) => {
      const index = state.plans.findIndex(plan => plan.id === action.payload.id);
      if (index >= 0) {
        state.plans[index] = {
          ...state.plans[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    removeWorkoutPlan: (state, action: PayloadAction<string>) => {
      state.plans = state.plans.filter(plan => plan.id !== action.payload);
    },
    
    // Ações para metas
    addWorkoutGoal: (state, action: PayloadAction<WorkoutGoal>) => {
      state.goals.push(action.payload);
    },
    
    updateWorkoutGoal: (state, action: PayloadAction<{ id: string; updates: Partial<WorkoutGoal> }>) => {
      const index = state.goals.findIndex(goal => goal.id === action.payload.id);
      if (index >= 0) {
        state.goals[index] = {
          ...state.goals[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    removeWorkoutGoal: (state, action: PayloadAction<string>) => {
      state.goals = state.goals.filter(goal => goal.id !== action.payload);
    },
    
    // Ações para estatísticas
    updateWorkoutStats: (state, action: PayloadAction<Partial<WorkoutStats>>) => {
      if (state.stats) {
        state.stats = { ...state.stats, ...action.payload };
      }
    },
    
    // Limpeza de dados antigos
    cleanupOldWorkouts: (state, action: PayloadAction<{ maxAge: number }>) => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - action.payload.maxAge);
      
      state.history = state.history.filter(workout => 
        new Date(workout.createdAt) > cutoffDate
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // startWorkout
      .addCase(startWorkout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startWorkout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSession = action.payload;
        state.isRecording = true;
        state.recordingStartTime = new Date().toISOString();
        state.error = null;
      })
      .addCase(startWorkout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // pauseWorkout
      .addCase(pauseWorkout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(pauseWorkout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSession = action.payload;
        state.error = null;
      })
      .addCase(pauseWorkout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // resumeWorkout
      .addCase(resumeWorkout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resumeWorkout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSession = action.payload;
        state.error = null;
      })
      .addCase(resumeWorkout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // endWorkout
      .addCase(endWorkout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(endWorkout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSession = null;
        state.isRecording = false;
        state.recordingStartTime = null;
        state.history = action.payload.updatedHistory;
        state.error = null;
        
        // Adiciona à lista de pendentes para sincronização
        state.pendingWorkouts.push(action.payload.completedSession.id);
      })
      .addCase(endWorkout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // updateWorkoutMetrics
      .addCase(updateWorkoutMetrics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateWorkoutMetrics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSession = action.payload;
        state.error = null;
      })
      .addCase(updateWorkoutMetrics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // addWorkoutLocation
      .addCase(addWorkoutLocation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addWorkoutLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSession = action.payload;
        state.error = null;
      })
      .addCase(addWorkoutLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // fetchWorkoutHistory
      .addCase(fetchWorkoutHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWorkoutHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.history = action.payload;
        state.error = null;
      })
      .addCase(fetchWorkoutHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Exporta actions e reducer
export const {
  setLoading,
  setError,
  setRecording,
  updateLastLocation,
  updateCurrentSession,
  addPendingWorkout,
  removePendingWorkout,
  clearPendingWorkouts,
  updateHeartRate,
  updateCadence,
  updateStrideLength,
  addWorkoutPlan,
  updateWorkoutPlan,
  removeWorkoutPlan,
  addWorkoutGoal,
  updateWorkoutGoal,
  removeWorkoutGoal,
  updateWorkoutStats,
  cleanupOldWorkouts,
} = workoutSlice.actions;

export default workoutSlice.reducer;