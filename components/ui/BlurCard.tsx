import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

export default function BlurCard({ children, intensity = 40, style }: { children: React.ReactNode; intensity?: number; style?: ViewStyle }) {
  if (Platform.OS === 'web') {
    return <View style={[styles.card, { backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.2)', borderWidth: 1 }, style]}>{children}</View>;
  }
  return (
    <BlurView intensity={intensity} tint="dark" style={[styles.card, style]}> 
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, padding: 16, overflow: 'hidden' },
});