import { Platform, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSeason, getTimeOfDay, isNightTime } from './dateUtils';

// Tipos de tema
export type ThemeMode = 'light' | 'dark' | 'auto' | 'custom' | 'seasonal' | 'highContrast';
export type ColorScheme = 'light' | 'dark';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
export type PersonalityType = 'energetic' | 'calm' | 'creative' | 'professional' | 'minimalist' | 'vibrant';

// Interface para configurações de tema
export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  mode: ThemeMode;
  isDefault?: boolean;
  isCustom?: boolean;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  shadows: ThemeShadows;
  animations: ThemeAnimations;
  accessibility: ThemeAccessibility;
  metadata: ThemeMetadata;
}

// Interface para cores do tema
export interface ThemeColors {
  // Cores principais
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Cores de fundo
  background: string;
  surface: string;
  card: string;
  modal: string;
  
  // Cores de texto
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  
  // Cores de borda
  border: string;
  borderLight: string;
  borderDark: string;
  
  // Cores de estado
  disabled: string;
  overlay: string;
  shadow: string;
  
  // Cores específicas
  link: string;
  placeholder: string;
  selection: string;
  highlight: string;
  
  // Cores de gradiente
  gradientStart: string;
  gradientEnd: string;
  gradientCenter: string;
}

// Interface para tipografia
export interface ThemeTypography {
  fontFamily: {
    regular: string;
    medium: string;
    bold: string;
    light: string;
    italic: string;
    mono: string;
  };
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
  fontWeight: {
    light: string;
    normal: string;
    medium: string;
    semibold: string;
    bold: string;
    extrabold: string;
  };
}

// Interface para espaçamento
export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
}

// Interface para sombras
export interface ThemeShadows {
  small: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  medium: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  large: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
}

// Interface para animações
export interface ThemeAnimations {
  duration: {
    fast: number;
    normal: number;
    slow: number;
    verySlow: number;
  };
  easing: {
    easeIn: string;
    easeOut: string;
    easeInOut: string;
    bounce: string;
    elastic: string;
  };
  scale: {
    pressed: number;
    hover: number;
    focus: number;
  };
}

// Interface para acessibilidade
export interface ThemeAccessibility {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  boldText: boolean;
  colorBlindFriendly: boolean;
  minimumTouchTarget: number;
}

// Interface para metadados
export interface ThemeMetadata {
  version: string;
  author: string;
  tags: string[];
  category: string;
  rating: number;
  downloads: number;
  lastUpdated: Date;
  compatibility: string[];
}

// Interface para configurações do usuário
export interface UserThemePreferences {
  mode: ThemeMode;
  personalityType?: PersonalityType;
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  boldText: boolean;
  colorBlindFriendly: boolean;
  autoNightMode: boolean;
  nightModeStart: string; // HH:mm
  nightModeEnd: string; // HH:mm
  seasonalThemes: boolean;
  customColors?: Partial<ThemeColors>;
}

// Interface para tema sazonal
export interface SeasonalTheme {
  season: Season;
  colors: Partial<ThemeColors>;
  description: string;
  icon: string;
}

// Configurações padrão de temas
const DEFAULT_THEMES: Record<string, ThemeConfig> = {
  light: {
    id: 'light',
    name: 'Claro',
    description: 'Tema claro padrão',
    mode: 'light',
    isDefault: true,
    colors: {
      primary: '#007AFF',
      secondary: '#5856D6',
      accent: '#FF9500',
      success: '#34C759',
      warning: '#FF9500',
      error: '#FF3B30',
      info: '#5AC8FA',
      background: '#FFFFFF',
      surface: '#F2F2F7',
      card: '#FFFFFF',
      modal: '#FFFFFF',
      text: '#000000',
      textSecondary: '#8E8E93',
      textTertiary: '#C7C7CC',
      textInverse: '#FFFFFF',
      border: '#C6C6C8',
      borderLight: '#E5E5EA',
      borderDark: '#8E8E93',
      disabled: '#C7C7CC',
      overlay: 'rgba(0,0,0,0.5)',
      shadow: 'rgba(0,0,0,0.1)',
      link: '#007AFF',
      placeholder: '#C7C7CC',
      selection: '#007AFF',
      highlight: '#FFE066',
      gradientStart: '#007AFF',
      gradientEnd: '#5856D6',
      gradientCenter: '#5AC8FA',
    },
    typography: {
      fontFamily: {
        regular: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
        medium: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
        bold: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
        light: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
        italic: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
        mono: Platform.OS === 'ios' ? 'SF Mono' : 'Roboto Mono',
      },
      fontSize: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        xxxl: 32,
      },
      lineHeight: {
        tight: 1.2,
        normal: 1.4,
        relaxed: 1.6,
        loose: 1.8,
      },
      fontWeight: {
        light: '300',
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
      xxl: 48,
      xxxl: 64,
    },
    shadows: {
      small: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      },
      medium: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
      },
      large: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
      },
    },
    animations: {
      duration: {
        fast: 200,
        normal: 300,
        slow: 500,
        verySlow: 800,
      },
      easing: {
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      scale: {
        pressed: 0.95,
        hover: 1.05,
        focus: 1.02,
      },
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      largeText: false,
      boldText: false,
      colorBlindFriendly: false,
      minimumTouchTarget: 44,
    },
    metadata: {
      version: '1.0.0',
      author: 'Sistema',
      tags: ['claro', 'padrão', 'acessível'],
      category: 'básico',
      rating: 5,
      downloads: 1000,
      lastUpdated: new Date(),
      compatibility: ['iOS', 'Android'],
    },
  },
  
  dark: {
    id: 'dark',
    name: 'Escuro',
    description: 'Tema escuro padrão',
    mode: 'dark',
    colors: {
      primary: '#0A84FF',
      secondary: '#5E5CE6',
      accent: '#FF9F0A',
      success: '#30D158',
      warning: '#FF9F0A',
      error: '#FF453A',
      info: '#64D2FF',
      background: '#000000',
      surface: '#1C1C1E',
      card: '#2C2C2E',
      modal: '#2C2C2E',
      text: '#FFFFFF',
      textSecondary: '#8E8E93',
      textTertiary: '#48484A',
      textInverse: '#000000',
      border: '#38383A',
      borderLight: '#48484A',
      borderDark: '#1C1C1E',
      disabled: '#48484A',
      overlay: 'rgba(255,255,255,0.1)',
      shadow: 'rgba(0,0,0,0.3)',
      link: '#0A84FF',
      placeholder: '#48484A',
      selection: '#0A84FF',
      highlight: '#FFE066',
      gradientStart: '#0A84FF',
      gradientEnd: '#5E5CE6',
      gradientCenter: '#64D2FF',
    },
    typography: DEFAULT_THEMES.light.typography,
    spacing: DEFAULT_THEMES.light.spacing,
    shadows: {
      small: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
      },
      medium: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 4,
      },
      large: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 8,
      },
    },
    animations: DEFAULT_THEMES.light.animations,
    accessibility: {
      ...DEFAULT_THEMES.light.accessibility,
      highContrast: false,
    },
    metadata: {
      ...DEFAULT_THEMES.light.metadata,
      name: 'Escuro',
      description: 'Tema escuro padrão',
      tags: ['escuro', 'padrão', 'acessível'],
    },
  },
  
  highContrast: {
    id: 'highContrast',
    name: 'Alto Contraste',
    description: 'Tema de alto contraste para acessibilidade',
    mode: 'highContrast',
    colors: {
      primary: '#FFFFFF',
      secondary: '#FFFF00',
      accent: '#00FFFF',
      success: '#00FF00',
      warning: '#FF8000',
      error: '#FF0000',
      info: '#0080FF',
      background: '#000000',
      surface: '#000000',
      card: '#000000',
      modal: '#000000',
      text: '#FFFFFF',
      textSecondary: '#FFFF00',
      textTertiary: '#00FFFF',
      textInverse: '#000000',
      border: '#FFFFFF',
      borderLight: '#FFFF00',
      borderDark: '#00FFFF',
      disabled: '#808080',
      overlay: 'rgba(255,255,255,0.2)',
      shadow: 'rgba(255,255,255,0.3)',
      link: '#00FFFF',
      placeholder: '#808080',
      selection: '#FFFF00',
      highlight: '#FF8000',
      gradientStart: '#FFFFFF',
      gradientEnd: '#FFFF00',
      gradientCenter: '#00FFFF',
    },
    typography: {
      ...DEFAULT_THEMES.light.typography,
      fontSize: {
        xs: 14,
        sm: 16,
        md: 18,
        lg: 20,
        xl: 22,
        xxl: 26,
        xxxl: 36,
      },
      fontWeight: {
        ...DEFAULT_THEMES.light.typography.fontWeight,
        normal: '600',
        medium: '700',
        semibold: '800',
        bold: '900',
      },
    },
    spacing: DEFAULT_THEMES.light.spacing,
    shadows: DEFAULT_THEMES.light.shadows,
    animations: {
      ...DEFAULT_THEMES.light.animations,
      duration: {
        fast: 100,
        normal: 200,
        slow: 300,
        verySlow: 500,
      },
    },
    accessibility: {
      highContrast: true,
      reducedMotion: true,
      largeText: true,
      boldText: true,
      colorBlindFriendly: true,
      minimumTouchTarget: 48,
    },
    metadata: {
      ...DEFAULT_THEMES.light.metadata,
      name: 'Alto Contraste',
      description: 'Tema de alto contraste para acessibilidade',
      tags: ['acessibilidade', 'alto-contraste', 'deficiência-visual'],
      category: 'acessibilidade',
    },
  },
};

// Temas sazonais
const SEASONAL_THEMES: Record<Season, SeasonalTheme> = {
  spring: {
    season: 'spring',
    colors: {
      primary: '#4CAF50',
      secondary: '#8BC34A',
      accent: '#FF9800',
      background: '#F1F8E9',
      surface: '#DCEDC8',
      card: '#C5E1A5',
      text: '#2E7D32',
      border: '#81C784',
    },
    description: 'Cores vibrantes da primavera',
    icon: '🌸',
  },
  
  summer: {
    season: 'summer',
    colors: {
      primary: '#2196F3',
      secondary: '#03A9F4',
      accent: '#FF5722',
      background: '#E3F2FD',
      surface: '#BBDEFB',
      card: '#90CAF9',
      text: '#1565C0',
      border: '#64B5F6',
    },
    description: 'Cores refrescantes do verão',
    icon: '☀️',
  },
  
  autumn: {
    season: 'autumn',
    colors: {
      primary: '#FF9800',
      secondary: '#FF5722',
      accent: '#795548',
      background: '#FFF3E0',
      surface: '#FFE0B2',
      card: '#FFCC80',
      text: '#E65100',
      border: '#FFB74D',
    },
    description: 'Cores quentes do outono',
    icon: '🍂',
  },
  
  winter: {
    season: 'winter',
    colors: {
      primary: '#9C27B0',
      secondary: '#673AB7',
      accent: '#3F51B5',
      background: '#F3E5F5',
      surface: '#E1BEE7',
      card: '#CE93D8',
      text: '#6A1B9A',
      border: '#BA68C8',
    },
    description: 'Cores frias do inverno',
    icon: '❄️',
  },
};

// Temas baseados na personalidade
const PERSONALITY_THEMES: Record<PersonalityType, Partial<ThemeColors>> = {
  energetic: {
    primary: '#FF5722',
    secondary: '#FF9800',
    accent: '#FFC107',
    background: '#FFF8E1',
    surface: '#FFECB3',
    card: '#FFE082',
  },
  
  calm: {
    primary: '#4CAF50',
    secondary: '#8BC34A',
    accent: '#CDDC39',
    background: '#F1F8E9',
    surface: '#DCEDC8',
    card: '#C5E1A5',
  },
  
  creative: {
    primary: '#9C27B0',
    secondary: '#E91E63',
    accent: '#FF5722',
    background: '#F3E5F5',
    surface: '#E1BEE7',
    card: '#CE93D8',
  },
  
  professional: {
    primary: '#2196F3',
    secondary: '#607D8B',
    accent: '#FF9800',
    background: '#F5F5F5',
    surface: '#EEEEEE',
    card: '#E0E0E0',
  },
  
  minimalist: {
    primary: '#424242',
    secondary: '#757575',
    accent: '#9E9E9E',
    background: '#FFFFFF',
    surface: '#FAFAFA',
    card: '#F5F5F5',
  },
  
  vibrant: {
    primary: '#FF1744',
    secondary: '#00E676',
    accent: '#FFD600',
    background: '#FCE4EC',
    surface: '#F8BBD9',
    card: '#F48FB1',
  },
};

// Classe principal do serviço de temas
class ThemeService {
  private currentTheme: ThemeConfig = DEFAULT_THEMES.light;
  private userPreferences: UserThemePreferences;
  private listeners: Set<(theme: ThemeConfig) => void> = new Set();
  private isInitialized: boolean = false;
  private systemColorScheme: ColorScheme = 'light';
  private autoThemeInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.userPreferences = this.getDefaultPreferences();
    this.initialize();
  }

  // Inicializar serviço
  private async initialize(): Promise<void> {
    try {
      console.log('🎨 Inicializando serviço de temas...');
      
      // Carregar preferências do usuário
      await this.loadUserPreferences();
      
      // Configurar listener para mudanças do sistema
      this.setupSystemListener();
      
      // Aplicar tema inicial
      await this.applyTheme();
      
      // Configurar tema automático se necessário
      this.setupAutoTheme();
      
      this.isInitialized = true;
      console.log('✅ Serviço de temas inicializado');
      
    } catch (error) {
      console.error('❌ Erro na inicialização do serviço de temas:', error);
    }
  }

  // Obter preferências padrão
  private getDefaultPreferences(): UserThemePreferences {
    return {
      mode: 'auto',
      highContrast: false,
      reducedMotion: false,
      largeText: false,
      boldText: false,
      colorBlindFriendly: false,
      autoNightMode: true,
      nightModeStart: '20:00',
      nightModeEnd: '06:00',
      seasonalThemes: true,
    };
  }

  // Carregar preferências do usuário
  private async loadUserPreferences(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('userThemePreferences');
      if (stored) {
        this.userPreferences = { ...this.userPreferences, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Erro ao carregar preferências de tema:', error);
    }
  }

  // Salvar preferências do usuário
  private async saveUserPreferences(): Promise<void> {
    try {
      await AsyncStorage.setItem('userThemePreferences', JSON.stringify(this.userPreferences));
    } catch (error) {
      console.error('Erro ao salvar preferências de tema:', error);
    }
  }

  // Configurar listener para mudanças do sistema
  private setupSystemListener(): void {
    try {
      // Obter esquema de cor atual
      this.systemColorScheme = Appearance.getColorScheme() || 'light';
      
      // Listener para mudanças
      Appearance.addChangeListener(({ colorScheme }) => {
        this.systemColorScheme = colorScheme || 'light';
        if (this.userPreferences.mode === 'auto') {
          this.applyTheme();
        }
      });
      
      console.log('📱 Listener do sistema configurado');
      
    } catch (error) {
      console.error('Erro ao configurar listener do sistema:', error);
    }
  }

  // Configurar tema automático
  private setupAutoTheme(): void {
    try {
      if (this.autoThemeInterval) {
        clearInterval(this.autoThemeInterval);
      }
      
      // Verificar a cada minuto
      this.autoThemeInterval = setInterval(() => {
        if (this.userPreferences.autoNightMode && this.userPreferences.mode === 'auto') {
          this.checkNightMode();
        }
        
        if (this.userPreferences.seasonalThemes && this.userPreferences.mode === 'seasonal') {
          this.updateSeasonalTheme();
        }
      }, 60000);
      
      console.log('⏰ Tema automático configurado');
      
    } catch (error) {
      console.error('Erro ao configurar tema automático:', error);
    }
  }

  // Verificar modo noturno
  private checkNightMode(): void {
    try {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const isNight = isNightTime(
        currentTime,
        this.userPreferences.nightModeStart,
        this.userPreferences.nightModeEnd
      );
      
      if (isNight && this.currentTheme.mode !== 'dark') {
        this.applyTheme();
      } else if (!isNight && this.currentTheme.mode === 'dark') {
        this.applyTheme();
      }
      
    } catch (error) {
      console.error('Erro ao verificar modo noturno:', error);
    }
  }

  // Atualizar tema sazonal
  private updateSeasonalTheme(): void {
    try {
      const currentSeason = getSeason();
      const seasonalTheme = SEASONAL_THEMES[currentSeason];
      
      if (seasonalTheme) {
        this.currentTheme = this.createSeasonalTheme(currentSeason);
        this.notifyListeners();
      }
      
    } catch (error) {
      console.error('Erro ao atualizar tema sazonal:', error);
    }
  }

  // Aplicar tema
  private async applyTheme(): Promise<void> {
    try {
      let newTheme: ThemeConfig;
      
      switch (this.userPreferences.mode) {
        case 'light':
          newTheme = DEFAULT_THEMES.light;
          break;
          
        case 'dark':
          newTheme = DEFAULT_THEMES.dark;
          break;
          
        case 'auto':
          newTheme = this.systemColorScheme === 'dark' ? DEFAULT_THEMES.dark : DEFAULT_THEMES.light;
          break;
          
        case 'highContrast':
          newTheme = DEFAULT_THEMES.highContrast;
          break;
          
        case 'seasonal':
          const currentSeason = getSeason();
          newTheme = this.createSeasonalTheme(currentSeason);
          break;
          
        case 'custom':
          newTheme = this.createCustomTheme();
          break;
          
        default:
          newTheme = DEFAULT_THEMES.light;
      }
      
      // Aplicar configurações de acessibilidade
      newTheme = this.applyAccessibilitySettings(newTheme);
      
      // Aplicar personalização baseada na personalidade
      if (this.userPreferences.personalityType) {
        newTheme = this.applyPersonalityTheme(newTheme, this.userPreferences.personalityType);
      }
      
      this.currentTheme = newTheme;
      this.notifyListeners();
      
      console.log(`🎨 Tema aplicado: ${newTheme.name}`);
      
    } catch (error) {
      console.error('Erro ao aplicar tema:', error);
    }
  }

  // Criar tema sazonal
  private createSeasonalTheme(season: Season): ThemeConfig {
    try {
      const baseTheme = DEFAULT_THEMES.light;
      const seasonalColors = SEASONAL_THEMES[season];
      
      return {
        ...baseTheme,
        id: `seasonal-${season}`,
        name: `Tema ${season.charAt(0).toUpperCase() + season.slice(1)}`,
        description: seasonalColors.description,
        mode: 'seasonal',
        colors: {
          ...baseTheme.colors,
          ...seasonalColors.colors,
        },
        metadata: {
          ...baseTheme.metadata,
          tags: [...baseTheme.metadata.tags, 'sazonal', season],
        },
      };
      
    } catch (error) {
      console.error('Erro ao criar tema sazonal:', error);
      return DEFAULT_THEMES.light;
    }
  }

  // Criar tema personalizado
  private createCustomTheme(): ThemeConfig {
    try {
      const baseTheme = DEFAULT_THEMES.light;
      const customColors = this.userPreferences.customColors || {};
      
      return {
        ...baseTheme,
        id: 'custom',
        name: 'Tema Personalizado',
        description: 'Tema criado pelo usuário',
        mode: 'custom',
        isCustom: true,
        colors: {
          ...baseTheme.colors,
          ...customColors,
        },
        metadata: {
          ...baseTheme.metadata,
          name: 'Tema Personalizado',
          description: 'Tema criado pelo usuário',
          tags: [...baseTheme.metadata.tags, 'personalizado'],
        },
      };
      
    } catch (error) {
      console.error('Erro ao criar tema personalizado:', error);
      return DEFAULT_THEMES.light;
    }
  }

  // Aplicar configurações de acessibilidade
  private applyAccessibilitySettings(theme: ThemeConfig): ThemeConfig {
    try {
      let modifiedTheme = { ...theme };
      
      // Alto contraste
      if (this.userPreferences.highContrast) {
        modifiedTheme = this.applyHighContrast(modifiedTheme);
      }
      
      // Texto grande
      if (this.userPreferences.largeText) {
        modifiedTheme = this.applyLargeText(modifiedTheme);
      }
      
      // Texto em negrito
      if (this.userPreferences.boldText) {
        modifiedTheme = this.applyBoldText(modifiedTheme);
      }
      
      // Amigável para daltônicos
      if (this.userPreferences.colorBlindFriendly) {
        modifiedTheme = this.applyColorBlindFriendly(modifiedTheme);
      }
      
      return modifiedTheme;
      
    } catch (error) {
      console.error('Erro ao aplicar configurações de acessibilidade:', error);
      return theme;
    }
  }

  // Aplicar alto contraste
  private applyHighContrast(theme: ThemeConfig): ThemeConfig {
    try {
      const highContrastTheme = DEFAULT_THEMES.highContrast;
      
      return {
        ...theme,
        colors: {
          ...theme.colors,
          ...highContrastTheme.colors,
        },
        accessibility: {
          ...theme.accessibility,
          ...highContrastTheme.accessibility,
        },
      };
      
    } catch (error) {
      console.error('Erro ao aplicar alto contraste:', error);
      return theme;
    }
  }

  // Aplicar texto grande
  private applyLargeText(theme: ThemeConfig): ThemeConfig {
    try {
      return {
        ...theme,
        typography: {
          ...theme.typography,
          fontSize: {
            xs: theme.typography.fontSize.xs + 2,
            sm: theme.typography.fontSize.sm + 2,
            md: theme.typography.fontSize.md + 2,
            lg: theme.typography.fontSize.lg + 2,
            xl: theme.typography.fontSize.xl + 2,
            xxl: theme.typography.fontSize.xxl + 2,
            xxxl: theme.typography.fontSize.xxxl + 2,
          },
        },
      };
      
    } catch (error) {
      console.error('Erro ao aplicar texto grande:', error);
      return theme;
    }
  }

  // Aplicar texto em negrito
  private applyBoldText(theme: ThemeConfig): ThemeConfig {
    try {
      return {
        ...theme,
        typography: {
          ...theme.typography,
          fontWeight: {
            ...theme.typography.fontWeight,
            normal: '600',
            medium: '700',
            semibold: '800',
            bold: '900',
          },
        },
      };
      
    } catch (error) {
      console.error('Erro ao aplicar texto em negrito:', error);
      return theme;
    }
  }

  // Aplicar amigável para daltônicos
  private applyColorBlindFriendly(theme: ThemeConfig): ThemeConfig {
    try {
      // Usar cores que são distinguíveis para daltônicos
      const colorBlindColors = {
        success: '#00FF00', // Verde puro
        warning: '#FF8000', // Laranja
        error: '#FF0000',   // Vermelho puro
        info: '#0080FF',    // Azul puro
      };
      
      return {
        ...theme,
        colors: {
          ...theme.colors,
          ...colorBlindColors,
        },
      };
      
    } catch (error) {
      console.error('Erro ao aplicar amigável para daltônicos:', error);
      return theme;
    }
  }

  // Aplicar tema baseado na personalidade
  private applyPersonalityTheme(theme: ThemeConfig, personalityType: PersonalityType): ThemeConfig {
    try {
      const personalityColors = PERSONALITY_THEMES[personalityType];
      
      if (personalityColors) {
        return {
          ...theme,
          colors: {
            ...theme.colors,
            ...personalityColors,
          },
          metadata: {
            ...theme.metadata,
            tags: [...theme.metadata.tags, 'personalidade', personalityType],
          },
        };
      }
      
      return theme;
      
    } catch (error) {
      console.error('Erro ao aplicar tema de personalidade:', error);
      return theme;
    }
  }

  // Notificar listeners
  private notifyListeners(): void {
    try {
      this.listeners.forEach(listener => {
        listener(this.currentTheme);
      });
    } catch (error) {
      console.error('Erro ao notificar listeners:', error);
    }
  }

  // Obter tema atual
  public getCurrentTheme(): ThemeConfig {
    return this.currentTheme;
  }

  // Obter preferências do usuário
  public getUserPreferences(): UserThemePreferences {
    return { ...this.userPreferences };
  }

  // Atualizar preferências do usuário
  public async updateUserPreferences(preferences: Partial<UserThemePreferences>): Promise<void> {
    try {
      this.userPreferences = { ...this.userPreferences, ...preferences };
      await this.saveUserPreferences();
      await this.applyTheme();
      
      console.log('✅ Preferências de tema atualizadas');
      
    } catch (error) {
      console.error('Erro ao atualizar preferências de tema:', error);
    }
  }

  // Definir modo de tema
  public async setThemeMode(mode: ThemeMode): Promise<void> {
    try {
      await this.updateUserPreferences({ mode });
    } catch (error) {
      console.error('Erro ao definir modo de tema:', error);
    }
  }

  // Definir tipo de personalidade
  public async setPersonalityType(personalityType: PersonalityType): Promise<void> {
    try {
      await this.updateUserPreferences({ personalityType });
    } catch (error) {
      console.error('Erro ao definir tipo de personalidade:', error);
    }
  }

  // Ativar/desativar alto contraste
  public async setHighContrast(enabled: boolean): Promise<void> {
    try {
      await this.updateUserPreferences({ highContrast: enabled });
    } catch (error) {
      console.error('Erro ao configurar alto contraste:', error);
    }
  }

  // Ativar/desativar modo noturno automático
  public async setAutoNightMode(enabled: boolean): Promise<void> {
    try {
      await this.updateUserPreferences({ autoNightMode: enabled });
      this.setupAutoTheme();
    } catch (error) {
      console.error('Erro ao configurar modo noturno automático:', error);
    }
  }

  // Definir horários do modo noturno
  public async setNightModeSchedule(start: string, end: string): Promise<void> {
    try {
      await this.updateUserPreferences({
        nightModeStart: start,
        nightModeEnd: end,
      });
    } catch (error) {
      console.error('Erro ao definir horários do modo noturno:', error);
    }
  }

  // Ativar/desativar temas sazonais
  public async setSeasonalThemes(enabled: boolean): Promise<void> {
    try {
      await this.updateUserPreferences({ seasonalThemes: enabled });
    } catch (error) {
      console.error('Erro ao configurar temas sazonais:', error);
    }
  }

  // Definir cores personalizadas
  public async setCustomColors(colors: Partial<ThemeColors>): Promise<void> {
    try {
      await this.updateUserPreferences({ customColors: colors });
    } catch (error) {
      console.error('Erro ao definir cores personalizadas:', error);
    }
  }

  // Adicionar listener
  public addListener(listener: (theme: ThemeConfig) => void): () => void {
    try {
      this.listeners.add(listener);
      
      // Retornar função para remover listener
      return () => {
        this.listeners.delete(listener);
      };
      
    } catch (error) {
      console.error('Erro ao adicionar listener:', error);
      return () => {};
    }
  }

  // Obter todos os temas disponíveis
  public getAvailableThemes(): ThemeConfig[] {
    try {
      const themes = Object.values(DEFAULT_THEMES);
      
      // Adicionar tema sazonal atual se ativado
      if (this.userPreferences.seasonalThemes) {
        const currentSeason = getSeason();
        const seasonalTheme = this.createSeasonalTheme(currentSeason);
        themes.push(seasonalTheme);
      }
      
      return themes;
      
    } catch (error) {
      console.error('Erro ao obter temas disponíveis:', error);
      return Object.values(DEFAULT_THEMES);
    }
  }

  // Obter tema por ID
  public getThemeById(id: string): ThemeConfig | null {
    try {
      const themes = this.getAvailableThemes();
      return themes.find(theme => theme.id === id) || null;
    } catch (error) {
      console.error('Erro ao obter tema por ID:', error);
      return null;
    }
  }

  // Exportar tema atual
  public exportCurrentTheme(): string {
    try {
      return JSON.stringify(this.currentTheme, null, 2);
    } catch (error) {
      console.error('Erro ao exportar tema:', error);
      return '';
    }
  }

  // Importar tema
  public async importTheme(themeData: string): Promise<boolean> {
    try {
      const theme = JSON.parse(themeData);
      
      if (theme.id && theme.colors && theme.typography) {
        await this.updateUserPreferences({
          mode: 'custom',
          customColors: theme.colors,
        });
        
        return true;
      }
      
      return false;
      
    } catch (error) {
      console.error('Erro ao importar tema:', error);
      return false;
    }
  }

  // Limpar dados
  public async clearData(): Promise<void> {
    try {
      this.userPreferences = this.getDefaultPreferences();
      await AsyncStorage.removeItem('userThemePreferences');
      await this.applyTheme();
      
      console.log('🧹 Dados de tema limpos');
      
    } catch (error) {
      console.error('Erro ao limpar dados de tema:', error);
    }
  }

  // Parar serviço
  public stop(): void {
    try {
      if (this.autoThemeInterval) {
        clearInterval(this.autoThemeInterval);
        this.autoThemeInterval = null;
      }
      
      this.listeners.clear();
      console.log('🛑 Serviço de temas parado');
      
    } catch (error) {
      console.error('Erro ao parar serviço de temas:', error);
    }
  }
}

// Instância singleton do serviço
const themeService = new ThemeService();

// Exportar funções públicas
export const getCurrentTheme = () => themeService.getCurrentTheme();
export const getUserPreferences = () => themeService.getUserPreferences();
export const updateUserPreferences = (preferences: Partial<UserThemePreferences>) => 
  themeService.updateUserPreferences(preferences);
export const setThemeMode = (mode: ThemeMode) => themeService.setThemeMode(mode);
export const setPersonalityType = (personalityType: PersonalityType) => 
  themeService.setPersonalityType(personalityType);
export const setHighContrast = (enabled: boolean) => themeService.setHighContrast(enabled);
export const setAutoNightMode = (enabled: boolean) => themeService.setAutoNightMode(enabled);
export const setNightModeSchedule = (start: string, end: string) => 
  themeService.setNightModeSchedule(start, end);
export const setSeasonalThemes = (enabled: boolean) => themeService.setSeasonalThemes(enabled);
export const setCustomColors = (colors: Partial<ThemeColors>) => themeService.setCustomColors(colors);
export const addThemeListener = (listener: (theme: ThemeConfig) => void) => 
  themeService.addListener(listener);
export const getAvailableThemes = () => themeService.getAvailableThemes();
export const getThemeById = (id: string) => themeService.getThemeById(id);
export const exportCurrentTheme = () => themeService.exportCurrentTheme();
export const importTheme = (themeData: string) => themeService.importTheme(themeData);
export const clearThemeData = () => themeService.clearData();
export const stopThemeService = () => themeService.stop();

export default themeService;