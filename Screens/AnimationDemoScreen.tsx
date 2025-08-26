import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { useTheme } from '../Hooks/useTheme';
import {
  AccessibleContainer,
  AccessibleText,
  AccessibleButton,
} from '../Components/AccessibleComponents';
import {
  AnimatedEntry,
  AnimatedTransition,
  AnimatedInteraction,
  AnimatedSkeleton,
  AnimatedPullToRefresh,
  AnimatedList,
} from '../Components/AnimatedComponents';
import {
  getPerformanceMetrics,
  getActiveAnimations,
  getQueueSize,
  clearQueue,
  cancelAllAnimations,
} from '../utils/animationService';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Interface para item de demonstração
interface DemoItem {
  id: string;
  title: string;
  description: string;
  type: 'entry' | 'transition' | 'interaction' | 'skeleton' | 'pullToRefresh' | 'list';
}

// Dados de demonstração
const demoData: DemoItem[] = [
  {
    id: '1',
    title: 'Animações de Entrada',
    description: 'Diferentes tipos de animações quando elementos aparecem na tela',
    type: 'entry',
  },
  {
    id: '2',
    title: 'Transições de Tela',
    description: 'Animações suaves entre diferentes estados da interface',
    type: 'transition',
  },
  {
    id: '3',
    title: 'Micro-interações',
    description: 'Feedback visual para ações do usuário',
    type: 'interaction',
  },
  {
    id: '4',
    title: 'Skeleton Loading',
    description: 'Placeholders animados durante carregamento',
    type: 'skeleton',
  },
  {
    id: '5',
    title: 'Pull-to-Refresh',
    description: 'Animações personalizadas para atualização',
    type: 'pullToRefresh',
  },
  {
    id: '6',
    title: 'Listas Animadas',
    description: 'Animações em sequência para itens de lista',
    type: 'list',
  },
];

const AnimationDemoScreen: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'demo' | 'performance' | 'settings'>('demo');
  const [isTransitionVisible, setIsTransitionVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [activeAnimations, setActiveAnimations] = useState(0);
  const [queueSize, setQueueSize] = useState(0);

  // Atualizar métricas de performance
  useEffect(() => {
    const updateMetrics = () => {
      setPerformanceMetrics(getPerformanceMetrics());
      setActiveAnimations(getActiveAnimations());
      setQueueSize(getQueueSize());
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 1000);

    return () => clearInterval(interval);
  }, []);

  // Simular refresh
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert('Sucesso', 'Conteúdo atualizado!');
    }, 2000);
  };

  // Renderizar demonstração de animações de entrada
  const renderEntryAnimations = () => (
    <AccessibleContainer variant="section">
      <AccessibleText variant="title" size="large">
        Animações de Entrada
      </AccessibleText>
      
      <View style={styles.animationGrid}>
        {/* Fade In */}
        <AnimatedEntry
          enterAnimation={{ type: 'fade', duration: 800, delay: 0 }}
          style={styles.animationCard}
        >
          <AccessibleContainer variant="card">
            <AccessibleText variant="subtitle" size="medium">
              Fade In
            </AccessibleText>
            <AccessibleText variant="body" size="small">
              Aparece suavemente
            </AccessibleText>
          </AccessibleContainer>
        </AnimatedEntry>

        {/* Slide Up */}
        <AnimatedEntry
          enterAnimation={{ type: 'slide', direction: 'up', distance: 100, duration: 600, delay: 200 }}
          style={styles.animationCard}
        >
          <AccessibleContainer variant="card">
            <AccessibleText variant="subtitle" size="medium">
              Slide Up
            </AccessibleText>
            <AccessibleText variant="body" size="small">
              Desliza de baixo
            </AccessibleText>
          </AccessibleContainer>
        </AnimatedEntry>

        {/* Scale In */}
        <AnimatedEntry
          enterAnimation={{ type: 'scale', scale: 0.5, duration: 500, delay: 400 }}
          style={styles.animationCard}
        >
          <AccessibleContainer variant="card">
            <AccessibleText variant="subtitle" size="medium">
              Scale In
            </AccessibleText>
            <AccessibleText variant="body" size="small">
              Cresce do centro
            </AccessibleText>
          </AccessibleContainer>
        </AnimatedEntry>

        {/* Bounce In */}
        <AnimatedEntry
          enterAnimation={{ type: 'bounce', duration: 1000, delay: 600 }}
          style={styles.animationCard}
        >
          <AccessibleContainer variant="card">
            <AccessibleText variant="subtitle" size="medium">
              Bounce In
            </AccessibleText>
            <AccessibleText variant="body" size="small">
              Quica na entrada
            </AccessibleText>
          </AccessibleContainer>
        </AnimatedEntry>

        {/* Elastic In */}
        <AnimatedEntry
          enterAnimation={{ type: 'elastic', duration: 1200, delay: 800 }}
          style={styles.animationCard}
        >
          <AccessibleContainer variant="card">
            <AccessibleText variant="subtitle" size="medium">
              Elastic In
            </AccessibleText>
            <AccessibleText variant="body" size="small">
              Estica e volta
            </AccessibleText>
          </AccessibleContainer>
        </AnimatedEntry>

        {/* Rotate In */}
        <AnimatedEntry
          enterAnimation={{ type: 'rotate', rotation: 180, duration: 700, delay: 1000 }}
          style={styles.animationCard}
        >
          <AccessibleContainer variant="card">
            <AccessibleText variant="subtitle" size="medium">
              Rotate In
            </AccessibleText>
            <AccessibleText variant="body" size="small">
              Gira na entrada
            </AccessibleText>
          </AccessibleContainer>
        </AnimatedEntry>
      </View>
    </AccessibleContainer>
  );

  // Renderizar demonstração de transições
  const renderTransitionAnimations = () => (
    <AccessibleContainer variant="section">
      <AccessibleText variant="title" size="large">
        Transições de Tela
      </AccessibleText>
      
      <View style={styles.transitionContainer}>
        <AccessibleButton
          title={isTransitionVisible ? "Ocultar Transição" : "Mostrar Transição"}
          variant="primary"
          size="medium"
          onPress={() => setIsTransitionVisible(!isTransitionVisible)}
          style={styles.transitionButton}
        />
        
        <AnimatedTransition
          isVisible={isTransitionVisible}
          transitionAnimation={{ type: 'slide', direction: 'horizontal', duration: 400 }}
          style={styles.transitionContent}
        >
          <AccessibleContainer variant="card">
            <AccessibleText variant="title" size="large">
              🎭 Transição Ativa
            </AccessibleText>
            <AccessibleText variant="body" size="medium">
              Esta transição demonstra como elementos podem aparecer e desaparecer suavemente.
            </AccessibleText>
            <AccessibleText variant="body" size="small">
              Use o botão acima para alternar a visibilidade e ver a animação em ação.
            </AccessibleText>
          </AccessibleContainer>
        </AnimatedTransition>
      </View>
    </AccessibleContainer>
  );

  // Renderizar demonstração de micro-interações
  const renderMicroInteractions = () => (
    <AccessibleContainer variant="section">
      <AccessibleText variant="title" size="large">
        Micro-interações
      </AccessibleText>
      
      <View style={styles.interactionGrid}>
        {/* Press */}
        <AnimatedInteraction
          microInteraction={{ type: 'press', feedback: 'combined', hapticType: 'light' }}
          onPress={() => Alert.alert('Press', 'Toque detectado!')}
          style={styles.interactionCard}
        >
          <AccessibleContainer variant="card">
            <AccessibleText variant="subtitle" size="medium">
              👆 Press
            </AccessibleText>
            <AccessibleText variant="body" size="small">
              Toque para testar
            </AccessibleText>
          </AccessibleContainer>
        </AnimatedInteraction>

        {/* Long Press */}
        <AnimatedInteraction
          microInteraction={{ type: 'longPress', feedback: 'combined', hapticType: 'medium' }}
          onLongPress={() => Alert.alert('Long Press', 'Pressione longo detectado!')}
          style={styles.interactionCard}
        >
          <AccessibleContainer variant="card">
            <AccessibleText variant="subtitle" size="medium">
              ⏰ Long Press
            </AccessibleText>
            <AccessibleText variant="body" size="small">
              Pressione longo
            </AccessibleText>
          </AccessibleContainer>
        </AnimatedInteraction>

        {/* Swipe */}
        <AnimatedInteraction
          microInteraction={{ type: 'swipe', feedback: 'combined', hapticType: 'light' }}
          onSwipe={(direction) => Alert.alert('Swipe', `Swipe detectado: ${direction}`)}
          style={styles.interactionCard}
        >
          <AccessibleContainer variant="card">
            <AccessibleText variant="subtitle" size="medium">
              👈 Swipe
            </AccessibleText>
            <AccessibleText variant="body" size="small">
              Deslize em qualquer direção
            </AccessibleText>
          </AccessibleContainer>
        </AnimatedInteraction>

        {/* Drag */}
        <AnimatedInteraction
          microInteraction={{ type: 'drag', feedback: 'combined', hapticType: 'light' }}
          onInteractionStart={() => console.log('Drag iniciado')}
          onInteractionEnd={() => console.log('Drag finalizado')}
          style={styles.interactionCard}
        >
          <AccessibleContainer variant="card">
            <AccessibleText variant="subtitle" size="medium">
              🖐️ Drag
            </AccessibleText>
            <AccessibleText variant="body" size="small">
              Arraste para testar
            </AccessibleText>
          </AccessibleContainer>
        </AnimatedInteraction>
      </View>
    </AccessibleContainer>
  );

  // Renderizar demonstração de skeleton loading
  const renderSkeletonAnimations = () => (
    <AccessibleContainer variant="section">
      <AccessibleText variant="title" size="large">
        Skeleton Loading
      </AccessibleText>
      
      <View style={styles.skeletonGrid}>
        {/* Text */}
        <View style={styles.skeletonItem}>
          <AccessibleText variant="caption" size="small">
            Texto
          </AccessibleText>
          <AnimatedSkeleton variant="text" width="100%" height={16} />
        </View>

        {/* Title */}
        <View style={styles.skeletonItem}>
          <AccessibleText variant="caption" size="small">
            Título
          </AccessibleText>
          <AnimatedSkeleton variant="title" width="100%" height={24} />
        </View>

        {/* Avatar */}
        <View style={styles.skeletonItem}>
          <AccessibleText variant="caption" size="small">
            Avatar
          </AccessibleText>
          <AnimatedSkeleton variant="avatar" width={60} height={60} />
        </View>

        {/* Button */}
        <View style={styles.skeletonItem}>
          <AccessibleText variant="caption" size="small">
            Botão
          </AccessibleText>
          <AnimatedSkeleton variant="button" width={120} height={44} />
        </View>

        {/* Card */}
        <View style={styles.skeletonItem}>
          <AccessibleText variant="caption" size="small">
            Card
          </AccessibleText>
          <AnimatedSkeleton variant="card" width="100%" height={120} />
        </View>

        {/* Circle */}
        <View style={styles.skeletonItem}>
          <AccessibleText variant="caption" size="small">
            Círculo
          </AccessibleText>
          <AnimatedSkeleton variant="circle" width={80} height={80} />
        </View>
      </View>
    </AccessibleContainer>
  );

  // Renderizar demonstração de pull-to-refresh
  const renderPullToRefresh = () => (
    <AccessibleContainer variant="section">
      <AccessibleText variant="title" size="large">
        Pull-to-Refresh
      </AccessibleText>
      
      <AccessibleText variant="body" size="medium" style={styles.refreshDescription}>
        Puxe para baixo para atualizar o conteúdo
      </AccessibleText>
      
      <AnimatedPullToRefresh
        onRefresh={handleRefresh}
        refreshing={refreshing}
        style={styles.pullToRefreshContainer}
      >
        <View style={styles.refreshContent}>
          <AccessibleContainer variant="card">
            <AccessibleText variant="subtitle" size="medium">
              📱 Conteúdo Atualizável
            </AccessibleText>
            <AccessibleText variant="body" size="small">
              Este conteúdo pode ser atualizado puxando para baixo.
            </AccessibleText>
            <AccessibleText variant="caption" size="small">
              Última atualização: {new Date().toLocaleTimeString()}
            </AccessibleText>
          </AccessibleContainer>
          
          <AccessibleContainer variant="card">
            <AccessibleText variant="subtitle" size="medium">
              🔄 Status de Atualização
            </AccessibleText>
            <AccessibleText variant="body" size="small">
              {refreshing ? 'Atualizando...' : 'Pronto para atualizar'}
            </AccessibleText>
          </AccessibleContainer>
        </View>
      </AnimatedPullToRefresh>
    </AccessibleContainer>
  );

  // Renderizar demonstração de lista animada
  const renderAnimatedList = () => (
    <AccessibleContainer variant="section">
      <AccessibleText variant="title" size="large">
        Lista Animada
      </AccessibleText>
      
      <AccessibleText variant="body" size="medium" style={styles.listDescription}>
        Cada item aparece com uma animação em sequência
      </AccessibleText>
      
      <AnimatedList
        data={Array.from({ length: 10 }, (_, i) => ({
          id: `item-${i}`,
          title: `Item ${i + 1}`,
          description: `Descrição do item ${i + 1}`,
        }))}
        renderItem={({ item }) => (
          <AccessibleContainer variant="card" style={styles.listItem}>
            <AccessibleText variant="subtitle" size="medium">
              {item.title}
            </AccessibleText>
            <AccessibleText variant="body" size="small">
              {item.description}
            </AccessibleText>
          </AccessibleContainer>
        )}
        keyExtractor={(item) => item.id}
        style={styles.animatedList}
      />
    </AccessibleContainer>
  );

  // Renderizar métricas de performance
  const renderPerformanceMetrics = () => (
    <AccessibleContainer variant="section">
      <AccessibleText variant="title" size="large">
        Métricas de Performance
      </AccessibleText>
      
      {performanceMetrics && (
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <AccessibleText variant="caption" size="small">
              Total de Animações
            </AccessibleText>
            <AccessibleText variant="title" size="large">
              {performanceMetrics.totalAnimations}
            </AccessibleText>
          </View>
          
          <View style={styles.metricCard}>
            <AccessibleText variant="caption" size="small">
              FPS Médio
            </AccessibleText>
            <AccessibleText variant="title" size="large">
              {performanceMetrics.averageFPS.toFixed(1)}
            </AccessibleText>
          </View>
          
          <View style={styles.metricCard}>
            <AccessibleText variant="caption" size="small">
              Frames Perdidos
            </AccessibleText>
            <AccessibleText variant="title" size="large">
              {performanceMetrics.droppedFrames}
            </AccessibleText>
          </View>
          
          <View style={styles.metricCard}>
            <AccessibleText variant="caption" size="small">
              Animações Ativas
            </AccessibleText>
            <AccessibleText variant="title" size="large">
              {activeAnimations}
            </AccessibleText>
          </View>
          
          <View style={styles.metricCard}>
            <AccessibleText variant="caption" size="small">
              Fila de Animações
            </AccessibleText>
            <AccessibleText variant="title" size="large">
              {queueSize}
            </AccessibleText>
          </View>
        </View>
      )}
      
      <View style={styles.performanceActions}>
        <AccessibleButton
          title="Limpar Fila"
          variant="outline"
          size="medium"
          onPress={() => {
            clearQueue();
            Alert.alert('Sucesso', 'Fila de animações limpa!');
          }}
          style={styles.actionButton}
        />
        
        <AccessibleButton
          title="Cancelar Todas"
          variant="outline"
          size="medium"
          onPress={() => {
            cancelAllAnimations();
            Alert.alert('Sucesso', 'Todas as animações canceladas!');
          }}
          style={styles.actionButton}
        />
      </View>
    </AccessibleContainer>
  );

  // Renderizar configurações
  const renderSettings = () => (
    <AccessibleContainer variant="section">
      <AccessibleText variant="title" size="large">
        Configurações de Animação
      </AccessibleText>
      
      <View style={styles.settingsGrid}>
        <AccessibleContainer variant="card">
          <AccessibleText variant="subtitle" size="medium">
            🎯 Performance
          </AccessibleText>
          <AccessibleText variant="body" size="small">
            • Native Driver: Ativado
          </AccessibleText>
          <AccessibleText variant="body" size="small">
            • Target FPS: 60
          </AccessibleText>
          <AccessibleText variant="body" size="small">
            • Otimizações: Ativas
          </AccessibleText>
        </AccessibleContainer>
        
        <AccessibleContainer variant="card">
          <AccessibleText variant="subtitle" size="medium">
            🎭 Tipos de Animação
          </AccessibleText>
          <AccessibleText variant="body" size="small">
            • Spring: 4 configurações
          </AccessibleText>
          <AccessibleText variant="body" size="small">
            • Timing: 4 durações
          </AccessibleText>
          <AccessibleText variant="body" size="small">
            • Easing: 7 funções
          </AccessibleText>
        </AccessibleContainer>
        
        <AccessibleContainer variant="card">
          <AccessibleText variant="subtitle" size="medium">
            🔧 Funcionalidades
          </AccessibleText>
          <AccessibleText variant="body" size="small">
            • Gestos: 6 tipos
          </AccessibleText>
          <AccessibleText variant="body" size="small">
            • Transições: 5 tipos
          </AccessibleText>
          <AccessibleText variant="body" size="small">
            • Micro-interações: Ativas
          </AccessibleText>
        </AccessibleContainer>
      </View>
    </AccessibleContainer>
  );

  // Renderizar abas
  const renderTabs = () => {
    const tabs = [
      { id: 'demo', title: 'Demonstrações', icon: '🎬' },
      { id: 'performance', title: 'Performance', icon: '📊' },
      { id: 'settings', title: 'Configurações', icon: '⚙️' },
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
      case 'demo':
        return (
          <>
            {renderEntryAnimations()}
            {renderTransitionAnimations()}
            {renderMicroInteractions()}
            {renderSkeletonAnimations()}
            {renderPullToRefresh()}
            {renderAnimatedList()}
          </>
        );
      case 'performance':
        return renderPerformanceMetrics();
      case 'settings':
        return renderSettings();
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
          🎬 Demonstração de Animações
        </AccessibleText>
        <AccessibleText variant="subtitle" size="medium" style={styles.subtitle}>
          Explore o sistema completo de animações com Reanimated 2
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
    marginBottom: 16,
    gap: 8,
  },
  tabButton: {
    flex: 1,
  },
  animationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  animationCard: {
    width: '48%',
    minHeight: 120,
  },
  transitionContainer: {
    marginTop: 16,
  },
  transitionButton: {
    marginBottom: 16,
  },
  transitionContent: {
    minHeight: 200,
  },
  interactionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  interactionCard: {
    width: '48%',
    minHeight: 120,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 16,
  },
  skeletonItem: {
    width: '48%',
    alignItems: 'center',
    gap: 8,
  },
  refreshDescription: {
    marginTop: 16,
    textAlign: 'center',
  },
  pullToRefreshContainer: {
    marginTop: 16,
    minHeight: 300,
  },
  refreshContent: {
    gap: 16,
    padding: 16,
  },
  listDescription: {
    marginTop: 16,
    textAlign: 'center',
  },
  animatedList: {
    marginTop: 16,
  },
  listItem: {
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  metricCard: {
    width: '48%',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    alignItems: 'center',
  },
  performanceActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
  },
  settingsGrid: {
    gap: 16,
    marginTop: 16,
  },
});

export default AnimationDemoScreen;