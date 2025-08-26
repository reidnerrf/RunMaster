import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setupListeners } from '@reduxjs/toolkit/query';

// Reducers
import userReducer from './slices/userSlice';
import workoutReducer from './slices/workoutSlice';
import wellnessReducer from './slices/wellnessSlice';
import communityReducer from './slices/communitySlice';
import mentorshipReducer from './slices/mentorshipSlice';
import explorerReducer from './slices/explorerSlice';
import themeReducer from './slices/themeSlice';
import notificationReducer from './slices/notificationSlice';
import paymentReducer from './slices/paymentSlice';
import gamificationReducer from './slices/gamificationSlice';

// API slices
import { api } from './api/apiSlice';

// Configuração de persistência
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'user',
    'theme',
    'wellness',
    'community',
    'mentorship',
    'explorer',
    'gamification',
  ],
  blacklist: [
    'workout', // Não persiste dados de workout em tempo real
    'notification', // Notificações são temporárias
    'payment', // Dados de pagamento são sensíveis
    'api', // Cache da API é gerenciado separadamente
  ],
  // Configurações de migração
  migrate: (state: any) => {
    // Lógica de migração para versões futuras
    return Promise.resolve(state);
  },
  // Configurações de serialização
  serialize: true,
  deserialize: true,
  // Timeout para operações de persistência
  timeout: 10000,
  // Debounce para operações de persistência
  debounce: 1000,
};

// Combina todos os reducers
const rootReducer = combineReducers({
  user: userReducer,
  workout: workoutReducer,
  wellness: wellnessReducer,
  community: communityReducer,
  mentorship: mentorshipReducer,
  explorer: explorerReducer,
  theme: themeReducer,
  notification: notificationReducer,
  payment: paymentReducer,
  gamification: gamificationReducer,
  [api.reducerPath]: api.reducer,
});

// Reducer persistido
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configuração da store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Configurações de serialização
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: ['workout.currentSession', 'notification.tempNotifications'],
      },
      // Configurações de imutabilidade
      immutableCheck: {
        ignoredPaths: ['workout.currentSession', 'notification.tempNotifications'],
      },
    }).concat(api.middleware),
  // Configurações de desenvolvimento
  devTools: __DEV__,
  // Configurações de performance
  enhancers: (defaultEnhancers) => {
    if (__DEV__) {
      // Adiciona enhancers de desenvolvimento
      const { composeWithDevTools } = require('redux-devtools-extension');
      return composeWithDevTools(...defaultEnhancers);
    }
    return defaultEnhancers;
  },
});

// Configura listeners para sincronização
setupListeners(store.dispatch);

// Persistor para persistência
export const persistor = persistStore(store, {
  // Callbacks de persistência
  onBeforeLift: () => {
    console.log('Persistência iniciando...');
  },
  onAfterLift: () => {
    console.log('Persistência concluída');
  },
  onError: (error: Error) => {
    console.error('Erro na persistência:', error);
  },
});

// Tipos para TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Hooks tipados
export type AppStore = typeof store;
export type AppPersistor = typeof persistor;

// Configurações de performance
export const storeConfig = {
  // Tamanho máximo do estado
  maxStateSize: 50 * 1024 * 1024, // 50MB
  // Tempo máximo de persistência
  maxPersistTime: 30000, // 30s
  // Debounce para operações
  debounceTime: 1000, // 1s
  // Configurações de cache
  cacheConfig: {
    maxAge: 24 * 60 * 60 * 1000, // 24h
    maxSize: 100, // 100 itens
  },
};

// Utilitários da store
export const storeUtils = {
  // Verifica se o estado está muito grande
  isStateTooLarge: (state: RootState) => {
    const stateSize = JSON.stringify(state).length;
    return stateSize > storeConfig.maxStateSize;
  },
  
  // Limpa estado antigo
  cleanupOldState: () => {
    const state = store.getState();
    const now = Date.now();
    
    // Remove dados antigos de workout
    if (state.workout.history.length > 100) {
      store.dispatch({
        type: 'workout/cleanupHistory',
        payload: { maxItems: 100 },
      });
    }
    
    // Remove notificações antigas
    if (state.notification.history.length > 50) {
      store.dispatch({
        type: 'notification/cleanupHistory',
        payload: { maxItems: 50 },
      });
    }
  },
  
  // Otimiza estado para persistência
  optimizeStateForPersistence: (state: RootState) => {
    const optimizedState = { ...state };
    
    // Remove dados temporários
    delete optimizedState.workout.currentSession;
    delete optimizedState.notification.tempNotifications;
    
    // Comprime dados grandes
    if (optimizedState.workout.history.length > 0) {
      optimizedState.workout.history = optimizedState.workout.history.map(workout => ({
        id: workout.id,
        date: workout.date,
        distance: workout.distance,
        duration: workout.duration,
        calories: workout.calories,
        // Remove dados detalhados para economizar espaço
      }));
    }
    
    return optimizedState;
  },
};

// Middleware customizado para logging
export const loggingMiddleware = (store: any) => (next: any) => (action: any) => {
  if (__DEV__) {
    console.group(action.type);
    console.log('Previous State:', store.getState());
    console.log('Action:', action);
    const result = next(action);
    console.log('Next State:', store.getState());
    console.groupEnd();
    return result;
  }
  return next(action);
};

// Middleware customizado para performance
export const performanceMiddleware = (store: any) => (next: any) => (action: any) => {
  const startTime = performance.now();
  const result = next(action);
  const endTime = performance.now();
  
  // Log de performance para ações lentas
  if (endTime - startTime > 16) { // Mais de 16ms (60fps)
    console.warn(`Action ${action.type} took ${endTime - startTime}ms`);
  }
  
  return result;
};

// Middleware customizado para sincronização
export const syncMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);
  
  // Sincroniza com backend para ações específicas
  if (action.type?.startsWith('user/') || 
      action.type?.startsWith('workout/') ||
      action.type?.startsWith('wellness/')) {
    // Implementar sincronização aqui
    store.dispatch({ type: 'sync/queueAction', payload: action });
  }
  
  return result;
};

// Aplica middlewares customizados
if (__DEV__) {
  store.dispatch = loggingMiddleware(store)(store.dispatch);
}

store.dispatch = performanceMiddleware(store)(store.dispatch);
store.dispatch = syncMiddleware(store)(store.dispatch);

// Exporta store configurada
export default store;