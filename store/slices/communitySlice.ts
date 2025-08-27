import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interfaces
export interface Community {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private' | 'invite_only';
  category: 'running' | 'cycling' | 'swimming' | 'triathlon' | 'general' | 'charity' | 'competitive' | 'social';
  avatar?: string;
  coverImage?: string;
  rules: string[];
  tags: string[];
  location?: {
    city: string;
    state: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    radius: number; // km
  };
  stats: {
    totalMembers: number;
    activeMembers: number;
    totalActivities: number;
    totalDistance: number; // km
    totalTime: number; // minutos
    totalCalories: number;
    averagePace: string; // min/km
    weeklyGoal: number; // km
    monthlyGoal: number; // km
    yearlyGoal: number; // km
  };
  goals: {
    current: {
      distance: number;
      time: number;
      members: number;
    };
    target: {
      distance: number;
      time: number;
      members: number;
      deadline: string;
    };
    progress: number; // 0-100%
  };
  membership: {
    isOpen: boolean;
    requiresApproval: boolean;
    maxMembers?: number;
    monthlyFee?: number;
    annualFee?: number;
    benefits: string[];
  };
  admins: string[];
  moderators: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface CommunityMember {
  id: string;
  communityId: string;
  userId: string;
  role: 'admin' | 'moderator' | 'member' | 'guest';
  joinDate: string;
  lastActive: string;
  contribution: {
    totalActivities: number;
    totalDistance: number;
    totalTime: number;
    totalCalories: number;
    averagePace: string;
    weeklyContribution: number;
    monthlyContribution: number;
    yearlyContribution: number;
  };
  achievements: string[];
  badges: string[];
  isActive: boolean;
  isBanned: boolean;
  banReason?: string;
  banExpiry?: string;
}

export interface CommunityChallenge {
  id: string;
  communityId: string;
  name: string;
  description: string;
  type: 'distance' | 'time' | 'frequency' | 'streak' | 'elevation' | 'speed' | 'custom';
  category: 'individual' | 'team' | 'community';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  target: {
    value: number;
    unit: string;
    description: string;
  };
  duration: {
    startDate: string;
    endDate: string;
    totalDays: number;
  };
  rewards: {
    xp: number;
    badges: string[];
    points: number;
    specialTitle?: string;
    customReward?: string;
  };
  participants: Array<{
    userId: string;
    progress: number;
    currentValue: number;
    rank: number;
    joinedAt: string;
    lastUpdate: string;
    isCompleted: boolean;
    completedAt?: string;
  }>;
  leaderboard: Array<{
    userId: string;
    username: string;
    avatar?: string;
    progress: number;
    currentValue: number;
    rank: number;
    lastUpdate: string;
  }>;
  isActive: boolean;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityEvent {
  id: string;
  communityId: string;
  name: string;
  description: string;
  type: 'race' | 'group_run' | 'training' | 'social' | 'charity' | 'workshop';
  date: string;
  time: string;
  duration: number; // minutos
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  details: {
    distance?: number; // km
    pace?: string; // min/km
    difficulty: 'easy' | 'medium' | 'hard';
    maxParticipants?: number;
    currentParticipants: number;
    registrationDeadline: string;
    cost?: number;
    includes: string[];
    requirements: string[];
  };
  participants: Array<{
    userId: string;
    username: string;
    avatar?: string;
    registrationDate: string;
    status: 'registered' | 'confirmed' | 'cancelled' | 'completed';
    performance?: {
      distance: number;
      time: number;
      pace: string;
      rank: number;
    };
  }>;
  isActive: boolean;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityPost {
  id: string;
  communityId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  type: 'text' | 'photo' | 'video' | 'activity' | 'achievement' | 'poll';
  content: {
    text?: string;
    media?: string[];
    activityData?: {
      distance: number;
      time: number;
      pace: string;
      calories: number;
      route?: string;
    };
    poll?: {
      question: string;
      options: string[];
      votes: Record<string, number>;
      totalVotes: number;
      endDate: string;
    };
  };
  likes: string[];
  comments: Array<{
    id: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    text: string;
    likes: string[];
    createdAt: string;
  }>;
  shares: number;
  tags: string[];
  isPinned: boolean;
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityRanking {
  id: string;
  communityId: string;
  type: 'weekly' | 'monthly' | 'yearly' | 'all_time';
  period: string;
  category: 'distance' | 'time' | 'pace' | 'calories' | 'activities' | 'streak';
  rankings: Array<{
    rank: number;
    userId: string;
    username: string;
    avatar?: string;
    value: number;
    unit: string;
    previousRank?: number;
    change: 'up' | 'down' | 'stable' | 'new';
    lastActivity: string;
  }>;
  lastUpdated: string;
  nextUpdate: string;
}

interface CommunityState {
  communities: Community[];
  userCommunities: Community[];
  currentCommunity: Community | null;
  members: CommunityMember[];
  challenges: CommunityChallenge[];
  events: CommunityEvent[];
  posts: CommunityPost[];
  rankings: CommunityRanking[];
  isLoading: boolean;
  error: string | null;
  lastSync: string | null;
  pendingChanges: string[];
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
}

// Estado inicial
const initialState: CommunityState = {
  communities: [],
  userCommunities: [],
  currentCommunity: null,
  members: [],
  challenges: [],
  events: [],
  posts: [],
  rankings: [],
  isLoading: false,
  error: null,
  lastSync: null,
  pendingChanges: [],
  syncStatus: 'idle',
};

// Thunks assíncronos
export const createCommunity = createAsyncThunk(
  'community/create',
  async (communityData: Omit<Community, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      // Simular criação de comunidade
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCommunity: Community = {
        ...communityData,
        id: `community_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Salva no AsyncStorage
      const savedCommunities = await AsyncStorage.getItem('communities');
      const communities = savedCommunities ? JSON.parse(savedCommunities) : [];
      communities.push(newCommunity);
      await AsyncStorage.setItem('communities', JSON.stringify(communities));
      
      return newCommunity;
    } catch (error) {
      return rejectWithValue('Erro ao criar comunidade');
    }
  }
);

export const joinCommunity = createAsyncThunk(
  'community/join',
  async (communityId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { community: CommunityState };
      const community = state.communities.find(c => c.id === communityId);
      
      if (!community) {
        throw new Error('Comunidade não encontrada');
      }
      
      if (community.membership.maxMembers && community.stats.totalMembers >= community.membership.maxMembers) {
        throw new Error('Comunidade está cheia');
      }
      
      const newMember: CommunityMember = {
        id: `member_${Date.now()}`,
        communityId,
        userId: 'user_123', // Mock user ID
        role: 'member',
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        contribution: {
          totalActivities: 0,
          totalDistance: 0,
          totalTime: 0,
          totalCalories: 0,
          averagePace: '0:00',
          weeklyContribution: 0,
          monthlyContribution: 0,
          yearlyContribution: 0,
        },
        achievements: [],
        badges: [],
        isActive: true,
        isBanned: false,
      };
      
      // Atualiza estatísticas da comunidade
      const updatedCommunity = {
        ...community,
        stats: {
          ...community.stats,
          totalMembers: community.stats.totalMembers + 1,
        },
        updatedAt: new Date().toISOString(),
      };
      
      return { newMember, updatedCommunity };
    } catch (error) {
      return rejectWithValue('Erro ao entrar na comunidade');
    }
  }
);

export const createChallenge = createAsyncThunk(
  'community/createChallenge',
  async (challengeData: Omit<CommunityChallenge, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      // Simular criação de desafio
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newChallenge: CommunityChallenge = {
        ...challengeData,
        id: `challenge_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Salva no AsyncStorage
      const savedChallenges = await AsyncStorage.getItem('communityChallenges');
      const challenges = savedChallenges ? JSON.parse(savedChallenges) : [];
      challenges.push(newChallenge);
      await AsyncStorage.setItem('communityChallenges', JSON.stringify(challenges));
      
      return newChallenge;
    } catch (error) {
      return rejectWithValue('Erro ao criar desafio');
    }
  }
);

export const joinChallenge = createAsyncThunk(
  'community/joinChallenge',
  async (challengeId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { community: CommunityState };
      const challenge = state.challenges.find(c => c.id === challengeId);
      
      if (!challenge) {
        throw new Error('Desafio não encontrado');
      }
      
      if (!challenge.isActive) {
        throw new Error('Desafio não está ativo');
      }
      
      // Verifica se já participa
      const isAlreadyParticipating = challenge.participants.some(p => p.userId === 'user_123');
      if (isAlreadyParticipating) {
        throw new Error('Você já está participando deste desafio');
      }
      
      const newParticipant = {
        userId: 'user_123',
        progress: 0,
        currentValue: 0,
        rank: challenge.participants.length + 1,
        joinedAt: new Date().toISOString(),
        lastUpdate: new Date().toISOString(),
        isCompleted: false,
      };
      
      const updatedChallenge = {
        ...challenge,
        participants: [...challenge.participants, newParticipant],
        updatedAt: new Date().toISOString(),
      };
      
      return updatedChallenge;
    } catch (error) {
      return rejectWithValue('Erro ao entrar no desafio');
    }
  }
);

export const updateChallengeProgress = createAsyncThunk(
  'community/updateChallengeProgress',
  async (data: {
    challengeId: string;
    userId: string;
    progress: number;
    currentValue: number;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { community: CommunityState };
      const challenge = state.challenges.find(c => c.id === data.challengeId);
      
      if (!challenge) {
        throw new Error('Desafio não encontrado');
      }
      
      const updatedChallenge = { ...challenge };
      const participantIndex = updatedChallenge.participants.findIndex(p => p.userId === data.userId);
      
      if (participantIndex >= 0) {
        updatedChallenge.participants[participantIndex] = {
          ...updatedChallenge.participants[participantIndex],
          progress: data.progress,
          currentValue: data.currentValue,
          lastUpdate: new Date().toISOString(),
          isCompleted: data.progress >= 100,
          completedAt: data.progress >= 100 ? new Date().toISOString() : undefined,
        };
        
        // Recalcula rankings
        updatedChallenge.participants.sort((a, b) => b.currentValue - a.currentValue);
        updatedChallenge.participants.forEach((p, index) => {
          p.rank = index + 1;
        });
        
        // Atualiza leaderboard
        updatedChallenge.leaderboard = updatedChallenge.participants
          .slice(0, 10)
          .map(p => ({
            userId: p.userId,
            username: `User_${p.userId}`, // Mock username
            avatar: undefined,
            progress: p.progress,
            currentValue: p.currentValue,
            rank: p.rank,
            lastUpdate: p.lastUpdate,
          }));
        
        updatedChallenge.updatedAt = new Date().toISOString();
      }
      
      return updatedChallenge;
    } catch (error) {
      return rejectWithValue('Erro ao atualizar progresso do desafio');
    }
  }
);

export const createEvent = createAsyncThunk(
  'community/createEvent',
  async (eventData: Omit<CommunityEvent, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      // Simular criação de evento
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const newEvent: CommunityEvent = {
        ...eventData,
        id: `event_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Salva no AsyncStorage
      const savedEvents = await AsyncStorage.getItem('communityEvents');
      const events = savedEvents ? JSON.parse(savedEvents) : [];
      events.push(newEvent);
      await AsyncStorage.setItem('communityEvents', JSON.stringify(events));
      
      return newEvent;
    } catch (error) {
      return rejectWithValue('Erro ao criar evento');
    }
  }
);

export const registerForEvent = createAsyncThunk(
  'community/registerForEvent',
  async (eventId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { community: CommunityState };
      const event = state.events.find(e => e.id === eventId);
      
      if (!event) {
        throw new Error('Evento não encontrado');
      }
      
      if (!event.isActive) {
        throw new Error('Evento não está ativo');
      }
      
      if (event.details.maxParticipants && event.details.currentParticipants >= event.details.maxParticipants) {
        throw new Error('Evento está lotado');
      }
      
      const newParticipant = {
        userId: 'user_123',
        username: 'João Silva', // Mock username
        avatar: undefined,
        registrationDate: new Date().toISOString(),
        status: 'registered' as const,
      };
      
      const updatedEvent = {
        ...event,
        details: {
          ...event.details,
          currentParticipants: event.details.currentParticipants + 1,
        },
        participants: [...event.participants, newParticipant],
        updatedAt: new Date().toISOString(),
      };
      
      return updatedEvent;
    } catch (error) {
      return rejectWithValue('Erro ao se registrar no evento');
    }
  }
);

export const createPost = createAsyncThunk(
  'community/createPost',
  async (postData: Omit<CommunityPost, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      // Simular criação de post
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const newPost: CommunityPost = {
        ...postData,
        id: `post_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Salva no AsyncStorage
      const savedPosts = await AsyncStorage.getItem('communityPosts');
      const posts = savedPosts ? JSON.parse(savedPosts) : [];
      posts.push(newPost);
      await AsyncStorage.setItem('communityPosts', JSON.stringify(posts));
      
      return newPost;
    } catch (error) {
      return rejectWithValue('Erro ao criar post');
    }
  }
);

export const likePost = createAsyncThunk(
  'community/likePost',
  async (postId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { community: CommunityState };
      const post = state.posts.find(p => p.id === postId);
      
      if (!post) {
        throw new Error('Post não encontrado');
      }
      
      const userId = 'user_123';
      const isLiked = post.likes.includes(userId);
      
      const updatedPost = {
        ...post,
        likes: isLiked
          ? post.likes.filter(id => id !== userId)
          : [...post.likes, userId],
        updatedAt: new Date().toISOString(),
      };
      
      return updatedPost;
    } catch (error) {
      return rejectWithValue('Erro ao curtir post');
    }
  }
);

export const addComment = createAsyncThunk(
  'community/addComment',
  async (data: { postId: string; text: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { community: CommunityState };
      const post = state.posts.find(p => p.id === data.postId);
      
      if (!post) {
        throw new Error('Post não encontrado');
      }
      
      const newComment = {
        id: `comment_${Date.now()}`,
        authorId: 'user_123',
        authorName: 'João Silva', // Mock username
        authorAvatar: undefined,
        text: data.text,
        likes: [],
        createdAt: new Date().toISOString(),
      };
      
      const updatedPost = {
        ...post,
        comments: [...post.comments, newComment],
        updatedAt: new Date().toISOString(),
      };
      
      return updatedPost;
    } catch (error) {
      return rejectWithValue('Erro ao adicionar comentário');
    }
  }
);

export const fetchCommunities = createAsyncThunk(
  'community/fetchCommunities',
  async (_, { rejectWithValue }) => {
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Dados mockados para demonstração
      const mockCommunities: Community[] = [
        {
          id: 'community_1',
          name: 'Corredores de São Paulo',
          description: 'Comunidade para corredores da capital paulista',
          type: 'public',
          category: 'running',
          avatar: 'https://example.com/avatar1.jpg',
          coverImage: 'https://example.com/cover1.jpg',
          rules: ['Respeitar outros membros', 'Compartilhar experiências', 'Manter-se ativo'],
          tags: ['running', 'sao-paulo', 'corrida', 'saude'],
          location: {
            city: 'São Paulo',
            state: 'SP',
            country: 'Brasil',
            coordinates: { latitude: -23.5505, longitude: -46.6333 },
            radius: 50,
          },
          stats: {
            totalMembers: 1250,
            activeMembers: 890,
            totalActivities: 5670,
            totalDistance: 45600,
            totalTime: 3240000,
            totalCalories: 2340000,
            averagePace: '5:45',
            weeklyGoal: 500,
            monthlyGoal: 2000,
            yearlyGoal: 24000,
          },
          goals: {
            current: { distance: 1800, time: 162000, members: 890 },
            target: { distance: 2000, time: 180000, members: 1000, deadline: '2024-02-01' },
            progress: 75,
          },
          membership: {
            isOpen: true,
            requiresApproval: false,
            maxMembers: 2000,
            monthlyFee: 0,
            annualFee: 0,
            benefits: ['Acesso a eventos exclusivos', 'Treinos em grupo', 'Suporte da comunidade'],
          },
          admins: ['admin_1'],
          moderators: ['mod_1', 'mod_2'],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
          isActive: true,
        },
      ];
      
      return mockCommunities;
    } catch (error) {
      return rejectWithValue('Erro ao carregar comunidades');
    }
  }
);

// Slice
const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    // Ações síncronas
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    setCurrentCommunity: (state, action: PayloadAction<Community | null>) => {
      state.currentCommunity = action.payload;
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
    
    // Ações para comunidades
    updateCommunity: (state, action: PayloadAction<{ id: string; updates: Partial<Community> }>) => {
      const index = state.communities.findIndex(c => c.id === action.payload.id);
      if (index >= 0) {
        state.communities[index] = {
          ...state.communities[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
      
      // Atualiza comunidade atual se for a mesma
      if (state.currentCommunity?.id === action.payload.id) {
        state.currentCommunity = {
          ...state.currentCommunity,
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    removeCommunity: (state, action: PayloadAction<string>) => {
      state.communities = state.communities.filter(c => c.id !== action.payload);
      state.userCommunities = state.userCommunities.filter(c => c.id !== action.payload);
      
      if (state.currentCommunity?.id === action.payload) {
        state.currentCommunity = null;
      }
    },
    
    // Ações para membros
    updateMember: (state, action: PayloadAction<{ id: string; updates: Partial<CommunityMember> }>) => {
      const index = state.members.findIndex(m => m.id === action.payload.id);
      if (index >= 0) {
        state.members[index] = {
          ...state.members[index],
          ...action.payload.updates,
        };
      }
    },
    
    removeMember: (state, action: PayloadAction<string>) => {
      state.members = state.members.filter(m => m.id !== action.payload);
    },
    
    // Ações para desafios
    updateChallenge: (state, action: PayloadAction<{ id: string; updates: Partial<CommunityChallenge> }>) => {
      const index = state.challenges.findIndex(c => c.id === action.payload.id);
      if (index >= 0) {
        state.challenges[index] = {
          ...state.challenges[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    removeChallenge: (state, action: PayloadAction<string>) => {
      state.challenges = state.challenges.filter(c => c.id !== action.payload);
    },
    
    // Ações para eventos
    updateEvent: (state, action: PayloadAction<{ id: string; updates: Partial<CommunityEvent> }>) => {
      const index = state.events.findIndex(e => e.id === action.payload.id);
      if (index >= 0) {
        state.events[index] = {
          ...state.events[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    removeEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(e => e.id !== action.payload);
    },
    
    // Ações para posts
    updatePost: (state, action: PayloadAction<{ id: string; updates: Partial<CommunityPost> }>) => {
      const index = state.posts.findIndex(p => p.id === action.payload.id);
      if (index >= 0) {
        state.posts[index] = {
          ...state.posts[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    removePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(p => p.id !== action.payload);
    },
    
    // Ações para rankings
    updateRanking: (state, action: PayloadAction<{ id: string; updates: Partial<CommunityRanking> }>) => {
      const index = state.rankings.findIndex(r => r.id === action.payload.id);
      if (index >= 0) {
        state.rankings[index] = {
          ...state.rankings[index],
          ...action.payload.updates,
          lastUpdated: new Date().toISOString(),
        };
      }
    },
    
    // Limpeza de dados antigos
    cleanupOldData: (state, action: PayloadAction<{ maxAge: number }>) => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - action.payload.maxAge);
      
      state.posts = state.posts.filter(post => 
        new Date(post.createdAt) > cutoffDate
      );
      
      state.events = state.events.filter(event => 
        new Date(event.date) > cutoffDate.toISOString().split('T')[0]
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // createCommunity
      .addCase(createCommunity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCommunity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.communities.push(action.payload);
        state.userCommunities.push(action.payload);
        state.error = null;
      })
      .addCase(createCommunity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // joinCommunity
      .addCase(joinCommunity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(joinCommunity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.members.push(action.payload.newMember);
        
        // Atualiza comunidade
        const communityIndex = state.communities.findIndex(c => c.id === action.payload.updatedCommunity.id);
        if (communityIndex >= 0) {
          state.communities[communityIndex] = action.payload.updatedCommunity;
        }
        
        state.error = null;
      })
      .addCase(joinCommunity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // createChallenge
      .addCase(createChallenge.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createChallenge.fulfilled, (state, action) => {
        state.isLoading = false;
        state.challenges.push(action.payload);
        state.error = null;
      })
      .addCase(createChallenge.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // joinChallenge
      .addCase(joinChallenge.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(joinChallenge.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Atualiza desafio
        const challengeIndex = state.challenges.findIndex(c => c.id === action.payload.id);
        if (challengeIndex >= 0) {
          state.challenges[challengeIndex] = action.payload;
        }
        
        state.error = null;
      })
      .addCase(joinChallenge.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // updateChallengeProgress
      .addCase(updateChallengeProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateChallengeProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Atualiza desafio
        const challengeIndex = state.challenges.findIndex(c => c.id === action.payload.id);
        if (challengeIndex >= 0) {
          state.challenges[challengeIndex] = action.payload;
        }
        
        state.error = null;
      })
      .addCase(updateChallengeProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // createEvent
      .addCase(createEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events.push(action.payload);
        state.error = null;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // registerForEvent
      .addCase(registerForEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerForEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Atualiza evento
        const eventIndex = state.events.findIndex(e => e.id === action.payload.id);
        if (eventIndex >= 0) {
          state.events[eventIndex] = action.payload;
        }
        
        state.error = null;
      })
      .addCase(registerForEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // createPost
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts.unshift(action.payload); // Adiciona no início
        state.error = null;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // likePost
      .addCase(likePost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Atualiza post
        const postIndex = state.posts.findIndex(p => p.id === action.payload.id);
        if (postIndex >= 0) {
          state.posts[postIndex] = action.payload;
        }
        
        state.error = null;
      })
      .addCase(likePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // addComment
      .addCase(addComment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Atualiza post
        const postIndex = state.posts.findIndex(p => p.id === action.payload.id);
        if (postIndex >= 0) {
          state.posts[postIndex] = action.payload;
        }
        
        state.error = null;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // fetchCommunities
      .addCase(fetchCommunities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCommunities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.communities = action.payload;
        state.error = null;
      })
      .addCase(fetchCommunities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Exporta actions e reducer
export const {
  setLoading,
  setError,
  setCurrentCommunity,
  addPendingChange,
  removePendingChange,
  clearPendingChanges,
  updateCommunity,
  removeCommunity,
  updateMember,
  removeMember,
  updateChallenge,
  removeChallenge,
  updateEvent,
  removeEvent,
  updatePost,
  removePost,
  updateRanking,
  cleanupOldData,
} = communitySlice.actions;

export default communitySlice.reducer;