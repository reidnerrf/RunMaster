import React from 'react';
import { Pressable, PressableProps } from 'react-native';

interface Props extends PressableProps {
  label?: string;
  role?: 'button' | 'link' | 'menu' | 'menuitem' | 'none' | undefined;
}

export default function AccessiblePressable({ label, role = 'button', accessibilityLabel, hitSlop, ...rest }: Props) {
  const hs = hitSlop || { top: 8, right: 8, bottom: 8, left: 8 };
  return (
    <Pressable
      hitSlop={hs}
      accessibilityRole={role}
      accessibilityLabel={accessibilityLabel || label}
      {...rest}
    />
  );
}

