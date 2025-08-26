import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, AccessibilityInfo } from 'react-native';

// Configurações de acessibilidade
const ACCESSIBILITY_CONFIG = {
  // WCAG 2.1 Níveis
  levels: {
    A: 'A',
    AA: 'AA',
    AAA: 'AAA',
  },
  
  // Contraste mínimo (WCAG AA)
  contrastRatios: {
    normal: 4.5, // Texto normal
    large: 3.0,  // Texto grande (18pt+ ou 14pt+ bold)
    ui: 3.0,     // Elementos de interface
  },
  
  // Tamanhos mínimos
  touchTargets: {
    minimum: 44, // pontos (pt)
    recommended: 48, // pontos (pt)
  },
  
  // Tamanhos de fonte
  fontSizes: {
    minimum: 12, // pt
    recommended: 16, // pt
    large: 18, // pt
    extraLarge: 24, // pt
  },
  
  // Espaçamento
  spacing: {
    minimum: 8, // pt
    recommended: 16, // pt
    large: 24, // pt
  },
  
  // Animações
  animations: {
    maxDuration: 500, // ms
    reducedMotion: true,
    prefersReducedMotion: true,
  },
  
  // Navegação
  navigation: {
    keyboardSupport: true,
    focusIndicators: true,
    skipLinks: true,
    logicalOrder: true,
  },
};

// Interface para configurações de acessibilidade
interface AccessibilitySettings {
  // Nível WCAG
  wcagLevel: 'A' | 'AA' | 'AAA';
  
  // Contraste
  highContrast: boolean;
  colorBlindSupport: boolean;
  
  // Tipografia
  dynamicType: boolean;
  largeText: boolean;
  boldText: boolean;
  
  // Redução de movimento
  reduceMotion: boolean;
  reduceTransparency: boolean;
  
  // Navegação
  keyboardNavigation: boolean;
  voiceOver: boolean;
  talkBack: boolean;
  
  // Áreas de toque
  largeTouchTargets: boolean;
  
  // Cores
  invertColors: boolean;
  
  // Som
  soundEffects: boolean;
  hapticFeedback: boolean;
  
  // Última atualização
  lastUpdated: string;
}

// Interface para métricas de acessibilidade
interface AccessibilityMetrics {
  // Contraste
  contrastRatios: {
    text: number;
    background: number;
    ui: number;
    average: number;
  };
  
  // Tamanhos
  touchTargets: {
    compliant: number;
    nonCompliant: number;
    percentage: number;
  };
  
  // Tipografia
  fontSizes: {
    compliant: number;
    nonCompliant: number;
    percentage: number;
  };
  
  // Navegação
  keyboardSupport: {
    supported: number;
    notSupported: number;
    percentage: number;
  };
  
  // Score geral
  overallScore: number;
  wcagCompliance: 'A' | 'AA' | 'AAA' | 'Non-Compliant';
  
  // Problemas encontrados
  issues: Array<{
    type: 'contrast' | 'size' | 'navigation' | 'typography' | 'animation';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    element?: string;
    recommendation: string;
  }>;
}

// Classe principal de acessibilidade
class AccessibilityService {
  private settings: AccessibilitySettings;
  private isInitialized: boolean = false;
  private accessibilityChangeListener: any = null;
  private metrics: AccessibilityMetrics[] = [];

  constructor() {
    this.settings = this.getDefaultSettings();
    this.initialize();
  }

  // Obter configurações padrão
  private getDefaultSettings(): AccessibilitySettings {
    return {
      wcagLevel: 'AA',
      highContrast: false,
      colorBlindSupport: false,
      dynamicType: true,
      largeText: false,
      boldText: false,
      reduceMotion: false,
      reduceTransparency: false,
      keyboardNavigation: true,
      voiceOver: false,
      talkBack: false,
      largeTouchTargets: true,
      invertColors: false,
      soundEffects: true,
      hapticFeedback: true,
      lastUpdated: new Date().toISOString(),
    };
  }

  // Inicializar serviço
  private async initialize(): Promise<void> {
    try {
      console.log('♿ Inicializando serviço de acessibilidade...');
      
      // Carregar configurações salvas
      await this.loadSettings();
      
      // Configurar listeners de acessibilidade
      await this.setupAccessibilityListeners();
      
      // Verificar configurações do sistema
      await this.checkSystemAccessibilitySettings();
      
      // Configurar acessibilidade inicial
      await this.configureAccessibility();
      
      this.isInitialized = true;
      console.log('✅ Serviço de acessibilidade inicializado');
      
    } catch (error) {
      console.error('❌ Erro na inicialização do serviço de acessibilidade:', error);
    }
  }

  // Carregar configurações salvas
  private async loadSettings(): Promise<void> {
    try {
      const savedSettings = await AsyncStorage.getItem('accessibility_settings');
      
      if (savedSettings) {
        this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        console.log('📦 Configurações de acessibilidade carregadas');
      }
      
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  }

  // Salvar configurações
  private async saveSettings(): Promise<void> {
    try {
      this.settings.lastUpdated = new Date().toISOString();
      await AsyncStorage.setItem('accessibility_settings', JSON.stringify(this.settings));
      
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    }
  }

  // Configurar listeners de acessibilidade
  private async setupAccessibilityListeners(): Promise<void> {
    try {
      // Listener para mudanças de acessibilidade
      this.accessibilityChangeListener = AccessibilityInfo.addEventListener(
        'accessibilityChanged',
        this.handleAccessibilityChange.bind(this)
      );
      
      // Listener para mudanças de redução de movimento
      if (Platform.OS === 'ios') {
        AccessibilityInfo.addEventListener(
          'reduceMotionChanged',
          this.handleReduceMotionChange.bind(this)
        );
      }
      
      console.log('👂 Listeners de acessibilidade configurados');
      
    } catch (error) {
      console.error('Erro ao configurar listeners:', error);
    }
  }

  // Verificar configurações do sistema
  private async checkSystemAccessibilitySettings(): Promise<void> {
    try {
      // Verificar se VoiceOver/TalkBack está ativo
      const isScreenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      this.settings.voiceOver = isScreenReaderEnabled;
      this.settings.talkBack = isScreenReaderEnabled;
      
      // Verificar outras configurações do sistema
      const isReduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();
      this.settings.reduceMotion = isReduceMotionEnabled;
      
      console.log(`📱 Configurações do sistema: Screen Reader: ${isScreenReaderEnabled}, Reduce Motion: ${isReduceMotionEnabled}`);
      
    } catch (error) {
      console.error('Erro ao verificar configurações do sistema:', error);
    }
  }

  // Configurar acessibilidade
  private async configureAccessibility(): Promise<void> {
    try {
      // Aplicar configurações baseadas nas preferências do usuário
      await this.applyAccessibilitySettings();
      
      // Configurar navegação por teclado
      if (this.settings.keyboardNavigation) {
        this.setupKeyboardNavigation();
      }
      
      // Configurar suporte a screen readers
      if (this.settings.voiceOver || this.settings.talkBack) {
        this.setupScreenReaderSupport();
      }
      
      console.log('⚙️ Acessibilidade configurada');
      
    } catch (error) {
      console.error('Erro ao configurar acessibilidade:', error);
    }
  }

  // Aplicar configurações de acessibilidade
  private async applyAccessibilitySettings(): Promise<void> {
    try {
      // Aplicar configurações de contraste
      if (this.settings.highContrast) {
        this.applyHighContrast();
      }
      
      // Aplicar configurações de tipografia
      if (this.settings.largeText) {
        this.applyLargeText();
      }
      
      // Aplicar configurações de movimento
      if (this.settings.reduceMotion) {
        this.applyReducedMotion();
      }
      
      // Aplicar configurações de áreas de toque
      if (this.settings.largeTouchTargets) {
        this.applyLargeTouchTargets();
      }
      
    } catch (error) {
      console.error('Erro ao aplicar configurações:', error);
    }
  }

  // Aplicar alto contraste
  private applyHighContrast(): void {
    try {
      console.log('🎨 Aplicando alto contraste');
      
      // Em produção, aplicar estilos de alto contraste
      // document.body.classList.add('high-contrast');
      
    } catch (error) {
      console.error('Erro ao aplicar alto contraste:', error);
    }
  }

  // Aplicar texto grande
  private applyLargeText(): void {
    try {
      console.log('📝 Aplicando texto grande');
      
      // Em produção, aplicar estilos de texto grande
      // document.body.classList.add('large-text');
      
    } catch (error) {
      console.error('Erro ao aplicar texto grande:', error);
    }
  }

  // Aplicar movimento reduzido
  private applyReducedMotion(): void {
    try {
      console.log('🔄 Aplicando movimento reduzido');
      
      // Em produção, aplicar estilos de movimento reduzido
      // document.body.classList.add('reduced-motion');
      
    } catch (error) {
      console.error('Erro ao aplicar movimento reduzido:', error);
    }
  }

  // Aplicar áreas de toque grandes
  private applyLargeTouchTargets(): void {
    try {
      console.log('👆 Aplicando áreas de toque grandes');
      
      // Em produção, aplicar estilos de áreas de toque grandes
      // document.body.classList.add('large-touch-targets');
      
    } catch (error) {
      console.error('Erro ao aplicar áreas de toque grandes:', error);
    }
  }

  // Configurar navegação por teclado
  private setupKeyboardNavigation(): Promise<void> {
    return new Promise((resolve) => {
      try {
        console.log('⌨️ Configurando navegação por teclado');
        
        // Em produção, configurar:
        // - Indicadores de foco
        // - Ordem lógica de tabulação
        // - Atalhos de teclado
        // - Skip links
        
        resolve();
        
      } catch (error) {
        console.error('Erro ao configurar navegação por teclado:', error);
        resolve();
      }
    });
  }

  // Configurar suporte a screen readers
  private setupScreenReaderSupport(): Promise<void> {
    return new Promise((resolve) => {
      try {
        console.log('🔊 Configurando suporte a screen readers');
        
        // Em produção, configurar:
        // - Labels de acessibilidade
        // - Descrições de elementos
        // - Estados de elementos
        // - Navegação por landmarks
        
        resolve();
        
      } catch (error) {
        console.error('Erro ao configurar suporte a screen readers:', error);
        resolve();
      }
    });
  }

  // Manipular mudança de acessibilidade
  private handleAccessibilityChange(isEnabled: boolean): void {
    try {
      console.log(`♿ Mudança de acessibilidade: ${isEnabled ? 'Ativada' : 'Desativada'}`);
      
      // Atualizar configurações
      this.settings.voiceOver = isEnabled;
      this.settings.talkBack = isEnabled;
      
      // Reconfigurar acessibilidade
      this.configureAccessibility();
      
      // Salvar configurações
      this.saveSettings();
      
    } catch (error) {
      console.error('Erro ao manipular mudança de acessibilidade:', error);
    }
  }

  // Manipular mudança de redução de movimento
  private handleReduceMotionChange(isEnabled: boolean): void {
    try {
      console.log(`🔄 Mudança de redução de movimento: ${isEnabled ? 'Ativada' : 'Desativada'}`);
      
      // Atualizar configurações
      this.settings.reduceMotion = isEnabled;
      
      // Aplicar configurações
      if (isEnabled) {
        this.applyReducedMotion();
      }
      
      // Salvar configurações
      this.saveSettings();
      
    } catch (error) {
      console.error('Erro ao manipular mudança de redução de movimento:', error);
    }
  }

  // Atualizar configurações
  public async updateSettings(newSettings: Partial<AccessibilitySettings>): Promise<void> {
    try {
      console.log('⚙️ Atualizando configurações de acessibilidade...');
      
      // Atualizar configurações
      this.settings = { ...this.settings, ...newSettings };
      
      // Aplicar novas configurações
      await this.applyAccessibilitySettings();
      
      // Salvar configurações
      await this.saveSettings();
      
      console.log('✅ Configurações atualizadas');
      
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      throw error;
    }
  }

  // Obter configurações atuais
  public getSettings(): AccessibilitySettings {
    return { ...this.settings };
  }

  // Verificar conformidade WCAG
  public async checkWCAGCompliance(): Promise<AccessibilityMetrics> {
    try {
      console.log('🔍 Verificando conformidade WCAG...');
      
      // Verificar contraste
      const contrastMetrics = await this.checkContrastCompliance();
      
      // Verificar tamanhos de toque
      const touchMetrics = await this.checkTouchTargetCompliance();
      
      // Verificar tipografia
      const typographyMetrics = await this.checkTypographyCompliance();
      
      // Verificar navegação
      const navigationMetrics = await this.checkNavigationCompliance();
      
      // Calcular score geral
      const overallScore = this.calculateOverallScore(
        contrastMetrics,
        touchMetrics,
        typographyMetrics,
        navigationMetrics
      );
      
      // Determinar nível de conformidade
      const wcagCompliance = this.determineWCAGLevel(overallScore);
      
      // Gerar métricas
      const metrics: AccessibilityMetrics = {
        contrastRatios: contrastMetrics,
        touchTargets: touchMetrics,
        fontSizes: typographyMetrics,
        keyboardSupport: navigationMetrics,
        overallScore,
        wcagCompliance,
        issues: this.generateIssues(
          contrastMetrics,
          touchMetrics,
          typographyMetrics,
          navigationMetrics
        ),
      };
      
      // Salvar métricas
      this.metrics.push(metrics);
      
      console.log(`✅ Conformidade WCAG verificada: ${wcagCompliance} (Score: ${overallScore})`);
      
      return metrics;
      
    } catch (error) {
      console.error('Erro ao verificar conformidade WCAG:', error);
      throw error;
    }
  }

  // Verificar conformidade de contraste
  private async checkContrastCompliance(): Promise<{ text: number; background: number; ui: number; average: number }> {
    try {
      // Em produção, verificar contraste real dos elementos
      // Simular verificação para demonstração
      const textContrast = 4.8;
      const backgroundContrast = 4.2;
      const uiContrast = 4.5;
      
      const average = (textContrast + backgroundContrast + uiContrast) / 3;
      
      return {
        text: textContrast,
        background: backgroundContrast,
        ui: uiContrast,
        average,
      };
      
    } catch (error) {
      console.error('Erro ao verificar contraste:', error);
      return { text: 0, background: 0, ui: 0, average: 0 };
    }
  }

  // Verificar conformidade de áreas de toque
  private async checkTouchTargetCompliance(): Promise<{ compliant: number; nonCompliant: number; percentage: number }> {
    try {
      // Em produção, verificar tamanhos reais dos elementos
      // Simular verificação para demonstração
      const compliant = 85;
      const nonCompliant = 15;
      const total = compliant + nonCompliant;
      const percentage = (compliant / total) * 100;
      
      return { compliant, nonCompliant, percentage };
      
    } catch (error) {
      console.error('Erro ao verificar áreas de toque:', error);
      return { compliant: 0, nonCompliant: 0, percentage: 0 };
    }
  }

  // Verificar conformidade de tipografia
  private async checkTypographyCompliance(): Promise<{ compliant: number; nonCompliant: number; percentage: number }> {
    try {
      // Em produção, verificar tamanhos reais das fontes
      // Simular verificação para demonstração
      const compliant = 92;
      const nonCompliant = 8;
      const total = compliant + nonCompliant;
      const percentage = (compliant / total) * 100;
      
      return { compliant, nonCompliant, percentage };
      
    } catch (error) {
      console.error('Erro ao verificar tipografia:', error);
      return { compliant: 0, nonCompliant: 0, percentage: 0 };
    }
  }

  // Verificar conformidade de navegação
  private async checkNavigationCompliance(): Promise<{ supported: number; notSupported: number; percentage: number }> {
    try {
      // Em produção, verificar suporte real à navegação
      // Simular verificação para demonstração
      const supported = 78;
      const notSupported = 22;
      const total = supported + notSupported;
      const percentage = (supported / total) * 100;
      
      return { supported, notSupported, percentage };
      
    } catch (error) {
      console.error('Erro ao verificar navegação:', error);
      return { supported: 0, notSupported: 0, percentage: 0 };
    }
  }

  // Calcular score geral
  private calculateOverallScore(
    contrast: any,
    touch: any,
    typography: any,
    navigation: any
  ): number {
    try {
      // Pesos para cada categoria
      const weights = {
        contrast: 0.3,
        touch: 0.25,
        typography: 0.25,
        navigation: 0.2,
      };
      
      // Scores normalizados (0-100)
      const contrastScore = Math.min(100, (contrast.average / ACCESSIBILITY_CONFIG.contrastRatios.normal) * 100);
      const touchScore = touch.percentage;
      const typographyScore = typography.percentage;
      const navigationScore = navigation.percentage;
      
      // Score ponderado
      const overallScore = 
        contrastScore * weights.contrast +
        touchScore * weights.touch +
        typographyScore * weights.typography +
        navigationScore * weights.navigation;
      
      return Math.round(overallScore);
      
    } catch (error) {
      console.error('Erro ao calcular score geral:', error);
      return 0;
    }
  }

  // Determinar nível WCAG
  private determineWCAGLevel(score: number): 'A' | 'AA' | 'AAA' | 'Non-Compliant' {
    if (score >= 95) return 'AAA';
    if (score >= 85) return 'AA';
    if (score >= 70) return 'A';
    return 'Non-Compliant';
  }

  // Gerar lista de problemas
  private generateIssues(
    contrast: any,
    touch: any,
    typography: any,
    navigation: any
  ): AccessibilityMetrics['issues'] {
    const issues: AccessibilityMetrics['issues'] = [];
    
    // Problemas de contraste
    if (contrast.average < ACCESSIBILITY_CONFIG.contrastRatios.normal) {
      issues.push({
        type: 'contrast',
        severity: contrast.average < 3.0 ? 'critical' : 'high',
        description: `Contraste insuficiente: ${contrast.average.toFixed(2)}:1`,
        recommendation: 'Aumentar contraste entre texto e fundo para atender WCAG AA',
      });
    }
    
    // Problemas de áreas de toque
    if (touch.percentage < 90) {
      issues.push({
        type: 'size',
        severity: touch.percentage < 70 ? 'high' : 'medium',
        description: `${touch.nonCompliant} elementos com áreas de toque insuficientes`,
        recommendation: 'Garantir mínimo de 44x44pt para todos os elementos interativos',
      });
    }
    
    // Problemas de tipografia
    if (typography.percentage < 90) {
      issues.push({
        type: 'typography',
        severity: typography.percentage < 70 ? 'high' : 'medium',
        description: `${typography.nonCompliant} elementos com tipografia inadequada`,
        recommendation: 'Usar tamanhos de fonte mínimos de 12pt e suportar Dynamic Type',
      });
    }
    
    // Problemas de navegação
    if (navigation.percentage < 80) {
      issues.push({
        type: 'navigation',
        severity: navigation.percentage < 60 ? 'high' : 'medium',
        description: `${navigation.notSupported} elementos sem suporte à navegação por teclado`,
        recommendation: 'Implementar navegação por teclado para todos os elementos interativos',
      });
    }
    
    return issues;
  }

  // Obter métricas históricas
  public getMetricsHistory(): AccessibilityMetrics[] {
    return [...this.metrics];
  }

  // Limpar métricas antigas
  public clearOldMetrics(maxAge: number = 30 * 24 * 60 * 60 * 1000): number {
    try {
      const cutoffTime = Date.now() - maxAge;
      const initialCount = this.metrics.length;
      
      this.metrics = this.metrics.filter(metric => 
        new Date(metric.lastUpdated || Date.now()).getTime() > cutoffTime
      );
      
      const removedCount = initialCount - this.metrics.length;
      console.log(`🧹 ${removedCount} métricas antigas removidas`);
      
      return removedCount;
      
    } catch (error) {
      console.error('Erro ao limpar métricas antigas:', error);
      return 0;
    }
  }

  // Parar serviço
  public stop(): void {
    try {
      if (this.accessibilityChangeListener) {
        this.accessibilityChangeListener.remove();
        this.accessibilityChangeListener = null;
      }
      
      console.log('🛑 Serviço de acessibilidade parado');
      
    } catch (error) {
      console.error('Erro ao parar serviço:', error);
    }
  }
}

// Instância singleton do serviço
const accessibilityService = new AccessibilityService();

// Exportar funções públicas
export const updateAccessibilitySettings = (settings: Partial<AccessibilitySettings>) => 
  accessibilityService.updateSettings(settings);
export const getAccessibilitySettings = () => accessibilityService.getSettings();
export const checkWCAGCompliance = () => accessibilityService.checkWCAGCompliance();
export const getMetricsHistory = () => accessibilityService.getMetricsHistory();
export const clearOldMetrics = (maxAge?: number) => accessibilityService.clearOldMetrics(maxAge);
export const stopAccessibilityService = () => accessibilityService.stop();

export default accessibilityService;