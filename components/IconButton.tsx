import React, { useRef } from 'react';
import { Pressable, ViewStyle, StyleSheet, Animated } from 'react-native';

export default function IconButton({ onPress, children, style, color = '#FF6B00', accessibilityLabel }: { onPress: () => void; children: React.ReactNode; style?: ViewStyle; color?: string; accessibilityLabel?: string }) {
  const scale = useRef(new Animated.Value(1)).current;
  const onIn = () => Animated.spring(scale, { toValue: 0.94, useNativeDriver: true, speed: 22, bounciness: 8 }).start();
  const onOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 22, bounciness: 8 }).start();
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPressIn={onIn} onPressOut={onOut} onPress={onPress} style={[styles.btn, { backgroundColor: color }, style]}> 
        {children}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});