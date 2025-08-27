import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createLogger } from 'redux-logger';

// Importa todos os slices
import userReducer from './slices/userSlice';
import workoutReducer from './slices/workoutSlice';
import themeReducer from './slices/themeSlice';
import wellnessReducer from './slices/wellnessSlice';
import communityReducer from './slices/communitySlice';
import mentorshipReducer from './slices/mentorshipSlice';
import explorerReducer from './slices/explorerSlice';
import notificationReducer from './slices/notificationSlice';
import paymentReducer from './slices/paymentSlice';
import gamificationReducer from './slices/gamificationSlice';

// Configuração de persistência
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version: 1,
  whitelist: [
    'user',
    'theme',
    'wellness',
    'community',
    'mentorship',
    'explorer',
    'notification',
    'payment',
    'gamification',
  ],
  blacklist: [
    'workout', // Não persiste dados de treino em andamento
  ],
  timeout: 10000, // 10 segundos
  debug: __DEV__, // Debug apenas em desenvolvimento
};

// Combina todos os reducers
const rootReducer = combineReducers({
  user: userReducer,
  workout: workoutReducer,
  theme: themeReducer,
  wellness: wellnessReducer,
  community: communityReducer,
  mentorship: mentorshipReducer,
  explorer: explorerReducer,
  notification: notificationReducer,
  payment: paymentReducer,
  gamification: gamificationReducer,
});

// Reducer persistido
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Middleware de logging (apenas em desenvolvimento)
const logger = createLogger({
  collapsed: true,
  duration: true,
  timestamp: true,
  colors: {
    title: () => '#139BFE',
    prevState: () => '#9E9E9E',
    action: () => '#149945',
    nextState: () => '#A47104',
    error: () => '#FF0000',
  },
});

// Configuração da store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: [
          'workout.currentSession',
          'workout.locationUpdates',
          'explorer.activeSession',
          'notification.devices',
        ],
      },
      immutableCheck: {
        ignoredPaths: [
          'workout.currentSession',
          'workout.locationUpdates',
          'explorer.activeSession',
        ],
      },
    });

    // Adiciona logger apenas em desenvolvimento
    if (__DEV__) {
      middleware.push(logger);
    }

    return middleware;
  },
  devTools: __DEV__,
  preloadedState: {
    // Estado inicial para desenvolvimento
    theme: {
      currentMode: 'auto',
      customTheme: null,
      isAutoThemeEnabled: true,
      lastAutoSwitch: null,
    },
    user: {
      isAuthenticated: false,
      currentUser: null,
      isLoading: false,
      error: null,
    },
  },
});

// Persistor para persistência
export const persistor = persistStore(store, {
  manualPersist: false,
  debug: __DEV__,
});

// Tipos para TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Hooks tipados
export type AppState = ReturnType<typeof rootReducer>;

// Middleware customizado para sincronização
export const syncMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);
  
  // Marca mudanças para sincronização
  if (action.type && !action.type.includes('persist')) {
    const state = store.getState();
    
    // Adiciona mudança pendente baseada no tipo de ação
    if (action.type.includes('user/')) {
      store.dispatch({ type: 'user/addPendingChange', payload: action.type });
    }
    if (action.type.includes('workout/')) {
      store.dispatch({ type: 'workout/addPendingChange', payload: action.type });
    }
    if (action.type.includes('community/')) {
      store.dispatch({ type: 'community/addPendingChange', payload: action.type });
    }
    if (action.type.includes('mentorship/')) {
      store.dispatch({ type: 'mentorship/addPendingChange', payload: action.type });
    }
    if (action.type.includes('explorer/')) {
      store.dispatch({ type: 'explorer/addPendingChange', payload: action.type });
    }
    if (action.type.includes('payment/')) {
      store.dispatch({ type: 'payment/addPendingChange', payload: action.type });
    }
    if (action.type.includes('gamification/')) {
      store.dispatch({ type: 'gamification/addPendingChange', payload: action.type });
    }
  }
  
  return result;
};

// Função para limpar store (útil para logout)
export const clearStore = () => {
  persistor.purge();
  store.dispatch({ type: 'persist/PURGE' });
};

// Função para reidratar store
export const rehydrateStore = () => {
  persistor.persist();
};

// Função para obter estado persistido
export const getPersistedState = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const persistedKeys = keys.filter(key => key.startsWith('persist:'));
    
    if (persistedKeys.length > 0) {
      const persistedData = await AsyncStorage.multiGet(persistedKeys);
      return persistedData.reduce((acc, [key, value]) => {
        if (value) {
          acc[key] = JSON.parse(value);
        }
        return acc;
      }, {} as Record<string, any>);
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao obter estado persistido:', error);
    return null;
  }
};

// Função para verificar integridade dos dados
export const checkDataIntegrity = () => {
  const state = store.getState();
  const issues: string[] = [];
  
  // Verifica dados do usuário
  if (state.user.currentUser && !state.user.currentUser.id) {
    issues.push('Usuário sem ID válido');
  }
  
  // Verifica sessão de treino
  if (state.workout.currentSession && !state.workout.currentSession.id) {
    issues.push('Sessão de treino sem ID válido');
  }
  
  // Verifica tema
  if (state.theme.currentMode && !['light', 'dark', 'auto', 'custom'].includes(state.theme.currentMode)) {
    issues.push('Modo de tema inválido');
  }
  
  // Verifica dados de pagamento
  if (state.payment.paymentMethods.some(pm => !pm.id)) {
    issues.push('Métodos de pagamento com IDs inválidos');
  }
  
  // Verifica dados de gamificação
  if (state.gamification.achievements.some(a => !a.id)) {
    issues.push('Conquistas com IDs inválidos');
  }
  
  return {
    hasIssues: issues.length > 0,
    issues,
    timestamp: new Date().toISOString(),
  };
};

// Função para sincronizar dados pendentes
export const syncPendingChanges = async () => {
  const state = store.getState();
  const pendingChanges = [
    ...state.user.pendingChanges,
    ...state.workout.pendingChanges,
    ...state.community.pendingChanges,
    ...state.mentorship.pendingChanges,
    ...state.explorer.pendingChanges,
    ...state.payment.pendingChanges,
    ...state.gamification.pendingChanges,
  ];
  
  if (pendingChanges.length === 0) {
    return { success: true, message: 'Nenhuma mudança pendente para sincronizar' };
  }
  
  try {
    // Simula sincronização com servidor
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Limpa mudanças pendentes após sincronização
    store.dispatch({ type: 'user/clearPendingChanges' });
    store.dispatch({ type: 'workout/clearPendingChanges' });
    store.dispatch({ type: 'community/clearPendingChanges' });
    store.dispatch({ type: 'mentorship/clearPendingChanges' });
    store.dispatch({ type: 'explorer/clearPendingChanges' });
    store.dispatch({ type: 'payment/clearPendingChanges' });
    store.dispatch({ type: 'gamification/clearPendingChanges' });
    
    return {
      success: true,
      message: `${pendingChanges.length} mudanças sincronizadas com sucesso`,
      syncedChanges: pendingChanges,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Erro ao sincronizar mudanças',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
};

// Função para exportar dados da store
export const exportStoreData = () => {
  const state = store.getState();
  const exportData = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    data: {
      user: {
        currentUser: state.user.currentUser,
        preferences: state.user.preferences,
        stats: state.user.stats,
      },
      theme: {
        currentMode: state.theme.currentMode,
        customTheme: state.theme.customTheme,
      },
      wellness: {
        nutritionPlan: state.wellness.currentNutritionPlan,
        hydrationReminders: state.wellness.hydrationReminders,
        supplementRecommendations: state.wellness.supplementRecommendations,
      },
      community: {
        currentCommunity: state.community.currentCommunity,
        memberships: state.community.memberships,
      },
      mentorship: {
        currentMentor: state.mentorship.currentMentor,
        subscriptions: state.mentorship.subscriptions,
      },
      explorer: {
        discoveredPoints: state.explorer.discoveredPoints,
        achievements: state.explorer.achievements,
      },
      payment: {
        paymentMethods: state.payment.paymentMethods,
        subscriptions: state.payment.subscriptions,
      },
      gamification: {
        achievements: state.gamification.achievements,
        currentUserProfile: state.gamification.currentUserProfile,
        badges: state.gamification.badges,
      },
    },
  };
  
  return exportData;
};

// Função para importar dados na store
export const importStoreData = (importData: any) => {
  try {
    if (importData.version !== '1.0.0') {
      throw new Error('Versão de dados incompatível');
    }
    
    // Valida estrutura dos dados
    if (!importData.data || !importData.timestamp) {
      throw new Error('Estrutura de dados inválida');
    }
    
    // Importa dados para a store
    if (importData.data.user) {
      store.dispatch({ type: 'user/importData', payload: importData.data.user });
    }
    if (importData.data.theme) {
      store.dispatch({ type: 'theme/importData', payload: importData.data.theme });
    }
    if (importData.data.wellness) {
      store.dispatch({ type: 'wellness/importData', payload: importData.data.wellness });
    }
    if (importData.data.community) {
      store.dispatch({ type: 'community/importData', payload: importData.data.community });
    }
    if (importData.data.mentorship) {
      store.dispatch({ type: 'mentorship/importData', payload: importData.data.mentorship });
    }
    if (importData.data.explorer) {
      store.dispatch({ type: 'explorer/importData', payload: importData.data.explorer });
    }
    if (importData.data.payment) {
      store.dispatch({ type: 'payment/importData', payload: importData.data.payment });
    }
    if (importData.data.gamification) {
      store.dispatch({ type: 'gamification/importData', payload: importData.data.gamification });
    }
    
    return {
      success: true,
      message: 'Dados importados com sucesso',
      importedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      message: 'Erro ao importar dados',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
};

// Função para limpar dados antigos
export const cleanupOldData = () => {
  const cleanupActions = [
    { type: 'workout/cleanupOldData', payload: { maxAge: 90 } }, // 90 dias
    { type: 'explorer/cleanupOldData', payload: { maxAge: 30 } }, // 30 dias
    { type: 'notification/cleanupOldData', payload: { maxAge: 60 } }, // 60 dias
    { type: 'payment/cleanupOldData', payload: { maxAge: 365 } }, // 1 ano
    { type: 'gamification/cleanupOldData', payload: { maxAge: 180 } }, // 6 meses
  ];
  
  cleanupActions.forEach(action => {
    store.dispatch(action);
  });
  
  return {
    success: true,
    message: 'Limpeza de dados antigos concluída',
    cleanedAt: new Date().toISOString(),
  };
};

// Função para obter estatísticas da store
export const getStoreStats = () => {
  const state = store.getState();
  
  return {
    timestamp: new Date().toISOString(),
    slices: {
      user: {
        isAuthenticated: state.user.isAuthenticated,
        hasCurrentUser: !!state.user.currentUser,
        pendingChanges: state.user.pendingChanges.length,
      },
      workout: {
        hasActiveSession: !!state.workout.currentSession,
        totalSessions: state.workout.sessions.length,
        pendingChanges: state.workout.pendingChanges.length,
      },
      theme: {
        currentMode: state.theme.currentMode,
        hasCustomTheme: !!state.theme.customTheme,
        isAutoEnabled: state.theme.isAutoThemeEnabled,
      },
      wellness: {
        hasNutritionPlan: !!state.wellness.currentNutritionPlan,
        hydrationReminders: state.wellness.hydrationReminders.length,
        supplementRecommendations: state.wellness.supplementRecommendations.length,
      },
      community: {
        hasCurrentCommunity: !!state.community.currentCommunity,
        totalCommunities: state.community.communities.length,
        pendingChanges: state.community.pendingChanges.length,
      },
      mentorship: {
        hasCurrentMentor: !!state.mentorship.currentMentor,
        totalSubscriptions: state.mentorship.subscriptions.length,
        pendingChanges: state.mentorship.pendingChanges.length,
      },
      explorer: {
        hasActiveSession: !!state.explorer.activeSession,
        discoveredPoints: state.explorer.discoveredPoints.length,
        achievements: state.explorer.achievements.length,
        pendingChanges: state.explorer.pendingChanges.length,
      },
      notification: {
        totalTemplates: state.notification.templates.length,
        userNotifications: state.notification.userNotifications.length,
        pendingChanges: state.notification.pendingChanges.length,
      },
      payment: {
        paymentMethods: state.payment.paymentMethods.length,
        totalTransactions: state.payment.transactions.length,
        activeSubscriptions: state.payment.subscriptions.filter(s => s.status === 'active').length,
        pendingChanges: state.payment.pendingChanges.length,
      },
      gamification: {
        totalAchievements: state.gamification.achievements.length,
        totalQuests: state.gamification.quests.length,
        hasCurrentProfile: !!state.gamification.currentUserProfile,
        pendingChanges: state.gamification.pendingChanges.length,
      },
    },
    totalPendingChanges: [
      state.user.pendingChanges,
      state.workout.pendingChanges,
      state.community.pendingChanges,
      state.mentorship.pendingChanges,
      state.explorer.pendingChanges,
      state.notification.pendingChanges,
      state.payment.pendingChanges,
      state.gamification.pendingChanges,
    ].reduce((total, changes) => total + changes.length, 0),
    storageSize: {
      estimated: 'Calculando...', // Seria calculado baseado nos dados reais
      lastSync: state.user.lastSync,
    },
  };
};

export default store;