import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { hapticSelection } from '../../utils/haptics';
import { useSpacing, useTypography } from './mixins';
import { useTheme } from '../../hooks/useTheme';

type ButtonVariant = 'primary' | 'ghost' | 'destructive' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  haptic?: boolean;
}

export default function Button({ title, onPress, disabled, variant = 'primary', size = 'md', leftIcon, rightIcon, style, textStyle, haptic = true }: ButtonProps) {
  const { theme } = useTheme();
  const spacing = useSpacing();
  const typo = useTypography();

  const bg = variant === 'primary' ? theme.colors.primary : variant === 'destructive' ? '#EF4444' : 'transparent';
  const border = variant === 'outline' || variant === 'ghost' ? theme.colors.border : 'transparent';
  const textColor = variant === 'ghost' || variant === 'outline' ? theme.colors.text : '#fff';
  const paddingVertical = size === 'lg' ? spacing.md : size === 'sm' ? spacing.sm : spacing.md;
  const paddingHorizontal = size === 'lg' ? spacing.lg : size === 'sm' ? spacing.md : spacing.md;

  const handlePress = () => {
    if (haptic) hapticSelection();
    onPress && onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: disabled ? theme.colors.border : bg,
          borderColor: border,
          paddingVertical,
          paddingHorizontal,
          opacity: disabled ? 0.6 : pressed ? 0.85 : 1,
          transform: pressed ? [{ scale: 0.98 }] : undefined,
        },
        style,
      ]}
    > 
      {leftIcon ? <View style={{ marginRight: 8 }}>{leftIcon}</View> : null}
      <Text
        style={[styles.text, { color: textColor, fontSize: typo.fontSize.base }, textStyle]}
        allowFontScaling
        maxFontSizeMultiplier={1.6}
        accessibilityRole="text"
      >
        {title}
      </Text>
      {rightIcon ? <View style={{ marginLeft: 8 }}>{rightIcon}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  text: { fontWeight: '800', fontSize: 16 },
});

