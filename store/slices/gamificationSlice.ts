import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interfaces
export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'distance' | 'time' | 'streak' | 'social' | 'exploration' | 'challenge' | 'special';
  type: 'single' | 'cumulative' | 'streak' | 'milestone' | 'hidden' | 'seasonal' | 'event';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  icon: string;
  color: string;
  requirements: {
    distance?: number; // km
    time?: number; // minutos
    sessions?: number;
    streak?: number; // dias
    socialActions?: number;
    explorationPoints?: number;
    challenges?: number;
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
  progress: {
    current: number;
    target: number;
    percentage: number; // 0-100
    isCompleted: boolean;
    completedAt?: string;
    progressHistory: Array<{
      date: string;
      value: number;
      percentage: number;
    }>;
  };
  isHidden: boolean;
  isUnlocked: boolean;
  unlockedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  level: number;
  xp: number;
  totalXp: number;
  points: number;
  totalPoints: number;
  rank: string;
  title: string;
  badges: string[];
  achievements: string[];
  stats: {
    totalDistance: number; // km
    totalTime: number; // minutos
    totalSessions: number;
    currentStreak: number; // dias
    longestStreak: number; // dias
    bestPace: string; // min/km
    totalCalories: number;
    elevationGain: number; // metros
    socialActions: number;
    explorationPoints: number;
    challengesCompleted: number;
  };
  milestones: Array<{
    id: string;
    type: 'distance' | 'time' | 'streak' | 'social' | 'exploration';
    value: number;
    achievedAt: string;
    reward: {
      xp: number;
      points: number;
      badge?: string;
    };
  }>;
  season: {
    current: string;
    level: number;
    xp: number;
    rewards: string[];
    progress: number; // 0-100
  };
  createdAt: string;
  updatedAt: string;
}

export interface Leaderboard {
  id: string;
  name: string;
  description: string;
  type: 'global' | 'community' | 'friends' | 'seasonal' | 'event';
  category: 'distance' | 'time' | 'xp' | 'points' | 'streak' | 'exploration' | 'social';
  period: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'all_time';
  startDate: string;
  endDate?: string;
  isActive: boolean;
  participants: number;
  rankings: Array<{
    rank: number;
    userId: string;
    username: string;
    avatar?: string;
    value: number;
    unit: string;
    previousRank?: number;
    change: 'up' | 'down' | 'stable' | 'new';
    lastUpdate: string;
    metadata?: Record<string, any>;
  }>;
  rewards: Array<{
    rank: number;
    xp: number;
    points: number;
    badges: string[];
    specialTitle?: string;
  }>;
  lastUpdated: string;
  nextUpdate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'special' | 'chain';
  category: 'distance' | 'time' | 'social' | 'exploration' | 'challenge' | 'mixed';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  objectives: Array<{
    id: string;
    description: string;
    type: 'distance' | 'time' | 'sessions' | 'streak' | 'social' | 'exploration' | 'custom';
    target: number;
    current: number;
    isCompleted: boolean;
    completedAt?: string;
  }>;
  requirements: {
    minLevel?: number;
    previousQuests?: string[];
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
  timeLimit: {
    startDate: string;
    endDate: string;
    daysRemaining: number;
    isExpired: boolean;
  };
  progress: {
    completedObjectives: number;
    totalObjectives: number;
    percentage: number; // 0-100
    isCompleted: boolean;
    completedAt?: string;
  };
  isActive: boolean;
  isRepeatable: boolean;
  repeatCooldown?: number; // dias
  createdAt: string;
  updatedAt: string;
}

export interface Season {
  id: string;
  name: string;
  description: string;
  theme: 'spring' | 'summer' | 'autumn' | 'winter' | 'special';
  startDate: string;
  endDate: string;
  isActive: boolean;
  isCompleted: boolean;
  levels: Array<{
    level: number;
    xpRequired: number;
    rewards: {
      xp: number;
      points: number;
      badges: string[];
      specialTitle?: string;
      unlockContent?: string;
    };
    isUnlocked: boolean;
    unlockedAt?: string;
  }>;
  challenges: string[];
  leaderboards: string[];
  specialEvents: string[];
  rewards: {
    totalXp: number;
    totalPoints: number;
    totalBadges: number;
    specialTitles: string[];
    unlockContent: string[];
  };
  stats: {
    totalParticipants: number;
    averageLevel: number;
    totalXpEarned: number;
    mostActiveUser: string;
    mostXpEarned: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: Achievement['category'];
  rarity: Achievement['rarity'];
  icon: string;
  color: string;
  unlockCondition: string;
  isHidden: boolean;
  isUnlocked: boolean;
  unlockedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GamificationStats {
  totalUsers: number;
  totalXpEarned: number;
  totalPointsEarned: number;
  totalAchievements: number;
  totalBadges: number;
  averageLevel: number;
  mostPopularAchievement: string;
  mostEarnedBadge: string;
  topUsers: Array<{
    rank: number;
    userId: string;
    username: string;
    level: number;
    xp: number;
    points: number;
  }>;
  achievementBreakdown: Record<string, {
    unlocked: number;
    total: number;
    percentage: number;
  }>;
  levelDistribution: Array<{
    level: number;
    users: number;
    percentage: number;
  }>;
  dailyStats: Array<{
    date: string;
    newUsers: number;
    xpEarned: number;
    achievements: number;
    badges: number;
  }>;
}

interface GamificationState {
  achievements: Achievement[];
  userProfiles: UserProfile[];
  currentUserProfile: UserProfile | null;
  leaderboards: Leaderboard[];
  quests: Quest[];
  activeQuests: Quest[];
  completedQuests: Quest[];
  seasons: Season[];
  currentSeason: Season | null;
  badges: Badge[];
  stats: GamificationStats | null;
  isLoading: boolean;
  error: string | null;
  lastSync: string | null;
  pendingChanges: string[];
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
}

// Estado inicial
const initialState: GamificationState = {
  achievements: [],
  userProfiles: [],
  currentUserProfile: null,
  leaderboards: [],
  quests: [],
  activeQuests: [],
  completedQuests: [],
  seasons: [],
  currentSeason: null,
  badges: [],
  stats: null,
  isLoading: false,
  error: null,
  lastSync: null,
  pendingChanges: [],
  syncStatus: 'idle',
};

// Thunks assíncronos
export const unlockAchievement = createAsyncThunk(
  'gamification/unlockAchievement',
  async (data: {
    userId: string;
    achievementId: string;
    unlockedAt: string;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { gamification: GamificationState };
      const achievement = state.achievements.find(a => a.id === data.achievementId);
      const userProfile = state.userProfiles.find(up => up.userId === data.userId);
      
      if (!achievement) {
        throw new Error('Conquista não encontrada');
      }
      
      if (!userProfile) {
        throw new Error('Perfil do usuário não encontrado');
      }
      
      if (achievement.isUnlocked) {
        throw new Error('Conquista já foi desbloqueada');
      }
      
      // Atualiza conquista
      const updatedAchievement = {
        ...achievement,
        isUnlocked: true,
        unlockedAt: data.unlockedAt,
        progress: {
          ...achievement.progress,
          isCompleted: true,
          completedAt: data.unlockedAt,
        },
        updatedAt: new Date().toISOString(),
      };
      
      // Atualiza perfil do usuário
      const updatedUserProfile = {
        ...userProfile,
        xp: userProfile.xp + achievement.rewards.xp,
        totalXp: userProfile.totalXp + achievement.rewards.xp,
        points: userProfile.points + achievement.rewards.points,
        totalPoints: userProfile.totalPoints + achievement.rewards.points,
        achievements: [...userProfile.achievements, achievement.id],
        badges: [...userProfile.badges, ...achievement.rewards.badges],
        updatedAt: new Date().toISOString(),
      };
      
      // Verifica se subiu de nível
      const newLevel = calculateLevel(updatedUserProfile.totalXp);
      if (newLevel > updatedUserProfile.level) {
        updatedUserProfile.level = newLevel;
        updatedUserProfile.title = generateTitle(newLevel);
      }
      
      return { achievement: updatedAchievement, userProfile: updatedUserProfile };
    } catch (error) {
      return rejectWithValue('Erro ao desbloquear conquista');
    }
  }
);

// Função utilitária para calcular nível baseado no XP
function calculateLevel(totalXp: number): number {
  // Fórmula: nível = 1 + raiz_quadrada(totalXp / 100)
  return Math.floor(1 + Math.sqrt(totalXp / 100));
}

// Função utilitária para gerar título baseado no nível
function generateTitle(level: number): string {
  if (level < 5) return 'Iniciante';
  if (level < 10) return 'Corredor';
  if (level < 20) return 'Atleta';
  if (level < 35) return 'Maratonista';
  if (level < 50) return 'Elite';
  if (level < 75) return 'Lendário';
  if (level < 100) return 'Mítico';
  return 'Divino';
}

export const completeQuest = createAsyncThunk(
  'gamification/completeQuest',
  async (data: {
    userId: string;
    questId: string;
    completedAt: string;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { gamification: GamificationState };
      const quest = state.quests.find(q => q.id === data.questId);
      const userProfile = state.userProfiles.find(up => up.userId === data.userId);
      
      if (!quest) {
        throw new Error('Missão não encontrada');
      }
      
      if (!userProfile) {
        throw new Error('Perfil do usuário não encontrado');
      }
      
      if (quest.progress.isCompleted) {
        throw new Error('Missão já foi completada');
      }
      
      // Atualiza missão
      const updatedQuest = {
        ...quest,
        progress: {
          ...quest.progress,
          isCompleted: true,
          completedAt: data.completedAt,
        },
        updatedAt: new Date().toISOString(),
      };
      
      // Atualiza perfil do usuário
      const updatedUserProfile = {
        ...userProfile,
        xp: userProfile.xp + quest.rewards.xp,
        totalXp: userProfile.totalXp + quest.rewards.xp,
        points: userProfile.points + quest.rewards.points,
        totalPoints: userProfile.totalPoints + quest.rewards.points,
        badges: [...userProfile.badges, ...quest.rewards.badges],
        updatedAt: new Date().toISOString(),
      };
      
      // Verifica se subiu de nível
      const newLevel = calculateLevel(updatedUserProfile.totalXp);
      if (newLevel > updatedUserProfile.level) {
        updatedUserProfile.level = newLevel;
        updatedUserProfile.title = generateTitle(newLevel);
      }
      
      return { quest: updatedQuest, userProfile: updatedUserProfile };
    } catch (error) {
      return rejectWithValue('Erro ao completar missão');
    }
  }
);

export const updateUserStats = createAsyncThunk(
  'gamification/updateUserStats',
  async (data: {
    userId: string;
    stats: Partial<UserProfile['stats']>;
    xpEarned?: number;
    pointsEarned?: number;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { gamification: GamificationState };
      const userProfile = state.userProfiles.find(up => up.userId === data.userId);
      
      if (!userProfile) {
        throw new Error('Perfil do usuário não encontrado');
      }
      
      const updatedUserProfile = {
        ...userProfile,
        stats: {
          ...userProfile.stats,
          ...data.stats,
        },
        xp: data.xpEarned ? userProfile.xp + data.xpEarned : userProfile.xp,
        totalXp: data.xpEarned ? userProfile.totalXp + data.xpEarned : userProfile.totalXp,
        points: data.pointsEarned ? userProfile.points + data.pointsEarned : userProfile.points,
        totalPoints: data.pointsEarned ? userProfile.totalPoints + data.pointsEarned : userProfile.totalPoints,
        updatedAt: new Date().toISOString(),
      };
      
      // Verifica se subiu de nível
      const newLevel = calculateLevel(updatedUserProfile.totalXp);
      if (newLevel > updatedUserProfile.level) {
        updatedUserProfile.level = newLevel;
        updatedUserProfile.title = generateTitle(newLevel);
      }
      
      return updatedUserProfile;
    } catch (error) {
      return rejectWithValue('Erro ao atualizar estatísticas do usuário');
    }
  }
);

export const fetchAchievements = createAsyncThunk(
  'gamification/fetchAchievements',
  async (_, { rejectWithValue }) => {
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados mockados para demonstração
      const mockAchievements: Achievement[] = [
        {
          id: 'achievement_1',
          name: 'Primeiros Passos',
          description: 'Complete seu primeiro treino',
          category: 'distance',
          type: 'single',
          rarity: 'common',
          icon: '🏃‍♂️',
          color: '#4CAF50',
          requirements: {
            sessions: 1,
          },
          rewards: {
            xp: 100,
            points: 50,
            badges: ['first_steps'],
          },
          progress: {
            current: 0,
            target: 1,
            percentage: 0,
            isCompleted: false,
            progressHistory: [],
          },
          isHidden: false,
          isUnlocked: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: 'achievement_2',
          name: 'Maratonista',
          description: 'Complete uma maratona (42.2km)',
          category: 'distance',
          type: 'single',
          rarity: 'epic',
          icon: '🏁',
          color: '#FF9800',
          requirements: {
            distance: 42.2,
          },
          rewards: {
            xp: 1000,
            points: 500,
            badges: ['marathon_runner'],
            specialTitle: 'Maratonista',
          },
          progress: {
            current: 0,
            target: 42.2,
            percentage: 0,
            isCompleted: false,
            progressHistory: [],
          },
          isHidden: false,
          isUnlocked: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: 'achievement_3',
          name: 'Consistente',
          description: 'Mantenha uma sequência de 7 dias de treino',
          category: 'streak',
          type: 'streak',
          rarity: 'uncommon',
          icon: '🔥',
          color: '#F44336',
          requirements: {
            streak: 7,
          },
          rewards: {
            xp: 300,
            points: 150,
            badges: ['consistent_runner'],
          },
          progress: {
            current: 0,
            target: 7,
            percentage: 0,
            isCompleted: false,
            progressHistory: [],
          },
          isHidden: false,
          isUnlocked: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
      ];
      
      return mockAchievements;
    } catch (error) {
      return rejectWithValue('Erro ao carregar conquistas');
    }
  }
);

export const fetchQuests = createAsyncThunk(
  'gamification/fetchQuests',
  async (_, { rejectWithValue }) => {
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Dados mockados para demonstração
      const mockQuests: Quest[] = [
        {
          id: 'quest_1',
          name: 'Desafio Semanal',
          description: 'Complete 3 treinos esta semana',
          type: 'weekly',
          category: 'sessions',
          difficulty: 'easy',
          objectives: [
            {
              id: 'obj_1',
              description: 'Complete 3 treinos',
              type: 'sessions',
              target: 3,
              current: 0,
              isCompleted: false,
            },
          ],
          requirements: {},
          rewards: {
            xp: 200,
            points: 100,
            badges: ['weekly_challenge'],
          },
          timeLimit: {
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            daysRemaining: 7,
            isExpired: false,
          },
          progress: {
            completedObjectives: 0,
            totalObjectives: 1,
            percentage: 0,
            isCompleted: false,
          },
          isActive: true,
          isRepeatable: true,
          repeatCooldown: 7,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
      ];
      
      return mockQuests;
    } catch (error) {
      return rejectWithValue('Erro ao carregar missões');
    }
  }
);

// Slice
const gamificationSlice = createSlice({
  name: 'gamification',
  initialState,
  reducers: {
    // Ações síncronas
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    setCurrentUserProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.currentUserProfile = action.payload;
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
    
    // Ações para conquistas
    updateAchievement: (state, action: PayloadAction<{ id: string; updates: Partial<Achievement> }>) => {
      const index = state.achievements.findIndex(a => a.id === action.payload.id);
      if (index >= 0) {
        state.achievements[index] = {
          ...state.achievements[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    updateAchievementProgress: (state, action: PayloadAction<{ id: string; progress: number }>) => {
      const index = state.achievements.findIndex(a => a.id === action.payload.id);
      if (index >= 0) {
        const achievement = state.achievements[index];
        const percentage = Math.min(100, (action.payload.progress / achievement.requirements.distance!) * 100);
        
        achievement.progress = {
          ...achievement.progress,
          current: action.payload.progress,
          percentage,
          progressHistory: [
            ...achievement.progress.progressHistory,
            {
              date: new Date().toISOString(),
              value: action.payload.progress,
              percentage,
            },
          ],
        };
        
        achievement.updatedAt = new Date().toISOString();
      }
    },
    
    // Ações para perfil do usuário
    updateUserProfile: (state, action: PayloadAction<{ userId: string; updates: Partial<UserProfile> }>) => {
      const index = state.userProfiles.findIndex(up => up.userId === action.payload.userId);
      if (index >= 0) {
        state.userProfiles[index] = {
          ...state.userProfiles[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
      
      // Atualiza perfil atual se for o mesmo
      if (state.currentUserProfile?.userId === action.payload.userId) {
        state.currentUserProfile = {
          ...state.currentUserProfile,
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    addUserProfile: (state, action: PayloadAction<UserProfile>) => {
      const existingIndex = state.userProfiles.findIndex(up => up.userId === action.payload.userId);
      
      if (existingIndex >= 0) {
        state.userProfiles[existingIndex] = action.payload;
      } else {
        state.userProfiles.push(action.payload);
      }
    },
    
    // Ações para missões
    updateQuest: (state, action: PayloadAction<{ id: string; updates: Partial<Quest> }>) => {
      const index = state.quests.findIndex(q => q.id === action.payload.id);
      if (index >= 0) {
        state.quests[index] = {
          ...state.quests[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    updateQuestProgress: (state, action: PayloadAction<{ id: string; objectiveId: string; progress: number }>) => {
      const questIndex = state.quests.findIndex(q => q.id === action.payload.id);
      if (questIndex >= 0) {
        const quest = state.quests[questIndex];
        const objectiveIndex = quest.objectives.findIndex(obj => obj.id === action.payload.objectiveId);
        
        if (objectiveIndex >= 0) {
          const objective = quest.objectives[objectiveIndex];
          objective.current = action.payload.progress;
          objective.isCompleted = action.payload.progress >= objective.target;
          objective.completedAt = objective.isCompleted ? new Date().toISOString() : undefined;
          
          // Recalcula progresso da missão
          const completedObjectives = quest.objectives.filter(obj => obj.isCompleted).length;
          quest.progress = {
            ...quest.progress,
            completedObjectives,
            percentage: (completedObjectives / quest.objectives.length) * 100,
            isCompleted: completedObjectives === quest.objectives.length,
            completedAt: completedObjectives === quest.objectives.length ? new Date().toISOString() : undefined,
          };
          
          quest.updatedAt = new Date().toISOString();
        }
      }
    },
    
    // Ações para leaderboards
    updateLeaderboard: (state, action: PayloadAction<{ id: string; updates: Partial<Leaderboard> }>) => {
      const index = state.leaderboards.findIndex(l => l.id === action.payload.id);
      if (index >= 0) {
        state.leaderboards[index] = {
          ...state.leaderboards[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    // Ações para temporadas
    setCurrentSeason: (state, action: PayloadAction<Season | null>) => {
      state.currentSeason = action.payload;
    },
    
    // Limpeza de dados antigos
    cleanupOldData: (state, action: PayloadAction<{ maxAge: number }>) => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - action.payload.maxAge);
      
      // Remove missões expiradas
      state.quests = state.quests.filter(quest => 
        new Date(quest.timeLimit.endDate) > cutoffDate
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // unlockAchievement
      .addCase(unlockAchievement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(unlockAchievement.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Atualiza conquista
        const achievementIndex = state.achievements.findIndex(a => a.id === action.payload.achievement.id);
        if (achievementIndex >= 0) {
          state.achievements[achievementIndex] = action.payload.achievement;
        }
        
        // Atualiza perfil do usuário
        const profileIndex = state.userProfiles.findIndex(up => up.userId === action.payload.userProfile.userId);
        if (profileIndex >= 0) {
          state.userProfiles[profileIndex] = action.payload.userProfile;
        }
        
        // Atualiza perfil atual se for o mesmo
        if (state.currentUserProfile?.userId === action.payload.userProfile.userId) {
          state.currentUserProfile = action.payload.userProfile;
        }
        
        state.error = null;
      })
      .addCase(unlockAchievement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // completeQuest
      .addCase(completeQuest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeQuest.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Atualiza missão
        const questIndex = state.quests.findIndex(q => q.id === action.payload.quest.id);
        if (questIndex >= 0) {
          state.quests[questIndex] = action.payload.quest;
        }
        
        // Atualiza perfil do usuário
        const profileIndex = state.userProfiles.findIndex(up => up.userId === action.payload.userProfile.userId);
        if (profileIndex >= 0) {
          state.userProfiles[profileIndex] = action.payload.userProfile;
        }
        
        // Atualiza perfil atual se for o mesmo
        if (state.currentUserProfile?.userId === action.payload.userProfile.userId) {
          state.currentUserProfile = action.payload.userProfile;
        }
        
        state.error = null;
      })
      .addCase(completeQuest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // updateUserStats
      .addCase(updateUserStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserStats.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Atualiza perfil do usuário
        const profileIndex = state.userProfiles.findIndex(up => up.userId === action.payload.userId);
        if (profileIndex >= 0) {
          state.userProfiles[profileIndex] = action.payload;
        }
        
        // Atualiza perfil atual se for o mesmo
        if (state.currentUserProfile?.userId === action.payload.userId) {
          state.currentUserProfile = action.payload;
        }
        
        state.error = null;
      })
      .addCase(updateUserStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // fetchAchievements
      .addCase(fetchAchievements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAchievements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.achievements = action.payload;
        state.error = null;
      })
      .addCase(fetchAchievements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // fetchQuests
      .addCase(fetchQuests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchQuests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quests = action.payload;
        state.activeQuests = action.payload.filter(q => q.isActive && !q.progress.isCompleted);
        state.completedQuests = action.payload.filter(q => q.progress.isCompleted);
        state.error = null;
      })
      .addCase(fetchQuests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Exporta actions e reducer
export const {
  setLoading,
  setError,
  setCurrentUserProfile,
  addPendingChange,
  removePendingChange,
  clearPendingChanges,
  updateAchievement,
  updateAchievementProgress,
  updateUserProfile,
  addUserProfile,
  updateQuest,
  updateQuestProgress,
  updateLeaderboard,
  setCurrentSeason,
  cleanupOldData,
} = gamificationSlice.actions;

export default gamificationSlice.reducer;