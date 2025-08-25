import React, { useRef } from 'react';
import { Pressable, Text, ViewStyle, TextStyle, StyleSheet, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';

export type ActionButtonProps = {
  label: string;
  onPress: () => void;
  color?: string;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  haptic?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
};

export default function ActionButton({ label, onPress, color = '#FF6B00', textColor = 'white', style, textStyle, haptic = true, left, right }: ActionButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 20, bounciness: 8 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 8 }).start();
  };

  const handlePress = () => {
    if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handlePress} style={[styles.btn, { backgroundColor: color }, style]}> 
        {left}
        <Text style={[styles.text, { color: textColor }, textStyle]}>{label}</Text>
        {right}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  text: { fontSize: 16, fontWeight: '800' },
});