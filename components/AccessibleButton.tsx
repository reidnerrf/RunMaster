import React, { useState, useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  AccessibilityInfo,
  Platform,
  Vibration,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface AccessibleButtonProps {
  title: string;
  onPress: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  iconSize?: number;
  iconColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'link' | 'tab' | 'radio' | 'checkbox';
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean;
    busy?: boolean;
    expanded?: boolean;
  };
  accessibilityActions?: Array<{
    name: string;
    label: string;
  }>;
  onAccessibilityAction?: (event: { nativeEvent: { actionName: string } }) => void;
  hapticFeedback?: boolean;
  hapticType?: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';
  showFocusIndicator?: boolean;
  focusStyle?: ViewStyle;
  testID?: string;
}

export default function AccessibleButton({
  title,
  onPress,
  onLongPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  iconSize = 20,
  iconColor,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'button',
  accessibilityState,
  accessibilityActions,
  onAccessibilityAction,
  hapticFeedback = true,
  hapticType = 'light',
  showFocusIndicator = true,
  focusStyle,
  testID,
}: AccessibleButtonProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Determina cores baseadas na variante
  const getVariantColors = () => {
    switch (variant) {
      case 'primary':
        return {
          background: ['#667eea', '#764ba2'],
          text: '#ffffff',
          border: 'transparent',
          icon: '#ffffff',
        };
      case 'secondary':
        return {
          background: ['#f8f9fa', '#e9ecef'],
          text: '#495057',
          border: 'transparent',
          icon: '#495057',
        };
      case 'outline':
        return {
          background: ['transparent', 'transparent'],
          text: '#667eea',
          border: '#667eea',
          icon: '#667eea',
        };
      case 'ghost':
        return {
          background: ['transparent', 'transparent'],
          text: '#667eea',
          border: 'transparent',
          icon: '#667eea',
        };
      case 'danger':
        return {
          background: ['#dc3545', '#c82333'],
          text: '#ffffff',
          border: 'transparent',
          icon: '#ffffff',
        };
      case 'success':
        return {
          background: ['#28a745', '#1e7e34'],
          text: '#ffffff',
          border: 'transparent',
          icon: '#ffffff',
        };
      default:
        return {
          background: ['#667eea', '#764ba2'],
          text: '#ffffff',
          border: 'transparent',
          icon: '#ffffff',
        };
    }
  };

  // Determina tamanhos baseados no size
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          fontSize: 14,
          iconSize: 16,
          borderRadius: 16,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 32,
          fontSize: 18,
          iconSize: 24,
          borderRadius: 24,
        };
      default: // medium
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
          fontSize: 16,
          iconSize: 20,
          borderRadius: 20,
        };
    }
  };

  const colors = getVariantColors();
  const sizes = getSizeStyles();

  // Haptic feedback
  const triggerHaptic = useCallback(() => {
    if (!hapticFeedback || disabled) return;

    switch (hapticType) {
      case 'light':
        Vibration.vibrate(10);
        break;
      case 'medium':
        Vibration.vibrate(20);
        break;
      case 'heavy':
        Vibration.vibrate(30);
        break;
      case 'success':
        Vibration.vibrate([0, 20, 40, 20]);
        break;
      case 'warning':
        Vibration.vibrate([0, 20, 40, 20, 40, 20]);
        break;
      case 'error':
        Vibration.vibrate([0, 20, 40, 20, 40, 20, 40, 20]);
        break;
    }
  }, [hapticFeedback, hapticType, disabled]);

  // Handle press with haptic feedback
  const handlePress = useCallback(() => {
    if (disabled || loading) return;
    
    triggerHaptic();
    onPress();
  }, [disabled, loading, triggerHaptic, onPress]);

  // Handle long press
  const handleLongPress = useCallback(() => {
    if (disabled || loading || !onLongPress) return;
    
    triggerHaptic();
    onLongPress();
  }, [disabled, loading, onLongPress, triggerHaptic]);

  // Handle focus
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (Platform.OS === 'web') {
      // Anunciar foco para leitores de tela
      AccessibilityInfo.announceForAccessibility?.(`Focado em ${accessibilityLabel || title}`);
    }
  }, [accessibilityLabel, title]);

  // Handle blur
  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  // Handle press in/out for visual feedback
  const handlePressIn = useCallback(() => {
    if (disabled || loading) return;
    setIsPressed(true);
  }, [disabled, loading]);

  const handlePressOut = useCallback(() => {
    if (disabled || loading) return;
    setIsPressed(false);
  }, [disabled, loading]);

  // Render icon
  const renderIcon = () => {
    if (!icon) return null;

    const iconColorToUse = iconColor || colors.icon;
    const iconSizeToUse = iconSize || sizes.iconSize;

    return (
      <Ionicons
        name={icon}
        size={iconSizeToUse}
        color={iconColorToUse}
        style={[
          styles.icon,
          iconPosition === 'right' && styles.iconRight,
        ]}
      />
    );
  };

  // Determina estilo do botão baseado no estado
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      paddingVertical: sizes.paddingVertical,
      paddingHorizontal: sizes.paddingHorizontal,
      borderRadius: sizes.borderRadius,
      borderWidth: variant === 'outline' ? 2 : 0,
      borderColor: colors.border,
      opacity: disabled ? 0.6 : 1,
      transform: [{ scale: isPressed ? 0.98 : 1 }],
    };

    // Adiciona foco visual se habilitado
    if (showFocusIndicator && isFocused) {
      return {
        ...baseStyle,
        ...focusStyle,
        shadowColor: colors.background[0],
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      };
    }

    return baseStyle;
  };

  // Determina estilo do texto
  const getTextStyle = (): TextStyle => {
    return {
      fontSize: sizes.fontSize,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
      ...textStyle,
    };
  };

  // Determina se deve usar gradiente ou cor sólida
  const shouldUseGradient = variant !== 'outline' && variant !== 'ghost';

  const buttonContent = (
    <>
      {icon && iconPosition === 'left' && renderIcon()}
      <Text style={[styles.text, getTextStyle()]} numberOfLines={1}>
        {loading ? 'Carregando...' : title}
      </Text>
      {icon && iconPosition === 'right' && renderIcon()}
      {loading && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size="small" color={colors.text} />
        </View>
      )}
    </>
  );

  return (
    <TouchableOpacity
      style={[styles.container, getButtonStyle(), style]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onFocus={handleFocus}
      onBlur={handleBlur}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessible={true}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
      accessibilityState={{
        disabled: disabled || loading,
        busy: loading,
        ...accessibilityState,
      }}
      accessibilityActions={accessibilityActions}
      onAccessibilityAction={onAccessibilityAction}
      testID={testID}
    >
      {shouldUseGradient ? (
        <LinearGradient
          colors={colors.background}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {buttonContent}
        </LinearGradient>
      ) : (
        buttonContent
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 44, // WCAG recomendação para área de toque
    minWidth: 44,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 20,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  icon: {
    marginRight: 8,
  },
  iconRight: {
    marginRight: 0,
    marginLeft: 8,
  },
  loadingIndicator: {
    marginLeft: 8,
  },
});