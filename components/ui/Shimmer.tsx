import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, ViewStyle } from 'react-native';

export default function Shimmer({ width = '100%', height = 16, radius = 12, style }: { width?: number | string; height?: number; radius?: number; style?: ViewStyle }) {
  const animated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(animated, { toValue: 1, duration: 1200, easing: Easing.linear, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, [animated]);

  const translateX = animated.interpolate({ inputRange: [0, 1], outputRange: [-100, 200] });

  return (
    <View style={[styles.container, { width, height, borderRadius: radius }, style]}> 
      <Animated.View style={[styles.shine, { transform: [{ translateX }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden', backgroundColor: '#E5E5EA' },
  shine: { position: 'absolute', top: 0, bottom: 0, width: 100, backgroundColor: 'rgba(255,255,255,0.35)' },
});