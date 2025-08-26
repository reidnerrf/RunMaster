export const Colors = {
  light: {
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#262626',
    primary: '#FF7E47',
    secondary: '#FFA97C',

    gold: '#FFD700',
    muted: '#8E8E93',
    border: '#E9E9EA',
    danger: '#FF3B30',
    success: '#34C759',
  },
  dark: {
    background: '#262626',
    card: '#2F2F2F',
    text: '#FFFFFF',

    primary: '#FF7E47',
    secondary: '#FFA97C',

    gold: '#FFD700',
    muted: '#A1A1AA',
    border: '#3A3A3C',
    danger: '#FF453A',
    success: '#30D158',
  },
};

export const Spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const Shadows = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  heavy: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
};

export const Typography = {
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
  },
};

export type ThemeMode = 'light' | 'dark';

export const getTheme = (mode: ThemeMode = 'light') => {
  const palette = mode === 'dark' ? Colors.dark : Colors.light;
  return {
    mode,
    colors: palette,
    spacing: Spacing,
    radius: Radius,
    shadows: Shadows,
    typography: Typography,
  };
};

export type Theme = ReturnType<typeof getTheme>;
