import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

// Interfaces
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
  mode: 'light' | 'dark' | 'auto' | 'custom';
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  shadows: ThemeShadows;
  animations: ThemeAnimations;
  customizations: ThemeCustomizations;
}

export interface ThemeSchedule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  rules: Array<{
    type: 'time' | 'battery' | 'location' | 'activity' | 'weather';
    condition: string;
    value: any;
  }>;
  lightTheme: Partial<ThemeConfig>;
  darkTheme: Partial<ThemeConfig>;
  createdAt: string;
  updatedAt: string;
}

interface ThemeState {
  currentTheme: ThemeConfig;
  availableThemes: ThemeConfig[];
  customThemes: ThemeConfig[];
  schedules: ThemeSchedule[];
  isLoading: boolean;
  error: string | null;
  lastChange: string | null;
  changeHistory: Array<{
    from: string;
    to: string;
    reason: string;
    timestamp: string;
  }>;
  systemPreference: 'light' | 'dark';
  autoChangeEnabled: boolean;
  seasonalThemes: boolean;
  batteryOptimization: boolean;
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

// Estado inicial
const initialState: ThemeState = {
  currentTheme: lightTheme,
  availableThemes: [lightTheme, darkTheme],
  customThemes: [],
  schedules: [],
  isLoading: false,
  error: null,
  lastChange: null,
  changeHistory: [],
  systemPreference: Appearance.getColorScheme() || 'light',
  autoChangeEnabled: true,
  seasonalThemes: false,
  batteryOptimization: false,
};

// Thunks assíncronos
export const loadThemeConfig = createAsyncThunk(
  'theme/loadConfig',
  async (_, { rejectWithValue }) => {
    try {
      // Carrega configurações salvas
      const savedTheme = await AsyncStorage.getItem('themeConfig');
      const savedCustomizations = await AsyncStorage.getItem('themeCustomizations');
      const savedSchedules = await AsyncStorage.getItem('themeSchedules');
      
      let config = null;
      let customizations = null;
      let schedules = [];
      
      if (savedTheme) {
        config = JSON.parse(savedTheme);
      }
      
      if (savedCustomizations) {
        customizations = JSON.parse(savedCustomizations);
      }
      
      if (savedSchedules) {
        schedules = JSON.parse(savedSchedules);
      }
      
      return { config, customizations, schedules };
    } catch (error) {
      return rejectWithValue('Erro ao carregar configurações de tema');
    }
  }
);

export const changeTheme = createAsyncThunk(
  'theme/change',
  async (themeMode: 'light' | 'dark' | 'auto' | 'custom', { getState, rejectWithValue }) => {
    try {
      const state = getState() as { theme: ThemeState };
      
      let newTheme: ThemeConfig;
      let reason = 'Mudança manual';
      
      switch (themeMode) {
        case 'light':
          newTheme = lightTheme;
          break;
        case 'dark':
          newTheme = darkTheme;
          break;
        case 'auto':
          newTheme = state.systemPreference === 'dark' ? darkTheme : lightTheme;
          reason = 'Preferência do sistema';
          break;
        case 'custom':
          // Aplica tema customizado se existir
          newTheme = state.customThemes[0] || lightTheme;
          reason = 'Tema customizado';
          break;
        default:
          newTheme = lightTheme;
      }
      
      // Salva configuração
      await AsyncStorage.setItem('themeConfig', JSON.stringify({
        mode: themeMode,
        lastChange: new Date().toISOString(),
      }));
      
      return { newTheme, reason, themeMode };
    } catch (error) {
      return rejectWithValue('Erro ao mudar tema');
    }
  }
);

export const applyCustomTheme = createAsyncThunk(
  'theme/applyCustom',
  async (customTheme: Partial<ThemeConfig>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { theme: ThemeState };
      const baseTheme = state.currentTheme;
      
      const mergedTheme: ThemeConfig = {
        ...baseTheme,
        ...customTheme,
        mode: 'custom',
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
      
      // Salva tema customizado
      await AsyncStorage.setItem('themeCustomizations', JSON.stringify(mergedTheme));
      
      return mergedTheme;
    } catch (error) {
      return rejectWithValue('Erro ao aplicar tema customizado');
    }
  }
);

export const createThemeSchedule = createAsyncThunk(
  'theme/createSchedule',
  async (schedule: Omit<ThemeSchedule, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const newSchedule: ThemeSchedule = {
        ...schedule,
        id: `schedule_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Salva agendamento
      const savedSchedules = await AsyncStorage.getItem('themeSchedules');
      const schedules = savedSchedules ? JSON.parse(savedSchedules) : [];
      schedules.push(newSchedule);
      await AsyncStorage.setItem('themeSchedules', JSON.stringify(schedules));
      
      return newSchedule;
    } catch (error) {
      return rejectWithValue('Erro ao criar agendamento de tema');
    }
  }
);

export const checkThemeConditions = createAsyncThunk(
  'theme/checkConditions',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { theme: ThemeState };
      
      if (!state.autoChangeEnabled) {
        return { shouldChange: false, reason: 'Mudança automática desabilitada' };
      }
      
      const now = new Date();
      const hour = now.getHours();
      
      // Verifica horário noturno
      if (hour >= 22 || hour <= 6) {
        if (state.currentTheme.mode !== 'dark') {
          return { shouldChange: true, reason: 'Horário noturno', newTheme: 'dark' };
        }
      } else if (hour >= 7 && hour <= 21) {
        if (state.currentTheme.mode !== 'light') {
          return { shouldChange: true, reason: 'Horário diurno', newTheme: 'light' };
        }
      }
      
      // Verifica agendamentos
      for (const schedule of state.schedules) {
        if (schedule.isActive && checkScheduleConditions(schedule)) {
          const newTheme = state.systemPreference === 'dark' ? schedule.darkTheme : schedule.lightTheme;
          return { shouldChange: true, reason: `Agendamento: ${schedule.name}`, newTheme };
        }
      }
      
      return { shouldChange: false, reason: 'Nenhuma condição atendida' };
    } catch (error) {
      return rejectWithValue('Erro ao verificar condições de tema');
    }
  }
);

// Função para verificar condições de agendamento
function checkScheduleConditions(schedule: ThemeSchedule): boolean {
  // Implementar lógica de verificação de condições
  // Por exemplo: horário, bateria, localização, etc.
  return false;
}

// Slice
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // Ações síncronas
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    updateSystemPreference: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.systemPreference = action.payload;
      
      // Se estiver no modo automático, aplica mudança
      if (state.currentTheme.mode === 'auto') {
        const newTheme = action.payload === 'dark' ? darkTheme : lightTheme;
        state.currentTheme = newTheme;
        state.lastChange = new Date().toISOString();
        
        // Adiciona ao histórico
        state.changeHistory.push({
          from: state.currentTheme.mode,
          to: newTheme.mode,
          reason: 'Mudança de preferência do sistema',
          timestamp: new Date().toISOString(),
        });
      }
    },
    
    toggleAutoChange: (state) => {
      state.autoChangeEnabled = !state.autoChangeEnabled;
    },
    
    toggleSeasonalThemes: (state) => {
      state.seasonalThemes = !state.seasonalThemes;
    },
    
    toggleBatteryOptimization: (state) => {
      state.batteryOptimization = !state.batteryOptimization;
    },
    
    // Ações para customizações
    updateCustomization: (state, action: PayloadAction<{ field: string; value: any }>) => {
      const { field, value } = action.payload;
      const fieldPath = field.split('.');
      let current: any = state.currentTheme;
      
      for (let i = 0; i < fieldPath.length - 1; i++) {
        current = current[fieldPath[i]];
      }
      
      current[fieldPath[fieldPath.length - 1]] = value;
      state.currentTheme.updatedAt = new Date().toISOString();
    },
    
    // Ações para agendamentos
    updateSchedule: (state, action: PayloadAction<{ id: string; updates: Partial<ThemeSchedule> }>) => {
      const index = state.schedules.findIndex(schedule => schedule.id === action.payload.id);
      if (index >= 0) {
        state.schedules[index] = {
          ...state.schedules[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    
    removeSchedule: (state, action: PayloadAction<string>) => {
      state.schedules = state.schedules.filter(schedule => schedule.id !== action.payload);
    },
    
    // Ações para histórico
    clearChangeHistory: (state) => {
      state.changeHistory = [];
    },
    
    // Ações para temas sazonais
    applySeasonalTheme: (state, action: PayloadAction<'summer' | 'winter' | 'spring' | 'autumn'>) => {
      const seasonalColors = {
        summer: {
          primary: '#00d4aa',
          primaryGradient: ['#00d4aa', '#0099cc'],
          background: '#f0f9ff',
          backgroundSecondary: '#e0f2fe',
        },
        winter: {
          primary: '#6366f1',
          primaryGradient: ['#6366f1', '#8b5cf6'],
          background: '#f8fafc',
          backgroundSecondary: '#f1f5f9',
        },
        spring: {
          primary: '#10b981',
          primaryGradient: ['#10b981', '#059669'],
          background: '#ecfdf5',
          backgroundSecondary: '#d1fae5',
        },
        autumn: {
          primary: '#f59e0b',
          primaryGradient: ['#f59e0b', '#d97706'],
          background: '#fef3c7',
          backgroundSecondary: '#fde68a',
        },
      };
      
      const colors = seasonalColors[action.payload];
      state.currentTheme.colors = {
        ...state.currentTheme.colors,
        ...colors,
      };
      
      state.lastChange = new Date().toISOString();
      state.changeHistory.push({
        from: state.currentTheme.mode,
        to: `seasonal_${action.payload}`,
        reason: `Tema sazonal: ${action.payload}`,
        timestamp: new Date().toISOString(),
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // loadThemeConfig
      .addCase(loadThemeConfig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadThemeConfig.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.config) {
          state.currentTheme = action.payload.config;
        }
        if (action.payload.customizations) {
          state.customThemes = [action.payload.customizations];
        }
        if (action.payload.schedules) {
          state.schedules = action.payload.schedules;
        }
        state.error = null;
      })
      .addCase(loadThemeConfig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // changeTheme
      .addCase(changeTheme.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changeTheme.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTheme = action.payload.newTheme;
        state.lastChange = new Date().toISOString();
        state.changeHistory.push({
          from: state.currentTheme.mode,
          to: action.payload.themeMode,
          reason: action.payload.reason,
          timestamp: new Date().toISOString(),
        });
        state.error = null;
      })
      .addCase(changeTheme.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // applyCustomTheme
      .addCase(applyCustomTheme.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(applyCustomTheme.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTheme = action.payload;
        state.customThemes = [action.payload];
        state.lastChange = new Date().toISOString();
        state.error = null;
      })
      .addCase(applyCustomTheme.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // createThemeSchedule
      .addCase(createThemeSchedule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createThemeSchedule.fulfilled, (state, action) => {
        state.isLoading = false;
        state.schedules.push(action.payload);
        state.error = null;
      })
      .addCase(createThemeSchedule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // checkThemeConditions
      .addCase(checkThemeConditions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkThemeConditions.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.shouldChange) {
          state.lastChange = new Date().toISOString();
          state.changeHistory.push({
            from: state.currentTheme.mode,
            to: action.payload.newTheme || 'auto',
            reason: action.payload.reason,
            timestamp: new Date().toISOString(),
          });
        }
        state.error = null;
      })
      .addCase(checkThemeConditions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Exporta actions e reducer
export const {
  setLoading,
  setError,
  updateSystemPreference,
  toggleAutoChange,
  toggleSeasonalThemes,
  toggleBatteryOptimization,
  updateCustomization,
  updateSchedule,
  removeSchedule,
  clearChangeHistory,
  applySeasonalTheme,
} = themeSlice.actions;

export default themeSlice.reducer;