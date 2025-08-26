export interface InjuryRiskFactor {
  id: string;
  name: string;
  description: string;
  weight: number; // 0-1, importância do fator
  category: 'biomechanical' | 'training' | 'physiological' | 'environmental';
}

export interface InjuryPattern {
  id: string;
  name: string;
  description: string;
  riskFactors: string[]; // IDs dos fatores de risco
  symptoms: string[];
  preventionTips: string[];
  severity: 'low' | 'medium' | 'high';
  bodyPart: 'knee' | 'ankle' | 'hip' | 'shin' | 'foot' | 'back';
}

export interface UserInjuryData {
  userId: string;
  timestamp: number;
  // Dados biomecânicos
  cadence: number;
  groundContactTime: number;
  verticalOscillation: number;
  pronation: 'supination' | 'neutral' | 'pronation';
  symmetry: number;
  // Dados de treino
  weeklyDistance: number;
  weeklyIntensity: number;
  restDays: number;
  consecutiveDays: number;
  // Dados fisiológicos
  fatigue: number; // 0-100
  sleepQuality: number; // 0-100
  hrv: number;
  stress: number; // 0-100
  // Dados ambientais
  surface: 'road' | 'trail' | 'treadmill';
  weather: 'dry' | 'wet' | 'hot' | 'cold';
  elevation: number;
}

export interface InjuryRiskAssessment {
  overallRisk: 'low' | 'medium' | 'high';
  riskScore: number; // 0-100
  riskFactors: Array<{
    factor: InjuryRiskFactor;
    userValue: number;
    riskLevel: 'low' | 'medium' | 'high';
    contribution: number; // 0-100, quanto contribui para o risco
  }>;
  recommendations: string[];
  nextAssessment: number; // timestamp
  patterns: InjuryPattern[];
}

export class InjuryPredictionManager {
  private riskFactors: InjuryRiskFactor[] = [];
  private injuryPatterns: InjuryPattern[] = [];
  private userData: UserInjuryData[] = [];

  constructor() {
    this.initializeRiskFactors();
    this.initializeInjuryPatterns();
  }

  private initializeRiskFactors() {
    this.riskFactors = [
      // Fatores Biomecânicos
      {
        id: 'high_impact',
        name: 'Alto Impacto',
        description: 'Força de impacto excessiva durante a corrida',
        weight: 0.25,
        category: 'biomechanical'
      },
      {
        id: 'asymmetry',
        name: 'Assimetria',
        description: 'Diferença significativa entre lado esquerdo e direito',
        weight: 0.20,
        category: 'biomechanical'
      },
      {
        id: 'overstriding',
        name: 'Passada Muito Longa',
        description: 'Passada excessivamente longa que aumenta o impacto',
        weight: 0.18,
        category: 'biomechanical'
      },
      {
        id: 'low_cadence',
        name: 'Baixa Cadência',
        description: 'Cadência abaixo de 160 passos/minuto',
        weight: 0.15,
        category: 'biomechanical'
      },

      // Fatores de Treino
      {
        id: 'high_weekly_distance',
        name: 'Distância Semanal Alta',
        description: 'Aumento muito rápido na distância semanal',
        weight: 0.22,
        category: 'training'
      },
      {
        id: 'insufficient_rest',
        name: 'Descanso Insuficiente',
        description: 'Poucos dias de descanso entre treinos',
        weight: 0.20,
        category: 'training'
      },
      {
        id: 'consecutive_days',
        name: 'Dias Consecutivos',
        description: 'Muitos dias consecutivos de treino',
        weight: 0.18,
        category: 'training'
      },
      {
        id: 'high_intensity',
        name: 'Alta Intensidade',
        description: 'Treinos de alta intensidade muito frequentes',
        weight: 0.16,
        category: 'training'
      },

      // Fatores Fisiológicos
      {
        id: 'high_fatigue',
        name: 'Fadiga Elevada',
        description: 'Níveis de fadiga consistentemente altos',
        weight: 0.24,
        category: 'physiological'
      },
      {
        id: 'poor_sleep',
        name: 'Sono de Baixa Qualidade',
        description: 'Qualidade do sono consistentemente baixa',
        weight: 0.20,
        category: 'physiological'
      },
      {
        id: 'low_hrv',
        name: 'HRV Baixo',
        description: 'Variabilidade da frequência cardíaca baixa',
        weight: 0.18,
        category: 'physiological'
      },
      {
        id: 'high_stress',
        name: 'Estresse Elevado',
        description: 'Níveis de estresse consistentemente altos',
        weight: 0.16,
        category: 'physiological'
      },

      // Fatores Ambientais
      {
        id: 'hard_surface',
        name: 'Superfície Dura',
        description: 'Corrida frequente em superfícies duras',
        weight: 0.15,
        category: 'environmental'
      },
      {
        id: 'elevation_change',
        name: 'Mudanças de Elevação',
        description: 'Mudanças bruscas de elevação',
        weight: 0.12,
        category: 'environmental'
      }
    ];
  }

  private initializeInjuryPatterns() {
    this.injuryPatterns = [
      // Lesões de Joelho
      {
        id: 'runner_knee',
        name: 'Joelho do Corredor',
        description: 'Síndrome da banda iliotibial ou condromalácia patelar',
        riskFactors: ['high_impact', 'overstriding', 'high_weekly_distance', 'insufficient_rest'],
        symptoms: ['Dor na lateral do joelho', 'Dor ao subir/descer escadas', 'Dor após longas distâncias'],
        preventionTips: [
          'Fortaleça quadríceps e glúteos',
          'Alongue a banda iliotibial',
          'Reduza gradualmente a distância',
          'Use calçados adequados'
        ],
        severity: 'medium',
        bodyPart: 'knee'
      },
      {
        id: 'patellar_tendonitis',
        name: 'Tendinite Patelar',
        description: 'Inflamação do tendão patelar',
        riskFactors: ['high_impact', 'high_intensity', 'consecutive_days', 'hard_surface'],
        symptoms: ['Dor abaixo da patela', 'Dor ao agachar', 'Rigidez matinal'],
        preventionTips: [
          'Fortaleça quadríceps',
          'Alongue isquiotibiais',
          'Evite superfícies duras',
          'Reduza intensidade gradualmente'
        ],
        severity: 'medium',
        bodyPart: 'knee'
      },

      // Lesões de Canela
      {
        id: 'shin_splints',
        name: 'Canelite',
        description: 'Dor na tíbia por sobrecarga',
        riskFactors: ['high_weekly_distance', 'insufficient_rest', 'hard_surface', 'overstriding'],
        symptoms: ['Dor na parte interna da canela', 'Dor ao tocar a tíbia', 'Dor que piora com exercício'],
        preventionTips: [
          'Aumente distância gradualmente',
          'Fortaleça panturrilhas',
          'Use calçados com amortecimento',
          'Evite superfícies duras'
        ],
        severity: 'medium',
        bodyPart: 'shin'
      },

      // Lesões de Tornozelo
      {
        id: 'ankle_sprain',
        name: 'Entorse de Tornozelo',
        description: 'Lesão ligamentar do tornozelo',
        riskFactors: ['asymmetry', 'trail_surface', 'elevation_change', 'fatigue'],
        symptoms: ['Dor no tornozelo', 'Inchaço', 'Instabilidade', 'Dificuldade para caminhar'],
        preventionTips: [
          'Fortaleça tornozelos',
          'Use calçados adequados para o terreno',
          'Mantenha atenção ao terreno',
          'Evite correr quando muito cansado'
        ],
        severity: 'high',
        bodyPart: 'ankle'
      },

      // Lesões de Pé
      {
        id: 'plantar_fasciitis',
        name: 'Fascite Plantar',
        description: 'Inflamação da fáscia plantar',
        riskFactors: ['high_impact', 'hard_surface', 'overstriding', 'insufficient_rest'],
        symptoms: ['Dor no calcanhar', 'Dor matinal', 'Dor após longas distâncias'],
        preventionTips: [
          'Alongue panturrilhas e pés',
          'Use calçados com suporte',
          'Evite superfícies duras',
          'Reduza gradualmente a distância'
        ],
        severity: 'medium',
        bodyPart: 'foot'
      }
    ];
  }

  // Adicionar dados do usuário
  public addUserData(data: UserInjuryData): void {
    this.userData.push(data);
    
    // Manter apenas os últimos 30 dias de dados
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    this.userData = this.userData.filter(d => d.timestamp > thirtyDaysAgo);
  }

  // Avaliar risco de lesão
  public assessInjuryRisk(userId: string): InjuryRiskAssessment {
    const userRecentData = this.userData
      .filter(d => d.userId === userId)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 7); // Últimos 7 dias

    if (userRecentData.length === 0) {
      return this.getDefaultAssessment();
    }

    const riskFactors = this.calculateRiskFactors(userRecentData);
    const overallRisk = this.calculateOverallRisk(riskFactors);
    const recommendations = this.generateRecommendations(riskFactors);
    const patterns = this.identifyInjuryPatterns(riskFactors);

    return {
      overallRisk,
      riskScore: this.calculateRiskScore(riskFactors),
      riskFactors,
      recommendations,
      nextAssessment: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
      patterns
    };
  }

  // Calcular fatores de risco individuais
  private calculateRiskFactors(userData: UserInjuryData[]): Array<{
    factor: InjuryRiskFactor;
    userValue: number;
    riskLevel: 'low' | 'medium' | 'high';
    contribution: number;
  }> {
    const riskFactors: Array<{
      factor: InjuryRiskFactor;
      userValue: number;
      riskLevel: 'low' | 'medium' | 'high';
      contribution: number;
    }> = [];

    this.riskFactors.forEach(factor => {
      let userValue = 0;
      let riskLevel: 'low' | 'medium' | 'high' = 'low';

      switch (factor.id) {
        case 'high_impact':
          userValue = this.calculateAverageImpact(userData);
          riskLevel = userValue > 1.8 ? 'high' : userValue > 1.5 ? 'medium' : 'low';
          break;
        case 'asymmetry':
          userValue = this.calculateAverageAsymmetry(userData);
          riskLevel = userValue > 15 ? 'high' : userValue > 8 ? 'medium' : 'low';
          break;
        case 'overstriding':
          userValue = this.calculateOverstridingRisk(userData);
          riskLevel = userValue > 0.7 ? 'high' : userValue > 0.5 ? 'medium' : 'low';
          break;
        case 'low_cadence':
          userValue = this.calculateAverageCadence(userData);
          riskLevel = userValue < 160 ? 'high' : userValue < 170 ? 'medium' : 'low';
          break;
        case 'high_weekly_distance':
          userValue = this.calculateWeeklyDistance(userData);
          riskLevel = userValue > 80 ? 'high' : userValue > 50 ? 'medium' : 'low';
          break;
        case 'insufficient_rest':
          userValue = this.calculateRestDays(userData);
          riskLevel = userValue < 2 ? 'high' : userValue < 3 ? 'medium' : 'low';
          break;
        case 'consecutive_days':
          userValue = this.calculateConsecutiveDays(userData);
          riskLevel = userValue > 5 ? 'high' : userValue > 3 ? 'medium' : 'low';
          break;
        case 'high_intensity':
          userValue = this.calculateAverageIntensity(userData);
          riskLevel = userValue > 80 ? 'high' : userValue > 65 ? 'medium' : 'low';
          break;
        case 'high_fatigue':
          userValue = this.calculateAverageFatigue(userData);
          riskLevel = userValue > 70 ? 'high' : userValue > 50 ? 'medium' : 'low';
          break;
        case 'poor_sleep':
          userValue = this.calculateAverageSleepQuality(userData);
          riskLevel = userValue < 60 ? 'high' : userValue < 75 ? 'medium' : 'low';
          break;
        case 'low_hrv':
          userValue = this.calculateAverageHRV(userData);
          riskLevel = userValue < 40 ? 'high' : userValue < 55 ? 'medium' : 'low';
          break;
        case 'high_stress':
          userValue = this.calculateAverageStress(userData);
          riskLevel = userValue > 70 ? 'high' : userValue > 50 ? 'medium' : 'low';
          break;
        case 'hard_surface':
          userValue = this.calculateHardSurfaceRisk(userData);
          riskLevel = userValue > 0.7 ? 'high' : userValue > 0.4 ? 'medium' : 'low';
          break;
        case 'elevation_change':
          userValue = this.calculateElevationChangeRisk(userData);
          riskLevel = userValue > 200 ? 'high' : userValue > 100 ? 'medium' : 'low';
          break;
      }

      const contribution = this.calculateContribution(factor.weight, riskLevel);
      riskFactors.push({ factor, userValue, riskLevel, contribution });
    });

    return riskFactors;
  }

  // Calcular risco geral
  private calculateOverallRisk(riskFactors: any[]): 'low' | 'medium' | 'high' {
    const highRiskCount = riskFactors.filter(rf => rf.riskLevel === 'high').length;
    const mediumRiskCount = riskFactors.filter(rf => rf.riskLevel === 'medium').length;
    const totalContribution = riskFactors.reduce((sum, rf) => sum + rf.contribution, 0);

    if (highRiskCount >= 3 || totalContribution > 60) return 'high';
    if (highRiskCount >= 1 || mediumRiskCount >= 3 || totalContribution > 35) return 'medium';
    return 'low';
  }

  // Calcular score de risco (0-100)
  private calculateRiskScore(riskFactors: any[]): number {
    const totalContribution = riskFactors.reduce((sum, rf) => sum + rf.contribution, 0);
    return Math.min(100, Math.round(totalContribution));
  }

  // Gerar recomendações
  private generateRecommendations(riskFactors: any[]): string[] {
    const recommendations: string[] = [];
    const highRiskFactors = riskFactors.filter(rf => rf.riskLevel === 'high');

    // Recomendações baseadas em fatores de alto risco
    highRiskFactors.forEach(rf => {
      switch (rf.factor.id) {
        case 'high_impact':
          recommendations.push('Reduza a intensidade dos treinos para diminuir o impacto');
          recommendations.push('Foque em técnica de corrida com passada mais suave');
          break;
        case 'asymmetry':
          recommendations.push('Faça exercícios de fortalecimento unilateral');
          recommendations.push('Considere consultar um fisioterapeuta');
          break;
        case 'high_weekly_distance':
          recommendations.push('Reduza a distância semanal em 20-30%');
          recommendations.push('Aumente gradualmente, não mais que 10% por semana');
          break;
        case 'insufficient_rest':
          recommendations.push('Adicione mais dias de descanso na semana');
          recommendations.push('Considere treinos alternados (corrida/descanso)');
          break;
        case 'high_fatigue':
          recommendations.push('Priorize recuperação e sono');
          recommendations.push('Reduza a intensidade dos treinos');
          break;
      }
    });

    // Recomendações gerais baseadas no risco geral
    if (recommendations.length === 0) {
      recommendations.push('Continue monitorando seus padrões de corrida');
      recommendations.push('Mantenha uma rotina de alongamento e fortalecimento');
    }

    return recommendations.slice(0, 5); // Máximo 5 recomendações
  }

  // Identificar padrões de lesão
  private identifyInjuryPatterns(riskFactors: any[]): InjuryPattern[] {
    const highRiskFactors = riskFactors.filter(rf => rf.riskLevel === 'high');
    const highRiskFactorIds = highRiskFactors.map(rf => rf.factor.id);

    return this.injuryPatterns.filter(pattern => {
      const matchingFactors = pattern.riskFactors.filter(rf => highRiskFactorIds.includes(rf));
      return matchingFactors.length >= 2; // Pelo menos 2 fatores de risco altos
    });
  }

  // Métodos auxiliares para cálculos
  private calculateAverageImpact(userData: UserInjuryData[]): number {
    // Simulação - em produção viria de sensores
    return 1.5 + Math.random() * 0.5;
  }

  private calculateAverageAsymmetry(userData: UserInjuryData[]): number {
    return userData.reduce((sum, d) => sum + d.symmetry, 0) / userData.length;
  }

  private calculateOverstridingRisk(userData: UserInjuryData[]): number {
    // Simulação baseada em cadência e velocidade
    return Math.random() * 0.8;
  }

  private calculateAverageCadence(userData: UserInjuryData[]): number {
    return userData.reduce((sum, d) => sum + d.cadence, 0) / userData.length;
  }

  private calculateWeeklyDistance(userData: UserInjuryData[]): number {
    return userData.reduce((sum, d) => sum + d.weeklyDistance, 0);
  }

  private calculateRestDays(userData: UserInjuryData[]): number {
    return userData.filter(d => d.weeklyIntensity < 30).length;
  }

  private calculateConsecutiveDays(userData: UserInjuryData[]): number {
    return userData.filter(d => d.consecutiveDays > 0).length;
  }

  private calculateAverageIntensity(userData: UserInjuryData[]): number {
    return userData.reduce((sum, d) => sum + d.weeklyIntensity, 0) / userData.length;
  }

  private calculateAverageFatigue(userData: UserInjuryData[]): number {
    return userData.reduce((sum, d) => sum + d.fatigue, 0) / userData.length;
  }

  private calculateAverageSleepQuality(userData: UserInjuryData[]): number {
    return userData.reduce((sum, d) => sum + d.sleepQuality, 0) / userData.length;
  }

  private calculateAverageHRV(userData: UserInjuryData[]): number {
    return userData.reduce((sum, d) => sum + d.hrv, 0) / userData.length;
  }

  private calculateAverageStress(userData: UserInjuryData[]): number {
    return userData.reduce((sum, d) => sum + d.stress, 0) / userData.length;
  }

  private calculateHardSurfaceRisk(userData: UserInjuryData[]): number {
    return userData.filter(d => d.surface === 'road').length / userData.length;
  }

  private calculateElevationChangeRisk(userData: UserInjuryData[]): number {
    return userData.reduce((sum, d) => sum + d.elevation, 0) / userData.length;
  }

  private calculateContribution(weight: number, riskLevel: 'low' | 'medium' | 'high'): number {
    const levelMultiplier = { low: 0.2, medium: 0.6, high: 1.0 };
    return weight * levelMultiplier[riskLevel] * 100;
  }

  private getDefaultAssessment(): InjuryRiskAssessment {
    return {
      overallRisk: 'low',
      riskScore: 0,
      riskFactors: [],
      recommendations: ['Continue monitorando seus padrões de corrida'],
      nextAssessment: Date.now() + 24 * 60 * 60 * 1000,
      patterns: []
    };
  }

  // Obter histórico de avaliações
  public getUserInjuryHistory(userId: string): UserInjuryData[] {
    return this.userData.filter(d => d.userId === userId);
  }

  // Obter padrões de lesão disponíveis
  public getInjuryPatterns(): InjuryPattern[] {
    return this.injuryPatterns;
  }

  // Obter fatores de risco disponíveis
  public getRiskFactors(): InjuryRiskFactor[] {
    return this.riskFactors;
  }
}

export function createInjuryPredictionManager(): InjuryPredictionManager {
  return new InjuryPredictionManager();
}