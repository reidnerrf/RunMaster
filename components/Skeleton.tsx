import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  variant?: 'text' | 'title' | 'avatar' | 'button' | 'card' | 'circle';
  lines?: number;
  lineHeight?: number;
  lineSpacing?: number;
  animationDuration?: number;
  shimmer?: boolean;
  pulse?: boolean;
  wave?: boolean;
  color?: string;
  backgroundColor?: string;
  shimmerColor?: string;
  testID?: string;
}

export default function Skeleton({
  width,
  height,
  borderRadius = 8,
  style,
  variant = 'text',
  lines = 1,
  lineHeight = 16,
  lineSpacing = 8,
  animationDuration = 1500,
  shimmer = true,
  pulse = false,
  wave = false,
  color = '#f0f0f0',
  backgroundColor = '#e0e0e0',
  shimmerColor = '#f8f8f8',
  testID,
}: SkeletonProps) {
  // Valores animados
  const opacity = useSharedValue(0.3);
  const translateX = useSharedValue(-100);
  const scale = useSharedValue(1);

  // Configurações baseadas na variante
  const getVariantConfig = () => {
    switch (variant) {
      case 'text':
        return {
          width: width || '100%',
          height: height || lineHeight,
          borderRadius: 4,
        };
      case 'title':
        return {
          width: width || '60%',
          height: height || lineHeight * 1.5,
          borderRadius: 4,
        };
      case 'avatar':
        return {
          width: width || 40,
          height: height || 40,
          borderRadius: height ? height / 2 : 20,
        };
      case 'button':
        return {
          width: width || 120,
          height: height || 44,
          borderRadius: 22,
        };
      case 'card':
        return {
          width: width || '100%',
          height: height || 200,
          borderRadius: 16,
        };
      case 'circle':
        return {
          width: width || 60,
          height: height || 60,
          borderRadius: width ? (width as number) / 2 : 30,
        };
      default:
        return {
          width: width || '100%',
          height: height || 16,
          borderRadius,
        };
    }
  };

  // Configuração de animação
  useEffect(() => {
    if (pulse) {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: animationDuration / 2 }),
          withTiming(0.3, { duration: animationDuration / 2 })
        ),
        -1,
        true
      );
    }

    if (shimmer) {
      translateX.value = withRepeat(
        withTiming(100, { duration: animationDuration }),
        -1,
        false
      );
    }

    if (wave) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: animationDuration / 3 }),
          withTiming(0.95, { duration: animationDuration / 3 }),
          withTiming(1, { duration: animationDuration / 3 })
        ),
        -1,
        true
      );
    }
  }, [pulse, shimmer, wave, animationDuration]);

  // Estilo animado para shimmer
  const shimmerStyle = useAnimatedStyle(() => {
    if (!shimmer) return {};

    const shimmerOpacity = interpolate(
      translateX.value,
      [-100, 0, 100],
      [0, 1, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity: shimmerOpacity,
      transform: [{ translateX: translateX.value }],
    };
  });

  // Estilo animado para pulse
  const pulseStyle = useAnimatedStyle(() => {
    if (!pulse) return {};

    return {
      opacity: opacity.value,
    };
  });

  // Estilo animado para wave
  const waveStyle = useAnimatedStyle(() => {
    if (!wave) return {};

    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Renderiza linha única
  const renderSingleLine = () => {
    const config = getVariantConfig();
    
    return (
      <View
        style={[
          styles.skeleton,
          {
            width: config.width,
            height: config.height,
            borderRadius: config.borderRadius,
            backgroundColor,
          },
          style,
        ]}
        testID={testID}
      >
        {shimmer && (
          <Animated.View
            style={[
              styles.shimmer,
              {
                width: '100%',
                height: '100%',
                borderRadius: config.borderRadius,
                backgroundColor: shimmerColor,
              },
              shimmerStyle,
            ]}
          />
        )}
      </View>
    );
  };

  // Renderiza múltiplas linhas
  const renderMultipleLines = () => {
    const config = getVariantConfig();
    
    return (
      <View style={styles.container}>
        {Array.from({ length: lines }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.skeleton,
              {
                width: index === 0 ? config.width : '80%',
                height: lineHeight,
                borderRadius: 4,
                backgroundColor,
                marginBottom: index < lines - 1 ? lineSpacing : 0,
              },
            ]}
          >
            {shimmer && (
              <Animated.View
                style={[
                  styles.shimmer,
                  {
                    width: '100%',
                    height: '100%',
                    borderRadius: 4,
                    backgroundColor: shimmerColor,
                  },
                  shimmerStyle,
                ]}
              />
            )}
          </View>
        ))}
      </View>
    );
  };

  // Renderiza o skeleton baseado na variante
  if (variant === 'text' && lines > 1) {
    return (
      <Animated.View style={[pulseStyle, waveStyle]}>
        {renderMultipleLines()}
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[pulseStyle, waveStyle]}>
      {renderSingleLine()}
    </Animated.View>
  );
}

// Componente para skeleton de card
export function SkeletonCard({
  width = '100%',
  height = 200,
  borderRadius = 16,
  style,
  testID,
}: {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  testID?: string;
}) {
  return (
    <View
      style={[
        styles.card,
        {
          width,
          height,
          borderRadius,
        },
        style,
      ]}
      testID={testID}
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <Skeleton variant="avatar" width={40} height={40} />
        <View style={styles.cardHeaderContent}>
          <Skeleton variant="title" width="60%" height={20} />
          <Skeleton variant="text" width="40%" height={16} />
        </View>
      </View>
      
      {/* Content */}
      <View style={styles.cardContent}>
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="90%" height={16} />
        <Skeleton variant="text" width="80%" height={16} />
      </View>
      
      {/* Footer */}
      <View style={styles.cardFooter}>
        <Skeleton variant="button" width={80} height={32} />
        <Skeleton variant="button" width={80} height={32} />
      </View>
    </View>
  );
}

// Componente para skeleton de lista
export function SkeletonList({
  items = 3,
  itemHeight = 80,
  itemSpacing = 16,
  style,
  testID,
}: {
  items?: number;
  itemHeight?: number;
  itemSpacing?: number;
  style?: ViewStyle;
  testID?: string;
}) {
  return (
    <View style={[styles.list, style]} testID={testID}>
      {Array.from({ length: items }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.listItem,
            {
              height: itemHeight,
              marginBottom: index < items - 1 ? itemSpacing : 0,
            },
          ]}
        >
          <Skeleton variant="avatar" width={50} height={50} />
          <View style={styles.listItemContent}>
            <Skeleton variant="title" width="70%" height={18} />
            <Skeleton variant="text" width="50%" height={14} />
            <Skeleton variant="text" width="30%" height={14} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  skeleton: {
    position: 'relative',
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeaderContent: {
    flex: 1,
    marginLeft: 12,
  },
  cardContent: {
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  list: {
    width: '100%',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  listItemContent: {
    flex: 1,
    marginLeft: 12,
  },
});