import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import * as Haptics from 'expo-haptics';
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

  const bg = variant === 'primary' ? theme.colors.primary : variant === 'destructive' ? '#EF4444' : 'transparent';
  const border = variant === 'outline' || variant === 'ghost' ? theme.colors.border : 'transparent';
  const textColor = variant === 'ghost' || variant === 'outline' ? theme.colors.text : '#fff';
  const paddingVertical = size === 'lg' ? 16 : size === 'sm' ? 10 : 14;
  const paddingHorizontal = size === 'lg' ? 18 : size === 'sm' ? 12 : 16;

  const handlePress = () => {
    if (haptic) Haptics.selectionAsync().catch(() => {});
    onPress && onPress();
  };

  return (
    <Pressable onPress={handlePress} disabled={disabled} style={[styles.base, { backgroundColor: disabled ? theme.colors.border : bg, borderColor: border, paddingVertical, paddingHorizontal, opacity: disabled ? 0.6 : 1 }, style]}> 
      {leftIcon ? <View style={{ marginRight: 8 }}>{leftIcon}</View> : null}
      <Text style={[styles.text, { color: textColor }, textStyle]}>{title}</Text>
      {rightIcon ? <View style={{ marginLeft: 8 }}>{rightIcon}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  text: { fontWeight: '800', fontSize: 16 },
});

