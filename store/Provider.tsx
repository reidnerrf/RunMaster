import React, { useEffect, useState } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './index';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../Hooks/useTheme';

// Componente de loading personalizado
const LoadingScreen: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={[styles.loadingText, { color: theme.colors.text }]}>
        Carregando aplicação...
      </Text>
      <Text style={[styles.loadingSubtext, { color: theme.colors.textSecondary }]}>
        Sincronizando dados...
      </Text>
    </View>
  );
};

// Componente de erro
const ErrorScreen: React.FC<{ error: string; onRetry: () => void }> = ({ error, onRetry }) => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.errorIcon, { color: theme.colors.error }]}>⚠️</Text>
      <Text style={[styles.errorTitle, { color: theme.colors.text }]}>
        Erro ao carregar
      </Text>
      <Text style={[styles.errorMessage, { color: theme.colors.textSecondary }]}>
        {error}
      </Text>
      <Text style={[styles.retryText, { color: theme.colors.primary }]} onPress={onRetry}>
        Tentar novamente
      </Text>
    </View>
  );
};

// Provider principal da aplicação
interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPersistReady, setIsPersistReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simula inicialização da aplicação
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Verifica integridade dos dados
        const { checkDataIntegrity } = await import('./index');
        const integrityCheck = checkDataIntegrity();
        
        if (integrityCheck.hasIssues) {
          console.warn('Problemas de integridade detectados:', integrityCheck.issues);
        }
        
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    // Recarrega a aplicação
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handlePersistReady = () => {
    setIsPersistReady(true);
  };

  if (error) {
    return <ErrorScreen error={error} onRetry={handleRetry} />;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ReduxProvider store={store}>
      <PersistGate
        loading={<LoadingScreen />}
        persistor={persistor}
        onBeforeLift={handlePersistReady}
      >
        {children}
      </PersistGate>
    </ReduxProvider>
  );
};

// Provider para desenvolvimento
export const DevProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [showDevTools, setShowDevTools] = useState(false);

  useEffect(() => {
    if (__DEV__) {
      // Mostra DevTools em desenvolvimento
      setShowDevTools(true);
    }
  }, []);

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        {children}
        {showDevTools && __DEV__ && (
          <View style={styles.devToolsContainer}>
            <Text style={styles.devToolsText}>🛠️ DevTools Ativo</Text>
          </View>
        )}
      </PersistGate>
    </ReduxProvider>
  );
};

// Provider condicional baseado no ambiente
export const ConditionalProvider: React.FC<AppProviderProps> = ({ children }) => {
  if (__DEV__) {
    return <DevProvider>{children}</DevProvider>;
  }
  
  return <AppProvider>{children}</AppProvider>;
};

// Estilos
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  devToolsContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  devToolsText: {
    color: '#00FF00',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ConditionalProvider;