import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interfaces
export interface NotificationTemplate {
  id: string;
  name: string;
  description: string;
  category: 'workout' | 'achievement' | 'social' | 'reminder' | 'challenge' | 'system' | 'marketing';
  type: 'push' | 'email' | 'sms' | 'in_app';
  title: string;
  body: string;
  data?: Record<string, any>;
  actions?: Array<{
    id: string;
    title: string;
    action: string;
    icon?: string;
  }>;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  sound?: string;
  vibration?: boolean;
  badge?: number;
  image?: string;
  deepLink?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserNotification {
  id: string;
  userId: string;
  templateId: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  category: NotificationTemplate['category'];
  type: NotificationTemplate['type'];
  status: 'sent' | 'delivered' | 'read' | 'clicked' | 'dismissed' | 'failed';
  priority: NotificationTemplate['priority'];
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  clickedAt?: string;
  dismissedAt?: string;
  failedAt?: string;
  failureReason?: string;
  deviceToken?: string;
  platform: 'ios' | 'android' | 'web';
  actions?: Array<{
    id: string;
    title: string;
    action: string;
    clickedAt?: string;
  }>;
  metadata: {
    campaignId?: string;
    batchId?: string;
    source: string;
    version: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NotificationCampaign {
  id: string;
  name: string;
  description: string;
  type: 'one_time' | 'recurring' | 'triggered' | 'ab_test';
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
  templateId: string;
  targetAudience: {
    segments: string[];
    filters: {
      age?: { min: number; max: number };
      gender?: 'male' | 'female' | 'other';
      location?: string[];
      activityLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
      subscription?: 'free' | 'premium' | 'pro';
      lastActive?: number; // dias
      preferences?: Record<string, any>;
    };
    estimatedReach: number;
  };
  schedule: {
    startDate: string;
    endDate?: string;
    timezone: string;
    sendTime?: string; // HH:mm
    frequency?: 'daily' | 'weekly' | 'monthly';
    daysOfWeek?: number[]; // 0-6 (domingo-sábado)
    daysOfMonth?: number[]; // 1-31
    maxSends?: number;
    cooldown?: number; // minutos entre envios
  };
  triggers?: Array<{
    type: 'workout_completed' | 'achievement_unlocked' | 'streak_broken' | 'goal_reached' | 'inactivity' | 'custom';
    conditions: Record<string, any>;
    delay?: number; // minutos
  }>;
  content: {
    title: string;
    body: string;
    data?: Record<string, any>;
    actions?: Array<{
      id: string;
      title: string;
      action: string;
      icon?: string;
    }>;
    image?: string;
    deepLink?: string;
  };
  settings: {
    priority: NotificationTemplate['priority'];
    sound: boolean;
    vibration: boolean;
    badge: boolean;
    silent: boolean;
    mutableContent: boolean;
    threadIdentifier?: string;
    categoryIdentifier?: string;
  };
  analytics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    dismissed: number;
    failed: number;
    conversionRate: number; // %
    engagementRate: number; // %
  };
  abTest?: {
    variantA: NotificationCampaign['content'];
    variantB: NotificationCampaign['content'];
    splitPercentage: number; // %
    winner?: 'A' | 'B' | null;
    testDuration: number; // dias
  };
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreference {
  id: string;
  userId: string;
  category: NotificationTemplate['category'];
  enabled: boolean;
  channels: {
    push: boolean;
    email: boolean;
    sms: boolean;
    in_app: boolean;
  };
  schedule: {
    quietHours: {
      enabled: boolean;
      startTime: string; // HH:mm
      endTime: string; // HH:mm
      timezone: string;
    };
    maxPerDay: number;
    cooldown: number; // minutos
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  priority: 'all' | 'high_only' | 'urgent_only';
  createdAt: string;
  updatedAt: string;
}

export interface NotificationDevice {
  id: string;
  userId: string;
  deviceToken: string;
  platform: 'ios' | 'android' | 'web';
  deviceInfo: {
    model: string;
    os: string;
    version: string;
    appVersion: string;
    buildNumber: string;
  };
  capabilities: {
    push: boolean;
    silent: boolean;
    background: boolean;
    critical: boolean;
    provisional: boolean;
  };
  status: 'active' | 'inactive' | 'expired';
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationStats {
  totalSent: number;
  totalDelivered: number;
  totalOpened: number;
  totalClicked: number;
  totalDismissed: number;
  totalFailed: number;
  deliveryRate: number; // %
  openRate: number; // %
  clickRate: number; // %
  conversionRate: number; // %
  engagementRate: number; // %
  averageDeliveryTime: number; // segundos
  categoryBreakdown: Record<string, {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
  }>;
  platformBreakdown: Record<string, {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
  }>;
  timeBreakdown: Array<{
    hour: number;
    sent: number;
    opened: number;
    clicked: number;
  }>;
  dailyTrends: Array<{
    date: string;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
  }>;
}

interface NotificationState {
  templates: NotificationTemplate[];
  userNotifications: UserNotification[];
  campaigns: NotificationCampaign[];
  preferences: NotificationPreference[];
  devices: NotificationDevice[];
  stats: NotificationStats | null;
  isLoading: boolean;
  error: string | null;
  lastSync: string | null;
  pendingChanges: string[];
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  unreadCount: number;
  hasPermission: boolean;
}

// Estado inicial
const initialState: NotificationState = {
  templates: [],
  userNotifications: [],
  campaigns: [],
  preferences: [],
  devices: [],
  stats: null,
  isLoading: false,
  error: null,
  lastSync: null,
  pendingChanges: [],
  syncStatus: 'idle',
  unreadCount: 0,
  hasPermission: false,
};

// Thunks assíncronos
export const sendNotification = createAsyncThunk(
  'notification/send',
  async (data: {
    userId: string;
    templateId: string;
    customData?: Record<string, any>;
    priority?: NotificationTemplate['priority'];
    scheduledAt?: string;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { notification: NotificationState };
      const template = state.templates.find(t => t.id === data.templateId);
      
      if (!template) {
        throw new Error('Template de notificação não encontrado');
      }
      
      // Simular envio de notificação
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const notification: UserNotification = {
        id: `notification_${Date.now()}`,
        userId: data.userId,
        templateId: data.templateId,
        title: template.title,
        body: template.body,
        data: { ...template.data, ...data.customData },
        category: template.category,
        type: template.type,
        status: 'sent',
        priority: data.priority || template.priority,
        sentAt: new Date().toISOString(),
        platform: 'ios', // Mock platform
        metadata: {
          source: 'app',
          version: '1.0.0',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Salva no AsyncStorage
      const savedNotifications = await AsyncStorage.getItem('userNotifications');
      const notifications = savedNotifications ? JSON.parse(savedNotifications) : [];
      notifications.push(notification);
      await AsyncStorage.setItem('userNotifications', JSON.stringify(notifications));
      
      return notification;
    } catch (error) {
      return rejectWithValue('Erro ao enviar notificação');
    }
  }
);

export const createCampaign = createAsyncThunk(
  'notification/createCampaign',
  async (campaignData: Omit<NotificationCampaign, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      // Simular criação de campanha
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newCampaign: NotificationCampaign = {
        ...campaignData,
        id: `campaign_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Salva no AsyncStorage
      const savedCampaigns = await AsyncStorage.getItem('notificationCampaigns');
      const campaigns = savedCampaigns ? JSON.parse(savedCampaigns) : [];
      campaigns.push(newCampaign);
      await AsyncStorage.setItem('notificationCampaigns', JSON.stringify(campaigns));
      
      return newCampaign;
    } catch (error) {
      return rejectWithValue('Erro ao criar campanha');
    }
  }
);

export const updateNotificationPreference = createAsyncThunk(
  'notification/updatePreference',
  async (data: {
    userId: string;
    category: NotificationTemplate['category'];
    updates: Partial<NotificationPreference>;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { notification: NotificationState };
      const preference = state.preferences.find(p => 
        p.userId === data.userId && p.category === data.category
      );
      
      if (!preference) {
        throw new Error('Preferência não encontrada');
      }
      
      const updatedPreference = {
        ...preference,
        ...data.updates,
        updatedAt: new Date().toISOString(),
      };
      
      // Salva no AsyncStorage
      const savedPreferences = await AsyncStorage.getItem('notificationPreferences');
      const preferences = savedPreferences ? JSON.parse(savedPreferences) : [];
      const preferenceIndex = preferences.findIndex((p: NotificationPreference) => 
        p.userId === data.userId && p.category === data.category
      );
      
      if (preferenceIndex >= 0) {
        preferences[preferenceIndex] = updatedPreference;
      } else {
        preferences.push(updatedPreference);
      }
      
      await AsyncStorage.setItem('notificationPreferences', JSON.stringify(preferences));
      
      return updatedPreference;
    } catch (error) {
      return rejectWithValue('Erro ao atualizar preferência');
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (notificationId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { notification: NotificationState };
      const notification = state.userNotifications.find(n => n.id === notificationId);
      
      if (!notification) {
        throw new Error('Notificação não encontrada');
      }
      
      const updatedNotification = {
        ...notification,
        status: 'read' as const,
        readAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return updatedNotification;
    } catch (error) {
      return rejectWithValue('Erro ao marcar notificação como lida');
    }
  }
);

export const fetchNotificationTemplates = createAsyncThunk(
  'notification/fetchTemplates',
  async (_, { rejectWithValue }) => {
    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Dados mockados para demonstração
      const mockTemplates: NotificationTemplate[] = [
        {
          id: 'template_1',
          name: 'Treino Concluído',
          description: 'Notificação enviada quando o usuário completa um treino',
          category: 'workout',
          type: 'push',
          title: '🎉 Treino Concluído!',
          body: 'Parabéns! Você completou {distance}km em {duration}. Continue assim!',
          data: { action: 'view_workout', workoutId: '{workoutId}' },
          actions: [
            { id: 'view', title: 'Ver Detalhes', action: 'view_workout' },
            { id: 'share', title: 'Compartilhar', action: 'share_workout' },
          ],
          priority: 'normal',
          sound: 'default',
          vibration: true,
          badge: 1,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
        {
          id: 'template_2',
          name: 'Conquista Desbloqueada',
          description: 'Notificação enviada quando o usuário desbloqueia uma conquista',
          category: 'achievement',
          type: 'push',
          title: '🏆 Nova Conquista!',
          body: 'Você desbloqueou "{achievementName}"! {description}',
          data: { action: 'view_achievement', achievementId: '{achievementId}' },
          actions: [
            { id: 'view', title: 'Ver Conquista', action: 'view_achievement' },
            { id: 'share', title: 'Compartilhar', action: 'share_achievement' },
          ],
          priority: 'high',
          sound: 'achievement',
          vibration: true,
          badge: 1,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
        },
      ];
      
      return mockTemplates;
    } catch (error) {
      return rejectWithValue('Erro ao carregar templates de notificação');
    }
  }
);

// Slice
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    // Ações síncronas
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    setHasPermission: (state, action: PayloadAction<boolean>) => {
      state.hasPermission = action.payload;
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
    
    // Ações para notificações
    addNotification: (state, action: PayloadAction<UserNotification>) => {
      state.userNotifications.unshift(action.payload);
      if (action.payload.status === 'sent') {
        state.unreadCount += 1;
      }
    },
    
    updateNotification: (state, action: PayloadAction<{ id: string; updates: Partial<UserNotification> }>) => {
      const index = state.userNotifications.findIndex(n => n.id === action.payload.id);
      if (index >= 0) {
        const wasUnread = state.userNotifications[index].status === 'sent';
        const willBeRead = action.payload.updates.status === 'read';
        
        state.userNotifications[index] = {
          ...state.userNotifications[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
        
        // Atualiza contador de não lidas
        if (wasUnread && willBeRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      }
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      const index = state.userNotifications.findIndex(n => n.id === action.payload);
      if (index >= 0) {
        const notification = state.userNotifications[index];
        if (notification.status === 'sent') {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.userNotifications.splice(index, 1);
      }
    },
    
    clearAllNotifications: (state) => {
      state.userNotifications = [];
      state.unreadCount = 0;
    },
    
    markAllAsRead: (state) => {
      state.userNotifications.forEach(notification => {
        if (notification.status === 'sent') {
          notification.status = 'read';
          notification.readAt = new Date().toISOString();
          notification.updatedAt = new Date().toISOString();
        }
      });
      state.unreadCount = 0;
    },
    
    // Ações para campanhas
    updateCampaign: (state, action: PayloadAction<{ id: string; updates: Partial<NotificationCampaign> }>) => {
      const index = state.campaigns.findIndex(c => c.id === action.payload.id);
      if (index >= 0) {
        state.campaigns[index] = {
          ...state.campaigns[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    // Ações para preferências
    addPreference: (state, action: PayloadAction<NotificationPreference>) => {
      const existingIndex = state.preferences.findIndex(p => 
        p.userId === action.payload.userId && p.category === action.payload.category
      );
      
      if (existingIndex >= 0) {
        state.preferences[existingIndex] = action.payload;
      } else {
        state.preferences.push(action.payload);
      }
    },
    
    // Ações para dispositivos
    addDevice: (state, action: PayloadAction<NotificationDevice>) => {
      const existingIndex = state.devices.findIndex(d => 
        d.deviceToken === action.payload.deviceToken
      );
      
      if (existingIndex >= 0) {
        state.devices[existingIndex] = action.payload;
      } else {
        state.devices.push(action.payload);
      }
    },
    
    removeDevice: (state, action: PayloadAction<string>) => {
      state.devices = state.devices.filter(d => d.deviceToken !== action.payload);
    },
    
    // Ações para estatísticas
    updateNotificationStats: (state, action: PayloadAction<Partial<NotificationStats>>) => {
      if (state.stats) {
        state.stats = { ...state.stats, ...action.payload };
      }
    },
    
    // Limpeza de dados antigos
    cleanupOldData: (state, action: PayloadAction<{ maxAge: number }>) => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - action.payload.maxAge);
      
      state.userNotifications = state.userNotifications.filter(notification => 
        new Date(notification.createdAt) > cutoffDate
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // sendNotification
      .addCase(sendNotification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendNotification.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userNotifications.unshift(action.payload);
        state.unreadCount += 1;
        state.error = null;
      })
      .addCase(sendNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // createCampaign
      .addCase(createCampaign.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaigns.push(action.payload);
        state.error = null;
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // updateNotificationPreference
      .addCase(updateNotificationPreference.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateNotificationPreference.fulfilled, (state, action) => {
        state.isLoading = false;
        
        const existingIndex = state.preferences.findIndex(p => 
          p.userId === action.payload.userId && p.category === action.payload.category
        );
        
        if (existingIndex >= 0) {
          state.preferences[existingIndex] = action.payload;
        } else {
          state.preferences.push(action.payload);
        }
        
        state.error = null;
      })
      .addCase(updateNotificationPreference.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // markNotificationAsRead
      .addCase(markNotificationAsRead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.isLoading = false;
        
        const notificationIndex = state.userNotifications.findIndex(n => n.id === action.payload.id);
        if (notificationIndex >= 0) {
          state.userNotifications[notificationIndex] = action.payload;
          
          // Atualiza contador de não lidas
          if (action.payload.status === 'read') {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        }
        
        state.error = null;
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // fetchNotificationTemplates
      .addCase(fetchNotificationTemplates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotificationTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates = action.payload;
        state.error = null;
      })
      .addCase(fetchNotificationTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Exporta actions e reducer
export const {
  setLoading,
  setError,
  setHasPermission,
  addPendingChange,
  removePendingChange,
  clearPendingChanges,
  addNotification,
  updateNotification,
  removeNotification,
  clearAllNotifications,
  markAllAsRead,
  updateCampaign,
  addPreference,
  addDevice,
  removeDevice,
  updateNotificationStats,
  cleanupOldData,
} = notificationSlice.actions;

export default notificationSlice.reducer;