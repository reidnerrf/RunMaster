import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { track } from '@/utils/analyticsClient';

// Interfaces
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  phone?: string;
  location?: {
    city: string;
    state: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  preferences: {
    language: string;
    units: 'metric' | 'imperial';
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacy: {
      profileVisibility: 'public' | 'friends' | 'private';
      activityVisibility: 'public' | 'friends' | 'private';
      locationSharing: boolean;
      dataAnalytics: boolean;
    };
    accessibility: {
      reducedMotion: boolean;
      highContrast: boolean;
      largeText: boolean;
      screenReader: boolean;
    };
  };
  fitnessProfile: {
    height: number; // cm
    weight: number; // kg
    bodyFatPercentage?: number;
    muscleMass?: number;
    fitnessLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    goals: string[];
    injuries: string[];
    medicalConditions: string[];
    medications: string[];
    emergencyContact?: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  trainingProfile: {
    experience: number; // anos
    preferredTerrain: 'road' | 'trail' | 'track' | 'mixed';
    preferredTime: 'morning' | 'afternoon' | 'evening' | 'night';
    preferredWeather: 'any' | 'sunny' | 'cloudy' | 'rainy' | 'snowy';
    weeklyGoal: number; // km
    targetRaces: string[];
    coachId?: string;
    teamId?: string;
  };
  socialProfile: {
    followers: string[];
    following: string[];
    friends: string[];
    communities: string[];
    achievements: string[];
    badges: string[];
    totalRuns: number;
    totalDistance: number; // km
    totalTime: number; // minutos
    totalCalories: number;
    longestRun: number; // km
    fastestPace: string; // min/km
    currentStreak: number; // dias
    longestStreak: number; // dias
  };
  subscription: {
    plan: 'free' | 'basic' | 'premium' | 'elite';
    startDate: string;
    endDate?: string;
    autoRenew: boolean;
    paymentMethod?: string;
    features: string[];
  };
  createdAt: string;
  updatedAt: string;
  lastActive: string;
  isVerified: boolean;
  isActive: boolean;
}

export interface UserStats {
  totalRuns: number;
  totalDistance: number;
  totalTime: number;
  totalCalories: number;
  averagePace: string;
  averageDistance: number;
  averageDuration: number;
  weeklyProgress: {
    week: string;
    distance: number;
    time: number;
    calories: number;
  }[];
  monthlyProgress: {
    month: string;
    distance: number;
    time: number;
    calories: number;
  }[];
  yearlyProgress: {
    year: string;
    distance: number;
    time: number;
    calories: number;
  }[];
  personalBests: {
    distance: {
      value: number;
      date: string;
      runId: string;
    };
    time: {
      value: number;
      date: string;
      runId: string;
    };
    pace: {
      value: string;
      date: string;
      runId: string;
    };
    calories: {
      value: number;
      date: string;
      runId: string;
    };
  };
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  units: 'metric' | 'imperial';
  timezone: string;
  notifications: {
    workouts: boolean;
    achievements: boolean;
    social: boolean;
    challenges: boolean;
    reminders: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    activityVisibility: 'public' | 'friends' | 'private';
    locationSharing: boolean;
    dataAnalytics: boolean;
    thirdPartySharing: boolean;
  };
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
    hapticFeedback: boolean;
    voiceCommands: boolean;
  };
  performance: {
    autoPause: boolean;
    gpsAccuracy: 'high' | 'medium' | 'low';
    batteryOptimization: boolean;
    dataSync: 'wifi' | 'always' | 'manual';
  };
}

interface UserState {
  profile: UserProfile | null;
  stats: UserStats | null;
  settings: UserSettings | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  authToken: string | null;
  refreshToken: string | null;
  lastSync: string | null;
  pendingChanges: string[];
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
}

// Estado inicial
const initialState: UserState = {
  profile: null,
  stats: null,
  settings: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  authToken: null,
  refreshToken: null,
  lastSync: null,
  pendingChanges: [],
  syncStatus: 'idle',
};

// Thunks assíncronos
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados mockados para demonstração
      const mockProfile: UserProfile = {
        id: userId,
        email: 'usuario@exemplo.com',
        name: 'João Silva',
        avatar: 'https://example.com/avatar.jpg',
        dateOfBirth: '1990-05-15',
        gender: 'male',
        phone: '+55 11 99999-9999',
        location: {
          city: 'São Paulo',
          state: 'SP',
          country: 'Brasil',
          coordinates: {
            latitude: -23.5505,
            longitude: -46.6333,
          },
        },
        preferences: {
          language: 'pt-BR',
          units: 'metric',
          timezone: 'America/Sao_Paulo',
          notifications: {
            email: true,
            push: true,
            sms: false,
          },
          privacy: {
            profileVisibility: 'public',
            activityVisibility: 'friends',
            locationSharing: true,
            dataAnalytics: true,
          },
          accessibility: {
            reducedMotion: false,
            highContrast: false,
            largeText: false,
            screenReader: false,
          },
        },
        fitnessProfile: {
          height: 175,
          weight: 70,
          bodyFatPercentage: 15,
          muscleMass: 55,
          fitnessLevel: 'intermediate',
          goals: ['Correr 10km', 'Melhorar pace', 'Participar de uma meia maratona'],
          injuries: [],
          medicalConditions: [],
          medications: [],
          emergencyContact: {
            name: 'Maria Silva',
            relationship: 'Esposa',
            phone: '+55 11 88888-8888',
          },
        },
        trainingProfile: {
          experience: 3,
          preferredTerrain: 'mixed',
          preferredTime: 'morning',
          preferredWeather: 'any',
          weeklyGoal: 30,
          targetRaces: ['São Silvestre 2024', 'Maratona de São Paulo 2024'],
        },
        socialProfile: {
          followers: [],
          following: [],
          friends: [],
          communities: [],
          achievements: [],
          badges: [],
          totalRuns: 45,
          totalDistance: 320,
          totalTime: 28800,
          totalCalories: 19200,
          longestRun: 21,
          fastestPace: '5:30',
          currentStreak: 7,
          longestStreak: 21,
        },
        subscription: {
          plan: 'premium',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          autoRenew: true,
          features: ['treinos_personalizados', 'analise_biomecanica', 'coach_ia', 'comunidade_premium'],
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        lastActive: '2024-01-15T10:30:00Z',
        isVerified: true,
        isActive: true,
      };

      return mockProfile;
    } catch (error) {
      return rejectWithValue('Erro ao carregar perfil do usuário');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (updates: Partial<UserProfile>, { getState, rejectWithValue }) => {
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const state = getState() as { user: UserState };
      const currentProfile = state.user.profile;
      
      if (!currentProfile) {
        throw new Error('Perfil não encontrado');
      }

      const updatedProfile = {
        ...currentProfile,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      // Salva no AsyncStorage
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      
      return updatedProfile;
    } catch (error) {
      return rejectWithValue('Erro ao atualizar perfil');
    }
  }
);

export const fetchUserStats = createAsyncThunk(
  'user/fetchStats',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Dados mockados para demonstração
      const mockStats: UserStats = {
        totalRuns: 45,
        totalDistance: 320,
        totalTime: 28800,
        totalCalories: 19200,
        averagePace: '6:00',
        averageDistance: 7.1,
        averageDuration: 42.7,
        weeklyProgress: [
          { week: '2024-W01', distance: 25, time: 1800, calories: 1500 },
          { week: '2024-W02', distance: 30, time: 2160, calories: 1800 },
          { week: '2024-W03', distance: 28, time: 1980, calories: 1680 },
        ],
        monthlyProgress: [
          { month: '2024-01', distance: 120, time: 8640, calories: 7200 },
        ],
        yearlyProgress: [
          { year: '2024', distance: 120, time: 8640, calories: 7200 },
        ],
        personalBests: {
          distance: { value: 21, date: '2024-01-10', runId: 'run_123' },
          time: { value: 120, date: '2024-01-10', runId: 'run_123' },
          pace: { value: '5:42', date: '2024-01-08', runId: 'run_456' },
          calories: { value: 1200, date: '2024-01-10', runId: 'run_123' },
        },
      };

      return mockStats;
    } catch (error) {
      return rejectWithValue('Erro ao carregar estatísticas');
    }
  }
);

export const updateUserSettings = createAsyncThunk(
  'user/updateSettings',
  async (settings: Partial<UserSettings>, { getState, rejectWithValue }) => {
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const state = getState() as { user: UserState };
      const currentSettings = state.user.settings;
      
      if (!currentSettings) {
        throw new Error('Configurações não encontradas');
      }

      const updatedSettings = {
        ...currentSettings,
        ...settings,
      };

      // Salva no AsyncStorage
      await AsyncStorage.setItem('userSettings', JSON.stringify(updatedSettings));
      
      return updatedSettings;
    } catch (error) {
      return rejectWithValue('Erro ao atualizar configurações');
    }
  }
);

export const syncUserData = createAsyncThunk(
  'user/syncData',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: UserState };
      
      if (state.user.pendingChanges.length === 0) {
        return { message: 'Nenhuma mudança pendente' };
      }

      // Simular sincronização
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        message: 'Dados sincronizados com sucesso',
        syncedChanges: state.user.pendingChanges,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue('Erro na sincronização');
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    followUser: (state, action: PayloadAction<{ targetUserId: string }>) => {
      if (!state.profile) return;
      const id = action.payload.targetUserId;
      if (!state.profile.socialProfile.following.includes(id)) {
        state.profile.socialProfile.following.push(id);
        try { track('follow', { target_user_id: id }).catch(() => {}); } catch {}
      }
    },

    unfollowUser: (state, action: PayloadAction<{ targetUserId: string }>) => {
      if (!state.profile) return;
      const id = action.payload.targetUserId;
      if (state.profile.socialProfile.following.includes(id)) {
        state.profile.socialProfile.following = state.profile.socialProfile.following.filter(u => u !== id);
        try { track('unfollow', { target_user_id: id }).catch(() => {}); } catch {}
      }
    },
    // Ações síncronas
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.authToken = action.payload;
      state.isAuthenticated = true;
    },
    
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
    },
    
    logout: (state) => {
      state.profile = null;
      state.stats = null;
      state.settings = null;
      state.isAuthenticated = false;
      state.authToken = null;
      state.refreshToken = null;
      state.lastSync = null;
      state.pendingChanges = [];
      state.syncStatus = 'idle';
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
    
    updateLastActive: (state) => {
      state.lastActive = new Date().toISOString();
    },
    
    // Ações para atualizações parciais
    updateProfileField: (state, action: PayloadAction<{ field: string; value: any }>) => {
      if (state.profile) {
        const { field, value } = action.payload;
        const fieldPath = field.split('.');
        let current: any = state.profile;
        
        for (let i = 0; i < fieldPath.length - 1; i++) {
          current = current[fieldPath[i]];
        }
        
        current[fieldPath[fieldPath.length - 1]] = value;
        state.profile.updatedAt = new Date().toISOString();
        
        // Adiciona mudança pendente
        state.pendingChanges.push(`profile.${field}`);
      }
    },
    
    updateSettingsField: (state, action: PayloadAction<{ field: string; value: any }>) => {
      if (state.settings) {
        const { field, value } = action.payload;
        const fieldPath = field.split('.');
        let current: any = state.settings;
        
        for (let i = 0; i < fieldPath.length - 1; i++) {
          current = current[fieldPath[i]];
        }
        
        current[fieldPath[fieldPath.length - 1]] = value;
        
        // Adiciona mudança pendente
        state.pendingChanges.push(`settings.${field}`);
      }
    },
    
    // Ações para estatísticas
    updateRunStats: (state, action: PayloadAction<{
      distance: number;
      time: number;
      calories: number;
      pace: string;
    }>) => {
      if (state.stats) {
        const { distance, time, calories, pace } = action.payload;
        
        state.stats.totalRuns += 1;
        state.stats.totalDistance += distance;
        state.stats.totalTime += time;
        state.stats.totalCalories += calories;
        
        // Atualiza médias
        state.stats.averageDistance = state.stats.totalDistance / state.stats.totalRuns;
        state.stats.averageDuration = state.stats.totalTime / state.stats.totalRuns;
        
        // Atualiza progresso semanal
        const currentWeek = getCurrentWeek();
        const weekIndex = state.stats.weeklyProgress.findIndex(w => w.week === currentWeek);
        
        if (weekIndex >= 0) {
          state.stats.weeklyProgress[weekIndex].distance += distance;
          state.stats.weeklyProgress[weekIndex].time += time;
          state.stats.weeklyProgress[weekIndex].calories += calories;
        } else {
          state.stats.weeklyProgress.push({
            week: currentWeek,
            distance,
            time,
            calories,
          });
        }
        
        // Verifica personal bests
        if (distance > state.stats.personalBests.distance.value) {
          state.stats.personalBests.distance = {
            value: distance,
            date: new Date().toISOString(),
            runId: `run_${Date.now()}`,
          };
        }
        
        if (time > state.stats.personalBests.time.value) {
          state.stats.personalBests.time = {
            value: time,
            date: new Date().toISOString(),
            runId: `run_${Date.now()}`,
          };
        }
        
        if (calories > state.stats.personalBests.calories.value) {
          state.stats.personalBests.calories = {
            value: calories,
            date: new Date().toISOString(),
            runId: `run_${Date.now()}`,
          };
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUserProfile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
        // Remove mudanças pendentes relacionadas ao perfil
        state.pendingChanges = state.pendingChanges.filter(
          change => !change.startsWith('profile.')
        );
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // fetchUserStats
      .addCase(fetchUserStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // updateUserSettings
      .addCase(updateUserSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserSettings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.settings = action.payload;
        state.error = null;
        // Remove mudanças pendentes relacionadas às configurações
        state.pendingChanges = state.pendingChanges.filter(
          change => !change.startsWith('settings.')
        );
      })
      .addCase(updateUserSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // syncUserData
      .addCase(syncUserData.pending, (state) => {
        state.syncStatus = 'syncing';
        state.error = null;
      })
      .addCase(syncUserData.fulfilled, (state, action) => {
        state.syncStatus = 'success';
        state.lastSync = action.payload.timestamp;
        state.pendingChanges = [];
        state.error = null;
      })
      .addCase(syncUserData.rejected, (state, action) => {
        state.syncStatus = 'error';
        state.error = action.payload as string;
      });
  },
});

// Função utilitária para obter semana atual
function getCurrentWeek(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil(days / 7);
  return `${now.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
}

// Exporta actions e reducer
export const {
  setLoading,
  setError,
  setAuthToken,
  setRefreshToken,
  logout,
  addPendingChange,
  removePendingChange,
  clearPendingChanges,
  updateLastActive,
  updateProfileField,
  updateSettingsField,
  updateRunStats,
} = userSlice.actions;

export default userSlice.reducer;