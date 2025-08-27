import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interfaces
export interface MentorProfile {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  bio: string;
  specialties: string[];
  experience: {
    years: number;
    description: string;
    achievements: string[];
    certifications: string[];
    education: string[];
  };
  expertise: {
    running: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    nutrition: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    strength: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    recovery: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    psychology: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  };
  availability: {
    weekdays: boolean;
    weekends: boolean;
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
    timezone: string;
    customSchedule?: string;
  };
  pricing: {
    hourlyRate: number;
    currency: string;
    packages: Array<{
      id: string;
      name: string;
      sessions: number;
      price: number;
      discount: number; // %
      description: string;
      validity: number; // dias
    }>;
    freeConsultation: boolean;
    consultationDuration: number; // minutos
  };
  rating: {
    average: number; // 1-5
    totalReviews: number;
    reviews: Array<{
      id: string;
      menteeId: string;
      menteeName: string;
      rating: number;
      comment: string;
      date: string;
    }>;
  };
  stats: {
    totalMentees: number;
    activeMentees: number;
    totalSessions: number;
    totalHours: number;
    completionRate: number; // %
    satisfactionRate: number; // %
  };
  isVerified: boolean;
  isActive: boolean;
  isApproved: boolean;
  approvalDate?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MentorshipSubscription {
  id: string;
  menteeId: string;
  mentorId: string;
  packageId: string;
  packageName: string;
  sessions: number;
  sessionsUsed: number;
  sessionsRemaining: number;
  price: number;
  currency: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isExpired: boolean;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MentorshipSession {
  id: string;
  subscriptionId: string;
  menteeId: string;
  mentorId: string;
  type: 'consultation' | 'training' | 'review' | 'follow_up' | 'emergency';
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
  scheduledDate: string;
  startTime: string;
  endTime: string;
  duration: number; // minutos
  actualStartTime?: string;
  actualEndTime?: string;
  actualDuration?: number;
  location: {
    type: 'video_call' | 'phone_call' | 'in_person' | 'chat';
    details: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  agenda: string[];
  notes: string[];
  goals: string[];
  outcomes: string[];
  actionItems: Array<{
    id: string;
    description: string;
    assignedTo: 'mentee' | 'mentor' | 'both';
    dueDate: string;
    isCompleted: boolean;
    completedAt?: string;
  }>;
  resources: Array<{
    id: string;
    type: 'document' | 'video' | 'link' | 'app';
    title: string;
    description: string;
    url: string;
  }>;
  feedback: {
    menteeRating?: number;
    menteeComment?: string;
    mentorRating?: number;
    mentorComment?: string;
  };
  isRescheduled: boolean;
  rescheduledFrom?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MentorshipPayment {
  id: string;
  subscriptionId: string;
  menteeId: string;
  mentorId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'stripe' | 'paypal' | 'apple_pay' | 'google_pay' | 'pix' | 'bank_transfer';
  transactionId?: string;
  gatewayResponse?: any;
  description: string;
  metadata: Record<string, any>;
  processedAt?: string;
  failedAt?: string;
  failureReason?: string;
  refundedAt?: string;
  refundReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MentorshipApplication {
  id: string;
  userId: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'withdrawn';
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    location: {
      city: string;
      state: string;
      country: string;
    };
  };
  professionalInfo: {
    currentOccupation: string;
    yearsOfExperience: number;
    relevantEducation: string[];
    certifications: string[];
    achievements: string[];
  };
  mentorshipInfo: {
    motivation: string;
    targetAudience: string[];
    specialties: string[];
    approach: string;
    goals: string[];
  };
  documents: Array<{
    id: string;
    type: 'cv' | 'certificate' | 'reference' | 'other';
    name: string;
    url: string;
    uploadedAt: string;
  }>;
  references: Array<{
    name: string;
    relationship: string;
    email: string;
    phone: string;
    company?: string;
  }>;
  reviewNotes?: string;
  reviewerId?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MentorshipStats {
  totalMentors: number;
  totalMentees: number;
  totalSessions: number;
  totalHours: number;
  averageSessionRating: number;
  completionRate: number;
  satisfactionRate: number;
  revenue: {
    total: number;
    monthly: number;
    yearly: number;
    currency: string;
  };
  popularSpecialties: Array<{
    specialty: string;
    count: number;
    percentage: number;
  }>;
  sessionTrends: Array<{
    period: string;
    sessions: number;
    revenue: number;
    growth: number; // %
  }>;
}

interface MentorshipState {
  mentors: MentorProfile[];
  userMentors: MentorProfile[];
  currentMentor: MentorProfile | null;
  subscriptions: MentorshipSubscription[];
  sessions: MentorshipSession[];
  payments: MentorshipPayment[];
  applications: MentorshipApplication[];
  stats: MentorshipStats | null;
  isLoading: boolean;
  error: string | null;
  lastSync: string | null;
  pendingChanges: string[];
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
}

// Estado inicial
const initialState: MentorshipState = {
  mentors: [],
  userMentors: [],
  currentMentor: null,
  subscriptions: [],
  sessions: [],
  payments: [],
  applications: [],
  stats: null,
  isLoading: false,
  error: null,
  lastSync: null,
  pendingChanges: [],
  syncStatus: 'idle',
};

// Thunks assíncronos
export const applyForMentorship = createAsyncThunk(
  'mentorship/apply',
  async (applicationData: Omit<MentorshipApplication, 'id' | 'status' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      // Simular aplicação para mentoria
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newApplication: MentorshipApplication = {
        ...applicationData,
        id: `application_${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Salva no AsyncStorage
      const savedApplications = await AsyncStorage.getItem('mentorshipApplications');
      const applications = savedApplications ? JSON.parse(savedApplications) : [];
      applications.push(newApplication);
      await AsyncStorage.setItem('mentorshipApplications', JSON.stringify(applications));
      
      return newApplication;
    } catch (error) {
      return rejectWithValue('Erro ao aplicar para mentoria');
    }
  }
);

export const approveMentor = createAsyncThunk(
  'mentorship/approveMentor',
  async (applicationId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { mentorship: MentorshipState };
      const application = state.applications.find(a => a.id === applicationId);
      
      if (!application) {
        throw new Error('Aplicação não encontrada');
      }
      
      // Cria perfil de mentor
      const mentorProfile: MentorProfile = {
        id: `mentor_${Date.now()}`,
        userId: application.userId,
        name: application.personalInfo.name,
        bio: application.mentorshipInfo.motivation,
        specialties: application.mentorshipInfo.specialties,
        experience: {
          years: application.professionalInfo.yearsOfExperience,
          description: application.mentorshipInfo.approach,
          achievements: application.professionalInfo.achievements,
          certifications: application.professionalInfo.certifications,
          education: application.professionalInfo.relevantEducation,
        },
        expertise: {
          running: 'intermediate',
          nutrition: 'intermediate',
          strength: 'intermediate',
          recovery: 'intermediate',
          psychology: 'intermediate',
        },
        availability: {
          weekdays: true,
          weekends: false,
          morning: true,
          afternoon: true,
          evening: false,
          timezone: 'America/Sao_Paulo',
        },
        pricing: {
          hourlyRate: 100,
          currency: 'BRL',
          packages: [
            {
              id: 'package_1',
              name: 'Pacote Básico',
              sessions: 4,
              price: 350,
              discount: 12.5,
              description: '4 sessões de mentoria',
              validity: 60,
            },
            {
              id: 'package_2',
              name: 'Pacote Premium',
              sessions: 8,
              price: 650,
              discount: 18.75,
              description: '8 sessões de mentoria',
              validity: 90,
            },
          ],
          freeConsultation: true,
          consultationDuration: 30,
        },
        rating: {
          average: 0,
          totalReviews: 0,
          reviews: [],
        },
        stats: {
          totalMentees: 0,
          activeMentees: 0,
          totalSessions: 0,
          totalHours: 0,
          completionRate: 0,
          satisfactionRate: 0,
        },
        isVerified: false,
        isActive: true,
        isApproved: true,
        approvalDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Atualiza aplicação
      const updatedApplication = {
        ...application,
        status: 'approved' as const,
        reviewerId: 'admin_1',
        reviewedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return { mentorProfile, updatedApplication };
    } catch (error) {
      return rejectWithValue('Erro ao aprovar mentor');
    }
  }
);

export const subscribeToMentor = createAsyncThunk(
  'mentorship/subscribe',
  async (data: {
    mentorId: string;
    packageId: string;
    menteeId: string;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { mentorship: MentorshipState };
      const mentor = state.mentors.find(m => m.id === data.mentorId);
      
      if (!mentor) {
        throw new Error('Mentor não encontrado');
      }
      
      const packageInfo = mentor.pricing.packages.find(p => p.id === data.packageId);
      if (!packageInfo) {
        throw new Error('Pacote não encontrado');
      }
      
      const subscription: MentorshipSubscription = {
        id: `subscription_${Date.now()}`,
        menteeId: data.menteeId,
        mentorId: data.mentorId,
        packageId: data.packageId,
        packageName: packageInfo.name,
        sessions: packageInfo.sessions,
        sessionsUsed: 0,
        sessionsRemaining: packageInfo.sessions,
        price: packageInfo.price,
        currency: mentor.pricing.currency,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + packageInfo.validity * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        isExpired: false,
        autoRenew: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Salva no AsyncStorage
      const savedSubscriptions = await AsyncStorage.getItem('mentorshipSubscriptions');
      const subscriptions = savedSubscriptions ? JSON.parse(savedSubscriptions) : [];
      subscriptions.push(subscription);
      await AsyncStorage.setItem('mentorshipSubscriptions', JSON.stringify(subscriptions));
      
      return subscription;
    } catch (error) {
      return rejectWithValue('Erro ao assinar mentor');
    }
  }
);

export const scheduleSession = createAsyncThunk(
  'mentorship/scheduleSession',
  async (data: {
    subscriptionId: string;
    mentorId: string;
    menteeId: string;
    scheduledDate: string;
    startTime: string;
    endTime: string;
    type: MentorshipSession['type'];
    agenda: string[];
    goals: string[];
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { mentorship: MentorshipState };
      const subscription = state.subscriptions.find(s => s.id === data.subscriptionId);
      
      if (!subscription) {
        throw new Error('Assinatura não encontrada');
      }
      
      if (subscription.sessionsRemaining <= 0) {
        throw new Error('Não há sessões disponíveis');
      }
      
      if (!subscription.isActive || subscription.isExpired) {
        throw new Error('Assinatura não está ativa');
      }
      
      const session: MentorshipSession = {
        id: `session_${Date.now()}`,
        subscriptionId: data.subscriptionId,
        menteeId: data.menteeId,
        mentorId: data.mentorId,
        type: data.type,
        status: 'scheduled',
        scheduledDate: data.scheduledDate,
        startTime: data.startTime,
        endTime: data.endTime,
        duration: calculateDuration(data.startTime, data.endTime),
        location: {
          type: 'video_call',
          details: 'Zoom ou Google Meet',
        },
        agenda: data.agenda,
        notes: [],
        goals: data.goals,
        outcomes: [],
        actionItems: [],
        resources: [],
        feedback: {},
        isRescheduled: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Atualiza assinatura
      const updatedSubscription = {
        ...subscription,
        sessionsRemaining: subscription.sessionsRemaining - 1,
        updatedAt: new Date().toISOString(),
      };
      
      // Salva no AsyncStorage
      const savedSessions = await AsyncStorage.getItem('mentorshipSessions');
      const sessions = savedSessions ? JSON.parse(savedSessions) : [];
      sessions.push(session);
      await AsyncStorage.setItem('mentorshipSessions', JSON.stringify(sessions));
      
      return { session, updatedSubscription };
    } catch (error) {
      return rejectWithValue('Erro ao agendar sessão');
    }
  }
);

export const startSession = createAsyncThunk(
  'mentorship/startSession',
  async (sessionId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { mentorship: MentorshipState };
      const session = state.sessions.find(s => s.id === sessionId);
      
      if (!session) {
        throw new Error('Sessão não encontrada');
      }
      
      if (session.status !== 'confirmed') {
        throw new Error('Sessão não está confirmada');
      }
      
      const now = new Date();
      const updatedSession = {
        ...session,
        status: 'in_progress' as const,
        actualStartTime: now.toISOString(),
        updatedAt: now.toISOString(),
      };
      
      return updatedSession;
    } catch (error) {
      return rejectWithValue('Erro ao iniciar sessão');
    }
  }
);

export const completeSession = createAsyncThunk(
  'mentorship/completeSession',
  async (data: {
    sessionId: string;
    outcomes: string[];
    actionItems: Array<{
      description: string;
      assignedTo: 'mentee' | 'mentor' | 'both';
      dueDate: string;
    }>;
    resources: Array<{
      type: 'document' | 'video' | 'link' | 'app';
      title: string;
      description: string;
      url: string;
    }>;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { mentorship: MentorshipState };
      const session = state.sessions.find(s => s.id === data.sessionId);
      
      if (!session) {
        throw new Error('Sessão não encontrada');
      }
      
      if (session.status !== 'in_progress') {
        throw new Error('Sessão não está em andamento');
      }
      
      const now = new Date();
      const actualDuration = session.actualStartTime 
        ? Math.round((now.getTime() - new Date(session.actualStartTime).getTime()) / (1000 * 60))
        : session.duration;
      
      const updatedSession = {
        ...session,
        status: 'completed' as const,
        actualEndTime: now.toISOString(),
        actualDuration,
        outcomes: data.outcomes,
        actionItems: data.actionItems.map((item, index) => ({
          id: `action_${index}`,
          ...item,
          isCompleted: false,
        })),
        resources: data.resources.map((resource, index) => ({
          id: `resource_${index}`,
          ...resource,
        })),
        updatedAt: now.toISOString(),
      };
      
      return updatedSession;
    } catch (error) {
      return rejectWithValue('Erro ao completar sessão');
    }
  }
);

export const processPayment = createAsyncThunk(
  'mentorship/processPayment',
  async (data: {
    subscriptionId: string;
    amount: number;
    currency: string;
    paymentMethod: MentorshipPayment['paymentMethod'];
    description: string;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { mentorship: MentorshipState };
      const subscription = state.subscriptions.find(s => s.id === data.subscriptionId);
      
      if (!subscription) {
        throw new Error('Assinatura não encontrada');
      }
      
      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const payment: MentorshipPayment = {
        id: `payment_${Date.now()}`,
        subscriptionId: data.subscriptionId,
        menteeId: subscription.menteeId,
        mentorId: subscription.mentorId,
        amount: data.amount,
        currency: data.currency,
        status: 'completed',
        paymentMethod: data.paymentMethod,
        transactionId: `txn_${Date.now()}`,
        description: data.description,
        metadata: {
          subscriptionId: data.subscriptionId,
          packageName: subscription.packageName,
        },
        processedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Salva no AsyncStorage
      const savedPayments = await AsyncStorage.getItem('mentorshipPayments');
      const payments = savedPayments ? JSON.parse(savedPayments) : [];
      payments.push(payment);
      await AsyncStorage.setItem('mentorshipPayments', JSON.stringify(payments));
      
      return payment;
    } catch (error) {
      return rejectWithValue('Erro ao processar pagamento');
    }
  }
);

export const fetchMentors = createAsyncThunk(
  'mentorship/fetchMentors',
  async (_, { rejectWithValue }) => {
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados mockados para demonstração
      const mockMentors: MentorProfile[] = [
        {
          id: 'mentor_1',
          userId: 'user_456',
          name: 'Carlos Santos',
          avatar: 'https://example.com/mentor1.jpg',
          bio: 'Corredor profissional com 15 anos de experiência, especialista em treinamento de resistência e preparação para maratonas.',
          specialties: ['Maratona', 'Resistência', 'Técnica de Corrida', 'Nutrição Esportiva'],
          experience: {
            years: 15,
            description: 'Treinador certificado pela IAAF com experiência em atletas de elite',
            achievements: ['Ex-atleta olímpico', 'Treinador de campeões nacionais', 'Especialista em biomecânica'],
            certifications: ['IAAF Level 3', 'USATF Coach', 'Sports Nutrition Specialist'],
            education: ['Educação Física - USP', 'Mestrado em Biomecânica - UNICAMP'],
          },
          expertise: {
            running: 'expert',
            nutrition: 'advanced',
            strength: 'advanced',
            recovery: 'expert',
            psychology: 'intermediate',
          },
          availability: {
            weekdays: true,
            weekends: true,
            morning: true,
            afternoon: true,
            evening: false,
            timezone: 'America/Sao_Paulo',
          },
          pricing: {
            hourlyRate: 150,
            currency: 'BRL',
            packages: [
              {
                id: 'package_1',
                name: 'Pacote Básico',
                sessions: 4,
                price: 500,
                discount: 16.7,
                description: '4 sessões de mentoria',
                validity: 60,
              },
              {
                id: 'package_2',
                name: 'Pacote Premium',
                sessions: 8,
                price: 900,
                discount: 25,
                description: '8 sessões de mentoria',
                validity: 90,
              },
            ],
            freeConsultation: true,
            consultationDuration: 30,
          },
          rating: {
            average: 4.8,
            totalReviews: 47,
            reviews: [],
          },
          stats: {
            totalMentees: 23,
            activeMentees: 15,
            totalSessions: 156,
            totalHours: 234,
            completionRate: 92,
            satisfactionRate: 96,
          },
          isVerified: true,
          isActive: true,
          isApproved: true,
          approvalDate: '2023-06-15T00:00:00Z',
          createdAt: '2023-06-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
      ];
      
      return mockMentors;
    } catch (error) {
      return rejectWithValue('Erro ao carregar mentores');
    }
  }
);

// Função utilitária para calcular duração
function calculateDuration(startTime: string, endTime: string): number {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
}

// Slice
const mentorshipSlice = createSlice({
  name: 'mentorship',
  initialState,
  reducers: {
    // Ações síncronas
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    setCurrentMentor: (state, action: PayloadAction<MentorProfile | null>) => {
      state.currentMentor = action.payload;
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
    
    // Ações para mentores
    updateMentor: (state, action: PayloadAction<{ id: string; updates: Partial<MentorProfile> }>) => {
      const index = state.mentors.findIndex(m => m.id === action.payload.id);
      if (index >= 0) {
        state.mentors[index] = {
          ...state.mentors[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
      
      // Atualiza mentor atual se for o mesmo
      if (state.currentMentor?.id === action.payload.id) {
        state.currentMentor = {
          ...state.currentMentor,
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    removeMentor: (state, action: PayloadAction<string>) => {
      state.mentors = state.mentors.filter(m => m.id !== action.payload);
      state.userMentors = state.userMentors.filter(m => m.id !== action.payload);
      
      if (state.currentMentor?.id === action.payload) {
        state.currentMentor = null;
      }
    },
    
    // Ações para assinaturas
    updateSubscription: (state, action: PayloadAction<{ id: string; updates: Partial<MentorshipSubscription> }>) => {
      const index = state.subscriptions.findIndex(s => s.id === action.payload.id);
      if (index >= 0) {
        state.subscriptions[index] = {
          ...state.subscriptions[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    cancelSubscription: (state, action: PayloadAction<string>) => {
      const index = state.subscriptions.findIndex(s => s.id === action.payload);
      if (index >= 0) {
        state.subscriptions[index] = {
          ...state.subscriptions[index],
          isActive: false,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    // Ações para sessões
    updateSession: (state, action: PayloadAction<{ id: string; updates: Partial<MentorshipSession> }>) => {
      const index = state.sessions.findIndex(s => s.id === action.payload.id);
      if (index >= 0) {
        state.sessions[index] = {
          ...state.sessions[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    rescheduleSession: (state, action: PayloadAction<{ id: string; newDate: string; newStartTime: string; newEndTime: string }>) => {
      const index = state.sessions.findIndex(s => s.id === action.payload.id);
      if (index >= 0) {
        state.sessions[index] = {
          ...state.sessions[index],
          scheduledDate: action.payload.newDate,
          startTime: action.payload.newStartTime,
          endTime: action.payload.newEndTime,
          duration: calculateDuration(action.payload.newStartTime, action.payload.newEndTime),
          isRescheduled: true,
          rescheduledFrom: state.sessions[index].scheduledDate,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    cancelSession: (state, action: PayloadAction<{ id: string; reason: string }>) => {
      const index = state.sessions.findIndex(s => s.id === action.payload.id);
      if (index >= 0) {
        state.sessions[index] = {
          ...state.sessions[index],
          status: 'cancelled',
          cancellationReason: action.payload.reason,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    // Ações para pagamentos
    updatePayment: (state, action: PayloadAction<{ id: string; updates: Partial<MentorshipPayment> }>) => {
      const index = state.payments.findIndex(p => p.id === action.payload.id);
      if (index >= 0) {
        state.payments[index] = {
          ...state.payments[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    // Ações para aplicações
    updateApplication: (state, action: PayloadAction<{ id: string; updates: Partial<MentorshipApplication> }>) => {
      const index = state.applications.findIndex(a => a.id === action.payload.id);
      if (index >= 0) {
        state.applications[index] = {
          ...state.applications[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    // Ações para estatísticas
    updateMentorshipStats: (state, action: PayloadAction<Partial<MentorshipStats>>) => {
      if (state.stats) {
        state.stats = { ...state.stats, ...action.payload };
      }
    },
    
    // Limpeza de dados antigos
    cleanupOldData: (state, action: PayloadAction<{ maxAge: number }>) => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - action.payload.maxAge);
      
      state.sessions = state.sessions.filter(session => 
        new Date(session.scheduledDate) > cutoffDate
      );
      
      state.payments = state.payments.filter(payment => 
        new Date(payment.createdAt) > cutoffDate
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // applyForMentorship
      .addCase(applyForMentorship.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(applyForMentorship.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications.push(action.payload);
        state.error = null;
      })
      .addCase(applyForMentorship.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // approveMentor
      .addCase(approveMentor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(approveMentor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mentors.push(action.payload.mentorProfile);
        
        // Atualiza aplicação
        const applicationIndex = state.applications.findIndex(a => a.id === action.payload.updatedApplication.id);
        if (applicationIndex >= 0) {
          state.applications[applicationIndex] = action.payload.updatedApplication;
        }
        
        state.error = null;
      })
      .addCase(approveMentor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // subscribeToMentor
      .addCase(subscribeToMentor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(subscribeToMentor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscriptions.push(action.payload);
        state.error = null;
      })
      .addCase(subscribeToMentor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // scheduleSession
      .addCase(scheduleSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(scheduleSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions.push(action.payload.session);
        
        // Atualiza assinatura
        const subscriptionIndex = state.subscriptions.findIndex(s => s.id === action.payload.updatedSubscription.id);
        if (subscriptionIndex >= 0) {
          state.subscriptions[subscriptionIndex] = action.payload.updatedSubscription;
        }
        
        state.error = null;
      })
      .addCase(scheduleSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // startSession
      .addCase(startSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startSession.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Atualiza sessão
        const sessionIndex = state.sessions.findIndex(s => s.id === action.payload.id);
        if (sessionIndex >= 0) {
          state.sessions[sessionIndex] = action.payload;
        }
        
        state.error = null;
      })
      .addCase(startSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // completeSession
      .addCase(completeSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeSession.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Atualiza sessão
        const sessionIndex = state.sessions.findIndex(s => s.id === action.payload.id);
        if (sessionIndex >= 0) {
          state.sessions[sessionIndex] = action.payload;
        }
        
        state.error = null;
      })
      .addCase(completeSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // processPayment
      .addCase(processPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payments.push(action.payload);
        state.error = null;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // fetchMentors
      .addCase(fetchMentors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMentors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mentors = action.payload;
        state.error = null;
      })
      .addCase(fetchMentors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Exporta actions e reducer
export const {
  setLoading,
  setError,
  setCurrentMentor,
  addPendingChange,
  removePendingChange,
  clearPendingChanges,
  updateMentor,
  removeMentor,
  updateSubscription,
  cancelSubscription,
  updateSession,
  rescheduleSession,
  cancelSession,
  updatePayment,
  updateApplication,
  updateMentorshipStats,
  cleanupOldData,
} = mentorshipSlice.actions;

export default mentorshipSlice.reducer;