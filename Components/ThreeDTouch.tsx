import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  PanResponderGestureState,
  Platform,
  Dimensions,
} from 'react-native';
import { useTheme } from '../Hooks/useTheme';
import { triggerHaptic, HapticType } from '../utils/gestureService';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Interface para props do componente
interface ThreeDTouchProps {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  on3DTouch?: (pressure: number) => void;
  on3DTouchStart?: () => void;
  on3DTouchEnd?: () => void;
  threshold?: number;
  hapticFeedback?: boolean;
  hapticType?: HapticType;
  visualFeedback?: boolean;
  style?: any;
}

// Interface para estado interno
interface ThreeDTouchState {
  isPressed: boolean;
  pressure: number;
  is3DTouch: boolean;
  startTime: number;
  startPosition: { x: number; y: number };
}

const ThreeDTouch: React.FC<ThreeDTouchProps> = ({
  children,
  onPress,
  onLongPress,
  on3DTouch,
  on3DTouchStart,
  on3DTouchEnd,
  threshold = 0.5,
  hapticFeedback = true,
  hapticType = 'medium',
  visualFeedback = true,
  style,
}) => {
  const { theme } = useTheme();
  const [touchState, setTouchState] = useState<ThreeDTouchState>({
    isPressed: false,
    pressure: 0,
    is3DTouch: false,
    startTime: 0,
    startPosition: { x: 0, y: 0 },
  });

  // Referências para animações
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const elevation = useRef(new Animated.Value(0)).current;

  // Referências para timers
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const pressureTimer = useRef<NodeJS.Timeout | null>(null);

  // Verificar suporte a 3D Touch
  const supports3DTouch = Platform.OS === 'ios';

  // Função para calcular pressão simulada (Android)
  const calculateSimulatedPressure = (gestureState: PanResponderGestureState): number => {
    const { dx, dy } = gestureState;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = Math.sqrt(screenWidth * screenWidth + screenHeight * screenHeight);
    
    // Pressão baseada na distância e tempo
    const distancePressure = Math.min(distance / maxDistance, 1);
    const timePressure = Math.min((Date.now() - touchState.startTime) / 1000, 1);
    
    return Math.min(distancePressure + timePressure * 0.3, 1);
  };

  // Função para animar pressão
  const animatePressure = (pressure: number) => {
    // Escala baseada na pressão
    const scaleValue = 1 + (pressure * 0.1);
    scale.setValue(scaleValue);
    
    // Opacidade do feedback visual
    opacity.setValue(pressure);
    
    // Rotação sutil
    const rotationValue = pressure * 5;
    rotation.setValue(rotationValue);
    
    // Elevação (sombra)
    const elevationValue = pressure * 10;
    elevation.setValue(elevationValue);
  };

  // Função para resetar animações
  const resetAnimations = useCallback(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(rotation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(elevation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scale, opacity, rotation, elevation]);

  // Função para iniciar 3D Touch
  const start3DTouch = useCallback((pressure: number) => {
    setTouchState(prev => ({
      ...prev,
      is3DTouch: true,
      pressure,
    }));

    // Feedback háptico
    if (hapticFeedback) {
      triggerHaptic(hapticType);
    }

    // Callback
    if (on3DTouchStart) on3DTouchStart();
    if (on3DTouch) on3DTouch(pressure);

    console.log(`📱 3D Touch iniciado: pressão ${pressure.toFixed(2)}`);
  }, [hapticFeedback, hapticType, on3DTouchStart, on3DTouch]);

  // Função para finalizar 3D Touch
  const end3DTouch = useCallback(() => {
    setTouchState(prev => ({
      ...prev,
      is3DTouch: false,
      pressure: 0,
    }));

    // Callback
    if (on3DTouchEnd) on3DTouchEnd();

    // Resetar animações
    resetAnimations();

    console.log('📱 3D Touch finalizado');
  }, [on3DTouchEnd, resetAnimations]);

  // Função para executar press
  const executePress = useCallback(() => {
    if (onPress) onPress();
  }, [onPress]);

  // Função para executar long press
  const executeLongPress = useCallback(() => {
    if (onLongPress) onLongPress();
  }, [onLongPress]);

  // Configurar PanResponder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,

      onPanResponderGrant: (evt) => {
        const { pageX, pageY } = evt.nativeEvent;
        const startTime = Date.now();
        
        setTouchState(prev => ({
          ...prev,
          isPressed: true,
          startTime,
          startPosition: { x: pageX, y: pageY },
        }));

        // Timer para long press
        longPressTimer.current = setTimeout(() => {
          executeLongPress();
        }, 500);

        // Timer para pressão (Android)
        if (!supports3DTouch) {
          pressureTimer.current = setInterval(() => {
            // Simular pressão crescente
            setTouchState(prev => {
              const newPressure = Math.min(prev.pressure + 0.1, 1);
              animatePressure(newPressure);
              
              // Verificar threshold
              if (newPressure >= threshold && !prev.is3DTouch) {
                start3DTouch(newPressure);
              }
              
              return { ...prev, pressure: newPressure };
            });
          }, 100);
        }
      },

      onPanResponderMove: (evt, gestureState) => {
        if (!supports3DTouch) {
          // Calcular pressão simulada
          const pressure = calculateSimulatedPressure(gestureState);
          
          setTouchState(prev => {
            const newPressure = Math.min(pressure, 1);
            animatePressure(newPressure);
            
            // Verificar threshold
            if (newPressure >= threshold && !prev.is3DTouch) {
              start3DTouch(newPressure);
            }
            
            return { ...prev, pressure: newPressure };
          });
        }
      },

      onPanResponderRelease: () => {
        // Limpar timers
        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
        }
        
        if (pressureTimer.current) {
          clearInterval(pressureTimer.current);
          pressureTimer.current = null;
        }

        // Executar press se não foi 3D Touch
        if (!touchState.is3DTouch) {
          executePress();
        }

        // Finalizar 3D Touch se estava ativo
        if (touchState.is3DTouch) {
          end3DTouch();
        }

        // Resetar estado
        setTouchState(prev => ({
          ...prev,
          isPressed: false,
          pressure: 0,
        }));

        // Resetar animações
        resetAnimations();
      },

      onPanResponderTerminate: () => {
        // Limpar timers
        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
        }
        
        if (pressureTimer.current) {
          clearInterval(pressureTimer.current);
          pressureTimer.current = null;
        }

        // Finalizar 3D Touch se estava ativo
        if (touchState.is3DTouch) {
          end3DTouch();
        }

        // Resetar estado
        setTouchState(prev => ({
          ...prev,
          isPressed: false,
          pressure: 0,
        }));

        // Resetar animações
        resetAnimations();
      },
    })
  ).current;

  // Função para renderizar feedback visual
  const renderVisualFeedback = () => {
    if (!visualFeedback || !touchState.isPressed) return null;

    return (
      <Animated.View
        style={[
          styles.visualFeedback,
          {
            opacity,
            transform: [
              { scale },
              { rotate: `${rotation}deg` },
            ],
            shadowOpacity: elevation.interpolate({
              inputRange: [0, 10],
              outputRange: [0, 0.3],
            }),
            shadowRadius: elevation.interpolate({
              inputRange: [0, 10],
              outputRange: [0, 10],
            }),
            elevation: elevation.interpolate({
              inputRange: [0, 10],
              outputRange: [0, 10],
            }),
          },
        ]}
      >
        {/* Indicador de pressão */}
        <View style={styles.pressureIndicator}>
          <View style={styles.pressureBar}>
            <Animated.View
              style={[
                styles.pressureFill,
                {
                  height: `${touchState.pressure * 100}%`,
                  backgroundColor: theme.colors.primary,
                },
              ]}
            />
          </View>
          <View style={styles.pressureText}>
            {Math.round(touchState.pressure * 100)}%
          </View>
        </View>

        {/* Indicador de 3D Touch */}
        {touchState.is3DTouch && (
          <View style={[styles.threeDTouchIndicator, { backgroundColor: theme.colors.accent }]}>
            <View style={styles.threeDTouchIcon}>📱</View>
            <View style={styles.threeDTouchText}>3D Touch</View>
          </View>
        )}
      </Animated.View>
    );
  };

  // Limpar timers ao desmontar
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
      if (pressureTimer.current) {
        clearInterval(pressureTimer.current);
      }
    };
  }, []);

  return (
    <View style={[styles.container, style]}>
      {/* Feedback visual */}
      {renderVisualFeedback()}
      
      {/* Conteúdo principal */}
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ scale }],
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
  },
  content: {
    backgroundColor: 'transparent',
  },
  visualFeedback: {
    position: 'absolute',
    top: -60,
    left: '50%',
    transform: [{ translateX: -50 }],
    alignItems: 'center',
    zIndex: 1000,
  },
  pressureIndicator: {
    alignItems: 'center',
    marginBottom: 8,
  },
  pressureBar: {
    width: 20,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 4,
  },
  pressureFill: {
    width: '100%',
    borderRadius: 10,
  },
  pressureText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.7)',
  },
  threeDTouchIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  threeDTouchIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  threeDTouchText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
});

export default ThreeDTouch;