import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  PanResponderGestureState,
  LayoutChangeEvent,
} from 'react-native';
import { useTheme } from '../Hooks/useTheme';
import { triggerHaptic, HapticType } from '../utils/gestureService';
import { SwipeActionConfig, SwipeDirection } from '../utils/gestureService';

const { width: screenWidth } = Dimensions.get('window');

// Interface para props do componente
interface SwipeActionsProps {
  children: React.ReactNode;
  actions: SwipeActionConfig[];
  direction?: SwipeDirection;
  threshold?: number;
  maxSwipeDistance?: number;
  animationDuration?: number;
  hapticFeedback?: boolean;
  hapticType?: HapticType;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
  onActionTrigger?: (actionId: string) => void;
  style?: any;
}

// Interface para estado interno
interface SwipeState {
  isSwiping: boolean;
  currentAction: SwipeActionConfig | null;
  swipeDistance: number;
  actionWidth: number;
}

const SwipeActions: React.FC<SwipeActionsProps> = ({
  children,
  actions,
  direction = 'right',
  threshold = 80,
  maxSwipeDistance = 200,
  animationDuration = 300,
  hapticFeedback = true,
  hapticType = 'light',
  onSwipeStart,
  onSwipeEnd,
  onActionTrigger,
  style,
}) => {
  const { theme } = useTheme();
  const [swipeState, setSwipeState] = useState<SwipeState>({
    isSwiping: false,
    currentAction: null,
    swipeDistance: 0,
    actionWidth: 0,
  });

  // Referências para animações
  const translateX = useRef(new Animated.Value(0)).current;
  const actionOpacity = useRef(new Animated.Value(0)).current;
  const actionScale = useRef(new Animated.Value(0.8)).current;

  // Referência para o container
  const containerRef = useRef<View>(null);

  // Função para calcular direção do swipe
  const getSwipeDirection = (gestureState: PanResponderGestureState): SwipeDirection | null => {
    const { dx, dy } = gestureState;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx > absDy && absDx > threshold) {
      return dx > 0 ? 'right' : 'left';
    } else if (absDy > absDx && absDy > threshold) {
      return dy > 0 ? 'down' : 'up';
    }

    return null;
  };

  // Função para obter ações válidas para a direção
  const getValidActions = (swipeDirection: SwipeDirection): SwipeActionConfig[] => {
    return actions.filter(action => 
      !action.direction || action.direction === swipeDirection
    );
  };

  // Função para calcular largura da ação
  const calculateActionWidth = (action: SwipeActionConfig): number => {
    // Largura baseada no conteúdo ou fixa
    return action.threshold || threshold;
  };

  // Função para animar swipe
  const animateSwipe = (toValue: number, callback?: () => void) => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(actionOpacity, {
        toValue: toValue === 0 ? 0 : 1,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(actionScale, {
        toValue: toValue === 0 ? 0.8 : 1,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    ]).start(callback);
  };

  // Função para resetar swipe
  const resetSwipe = useCallback(() => {
    setSwipeState(prev => ({
      ...prev,
      isSwiping: false,
      currentAction: null,
      swipeDistance: 0,
    }));

    animateSwipe(0);
    
    if (onSwipeEnd) onSwiueEnd();
  }, [onSwipeEnd]);

  // Função para executar ação
  const executeAction = useCallback((action: SwipeActionConfig) => {
    // Feedback háptico
    if (hapticFeedback) {
      triggerHaptic(action.hapticType || hapticType);
    }

    // Executar ação
    action.action();

    // Callback
    if (onActionTrigger) onActionTrigger(action.id);

    // Resetar swipe
    resetSwipe();
  }, [hapticFeedback, hapticType, onActionTrigger, resetSwipe]);

  // Função para verificar se ação deve ser executada
  const shouldExecuteAction = (swipeDistance: number, action: SwipeActionConfig): boolean => {
    const actionThreshold = action.threshold || threshold;
    return Math.abs(swipeDistance) >= actionThreshold;
  };

  // Configurar PanResponder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) > 10 || Math.abs(dy) > 10;
      },

      onPanResponderGrant: () => {
        setSwipeState(prev => ({ ...prev, isSwiping: true }));
        if (onSwipeStart) onSwipeStart();
      },

      onPanResponderMove: (_, gestureState) => {
        const swipeDirection = getSwipeDirection(gestureState);
        
        if (swipeDirection && swipeDirection === direction) {
          const validActions = getValidActions(swipeDirection);
          
          if (validActions.length > 0) {
            const { dx, dy } = gestureState;
            const distance = direction === 'left' || direction === 'right' ? dx : dy;
            
            // Limitar distância máxima
            const limitedDistance = Math.max(
              -maxSwipeDistance,
              Math.min(maxSwipeDistance, distance)
            );

            // Atualizar estado
            setSwipeState(prev => ({
              ...prev,
              swipeDistance: limitedDistance,
              currentAction: validActions[0],
              actionWidth: calculateActionWidth(validActions[0]),
            }));

            // Animar
            translateX.setValue(limitedDistance);
            
            // Mostrar ação se passar do threshold
            const shouldShow = Math.abs(limitedDistance) > threshold;
            actionOpacity.setValue(shouldShow ? 1 : 0);
            actionScale.setValue(shouldShow ? 1 : 0.8);
          }
        }
      },

      onPanResponderRelease: (_, gestureState) => {
        const { dx, dy } = gestureState;
        const distance = direction === 'left' || direction === 'right' ? dx : dy;
        
        if (swipeState.currentAction && shouldExecuteAction(distance, swipeState.currentAction)) {
          // Executar ação
          executeAction(swipeState.currentAction);
        } else {
          // Resetar swipe
          resetSwipe();
        }
      },

      onPanResponderTerminate: () => {
        resetSwipe();
      },
    })
  ).current;

  // Função para renderizar ações
  const renderActions = () => {
    if (!swipeState.currentAction || swipeState.swipeDistance === 0) return null;

    const { currentAction, actionWidth } = swipeState;
    const isRightSwipe = direction === 'right' && swipeState.swipeDistance > 0;
    const isLeftSwipe = direction === 'left' && swipeState.swipeDistance < 0;

    if (!isRightSwipe && !isLeftSwipe) return null;

    const actionStyle = {
      position: 'absolute' as const,
      top: 0,
      bottom: 0,
      width: actionWidth,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      backgroundColor: currentAction.backgroundColor,
      borderRadius: 8,
      ...(isRightSwipe ? { right: 0 } : { left: 0 }),
    };

    return (
      <Animated.View
        style={[
          actionStyle,
          {
            opacity: actionOpacity,
            transform: [{ scale: actionScale }],
          },
        ]}
      >
        <View style={styles.actionContent}>
          <View style={[styles.actionIcon, { color: currentAction.color }]}>
            {currentAction.icon}
          </View>
          <Animated.Text
            style={[
              styles.actionTitle,
              { color: currentAction.color },
            ]}
          >
            {currentAction.title}
          </Animated.Text>
        </View>
      </Animated.View>
    );
  };

  // Função para renderizar indicador de swipe
  const renderSwipeIndicator = () => {
    if (!swipeState.isSwiping || swipeState.swipeDistance === 0) return null;

    const progress = Math.abs(swipeState.swipeDistance) / threshold;
    const indicatorOpacity = Math.min(progress, 1);

    return (
      <Animated.View
        style={[
          styles.swipeIndicator,
          {
            opacity: indicatorOpacity,
            backgroundColor: theme.colors.primary,
          },
        ]}
      />
    );
  };

  return (
    <View style={[styles.container, style]} ref={containerRef}>
      {/* Ações de swipe */}
      {renderActions()}
      
      {/* Conteúdo principal */}
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ translateX }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
      
      {/* Indicador de swipe */}
      {renderSwipeIndicator()}
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
  actionContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  swipeIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    zIndex: 1000,
  },
});

export default SwipeActions;