export interface ThemeConfig {
  id: string;
  name: string;
  type: 'light' | 'dark' | 'auto' | 'custom';
  isActive: boolean;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  shadows: ThemeShadows;
  animations: ThemeAnimations;
  customizations: ThemeCustomizations;
  schedule?: ThemeSchedule;
  conditions?: ThemeConditions;
  createdAt: number;
  lastUpdated: number;
}

export interface ThemeColors {
  // Cores primárias
  primary: {
    main: string;
    light: string;
    dark: string;
    contrast: string;
  };
  secondary: {
    main: string;
    light: string;
    dark: string;
    contrast: string;
  };
  
  // Cores de fundo
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    surface: string;
    overlay: string;
  };
  
  // Cores de texto
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
    inverse: string;
  };
  
  // Cores semânticas
  semantic: {
    success: string;
    warning: string;
    error: string;
    info: string;
    neutral: string;
  };
  
  // Cores de estado
  state: {
    hover: string;
    active: string;
    selected: string;
    disabled: string;
    focus: string;
  };
  
  // Cores de borda
  border: {
    primary: string;
    secondary: string;
    tertiary: string;
    focus: string;
  };
  
  // Cores de elevação
  elevation: {
    level0: string;
    level1: string;
    level2: string;
    level3: string;
    level4: string;
  };
}

export interface ThemeTypography {
  fontFamily: {
    primary: string;
    secondary: string;
    monospace: string;
  };
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
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
  letterSpacing: {
    tight: number;
    normal: number;
    wide: number;
  };
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  '4xl': number;
  '5xl': number;
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
  none: string;
}

export interface ThemeAnimations {
  duration: {
    fast: number;
    normal: number;
    slow: number;
  };
  easing: {
    ease: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
  transitions: {
    default: string;
    fast: string;
    slow: string;
  };
}

export interface ThemeCustomizations {
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  opacity: {
    disabled: number;
    hover: number;
    focus: number;
    selected: number;
  };
  blur: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

export interface ThemeSchedule {
  enabled: boolean;
  startTime: string; // "18:00"
  endTime: string; // "06:00"
  transitionDuration: number; // minutos
  timezone: string;
}

export interface ThemeConditions {
  systemPreference: boolean;
  batteryLevel?: {
    enabled: boolean;
    threshold: number; // 0-100
    whenBelow: 'light' | 'dark';
  };
  location?: {
    enabled: boolean;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    sunriseOffset: number; // minutos
    sunsetOffset: number; // minutos
  };
  weather?: {
    enabled: boolean;
    conditions: {
      sunny: 'light' | 'dark';
      cloudy: 'light' | 'dark';
      rainy: 'light' | 'dark';
      snowy: 'light' | 'dark';
    };
  };
  activity?: {
    enabled: boolean;
    running: 'light' | 'dark';
    walking: 'light' | 'dark';
    stationary: 'light' | 'dark';
  };
}

export interface ThemePreference {
  userId: string;
  currentTheme: string;
  preferredTheme: 'light' | 'dark' | 'auto';
  autoSwitchEnabled: boolean;
  scheduleEnabled: boolean;
  systemPreferenceEnabled: boolean;
  customConditions: ThemeConditions;
  lastSwitch: number;
  switchHistory: ThemeSwitch[];
}

export interface ThemeSwitch {
  id: string;
  fromTheme: string;
  toTheme: string;
  reason: 'manual' | 'schedule' | 'system' | 'condition' | 'battery' | 'location' | 'weather' | 'activity';
  timestamp: number;
  metadata?: any;
}

export interface ThemeManager {
  themes: Map<string, ThemeConfig>;
  userPreferences: Map<string, ThemePreference>;
  currentTheme: string;
  systemTheme: 'light' | 'dark';
  autoSwitchEnabled: boolean;
}

export class ThemeManager {
  private themes: Map<string, ThemeConfig> = new Map();
  private userPreferences: Map<string, ThemePreference> = new Map();
  private currentTheme: string = 'light';
  private systemTheme: 'light' | 'dark' = 'light';
  private autoSwitchEnabled: boolean = true;
  private listeners: Set<(theme: string) => void> = new Set();

  constructor() {
    this.initializeThemes();
    this.detectSystemTheme();
    this.setupThemeDetection();
  }

  private initializeThemes() {
    // Tema claro padrão
    const lightTheme: ThemeConfig = {
      id: 'light',
      name: 'Tema Claro',
      type: 'light',
      isActive: true,
      colors: {
        primary: {
          main: '#3B82F6',
          light: '#60A5FA',
          dark: '#2563EB',
          contrast: '#FFFFFF'
        },
        secondary: {
          main: '#10B981',
          light: '#34D399',
          dark: '#059669',
          contrast: '#FFFFFF'
        },
        background: {
          primary: '#FFFFFF',
          secondary: '#F8FAFC',
          tertiary: '#F1F5F9',
          surface: '#FFFFFF',
          overlay: 'rgba(0, 0, 0, 0.5)'
        },
        text: {
          primary: '#1E293B',
          secondary: '#64748B',
          tertiary: '#94A3B8',
          disabled: '#CBD5E1',
          inverse: '#FFFFFF'
        },
        semantic: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
          neutral: '#6B7280'
        },
        state: {
          hover: '#F1F5F9',
          active: '#E2E8F0',
          selected: '#DBEAFE',
          disabled: '#F1F5F9',
          focus: '#DBEAFE'
        },
        border: {
          primary: '#E2E8F0',
          secondary: '#F1F5F9',
          tertiary: '#F8FAFC',
          focus: '#3B82F6'
        },
        elevation: {
          level0: 'transparent',
          level1: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          level2: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          level3: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          level4: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }
      },
      typography: {
        fontFamily: {
          primary: 'Inter, system-ui, sans-serif',
          secondary: 'Poppins, system-ui, sans-serif',
          monospace: 'JetBrains Mono, monospace'
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
          '5xl': 48
        },
        fontWeight: {
          light: 300,
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700,
          extrabold: 800
        },
        lineHeight: {
          tight: 1.25,
          normal: 1.5,
          relaxed: 1.75,
          loose: 2
        },
        letterSpacing: {
          tight: -0.025,
          normal: 0,
          wide: 0.025
        }
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        '2xl': 48,
        '3xl': 64,
        '4xl': 80,
        '5xl': 96
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        none: 'none'
      },
      animations: {
        duration: {
          fast: 150,
          normal: 300,
          slow: 500
        },
        easing: {
          ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
          easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
          easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
          easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
        },
        transitions: {
          default: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }
      },
      customizations: {
        borderRadius: {
          sm: 4,
          md: 8,
          lg: 12,
          xl: 16,
          full: 9999
        },
        opacity: {
          disabled: 0.5,
          hover: 0.8,
          focus: 1,
          selected: 0.9
        },
        blur: {
          sm: 4,
          md: 8,
          lg: 16,
          xl: 24
        }
      },
      createdAt: Date.now(),
      lastUpdated: Date.now()
    };

    // Tema escuro padrão
    const darkTheme: ThemeConfig = {
      id: 'dark',
      name: 'Tema Escuro',
      type: 'dark',
      isActive: false,
      colors: {
        primary: {
          main: '#60A5FA',
          light: '#93C5FD',
          dark: '#3B82F6',
          contrast: '#1E293B'
        },
        secondary: {
          main: '#34D399',
          light: '#6EE7B7',
          dark: '#10B981',
          contrast: '#1E293B'
        },
        background: {
          primary: '#0F172A',
          secondary: '#1E293B',
          tertiary: '#334155',
          surface: '#1E293B',
          overlay: 'rgba(0, 0, 0, 0.7)'
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#CBD5E1',
          tertiary: '#94A3B8',
          disabled: '#475569',
          inverse: '#0F172A'
        },
        semantic: {
          success: '#34D399',
          warning: '#FBBF24',
          error: '#F87171',
          info: '#60A5FA',
          neutral: '#9CA3AF'
        },
        state: {
          hover: '#334155',
          active: '#475569',
          selected: '#1E40AF',
          disabled: '#334155',
          focus: '#1E40AF'
        },
        border: {
          primary: '#475569',
          secondary: '#334155',
          tertiary: '#1E293B',
          focus: '#60A5FA'
        },
        elevation: {
          level0: 'transparent',
          level1: '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
          level2: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
          level3: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
          level4: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
        }
      },
      typography: lightTheme.typography,
      spacing: lightTheme.spacing,
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
        none: 'none'
      },
      animations: lightTheme.animations,
      customizations: lightTheme.customizations,
      createdAt: Date.now(),
      lastUpdated: Date.now()
    };

    // Tema automático
    const autoTheme: ThemeConfig = {
      id: 'auto',
      name: 'Tema Automático',
      type: 'auto',
      isActive: false,
      colors: lightTheme.colors, // Usar tema claro como base
      typography: lightTheme.typography,
      spacing: lightTheme.spacing,
      shadows: lightTheme.shadows,
      animations: lightTheme.animations,
      customizations: lightTheme.customizations,
      schedule: {
        enabled: true,
        startTime: '18:00',
        endTime: '06:00',
        transitionDuration: 30,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      conditions: {
        systemPreference: true,
        batteryLevel: {
          enabled: true,
          threshold: 20,
          whenBelow: 'dark'
        },
        location: {
          enabled: false,
          coordinates: { latitude: 0, longitude: 0 },
          sunriseOffset: 0,
          sunsetOffset: 0
        },
        weather: {
          enabled: false,
          conditions: {
            sunny: 'light',
            cloudy: 'light',
            rainy: 'dark',
            snowy: 'dark'
          }
        },
        activity: {
          enabled: false,
          running: 'light',
          walking: 'light',
          stationary: 'auto'
        }
      },
      createdAt: Date.now(),
      lastUpdated: Date.now()
    };

    this.themes.set('light', lightTheme);
    this.themes.set('dark', darkTheme);
    this.themes.set('auto', autoTheme);
  }

  // Detectar tema do sistema
  private detectSystemTheme() {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.systemTheme = mediaQuery.matches ? 'dark' : 'light';
      
      // Listener para mudanças do sistema
      mediaQuery.addEventListener('change', (e) => {
        this.systemTheme = e.matches ? 'dark' : 'light';
        this.handleSystemThemeChange();
      });
    }
  }

  // Configurar detecção de tema
  private setupThemeDetection() {
    // Detectar mudanças de bateria
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        battery.addEventListener('levelchange', () => {
          this.handleBatteryChange(battery.level);
        });
      });
    }

    // Detectar mudanças de localização (se permitido)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.updateLocationData(position.coords);
        },
        () => {
          // Localização não disponível
        }
      );
    }

    // Detectar mudanças de atividade (se disponível)
    if ('DeviceMotionEvent' in window) {
      let lastActivity = Date.now();
      let isActive = false;

      window.addEventListener('devicemotion', (event) => {
        const now = Date.now();
        const acceleration = event.accelerationIncludingGravity;
        
        if (acceleration) {
          const magnitude = Math.sqrt(
            acceleration.x! ** 2 + 
            acceleration.y! ** 2 + 
            acceleration.z! ** 2
          );
          
          if (magnitude > 15) { // Threshold para movimento
            isActive = true;
            lastActivity = now;
          }
        }

        // Considerar inativo após 5 minutos sem movimento
        if (isActive && now - lastActivity > 300000) {
          isActive = false;
          this.handleActivityChange('stationary');
        }
      });
    }
  }

  // Obter tema atual
  public getCurrentTheme(): ThemeConfig {
    return this.themes.get(this.currentTheme) || this.themes.get('light')!;
  }

  // Definir tema
  public setTheme(themeId: string, userId?: string): boolean {
    const theme = this.themes.get(themeId);
    if (!theme) return false;

    const previousTheme = this.currentTheme;
    this.currentTheme = themeId;

    // Atualizar estado dos temas
    this.themes.forEach(t => t.isActive = t.id === themeId);

    // Registrar mudança
    if (userId) {
      this.recordThemeSwitch(userId, previousTheme, themeId, 'manual');
    }

    // Notificar listeners
    this.notifyThemeChange(themeId);

    return true;
  }

  // Alternar entre temas claro/escuro
  public toggleTheme(userId?: string): string {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme, userId);
    return newTheme;
  }

  // Ativar tema automático
  public enableAutoTheme(userId?: string): boolean {
    const autoTheme = this.themes.get('auto');
    if (!autoTheme) return false;

    this.autoSwitchEnabled = true;
    this.setTheme('auto', userId);

    // Aplicar tema baseado nas condições atuais
    this.applyAutoTheme();

    return true;
  }

  // Desativar tema automático
  public disableAutoTheme(userId?: string): boolean {
    this.autoSwitchEnabled = false;
    
    // Manter tema atual ou voltar para o preferido
    const userPref = userId ? this.userPreferences.get(userId) : null;
    const preferredTheme = userPref?.preferredTheme || 'light';
    
    this.setTheme(preferredTheme, userId);
    return true;
  }

  // Aplicar tema automático baseado nas condições
  private applyAutoTheme() {
    if (!this.autoSwitchEnabled) return;

    const autoTheme = this.themes.get('auto');
    if (!autoTheme || !autoTheme.conditions) return;

    let targetTheme = 'light';

    // Verificar preferência do sistema
    if (autoTheme.conditions.systemPreference) {
      targetTheme = this.systemTheme;
    }

    // Verificar horário
    if (autoTheme.schedule?.enabled) {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const startTime = this.parseTime(autoTheme.schedule.startTime);
      const endTime = this.parseTime(autoTheme.schedule.endTime);

      if (currentTime >= startTime || currentTime < endTime) {
        targetTheme = 'dark';
      }
    }

    // Verificar bateria
    if (autoTheme.conditions.batteryLevel?.enabled) {
      // Esta verificação é feita em handleBatteryChange
    }

    // Verificar localização (amanhecer/anoitecer)
    if (autoTheme.conditions.location?.enabled) {
      // Esta verificação é feita em updateLocationData
    }

    // Verificar clima
    if (autoTheme.conditions.weather?.enabled) {
      // Esta verificação seria feita com dados de clima
    }

    // Aplicar tema se diferente do atual
    if (targetTheme !== this.currentTheme && targetTheme !== 'auto') {
      this.setTheme(targetTheme);
    }
  }

  // Parsear horário (HH:MM) para minutos
  private parseTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Lidar com mudança de tema do sistema
  private handleSystemThemeChange() {
    if (this.autoSwitchEnabled && this.currentTheme === 'auto') {
      this.applyAutoTheme();
    }
  }

  // Lidar com mudança de bateria
  private handleBatteryChange(level: number) {
    if (!this.autoSwitchEnabled || this.currentTheme !== 'auto') return;

    const autoTheme = this.themes.get('auto');
    if (!autoTheme?.conditions?.batteryLevel?.enabled) return;

    const { threshold, whenBelow } = autoTheme.conditions.batteryLevel;
    
    if (level <= threshold / 100) {
      this.setTheme(whenBelow);
    } else if (this.currentTheme === whenBelow) {
      // Voltar para tema baseado em outras condições
      this.applyAutoTheme();
    }
  }

  // Atualizar dados de localização
  private updateLocationData(coords: GeolocationCoordinates) {
    const autoTheme = this.themes.get('auto');
    if (!autoTheme?.conditions?.location?.enabled) return;

    // Calcular horários de amanhecer/anoitecer
    // Esta é uma implementação simplificada
    const now = new Date();
    const isDaytime = now.getHours() >= 6 && now.getHours() < 18;
    
    if (this.autoSwitchEnabled && this.currentTheme === 'auto') {
      const targetTheme = isDaytime ? 'light' : 'dark';
      if (targetTheme !== this.currentTheme) {
        this.setTheme(targetTheme);
      }
    }
  }

  // Lidar com mudança de atividade
  private handleActivityChange(activity: 'running' | 'walking' | 'stationary') {
    if (!this.autoSwitchEnabled || this.currentTheme !== 'auto') return;

    const autoTheme = this.themes.get('auto');
    if (!autoTheme?.conditions?.activity?.enabled) return;

    const targetTheme = autoTheme.conditions.activity[activity];
    if (targetTheme !== 'auto' && targetTheme !== this.currentTheme) {
      this.setTheme(targetTheme);
    }
  }

  // Registrar mudança de tema
  private recordThemeSwitch(userId: string, fromTheme: string, toTheme: string, reason: string) {
    let userPref = this.userPreferences.get(userId);
    
    if (!userPref) {
      userPref = {
        userId,
        currentTheme: toTheme,
        preferredTheme: 'auto',
        autoSwitchEnabled: true,
        scheduleEnabled: true,
        systemPreferenceEnabled: true,
        customConditions: {},
        lastSwitch: Date.now(),
        switchHistory: []
      };
      this.userPreferences.set(userId, userPref);
    }

    const switchRecord: ThemeSwitch = {
      id: `switch_${Date.now()}`,
      fromTheme,
      toTheme,
      reason: reason as any,
      timestamp: Date.now()
    };

    userPref.switchHistory.push(switchRecord);
    userPref.currentTheme = toTheme;
    userPref.lastSwitch = Date.now();

    // Manter apenas os últimos 100 switches
    if (userPref.switchHistory.length > 100) {
      userPref.switchHistory = userPref.switchHistory.slice(-100);
    }
  }

  // Notificar mudança de tema
  private notifyThemeChange(themeId: string) {
    this.listeners.forEach(listener => listener(themeId));
  }

  // Adicionar listener de mudança de tema
  public addThemeChangeListener(listener: (theme: string) => void): () => void {
    this.listeners.add(listener);
    
    // Retornar função para remover listener
    return () => {
      this.listeners.delete(listener);
    };
  }

  // Remover listener de mudança de tema
  public removeThemeChangeListener(listener: (theme: string) => void): boolean {
    return this.listeners.delete(listener);
  }

  // Obter preferências do usuário
  public getUserPreferences(userId: string): ThemePreference | undefined {
    return this.userPreferences.get(userId);
  }

  // Atualizar preferências do usuário
  public updateUserPreferences(userId: string, updates: Partial<ThemePreference>): ThemePreference | null {
    const userPref = this.userPreferences.get(userId);
    if (!userPref) return null;

    Object.assign(userPref, updates);
    userPref.lastSwitch = Date.now();

    // Aplicar mudanças se necessário
    if (updates.preferredTheme && updates.preferredTheme !== 'auto') {
      this.setTheme(updates.preferredTheme, userId);
    }

    if (updates.autoSwitchEnabled !== undefined) {
      if (updates.autoSwitchEnabled) {
        this.enableAutoTheme(userId);
      } else {
        this.disableAutoTheme(userId);
      }
    }

    return userPref;
  }

  // Obter estatísticas de uso de tema
  public getThemeStats(userId?: string): {
    totalSwitches: number;
    mostUsedTheme: string;
    averageSwitchInterval: number;
    autoSwitchCount: number;
    manualSwitchCount: number;
  } {
    let allSwitches: ThemeSwitch[] = [];

    if (userId) {
      const userPref = this.userPreferences.get(userId);
      if (userPref) {
        allSwitches = userPref.switchHistory;
      }
    } else {
      // Todas as mudanças de todos os usuários
      this.userPreferences.forEach(pref => {
        allSwitches.push(...pref.switchHistory);
      });
    }

    if (allSwitches.length === 0) {
      return {
        totalSwitches: 0,
        mostUsedTheme: 'light',
        averageSwitchInterval: 0,
        autoSwitchCount: 0,
        manualSwitchCount: 0
      };
    }

    // Contar temas mais usados
    const themeCounts = new Map<string, number>();
    allSwitches.forEach(switch_ => {
      themeCounts.set(switch_.toTheme, (themeCounts.get(switch_.toTheme) || 0) + 1);
    });

    const mostUsedTheme = Array.from(themeCounts.entries())
      .sort(([,a], [,b]) => b - a)[0][0];

    // Calcular intervalo médio entre mudanças
    const sortedSwitches = allSwitches.sort((a, b) => a.timestamp - b.timestamp);
    let totalInterval = 0;
    for (let i = 1; i < sortedSwitches.length; i++) {
      totalInterval += sortedSwitches[i].timestamp - sortedSwitches[i-1].timestamp;
    }
    const averageSwitchInterval = totalInterval / (sortedSwitches.length - 1);

    // Contar tipos de mudança
    const autoSwitchCount = allSwitches.filter(s => s.reason !== 'manual').length;
    const manualSwitchCount = allSwitches.filter(s => s.reason === 'manual').length;

    return {
      totalSwitches: allSwitches.length,
      mostUsedTheme,
      averageSwitchInterval: Math.round(averageSwitchInterval / (1000 * 60 * 60)), // em horas
      autoSwitchCount,
      manualSwitchCount
    };
  }

  // Gerar CSS custom properties para o tema atual
  public generateCSSCustomProperties(): string {
    const theme = this.getCurrentTheme();
    let css = ':root {\n';

    // Cores primárias
    css += `  --color-primary: ${theme.colors.primary.main};\n`;
    css += `  --color-primary-light: ${theme.colors.primary.light};\n`;
    css += `  --color-primary-dark: ${theme.colors.primary.dark};\n`;
    css += `  --color-primary-contrast: ${theme.colors.primary.contrast};\n`;

    // Cores de fundo
    css += `  --color-background-primary: ${theme.colors.background.primary};\n`;
    css += `  --color-background-secondary: ${theme.colors.background.secondary};\n`;
    css += `  --color-background-tertiary: ${theme.colors.background.tertiary};\n`;
    css += `  --color-background-surface: ${theme.colors.background.surface};\n`;

    // Cores de texto
    css += `  --color-text-primary: ${theme.colors.text.primary};\n`;
    css += `  --color-text-secondary: ${theme.colors.text.secondary};\n`;
    css += `  --color-text-tertiary: ${theme.colors.text.tertiary};\n`;

    // Cores semânticas
    css += `  --color-success: ${theme.colors.semantic.success};\n`;
    css += `  --color-warning: ${theme.colors.semantic.warning};\n`;
    css += `  --color-error: ${theme.colors.semantic.error};\n`;
    css += `  --color-info: ${theme.colors.semantic.info};\n`;

    // Espaçamento
    Object.entries(theme.spacing).forEach(([key, value]) => {
      css += `  --spacing-${key}: ${value}px;\n`;
    });

    // Sombras
    Object.entries(theme.shadows).forEach(([key, value]) => {
      css += `  --shadow-${key}: ${value};\n`;
    });

    // Animações
    css += `  --transition-default: ${theme.animations.transitions.default};\n`;
    css += `  --transition-fast: ${theme.animations.transitions.fast};\n`;
    css += `  --transition-slow: ${theme.animations.transitions.slow};\n`;

    css += '}\n';
    return css;
  }

  // Obter tema para React Native
  public getReactNativeTheme(): any {
    const theme = this.getCurrentTheme();
    
    return {
      colors: {
        primary: theme.colors.primary.main,
        background: theme.colors.background.primary,
        surface: theme.colors.background.surface,
        text: theme.colors.text.primary,
        textSecondary: theme.colors.text.secondary,
        border: theme.colors.border.primary,
        success: theme.colors.semantic.success,
        warning: theme.colors.semantic.warning,
        error: theme.colors.semantic.error,
        info: theme.colors.semantic.info,
      },
      spacing: theme.spacing,
      borderRadius: theme.customizations.borderRadius,
      shadows: theme.shadows,
      typography: theme.typography
    };
  }
}

export function createThemeManager(): ThemeManager {
  return new ThemeManager();
}