import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../Hooks/useTheme';

interface Props {
  children: ReactNode;
  error?: string;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundaryClass extends Component<Props & { theme: any }, State> {
  constructor(props: Props & { theme: any }) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log do erro para análise
    console.error('ErrorBoundary capturou um erro:', error, errorInfo);
    
    // Aqui você pode enviar o erro para serviços de monitoramento
    // como Sentry, Crashlytics, etc.
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    const { theme } = this.props;
    const { hasError, error, errorInfo } = this.state;

    if (hasError || this.props.error) {
      return (
        <ErrorScreen
          error={this.props.error || error?.message || 'Erro desconhecido'}
          errorInfo={errorInfo}
          onRetry={this.props.onRetry || this.handleRetry}
          theme={theme}
        />
      );
    }

    return this.props.children;
  }
}

// Componente de tela de erro
interface ErrorScreenProps {
  error: string;
  errorInfo?: ErrorInfo | null;
  onRetry: () => void;
  theme: any;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ error, errorInfo, onRetry, theme }) => {
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Ícone de erro */}
        <View style={[styles.errorIcon, { backgroundColor: theme.colors.error }]}>
          <Text style={styles.errorIconText}>⚠️</Text>
        </View>

        {/* Título do erro */}
        <Text style={[styles.errorTitle, { color: theme.colors.text }]}>
          Ops! Algo deu errado
        </Text>

        {/* Mensagem do erro */}
        <Text style={[styles.errorMessage, { color: theme.colors.textSecondary }]}>
          {error}
        </Text>

        {/* Informações técnicas (apenas em desenvolvimento) */}
        {__DEV__ && errorInfo && (
          <View style={[styles.technicalInfo, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.technicalTitle, { color: theme.colors.text }]}>
              Informações Técnicas:
            </Text>
            <Text style={[styles.technicalText, { color: theme.colors.textSecondary }]}>
              {errorInfo.componentStack}
            </Text>
          </View>
        )}

        {/* Botão de retry */}
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <Text style={[styles.retryButtonText, { color: theme.colors.onPrimary }]}>
            Tentar Novamente
          </Text>
        </TouchableOpacity>

        {/* Botão de reportar erro */}
        <TouchableOpacity
          style={[styles.reportButton, { borderColor: theme.colors.border }]}
          onPress={() => {
            // Implementar report de erro
            console.log('Reportar erro:', error);
          }}
          activeOpacity={0.8}
        >
          <Text style={[styles.reportButtonText, { color: theme.colors.textSecondary }]}>
            Reportar Erro
          </Text>
        </TouchableOpacity>

        {/* Informações de contato */}
        <View style={styles.contactInfo}>
          <Text style={[styles.contactText, { color: theme.colors.textTertiary }]}>
            Se o problema persistir, entre em contato conosco
          </Text>
          <Text style={[styles.contactEmail, { color: theme.colors.primary }]}>
            suporte@runtracker.com
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

// Wrapper para usar o hook useTheme
const ErrorBoundary: React.FC<Props> = (props) => {
  const { theme } = useTheme();
  return <ErrorBoundaryClass {...props} theme={theme} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  errorIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  errorIconText: {
    fontSize: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    maxWidth: 300,
  },
  technicalInfo: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    width: '100%',
    maxWidth: 400,
  },
  technicalTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  technicalText: {
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
    minWidth: 200,
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  reportButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 32,
    minWidth: 200,
    alignItems: 'center',
    borderWidth: 1,
  },
  reportButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  contactInfo: {
    alignItems: 'center',
    marginTop: 16,
  },
  contactText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
    opacity: 0.7,
  },
  contactEmail: {
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export default ErrorBoundary;