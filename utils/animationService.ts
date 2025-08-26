import { Platform } from 'react-native';
import {
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  interpolate,
  Extrapolate,
  runOnJS,
  cancelAnimation,
  measure,
  runOnUI,
} from 'react-native-reanimated';

// Configurações de animação
const ANIMATION_CONFIG = {
  // Configurações de spring
  spring: {
    default: {
      damping: 15,
      stiffness: 150,
      mass: 1,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
    bouncy: {
      damping: 8,
      stiffness: 100,
      mass: 1,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
    smooth: {
      damping: 20,
      stiffness: 200,
      mass: 1,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
    quick: {
      damping: 25,
      stiffness: 300,
      mass: 0.8,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  },
  
  // Configurações de timing
  timing: {
    fast: 200,
    normal: 300,
    slow: 500,
    verySlow: 800,
  },
  
  // Configurações de easing
  easing: {
    linear: (t: number) => t,
    easeIn: (t: number) => t * t,
    easeOut: (t: number) => t * (2 - t),
    easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    bounce: (t: number) => {
      if (t < 1 / 2.75) return 7.5625 * t * t;
      if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
      if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    },
    elastic: (t: number) => {
      return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
    },
  },
  
  // Configurações de performance
  performance: {
    targetFPS: 60,
    useNativeDriver: true,
    reduceMotion: false,
  },
  
  // Configurações de transições
  transitions: {
    screen: {
      duration: 300,
      easing: 'easeInOut',
    },
    modal: {
      duration: 400,
      easing: 'easeOut',
    },
    tab: {
      duration: 250,
      easing: 'easeInOut',
    },
  },
};

// Interface para configurações de animação
interface AnimationConfig {
  type: 'spring' | 'timing' | 'sequence' | 'repeat';
  duration?: number;
  delay?: number;
  easing?: keyof typeof ANIMATION_CONFIG.easing;
  springConfig?: keyof typeof ANIMATION_CONFIG.spring;
  repeatCount?: number;
  reverse?: boolean;
  callback?: () => void;
}

// Interface para animação de entrada
interface EntryAnimation {
  type: 'fade' | 'slide' | 'scale' | 'rotate' | 'bounce' | 'elastic' | 'custom';
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  scale?: number;
  rotation?: number;
  delay?: number;
  duration?: number;
  easing?: keyof typeof ANIMATION_CONFIG.easing;
}

// Interface para animação de transição
interface TransitionAnimation {
  type: 'slide' | 'fade' | 'scale' | 'flip' | 'cube' | 'custom';
  direction?: 'horizontal' | 'vertical' | 'diagonal';
  duration?: number;
  easing?: keyof typeof ANIMATION_CONFIG.easing;
  interactive?: boolean;
}

// Interface para micro-interação
interface MicroInteraction {
  type: 'press' | 'longPress' | 'swipe' | 'drag' | 'pinch' | 'rotate';
  feedback: 'visual' | 'haptic' | 'sound' | 'combined';
  animation: EntryAnimation;
  hapticType?: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';
}

// Classe principal de animações
class AnimationService {
  private isInitialized: boolean = false;
  private activeAnimations: Map<string, any> = new Map();
  private animationQueue: Array<{ id: string; animation: any; priority: number }> = [];
  private performanceMetrics: {
    totalAnimations: number;
    averageFPS: number;
    droppedFrames: number;
    lastFrameTime: number;
  } = {
    totalAnimations: 0,
    averageFPS: 60,
    droppedFrames: 0,
    lastFrameTime: Date.now(),
  };

  constructor() {
    this.initialize();
  }

  // Inicializar serviço
  private async initialize(): Promise<void> {
    try {
      console.log('🎬 Inicializando serviço de animações...');
      
      // Configurar monitoramento de performance
      this.setupPerformanceMonitoring();
      
      // Configurar animações padrão
      this.setupDefaultAnimations();
      
      this.isInitialized = true;
      console.log('✅ Serviço de animações inicializado');
      
    } catch (error) {
      console.error('❌ Erro na inicialização do serviço de animações:', error);
    }
  }

  // Configurar monitoramento de performance
  private setupPerformanceMonitoring(): void {
    try {
      // Monitorar FPS e performance
      setInterval(() => {
        this.updatePerformanceMetrics();
      }, 1000);
      
      console.log('📊 Monitoramento de performance configurado');
      
    } catch (error) {
      console.error('Erro ao configurar monitoramento de performance:', error);
    }
  }

  // Configurar animações padrão
  private setupDefaultAnimations(): void {
    try {
      // Registrar animações padrão
      this.registerDefaultAnimations();
      
      console.log('🎭 Animações padrão configuradas');
      
    } catch (error) {
      console.error('Erro ao configurar animações padrão:', error);
    }
  }

  // Registrar animações padrão
  private registerDefaultAnimations(): void {
    try {
      // Animações de entrada
      this.registerEntryAnimation('fadeIn', {
        type: 'fade',
        duration: 300,
        easing: 'easeOut',
      });
      
      this.registerEntryAnimation('slideUp', {
        type: 'slide',
        direction: 'up',
        distance: 50,
        duration: 400,
        easing: 'easeOut',
      });
      
      this.registerEntryAnimation('scaleIn', {
        type: 'scale',
        scale: 0.8,
        duration: 300,
        easing: 'easeOut',
      });
      
      this.registerEntryAnimation('bounceIn', {
        type: 'bounce',
        duration: 600,
        easing: 'bounce',
      });
      
      this.registerEntryAnimation('elasticIn', {
        type: 'elastic',
        duration: 800,
        easing: 'elastic',
      });
      
      // Animações de transição
      this.registerTransitionAnimation('slideHorizontal', {
        type: 'slide',
        direction: 'horizontal',
        duration: 300,
        easing: 'easeInOut',
      });
      
      this.registerTransitionAnimation('fadeTransition', {
        type: 'fade',
        duration: 250,
        easing: 'easeInOut',
      });
      
      this.registerTransitionAnimation('scaleTransition', {
        type: 'scale',
        duration: 300,
        easing: 'easeOut',
      });
      
      // Micro-interações
      this.registerMicroInteraction('pressFeedback', {
        type: 'press',
        feedback: 'combined',
        animation: {
          type: 'scale',
          scale: 0.95,
          duration: 100,
          easing: 'easeOut',
        },
        hapticType: 'light',
      });
      
      this.registerMicroInteraction('longPressFeedback', {
        type: 'longPress',
        feedback: 'combined',
        animation: {
          type: 'scale',
          scale: 0.9,
          duration: 200,
          easing: 'easeOut',
        },
        hapticType: 'medium',
      });
      
    } catch (error) {
      console.error('Erro ao registrar animações padrão:', error);
    }
  }

  // Registrar animação de entrada
  private registerEntryAnimation(name: string, config: EntryAnimation): void {
    try {
      // Em produção, você armazenaria essas animações em um registro
      console.log(`🎭 Animação de entrada registrada: ${name}`);
      
    } catch (error) {
      console.error('Erro ao registrar animação de entrada:', error);
    }
  }

  // Registrar animação de transição
  private registerTransitionAnimation(name: string, config: TransitionAnimation): void {
    try {
      // Em produção, você armazenaria essas animações em um registro
      console.log(`🎭 Animação de transição registrada: ${name}`);
      
    } catch (error) {
      console.error('Erro ao registrar animação de transição:', error);
    }
  }

  // Registrar micro-interação
  private registerMicroInteraction(name: string, config: MicroInteraction): void {
    try {
      // Em produção, você armazenaria essas micro-interações em um registro
      console.log(`🎭 Micro-interação registrada: ${name}`);
      
    } catch (error) {
      console.error('Erro ao registrar micro-interação:', error);
    }
  }

  // Criar animação de entrada
  public createEntryAnimation(config: EntryAnimation): any {
    try {
      const { type, direction, distance = 50, scale = 1, rotation = 0, delay = 0, duration = 300, easing = 'easeOut' } = config;
      
      let animation: any;
      
      switch (type) {
        case 'fade':
          animation = withDelay(
            delay,
            withTiming(1, {
              duration,
              easing: ANIMATION_CONFIG.easing[easing],
            })
          );
          break;
          
        case 'slide':
          const slideDistance = direction === 'up' || direction === 'down' ? distance : 0;
          const horizontalDistance = direction === 'left' || direction === 'right' ? distance : 0;
          
          animation = withDelay(
            delay,
            withSpring(
              { x: horizontalDistance, y: slideDistance, opacity: 1, scale: 1 },
              ANIMATION_CONFIG.spring.smooth
            )
          );
          break;
          
        case 'scale':
          animation = withDelay(
            delay,
            withSpring(
              { scale: scale, opacity: 1 },
              ANIMATION_CONFIG.spring.bouncy
            )
          );
          break;
          
        case 'rotate':
          animation = withDelay(
            delay,
            withSpring(
              { rotation: rotation, opacity: 1, scale: 1 },
              ANIMATION_CONFIG.spring.smooth
            )
          );
          break;
          
        case 'bounce':
          animation = withDelay(
            delay,
            withSequence(
              withSpring({ scale: 1.2, opacity: 1 }, ANIMATION_CONFIG.spring.bouncy),
              withSpring({ scale: 1, opacity: 1 }, ANIMATION_CONFIG.spring.smooth)
            )
          );
          break;
          
        case 'elastic':
          animation = withDelay(
            delay,
            withSpring(
              { scale: 1, opacity: 1 },
              {
                ...ANIMATION_CONFIG.spring.bouncy,
                damping: 6,
                stiffness: 80,
              }
            )
          );
          break;
          
        default:
          animation = withDelay(
            delay,
            withTiming(1, {
              duration,
              easing: ANIMATION_CONFIG.easing[easing],
            })
          );
      }
      
      return animation;
      
    } catch (error) {
      console.error('Erro ao criar animação de entrada:', error);
      return withTiming(1, { duration: 300 });
    }
  }

  // Criar animação de transição
  public createTransitionAnimation(config: TransitionAnimation): any {
    try {
      const { type, direction = 'horizontal', duration = 300, easing = 'easeInOut', interactive = false } = config;
      
      let animation: any;
      
      switch (type) {
        case 'slide':
          if (direction === 'horizontal') {
            animation = withTiming(
              { translateX: 0, opacity: 1 },
              {
                duration,
                easing: ANIMATION_CONFIG.easing[easing],
              }
            );
          } else {
            animation = withTiming(
              { translateY: 0, opacity: 1 },
              {
                duration,
                easing: ANIMATION_CONFIG.easing[easing],
              }
            );
          }
          break;
          
        case 'fade':
          animation = withTiming(
            { opacity: 1 },
            {
              duration,
              easing: ANIMATION_CONFIG.easing[easing],
            }
          );
          break;
          
        case 'scale':
          animation = withTiming(
            { scale: 1, opacity: 1 },
            {
              duration,
              easing: ANIMATION_CONFIG.easing[easing],
            }
          );
          break;
          
        case 'flip':
          animation = withTiming(
            { rotateY: 0, opacity: 1 },
            {
              duration,
              easing: ANIMATION_CONFIG.easing[easing],
            }
          );
          break;
          
        case 'cube':
          animation = withTiming(
            { rotateY: 0, rotateX: 0, opacity: 1 },
            {
              duration,
              easing: ANIMATION_CONFIG.easing[easing],
            }
          );
          break;
          
        default:
          animation = withTiming(
            { opacity: 1, scale: 1 },
            {
              duration,
              easing: ANIMATION_CONFIG.easing[easing],
            }
          );
      }
      
      return animation;
      
    } catch (error) {
      console.error('Erro ao criar animação de transição:', error);
      return withTiming(1, { duration: 300 });
    }
  }

  // Criar micro-interação
  public createMicroInteraction(config: MicroInteraction): any {
    try {
      const { type, feedback, animation, hapticType = 'light' } = config;
      
      // Criar animação baseada no tipo
      let interactionAnimation: any;
      
      switch (type) {
        case 'press':
          interactionAnimation = withSequence(
            withTiming(animation.scale || 0.95, { duration: 100 }),
            withTiming(1, { duration: 100 })
          );
          break;
          
        case 'longPress':
          interactionAnimation = withTiming(animation.scale || 0.9, { duration: 200 });
          break;
          
        case 'swipe':
          interactionAnimation = withSpring(
            { translateX: 0, scale: 1 },
            ANIMATION_CONFIG.spring.quick
          );
          break;
          
        case 'drag':
          interactionAnimation = withSpring(
            { scale: 1.05, opacity: 0.8 },
            ANIMATION_CONFIG.spring.smooth
          );
          break;
          
        case 'pinch':
          interactionAnimation = withSpring(
            { scale: 1, opacity: 1 },
            ANIMATION_CONFIG.spring.bouncy
          );
          break;
          
        case 'rotate':
          interactionAnimation = withSpring(
            { rotation: 0, scale: 1 },
            ANIMATION_CONFIG.spring.smooth
          );
          break;
          
        default:
          interactionAnimation = withTiming(1, { duration: 200 });
      }
      
      // Adicionar feedback haptico se necessário
      if (feedback === 'haptic' || feedback === 'combined') {
        this.triggerHapticFeedback(hapticType);
      }
      
      return interactionAnimation;
      
    } catch (error) {
      console.error('Erro ao criar micro-interação:', error);
      return withTiming(1, { duration: 200 });
    }
  }

  // Disparar feedback haptico
  private triggerHapticFeedback(type: string): void {
    try {
      // Em React Native, você usaria:
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle[type]);
      
      console.log(`📳 Feedback haptico: ${type}`);
      
    } catch (error) {
      console.error('Erro ao disparar feedback haptico:', error);
    }
  }

  // Criar animação de skeleton loading
  public createSkeletonAnimation(): any {
    try {
      return withRepeat(
        withSequence(
          withTiming(0.3, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
      );
      
    } catch (error) {
      console.error('Erro ao criar animação de skeleton:', error);
      return withTiming(1, { duration: 1000 });
    }
  }

  // Criar animação de pull-to-refresh
  public createPullToRefreshAnimation(pullDistance: number, threshold: number): any {
    try {
      const progress = Math.min(pullDistance / threshold, 1);
      
      return {
        scale: interpolate(progress, [0, 1], [0.8, 1.2], Extrapolate.CLAMP),
        rotation: interpolate(progress, [0, 1], [0, 360], Extrapolate.CLAMP),
        opacity: interpolate(progress, [0, 0.5, 1], [0.3, 0.7, 1], Extrapolate.CLAMP),
      };
      
    } catch (error) {
      console.error('Erro ao criar animação de pull-to-refresh:', error);
      return { scale: 1, rotation: 0, opacity: 1 };
    }
  }

  // Criar animação de lista
  public createListAnimation(index: number, staggerDelay: number = 50): any {
    try {
      return withDelay(
        index * staggerDelay,
        withSpring(
          { translateY: 0, opacity: 1, scale: 1 },
          ANIMATION_CONFIG.spring.smooth
        )
      );
      
    } catch (error) {
      console.error('Erro ao criar animação de lista:', error);
      return withTiming(1, { duration: 300 });
    }
  }

  // Criar animação de modal
  public createModalAnimation(type: 'present' | 'dismiss'): any {
    try {
      if (type === 'present') {
        return withSpring(
          { scale: 1, opacity: 1, translateY: 0 },
          ANIMATION_CONFIG.spring.smooth
        );
      } else {
        return withTiming(
          { scale: 0.8, opacity: 0, translateY: 50 },
          {
            duration: 300,
            easing: ANIMATION_CONFIG.easing.easeOut,
          }
        );
      }
      
    } catch (error) {
      console.error('Erro ao criar animação de modal:', error);
      return withTiming(1, { duration: 300 });
    }
  }

  // Criar animação de tab
  public createTabAnimation(activeIndex: number, currentIndex: number): any {
    try {
      const isActive = activeIndex === currentIndex;
      
      if (isActive) {
        return withSpring(
          { scale: 1.1, opacity: 1 },
          ANIMATION_CONFIG.spring.bouncy
        );
      } else {
        return withSpring(
          { scale: 1, opacity: 0.7 },
          ANIMATION_CONFIG.spring.smooth
        );
      }
      
    } catch (error) {
      console.error('Erro ao criar animação de tab:', error);
      return withTiming(1, { duration: 300 });
    }
  }

  // Executar animação
  public async runAnimation(animation: any, config?: AnimationConfig): Promise<void> {
    try {
      const animationId = `animation_${Date.now()}_${Math.random()}`;
      
      // Adicionar à fila se necessário
      if (config?.delay) {
        this.animationQueue.push({
          id: animationId,
          animation,
          priority: 1,
        });
        
        setTimeout(() => {
          this.executeAnimation(animationId, animation, config);
        }, config.delay);
      } else {
        await this.executeAnimation(animationId, animation, config);
      }
      
    } catch (error) {
      console.error('Erro ao executar animação:', error);
    }
  }

  // Executar animação
  private async executeAnimation(id: string, animation: any, config?: AnimationConfig): Promise<void> {
    try {
      // Registrar animação ativa
      this.activeAnimations.set(id, animation);
      
      // Executar animação
      if (config?.type === 'repeat' && config.repeatCount) {
        // Animação com repetição
        const repeatedAnimation = withRepeat(
          animation,
          config.repeatCount,
          config.reverse || false
        );
        
        repeatedAnimation.start();
      } else {
        // Animação normal
        animation.start();
      }
      
      // Limpar após conclusão
      setTimeout(() => {
        this.activeAnimations.delete(id);
        this.performanceMetrics.totalAnimations++;
        
        if (config?.callback) {
          config.callback();
        }
      }, config?.duration || 300);
      
    } catch (error) {
      console.error('Erro ao executar animação:', error);
      this.activeAnimations.delete(id);
    }
  }

  // Cancelar animação
  public cancelAnimation(id: string): void {
    try {
      const animation = this.activeAnimations.get(id);
      if (animation) {
        cancelAnimation(animation);
        this.activeAnimations.delete(id);
        console.log(`❌ Animação cancelada: ${id}`);
      }
      
    } catch (error) {
      console.error('Erro ao cancelar animação:', error);
    }
  }

  // Cancelar todas as animações
  public cancelAllAnimations(): void {
    try {
      this.activeAnimations.forEach((animation, id) => {
        cancelAnimation(animation);
      });
      
      this.activeAnimations.clear();
      console.log('❌ Todas as animações canceladas');
      
    } catch (error) {
      console.error('Erro ao cancelar todas as animações:', error);
    }
  }

  // Atualizar métricas de performance
  private updatePerformanceMetrics(): void {
    try {
      const currentTime = Date.now();
      const deltaTime = currentTime - this.performanceMetrics.lastFrameTime;
      
      if (deltaTime > 0) {
        const currentFPS = 1000 / deltaTime;
        this.performanceMetrics.averageFPS = 
          (this.performanceMetrics.averageFPS + currentFPS) / 2;
        
        if (currentFPS < ANIMATION_CONFIG.performance.targetFPS) {
          this.performanceMetrics.droppedFrames++;
        }
      }
      
      this.performanceMetrics.lastFrameTime = currentTime;
      
    } catch (error) {
      console.error('Erro ao atualizar métricas de performance:', error);
    }
  }

  // Obter métricas de performance
  public getPerformanceMetrics(): typeof this.performanceMetrics {
    return { ...this.performanceMetrics };
  }

  // Obter animações ativas
  public getActiveAnimations(): number {
    return this.activeAnimations.size;
  }

  // Obter tamanho da fila
  public getQueueSize(): number {
    return this.animationQueue.length;
  }

  // Limpar fila de animações
  public clearQueue(): void {
    try {
      this.animationQueue = [];
      console.log('🧹 Fila de animações limpa');
      
    } catch (error) {
      console.error('Erro ao limpar fila de animações:', error);
    }
  }

  // Parar serviço
  public stop(): void {
    try {
      // Cancelar todas as animações
      this.cancelAllAnimations();
      
      // Limpar fila
      this.clearQueue();
      
      console.log('🛑 Serviço de animações parado');
      
    } catch (error) {
      console.error('Erro ao parar serviço:', error);
    }
  }
}

// Instância singleton do serviço
const animationService = new AnimationService();

// Exportar funções públicas
export const createEntryAnimation = (config: EntryAnimation) => 
  animationService.createEntryAnimation(config);
export const createTransitionAnimation = (config: TransitionAnimation) => 
  animationService.createTransitionAnimation(config);
export const createMicroInteraction = (config: MicroInteraction) => 
  animationService.createMicroInteraction(config);
export const createSkeletonAnimation = () => animationService.createSkeletonAnimation();
export const createPullToRefreshAnimation = (pullDistance: number, threshold: number) => 
  animationService.createPullToRefreshAnimation(pullDistance, threshold);
export const createListAnimation = (index: number, staggerDelay?: number) => 
  animationService.createListAnimation(index, staggerDelay);
export const createModalAnimation = (type: 'present' | 'dismiss') => 
  animationService.createModalAnimation(type);
export const createTabAnimation = (activeIndex: number, currentIndex: number) => 
  animationService.createTabAnimation(activeIndex, currentIndex);
export const runAnimation = (animation: any, config?: AnimationConfig) => 
  animationService.runAnimation(animation, config);
export const cancelAnimation = (id: string) => animationService.cancelAnimation(id);
export const cancelAllAnimations = () => animationService.cancelAllAnimations();
export const getPerformanceMetrics = () => animationService.getPerformanceMetrics();
export const getActiveAnimations = () => animationService.getActiveAnimations();
export const getQueueSize = () => animationService.getQueueSize();
export const clearQueue = () => animationService.clearQueue();
export const stopAnimationService = () => animationService.stop();

export default animationService;