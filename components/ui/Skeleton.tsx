import React from 'react';
import { Animated, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  style?: ViewStyle;
  radius?: number;
}

export default function Skeleton({ width = '100%', height = 16, style, radius = 8 }: SkeletonProps) {
  const { theme } = useTheme();
  const opacity = React.useRef(new Animated.Value(0.6)).current;
  React.useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(opacity, { toValue: 0.2, duration: 700, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0.6, duration: 700, useNativeDriver: true }),
    ])).start();
  }, [opacity]);
  return (
    <Animated.View style={[{ width, height, borderRadius: radius, backgroundColor: theme.colors.border, opacity }, style]} />
  );
}

