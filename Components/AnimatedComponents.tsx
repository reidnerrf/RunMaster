import React, { forwardRef, useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useAnimatedScrollHandler,
  useAnimatedRef,
  useDerivedValue,
  interpolate,
  Extrapolate,
  runOnJS,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  cancelAnimation,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  TapGestureHandler,
  LongPressGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  State,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { useTheme } from '../Hooks/useTheme';
import {
  createEntryAnimation,
  createTransitionAnimation,
  createMicroInteraction,
  createSkeletonAnimation,
  createPullToRefreshAnimation,
  createListAnimation,
  createModalAnimation,
  createTabAnimation,
} from '../utils/animationService';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Interface para props de animação
interface AnimationProps {
  // Animações de entrada
  enterAnimation?: {
    type: 'fade' | 'slide' | 'scale' | 'rotate' | 'bounce' | 'elastic';
    direction?: 'up' | 'down' | 'left' | 'right';
    distance?: number;
    scale?: number;
    rotation?: number;
    delay?: number;
    duration?: number;
  };
  
  // Animações de transição
  transitionAnimation?: {
    type: 'slide' | 'fade' | 'scale' | 'flip' | 'cube';
    direction?: 'horizontal' | 'vertical' | 'diagonal';
    duration?: number;
    interactive?: boolean;
  };
  
  // Micro-interações
  microInteraction?: {
    type: 'press' | 'longPress' | 'swipe' | 'drag' | 'pinch' | 'rotate';
    feedback: 'visual' | 'haptic' | 'sound' | 'combined';
    hapticType?: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';
  };
  
  // Configurações de performance
  performance?: {
    useNativeDriver?: boolean;
    reduceMotion?: boolean;
    optimizeForPerformance?: boolean;
  };
  
  // Callbacks
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  onInteractionStart?: () => void;
  onInteractionEnd?: () => void;
}

// Componente de entrada animada
interface AnimatedEntryProps extends AnimationProps {
  children: React.ReactNode;
  style?: any;
  onLayout?: (event: LayoutChangeEvent) => void;
}

export const AnimatedEntry = forwardRef<View, AnimatedEntryProps>(
  ({
    children,
    style,
    enterAnimation = { type: 'fade', duration: 300 },
    onLayout,
    onAnimationStart,
    onAnimationEnd,
    performance = { useNativeDriver: true, reduceMotion: false },
  }, ref) => {
    const { theme } = useTheme();
    const [isVisible, setIsVisible] = useState(false);
    
    // Valores animados
    const opacity = useSharedValue(0);
    const translateX = useSharedValue(enterAnimation.direction === 'left' ? -50 : enterAnimation.direction === 'right' ? 50 : 0);
    const translateY = useSharedValue(enterAnimation.direction === 'up' ? -50 : enterAnimation.direction === 'down' ? 50 : 0);
    const scale = useSharedValue(enterAnimation.scale || 1);
    const rotation = useSharedValue(enterAnimation.rotation || 0);
    
    // Configuração de animação
    const animationConfig = {
      type: enterAnimation.type,
      direction: enterAnimation.direction,
      distance: enterAnimation.distance || 50,
      scale: enterAnimation.scale || 1,
      rotation: enterAnimation.rotation || 0,
      delay: enterAnimation.delay || 0,
      duration: enterAnimation.duration || 300,
    };
    
    // Estilo animado
    const animatedStyle = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value },
          { scale: scale.value },
          { rotate: `${rotation.value}deg` },
        ],
      };
    });
    
    // Iniciar animação de entrada
    useEffect(() => {
      if (isVisible) {
        const animation = createEntryAnimation(animationConfig);
        
        // Aplicar valores finais
        opacity.value = withDelay(
          animationConfig.delay,
          withTiming(1, { duration: animationConfig.duration })
        );
        
        translateX.value = withDelay(
          animationConfig.delay,
          withSpring(0, { damping: 15, stiffness: 150 })
        );
        
        translateY.value = withDelay(
          animationConfig.delay,
          withSpring(0, { damping: 15, stiffness: 150 })
        );
        
        scale.value = withDelay(
          animationConfig.delay,
          withSpring(1, { damping: 15, stiffness: 150 })
        );
        
        rotation.value = withDelay(
          animationConfig.delay,
          withSpring(0, { damping: 15, stiffness: 150 })
        );
        
        if (onAnimationStart) onAnimationStart();
        
        // Callback de conclusão
        setTimeout(() => {
          if (onAnimationEnd) onAnimationEnd();
        }, animationConfig.delay + animationConfig.duration);
      }
    }, [isVisible]);
    
    // Manipular layout
    const handleLayout = (event: LayoutChangeEvent) => {
      if (onLayout) onLayout(event);
      setIsVisible(true);
    };
    
    return (
      <Animated.View
        ref={ref}
        style={[styles.animatedEntry, style, animatedStyle]}
        onLayout={handleLayout}
      >
        {children}
      </Animated.View>
    );
  }
);

// Componente de transição animada
interface AnimatedTransitionProps extends AnimationProps {
  children: React.ReactNode;
  isVisible: boolean;
  style?: any;
}

export const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({
  children,
  isVisible,
  style,
  transitionAnimation = { type: 'fade', duration: 300 },
  onAnimationStart,
  onAnimationEnd,
  performance = { useNativeDriver: true, reduceMotion: false },
}) => {
  const { theme } = useTheme();
  
  // Valores animados
  const opacity = useSharedValue(isVisible ? 1 : 0);
  const translateX = useSharedValue(isVisible ? 0 : screenWidth);
  const translateY = useSharedValue(isVisible ? 0 : screenHeight);
  const scale = useSharedValue(isVisible ? 1 : 0.8);
  const rotateY = useSharedValue(isVisible ? 0 : 90);
  const rotateX = useSharedValue(isVisible ? 0 : 90);
  
  // Configuração de transição
  const transitionConfig = {
    type: transitionAnimation.type,
    direction: transitionAnimation.direction || 'horizontal',
    duration: transitionAnimation.duration || 300,
    easing: 'easeInOut' as const,
    interactive: transitionAnimation.interactive || false,
  };
  
  // Estilo animado
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotateY: `${rotateY.value}deg` },
        { rotateX: `${rotateX.value}deg` },
      ],
    };
  });
  
  // Aplicar transição
  useEffect(() => {
    const animation = createTransitionAnimation(transitionConfig);
    
    if (isVisible) {
      // Entrada
      opacity.value = withTiming(1, { duration: transitionConfig.duration });
      translateX.value = withTiming(0, { duration: transitionConfig.duration });
      translateY.value = withTiming(0, { duration: transitionConfig.duration });
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
      rotateY.value = withTiming(0, { duration: transitionConfig.duration });
      rotateX.value = withTiming(0, { duration: transitionConfig.duration });
      
      if (onAnimationStart) onAnimationStart();
    } else {
      // Saída
      opacity.value = withTiming(0, { duration: transitionConfig.duration });
      translateX.value = withTiming(screenWidth, { duration: transitionConfig.duration });
      translateY.value = withTiming(screenHeight, { duration: transitionConfig.duration });
      scale.value = withTiming(0.8, { duration: transitionConfig.duration });
      rotateY.value = withTiming(90, { duration: transitionConfig.duration });
      rotateX.value = withTiming(90, { duration: transitionConfig.duration });
      
      if (onAnimationEnd) onAnimationEnd();
    }
  }, [isVisible]);
  
  return (
    <Animated.View style={[styles.animatedTransition, style, animatedStyle]}>
      {children}
    </Animated.View>
  );
};

// Componente de micro-interação
interface AnimatedInteractionProps extends AnimationProps {
  children: React.ReactNode;
  style?: any;
  onPress?: () => void;
  onLongPress?: () => void;
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void;
}

export const AnimatedInteraction: React.FC<AnimatedInteractionProps> = ({
  children,
  style,
  microInteraction = { type: 'press', feedback: 'visual' },
  onPress,
  onLongPress,
  onSwipe,
  onInteractionStart,
  onInteractionEnd,
  performance = { useNativeDriver: true, reduceMotion: false },
}) => {
  const { theme } = useTheme();
  
  // Valores animados
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  
  // Configuração de micro-interação
  const interactionConfig = {
    type: microInteraction.type,
    feedback: microInteraction.feedback,
    animation: {
      type: 'scale' as const,
      scale: 0.95,
      duration: 100,
      easing: 'easeOut' as const,
    },
    hapticType: microInteraction.hapticType || 'light',
  };
  
  // Estilo animado
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotation.value}deg` },
      ],
      opacity: opacity.value,
    };
  });
  
  // Handler de toque
  const tapHandler = useAnimatedGestureHandler({
    onStart: () => {
      if (onInteractionStart) runOnJS(onInteractionStart)();
      
      // Animação de press
      scale.value = withTiming(0.95, { duration: 100 });
      opacity.value = withTiming(0.8, { duration: 100 });
    },
    onEnd: () => {
      // Restaurar valores
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
      opacity.value = withTiming(1, { duration: 100 });
      
      if (onPress) runOnJS(onPress)();
      if (onInteractionEnd) runOnJS(onInteractionEnd)();
    },
  });
  
  // Handler de press longo
  const longPressHandler = useAnimatedGestureHandler({
    onStart: () => {
      if (onInteractionStart) runOnJS(onInteractionStart)();
      
      // Animação de long press
      scale.value = withTiming(0.9, { duration: 200 });
      opacity.value = withTiming(0.7, { duration: 200 });
    },
    onEnd: () => {
      // Restaurar valores
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
      opacity.value = withTiming(1, { duration: 200 });
      
      if (onLongPress) runOnJS(onLongPress)();
      if (onInteractionEnd) runOnJS(onInteractionEnd)();
    },
  });
  
  // Handler de pan (swipe)
  const panHandler = useAnimatedGestureHandler({
    onStart: () => {
      if (onInteractionStart) runOnJS(onInteractionStart)();
    },
    onActive: (event) => {
      // Seguir o dedo
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      
      // Escala baseada na distância
      const distance = Math.sqrt(event.translationX ** 2 + event.translationY ** 2);
      const maxDistance = 100;
      const scaleValue = Math.max(0.8, 1 - (distance / maxDistance) * 0.2);
      scale.value = scaleValue;
    },
    onEnd: (event) => {
      // Determinar direção do swipe
      const velocityX = event.velocityX;
      const velocityY = event.velocityY;
      const threshold = 500;
      
      let direction: 'left' | 'right' | 'up' | 'down' | null = null;
      
      if (Math.abs(velocityX) > Math.abs(velocityY)) {
        if (velocityX > threshold) direction = 'right';
        else if (velocityX < -threshold) direction = 'left';
      } else {
        if (velocityY > threshold) direction = 'down';
        else if (velocityY < -threshold) direction = 'up';
      }
      
      // Restaurar valores
      translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
      
      // Callback de swipe
      if (direction && onSwipe) {
        runOnJS(onSwipe)(direction);
      }
      
      if (onInteractionEnd) runOnJS(onInteractionEnd)();
    },
  });
  
  // Renderizar baseado no tipo de interação
  const renderInteraction = () => {
    switch (microInteraction.type) {
      case 'press':
        return (
          <TapGestureHandler onGestureEvent={tapHandler}>
            <Animated.View style={[styles.interactionContainer, animatedStyle]}>
              {children}
            </Animated.View>
          </TapGestureHandler>
        );
        
      case 'longPress':
        return (
          <LongPressGestureHandler onGestureEvent={longPressHandler}>
            <Animated.View style={[styles.interactionContainer, animatedStyle]}>
              {children}
            </Animated.View>
          </LongPressGestureHandler>
        );
        
      case 'swipe':
      case 'drag':
        return (
          <PanGestureHandler onGestureEvent={panHandler}>
            <Animated.View style={[styles.interactionContainer, animatedStyle]}>
              {children}
            </Animated.View>
          </PanGestureHandler>
        );
        
      default:
        return (
          <Animated.View style={[styles.interactionContainer, animatedStyle]}>
            {children}
          </Animated.View>
        );
    }
  };
  
  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      {renderInteraction()}
    </GestureHandlerRootView>
  );
};

// Componente de skeleton loading animado
interface AnimatedSkeletonProps extends AnimationProps {
  width?: number | string;
  height?: number | string;
  variant?: 'text' | 'title' | 'avatar' | 'button' | 'card' | 'circle';
  style?: any;
}

export const AnimatedSkeleton: React.FC<AnimatedSkeletonProps> = ({
  width = '100%',
  height = 20,
  variant = 'text',
  style,
  performance = { useNativeDriver: true, reduceMotion: false },
}) => {
  const { theme } = useTheme();
  
  // Valor animado para shimmer
  const shimmerValue = useSharedValue(0);
  
  // Configurar animação de shimmer
  useEffect(() => {
    const animation = createSkeletonAnimation();
    shimmerValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0, { duration: 1000 })
      ),
      -1,
      true
    );
    
    return () => {
      cancelAnimation(shimmerValue);
    };
  }, []);
  
  // Estilo animado
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      shimmerValue.value,
      [0, 0.5, 1],
      [0.3, 0.7, 0.3],
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
    };
  });
  
  // Estilos baseados na variante
  const getVariantStyles = () => {
    switch (variant) {
      case 'title':
        return {
          width: width,
          height: typeof height === 'number' ? height * 1.5 : height,
          borderRadius: 4,
        };
      case 'avatar':
        return {
          width: typeof width === 'number' ? width : 40,
          height: typeof height === 'number' ? height : 40,
          borderRadius: 20,
        };
      case 'button':
        return {
          width: width,
          height: typeof height === 'number' ? height : 44,
          borderRadius: 8,
        };
      case 'card':
        return {
          width: width,
          height: typeof height === 'number' ? height : 120,
          borderRadius: 12,
        };
      case 'circle':
        return {
          width: typeof width === 'number' ? width : 40,
          height: typeof height === 'number' ? height : 40,
          borderRadius: typeof width === 'number' ? width / 2 : 20,
        };
      default: // text
        return {
          width: width,
          height: typeof height === 'number' ? height : 16,
          borderRadius: 4,
        };
    }
  };
  
  return (
    <Animated.View
      style={[
        styles.skeleton,
        getVariantStyles(),
        { backgroundColor: theme.colors.border },
        style,
        animatedStyle,
      ]}
    />
  );
};

// Componente de pull-to-refresh animado
interface AnimatedPullToRefreshProps extends AnimationProps {
  children: React.ReactNode;
  onRefresh: () => void;
  refreshing: boolean;
  style?: any;
}

export const AnimatedPullToRefresh: React.FC<AnimatedPullToRefreshProps> = ({
  children,
  onRefresh,
  refreshing,
  style,
  performance = { useNativeDriver: true, reduceMotion: false },
}) => {
  const { theme } = useTheme();
  
  // Valores animados
  const pullProgress = useSharedValue(0);
  const isRefreshing = useSharedValue(false);
  
  // Handler de scroll
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (event.contentOffset.y < 0) {
        pullProgress.value = Math.abs(event.contentOffset.y) / 100;
      } else {
        pullProgress.value = 0;
      }
    },
  });
  
  // Estilo animado para o indicador
  const indicatorStyle = useAnimatedStyle(() => {
    const scale = interpolate(pullProgress.value, [0, 1], [0.8, 1.2], Extrapolate.CLAMP);
    const rotation = interpolate(pullProgress.value, [0, 1], [0, 360], Extrapolate.CLAMP);
    const opacity = interpolate(pullProgress.value, [0, 0.5, 1], [0.3, 0.7, 1], Extrapolate.CLAMP);
    
    return {
      transform: [
        { scale },
        { rotate: `${rotation}deg` },
      ],
      opacity,
    };
  });
  
  // Atualizar estado de refresh
  useEffect(() => {
    isRefreshing.value = refreshing;
  }, [refreshing]);
  
  return (
    <View style={[styles.pullToRefreshContainer, style]}>
      {/* Indicador de pull */}
      <Animated.View style={[styles.pullIndicator, indicatorStyle]}>
        <View style={[styles.pullIcon, { backgroundColor: theme.colors.primary }]} />
      </Animated.View>
      
      {/* Conteúdo com scroll */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
};

// Componente de lista animada
interface AnimatedListProps extends AnimationProps {
  data: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  keyExtractor: (item: any, index: number) => string;
  style?: any;
  contentContainerStyle?: any;
  showsVerticalScrollIndicator?: boolean;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({
  data,
  renderItem,
  keyExtractor,
  style,
  contentContainerStyle,
  showsVerticalScrollIndicator = false,
  performance = { useNativeDriver: true, reduceMotion: false },
}) => {
  const { theme } = useTheme();
  
  // Valores animados para cada item
  const itemAnimations = useRef<Map<string, any>>(new Map()).current;
  
  // Criar animação para item
  const createItemAnimation = (index: number) => {
    const animation = createListAnimation(index, 50);
    return animation;
  };
  
  // Renderizar item com animação
  const renderAnimatedItem = (item: any, index: number) => {
    const key = keyExtractor(item, index);
    
    if (!itemAnimations.has(key)) {
      itemAnimations.set(key, createItemAnimation(index));
    }
    
    return (
      <Animated.View
        key={key}
        style={[styles.listItem, itemAnimations.get(key)]}
      >
        {renderItem(item, index)}
      </Animated.View>
    );
  };
  
  return (
    <View style={[styles.animatedList, style]}>
      {data.map((item, index) => renderAnimatedItem(item, index))}
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  animatedEntry: {
    // Estilos base para entrada animada
  },
  animatedTransition: {
    // Estilos base para transição animada
  },
  interactionContainer: {
    // Estilos base para interação animada
  },
  gestureRoot: {
    // Estilos para root de gestos
  },
  skeleton: {
    // Estilos base para skeleton
  },
  pullToRefreshContainer: {
    flex: 1,
    position: 'relative',
  },
  pullIndicator: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    zIndex: 1000,
  },
  pullIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  scrollContent: {
    flexGrow: 1,
  },
  animatedList: {
    // Estilos base para lista animada
  },
  listItem: {
    // Estilos base para item de lista
  },
});

// Exportar todos os componentes
export default {
  AnimatedEntry,
  AnimatedTransition,
  AnimatedInteraction,
  AnimatedSkeleton,
  AnimatedPullToRefresh,
  AnimatedList,
};