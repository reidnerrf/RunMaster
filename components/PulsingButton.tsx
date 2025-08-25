import React, { useEffect, useRef } from 'react';
import { Pressable, Text, View, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function PulsingButton({ label, onPress, icon }: { label: string; onPress: () => void; icon?: React.ReactNode; }) {
  const { theme } = useTheme();
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1200, useNativeDriver: true, easing: Easing.out(Easing.quad) }),
        Animated.timing(pulse, { toValue: 0, duration: 1200, useNativeDriver: true, easing: Easing.in(Easing.quad) }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable onPress={onPress} style={[styles.btn, theme.shadows.heavy, { backgroundColor: theme.colors.primary }]}> 
        <View style={styles.row}> {icon ?? <Text style={{ fontSize: 18 }}>🏃‍♂️</Text>} <Text style={styles.text}>{label}</Text></View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: { borderRadius: 30, paddingVertical: 18, paddingHorizontal: 28, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  text: { color: 'white', fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },
});