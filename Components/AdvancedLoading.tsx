import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { useTheme } from '../Hooks/useTheme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Interface para props do spinner
interface SpinnerProps {
  size?: number;
  color?: string;
  thickness?: number;
  duration?: number;
  style?: any;
}

// Interface para props da barra de progresso
interface ProgressBarProps {
  progress: number; // 0.0 a 1.0
  width?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  animated?: boolean;
  duration?: number;
  style?: any;
}

// Interface para props do skeleton
interface SkeletonProps {
  width: number;
  height: number;
  borderRadius?: number;
  animated?: boolean;
  duration?: number;
  style?: any;
}

// Interface para props do loading screen
interface LoadingScreenProps {
  message?: string;
  showProgress?: boolean;
  progress?: number;
  type?: 'spinner' | 'dots' | 'pulse' | 'wave';
  style?: any;
}

// Componente Spinner Circular
export const Spinner: React.FC<SpinnerProps> = ({
  size = 40,
  color,
  thickness = 4,
  duration = 1000,
  style,
}) => {
  const { theme } = useTheme();
  const spinValue = useRef(new Animated.Value(0)).current;
  const spinnerColor = color || theme.colors.primary;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    spinAnimation.start();

    return () => spinAnimation.stop();
  }, [spinValue, duration]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.spinner,
        {
          width: size,
          height: size,
          borderWidth: thickness,
          borderColor: spinnerColor,
          transform: [{ rotate: spin }],
        },
        style,
      ]}
    />
  );
};

// Componente de Pontos Pulsantes
export const DotsLoader: React.FC<{ color?: string; size?: number; style?: any }> = ({
  color,
  size = 8,
  style,
}) => {
  const { theme } = useTheme();
  const dotsColor = color || theme.colors.primary;
  const dot1Opacity = useRef(new Animated.Value(0.3)).current;
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;
  const dot3Opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animateDots = () => {
      const sequence = Animated.sequence([
        Animated.parallel([
          Animated.timing(dot1Opacity, {
            toValue: 1,
            duration: 600,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Opacity, {
            toValue: 0.3,
            duration: 600,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Opacity, {
            toValue: 0.3,
            duration: 600,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(dot1Opacity, {
            toValue: 0.3,
            duration: 600,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Opacity, {
            toValue: 1,
            duration: 600,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Opacity, {
            toValue: 0.3,
            duration: 600,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(dot1Opacity, {
            toValue: 0.3,
            duration: 600,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Opacity, {
            toValue: 0.3,
            duration: 600,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Opacity, {
            toValue: 1,
            duration: 600,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ]),
      ]);

      Animated.loop(sequence).start();
    };

    animateDots();
  }, [dot1Opacity, dot2Opacity, dot3Opacity]);

  return (
    <View style={[styles.dotsContainer, style]}>
      <Animated.View
        style={[
          styles.dot,
          {
            width: size,
            height: size,
            backgroundColor: dotsColor,
            opacity: dot1Opacity,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            width: size,
            height: size,
            backgroundColor: dotsColor,
            opacity: dot2Opacity,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            width: size,
            height: size,
            backgroundColor: dotsColor,
            opacity: dot3Opacity,
          },
        ]}
      />
    </View>
  );
};

// Componente de Pulso
export const PulseLoader: React.FC<{ color?: string; size?: number; style?: any }> = ({
  color,
  size = 40,
  style,
}) => {
  const { theme } = useTheme();
  const pulseColor = color || theme.colors.primary;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleValue, {
            toValue: 1.5,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(opacityValue, {
            toValue: 0,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(opacityValue, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, [scaleValue, opacityValue]);

  return (
    <View style={[styles.pulseContainer, style]}>
      <Animated.View
        style={[
          styles.pulse,
          {
            width: size,
            height: size,
            backgroundColor: pulseColor,
            transform: [{ scale: scaleValue }],
            opacity: opacityValue,
          },
        ]}
      />
      <View
        style={[
          styles.pulseCenter,
          {
            width: size,
            height: size,
            backgroundColor: pulseColor,
          },
        ]}
      />
    </View>
  );
};

// Componente de Onda
export const WaveLoader: React.FC<{ color?: string; size?: number; style?: any }> = ({
  color,
  size = 40,
  style,
}) => {
  const { theme } = useTheme();
  const waveColor = color || theme.colors.primary;
  const wave1Scale = useRef(new Animated.Value(0)).current;
  const wave2Scale = useRef(new Animated.Value(0)).current;
  const wave3Scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const waveAnimation = Animated.loop(
      Animated.stagger(200, [
        Animated.sequence([
          Animated.timing(wave1Scale, {
            toValue: 1,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(wave1Scale, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(wave2Scale, {
            toValue: 1,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(wave2Scale, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(wave3Scale, {
            toValue: 1,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(wave3Scale, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    waveAnimation.start();

    return () => waveAnimation.stop();
  }, [wave1Scale, wave2Scale, wave3Scale]);

  return (
    <View style={[styles.waveContainer, style]}>
      <Animated.View
        style={[
          styles.wave,
          {
            width: size,
            height: size,
            borderColor: waveColor,
            transform: [{ scale: wave1Scale }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.wave,
          {
            width: size,
            height: size,
            borderColor: waveColor,
            transform: [{ scale: wave2Scale }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.wave,
          {
            width: size,
            height: size,
            borderColor: waveColor,
            transform: [{ scale: wave3Scale }],
          },
        ]}
      />
    </View>
  );
};

// Componente de Barra de Progresso
export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  width = 200,
  height = 8,
  color,
  backgroundColor,
  animated = true,
  duration = 500,
  style,
}) => {
  const { theme } = useTheme();
  const progressColor = color || theme.colors.primary;
  const progressBgColor = backgroundColor || theme.colors.border;
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const targetWidth = progress * width;
    
    if (animated) {
      Animated.timing(progressWidth, {
        toValue: targetWidth,
        duration,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    } else {
      progressWidth.setValue(targetWidth);
    }
  }, [progress, width, animated, duration, progressWidth]);

  return (
    <View
      style={[
        styles.progressBar,
        {
          width,
          height,
          backgroundColor: progressBgColor,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.progressFill,
          {
            width: progressWidth,
            height,
            backgroundColor: progressColor,
          },
        ]}
      />
    </View>
  );
};

// Componente de Skeleton
export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  borderRadius = 4,
  animated = true,
  duration = 1500,
  style,
}) => {
  const { theme } = useTheme();
  const opacityValue = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (animated) {
      const skeletonAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacityValue, {
            toValue: 0.7,
            duration: duration / 2,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(opacityValue, {
            toValue: 0.3,
            duration: duration / 2,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      );

      skeletonAnimation.start();

      return () => skeletonAnimation.stop();
    }
  }, [animated, duration, opacityValue]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.colors.border,
          opacity: animated ? opacityValue : 0.3,
        },
        style,
      ]}
    />
  );
};

// Componente de Loading Screen
export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Carregando...',
  showProgress = false,
  progress = 0,
  type = 'spinner',
  style,
}) => {
  const { theme } = useTheme();

  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        return <Spinner size={60} color={theme.colors.primary} />;
      case 'dots':
        return <DotsLoader color={theme.colors.primary} size={12} />;
      case 'pulse':
        return <PulseLoader color={theme.colors.primary} size={60} />;
      case 'wave':
        return <WaveLoader color={theme.colors.primary} size={60} />;
      default:
        return <Spinner size={60} color={theme.colors.primary} />;
    }
  };

  return (
    <View
      style={[
        styles.loadingScreen,
        {
          backgroundColor: theme.colors.background,
        },
        style,
      ]}
    >
      {/* Loader */}
      <View style={styles.loaderContainer}>
        {renderLoader()}
      </View>

      {/* Mensagem */}
      <View style={styles.messageContainer}>
        <View
          style={[
            styles.message,
            { color: theme.colors.text },
          ]}
        >
          {message}
        </View>
      </View>

      {/* Barra de Progresso */}
      {showProgress && (
        <View style={styles.progressContainer}>
          <ProgressBar
            progress={progress}
            width={200}
            height={6}
            color={theme.colors.primary}
            backgroundColor={theme.colors.border}
          />
          <View
            style={[
              styles.progressText,
              { color: theme.colors.textSecondary },
            ]}
          >
            {Math.round(progress * 100)}%
          </View>
        </View>
      )}
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  // Spinner
  spinner: {
    borderRadius: 50,
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },

  // Dots
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    borderRadius: 50,
    marginHorizontal: 4,
  },

  // Pulse
  pulseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    borderRadius: 50,
    position: 'absolute',
  },
  pulseCenter: {
    borderRadius: 50,
  },

  // Wave
  waveContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wave: {
    borderRadius: 50,
    borderWidth: 2,
    position: 'absolute',
  },

  // Progress Bar
  progressBar: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 4,
  },

  // Skeleton
  skeleton: {
    // Estilos já definidos inline
  },

  // Loading Screen
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loaderContainer: {
    marginBottom: 30,
  },
  messageContainer: {
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  progressContainer: {
    alignItems: 'center',
    width: '100%',
  },
  progressText: {
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
});

export default LoadingScreen;