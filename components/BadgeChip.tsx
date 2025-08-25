import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function BadgeChip({ label = 'Premium', color = '#FFD700' }: { label?: string; color?: string }) {
  const glow = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(glow, { toValue: 1, duration: 900, useNativeDriver: false }),
      Animated.timing(glow, { toValue: 0, duration: 900, useNativeDriver: false }),
    ])).start();
  }, [glow]);
  return (
    <Animated.View style={[styles.badge, { shadowOpacity: glow.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.4] }) as any, backgroundColor: color }]}> 
      <Text style={styles.text}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowRadius: 10, elevation: 3 },
  text: { color: '#1E1E1E', fontWeight: '800', fontSize: 12 },
});