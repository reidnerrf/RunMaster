import { useState, useEffect, useCallback, useMemo } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'auto' | 'custom';

export interface ThemeColors {
  // Cores primárias
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryGradient: string[];
  
  // Cores secundárias
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  secondaryGradient: string[];
  
  // Cores de fundo
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  backgroundCard: string;
  backgroundModal: string;
  
  // Cores de texto
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  
  // Cores de estado
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Cores de interface
  border: string;
  borderLight: string;
  divider: string;
  shadow: string;
  overlay: string;
  
  // Cores específicas do app
  running: string;
  walking: string;
  cycling: string;
  swimming: string;
  
  // Cores de gamificação
  gold: string;
  silver: string;
  bronze: string;
  xp: string;
  
  // Cores de saúde
  heartRate: string;
  calories: string;
  distance: string;
  pace: string;
}

export interface ThemeTypography {
  // Famílias de fonte
  fontFamily: {
    regular: string;
    medium: string;
    semibold: string;
    bold: string;
    monospace: string;
  };
  
  // Tamanhos de fonte
  fontSize: {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
    '5xl': number;
  };
  
  // Alturas de linha
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
  
  // Pesos de fonte
  fontWeight: {
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
    extrabold: string;
  };
}

export interface ThemeSpacing {
  // Espaçamentos base
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  '4xl': number;
  
  // Espaçamentos específicos
  screenPadding: number;
  cardPadding: number;
  buttonPadding: number;
  inputPadding: number;
}

export interface ThemeShadows {
  // Sombras base
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  
  // Sombras específicas
  card: string;
  button: string;
  modal: string;
  floating: string;
}

export interface ThemeAnimations {
  // Durações
  fast: number;
  normal: number;
  slow: number;
  
  // Curvas de easing
  easeIn: string;
  easeOut: string;
  easeInOut: string;
  bounce: string;
  
  // Animações específicas
  fadeIn: string;
  slideUp: string;
  scaleIn: string;
  rotate: string;
}

export interface ThemeCustomizations {
  // Personalizações do usuário
  accentColor?: string;
  borderRadius?: number;
  animationSpeed?: 'slow' | 'normal' | 'fast';
  contrast?: 'low' | 'normal' | 'high';
  reducedMotion?: boolean;
}

export interface ThemeConfig {
  mode: ThemeMode;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  shadows: ThemeShadows;
  animations: ThemeAnimations;
  customizations: ThemeCustomizations;
}

// Temas predefinidos
const lightTheme: ThemeConfig = {
  mode: 'light',
  colors: {
    primary: '#667eea',
    primaryLight: '#8b9df0',
    primaryDark: '#5a6fd8',
    primaryGradient: ['#667eea', '#764ba2'],
    
    secondary: '#f8f9fa',
    secondaryLight: '#ffffff',
    secondaryDark: '#e9ecef',
    secondaryGradient: ['#f8f9fa', '#e9ecef'],
    
    background: '#ffffff',
    backgroundSecondary: '#f8f9fa',
    backgroundTertiary: '#e9ecef',
    backgroundCard: '#ffffff',
    backgroundModal: '#ffffff',
    
    text: '#212529',
    textSecondary: '#6c757d',
    textTertiary: '#adb5bd',
    textInverse: '#ffffff',
    
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8',
    
    border: '#dee2e6',
    borderLight: '#f1f3f4',
    divider: '#e9ecef',
    shadow: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    
    running: '#28a745',
    walking: '#17a2b8',
    cycling: '#ffc107',
    swimming: '#6f42c1',
    
    gold: '#ffd700',
    silver: '#c0c0c0',
    bronze: '#cd7f32',
    xp: '#00d4aa',
    
    heartRate: '#dc3545',
    calories: '#fd7e14',
    distance: '#20c997',
    pace: '#6f42c1',
  },
  typography: {
    fontFamily: {
      regular: 'Inter-Regular',
      medium: 'Inter-Medium',
      semibold: 'Inter-SemiBold',
      bold: 'Inter-Bold',
      monospace: 'JetBrainsMono-Regular',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
    '4xl': 96,
    screenPadding: 20,
    cardPadding: 16,
    buttonPadding: 12,
    inputPadding: 16,
  },
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    button: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
    modal: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    floating: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  animations: {
    fast: 150,
    normal: 300,
    slow: 500,
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    fadeIn: 'fadeIn 0.3s ease-in-out',
    slideUp: 'slideUp 0.3s ease-out',
    scaleIn: 'scaleIn 0.2s ease-out',
    rotate: 'rotate 0.3s linear',
  },
  customizations: {},
};

const darkTheme: ThemeConfig = {
  mode: 'dark',
  colors: {
    primary: '#8b9df0',
    primaryLight: '#a8b5f5',
    primaryDark: '#667eea',
    primaryGradient: ['#8b9df0', '#a8b5f5'],
    
    secondary: '#2d3748',
    secondaryLight: '#4a5568',
    secondaryDark: '#1a202c',
    secondaryGradient: ['#2d3748', '#1a202c'],
    
    background: '#1a202c',
    backgroundSecondary: '#2d3748',
    backgroundTertiary: '#4a5568',
    backgroundCard: '#2d3748',
    backgroundModal: '#2d3748',
    
    text: '#f7fafc',
    textSecondary: '#e2e8f0',
    textTertiary: '#a0aec0',
    textInverse: '#1a202c',
    
    success: '#48bb78',
    warning: '#ed8936',
    error: '#f56565',
    info: '#4299e1',
    
    border: '#4a5568',
    borderLight: '#2d3748',
    divider: '#4a5568',
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    
    running: '#48bb78',
    walking: '#4299e1',
    cycling: '#ed8936',
    swimming: '#9f7aea',
    
    gold: '#f6e05e',
    silver: '#cbd5e0',
    bronze: '#ed8936',
    xp: '#68d391',
    
    heartRate: '#f56565',
    calories: '#ed8936',
    distance: '#68d391',
    pace: '#9f7aea',
  },
  typography: lightTheme.typography,
  spacing: lightTheme.spacing,
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
    button: '0 2px 4px 0 rgba(0, 0, 0, 0.3)',
    modal: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    floating: '0 20px 25px -5px rgba(0, 0, 0, 0.4)',
  },
  animations: lightTheme.animations,
  customizations: {},
};

// Hook principal de tema
export function useTheme() {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');
  const [customTheme, setCustomTheme] = useState<Partial<ThemeConfig>>({});

  // Carrega configuração salva
  useEffect(() => {
    loadThemeConfig();
  }, []);

  // Carrega configuração do AsyncStorage
  const loadThemeConfig = async () => {
    try {
      const savedMode = await AsyncStorage.getItem('themeMode');
      const savedCustomTheme = await AsyncStorage.getItem('customTheme');
      
      if (savedMode) {
        setThemeMode(savedMode as ThemeMode);
      }
      
      if (savedCustomTheme) {
        setCustomTheme(JSON.parse(savedCustomTheme));
      }
    } catch (error) {
      console.error('Erro ao carregar configuração de tema:', error);
    }
  };

  // Salva configuração no AsyncStorage
  const saveThemeConfig = async (mode: ThemeMode, custom?: Partial<ThemeConfig>) => {
    try {
      await AsyncStorage.setItem('themeMode', mode);
      if (custom) {
        await AsyncStorage.setItem('customTheme', JSON.stringify(custom));
      }
    } catch (error) {
      console.error('Erro ao salvar configuração de tema:', error);
    }
  };

  // Determina tema ativo baseado no modo
  const activeTheme = useMemo((): ThemeConfig => {
    let baseTheme: ThemeConfig;
    
    switch (themeMode) {
      case 'light':
        baseTheme = lightTheme;
        break;
      case 'dark':
        baseTheme = darkTheme;
        break;
      case 'auto':
        baseTheme = systemColorScheme === 'dark' ? darkTheme : lightTheme;
        break;
      case 'custom':
        baseTheme = systemColorScheme === 'dark' ? darkTheme : lightTheme;
        break;
      default:
        baseTheme = lightTheme;
    }

    // Aplica customizações
    if (customTheme && Object.keys(customTheme).length > 0) {
      return {
        ...baseTheme,
        ...customTheme,
        colors: {
          ...baseTheme.colors,
          ...customTheme.colors,
        },
        typography: {
          ...baseTheme.typography,
          ...customTheme.typography,
        },
        spacing: {
          ...baseTheme.spacing,
          ...customTheme.spacing,
        },
        shadows: {
          ...baseTheme.shadows,
          ...customTheme.shadows,
        },
        animations: {
          ...baseTheme.animations,
          ...customTheme.animations,
        },
        customizations: {
          ...baseTheme.customizations,
          ...customTheme.customizations,
        },
      };
    }

    return baseTheme;
  }, [themeMode, systemColorScheme, customTheme]);

  // Muda modo do tema
  const setTheme = useCallback(async (mode: ThemeMode) => {
    setThemeMode(mode);
    await saveThemeConfig(mode);
  }, []);

  // Aplica tema customizado
  const applyCustomTheme = useCallback(async (custom: Partial<ThemeConfig>) => {
    setCustomTheme(custom);
    await saveThemeConfig('custom', custom);
  }, []);

  // Reseta para tema padrão
  const resetTheme = useCallback(async () => {
    setCustomTheme({});
    await AsyncStorage.removeItem('customTheme');
  }, []);

  // Verifica se está no modo escuro
  const isDark = useMemo(() => {
    return activeTheme.mode === 'dark' || 
           (activeTheme.mode === 'auto' && systemColorScheme === 'dark');
  }, [activeTheme.mode, systemColorScheme]);

  // Verifica se está no modo claro
  const isLight = useMemo(() => {
    return activeTheme.mode === 'light' || 
           (activeTheme.mode === 'auto' && systemColorScheme === 'light');
  }, [activeTheme.mode, systemColorScheme]);

  // Verifica se está no modo automático
  const isAuto = useMemo(() => {
    return activeTheme.mode === 'auto';
  }, [activeTheme.mode]);

  // Verifica se está no modo customizado
  const isCustom = useMemo(() => {
    return activeTheme.mode === 'custom';
  }, [activeTheme.mode]);

  // Gera CSS custom properties para web
  const cssCustomProperties = useMemo(() => {
    const colors = activeTheme.colors;
    const spacing = activeTheme.spacing;
    const typography = activeTheme.typography;
    
    return {
      '--color-primary': colors.primary,
      '--color-primary-light': colors.primaryLight,
      '--color-primary-dark': colors.primaryDark,
      '--color-background': colors.background,
      '--color-text': colors.text,
      '--color-border': colors.border,
      '--spacing-xs': `${spacing.xs}px`,
      '--spacing-sm': `${spacing.sm}px`,
      '--spacing-md': `${spacing.md}px`,
      '--spacing-lg': `${spacing.lg}px`,
      '--spacing-xl': `${spacing.xl}px`,
      '--font-size-base': `${typography.fontSize.base}px`,
      '--font-family-base': typography.fontFamily.regular,
      '--font-weight-medium': typography.fontWeight.medium,
      '--border-radius': `${activeTheme.customizations.borderRadius || 8}px`,
      '--animation-duration': `${activeTheme.animations.normal}ms`,
    };
  }, [activeTheme]);

  return {
    theme: activeTheme,
    themeMode,
    isDark,
    isLight,
    isAuto,
    isCustom,
    setTheme,
    applyCustomTheme,
    resetTheme,
    cssCustomProperties,
    systemColorScheme,
  };
}

// Hook para mudança automática de tema baseado em condições
export function useAutoTheme() {
  const { theme, setTheme } = useTheme();
  
  // Muda para tema escuro em horário noturno
  const enableNightMode = useCallback(async () => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 22 || hour <= 6) {
      await setTheme('dark');
    }
  }, [setTheme]);

  // Muda para tema claro durante o dia
  const enableDayMode = useCallback(async () => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 7 && hour <= 21) {
      await setTheme('light');
    }
  }, [setTheme]);

  // Muda tema baseado na bateria
  const enableBatteryMode = useCallback(async (batteryLevel: number) => {
    if (batteryLevel < 0.2) {
      await setTheme('dark'); // Tema escuro para economizar bateria
    }
  }, [setTheme]);

  return {
    enableNightMode,
    enableDayMode,
    enableBatteryMode,
  };
}

// Hook para tema sazonal
export function useSeasonalTheme() {
  const { applyCustomTheme } = useTheme();
  
  // Aplica tema de verão
  const applySummerTheme = useCallback(async () => {
    await applyCustomTheme({
      colors: {
        primary: '#00d4aa',
        primaryGradient: ['#00d4aa', '#0099cc'],
        background: '#f0f9ff',
        backgroundSecondary: '#e0f2fe',
      },
    });
  }, [applyCustomTheme]);

  // Aplica tema de inverno
  const applyWinterTheme = useCallback(async () => {
    await applyCustomTheme({
      colors: {
        primary: '#6366f1',
        primaryGradient: ['#6366f1', '#8b5cf6'],
        background: '#f8fafc',
        backgroundSecondary: '#f1f5f9',
      },
    });
  }, [applyCustomTheme]);

  // Aplica tema de outono
  const applyAutumnTheme = useCallback(async () => {
    await applyCustomTheme({
      colors: {
        primary: '#f59e0b',
        primaryGradient: ['#f59e0b', '#d97706'],
        background: '#fef3c7',
        backgroundSecondary: '#fde68a',
      },
    });
  }, [applyCustomTheme]);

  // Aplica tema de primavera
  const applySpringTheme = useCallback(async () => {
    await applyCustomTheme({
      colors: {
        primary: '#10b981',
        primaryGradient: ['#10b981', '#059669'],
        background: '#ecfdf5',
        backgroundSecondary: '#d1fae5',
      },
    });
  }, [applyCustomTheme]);

  return {
    applySummerTheme,
    applyWinterTheme,
    applyAutumnTheme,
    applySpringTheme,
  };
}