import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  PanResponderGestureState,
  Dimensions,
} from 'react-native';
import { useTheme } from '../Hooks/useTheme';
import { triggerHaptic, HapticType } from '../utils/gestureService';
import { PullToActionConfig } from '../utils/gestureService';

const { height: screenHeight } = Dimensions.get('window');

// Interface para props do componente
interface PullToActionProps {
  children: React.ReactNode;
  config: PullToActionConfig;
  direction?: 'up' | 'down' | 'left' | 'right';
  threshold?: number;
  maxPullDistance?: number;
  animationDuration?: number;
  hapticFeedback?: boolean;
  hapticType?: HapticType;
  visualFeedback?: boolean;
  onPullStart?: () => void;
  onPullProgress?: (progress: number) => void;
  onPullEnd?: () => void;
  onActionTrigger?: () => void;
  style?: any;
}

// Interface para estado interno
interface PullState {
  isPulling: boolean;
  pullDistance: number;
  progress: number;
  shouldTrigger: boolean;
}

const PullToAction: React.FC<PullToActionProps> = ({
  children,
  config,
  direction = 'down',
  threshold,
  maxPullDistance = 200,
  animationDuration = 300,
  hapticFeedback = true,
  hapticType = 'medium',
  visualFeedback = true,
  onPullStart,
  onPullProgress,
  onPullEnd,
  onActionTrigger,
  style,
}) => {
  const { theme } = useTheme();
  const [pullState, setPullState] = useState<PullState>({
    isPulling: false,
    pullDistance: 0,
    progress: 0,
    shouldTrigger: false,
  });

  // Referências para animações
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotation = useRef(new Animated.Value(0)).current;

  // Threshold para ação
  const actionThreshold = threshold || config.threshold;

  // Função para calcular direção do pull
  const getPullDirection = (gestureState: PanResponderGestureState): boolean => {
    const { dx, dy } = gestureState;
    
    switch (direction) {
      case 'up':
        return dy < 0;
      case 'down':
        return dy > 0;
      case 'left':
        return dx < 0;
      case 'right':
        return dx > 0;
      default:
        return false;
    }
  };

  // Função para calcular distância do pull
  const getPullDistance = (gestureState: PanResponderGestureState): number => {
    const { dx, dy } = gestureState;
    
    switch (direction) {
      case 'up':
      case 'down':
        return Math.abs(dy);
      case 'left':
      case 'right':
        return Math.abs(dx);
      default:
        return 0;
    }
  };

  // Função para animar pull
  const animatePull = (distance: number, progress: number) => {
    const isVertical = direction === 'up' || direction === 'down';
    const translateValue = isVertical ? distance : 0;
    
    // Animar translação
    translateY.setValue(translateValue);
    
    // Animar escala baseada no progresso
    const scaleValue = 1 + (progress * 0.1);
    scale.setValue(scaleValue);
    
    // Animar opacidade do indicador
    opacity.setValue(progress);
    
    // Animar rotação do indicador
    const rotationValue = progress * 360;
    rotation.setValue(rotationValue);
  };

  // Função para resetar pull
  const resetPull = useCallback(() => {
    setPullState(prev => ({
      ...prev,
      isPulling: false,
      pullDistance: 0,
      progress: 0,
      shouldTrigger: false,
    }));

    // Animar de volta ao estado inicial
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(rotation, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    ]).start();

    if (onPullEnd) onPullEnd();
  }, [animationDuration, onPullEnd]);

  // Função para executar ação
  const executeAction = useCallback(() => {
    // Feedback háptico
    if (hapticFeedback) {
      triggerHaptic(config.hapticType || hapticType);
    }

    // Executar ação
    config.action();

    // Callback
    if (onActionTrigger) onActionTrigger();

    // Resetar pull
    resetPull();
  }, [hapticFeedback, config, hapticType, onActionTrigger, resetPull]);

  // Configurar PanResponder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dx, dy } = gestureState;
        const isVertical = direction === 'up' || direction === 'down';
        const isHorizontal = direction === 'left' || direction === 'right';
        
        if (isVertical) {
          return Math.abs(dy) > 10;
        } else if (isHorizontal) {
          return Math.abs(dx) > 10;
        }
        
        return false;
      },

      onPanResponderGrant: () => {
        setPullState(prev => ({ ...prev, isPulling: true }));
        if (onPullStart) onPullStart();
      },

      onPanResponderMove: (_, gestureState) => {
        if (!getPullDirection(gestureState)) return;

        const distance = getPullDistance(gestureState);
        const limitedDistance = Math.min(distance, maxPullDistance);
        const progress = Math.min(limitedDistance / actionThreshold, 1);

        // Atualizar estado
        setPullState(prev => ({
          ...prev,
          pullDistance: limitedDistance,
          progress,
          shouldTrigger: progress >= 1,
        }));

        // Animar
        animatePull(limitedDistance, progress);

        // Callback de progresso
        if (onPullProgress) onPullProgress(progress);
      },

      onPanResponderRelease: (_, gestureState) => {
        const distance = getPullDistance(gestureState);
        
        if (distance >= actionThreshold) {
          // Executar ação
          executeAction();
        } else {
          // Resetar pull
          resetPull();
        }
      },

      onPanResponderTerminate: () => {
        resetPull();
      },
    })
  ).current;

  // Função para renderizar indicador visual
  const renderVisualIndicator = () => {
    if (!visualFeedback) return null;

    const indicatorStyle = {
      position: 'absolute' as const,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      ...(direction === 'up' && { top: 20, left: 0, right: 0 }),
      ...(direction === 'down' && { bottom: 20, left: 0, right: 0 }),
      ...(direction === 'left' && { left: 20, top: 0, bottom: 0 }),
      ...(direction === 'right' && { right: 20, top: 0, bottom: 0 }),
    };

    return (
      <Animated.View
        style={[
          styles.visualIndicator,
          indicatorStyle,
          {
            opacity,
            transform: [
              { scale },
              { rotate: `${rotation}deg` },
            ],
          },
        ]}
      >
        <View style={[styles.indicatorIcon, { backgroundColor: theme.colors.primary }]}>
          {/* Ícone baseado na direção */}
          <View style={styles.indicatorArrow}>
            {direction === 'up' && '↑'}
            {direction === 'down' && '↓'}
            {direction === 'left' && '←'}
            {direction === 'right' && '→'}
          </View>
        </View>
        
        {/* Barra de progresso */}
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: `${pullState.progress * 100}%`,
                backgroundColor: theme.colors.primary,
              },
            ]}
          />
        </View>
      </Animated.View>
    );
  };

  // Função para renderizar feedback de ação
  const renderActionFeedback = () => {
    if (!pullState.shouldTrigger) return null;

    return (
      <Animated.View
        style={[
          styles.actionFeedback,
          {
            backgroundColor: theme.colors.success,
          },
        ]}
      >
        <View style={styles.feedbackIcon}>✓</View>
        <View style={styles.feedbackText}>Ação Ativada!</View>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {/* Indicador visual */}
      {renderVisualIndicator()}
      
      {/* Feedback de ação */}
      {renderActionFeedback()}
      
      {/* Conteúdo principal */}
      <Animated.View
        style={[
          styles.content,
          {
            transform: [
              { translateY: direction === 'up' || direction === 'down' ? translateY : 0 },
              { translateX: direction === 'left' || direction === 'right' ? translateY : 0 },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    backgroundColor: 'transparent',
  },
  visualIndicator: {
    zIndex: 1000,
  },
  indicatorIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  indicatorArrow: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  progressBar: {
    width: 60,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  actionFeedback: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2000,
  },
  feedbackIcon: {
    fontSize: 24,
    color: 'white',
    marginRight: 8,
  },
  feedbackText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});

export default PullToAction;