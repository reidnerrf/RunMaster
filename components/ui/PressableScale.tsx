import React from 'react';
import { Animated, Pressable, PressableProps } from 'react-native';

interface PressableScaleProps extends PressableProps {
  scaleTo?: number;
  duration?: number;
}

export default function PressableScale({ children, scaleTo = 0.98, duration = 80, style, ...rest }: PressableScaleProps) {
  const scale = React.useRef(new Animated.Value(1)).current;

  const animateTo = (to: number) => {
    Animated.timing(scale, { toValue: to, duration, useNativeDriver: true }).start();
  };

  return (
    <Pressable
      onPressIn={() => animateTo(scaleTo)}
      onPressOut={() => animateTo(1)}
      {...rest}
      style={({ pressed }) => [
        { transform: [{ scale }] },
        typeof style === 'function' ? (style as any)({ pressed }) : style,
      ]}
    >
      {children}
    </Pressable>
  );
}

