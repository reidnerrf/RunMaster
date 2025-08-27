import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ReanimatedProvider } from 'react-native-reanimated';

// Providers e Store
import ConditionalProvider from './store/Provider';
import { persistor, store } from './store';
import { 
  checkDataIntegrity, 
  syncPendingChanges, 
  getStoreStats,
  backupStore 
} from './store/utils';

// Hooks
import { useTheme } from './Hooks/useTheme';
import { useAppDispatch, useAppSelector } from './store/hooks';

// Componentes
import MainTabs from './Screens/MainTabs';
import LoadingScreen from './Components/LoadingScreen';
import ErrorBoundary from './Components/ErrorBoundary';

// Utilitários
import { initializeApp } from './utils/appInitializer';
import { setupPushNotifications } from './utils/pushNotifications';
import { setupLocationServices } from './utils/locationServices';
import { setupHealthKit } from './utils/healthKit';

// Tipos
interface AppState {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  initializationStep: string;
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    isInitialized: false,
    isLoading: true,
    error: null,
    initializationStep: 'Iniciando aplicação...',
  });

  useEffect(() => {
    const initializeApplication = async () => {
      try {
        setAppState(prev => ({ ...prev, isLoading: true, error: null }));

        // Passo 1: Verificar integridade dos dados
        setAppState(prev => ({ ...prev, initializationStep: 'Verificando integridade dos dados...' }));
        const integrityCheck = checkDataIntegrity();
        if (integrityCheck.hasIssues) {
          console.warn('Problemas de integridade detectados:', integrityCheck.issues);
        }

        // Passo 2: Inicializar serviços da aplicação
        setAppState(prev => ({ ...prev, initializationStep: 'Inicializando serviços...' }));
        await initializeApp();

        // Passo 3: Configurar notificações push
        setAppState(prev => ({ ...prev, initializationStep: 'Configurando notificações...' }));
        await setupPushNotifications();

        // Passo 4: Configurar serviços de localização
        setAppState(prev => ({ ...prev, initializationStep: 'Configurando localização...' }));
        await setupLocationServices();

        // Passo 5: Configurar HealthKit (iOS)
        setAppState(prev => ({ ...prev, initializationStep: 'Configurando HealthKit...' }));
        await setupHealthKit();

        // Passo 6: Sincronizar mudanças pendentes
        setAppState(prev => ({ ...prev, initializationStep: 'Sincronizando dados...' }));
        const syncResult = await syncPendingChanges();
        if (syncResult.success) {
          console.log('Sincronização concluída:', syncResult.message);
        }

        // Passo 7: Fazer backup automático
        setAppState(prev => ({ ...prev, initializationStep: 'Fazendo backup...' }));
        try {
          const backup = await backupStore();
          console.log('Backup automático criado:', backup.timestamp);
        } catch (error) {
          console.warn('Erro no backup automático:', error);
        }

        // Passo 8: Obter estatísticas da store
        setAppState(prev => ({ ...prev, initializationStep: 'Finalizando...' }));
        const stats = getStoreStats();
        console.log('Estatísticas da store:', stats);

        // Aplicação inicializada com sucesso
        setAppState({
          isInitialized: true,
          isLoading: false,
          error: null,
          initializationStep: 'Aplicação pronta!',
        });

      } catch (error) {
        console.error('Erro na inicialização:', error);
        setAppState({
          isInitialized: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido na inicialização',
          initializationStep: 'Erro na inicialização',
        });
      }
    };

    initializeApplication();
  }, []);

  // Configurar listeners para mudanças na store
  useEffect(() => {
    if (appState.isInitialized) {
      // Listener para mudanças na store
      const unsubscribe = store.subscribe(() => {
        const state = store.getState();
        
        // Verifica se há mudanças pendentes para sincronizar
        const totalPending = [
          state.user.pendingChanges,
          state.workout.pendingChanges,
          state.community.pendingChanges,
          state.mentorship.pendingChanges,
          state.explorer.pendingChanges,
          state.notification.pendingChanges,
          state.payment.pendingChanges,
          state.gamification.pendingChanges,
        ].reduce((total, changes) => total + changes.length, 0);


        if (totalPending > 0) {
          console.log(`${totalPending} mudanças pendentes para sincronizar`);
        }
      });

      return unsubscribe;
    }
  }, [appState.isInitialized]);

  // Tela de loading durante inicialização
  if (appState.isLoading) {
    return (
      <LoadingScreen 
        message={appState.initializationStep}
        showProgress={true}
      />
    );
  }

  // Tela de erro
  if (appState.error) {
    return (
      <ErrorBoundary 
        error={appState.error}
        onRetry={() => {
          setAppState({
            isInitialized: false,
            isLoading: true,
            error: null,
            initializationStep: 'Reiniciando...',
          });
        }}
      />
    );
  }

  // Aplicação principal
  return (
    <ErrorBoundary>
      <ConditionalProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ReanimatedProvider>
            <SafeAreaProvider>
              <StatusBar style="auto" />
              <MainTabs />
            </SafeAreaProvider>
          </ReanimatedProvider>
        </GestureHandlerRootView>
      </ConditionalProvider>
    </ErrorBoundary>
  );
};

export default App;