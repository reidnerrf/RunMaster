import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Pressable,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';

const { width: screenWidth } = Dimensions.get('window');

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  onLongPress?: () => void;
  delay?: number;
  duration?: number;
  scale?: number;
  rotation?: number;
  translateY?: number;
  shadow?: boolean;
  border?: boolean;
  borderRadius?: number;
  backgroundColor?: string;
  pressable?: boolean;
  hapticFeedback?: boolean;
  animationType?: 'fade' | 'slide' | 'scale' | 'bounce' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight';
  springConfig?: {
    damping: number;
    stiffness: number;
    mass: number;
  };
  timingConfig?: {
    duration: number;
    easing: string;
  };
  onAnimationComplete?: () => void;
  testID?: string;
}

export default function AnimatedCard({
  children,
  style,
  onPress,
  onLongPress,
  delay = 0,
  duration = 300,
  scale = 1,
  rotation = 0,
  translateY = 0,
  shadow = true,
  border = false,
  borderRadius = 16,
  backgroundColor,
  pressable = true,
  hapticFeedback = true,
  animationType = 'fade',
  springConfig = { damping: 15, stiffness: 150, mass: 1 },
  timingConfig = { duration: 300, easing: 'easeOut' },
  onAnimationComplete,
  testID,
}: AnimatedCardProps) {
  // Valores animados
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateYValue = useSharedValue(0);
  const scaleValue = useSharedValue(0.8);
  const rotationValue = useSharedValue(0);
  const shadowOpacity = useSharedValue(0);
  const borderOpacity = useSharedValue(0);

  // Refs para gestos
  const panRef = useRef<PanGestureHandler>(null);
  const isPressed = useRef(false);

  // Configuração de animação baseada no tipo
  const getAnimationConfig = () => {
    switch (animationType) {
      case 'fade':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
        };
      case 'slide':
        return {
          initial: { translateX: -screenWidth, opacity: 0 },
          animate: { translateX: 0, opacity: 1 },
        };
      case 'scale':
        return {
          initial: { scale: 0, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
        };
      case 'bounce':
        return {
          initial: { scale: 0, opacity: 0 },
          animate: { scale: 1.1, opacity: 1 },
          final: { scale: 1, opacity: 1 },
        };
      case 'slideUp':
        return {
          initial: { translateY: 100, opacity: 0 },
          animate: { translateY: 0, opacity: 1 },
        };
      case 'slideDown':
        return {
          initial: { translateY: -100, opacity: 0 },
          animate: { translateY: 0, opacity: 1 },
        };
      case 'slideLeft':
        return {
          initial: { translateX: screenWidth, opacity: 0 },
          animate: { translateX: 0, opacity: 1 },
        };
      case 'slideRight':
        return {
          initial: { translateX: -screenWidth, opacity: 0 },
          animate: { translateX: 0, opacity: 1 },
        };
      default:
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
        };
    }
  };

  // Animação de entrada
  useEffect(() => {
    const config = getAnimationConfig();
    
    const startAnimation = () => {
      // Aplica valores iniciais
      if (config.initial.opacity !== undefined) opacity.value = config.initial.opacity;
      if (config.initial.scale !== undefined) scaleValue.value = config.initial.scale;
      if (config.initial.translateX !== undefined) translateX.value = config.initial.translateX;
      if (config.initial.translateY !== undefined) translateYValue.value = config.initial.translateY;

      // Anima para valores finais
      const animateToFinal = () => {
        if (config.animate.opacity !== undefined) {
          opacity.value = withTiming(config.animate.opacity, {
            duration: duration,
            easing: timingConfig.easing as any,
          });
        }
        
        if (config.animate.scale !== undefined) {
          scaleValue.value = withSpring(config.animate.scale, springConfig);
        }
        
        if (config.animate.translateX !== undefined) {
          translateX.value = withSpring(config.animate.translateX, springConfig);
        }
        
        if (config.animate.translateY !== undefined) {
          translateYValue.value = withSpring(config.animate.translateY, springConfig);
        }

        // Animação de bounce se especificada
        if (config.final && animationType === 'bounce') {
          setTimeout(() => {
            scaleValue.value = withSequence(
              withSpring(config.final.scale! + 0.1, { ...springConfig, stiffness: 200 }),
              withSpring(config.final.scale!, springConfig)
            );
          }, duration);
        }
      };

      // Delay para animação
      if (delay > 0) {
        setTimeout(animateToFinal, delay);
      } else {
        animateToFinal();
      }
    };

    // Inicia animação após um frame
    requestAnimationFrame(startAnimation);

    // Anima sombra e borda
    if (shadow) {
      shadowOpacity.value = withDelay(delay + duration * 0.5, withTiming(1, { duration: 200 }));
    }
    
    if (border) {
      borderOpacity.value = withDelay(delay + duration * 0.3, withTiming(1, { duration: 200 }));
    }
  }, []);

  // Handler para gestos de pan
  const panGestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: () => {
      isPressed.current = true;
    },
    onActive: (event) => {
      // Movimento suave durante o pan
      translateX.value = event.translationX * 0.1;
      translateYValue.value = event.translationY * 0.1;
      
      // Escala reduzida durante o pan
      scaleValue.value = withSpring(0.95, { damping: 20, stiffness: 200 });
    },
    onEnd: () => {
      isPressed.current = false;
      
      // Retorna à posição original
      translateX.value = withSpring(0, springConfig);
      translateYValue.value = withSpring(0, springConfig);
      scaleValue.value = withSpring(1, springConfig);
    },
  });

  // Estilos animados
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateYValue.value },
        { scale: scaleValue.value },
        { rotate: `${rotationValue.value}deg` },
      ],
    };
  });

  // Estilo da sombra animada
  const shadowStyle = useAnimatedStyle(() => {
    return {
      shadowOpacity: shadowOpacity.value,
    };
  });

  // Estilo da borda animada
  const borderStyle = useAnimatedStyle(() => {
    return {
      borderWidth: border ? 1 : 0,
      borderOpacity: borderOpacity.value,
    };
  });

  // Handler para press
  const handlePress = () => {
    if (!pressable || !onPress) return;
    
    // Animação de press
    scaleValue.value = withSequence(
      withSpring(0.95, { damping: 20, stiffness: 200 }),
      withSpring(1, springConfig)
    );
    
    // Haptic feedback
    if (hapticFeedback) {
      // Implementar haptic feedback aqui
    }
    
    onPress();
  };

  // Handler para long press
  const handleLongPress = () => {
    if (!pressable || !onLongPress) return;
    
    // Animação de long press
    scaleValue.value = withSequence(
      withSpring(0.9, { damping: 15, stiffness: 150 }),
      withSpring(1, springConfig)
    );
    
    onLongPress();
  };

  // Renderiza o card
  const renderCard = () => (
    <Animated.View
      style={[
        styles.card,
        {
          borderRadius,
          backgroundColor,
          transform: [{ scale }, { rotate: `${rotation}deg` }, { translateY }],
        },
        animatedStyle,
        shadowStyle,
        borderStyle,
        style,
      ]}
      testID={testID}
    >
      {children}
    </Animated.View>
  );

  // Se não for pressable, retorna apenas o card
  if (!pressable) {
    return renderCard();
  }

  // Se for pressable, envolve com PanGestureHandler e Pressable
  return (
    <PanGestureHandler ref={panRef} onGestureEvent={panGestureHandler}>
      <Animated.View>
        <Pressable
          onPress={handlePress}
          onLongPress={handleLongPress}
          style={({ pressed }) => [
            styles.pressable,
            pressed && styles.pressed,
          ]}
        >
          {renderCard()}
        </Pressable>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 4,
  },
  pressable: {
    // Estilos para o pressable
  },
  pressed: {
    // Estilos para quando pressionado
  },
});