import { Platform } from 'react-native';
import { Haptics, ImpactFeedbackStyle, NotificationFeedbackStyle } from 'expo-haptics';

// Tipos de gestos
export type GestureType = 'swipe' | 'pinch' | 'rotate' | 'longPress' | 'doubleTap' | '3DTouch';
export type SwipeDirection = 'left' | 'right' | 'up' | 'down';
export type HapticType = 'light' | 'medium' | 'heavy' | 'soft' | 'rigid';
export type HapticNotification = 'success' | 'warning' | 'error' | 'info';

// Interface para configurações de gesto
export interface GestureConfig {
  type: GestureType;
  direction?: SwipeDirection;
  threshold?: number;
  velocity?: number;
  distance?: number;
  duration?: number;
  enabled?: boolean;
  hapticFeedback?: boolean;
  hapticType?: HapticType;
  onGesture?: (gesture: GestureData) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

// Interface para dados de gesto
export interface GestureData {
  type: GestureType;
  direction?: SwipeDirection;
  distance: number;
  velocity: number;
  duration: number;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  pressure?: number; // Para 3D Touch
  timestamp: number;
}

// Interface para configurações de haptic
export interface HapticConfig {
  type: HapticType;
  intensity?: number; // 0.0 a 1.0
  pattern?: number[]; // Padrão de vibração
  repeat?: boolean;
  delay?: number;
}

// Interface para configurações de swipe action
export interface SwipeActionConfig {
  id: string;
  title: string;
  icon: string;
  color: string;
  backgroundColor: string;
  action: () => void;
  hapticFeedback?: boolean;
  hapticType?: HapticType;
  threshold?: number;
  direction?: SwipeDirection;
}

// Interface para configurações de pull-to-action
export interface PullToActionConfig {
  threshold: number;
  action: () => void;
  hapticFeedback?: boolean;
  hapticType?: HapticType;
  visualFeedback?: boolean;
  animationDuration?: number;
}

// Configurações padrão de gestos
const DEFAULT_GESTURE_CONFIG: Record<GestureType, Partial<GestureConfig>> = {
  swipe: {
    threshold: 50,
    velocity: 500,
    distance: 100,
    duration: 300,
    enabled: true,
    hapticFeedback: true,
    hapticType: 'light',
  },
  pinch: {
    threshold: 0.1,
    enabled: true,
    hapticFeedback: false,
  },
  rotate: {
    threshold: 15,
    enabled: true,
    hapticFeedback: false,
  },
  longPress: {
    threshold: 500,
    enabled: true,
    hapticFeedback: true,
    hapticType: 'medium',
  },
  doubleTap: {
    threshold: 300,
    enabled: true,
    hapticFeedback: true,
    hapticType: 'light',
  },
  '3DTouch': {
    threshold: 0.5,
    enabled: Platform.OS === 'ios',
    hapticFeedback: true,
    hapticType: 'medium',
  },
};

// Configurações padrão de haptic
const DEFAULT_HAPTIC_CONFIG: Record<HapticType, HapticConfig> = {
  light: {
    type: 'light',
    intensity: 0.3,
    pattern: [0, 100],
  },
  medium: {
    type: 'medium',
    intensity: 0.6,
    pattern: [0, 150],
  },
  heavy: {
    type: 'heavy',
    intensity: 1.0,
    pattern: [0, 200],
  },
  soft: {
    type: 'soft',
    intensity: 0.4,
    pattern: [0, 80],
  },
  rigid: {
    type: 'rigid',
    intensity: 0.8,
    pattern: [0, 120],
  },
};

// Classe principal do serviço de gestos
class GestureService {
  private isInitialized: boolean = false;
  private gestureConfigs: Map<string, GestureConfig> = new Map();
  private activeGestures: Map<string, GestureData> = new Map();
  private hapticEnabled: boolean = true;
  private hapticIntensity: number = 1.0;
  private customHapticPatterns: Map<string, number[]> = new Map();

  constructor() {
    this.initialize();
  }

  // Inicializar serviço
  private async initialize(): Promise<void> {
    try {
      console.log('👆 Inicializando serviço de gestos...');
      
      // Verificar suporte a haptics
      await this.checkHapticSupport();
      
      // Configurar gestos padrão
      this.setupDefaultGestures();
      
      this.isInitialized = true;
      console.log('✅ Serviço de gestos inicializado');
      
    } catch (error) {
      console.error('❌ Erro na inicialização do serviço de gestos:', error);
    }
  }

  // Verificar suporte a haptics
  private async checkHapticSupport(): Promise<void> {
    try {
      if (Platform.OS === 'ios') {
        // iOS tem suporte nativo
        this.hapticEnabled = true;
        console.log('📱 Haptics habilitados para iOS');
      } else if (Platform.OS === 'android') {
        // Android pode ter suporte limitado
        this.hapticEnabled = true;
        console.log('🤖 Haptics habilitados para Android');
      } else {
        this.hapticEnabled = false;
        console.log('💻 Haptics não suportados nesta plataforma');
      }
    } catch (error) {
      console.error('Erro ao verificar suporte a haptics:', error);
      this.hapticEnabled = false;
    }
  }

  // Configurar gestos padrão
  private setupDefaultGestures(): void {
    try {
      Object.entries(DEFAULT_GESTURE_CONFIG).forEach(([type, config]) => {
        this.gestureConfigs.set(type, {
          ...config,
          type: type as GestureType,
        });
      });
      
      console.log('🎭 Gestos padrão configurados');
      
    } catch (error) {
      console.error('Erro ao configurar gestos padrão:', error);
    }
  }

  // Registrar configuração de gesto
  public registerGesture(id: string, config: GestureConfig): void {
    try {
      this.gestureConfigs.set(id, {
        ...DEFAULT_GESTURE_CONFIG[config.type],
        ...config,
      });
      
      console.log(`🎭 Gesto registrado: ${id}`);
      
    } catch (error) {
      console.error('Erro ao registrar gesto:', error);
    }
  }

  // Obter configuração de gesto
  public getGestureConfig(id: string): GestureConfig | undefined {
    return this.gestureConfigs.get(id);
  }

  // Atualizar configuração de gesto
  public updateGestureConfig(id: string, updates: Partial<GestureConfig>): void {
    try {
      const currentConfig = this.gestureConfigs.get(id);
      if (currentConfig) {
        this.gestureConfigs.set(id, { ...currentConfig, ...updates });
        console.log(`🎭 Configuração de gesto atualizada: ${id}`);
      }
    } catch (error) {
      console.error('Erro ao atualizar configuração de gesto:', error);
    }
  }

  // Remover gesto
  public removeGesture(id: string): void {
    try {
      this.gestureConfigs.delete(id);
      console.log(`🎭 Gesto removido: ${id}`);
    } catch (error) {
      console.error('Erro ao remover gesto:', error);
    }
  }

  // Processar dados de gesto
  public processGesture(gestureData: GestureData): void {
    try {
      const config = this.gestureConfigs.get(gestureData.type);
      if (config && config.enabled) {
        // Armazenar gesto ativo
        this.activeGestures.set(gestureData.type, gestureData);
        
        // Executar callbacks
        if (config.onStart) config.onStart();
        if (config.onGesture) config.onGesture(gestureData);
        
        // Feedback háptico
        if (config.hapticFeedback && this.hapticEnabled) {
          this.triggerHaptic(config.hapticType || 'light');
        }
        
        console.log(`🎭 Gesto processado: ${gestureData.type}`);
      }
    } catch (error) {
      console.error('Erro ao processar gesto:', error);
    }
  }

  // Finalizar gesto
  public finishGesture(type: GestureType): void {
    try {
      const config = this.gestureConfigs.get(type);
      if (config && config.onEnd) {
        config.onEnd();
      }
      
      this.activeGestures.delete(type);
      console.log(`🎭 Gesto finalizado: ${type}`);
      
    } catch (error) {
      console.error('Erro ao finalizar gesto:', error);
    }
  }

  // Obter gestos ativos
  public getActiveGestures(): GestureData[] {
    return Array.from(this.activeGestures.values());
  }

  // Verificar se gesto está ativo
  public isGestureActive(type: GestureType): boolean {
    return this.activeGestures.has(type);
  }

  // Limpar gestos ativos
  public clearActiveGestures(): void {
    try {
      this.activeGestures.clear();
      console.log('🧹 Gestos ativos limpos');
    } catch (error) {
      console.error('Erro ao limpar gestos ativos:', error);
    }
  }

  // Configurar haptics
  public configureHaptics(enabled: boolean, intensity: number = 1.0): void {
    try {
      this.hapticEnabled = enabled;
      this.hapticIntensity = Math.max(0, Math.min(1, intensity));
      
      console.log(`📳 Haptics configurados: ${enabled ? 'habilitado' : 'desabilitado'}, intensidade: ${this.hapticIntensity}`);
      
    } catch (error) {
      console.error('Erro ao configurar haptics:', error);
    }
  }

  // Disparar feedback háptico
  public triggerHaptic(type: HapticType, config?: Partial<HapticConfig>): void {
    try {
      if (!this.hapticEnabled) return;
      
      const hapticConfig = { ...DEFAULT_HAPTIC_CONFIG[type], ...config };
      
      // Aplicar intensidade global
      const finalIntensity = hapticConfig.intensity! * this.hapticIntensity;
      
      // Disparar haptic baseado no tipo
      switch (hapticConfig.type) {
        case 'light':
          Haptics.impactAsync(ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          Haptics.impactAsync(ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          Haptics.impactAsync(ImpactFeedbackStyle.Heavy);
          break;
        case 'soft':
          Haptics.impactAsync(ImpactFeedbackStyle.Soft);
          break;
        case 'rigid':
          Haptics.impactAsync(ImpactFeedbackStyle.Rigid);
          break;
        default:
          Haptics.impactAsync(ImpactFeedbackStyle.Light);
      }
      
      console.log(`📳 Haptic disparado: ${type} (intensidade: ${finalIntensity.toFixed(2)})`);
      
    } catch (error) {
      console.error('Erro ao disparar haptic:', error);
    }
  }

  // Disparar notificação háptica
  public triggerNotificationHaptic(type: HapticNotification): void {
    try {
      if (!this.hapticEnabled) return;
      
      let notificationType: NotificationFeedbackStyle;
      
      switch (type) {
        case 'success':
          notificationType = NotificationFeedbackStyle.Success;
          break;
        case 'warning':
          notificationType = NotificationFeedbackStyle.Warning;
          break;
        case 'error':
          notificationType = NotificationFeedbackStyle.Error;
          break;
        case 'info':
          notificationType = NotificationFeedbackStyle.Success;
          break;
        default:
          notificationType = NotificationFeedbackStyle.Success;
      }
      
      Haptics.notificationAsync(notificationType);
      console.log(`📳 Notificação háptica: ${type}`);
      
    } catch (error) {
      console.error('Erro ao disparar notificação háptica:', error);
    }
  }

  // Disparar haptic personalizado
  public triggerCustomHaptic(pattern: number[], intensity: number = 1.0): void {
    try {
      if (!this.hapticEnabled) return;
      
      // Aplicar intensidade
      const finalIntensity = intensity * this.hapticIntensity;
      
      // Disparar padrão personalizado
      pattern.forEach((duration, index) => {
        if (index % 2 === 0) {
          // Duração da vibração
          setTimeout(() => {
            Haptics.impactAsync(ImpactFeedbackStyle.Medium);
          }, pattern.slice(0, index).reduce((sum, val) => sum + val, 0));
        }
      });
      
      console.log(`📳 Haptic personalizado: padrão ${pattern.length} elementos, intensidade ${finalIntensity.toFixed(2)}`);
      
    } catch (error) {
      console.error('Erro ao disparar haptic personalizado:', error);
    }
  }

  // Salvar padrão háptico personalizado
  public saveCustomHapticPattern(name: string, pattern: number[]): void {
    try {
      this.customHapticPatterns.set(name, pattern);
      console.log(`📳 Padrão háptico salvo: ${name}`);
    } catch (error) {
      console.error('Erro ao salvar padrão háptico:', error);
    }
  }

  // Obter padrão háptico personalizado
  public getCustomHapticPattern(name: string): number[] | undefined {
    return this.customHapticPatterns.get(name);
  }

  // Listar padrões hápticos personalizados
  public listCustomHapticPatterns(): string[] {
    return Array.from(this.customHapticPatterns.keys());
  }

  // Remover padrão háptico personalizado
  public removeCustomHapticPattern(name: string): void {
    try {
      this.customHapticPatterns.delete(name);
      console.log(`📳 Padrão háptico removido: ${name}`);
    } catch (error) {
      console.error('Erro ao remover padrão háptico:', error);
    }
  }

  // Validar configuração de gesto
  public validateGestureConfig(config: GestureConfig): boolean {
    try {
      // Verificar campos obrigatórios
      if (!config.type) return false;
      
      // Verificar valores válidos
      if (config.threshold && config.threshold < 0) return false;
      if (config.velocity && config.velocity < 0) return false;
      if (config.distance && config.distance < 0) return false;
      if (config.duration && config.duration < 0) return false;
      
      return true;
      
    } catch (error) {
      console.error('Erro ao validar configuração de gesto:', error);
      return false;
    }
  }

  // Obter estatísticas de gestos
  public getGestureStats(): {
    totalGestures: number;
    activeGestures: number;
    registeredConfigs: number;
    hapticEnabled: boolean;
    hapticIntensity: number;
  } {
    return {
      totalGestures: this.activeGestures.size,
      activeGestures: this.activeGestures.size,
      registeredConfigs: this.gestureConfigs.size,
      hapticEnabled: this.hapticEnabled,
      hapticIntensity: this.hapticIntensity,
    };
  }

  // Limpar dados
  public clearData(): void {
    try {
      this.gestureConfigs.clear();
      this.activeGestures.clear();
      this.customHapticPatterns.clear();
      
      console.log('🧹 Dados de gestos limpos');
      
    } catch (error) {
      console.error('Erro ao limpar dados de gestos:', error);
    }
  }

  // Parar serviço
  public stop(): void {
    try {
      this.clearActiveGestures();
      this.clearData();
      
      console.log('🛑 Serviço de gestos parado');
      
    } catch (error) {
      console.error('Erro ao parar serviço de gestos:', error);
    }
  }
}

// Instância singleton do serviço
const gestureService = new GestureService();

// Exportar funções públicas
export const registerGesture = (id: string, config: GestureConfig) => 
  gestureService.registerGesture(id, config);
export const getGestureConfig = (id: string) => gestureService.getGestureConfig(id);
export const updateGestureConfig = (id: string, updates: Partial<GestureConfig>) => 
  gestureService.updateGestureConfig(id, updates);
export const removeGesture = (id: string) => gestureService.removeGesture(id);
export const processGesture = (gestureData: GestureData) => gestureService.processGesture(gestureData);
export const finishGesture = (type: GestureType) => gestureService.finishGesture(type);
export const getActiveGestures = () => gestureService.getActiveGestures();
export const isGestureActive = (type: GestureType) => gestureService.isGestureActive(type);
export const clearActiveGestures = () => gestureService.clearActiveGestures();
export const configureHaptics = (enabled: boolean, intensity?: number) => 
  gestureService.configureHaptics(enabled, intensity);
export const triggerHaptic = (type: HapticType, config?: Partial<HapticConfig>) => 
  gestureService.triggerHaptic(type, config);
export const triggerNotificationHaptic = (type: HapticNotification) => 
  gestureService.triggerNotificationHaptic(type);
export const triggerCustomHaptic = (pattern: number[], intensity?: number) => 
  gestureService.triggerCustomHaptic(pattern, intensity);
export const saveCustomHapticPattern = (name: string, pattern: number[]) => 
  gestureService.saveCustomHapticPattern(name, pattern);
export const getCustomHapticPattern = (name: string) => gestureService.getCustomHapticPattern(name);
export const listCustomHapticPatterns = () => gestureService.listCustomHapticPatterns();
export const removeCustomHapticPattern = (name: string) => gestureService.removeCustomHapticPattern(name);
export const validateGestureConfig = (config: GestureConfig) => gestureService.validateGestureConfig(config);
export const getGestureStats = () => gestureService.getGestureStats();
export const clearGestureData = () => gestureService.clearData();
export const stopGestureService = () => gestureService.stop();

export default gestureService;