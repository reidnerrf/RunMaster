import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '../Hooks/useTheme';
import { CachedImage } from './CachedImage';

interface LoadingScreenProps {
  message?: string;
  showProgress?: boolean;
  progress?: number;
  logo?: string;
  subtitle?: string;
}

const { width, height } = Dimensions.get('window');

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Carregando...',
  showProgress = false,
  progress = 0,
  logo = 'https://via.placeholder.com/120x120/4CAF50/FFFFFF?text=🏃‍♂️',
  subtitle = 'Preparando sua experiência de corrida',
}) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Animação de pulso contínua
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, [fadeAnim, scaleAnim, pulseAnim]);

  useEffect(() => {
    if (showProgress && progress !== undefined) {
      Animated.timing(progressAnim, {
        toValue: progress / 100,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [progress, showProgress, progressAnim]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Logo animado */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { scale: pulseAnim },
            ],
          },
        ]}
      >
        <CachedImage
          source={{ uri: logo }}
          style={styles.logo}
          placeholderColor={theme.colors.primary}
        />
      </Animated.View>

      {/* Título principal */}
      <Animated.Text
        style={[
          styles.title,
          {
            color: theme.colors.text,
            opacity: fadeAnim,
            transform: [{ translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }) }],
          },
        ]}
      >
        RunTracker Pro
      </Animated.Text>

      {/* Subtítulo */}
      <Animated.Text
        style={[
          styles.subtitle,
          {
            color: theme.colors.textSecondary,
            opacity: fadeAnim,
            transform: [{ translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [15, 0],
            }) }],
          },
        ]}
      >
        {subtitle}
      </Animated.Text>

      {/* Mensagem de carregamento */}
      <Animated.Text
        style={[
          styles.message,
          {
            color: theme.colors.text,
            opacity: fadeAnim,
            transform: [{ translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 0],
            }) }],
          },
        ]}
      >
        {message}
      </Animated.Text>

      {/* Barra de progresso */}
      {showProgress && (
        <Animated.View
          style={[
            styles.progressContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [10, 0],
              }) }],
            },
          ]}
        >
          <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: theme.colors.primary,
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
            {Math.round(progress)}%
          </Text>
        </Animated.View>
      )}

      {/* Indicadores de carregamento */}
      <Animated.View
        style={[
          styles.loadingIndicators,
          {
            opacity: fadeAnim,
            transform: [{ translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [15, 0],
            }) }],
          },
        ]}
      >
        <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
        <View style={[styles.dot, { backgroundColor: theme.colors.secondary }]} />
        <View style={[styles.dot, { backgroundColor: theme.colors.accent }]} />
      </Animated.View>

      {/* Informações de versão */}
      <Animated.Text
        style={[
          styles.version,
          {
            color: theme.colors.textTertiary,
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.6],
            }),
          },
        ]}
      >
        v1.0.0 • Beta
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.8,
    lineHeight: 22,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
    maxWidth: width * 0.8,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  progressBar: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  version: {
    fontSize: 12,
    position: 'absolute',
    bottom: 40,
    textAlign: 'center',
  },
});

export default LoadingScreen;