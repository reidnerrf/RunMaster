import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getCurrentTheme,
  getUserPreferences,
  updateUserPreferences,
  setThemeMode,
  setPersonalityType,
  setHighContrast,
  setAutoNightMode,
  setNightModeSchedule,
  setSeasonalThemes,
  setCustomColors,
  addThemeListener,
  getAvailableThemes,
  getThemeById,
  exportCurrentTheme,
  importTheme,
  clearThemeData,
  stopThemeService,
  ThemeMode,
  PersonalityType,
  ThemeConfig,
  UserThemePreferences,
  ThemeColors,
} from '../utils/themeService';
import { getDateInfo, getSeason, getTimeOfDay } from '../utils/dateUtils';

// Interface para o hook de tema avançado
export interface UseAdvancedThemeReturn {
  // Estado atual
  currentTheme: ThemeConfig;
  userPreferences: UserThemePreferences;
  availableThemes: ThemeConfig[];
  
  // Informações de contexto
  currentSeason: string;
  currentTimeOfDay: string;
  isNightMode: boolean;
  isAutoMode: boolean;
  
  // Ações
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setPersonalityType: (type: PersonalityType) => Promise<void>;
  setHighContrast: (enabled: boolean) => Promise<void>;
  setAutoNightMode: (enabled: boolean) => Promise<void>;
  setNightModeSchedule: (start: string, end: string) => Promise<void>;
  setSeasonalThemes: (enabled: boolean) => Promise<void>;
  setCustomColors: (colors: Partial<ThemeColors>) => Promise<void>;
  
  // Utilitários
  exportTheme: () => string;
  importTheme: (themeData: string) => Promise<boolean>;
  clearData: () => Promise<void>;
  
  // Status
  isLoading: boolean;
  error: string | null;
}

// Hook principal de tema avançado
export function useAdvancedTheme(): UseAdvancedThemeReturn {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(getCurrentTheme());
  const [userPreferences, setUserPreferences] = useState<UserThemePreferences>(getUserPreferences());
  const [availableThemes, setAvailableThemes] = useState<ThemeConfig[]>(getAvailableThemes());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Informações de contexto
  const currentSeason = useMemo(() => getSeason(), []);
  const currentTimeOfDay = useMemo(() => getTimeOfDay(), []);
  const isNightMode = useMemo(() => currentTheme.mode === 'dark', [currentTheme.mode]);
  const isAutoMode = useMemo(() => userPreferences.mode === 'auto', [userPreferences.mode]);

  // Configurar listener para mudanças de tema
  useEffect(() => {
    const removeListener = addThemeListener((theme) => {
      setCurrentTheme(theme);
      setError(null);
    });

    return removeListener;
  }, []);

  // Atualizar preferências locais
  const updateLocalPreferences = useCallback((newPreferences: Partial<UserThemePreferences>) => {
    setUserPreferences(prev => ({ ...prev, ...newPreferences }));
  }, []);

  // Função para definir modo de tema
  const handleSetThemeMode = useCallback(async (mode: ThemeMode) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await setThemeMode(mode);
      updateLocalPreferences({ mode });
      
    } catch (err) {
      setError(`Erro ao definir modo de tema: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }, [updateLocalPreferences]);

  // Função para definir tipo de personalidade
  const handleSetPersonalityType = useCallback(async (type: PersonalityType) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await setPersonalityType(type);
      updateLocalPreferences({ personalityType: type });
      
    } catch (err) {
      setError(`Erro ao definir tipo de personalidade: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }, [updateLocalPreferences]);

  // Função para definir alto contraste
  const handleSetHighContrast = useCallback(async (enabled: boolean) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await setHighContrast(enabled);
      updateLocalPreferences({ highContrast: enabled });
      
    } catch (err) {
      setError(`Erro ao configurar alto contraste: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }, [updateLocalPreferences]);

  // Função para definir modo noturno automático
  const handleSetAutoNightMode = useCallback(async (enabled: boolean) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await setAutoNightMode(enabled);
      updateLocalPreferences({ autoNightMode: enabled });
      
    } catch (err) {
      setError(`Erro ao configurar modo noturno automático: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }, [updateLocalPreferences]);

  // Função para definir horários do modo noturno
  const handleSetNightModeSchedule = useCallback(async (start: string, end: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await setNightModeSchedule(start, end);
      updateLocalPreferences({ nightModeStart: start, nightModeEnd: end });
      
    } catch (err) {
      setError(`Erro ao definir horários do modo noturno: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }, [updateLocalPreferences]);

  // Função para definir temas sazonais
  const handleSetSeasonalThemes = useCallback(async (enabled: boolean) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await setSeasonalThemes(enabled);
      updateLocalPreferences({ seasonalThemes: enabled });
      
      // Atualizar lista de temas disponíveis
      setAvailableThemes(getAvailableThemes());
      
    } catch (err) {
      setError(`Erro ao configurar temas sazonais: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }, [updateLocalPreferences]);

  // Função para definir cores personalizadas
  const handleSetCustomColors = useCallback(async (colors: Partial<ThemeColors>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await setCustomColors(colors);
      updateLocalPreferences({ customColors: colors });
      
    } catch (err) {
      setError(`Erro ao definir cores personalizadas: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }, [updateLocalPreferences]);

  // Função para exportar tema
  const handleExportTheme = useCallback(() => {
    try {
      return exportCurrentTheme();
    } catch (err) {
      setError(`Erro ao exportar tema: ${err}`);
      return '';
    }
  }, []);

  // Função para importar tema
  const handleImportTheme = useCallback(async (themeData: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const success = await importTheme(themeData);
      
      if (success) {
        // Atualizar estado local
        setCurrentTheme(getCurrentTheme());
        setUserPreferences(getUserPreferences());
        setAvailableThemes(getAvailableThemes());
      }
      
      return success;
      
    } catch (err) {
      setError(`Erro ao importar tema: ${err}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Função para limpar dados
  const handleClearData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await clearThemeData();
      
      // Atualizar estado local
      setCurrentTheme(getCurrentTheme());
      setUserPreferences(getUserPreferences());
      setAvailableThemes(getAvailableThemes());
      
    } catch (err) {
      setError(`Erro ao limpar dados: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Limpar erro após um tempo
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Retornar interface do hook
  return {
    // Estado atual
    currentTheme,
    userPreferences,
    availableThemes,
    
    // Informações de contexto
    currentSeason,
    currentTimeOfDay,
    isNightMode,
    isAutoMode,
    
    // Ações
    setThemeMode: handleSetThemeMode,
    setPersonalityType: handleSetPersonalityType,
    setHighContrast: handleSetHighContrast,
    setAutoNightMode: handleSetAutoNightMode,
    setNightModeSchedule: handleSetNightModeSchedule,
    setSeasonalThemes: handleSetSeasonalThemes,
    setCustomColors: handleSetCustomColors,
    
    // Utilitários
    exportTheme: handleExportTheme,
    importTheme: handleImportTheme,
    clearData: handleClearData,
    
    // Status
    isLoading,
    error,
  };
}

// Hook para tema sazonal
export function useSeasonalTheme() {
  const [currentSeason, setCurrentSeason] = useState(getSeason());
  const [seasonInfo, setSeasonInfo] = useState(getDateInfo());

  useEffect(() => {
    const updateSeason = () => {
      const newSeason = getSeason();
      const newSeasonInfo = getDateInfo();
      
      if (newSeason !== currentSeason) {
        setCurrentSeason(newSeason);
        setSeasonInfo(newSeasonInfo);
      }
    };

    // Verificar a cada hora
    const interval = setInterval(updateSeason, 3600000);
    
    return () => clearInterval(interval);
  }, [currentSeason]);

  return {
    currentSeason,
    seasonInfo,
    isSpring: currentSeason === 'spring',
    isSummer: currentSeason === 'summer',
    isAutumn: currentSeason === 'autumn',
    isWinter: currentSeason === 'winter',
  };
}

// Hook para modo noturno
export function useNightMode() {
  const [isNight, setIsNight] = useState(false);
  const [timeInfo, setTimeInfo] = useState(getDateInfo());

  useEffect(() => {
    const updateTime = () => {
      const newTimeInfo = getDateInfo();
      const newIsNight = newTimeInfo.timeOfDay === 'night';
      
      if (newIsNight !== isNight) {
        setIsNight(newIsNight);
        setTimeInfo(newTimeInfo);
      }
    };

    // Verificar a cada minuto
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, [isNight]);

  return {
    isNight,
    timeInfo,
    isMorning: timeInfo.timeOfDay === 'morning',
    isAfternoon: timeInfo.timeOfDay === 'afternoon',
    isEvening: timeInfo.timeOfDay === 'evening',
    isNightTime: timeInfo.timeOfDay === 'night',
  };
}

// Hook para personalidade
export function usePersonalityTheme() {
  const { userPreferences, setPersonalityType } = useAdvancedTheme();
  
  const personalityTypes = [
    { id: 'energetic', name: 'Energético', description: 'Cores vibrantes e estimulantes', icon: '⚡' },
    { id: 'calm', name: 'Calmo', description: 'Cores suaves e relaxantes', icon: '🌿' },
    { id: 'creative', name: 'Criativo', description: 'Cores artísticas e expressivas', icon: '🎨' },
    { id: 'professional', name: 'Profissional', description: 'Cores sóbrias e elegantes', icon: '💼' },
    { id: 'minimalist', name: 'Minimalista', description: 'Cores neutras e limpas', icon: '⚪' },
    { id: 'vibrant', name: 'Vibrante', description: 'Cores intensas e chamativas', icon: '🌈' },
  ];

  const currentPersonality = personalityTypes.find(
    type => type.id === userPreferences.personalityType
  );

  return {
    personalityTypes,
    currentPersonality,
    setPersonalityType,
    hasPersonality: !!userPreferences.personalityType,
  };
}

// Hook para acessibilidade
export function useAccessibilityTheme() {
  const { userPreferences, setHighContrast } = useAdvancedTheme();
  
  const accessibilityFeatures = [
    {
      id: 'highContrast',
      name: 'Alto Contraste',
      description: 'Melhora a visibilidade para usuários com deficiência visual',
      enabled: userPreferences.highContrast,
      setEnabled: setHighContrast,
      icon: '🔍',
    },
    {
      id: 'reducedMotion',
      name: 'Reduzir Movimento',
      description: 'Diminui animações para usuários sensíveis',
      enabled: userPreferences.reducedMotion,
      setEnabled: (enabled: boolean) => 
        updateUserPreferences({ reducedMotion: enabled }),
      icon: '🎬',
    },
    {
      id: 'largeText',
      name: 'Texto Grande',
      description: 'Aumenta o tamanho da fonte para melhor legibilidade',
      enabled: userPreferences.largeText,
      setEnabled: (enabled: boolean) => 
        updateUserPreferences({ largeText: enabled }),
      icon: '📝',
    },
    {
      id: 'boldText',
      name: 'Texto em Negrito',
      description: 'Aplica negrito ao texto para melhor contraste',
      enabled: userPreferences.boldText,
      setEnabled: (enabled: boolean) => 
        updateUserPreferences({ boldText: enabled }),
      icon: '🔤',
    },
    {
      id: 'colorBlindFriendly',
      name: 'Amigável para Daltônicos',
      description: 'Usa cores que são distinguíveis para daltônicos',
      enabled: userPreferences.colorBlindFriendly,
      setEnabled: (enabled: boolean) => 
        updateUserPreferences({ colorBlindFriendly: enabled }),
      icon: '🎨',
    },
  ];

  return {
    accessibilityFeatures,
    hasAccessibilityFeatures: accessibilityFeatures.some(feature => feature.enabled),
    accessibilityScore: accessibilityFeatures.filter(feature => feature.enabled).length,
  };
}

// Hook para configurações de tema
export function useThemeSettings() {
  const { userPreferences, setAutoNightMode, setNightModeSchedule, setSeasonalThemes } = useAdvancedTheme();
  
  const themeSettings = [
    {
      id: 'autoNightMode',
      name: 'Modo Noturno Automático',
      description: 'Ativa o tema escuro automaticamente em horários específicos',
      enabled: userPreferences.autoNightMode,
      setEnabled: setAutoNightMode,
      icon: '🌙',
      hasSubSettings: true,
    },
    {
      id: 'seasonalThemes',
      name: 'Temas Sazonais',
      description: 'Adapta as cores automaticamente baseado na estação do ano',
      enabled: userPreferences.seasonalThemes,
      setEnabled: setSeasonalThemes,
      icon: '🍂',
      hasSubSettings: false,
    },
  ];

  const nightModeSchedule = {
    start: userPreferences.nightModeStart,
    end: userPreferences.nightModeEnd,
    setSchedule: setNightModeSchedule,
  };

  return {
    themeSettings,
    nightModeSchedule,
    hasAutoSettings: themeSettings.some(setting => setting.enabled),
  };
}

export default useAdvancedTheme;