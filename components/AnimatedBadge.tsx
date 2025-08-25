import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function AnimatedBadge({ label }: { label: string }) {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1, duration: 450, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
      Animated.loop(Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])),
    ]).start();
  }, [scale, glow]);

  const shadowRadius = glow.interpolate({ inputRange: [0, 1], outputRange: [6, 16] });
  const shadowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });

  return (
    <Animated.View style={[styles.badge, { backgroundColor: theme.colors.gold, transform: [{ scale }], shadowColor: theme.colors.gold, shadowRadius: shadowRadius as any, shadowOpacity: shadowOpacity as any }]}>
      <Text style={styles.text}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'center', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999 },
  text: { fontWeight: '800', color: '#1E1E1E', letterSpacing: 0.5 },
});