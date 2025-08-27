import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { useTheme } from '../Hooks/useTheme';
import {
  AccessibleContainer,
  AccessibleText,
  AccessibleButton,
} from '../Components/AccessibleComponents';
import { AnimatedEntry, AnimatedTransition } from '../Components/AnimatedComponents';
import SwipeActions from '../Components/SwipeActions';
import PullToAction from '../Components/PullToAction';
import ThreeDTouch from '../Components/ThreeDTouch';
import {
  Spinner,
  DotsLoader,
  PulseLoader,
  WaveLoader,
  ProgressBar,
  Skeleton,
  LoadingScreen,
} from '../Components/AdvancedLoading';
import { SwipeActionConfig, PullToActionConfig } from '../utils/gestureService';

const { width: screenWidth } = Dimensions.get('window');

const AdvancedUIScreen: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'swipe' | 'pull' | '3dtouch' | 'loading' | 'demo'>('swipe');
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Configurações de swipe actions
  const swipeActions: SwipeActionConfig[] = [
    {
      id: 'edit',
      title: 'Editar',
      icon: '✏️',
      color: '#FFFFFF',
      backgroundColor: '#007AFF',
      action: () => Alert.alert('Swipe Action', 'Editar acionado!'),
      hapticFeedback: true,
      hapticType: 'light',
    },
    {
      id: 'delete',
      title: 'Excluir',
      icon: '🗑️',
      color: '#FFFFFF',
      backgroundColor: '#FF3B30',
      action: () => Alert.alert('Swipe Action', 'Excluir acionado!'),
      hapticFeedback: true,
      hapticType: 'medium',
    },
    {
      id: 'share',
      title: 'Compartilhar',
      icon: '📤',
      color: '#FFFFFF',
      backgroundColor: '#34C759',
      action: () => Alert.alert('Swipe Action', 'Compartilhar acionado!'),
      hapticFeedback: true,
      hapticType: 'light',
    },
  ];

  // Configurações de pull-to-action
  const pullToActionConfig: PullToActionConfig = {
    threshold: 100,
    action: () => Alert.alert('Pull to Action', 'Ação acionada!'),
    hapticFeedback: true,
    hapticType: 'medium',
    visualFeedback: true,
    animationDuration: 300,
  };

  // Função para simular progresso
  const simulateProgress = () => {
    setIsLoading(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 1) {
          clearInterval(interval);
          setIsLoading(false);
          return 1;
        }
        return prev + 0.1;
      });
    }, 100);
  };

  // Renderizar demonstração de swipe actions
  const renderSwipeActionsDemo = () => (
    <AccessibleContainer variant="section">
      <AccessibleText variant="title" size="large">
        👆 Swipe Actions
      </AccessibleText>
      
      <AccessibleText variant="body" size="medium" style={styles.description}>
        Deslize para a direita para ver as ações disponíveis
      </AccessibleText>
      
      <View style={styles.demoContainer}>
        {/* Item com swipe actions */}
        <SwipeActions
          actions={swipeActions}
          direction="right"
          threshold={80}
          hapticFeedback={true}
          onSwipeStart={() => console.log('Swipe iniciado')}
          onSwipeEnd={() => console.log('Swipe finalizado')}
          onActionTrigger={(actionId) => console.log('Ação acionada:', actionId)}
        >
          <AccessibleContainer variant="card" style={styles.swipeItem}>
            <View style={styles.itemContent}>
              <View style={styles.itemIcon}>📱</View>
              <View style={styles.itemText}>
                <AccessibleText variant="subtitle" size="medium">
                  Item de Exemplo
                </AccessibleText>
                <AccessibleText variant="body" size="small" style={styles.itemDescription}>
                  Deslize para a direita para ver as ações
                </AccessibleText>
              </View>
            </View>
          </AccessibleContainer>
        </SwipeActions>
        
        {/* Instruções */}
        <View style={styles.instructions}>
          <AccessibleText variant="caption" size="small" style={styles.instructionText}>
            💡 Deslize para a direita para ver as ações disponíveis
          </AccessibleText>
        </View>
      </View>
    </AccessibleContainer>
  );

  // Renderizar demonstração de pull-to-action
  const renderPullToActionDemo = () => (
    <AccessibleContainer variant="section">
      <AccessibleText variant="title" size="large">
        🔽 Pull-to-Action
      </AccessibleText>
      
      <AccessibleText variant="body" size="medium" style={styles.description}>
        Puxe para baixo para ativar a ação
      </AccessibleText>
      
      <View style={styles.demoContainer}>
        <PullToAction
          config={pullToActionConfig}
          direction="down"
          threshold={100}
          maxPullDistance={200}
          hapticFeedback={true}
          visualFeedback={true}
          onPullStart={() => console.log('Pull iniciado')}
          onPullProgress={(progress) => console.log('Progresso:', progress)}
          onPullEnd={() => console.log('Pull finalizado')}
          onActionTrigger={() => console.log('Ação acionada')}
        >
          <AccessibleContainer variant="card" style={styles.pullItem}>
            <View style={styles.itemContent}>
              <View style={styles.itemIcon}>🔄</View>
              <View style={styles.itemText}>
                <AccessibleText variant="subtitle" size="medium">
                  Pull to Refresh
                </AccessibleText>
                <AccessibleText variant="body" size="small" style={styles.itemDescription}>
                  Puxe para baixo para atualizar
                </AccessibleText>
              </View>
            </View>
          </AccessibleContainer>
        </PullToAction>
        
        {/* Instruções */}
        <View style={styles.instructions}>
          <AccessibleText variant="caption" size="small" style={styles.instructionText}>
            💡 Puxe para baixo para ativar a ação
          </AccessibleText>
        </View>
      </View>
    </AccessibleContainer>
  );

  // Renderizar demonstração de 3D Touch
  const render3DTouchDemo = () => (
    <AccessibleContainer variant="section">
      <AccessibleText variant="title" size="large">
        📱 3D Touch
      </AccessibleText>
      
      <AccessibleText variant="body" size="medium" style={styles.description}>
        Pressione com força para ativar funcionalidades especiais
      </AccessibleText>
      
      <View style={styles.demoContainer}>
        <ThreeDTouch
          threshold={0.5}
          hapticFeedback={true}
          hapticType="medium"
          visualFeedback={true}
          onPress={() => Alert.alert('3D Touch', 'Toque normal')}
          onLongPress={() => Alert.alert('3D Touch', 'Toque longo')}
          on3DTouch={(pressure) => Alert.alert('3D Touch', `Pressão: ${pressure.toFixed(2)}`)}
          on3DTouchStart={() => console.log('3D Touch iniciado')}
          on3DTouchEnd={() => console.log('3D Touch finalizado')}
        >
          <AccessibleContainer variant="card" style={styles.touchItem}>
            <View style={styles.itemContent}>
              <View style={styles.itemIcon}>👆</View>
              <View style={styles.itemText}>
                <AccessibleText variant="subtitle" size="medium">
                  Toque 3D
                </AccessibleText>
                <AccessibleText variant="body" size="small" style={styles.itemDescription}>
                  Pressione com força para ativar
                </AccessibleText>
              </View>
            </View>
          </AccessibleContainer>
        </ThreeDTouch>
        
        {/* Instruções */}
        <View style={styles.instructions}>
          <AccessibleText variant="caption" size="small" style={styles.instructionText}>
            💡 Pressione com força para ativar o 3D Touch
          </AccessibleText>
        </View>
      </View>
    </AccessibleContainer>
  );

  // Renderizar demonstração de loading
  const renderLoadingDemo = () => (
    <AccessibleContainer variant="section">
      <AccessibleText variant="title" size="large">
        ⏳ Componentes de Loading
      </AccessibleText>
      
      <AccessibleText variant="body" size="medium" style={styles.description}>
        Diferentes tipos de indicadores de carregamento
      </AccessibleText>
      
      <View style={styles.demoContainer}>
        {/* Spinners */}
        <View style={styles.loadingSection}>
          <AccessibleText variant="subtitle" size="medium" style={styles.sectionTitle}>
            Spinners
          </AccessibleText>
          <View style={styles.loadingRow}>
            <Spinner size={40} color={theme.colors.primary} />
            <Spinner size={40} color={theme.colors.secondary} thickness={6} />
            <Spinner size={40} color={theme.colors.accent} duration={2000} />
          </View>
        </View>
        
        {/* Dots */}
        <View style={styles.loadingSection}>
          <AccessibleText variant="subtitle" size="medium" style={styles.sectionTitle}>
            Pontos Pulsantes
          </AccessibleText>
          <View style={styles.loadingRow}>
            <DotsLoader color={theme.colors.primary} size={8} />
            <DotsLoader color={theme.colors.secondary} size={10} />
            <DotsLoader color={theme.colors.accent} size={12} />
          </View>
        </View>
        
        {/* Pulse */}
        <View style={styles.loadingSection}>
          <AccessibleText variant="subtitle" size="medium" style={styles.sectionTitle}>
            Pulso
          </AccessibleText>
          <View style={styles.loadingRow}>
            <PulseLoader color={theme.colors.primary} size={40} />
            <PulseLoader color={theme.colors.secondary} size={50} />
            <PulseLoader color={theme.colors.accent} size={60} />
          </View>
        </View>
        
        {/* Wave */}
        <View style={styles.loadingSection}>
          <AccessibleText variant="subtitle" size="medium" style={styles.sectionTitle}>
            Onda
          </AccessibleText>
          <View style={styles.loadingRow}>
            <WaveLoader color={theme.colors.primary} size={40} />
            <WaveLoader color={theme.colors.secondary} size={50} />
            <WaveLoader color={theme.colors.accent} size={60} />
          </View>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.loadingSection}>
          <AccessibleText variant="subtitle" size="medium" style={styles.sectionTitle}>
            Barra de Progresso
          </AccessibleText>
          <View style={styles.progressContainer}>
            <ProgressBar
              progress={progress}
              width={200}
              height={8}
              color={theme.colors.primary}
              backgroundColor={theme.colors.border}
              animated={true}
            />
            <AccessibleButton
              title="Simular Progresso"
              variant="outline"
              size="small"
              onPress={simulateProgress}
              style={styles.progressButton}
            />
          </View>
        </View>
        
        {/* Skeleton */}
        <View style={styles.loadingSection}>
          <AccessibleText variant="subtitle" size="medium" style={styles.sectionTitle}>
            Skeleton Loading
          </AccessibleText>
          <View style={styles.skeletonContainer}>
            <Skeleton width={60} height={60} borderRadius={30} animated={true} />
            <View style={styles.skeletonText}>
              <Skeleton width={150} height={20} borderRadius={4} animated={true} />
              <Skeleton width={100} height={16} borderRadius={4} animated={true} />
            </View>
          </View>
        </View>
        
        {/* Loading Screen */}
        <View style={styles.loadingSection}>
          <AccessibleText variant="subtitle" size="medium" style={styles.sectionTitle}>
            Loading Screen
          </AccessibleText>
          <View style={styles.loadingScreenContainer}>
            <LoadingScreen
              message="Carregando dados..."
              showProgress={true}
              progress={progress}
              type="spinner"
            />
          </View>
        </View>
      </View>
    </AccessibleContainer>
  );

  // Renderizar demonstração interativa
  const renderInteractiveDemo = () => (
    <AccessibleContainer variant="section">
      <AccessibleText variant="title" size="large">
        🎮 Demonstração Interativa
      </AccessibleText>
      
      <AccessibleText variant="body" size="medium" style={styles.description}>
        Teste todos os componentes em uma experiência integrada
      </AccessibleText>
      
      <View style={styles.demoContainer}>
        {/* Card interativo com todas as funcionalidades */}
        <SwipeActions
          actions={swipeActions}
          direction="right"
          threshold={80}
          hapticFeedback={true}
        >
          <PullToAction
            config={pullToActionConfig}
            direction="down"
            threshold={100}
            hapticFeedback={true}
          >
            <ThreeDTouch
              threshold={0.5}
              hapticFeedback={true}
              visualFeedback={true}
              onPress={() => Alert.alert('Interativo', 'Toque normal')}
              on3DTouch={(pressure) => Alert.alert('Interativo', `3D Touch: ${pressure.toFixed(2)}`)}
            >
              <AccessibleContainer variant="card" style={styles.interactiveCard}>
                <View style={styles.itemContent}>
                  <View style={styles.itemIcon}>🚀</View>
                  <View style={styles.itemText}>
                    <AccessibleText variant="subtitle" size="medium">
                      Card Interativo
                    </AccessibleText>
                    <AccessibleText variant="body" size="small" style={styles.itemDescription}>
                      • Deslize para direita para ações
                      {'\n'}• Puxe para baixo para refresh
                      {'\n'}• Pressione para 3D Touch
                    </AccessibleText>
                  </View>
                </View>
              </AccessibleContainer>
            </ThreeDTouch>
          </PullToAction>
        </SwipeActions>
        
        {/* Instruções */}
        <View style={styles.instructions}>
          <AccessibleText variant="caption" size="small" style={styles.instructionText}>
            💡 Este card combina todas as funcionalidades
          </AccessibleText>
        </View>
      </View>
    </AccessibleContainer>
  );

  // Renderizar abas
  const renderTabs = () => {
    const tabs = [
      { id: 'swipe', title: 'Swipe Actions', icon: '👆' },
      { id: 'pull', title: 'Pull-to-Action', icon: '🔽' },
      { id: '3dtouch', title: '3D Touch', icon: '📱' },
      { id: 'loading', title: 'Loading', icon: '⏳' },
      { id: 'demo', title: 'Interativo', icon: '🎮' },
    ];

    return (
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <AccessibleButton
            key={tab.id}
            title={`${tab.icon} ${tab.title}`}
            variant={activeTab === tab.id ? 'primary' : 'ghost'}
            size="small"
            onPress={() => setActiveTab(tab.id as any)}
            style={styles.tabButton}
          />
        ))}
      </View>
    );
  };

  // Renderizar conteúdo da aba ativa
  const renderTabContent = () => {
    switch (activeTab) {
      case 'swipe':
        return renderSwipeActionsDemo();
      case 'pull':
        return renderPullToActionDemo();
      case '3dtouch':
        return render3DTouchDemo();
      case 'loading':
        return renderLoadingDemo();
      case 'demo':
        return renderInteractiveDemo();
      default:
        return null;
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabeçalho */}
      <AccessibleContainer variant="section">
        <AccessibleText variant="title" size="extraLarge">
          🎨 Componentes de UI Avançados
        </AccessibleText>
        <AccessibleText variant="subtitle" size="medium" style={styles.subtitle}>
          Experimente todas as funcionalidades avançadas de interface
        </AccessibleText>
      </AccessibleContainer>

      {/* Abas */}
      {renderTabs()}

      {/* Conteúdo da aba ativa */}
      {renderTabContent()}
    </ScrollView>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.8,
  },
  tabContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    minWidth: '30%',
  },
  description: {
    marginTop: 8,
    marginBottom: 16,
    opacity: 0.8,
  },
  demoContainer: {
    marginTop: 16,
  },
  swipeItem: {
    marginBottom: 16,
  },
  pullItem: {
    marginBottom: 16,
  },
  touchItem: {
    marginBottom: 16,
  },
  interactiveCard: {
    marginBottom: 16,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  itemIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  itemText: {
    flex: 1,
  },
  itemDescription: {
    marginTop: 4,
    opacity: 0.7,
    lineHeight: 18,
  },
  instructions: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  instructionText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loadingSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    textAlign: 'center',
  },
  loadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressContainer: {
    alignItems: 'center',
    gap: 12,
  },
  progressButton: {
    marginTop: 8,
  },
  skeletonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  skeletonText: {
    marginLeft: 16,
    gap: 8,
  },
  loadingScreenContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default AdvancedUIScreen;