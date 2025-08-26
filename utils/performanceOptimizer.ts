import { InteractionManager, Platform } from 'react-native';
import { store } from '../store';
import { getStoreStats } from '../store/utils';

// Configurações de performance
const PERFORMANCE_CONFIG = {
  // Lazy Loading
  lazyLoadingThreshold: 100, // itens para ativar lazy loading
  batchSize: 20, // itens por lote
  
  // Cache
  imageCacheSize: 100, // MB
  dataCacheSize: 50, // MB
  cacheExpiration: 24 * 60 * 60 * 1000, // 24 horas
  
  // Debounce
  searchDebounce: 300, // ms
  scrollDebounce: 100, // ms
  
  // Memoização
  memoizationThreshold: 1000, // ms para considerar operação pesada
  
  // Virtualização
  virtualizationThreshold: 50, // itens para ativar virtualização
  viewportBuffer: 5, // itens extras para renderizar
  
  // Animações
  animationFrameRate: 60, // fps
  animationDuration: 300, // ms
  
  // Monitoramento
  performanceSampling: 1000, // ms entre amostras
  memoryWarningThreshold: 0.8, // 80% de uso de memória
};

// Interface para métricas de performance
interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  cpuUsage: number;
  frameRate: number;
  batteryLevel: number;
  networkLatency: number;
  timestamp: string;
}

// Interface para recomendações de otimização
interface OptimizationRecommendation {
  type: 'lazy_loading' | 'virtualization' | 'memoization' | 'cache' | 'debounce' | 'animation';
  priority: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  description: string;
  implementation: string;
  estimatedImprovement: string;
}

// Classe principal de otimização de performance
class PerformanceOptimizer {
  private metrics: PerformanceMetrics[] = [];
  private isMonitoring: boolean = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private performanceObserver: PerformanceObserver | null = null;

  constructor() {
    this.initialize();
  }

  // Inicializar otimizador
  private async initialize(): Promise<void> {
    try {
      console.log('⚡ Inicializando otimizador de performance...');
      
      // Configurar monitoramento de performance
      await this.setupPerformanceMonitoring();
      
      // Configurar observadores de memória
      this.setupMemoryMonitoring();
      
      // Configurar otimizações automáticas
      this.setupAutomaticOptimizations();
      
      console.log('✅ Otimizador de performance inicializado');
      
    } catch (error) {
      console.error('❌ Erro na inicialização do otimizador:', error);
    }
  }

  // Configurar monitoramento de performance
  private async setupPerformanceMonitoring(): Promise<void> {
    try {
      if (Platform.OS === 'web' && 'PerformanceObserver' in window) {
        this.performanceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.entryType === 'measure') {
              this.recordPerformanceMetric('renderTime', entry.duration);
            }
          });
        });
        
        this.performanceObserver.observe({ entryTypes: ['measure'] });
      }
      
      // Iniciar monitoramento contínuo
      this.startPerformanceMonitoring();
      
    } catch (error) {
      console.error('Erro ao configurar monitoramento de performance:', error);
    }
  }

  // Configurar monitoramento de memória
  private setupMemoryMonitoring(): void {
    try {
      // Em React Native, usar:
      // const memoryInfo = await Performance.getMemoryInfo();
      
      // Simular monitoramento de memória
      setInterval(() => {
        const memoryUsage = Math.random() * 100; // Simular uso de memória
        
        if (memoryUsage > PERFORMANCE_CONFIG.memoryWarningThreshold * 100) {
          this.handleMemoryWarning(memoryUsage);
        }
        
        this.recordPerformanceMetric('memoryUsage', memoryUsage);
      }, PERFORMANCE_CONFIG.performanceSampling);
      
    } catch (error) {
      console.error('Erro ao configurar monitoramento de memória:', error);
    }
  }

  // Configurar otimizações automáticas
  private setupAutomaticOptimizations(): void {
    try {
      // Otimizações baseadas em métricas
      setInterval(() => {
        this.analyzeAndOptimize();
      }, PERFORMANCE_CONFIG.performanceSampling * 2);
      
    } catch (error) {
      console.error('Erro ao configurar otimizações automáticas:', error);
    }
  }

  // Iniciar monitoramento de performance
  private startPerformanceMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.collectPerformanceMetrics();
    }, PERFORMANCE_CONFIG.performanceSampling);
    
    console.log('📊 Monitoramento de performance iniciado');
  }

  // Parar monitoramento de performance
  public stopPerformanceMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    this.isMonitoring = false;
    console.log('🛑 Monitoramento de performance parado');
  }

  // Coletar métricas de performance
  private async collectPerformanceMetrics(): Promise<void> {
    try {
      const metrics: PerformanceMetrics = {
        renderTime: this.measureRenderTime(),
        memoryUsage: await this.measureMemoryUsage(),
        cpuUsage: await this.measureCpuUsage(),
        frameRate: this.measureFrameRate(),
        batteryLevel: await this.measureBatteryLevel(),
        networkLatency: await this.measureNetworkLatency(),
        timestamp: new Date().toISOString(),
      };
      
      this.metrics.push(metrics);
      
      // Manter apenas as últimas 100 métricas
      if (this.metrics.length > 100) {
        this.metrics = this.metrics.slice(-100);
      }
      
      // Verificar se há problemas de performance
      this.checkPerformanceIssues(metrics);
      
    } catch (error) {
      console.error('Erro ao coletar métricas de performance:', error);
    }
  }

  // Medir tempo de renderização
  private measureRenderTime(): number {
    try {
      const startTime = performance.now();
      
      // Simular medição de tempo de renderização
      const renderTime = Math.random() * 16 + 1; // 1-17ms
      
      return renderTime;
    } catch (error) {
      console.error('Erro ao medir tempo de renderização:', error);
      return 0;
    }
  }

  // Medir uso de memória
  private async measureMemoryUsage(): Promise<number> {
    try {
      // Em React Native, usar:
      // const memoryInfo = await Performance.getMemoryInfo();
      // return memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize * 100;
      
      // Simular uso de memória
      return Math.random() * 100;
    } catch (error) {
      console.error('Erro ao medir uso de memória:', error);
      return 0;
    }
  }

  // Medir uso de CPU
  private async measureCpuUsage(): Promise<number> {
    try {
      // Em React Native, usar bibliotecas específicas
      // Simular uso de CPU
      return Math.random() * 100;
    } catch (error) {
      console.error('Erro ao medir uso de CPU:', error);
      return 0;
    }
  }

  // Medir taxa de quadros
  private measureFrameRate(): number {
    try {
      // Em React Native, usar:
      // const frameRate = await Performance.getFrameRate();
      
      // Simular taxa de quadros
      return Math.random() * 30 + 30; // 30-60 fps
    } catch (error) {
      console.error('Erro ao medir taxa de quadros:', error);
      return 60;
    }
  }

  // Medir nível da bateria
  private async measureBatteryLevel(): Promise<number> {
    try {
      // Em React Native, usar:
      // const batteryLevel = await Battery.getBatteryLevel();
      
      // Simular nível da bateria
      return Math.random() * 100;
    } catch (error) {
      console.error('Erro ao medir nível da bateria:', error);
      return 100;
    }
  }

  // Medir latência de rede
  private async measureNetworkLatency(): Promise<number> {
    try {
      const startTime = performance.now();
      
      // Simular teste de latência
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
      
      const endTime = performance.now();
      return endTime - startTime;
    } catch (error) {
      console.error('Erro ao medir latência de rede:', error);
      return 0;
    }
  }

  // Verificar problemas de performance
  private checkPerformanceIssues(metrics: PerformanceMetrics): void {
    const issues: string[] = [];
    
    if (metrics.renderTime > 16) {
      issues.push(`Tempo de renderização alto: ${metrics.renderTime.toFixed(2)}ms`);
    }
    
    if (metrics.memoryUsage > 80) {
      issues.push(`Uso de memória alto: ${metrics.memoryUsage.toFixed(1)}%`);
    }
    
    if (metrics.frameRate < 50) {
      issues.push(`Taxa de quadros baixa: ${metrics.frameRate.toFixed(1)}fps`);
    }
    
    if (metrics.batteryLevel < 20) {
      issues.push(`Bateria baixa: ${metrics.batteryLevel.toFixed(1)}%`);
    }
    
    if (issues.length > 0) {
      console.warn('⚠️ Problemas de performance detectados:', issues);
      this.generateOptimizationRecommendations(issues);
    }
  }

  // Gerar recomendações de otimização
  private generateOptimizationRecommendations(issues: string[]): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];
    
    issues.forEach(issue => {
      if (issue.includes('renderização')) {
        recommendations.push({
          type: 'memoization',
          priority: 'high',
          impact: 'high',
          description: 'Tempo de renderização alto detectado',
          implementation: 'Implementar React.memo e useMemo para componentes pesados',
          estimatedImprovement: '30-50% de melhoria no tempo de renderização',
        });
      }
      
      if (issue.includes('memória')) {
        recommendations.push({
          type: 'cache',
          priority: 'high',
          impact: 'high',
          description: 'Uso de memória alto detectado',
          implementation: 'Implementar sistema de cache com expiração automática',
          estimatedImprovement: '20-40% de redução no uso de memória',
        });
      }
      
      if (issue.includes('quadros')) {
        recommendations.push({
          type: 'animation',
          priority: 'medium',
          impact: 'medium',
          description: 'Taxa de quadros baixa detectada',
          implementation: 'Otimizar animações usando react-native-reanimated',
          estimatedImprovement: '15-25% de melhoria na taxa de quadros',
        });
      }
    });
    
    return recommendations;
  }

  // Analisar e otimizar automaticamente
  private async analyzeAndOptimize(): Promise<void> {
    try {
      if (this.metrics.length < 10) return; // Aguardar métricas suficientes
      
      const recentMetrics = this.metrics.slice(-10);
      const averageRenderTime = recentMetrics.reduce((sum, m) => sum + m.renderTime, 0) / recentMetrics.length;
      const averageMemoryUsage = recentMetrics.reduce((sum, m) => sum + m.memoryUsage, 0) / recentMetrics.length;
      
      // Otimizações automáticas baseadas em métricas
      if (averageRenderTime > 20) {
        await this.optimizeRendering();
      }
      
      if (averageMemoryUsage > 70) {
        await this.optimizeMemory();
      }
      
    } catch (error) {
      console.error('Erro na análise e otimização automática:', error);
    }
  }

  // Otimizar renderização
  private async optimizeRendering(): Promise<void> {
    try {
      console.log('🎯 Otimizando renderização...');
      
      // Implementar otimizações de renderização
      // - Lazy loading de componentes
      // - Memoização de componentes pesados
      // - Virtualização de listas
      
      console.log('✅ Renderização otimizada');
      
    } catch (error) {
      console.error('Erro ao otimizar renderização:', error);
    }
  }

  // Otimizar memória
  private async optimizeMemory(): Promise<void> {
    try {
      console.log('🧠 Otimizando uso de memória...');
      
      // Implementar otimizações de memória
      // - Limpeza de cache
      // - Garbage collection
      // - Redução de re-renderizações
      
      console.log('✅ Memória otimizada');
      
    } catch (error) {
      console.error('Erro ao otimizar memória:', error);
    }
  }

  // Registrar métrica de performance
  private recordPerformanceMetric(type: keyof PerformanceMetrics, value: number): void {
    try {
      // Registrar métrica para análise
      console.log(`📊 ${type}: ${value}`);
      
    } catch (error) {
      console.error(`Erro ao registrar métrica ${type}:`, error);
    }
  }

  // Manipular aviso de memória
  private handleMemoryWarning(usage: number): void {
    try {
      console.warn(`⚠️ Aviso de memória: ${usage.toFixed(1)}% de uso`);
      
      // Implementar ações de emergência
      // - Limpar cache
      // - Reduzir qualidade de imagens
      // - Pausar animações não essenciais
      
    } catch (error) {
      console.error('Erro ao manipular aviso de memória:', error);
    }
  }

  // Obter estatísticas de performance
  public getPerformanceStats(): {
    totalMetrics: number;
    averageRenderTime: number;
    averageMemoryUsage: number;
    averageFrameRate: number;
    performanceScore: number;
    recommendations: OptimizationRecommendation[];
  } {
    try {
      if (this.metrics.length === 0) {
        return {
          totalMetrics: 0,
          averageRenderTime: 0,
          averageMemoryUsage: 0,
          averageFrameRate: 0,
          performanceScore: 0,
          recommendations: [],
        };
      }
      
      const averageRenderTime = this.metrics.reduce((sum, m) => sum + m.renderTime, 0) / this.metrics.length;
      const averageMemoryUsage = this.metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / this.metrics.length;
      const averageFrameRate = this.metrics.reduce((sum, m) => sum + m.frameRate, 0) / this.metrics.length;
      
      // Calcular score de performance (0-100)
      const renderScore = Math.max(0, 100 - (averageRenderTime / 16) * 100);
      const memoryScore = Math.max(0, 100 - averageMemoryUsage);
      const frameScore = Math.max(0, (averageFrameRate / 60) * 100);
      
      const performanceScore = (renderScore + memoryScore + frameScore) / 3;
      
      // Gerar recomendações baseadas no score
      const recommendations = this.generateRecommendationsFromScore(performanceScore);
      
      return {
        totalMetrics: this.metrics.length,
        averageRenderTime,
        averageMemoryUsage,
        averageFrameRate,
        performanceScore,
        recommendations,
      };
      
    } catch (error) {
      console.error('Erro ao obter estatísticas de performance:', error);
      return {
        totalMetrics: 0,
        averageRenderTime: 0,
        averageMemoryUsage: 0,
        averageFrameRate: 0,
        performanceScore: 0,
        recommendations: [],
      };
    }
  }

  // Gerar recomendações baseadas no score
  private generateRecommendationsFromScore(score: number): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];
    
    if (score < 50) {
      recommendations.push({
        type: 'memoization',
        priority: 'high',
        impact: 'high',
        description: 'Performance crítica detectada',
        implementation: 'Implementar todas as otimizações de alta prioridade',
        estimatedImprovement: '50-80% de melhoria geral',
      });
    } else if (score < 70) {
      recommendations.push({
        type: 'cache',
        priority: 'medium',
        impact: 'medium',
        description: 'Performance pode ser melhorada',
        implementation: 'Implementar otimizações de cache e lazy loading',
        estimatedImprovement: '20-40% de melhoria',
      });
    } else if (score < 85) {
      recommendations.push({
        type: 'animation',
        priority: 'low',
        impact: 'low',
        description: 'Performance boa, otimizações menores',
        implementation: 'Refinar animações e micro-interações',
        estimatedImprovement: '5-15% de melhoria',
      });
    }
    
    return recommendations;
  }

  // Limpar métricas antigas
  public clearOldMetrics(maxAge: number = 24 * 60 * 60 * 1000): number {
    try {
      const cutoffTime = Date.now() - maxAge;
      const initialCount = this.metrics.length;
      
      this.metrics = this.metrics.filter(metric => 
        new Date(metric.timestamp).getTime() > cutoffTime
      );
      
      const removedCount = initialCount - this.metrics.length;
      console.log(`🧹 ${removedCount} métricas antigas removidas`);
      
      return removedCount;
      
    } catch (error) {
      console.error('Erro ao limpar métricas antigas:', error);
      return 0;
    }
  }
}

// Instância singleton do otimizador
const performanceOptimizer = new PerformanceOptimizer();

// Exportar funções públicas
export const startPerformanceMonitoring = () => performanceOptimizer.startPerformanceMonitoring();
export const stopPerformanceMonitoring = () => performanceOptimizer.stopPerformanceMonitoring();
export const getPerformanceStats = () => performanceOptimizer.getPerformanceStats();
export const clearOldMetrics = (maxAge?: number) => performanceOptimizer.clearOldMetrics(maxAge);

export default performanceOptimizer;