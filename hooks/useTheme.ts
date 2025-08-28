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
    primary: '#6C63FF',
    primaryLight: '#8B84FF',
    primaryDark: '#5048D6',
    primaryGradient: ['#6C63FF', '#00B894'],
    
    secondary: '#00B894',
    secondaryLight: '#34D1AE',
    secondaryDark: '#009C7D',
    secondaryGradient: ['#6C63FF', '#00B894'],
    
    background: '#FFFFFF',
    backgroundSecondary: '#F9FAFB',
    backgroundTertiary: '#F3F4F6',
    backgroundCard: '#FFFFFF',
    backgroundModal: '#FFFFFF',
    
    text: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textInverse: '#FFFFFF',
    
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    divider: '#E5E7EB',
    shadow: 'rgba(17, 24, 39, 0.08)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    
    running: '#10B981',
    walking: '#3B82F6',
    cycling: '#F59E0B',
    swimming: '#8B5CF6',
    
    gold: '#FDE68A',
    silver: '#E5E7EB',
    bronze: '#D97706',
    xp: '#A855F7',
    
    heartRate: '#EF4444',
    calories: '#F59E0B',
    distance: '#10B981',
    pace: '#6C63FF',
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
    primary: '#8B84FF',
    primaryLight: '#A8A1FF',
    primaryDark: '#6C63FF',
    primaryGradient: ['#6C63FF', '#00B894'],
    
    secondary: '#00B894',
    secondaryLight: '#34D1AE',
    secondaryDark: '#009C7D',
    secondaryGradient: ['#6C63FF', '#00B894'],
    
    background: '#0B0B0C',
    backgroundSecondary: '#111214',
    backgroundTertiary: '#1B1C1F',
    backgroundCard: '#141519',
    backgroundModal: '#141519',
    
    text: '#F3F4F6',
    textSecondary: '#D1D5DB',
    textTertiary: '#9CA3AF',
    textInverse: '#0B0B0C',
    
    success: '#34D399',
    warning: '#F59E0B',
    error: '#F87171',
    info: '#60A5FA',
    
    border: '#2A2E37',
    borderLight: '#1A1D22',
    divider: '#2A2E37',
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    
    running: '#34D399',
    walking: '#60A5FA',
    cycling: '#F59E0B',
    swimming: '#A78BFA',
    
    gold: '#FBBF24',
    silver: '#9CA3AF',
    bronze: '#D97706',
    xp: '#C084FC',
    
    heartRate: '#F87171',
    calories: '#F59E0B',
    distance: '#34D399',
    pace: '#8B84FF',
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