let Sensors: any = null;
try { Sensors = require('expo-sensors'); } catch {}

export interface BiomechanicsData {
  id: string;
  userId: string;
  timestamp: number;
  sessionId: string;
  
  // Dados do acelerômetro
  accelerometer: {
    x: number;
    y: number;
    z: number;
    magnitude: number;
  };
  
  // Dados do giroscópio
  gyroscope: {
    x: number;
    y: number;
    z: number;
    magnitude: number;
  };
  
  // Dados do magnetômetro (bússola)
  magnetometer: {
    x: number;
    y: number;
    z: number;
    heading: number;
  };
  
  // Dados do GPS
  gps: {
    latitude: number;
    longitude: number;
    altitude: number;
    accuracy: number;
    speed: number;
    bearing: number;
  };
  
  // Dados calculados
  calculated: {
    cadence: number; // passos por minuto
    strideLength: number; // comprimento da passada em metros
    groundContactTime: number; // tempo de contato com o solo em ms
    verticalOscillation: number; // oscilação vertical em cm
    pronation: 'supination' | 'neutral' | 'pronation';
    symmetry: number; // simetria entre pernas (0-100%)
    impactForce: number; // força de impacto em G
    runningEfficiency: number; // eficiência geral (0-100%)
    fatigueIndex: number; // índice de fadiga (0-100%)
  };
  
  // Análise de padrões
  patterns: {
    footStrike: 'heel' | 'midfoot' | 'forefoot';
    runningStyle: 'efficient' | 'moderate' | 'inefficient';
    riskFactors: string[];
    recommendations: string[];
  };
}

export interface BiomechanicsSession {
  id: string;
  userId: string;
  startTime: number;
  endTime?: number;
  duration: number; // segundos
  totalSteps: number;
  averageCadence: number;
  averageStrideLength: number;
  averageGroundContactTime: number;
  averageVerticalOscillation: number;
  averageSymmetry: number;
  averageEfficiency: number;
  fatigueProgression: number[];
  biomechanicsScore: number; // 0-100
  improvementAreas: string[];
  strengths: string[];
}

export interface BiomechanicsAnalysis {
  overallScore: number; // 0-100
  categoryScores: {
    cadence: number;
    stride: number;
    symmetry: number;
    efficiency: number;
    impact: number;
  };
  trends: {
    cadence: 'improving' | 'stable' | 'declining';
    symmetry: 'improving' | 'stable' | 'declining';
    efficiency: 'improving' | 'stable' | 'declining';
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  riskAssessment: {
    injuryRisk: 'low' | 'medium' | 'high';
    riskFactors: string[];
    preventionTips: string[];
  };
}

export interface BiomechanicsProfile {
  userId: string;
  experience: number; // meses
  preferredDistance: number; // km
  runningStyle: 'speed' | 'endurance' | 'trail' | 'mixed';
  biomechanicsHistory: BiomechanicsSession[];
  personalBests: {
    bestCadence: number;
    bestSymmetry: number;
    bestEfficiency: number;
    bestStrideLength: number;
  };
  improvementGoals: string[];
  lastAnalysis: number;
}

export class BiomechanicsAnalyzer {
  private sessions: BiomechanicsSession[] = [];
  private profiles: BiomechanicsProfile[] = [];
  private calibrationData: Map<string, any> = new Map();
  private algorithms: any = {};

  constructor() {
    this.initializeAlgorithms();
  }

  private initializeAlgorithms() {
    // Algoritmos de análise biomecânica
    this.algorithms = {
      // Detecção de passos usando acelerômetro
      stepDetection: {
        threshold: 1.2, // G
        minInterval: 200, // ms
        smoothingFactor: 0.8
      },
      
      // Cálculo de cadência
      cadenceCalculation: {
        windowSize: 10, // passos
        minSteps: 5
      },
      
      // Análise de simetria
      symmetryAnalysis: {
        leftRightThreshold: 0.15, // 15% de diferença
        temporalThreshold: 0.1 // 10% de diferença temporal
      },
      
      // Detecção de fadiga
      fatigueDetection: {
        cadenceDecline: 0.1, // 10% de declínio
        symmetryDecline: 0.2, // 20% de declínio
        efficiencyDecline: 0.15 // 15% de declínio
      }
    };
  }

  // Iniciar análise biomecânica
  public startBiomechanicsAnalysis(userId: string): string {
    const sessionId = `biomech_${Date.now()}`;
    
    const session: BiomechanicsSession = {
      id: sessionId,
      userId,
      startTime: Date.now(),
      duration: 0,
      totalSteps: 0,
      averageCadence: 0,
      averageStrideLength: 0,
      averageGroundContactTime: 0,
      averageVerticalOscillation: 0,
      averageSymmetry: 0,
      averageEfficiency: 0,
      fatigueProgression: [],
      biomechanicsScore: 0,
      improvementAreas: [],
      strengths: []
    };

    this.sessions.push(session);
    return sessionId;
  }

  // Processar dados de sensores em tempo real
  public processSensorData(
    sessionId: string,
    accelerometer: { x: number; y: number; z: number },
    gyroscope: { x: number; y: number; z: number },
    magnetometer: { x: number; y: number; z: number; heading: number },
    gps: { latitude: number; longitude: number; altitude: number; accuracy: number; speed: number; bearing: number }
  ): BiomechanicsData {
    const session = this.sessions.find(s => s.id === sessionId);
    if (!session) throw new Error('Sessão não encontrada');

    // Calcular magnitude dos sensores
    const accMagnitude = Math.sqrt(accelerometer.x ** 2 + accelerometer.y ** 2 + accelerometer.z ** 2);
    const gyroMagnitude = Math.sqrt(gyroscope.x ** 2 + gyroscope.y ** 2 + gyroscope.z ** 2);

    // Detectar passos
    const stepDetected = this.detectStep(accMagnitude, session);
    
    // Calcular métricas biomecânicas
    const calculated = this.calculateBiomechanics(
      accelerometer,
      gyroscope,
      magnetometer,
      gps,
      session
    );

    // Analisar padrões
    const patterns = this.analyzePatterns(calculated, session);

    const biomechanicsData: BiomechanicsData = {
      id: `data_${Date.now()}`,
      userId: session.userId,
      timestamp: Date.now(),
      sessionId,
      accelerometer: { ...accelerometer, magnitude: accMagnitude },
      gyroscope: { ...gyroscope, magnitude: gyroMagnitude },
      magnetometer,
      gps,
      calculated,
      patterns
    };

    // Atualizar sessão
    if (stepDetected) {
      session.totalSteps++;
      this.updateSessionMetrics(session, calculated);
    }

    return biomechanicsData;
  }

  // Detectar passos usando acelerômetro
  private detectStep(accMagnitude: number, session: BiomechanicsSession): boolean {
    const threshold = this.algorithms.stepDetection.threshold;
    const minInterval = this.algorithms.stepDetection.minInterval;
    
    // Verificar se a magnitude excede o threshold
    if (accMagnitude < threshold) return false;
    
    // Verificar intervalo mínimo entre passos
    const now = Date.now();
    const lastStepTime = session.lastStepTime || 0;
    
    if (now - lastStepTime < minInterval) return false;
    
    // Passo detectado
    session.lastStepTime = now;
    return true;
  }

  // Calcular métricas biomecânicas
  private calculateBiomechanics(
    accelerometer: { x: number; y: number; z: number },
    gyroscope: { x: number; y: number; z: number },
    magnetometer: { x: number; y: number; z: number; heading: number },
    gps: { latitude: number; longitude: number; altitude: number; accuracy: number; speed: number; bearing: number },
    session: BiomechanicsSession
  ) {
    // Calcular cadência (passos por minuto)
    const cadence = this.calculateCadence(session);
    
    // Calcular comprimento da passada
    const strideLength = this.calculateStrideLength(gps.speed, cadence);
    
    // Calcular tempo de contato com o solo
    const groundContactTime = this.calculateGroundContactTime(accelerometer, gyroscope);
    
    // Calcular oscilação vertical
    const verticalOscillation = this.calculateVerticalOscillation(accelerometer, gps);
    
    // Determinar tipo de pronação
    const pronation = this.determinePronation(accelerometer, gyroscope);
    
    // Calcular simetria
    const symmetry = this.calculateSymmetry(accelerometer, gyroscope, session);
    
    // Calcular força de impacto
    const impactForce = this.calculateImpactForce(accelerometer);
    
    // Calcular eficiência de corrida
    const runningEfficiency = this.calculateRunningEfficiency(
      cadence,
      strideLength,
      groundContactTime,
      verticalOscillation,
      symmetry
    );
    
    // Calcular índice de fadiga
    const fatigueIndex = this.calculateFatigueIndex(session);

    return {
      cadence,
      strideLength,
      groundContactTime,
      verticalOscillation,
      pronation,
      symmetry,
      impactForce,
      runningEfficiency,
      fatigueIndex
    };
  }

  // Calcular cadência
  private calculateCadence(session: BiomechanicsSession): number {
    const windowSize = this.algorithms.cadenceCalculation.windowSize;
    const minSteps = this.algorithms.cadenceCalculation.minSteps;
    
    if (session.totalSteps < minSteps) return 0;
    
    // Usar janela deslizante para calcular cadência
    const recentSteps = session.recentSteps || [];
    const now = Date.now();
    
    // Adicionar passo atual
    recentSteps.push(now);
    
    // Manter apenas passos da janela de tempo (últimos 60 segundos)
    const timeWindow = 60000; // 60 segundos
    const filteredSteps = recentSteps.filter(time => now - time <= timeWindow);
    
    // Calcular cadência
    const stepsInWindow = filteredSteps.length;
    const cadence = (stepsInWindow / 60) * 60; // passos por minuto
    
    // Atualizar sessão
    session.recentSteps = filteredSteps;
    
    return Math.round(cadence);
  }

  // Calcular comprimento da passada
  private calculateStrideLength(speed: number, cadence: number): number {
    if (cadence === 0) return 0;
    
    // Fórmula: stride length = speed / (cadence / 60)
    const strideLength = speed / (cadence / 60);
    
    // Limitar valores realistas (0.5m a 2.5m)
    return Math.max(0.5, Math.min(2.5, strideLength));
  }

  // Calcular tempo de contato com o solo
  private calculateGroundContactTime(
    accelerometer: { x: number; y: number; z: number },
    gyroscope: { x: number; y: number; z: number }
  ): number {
    // Usar padrões de aceleração e rotação para estimar tempo de contato
    const accMagnitude = Math.sqrt(accelerometer.x ** 2 + accelerometer.y ** 2 + accelerometer.z ** 2);
    const gyroMagnitude = Math.sqrt(gyroscope.x ** 2 + gyroscope.y ** 2 + gyroscope.z ** 2);
    
    // Padrão típico: alta aceleração + baixa rotação = contato com solo
    if (accMagnitude > 2.0 && gyroMagnitude < 0.5) {
      // Estimativa baseada em padrões de corrida
      return 200 + Math.random() * 100; // 200-300ms
    }
    
    return 250; // valor padrão
  }

  // Calcular oscilação vertical
  private calculateVerticalOscillation(
    accelerometer: { x: number; y: number; z: number },
    gps: { altitude: number }
  ): number {
    // Usar componente Z do acelerômetro para estimar movimento vertical
    const verticalAcc = Math.abs(accelerometer.z);
    
    // Converter para centímetros (aproximação)
    const oscillation = (verticalAcc / 9.81) * 100; // 9.81 m/s² = 1G
    
    // Limitar valores realistas (5cm a 20cm)
    return Math.max(5, Math.min(20, oscillation));
  }

  // Determinar tipo de pronação
  private determinePronation(
    accelerometer: { x: number; y: number; z: number },
    gyroscope: { x: number; y: number; z: number }
  ): 'supination' | 'neutral' | 'pronation' {
    // Usar padrões de aceleração lateral para determinar pronação
    const lateralAcc = Math.abs(accelerometer.x);
    const lateralGyro = Math.abs(gyroscope.x);
    
    // Padrões baseados em dados biomecânicos reais
    if (lateralAcc > 1.5 && lateralGyro > 0.8) {
      return 'pronation'; // Movimento lateral excessivo
    } else if (lateralAcc < 0.8 && lateralGyro < 0.4) {
      return 'supination'; // Movimento lateral mínimo
    } else {
      return 'neutral'; // Movimento lateral moderado
    }
  }

  // Calcular simetria entre pernas
  private calculateSymmetry(
    accelerometer: { x: number; y: number; z: number },
    gyroscope: { x: number; y: number; z: number },
    session: BiomechanicsSession
  ): number {
    const threshold = this.algorithms.symmetryAnalysis.leftRightThreshold;
    
    // Analisar padrões de movimento para detectar assimetrias
    const leftPatterns = session.leftLegPatterns || [];
    const rightPatterns = session.rightLegPatterns || [];
    
    // Adicionar padrões atuais
    const currentPattern = {
      acc: accelerometer,
      gyro: gyroscope,
      timestamp: Date.now()
    };
    
    // Alternar entre pernas (simulação)
    if (session.totalSteps % 2 === 0) {
      leftPatterns.push(currentPattern);
    } else {
      rightPatterns.push(currentPattern);
    }
    
    // Manter apenas padrões recentes
    const timeWindow = 10000; // 10 segundos
    const now = Date.now();
    session.leftLegPatterns = leftPatterns.filter(p => now - p.timestamp <= timeWindow);
    session.rightLegPatterns = rightPatterns.filter(p => now - p.timestamp <= timeWindow);
    
    // Calcular simetria baseada na diferença entre padrões
    if (session.leftLegPatterns.length < 3 || session.rightLegPatterns.length < 3) {
      return 85; // valor padrão até ter dados suficientes
    }
    
    const leftAvg = this.calculateAveragePattern(session.leftLegPatterns);
    const rightAvg = this.calculateAveragePattern(session.rightLegPatterns);
    
    const difference = Math.abs(leftAvg - rightAvg) / Math.max(leftAvg, rightAvg);
    const symmetry = Math.max(0, 100 - (difference * 100));
    
    return Math.round(symmetry);
  }

  // Calcular padrão médio
  private calculateAveragePattern(patterns: any[]): number {
    if (patterns.length === 0) return 0;
    
    const totalMagnitude = patterns.reduce((sum, p) => {
      const accMag = Math.sqrt(p.acc.x ** 2 + p.acc.y ** 2 + p.acc.z ** 2);
      const gyroMag = Math.sqrt(p.gyro.x ** 2 + p.gyro.y ** 2 + p.gyro.z ** 2);
      return sum + accMag + gyroMag;
    }, 0);
    
    return totalMagnitude / patterns.length;
  }

  // Calcular força de impacto
  private calculateImpactForce(accelerometer: { x: number; y: number; z: number }): number {
    // Usar picos de aceleração para estimar força de impacto
    const magnitude = Math.sqrt(accelerometer.x ** 2 + accelerometer.y ** 2 + accelerometer.z ** 2);
    
    // Converter para G (1G = 9.81 m/s²)
    const impactG = magnitude / 9.81;
    
    // Limitar valores realistas (1G a 5G)
    return Math.max(1, Math.min(5, impactG));
  }

  // Calcular eficiência de corrida
  private calculateRunningEfficiency(
    cadence: number,
    strideLength: number,
    groundContactTime: number,
    verticalOscillation: number,
    symmetry: number
  ): number {
    let efficiency = 100;
    
    // Penalizar cadência muito baixa ou muito alta
    if (cadence < 160) efficiency -= (160 - cadence) * 0.5;
    if (cadence > 190) efficiency -= (cadence - 190) * 0.3;
    
    // Penalizar passada muito longa
    if (strideLength > 1.8) efficiency -= (strideLength - 1.8) * 20;
    
    // Penalizar tempo de contato excessivo
    if (groundContactTime > 300) efficiency -= (groundContactTime - 300) * 0.1;
    
    // Penalizar oscilação vertical excessiva
    if (verticalOscillation > 12) efficiency -= (verticalOscillation - 12) * 2;
    
    // Penalizar assimetria
    efficiency -= (100 - symmetry) * 0.3;
    
    return Math.max(0, Math.round(efficiency));
  }

  // Calcular índice de fadiga
  private calculateFatigueIndex(session: BiomechanicsSession): number {
    if (session.totalSteps < 10) return 0;
    
    // Analisar tendências de declínio na performance
    const recentEfficiency = session.recentEfficiency || [];
    const recentSymmetry = session.recentSymmetry || [];
    
    if (recentEfficiency.length < 5) return 0;
    
    // Calcular tendência de declínio
    const efficiencyDecline = this.calculateTrend(recentEfficiency);
    const symmetryDecline = this.calculateTrend(recentSymmetry);
    
    // Combinar fatores para calcular fadiga
    let fatigue = 0;
    
    if (efficiencyDecline < -0.1) fatigue += 30;
    if (symmetryDecline < -0.2) fatigue += 25;
    if (session.duration > 3600) fatigue += 20; // +1 hora
    if (session.duration > 7200) fatigue += 25; // +2 horas
    
    return Math.min(100, Math.round(fatigue));
  }

  // Calcular tendência de uma série de valores
  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;
    
    // Regressão linear simples
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    return slope;
  }

  // Analisar padrões de corrida
  private analyzePatterns(calculated: any, session: BiomechanicsSession) {
    const patterns = {
      footStrike: 'midfoot' as any,
      runningStyle: 'moderate' as any,
      riskFactors: [] as string[],
      recommendations: [] as string[]
    };

    // Determinar tipo de pisada
    if (calculated.groundContactTime < 200) {
      patterns.footStrike = 'forefoot';
    } else if (calculated.groundContactTime > 300) {
      patterns.footStrike = 'heel';
    } else {
      patterns.footStrike = 'midfoot';
    }

    // Determinar estilo de corrida
    if (calculated.runningEfficiency >= 85) {
      patterns.runningStyle = 'efficient';
    } else if (calculated.runningEfficiency >= 70) {
      patterns.runningStyle = 'moderate';
    } else {
      patterns.runningStyle = 'inefficient';
    }

    // Identificar fatores de risco
    if (calculated.cadence < 160) {
      patterns.riskFactors.push('Cadência muito baixa');
      patterns.recommendations.push('Aumente a cadência para 170-180 passos/min');
    }
    
    if (calculated.symmetry < 80) {
      patterns.riskFactors.push('Assimetria significativa');
      patterns.recommendations.push('Faça exercícios de fortalecimento unilateral');
    }
    
    if (calculated.impactForce > 3.5) {
      patterns.riskFactors.push('Alto impacto');
      patterns.recommendations.push('Reduza a intensidade e foque na técnica');
    }
    
    if (calculated.verticalOscillation > 15) {
      patterns.riskFactors.push('Oscilação vertical excessiva');
      patterns.recommendations.push('Mantenha o centro de gravidade estável');
    }

    return patterns;
  }

  // Atualizar métricas da sessão
  private updateSessionMetrics(session: BiomechanicsSession, calculated: any) {
    // Atualizar médias usando média móvel
    const alpha = 0.1; // fator de suavização
    
    session.averageCadence = this.updateMovingAverage(session.averageCadence, calculated.cadence, alpha);
    session.averageStrideLength = this.updateMovingAverage(session.averageStrideLength, calculated.strideLength, alpha);
    session.averageGroundContactTime = this.updateMovingAverage(session.averageGroundContactTime, calculated.groundContactTime, alpha);
    session.averageVerticalOscillation = this.updateMovingAverage(session.averageVerticalOscillation, calculated.verticalOscillation, alpha);
    session.averageSymmetry = this.updateMovingAverage(session.averageSymmetry, calculated.symmetry, alpha);
    session.averageEfficiency = this.updateMovingAverage(session.averageEfficiency, calculated.runningEfficiency, alpha);
    
    // Atualizar progressão de fadiga
    session.fatigueProgression.push(calculated.fatigueIndex);
    
    // Manter apenas últimos 20 valores
    if (session.fatigueProgression.length > 20) {
      session.fatigueProgression.shift();
    }
    
    // Atualizar métricas recentes para análise de tendências
    session.recentEfficiency = session.recentEfficiency || [];
    session.recentSymmetry = session.recentSymmetry || [];
    
    session.recentEfficiency.push(calculated.runningEfficiency);
    session.recentSymmetry.push(calculated.symmetry);
    
    // Manter apenas últimos 10 valores
    if (session.recentEfficiency.length > 10) {
      session.recentEfficiency.shift();
    }
    if (session.recentSymmetry.length > 10) {
      session.recentSymmetry.shift();
    }
  }

  // Atualizar média móvel
  private updateMovingAverage(current: number, newValue: number, alpha: number): number {
    return current * (1 - alpha) + newValue * alpha;
  }

  // Finalizar análise biomecânica
  public finishBiomechanicsAnalysis(sessionId: string): BiomechanicsAnalysis {
    const session = this.sessions.find(s => s.id === sessionId);
    if (!session) throw new Error('Sessão não encontrada');

    session.endTime = Date.now();
    session.duration = Math.round((session.endTime - session.startTime) / 1000);
    
    // Calcular score biomecânico geral
    session.biomechanicsScore = this.calculateOverallScore(session);
    
    // Identificar áreas de melhoria e pontos fortes
    this.identifyImprovementAreas(session);
    
    // Gerar análise completa
    return this.generateAnalysis(session);
  }

  // Calcular score geral
  private calculateOverallScore(session: BiomechanicsSession): number {
    const weights = {
      cadence: 0.2,
      stride: 0.15,
      symmetry: 0.25,
      efficiency: 0.3,
      impact: 0.1
    };
    
    const scores = {
      cadence: this.scoreCadence(session.averageCadence),
      stride: this.scoreStrideLength(session.averageStrideLength),
      symmetry: session.averageSymmetry,
      efficiency: session.averageEfficiency,
      impact: this.scoreImpact(session.averageImpactForce || 2.5)
    };
    
    let totalScore = 0;
    Object.keys(weights).forEach(key => {
      totalScore += scores[key as keyof typeof scores] * weights[key as keyof typeof weights];
    });
    
    return Math.round(totalScore);
  }

  // Score de cadência
  private scoreCadence(cadence: number): number {
    if (cadence >= 170 && cadence <= 180) return 100;
    if (cadence >= 165 && cadence <= 185) return 90;
    if (cadence >= 160 && cadence <= 190) return 80;
    if (cadence >= 155 && cadence <= 195) return 70;
    return 50;
  }

  // Score de comprimento da passada
  private scoreStrideLength(strideLength: number): number {
    if (strideLength >= 1.2 && strideLength <= 1.6) return 100;
    if (strideLength >= 1.1 && strideLength <= 1.7) return 90;
    if (strideLength >= 1.0 && strideLength <= 1.8) return 80;
    return 60;
  }

  // Score de impacto
  private scoreImpact(impact: number): number {
    if (impact <= 2.0) return 100;
    if (impact <= 2.5) return 90;
    if (impact <= 3.0) return 80;
    if (impact <= 3.5) return 70;
    return 50;
  }

  // Identificar áreas de melhoria
  private identifyImprovementAreas(session: BiomechanicsSession) {
    session.improvementAreas = [];
    session.strengths = [];
    
    if (session.averageCadence < 170) {
      session.improvementAreas.push('Aumentar cadência para 170-180 passos/min');
    } else {
      session.strengths.push('Cadência ideal mantida');
    }
    
    if (session.averageSymmetry < 85) {
      session.improvementAreas.push('Melhorar simetria entre pernas');
    } else {
      session.strengths.push('Excelente simetria de movimento');
    }
    
    if (session.averageEfficiency < 80) {
      session.improvementAreas.push('Otimizar técnica de corrida');
    } else {
      session.strengths.push('Técnica de corrida eficiente');
    }
    
    if (session.averageVerticalOscillation > 12) {
      session.improvementAreas.push('Reduzir oscilação vertical');
    } else {
      session.strengths.push('Movimento estável e eficiente');
    }
  }

  // Gerar análise completa
  private generateAnalysis(session: BiomechanicsSession): BiomechanicsAnalysis {
    const analysis: BiomechanicsAnalysis = {
      overallScore: session.biomechanicsScore,
      categoryScores: {
        cadence: this.scoreCadence(session.averageCadence),
        stride: this.scoreStrideLength(session.averageStrideLength),
        symmetry: session.averageSymmetry,
        efficiency: session.averageEfficiency,
        impact: this.scoreImpact(session.averageImpactForce || 2.5)
      },
      trends: this.analyzeTrends(session),
      recommendations: this.generateRecommendations(session),
      riskAssessment: this.assessRisks(session)
    };
    
    return analysis;
  }

  // Analisar tendências
  private analyzeTrends(session: BiomechanicsSession) {
    const trends = {
      cadence: 'stable' as any,
      symmetry: 'stable' as any,
      efficiency: 'stable' as any
    };
    
    if (session.recentEfficiency && session.recentEfficiency.length >= 5) {
      const efficiencyTrend = this.calculateTrend(session.recentEfficiency);
      if (efficiencyTrend > 0.5) trends.efficiency = 'improving';
      else if (efficiencyTrend < -0.5) trends.efficiency = 'declining';
    }
    
    if (session.recentSymmetry && session.recentSymmetry.length >= 5) {
      const symmetryTrend = this.calculateTrend(session.recentSymmetry);
      if (symmetryTrend > 0.5) trends.symmetry = 'improving';
      else if (symmetryTrend < -0.5) trends.symmetry = 'declining';
    }
    
    return trends;
  }

  // Gerar recomendações
  private generateRecommendations(session: BiomechanicsSession) {
    const recommendations = {
      immediate: [] as string[],
      shortTerm: [] as string[],
      longTerm: [] as string[]
    };
    
    // Recomendações imediatas
    if (session.averageCadence < 170) {
      recommendations.immediate.push('Aumente a cadência gradualmente durante o treino');
    }
    
    if (session.averageSymmetry < 80) {
      recommendations.immediate.push('Foque na simetria de movimento');
    }
    
    // Recomendações de curto prazo
    recommendations.shortTerm.push('Faça exercícios de fortalecimento 2-3x por semana');
    recommendations.shortTerm.push('Inclua drills de corrida no warm-up');
    
    // Recomendações de longo prazo
    recommendations.longTerm.push('Considere avaliação com fisioterapeuta especializado');
    recommendations.longTerm.push('Desenvolva programa de fortalecimento progressivo');
    
    return recommendations;
  }

  // Avaliar riscos
  private assessRisks(session: BiomechanicsSession) {
    const riskAssessment = {
      injuryRisk: 'low' as any,
      riskFactors: [] as string[],
      preventionTips: [] as string[]
    };
    
    let riskScore = 0;
    
    if (session.averageSymmetry < 75) {
      riskScore += 30;
      riskAssessment.riskFactors.push('Assimetria significativa');
      riskAssessment.preventionTips.push('Exercícios de fortalecimento unilateral');
    }
    
    if (session.averageImpactForce > 3.5) {
      riskScore += 25;
      riskAssessment.riskFactors.push('Alto impacto');
      riskAssessment.preventionTips.push('Reduzir intensidade e melhorar técnica');
    }
    
    if (session.averageVerticalOscillation > 15) {
      riskScore += 20;
      riskAssessment.riskFactors.push('Oscilação vertical excessiva');
      riskAssessment.preventionTips.push('Focar na estabilidade do centro de gravidade');
    }
    
    if (session.averageEfficiency < 70) {
      riskScore += 25;
      riskAssessment.riskFactors.push('Baixa eficiência de corrida');
      riskAssessment.preventionTips.push('Trabalhar técnica e economia de movimento');
    }
    
    // Determinar nível de risco
    if (riskScore >= 70) riskAssessment.injuryRisk = 'high';
    else if (riskScore >= 40) riskAssessment.injuryRisk = 'medium';
    else riskAssessment.injuryRisk = 'low';
    
    return riskAssessment;
  }

  // Obter sessão por ID
  public getSessionById(sessionId: string): BiomechanicsSession | undefined {
    return this.sessions.find(s => s.id === sessionId);
  }

  // Obter sessões do usuário
  public getUserSessions(userId: string): BiomechanicsSession[] {
    return this.sessions
      .filter(s => s.userId === userId)
      .sort((a, b) => b.startTime - a.startTime);
  }

  // Obter perfil biomecânico
  public getUserProfile(userId: string): BiomechanicsProfile | undefined {
    return this.profiles.find(p => p.userId === userId);
  }

  // Criar ou atualizar perfil
  public updateUserProfile(profile: Partial<BiomechanicsProfile>): BiomechanicsProfile {
    const existingIndex = this.profiles.findIndex(p => p.userId === profile.userId!);
    
    if (existingIndex >= 0) {
      this.profiles[existingIndex] = { ...this.profiles[existingIndex], ...profile };
      return this.profiles[existingIndex];
    } else {
      const newProfile: BiomechanicsProfile = {
        userId: profile.userId!,
        experience: profile.experience || 0,
        preferredDistance: profile.preferredDistance || 5,
        runningStyle: profile.runningStyle || 'mixed',
        biomechanicsHistory: [],
        personalBests: {
          bestCadence: 0,
          bestSymmetry: 0,
          bestEfficiency: 0,
          bestStrideLength: 0
        },
        improvementGoals: profile.improvementGoals || [],
        lastAnalysis: Date.now()
      };
      
      this.profiles.push(newProfile);
      return newProfile;
    }
  }
}

export function createBiomechanicsAnalyzer(): BiomechanicsAnalyzer {
  return new BiomechanicsAnalyzer();
}