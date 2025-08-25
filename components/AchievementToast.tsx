import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const { width: W } = Dimensions.get('window');

type Props = { visible: boolean; label: string };

type Confetti = { left: number; anim: Animated.Value; color: string };

export default function AchievementToast({ visible, label }: Props) {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const confetti = useMemo<Confetti[]>(() => {
    const colors = ['#FF6B00', '#FFD700', '#00CFFF', '#34C759', '#FF3B30'];
    return new Array(10).fill(0).map((_, i) => ({ left: Math.random() * (W - 60) + 30, anim: new Animated.Value(0), color: colors[i % colors.length] }));
  }, []);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(scale, { toValue: 1, duration: 250, easing: Easing.out(Easing.back(1.2)), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]).start();
      confetti.forEach((c, i) => {
        c.anim.setValue(0);
        Animated.timing(c.anim, { toValue: 1, duration: 900 + i * 50, useNativeDriver: true }).start();
      });
    } else {
      Animated.parallel([
        Animated.timing(scale, { toValue: 0.8, duration: 200, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 160, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, scale, opacity, confetti]);

  if (!visible) return null;

  return (
    <View pointerEvents="none" style={styles.overlay}>
      {confetti.map((c, i) => (
        <Animated.View key={i} style={{ position: 'absolute', top: 0, left: c.left, width: 8, height: 12, borderRadius: 2, backgroundColor: c.color, transform: [{ translateY: c.anim.interpolate({ inputRange: [0, 1], outputRange: [-20, 140] }) }, { rotate: c.anim.interpolate({ inputRange: [0, 1], outputRange: ['-20deg', '25deg'] }) }] }} />
      ))}
      <Animated.View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, transform: [{ scale }], opacity }]}> 
        <Text style={[styles.title, { color: theme.colors.text }]}>Conquista!</Text>
        <Text style={{ color: theme.colors.muted }}>{label}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', left: 0, right: 0, top: 80, alignItems: 'center' },
  card: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 14, borderWidth: 1 },
  title: { fontWeight: '900', marginBottom: 2 },
});