import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interfaces
export interface ExplorerRoute {
  id: string;
  name: string;
  description: string;
  type: 'random' | 'curated' | 'challenge' | 'discovery' | 'historical' | 'nature';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  distance: number; // km
  estimatedTime: number; // minutos
  elevation: {
    gain: number; // metros
    loss: number; // metros
    max: number; // metros
    min: number; // metros
  };
  terrain: {
    type: 'road' | 'trail' | 'mixed' | 'beach' | 'mountain' | 'urban';
    surface: 'asphalt' | 'concrete' | 'dirt' | 'gravel' | 'sand' | 'grass';
    conditions: 'flat' | 'hilly' | 'mountainous' | 'technical';
  };
  location: {
    city: string;
    state: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    radius: number; // km
  };
  waypoints: Array<{
    id: string;
    name: string;
    description: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    type: 'start' | 'checkpoint' | 'landmark' | 'rest' | 'finish';
    order: number;
    estimatedTime: number; // minutos
    elevation?: number; // metros
    photo?: string;
    tips?: string[];
  }>;
  highlights: string[];
  safetyNotes: string[];
  requirements: string[];
  isActive: boolean;
  isCompleted: boolean;
  completionRate: number; // %
  rating: {
    average: number; // 1-5
    totalReviews: number;
    reviews: Array<{
      id: string;
      userId: string;
      username: string;
      rating: number;
      comment: string;
      date: string;
    }>;
  };
  stats: {
    totalAttempts: number;
    successfulCompletions: number;
    averageCompletionTime: number; // minutos
    bestTime: number; // minutos
    difficultyRating: number; // 1-5
  };
  createdAt: string;
  updatedAt: string;
}

export interface SecretPoint {
  id: string;
  name: string;
  description: string;
  type: 'landmark' | 'viewpoint' | 'historical' | 'natural' | 'cultural' | 'hidden';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  coordinates: {
    latitude: number;
    longitude: number;
  };
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
  };
  discovery: {
    isDiscovered: boolean;
    discoveredBy?: string;
    discoveredAt?: string;
    discoveryMethod: 'running' | 'exploration' | 'hint' | 'social' | 'random';
    hints: string[];
    requiredDistance?: number; // km para desbloquear
  };
  rewards: {
    xp: number;
    points: number;
    badges: string[];
    specialTitle?: string;
    unlockContent?: string;
  };
  photo?: string;
  facts: string[];
  tips: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExplorerSession {
  id: string;
  userId: string;
  routeId: string;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  startTime: string;
  endTime?: string;
  duration: number; // minutos
  distance: number; // km
  pace: string; // min/km
  calories: number;
  route: {
    name: string;
    type: ExplorerRoute['type'];
    difficulty: ExplorerRoute['difficulty'];
    waypoints: ExplorerRoute['waypoints'];
  };
  progress: {
    currentWaypoint: number;
    completedWaypoints: number;
    totalWaypoints: number;
    percentage: number; // 0-100
    estimatedTimeRemaining: number; // minutos
  };
  discoveries: Array<{
    secretPointId: string;
    discoveredAt: string;
    method: 'running' | 'exploration' | 'hint';
  }>;
  photos: Array<{
    id: string;
    url: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    timestamp: string;
    caption?: string;
  }>;
  notes: string[];
  rating?: number; // 1-5
  review?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TreasureHunt {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'special';
  theme: 'nature' | 'urban' | 'historical' | 'cultural' | 'adventure' | 'mystery';
  duration: {
    startDate: string;
    endDate: string;
    totalDays: number;
  };
  requirements: {
    minDistance: number; // km
    minSessions: number;
    minSecretPoints: number;
    specialConditions?: string[];
  };
  rewards: {
    xp: number;
    points: number;
    badges: string[];
    specialTitle?: string;
    unlockContent?: string;
    bonusRewards?: string[];
  };
  participants: Array<{
    userId: string;
    username: string;
    avatar?: string;
    progress: number; // 0-100
    distance: number; // km
    sessions: number;
    secretPoints: number;
    rank: number;
    joinedAt: string;
    lastUpdate: string;
    isCompleted: boolean;
    completedAt?: string;
  }>;
  leaderboard: Array<{
    rank: number;
    userId: string;
    username: string;
    avatar?: string;
    progress: number;
    distance: number;
    secretPoints: number;
    lastUpdate: string;
  }>;
  isActive: boolean;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExplorerAchievement {
  id: string;
  name: string;
  description: string;
  category: 'distance' | 'exploration' | 'discovery' | 'challenge' | 'social' | 'special';
  type: 'single' | 'cumulative' | 'streak' | 'milestone' | 'hidden';
  requirements: {
    distance?: number; // km
    sessions?: number;
    secretPoints?: number;
    routes?: number;
    cities?: number;
    countries?: number;
    specialConditions?: string[];
  };
  rewards: {
    xp: number;
    points: number;
    badges: string[];
    specialTitle?: string;
    unlockContent?: string;
  };
  progress: {
    current: number;
    target: number;
    percentage: number; // 0-100
    isCompleted: boolean;
    completedAt?: string;
  };
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  icon: string;
  isHidden: boolean;
  isUnlocked: boolean;
  unlockedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExplorerStats {
  totalRoutes: number;
  totalDistance: number; // km
  totalTime: number; // minutos
  totalSessions: number;
  totalSecretPoints: number;
  totalAchievements: number;
  averageRating: number;
  favoriteRoutes: string[];
  completedChallenges: number;
  currentStreak: number;
  longestStreak: number;
  citiesExplored: string[];
  countriesExplored: string[];
  monthlyProgress: Array<{
    month: string;
    distance: number;
    sessions: number;
    secretPoints: number;
    achievements: number;
  }>;
}

interface ExplorerState {
  routes: ExplorerRoute[];
  userRoutes: ExplorerRoute[];
  currentRoute: ExplorerRoute | null;
  secretPoints: SecretPoint[];
  discoveredPoints: SecretPoint[];
  sessions: ExplorerSession[];
  activeSession: ExplorerSession | null;
  treasureHunts: TreasureHunt[];
  achievements: ExplorerAchievement[];
  stats: ExplorerStats | null;
  isLoading: boolean;
  error: string | null;
  lastSync: string | null;
  pendingChanges: string[];
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
}

// Estado inicial
const initialState: ExplorerState = {
  routes: [],
  userRoutes: [],
  currentRoute: null,
  secretPoints: [],
  discoveredPoints: [],
  sessions: [],
  activeSession: null,
  treasureHunts: [],
  achievements: [],
  stats: null,
  isLoading: false,
  error: null,
  lastSync: null,
  pendingChanges: [],
  syncStatus: 'idle',
};

// Thunks assíncronos
export const generateRandomRoute = createAsyncThunk(
  'explorer/generateRandomRoute',
  async (data: {
    city: string;
    state: string;
    country: string;
    coordinates: { latitude: number; longitude: number };
    preferences: {
      distance: { min: number; max: number };
      difficulty: ExplorerRoute['difficulty'];
      terrain: ExplorerRoute['terrain']['type'];
      time: { min: number; max: number };
    };
  }, { rejectWithValue }) => {
    try {
      // Simular geração de rota
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const route: ExplorerRoute = {
        id: `route_${Date.now()}`,
        name: `Rota Exploradora - ${data.city}`,
        description: `Descubra os melhores caminhos de ${data.city} com esta rota personalizada`,
        type: 'random',
        difficulty: data.preferences.difficulty,
        distance: Math.random() * (data.preferences.distance.max - data.preferences.distance.min) + data.preferences.distance.min,
        estimatedTime: Math.random() * (data.preferences.time.max - data.preferences.time.min) + data.preferences.time.min,
        elevation: {
          gain: Math.floor(Math.random() * 200),
          loss: Math.floor(Math.random() * 200),
          max: Math.floor(Math.random() * 100) + 100,
          min: Math.floor(Math.random() * 50),
        },
        terrain: {
          type: data.preferences.terrain,
          surface: 'asphalt',
          conditions: 'flat',
        },
        location: {
          city: data.city,
          state: data.state,
          country: data.country,
          coordinates: data.coordinates,
          radius: 10,
        },
        waypoints: generateWaypoints(data.coordinates, data.preferences.distance.max),
        highlights: ['Vistas panorâmicas', 'Parques urbanos', 'Arquitetura histórica'],
        safetyNotes: ['Mantenha-se em áreas bem iluminadas', 'Use roupas refletivas'],
        requirements: ['Tênis confortáveis', 'Água', 'Telefone carregado'],
        isActive: true,
        isCompleted: false,
        completionRate: 0,
        rating: { average: 0, totalReviews: 0, reviews: [] },
        stats: { totalAttempts: 0, successfulCompletions: 0, averageCompletionTime: 0, bestTime: 0, difficultyRating: 0 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return route;
    } catch (error) {
      return rejectWithValue('Erro ao gerar rota');
    }
  }
);

// Função utilitária para gerar waypoints
function generateWaypoints(startCoordinates: { latitude: number; longitude: number }, maxDistance: number): ExplorerRoute['waypoints'] {
  const waypoints: ExplorerRoute['waypoints'] = [
    {
      id: 'start',
      name: 'Ponto de Partida',
      description: 'Início da sua aventura exploradora',
      coordinates: startCoordinates,
      type: 'start',
      order: 1,
      estimatedTime: 0,
    },
  ];
  
  // Gera waypoints intermediários
  for (let i = 2; i <= 5; i++) {
    const latOffset = (Math.random() - 0.5) * 0.01;
    const lngOffset = (Math.random() - 0.5) * 0.01;
    
    waypoints.push({
      id: `waypoint_${i}`,
      name: `Checkpoint ${i}`,
      description: `Ponto de verificação ${i}`,
      coordinates: {
        latitude: startCoordinates.latitude + latOffset,
        longitude: startCoordinates.longitude + lngOffset,
      },
      type: 'checkpoint',
      order: i,
      estimatedTime: Math.floor(Math.random() * 30) + 10,
    });
  }
  
  // Ponto final
  waypoints.push({
    id: 'finish',
    name: 'Ponto Final',
    description: 'Parabéns! Você completou a rota exploradora',
    coordinates: {
      latitude: startCoordinates.latitude + (Math.random() - 0.5) * 0.01,
      longitude: startCoordinates.longitude + (Math.random() - 0.5) * 0.01,
    },
    type: 'finish',
    order: 6,
    estimatedTime: 0,
  });
  
  return waypoints;
}

export const startExplorerSession = createAsyncThunk(
  'explorer/startSession',
  async (routeId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { explorer: ExplorerState };
      const route = state.routes.find(r => r.id === routeId);
      
      if (!route) {
        throw new Error('Rota não encontrada');
      }
      
      const session: ExplorerSession = {
        id: `session_${Date.now()}`,
        userId: 'user_123',
        routeId,
        status: 'active',
        startTime: new Date().toISOString(),
        duration: 0,
        distance: 0,
        pace: '0:00',
        calories: 0,
        route: {
          name: route.name,
          type: route.type,
          difficulty: route.difficulty,
          waypoints: route.waypoints,
        },
        progress: {
          currentWaypoint: 1,
          completedWaypoints: 0,
          totalWaypoints: route.waypoints.length,
          percentage: 0,
          estimatedTimeRemaining: route.estimatedTime,
        },
        discoveries: [],
        photos: [],
        notes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return session;
    } catch (error) {
      return rejectWithValue('Erro ao iniciar sessão exploradora');
    }
  }
);

export const discoverSecretPoint = createAsyncThunk(
  'explorer/discoverSecretPoint',
  async (data: {
    secretPointId: string;
    sessionId: string;
    method: 'running' | 'exploration' | 'hint';
    coordinates: { latitude: number; longitude: number };
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { explorer: ExplorerState };
      const secretPoint = state.secretPoints.find(sp => sp.id === data.secretPointId);
      const session = state.sessions.find(s => s.id === data.sessionId);
      
      if (!secretPoint) {
        throw new Error('Ponto secreto não encontrado');
      }
      
      if (!session) {
        throw new Error('Sessão não encontrada');
      }
      
      // Verifica se já foi descoberto
      if (secretPoint.discovery.isDiscovered) {
        throw new Error('Ponto secreto já foi descoberto');
      }
      
      // Atualiza ponto secreto
      const updatedSecretPoint = {
        ...secretPoint,
        discovery: {
          ...secretPoint.discovery,
          isDiscovered: true,
          discoveredBy: 'user_123',
          discoveredAt: new Date().toISOString(),
          discoveryMethod: data.method,
        },
        updatedAt: new Date().toISOString(),
      };
      
      // Atualiza sessão
      const updatedSession = {
        ...session,
        discoveries: [
          ...session.discoveries,
          {
            secretPointId: data.secretPointId,
            discoveredAt: new Date().toISOString(),
            method: data.method,
          },
        ],
        updatedAt: new Date().toISOString(),
      };
      
      return { secretPoint: updatedSecretPoint, session: updatedSession };
    } catch (error) {
      return rejectWithValue('Erro ao descobrir ponto secreto');
    }
  }
);

export const fetchExplorerRoutes = createAsyncThunk(
  'explorer/fetchRoutes',
  async (_, { rejectWithValue }) => {
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados mockados para demonstração
      const mockRoutes: ExplorerRoute[] = [
        {
          id: 'route_1',
          name: 'Parque Ibirapuera - Circuito Clássico',
          description: 'Explore o maior parque urbano de São Paulo com esta rota clássica',
          type: 'curated',
          difficulty: 'easy',
          distance: 5.2,
          estimatedTime: 45,
          elevation: { gain: 45, loss: 45, max: 780, min: 735 },
          terrain: { type: 'mixed', surface: 'asphalt', conditions: 'flat' },
          location: {
            city: 'São Paulo',
            state: 'SP',
            country: 'Brasil',
            coordinates: { latitude: -23.5874, longitude: -46.6576 },
            radius: 2,
          },
          waypoints: [],
          highlights: ['Lago das Garças', 'Museu Afro Brasil', 'Vista do Obelisco'],
          safetyNotes: ['Parque bem iluminado e seguro', 'Muitos corredores'],
          requirements: ['Tênis confortáveis', 'Água'],
          isActive: true,
          isCompleted: false,
          completionRate: 0,
          rating: { average: 4.5, totalReviews: 23, reviews: [] },
          stats: { totalAttempts: 45, successfulCompletions: 42, averageCompletionTime: 48, bestTime: 38, difficultyRating: 2 },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
      ];
      
      return mockRoutes;
    } catch (error) {
      return rejectWithValue('Erro ao carregar rotas exploradoras');
    }
  }
);

// Slice
const explorerSlice = createSlice({
  name: 'explorer',
  initialState,
  reducers: {
    // Ações síncronas
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    setCurrentRoute: (state, action: PayloadAction<ExplorerRoute | null>) => {
      state.currentRoute = action.payload;
    },
    
    setActiveSession: (state, action: PayloadAction<ExplorerSession | null>) => {
      state.activeSession = action.payload;
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
    
    // Ações para rotas
    updateRoute: (state, action: PayloadAction<{ id: string; updates: Partial<ExplorerRoute> }>) => {
      const index = state.routes.findIndex(r => r.id === action.payload.id);
      if (index >= 0) {
        state.routes[index] = {
          ...state.routes[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
      
      // Atualiza rota atual se for a mesma
      if (state.currentRoute?.id === action.payload.id) {
        state.currentRoute = {
          ...state.currentRoute,
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    addUserRoute: (state, action: PayloadAction<ExplorerRoute>) => {
      state.userRoutes.push(action.payload);
    },
    
    // Ações para sessões
    updateSession: (state, action: PayloadAction<{ id: string; updates: Partial<ExplorerSession> }>) => {
      const index = state.sessions.findIndex(s => s.id === action.payload.id);
      if (index >= 0) {
        state.sessions[index] = {
          ...state.sessions[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
      
      // Atualiza sessão ativa se for a mesma
      if (state.activeSession?.id === action.payload.id) {
        state.activeSession = {
          ...state.activeSession,
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    completeSession: (state, action: PayloadAction<string>) => {
      const sessionIndex = state.sessions.findIndex(s => s.id === action.payload);
      if (sessionIndex >= 0) {
        state.sessions[sessionIndex] = {
          ...state.sessions[sessionIndex],
          status: 'completed',
          endTime: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      
      if (state.activeSession?.id === action.payload) {
        state.activeSession = {
          ...state.activeSession,
          status: 'completed',
          endTime: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    // Ações para pontos secretos
    updateSecretPoint: (state, action: PayloadAction<{ id: string; updates: Partial<SecretPoint> }>) => {
      const index = state.secretPoints.findIndex(sp => sp.id === action.payload.id);
      if (index >= 0) {
        state.secretPoints[index] = {
          ...state.secretPoints[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    addDiscoveredPoint: (state, action: PayloadAction<SecretPoint>) => {
      if (!state.discoveredPoints.find(dp => dp.id === action.payload.id)) {
        state.discoveredPoints.push(action.payload);
      }
    },
    
    // Limpeza de dados antigos
    cleanupOldData: (state, action: PayloadAction<{ maxAge: number }>) => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - action.payload.maxAge);
      
      state.sessions = state.sessions.filter(session => 
        new Date(session.createdAt) > cutoffDate
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // generateRandomRoute
      .addCase(generateRandomRoute.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateRandomRoute.fulfilled, (state, action) => {
        state.isLoading = false;
        state.routes.push(action.payload);
        state.userRoutes.push(action.payload);
        state.error = null;
      })
      .addCase(generateRandomRoute.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // startExplorerSession
      .addCase(startExplorerSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startExplorerSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions.push(action.payload);
        state.activeSession = action.payload;
        state.error = null;
      })
      .addCase(startExplorerSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // discoverSecretPoint
      .addCase(discoverSecretPoint.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(discoverSecretPoint.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Atualiza ponto secreto
        const secretPointIndex = state.secretPoints.findIndex(sp => sp.id === action.payload.secretPoint.id);
        if (secretPointIndex >= 0) {
          state.secretPoints[secretPointIndex] = action.payload.secretPoint;
        }
        
        // Atualiza sessão
        const sessionIndex = state.sessions.findIndex(s => s.id === action.payload.session.id);
        if (sessionIndex >= 0) {
          state.sessions[sessionIndex] = action.payload.session;
        }
        
        // Adiciona aos pontos descobertos
        state.discoveredPoints.push(action.payload.secretPoint);
        
        state.error = null;
      })
      .addCase(discoverSecretPoint.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // fetchExplorerRoutes
      .addCase(fetchExplorerRoutes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExplorerRoutes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.routes = action.payload;
        state.error = null;
      })
      .addCase(fetchExplorerRoutes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Exporta actions e reducer
export const {
  setLoading,
  setError,
  setCurrentRoute,
  setActiveSession,
  addPendingChange,
  removePendingChange,
  clearPendingChanges,
  updateRoute,
  addUserRoute,
  updateSession,
  completeSession,
  updateSecretPoint,
  addDiscoveredPoint,
  cleanupOldData,
} = explorerSlice.actions;

export default explorerSlice.reducer;