import React, { forwardRef, useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Platform,
  AccessibilityInfo,
  AccessibilityRole,
  AccessibilityState,
  AccessibilityActionInfo,
  AccessibilityActionEvent,
} from 'react-native';
import { useTheme } from '../Hooks/useTheme';
import { getAccessibilitySettings } from '../utils/accessibilityService';

// Interface para props de acessibilidade
interface AccessibilityProps {
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: AccessibilityRole;
  accessibilityState?: AccessibilityState;
  accessibilityActions?: AccessibilityActionInfo[];
  accessibilityValue?: {
    min?: number;
    max?: number;
    now?: number;
    text?: string;
  };
  accessibilityViewIsModal?: boolean;
  accessibilityElementsHidden?: boolean;
  accessibilityIgnoresInvertColors?: boolean;
  accessibilityLiveRegion?: 'none' | 'polite' | 'assertive';
  accessibilityTraits?: string[];
  importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
  onAccessibilityAction?: (event: AccessibilityActionEvent) => void;
  onAccessibilityEscape?: () => void;
  onAccessibilityTap?: () => void;
  onMagicTap?: () => void;
}

// Interface para props de contraste
interface ContrastProps {
  highContrast?: boolean;
  colorBlindSupport?: boolean;
  invertColors?: boolean;
}

// Interface para props de tipografia
interface TypographyProps {
  dynamicType?: boolean;
  largeText?: boolean;
  boldText?: boolean;
  minimumFontSize?: number;
}

// Interface para props de áreas de toque
interface TouchTargetProps {
  largeTouchTargets?: boolean;
  minimumTouchSize?: number;
  recommendedTouchSize?: number;
}

// Interface para props de navegação
interface NavigationProps {
  keyboardNavigation?: boolean;
  focusable?: boolean;
  nextFocusForward?: any;
  nextFocusDown?: any;
  nextFocusUp?: any;
  nextFocusLeft?: any;
  nextFocusRight?: any;
}

// Componente de botão acessível
interface AccessibleButtonProps extends
  AccessibilityProps,
  ContrastProps,
  TypographyProps,
  TouchTargetProps,
  NavigationProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: any;
  children?: React.ReactNode;
}

export const AccessibleButton = forwardRef<TouchableOpacity, AccessibleButtonProps>(
  ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    icon,
    style,
    children,
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole = 'button',
    accessibilityState,
    accessibilityActions,
    onAccessibilityAction,
    highContrast,
    colorBlindSupport,
    invertColors,
    dynamicType,
    largeText,
    boldText,
    minimumFontSize = 16,
    largeTouchTargets = true,
    minimumTouchSize = 44,
    recommendedTouchSize = 48,
    keyboardNavigation = true,
    focusable = true,
    ...accessibilityProps
  }, ref) => {
    const { theme } = useTheme();
    const [accessibilitySettings] = useState(getAccessibilitySettings());
    
    // Aplicar configurações de acessibilidade
    const isHighContrast = highContrast || accessibilitySettings.highContrast;
    const isLargeText = largeText || accessibilitySettings.largeText;
    const isBoldText = boldText || accessibilitySettings.boldText;
    const isLargeTouch = largeTouchTargets || accessibilitySettings.largeTouchTargets;
    const isKeyboardNav = keyboardNavigation || accessibilitySettings.keyboardNavigation;
    
    // Calcular tamanhos baseados em acessibilidade
    const touchSize = isLargeTouch ? recommendedTouchSize : minimumTouchSize;
    const fontSize = Math.max(
      minimumFontSize,
      isLargeText ? 18 : 16,
      dynamicType ? 16 : 16
    );
    
    // Estilos baseados em acessibilidade
    const buttonStyles = [
      styles.button,
      {
        minHeight: touchSize,
        minWidth: touchSize,
        paddingHorizontal: Math.max(16, touchSize * 0.3),
        paddingVertical: Math.max(8, touchSize * 0.2),
      },
      variant === 'primary' && {
        backgroundColor: isHighContrast ? theme.colors.primary : theme.colors.primary,
        borderColor: isHighContrast ? theme.colors.primary : theme.colors.primary,
      },
      variant === 'secondary' && {
        backgroundColor: isHighContrast ? theme.colors.secondary : theme.colors.secondary,
        borderColor: isHighContrast ? theme.colors.secondary : theme.colors.secondary,
      },
      variant === 'outline' && {
        backgroundColor: 'transparent',
        borderColor: isHighContrast ? theme.colors.primary : theme.colors.primary,
        borderWidth: 2,
      },
      variant === 'ghost' && {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      },
      disabled && {
        opacity: 0.5,
        backgroundColor: theme.colors.disabled,
      },
      style,
    ];
    
    const textStyles = [
      styles.text,
      {
        fontSize,
        fontWeight: isBoldText ? 'bold' : '600',
        color: variant === 'outline' || variant === 'ghost' 
          ? (isHighContrast ? theme.colors.primary : theme.colors.primary)
          : (isHighContrast ? theme.colors.onPrimary : theme.colors.onPrimary),
      },
    ];
    
    // Configurações de acessibilidade
    const accessibilityConfig = {
      accessible: true,
      accessibilityLabel: accessibilityLabel || title,
      accessibilityHint: accessibilityHint || `Botão ${title}`,
      accessibilityRole,
      accessibilityState: {
        disabled,
        busy: loading,
        ...accessibilityState,
      },
      accessibilityActions,
      onAccessibilityAction,
      accessibilityViewIsModal: false,
      accessibilityElementsHidden: false,
      accessibilityIgnoresInvertColors: false,
      accessibilityLiveRegion: 'none',
      importantForAccessibility: 'yes',
      ...accessibilityProps,
    };
    
    // Suporte a navegação por teclado
    if (isKeyboardNav) {
      Object.assign(accessibilityConfig, {
        focusable,
        ...accessibilityProps,
      });
    }
    
    return (
      <TouchableOpacity
        ref={ref}
        style={buttonStyles}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        {...accessibilityConfig}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={textStyles}>{title}</Text>
        {children}
        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={[textStyles, styles.loadingText]}>...</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }
);

// Componente de input acessível
interface AccessibleInputProps extends
  AccessibilityProps,
  ContrastProps,
  TypographyProps,
  TouchTargetProps,
  NavigationProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  error?: string;
  style?: any;
}

export const AccessibleInput = forwardRef<TextInput, AccessibleInputProps>(
  ({
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
    autoCorrect = true,
    multiline = false,
    numberOfLines = 1,
    maxLength,
    error,
    style,
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole = 'text',
    accessibilityState,
    accessibilityValue,
    accessibilityActions,
    onAccessibilityAction,
    highContrast,
    colorBlindSupport,
    invertColors,
    dynamicType,
    largeText,
    boldText,
    minimumFontSize = 16,
    largeTouchTargets = true,
    minimumTouchSize = 44,
    recommendedTouchSize = 48,
    keyboardNavigation = true,
    focusable = true,
    ...accessibilityProps
  }, ref) => {
    const { theme } = useTheme();
    const [accessibilitySettings] = useState(getAccessibilitySettings());
    
    // Aplicar configurações de acessibilidade
    const isHighContrast = highContrast || accessibilitySettings.highContrast;
    const isLargeText = largeText || accessibilitySettings.largeText;
    const isBoldText = boldText || accessibilitySettings.boldText;
    const isLargeTouch = largeTouchTargets || accessibilitySettings.largeTouchTargets;
    const isKeyboardNav = keyboardNavigation || accessibilitySettings.keyboardNavigation;
    
    // Calcular tamanhos baseados em acessibilidade
    const touchSize = isLargeTouch ? recommendedTouchSize : minimumTouchSize;
    const fontSize = Math.max(
      minimumFontSize,
      isLargeText ? 18 : 16,
      dynamicType ? 16 : 16
    );
    
    // Estilos baseados em acessibilidade
    const inputStyles = [
      styles.input,
      {
        minHeight: Math.max(touchSize, multiline ? 80 : touchSize),
        fontSize,
        fontWeight: isBoldText ? 'bold' : 'normal',
        color: isHighContrast ? theme.colors.text : theme.colors.text,
        backgroundColor: isHighContrast ? theme.colors.background : theme.colors.background,
        borderColor: error 
          ? (isHighContrast ? theme.colors.error : theme.colors.error)
          : (isHighContrast ? theme.colors.border : theme.colors.border),
        borderWidth: isHighContrast ? 2 : 1,
        paddingHorizontal: Math.max(12, touchSize * 0.25),
        paddingVertical: Math.max(8, touchSize * 0.2),
      },
      style,
    ];
    
    const placeholderStyles = {
      color: isHighContrast ? theme.colors.textSecondary : theme.colors.textSecondary,
      fontSize,
      fontWeight: isBoldText ? 'bold' : 'normal',
    };
    
    // Configurações de acessibilidade
    const accessibilityConfig = {
      accessible: true,
      accessibilityLabel: accessibilityLabel || placeholder || 'Campo de entrada',
      accessibilityHint: accessibilityHint || `Digite ${placeholder || 'texto'}`,
      accessibilityRole,
      accessibilityState: {
        ...accessibilityState,
      },
      accessibilityValue,
      accessibilityActions,
      onAccessibilityAction,
      accessibilityViewIsModal: false,
      accessibilityElementsHidden: false,
      accessibilityIgnoresInvertColors: false,
      accessibilityLiveRegion: 'none',
      importantForAccessibility: 'yes',
      ...accessibilityProps,
    };
    
    // Suporte a navegação por teclado
    if (isKeyboardNav) {
      Object.assign(accessibilityConfig, {
        focusable,
        ...accessibilityProps,
      });
    }
    
    return (
      <View style={styles.inputContainer}>
        <TextInput
          ref={ref}
          style={inputStyles}
          placeholder={placeholder}
          placeholderTextColor={placeholderStyles.color}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          {...accessibilityConfig}
        />
        {error && (
          <Text style={[
            styles.errorText,
            {
              color: isHighContrast ? theme.colors.error : theme.colors.error,
              fontSize: Math.max(12, fontSize * 0.75),
              fontWeight: isBoldText ? 'bold' : 'normal',
            },
          ]}>
            {error}
          </Text>
        )}
      </View>
    );
  }
);

// Componente de texto acessível
interface AccessibleTextProps extends
  AccessibilityProps,
  ContrastProps,
  TypographyProps {
  children: React.ReactNode;
  variant?: 'title' | 'subtitle' | 'body' | 'caption' | 'button';
  size?: 'small' | 'medium' | 'large' | 'extraLarge';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  style?: any;
}

export const AccessibleText: React.FC<AccessibleTextProps> = ({
  children,
  variant = 'body',
  size = 'medium',
  weight = 'normal',
  color,
  align = 'left',
  style,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'text',
  accessibilityState,
  accessibilityValue,
  accessibilityActions,
  onAccessibilityAction,
  highContrast,
  colorBlindSupport,
  invertColors,
  dynamicType,
  largeText,
  boldText,
  minimumFontSize = 12,
  ...accessibilityProps
}) => {
  const { theme } = useTheme();
  const [accessibilitySettings] = useState(getAccessibilitySettings());
  
  // Aplicar configurações de acessibilidade
  const isHighContrast = highContrast || accessibilitySettings.highContrast;
  const isLargeText = largeText || accessibilitySettings.largeText;
  const isBoldText = boldText || accessibilitySettings.boldText;
  
  // Calcular tamanhos baseados em acessibilidade
  const baseFontSize = Math.max(
    minimumFontSize,
    dynamicType ? 16 : 16
  );
  
  const fontSizeMap = {
    small: baseFontSize * 0.875,
    medium: baseFontSize,
    large: baseFontSize * 1.125,
    extraLarge: baseFontSize * 1.5,
  };
  
  const finalFontSize = Math.max(
    fontSizeMap[size],
    isLargeText ? 18 : fontSizeMap[size]
  );
  
  // Mapear variantes para estilos
  const variantStyles = {
    title: {
      fontSize: finalFontSize * 1.5,
      fontWeight: 'bold' as const,
      lineHeight: finalFontSize * 1.5 * 1.2,
    },
    subtitle: {
      fontSize: finalFontSize * 1.25,
      fontWeight: 'semibold' as const,
      lineHeight: finalFontSize * 1.25 * 1.3,
    },
    body: {
      fontSize: finalFontSize,
      fontWeight: weight as any,
      lineHeight: finalFontSize * 1.5,
    },
    caption: {
      fontSize: finalFontSize * 0.875,
      fontWeight: 'normal' as const,
      lineHeight: finalFontSize * 0.875 * 1.4,
    },
    button: {
      fontSize: finalFontSize,
      fontWeight: 'semibold' as const,
      lineHeight: finalFontSize * 1.2,
    },
  };
  
  // Estilos baseados em acessibilidade
  const textStyles = [
    styles.text,
    variantStyles[variant],
    {
      color: color || (isHighContrast ? theme.colors.text : theme.colors.text),
      textAlign: align,
      fontWeight: isBoldText ? 'bold' : variantStyles[variant].fontWeight,
    },
    style,
  ];
  
  // Configurações de acessibilidade
  const accessibilityConfig = {
    accessible: true,
    accessibilityLabel: accessibilityLabel || (typeof children === 'string' ? children : 'Texto'),
    accessibilityHint: accessibilityHint,
    accessibilityRole,
    accessibilityState,
    accessibilityValue,
    accessibilityActions,
    onAccessibilityAction,
    accessibilityViewIsModal: false,
    accessibilityElementsHidden: false,
    accessibilityIgnoresInvertColors: false,
    accessibilityLiveRegion: 'none',
    importantForAccessibility: 'yes',
    ...accessibilityProps,
  };
  
  return (
    <Text style={textStyles} {...accessibilityConfig}>
      {children}
    </Text>
  );
};

// Componente de container acessível
interface AccessibleContainerProps extends
  AccessibilityProps,
  ContrastProps {
  children: React.ReactNode;
  variant?: 'card' | 'section' | 'modal' | 'overlay';
  style?: any;
}

export const AccessibleContainer: React.FC<AccessibleContainerProps> = ({
  children,
  variant = 'section',
  style,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'none',
  accessibilityState,
  accessibilityValue,
  accessibilityActions,
  onAccessibilityAction,
  highContrast,
  colorBlindSupport,
  invertColors,
  ...accessibilityProps
}) => {
  const { theme } = useTheme();
  const [accessibilitySettings] = useState(getAccessibilitySettings());
  
  // Aplicar configurações de acessibilidade
  const isHighContrast = highContrast || accessibilitySettings.highContrast;
  
  // Estilos baseados em acessibilidade
  const containerStyles = [
    styles.container,
    variant === 'card' && {
      backgroundColor: isHighContrast ? theme.colors.card : theme.colors.card,
      borderColor: isHighContrast ? theme.colors.border : theme.colors.border,
      borderWidth: isHighContrast ? 2 : 1,
      borderRadius: 12,
      padding: 16,
      shadowColor: isHighContrast ? theme.colors.primary : theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isHighContrast ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: isHighContrast ? 8 : 4,
    },
    variant === 'section' && {
      backgroundColor: 'transparent',
      paddingVertical: 16,
    },
    variant === 'modal' && {
      backgroundColor: isHighContrast ? theme.colors.card : theme.colors.card,
      borderColor: isHighContrast ? theme.colors.primary : theme.colors.border,
      borderWidth: isHighContrast ? 3 : 1,
      borderRadius: 16,
      padding: 24,
      shadowColor: isHighContrast ? theme.colors.primary : theme.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isHighContrast ? 0.4 : 0.2,
      shadowRadius: 8,
      elevation: isHighContrast ? 12 : 8,
    },
    variant === 'overlay' && {
      backgroundColor: isHighContrast ? theme.colors.overlay : theme.colors.overlay,
      borderColor: isHighContrast ? theme.colors.primary : theme.colors.border,
      borderWidth: isHighContrast ? 2 : 1,
      borderRadius: 8,
      padding: 16,
    },
    style,
  ];
  
  // Configurações de acessibilidade
  const accessibilityConfig = {
    accessible: true,
    accessibilityLabel: accessibilityLabel || `Container ${variant}`,
    accessibilityHint: accessibilityHint,
    accessibilityRole,
    accessibilityState,
    accessibilityValue,
    accessibilityActions,
    onAccessibilityAction,
    accessibilityViewIsModal: variant === 'modal',
    accessibilityElementsHidden: false,
    accessibilityIgnoresInvertColors: false,
    accessibilityLiveRegion: 'none',
    importantForAccessibility: 'yes',
    ...accessibilityProps,
  };
  
  return (
    <View style={containerStyles} {...accessibilityConfig}>
      {children}
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  text: {
    textAlign: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  loadingContainer: {
    marginLeft: 8,
  },
  loadingText: {
    opacity: 0.7,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    textAlignVertical: 'top',
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
  },
  container: {
    width: '100%',
  },
});

// Exportar todos os componentes
export default {
  AccessibleButton,
  AccessibleInput,
  AccessibleText,
  AccessibleContainer,
};