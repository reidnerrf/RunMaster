export interface UserTest {
  id: string;
  name: string;
  description: string;
  objective: string;
  type: 'usability' | 'feature_validation' | 'performance' | 'accessibility' | 'beta_testing' | 'a_b_testing';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  targetAudience: {
    userLevel: 'beginner' | 'intermediate' | 'advanced' | 'all';
    userCount: number;
    criteria: string[];
    excludedUsers?: string[];
  };
  features: string[]; // IDs das funcionalidades a serem testadas
  tasks: UserTestTask[];
  metrics: {
    completionRate: number;
    averageTime: number;
    successRate: number;
    satisfactionScore: number;
    bugCount: number;
    feedbackCount: number;
  };
  schedule: {
    startDate: number;
    endDate: number;
    estimatedDuration: number; // minutos
    reminderFrequency: 'daily' | 'weekly' | 'custom';
  };
  rewards: {
    points: number;
    badges: string[];
    earlyAccess: string[];
    recognition: string;
  };
  createdAt: number;
  createdBy: string;
  lastUpdated: number;
}

export interface UserTestTask {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  expectedOutcome: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // segundos
  isRequired: boolean;
  order: number;
  dependencies?: string[]; // IDs de outras tasks
  successCriteria: string[];
  metrics: {
    completionTime?: number;
    attempts: number;
    isCompleted: boolean;
    success: boolean;
    userNotes?: string;
    screenshots?: string[];
  };
}

export interface UserTestSession {
  id: string;
  testId: string;
  userId: string;
  status: 'started' | 'in_progress' | 'completed' | 'abandoned';
  startTime: number;
  endTime?: number;
  duration?: number; // segundos
  currentTaskIndex: number;
  completedTasks: string[];
  taskResults: Map<string, UserTestTaskResult>;
  feedback: UserTestFeedback[];
  deviceInfo: {
    platform: 'ios' | 'android' | 'web';
    version: string;
    screenSize: string;
    orientation: 'portrait' | 'landscape';
  };
  sessionData: {
    appVersion: string;
    buildNumber: string;
    timestamp: number;
  };
}

export interface UserTestTaskResult {
  taskId: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  attempts: number;
  isCompleted: boolean;
  success: boolean;
  userNotes?: string;
  screenshots: string[];
  interactions: UserInteraction[];
  errors?: string[];
  suggestions?: string[];
}

export interface UserInteraction {
  type: 'tap' | 'swipe' | 'scroll' | 'input' | 'navigation' | 'gesture';
  timestamp: number;
  element: string;
  coordinates?: { x: number; y: number };
  data?: any;
  duration?: number;
}

export interface UserTestFeedback {
  id: string;
  type: 'bug_report' | 'feature_request' | 'usability_issue' | 'general_feedback';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  stepsToReproduce?: string[];
  expectedBehavior?: string;
  actualBehavior?: string;
  attachments?: string[];
  status: 'open' | 'in_review' | 'resolved' | 'closed';
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  createdAt: number;
  updatedAt: number;
  resolvedAt?: number;
  resolution?: string;
}

export interface UserTestAnalytics {
  testId: string;
  totalParticipants: number;
  activeParticipants: number;
  completedSessions: number;
  abandonedSessions: number;
  averageCompletionTime: number;
  taskCompletionRates: { [taskId: string]: number };
  userSatisfaction: {
    average: number;
    distribution: { [score: number]: number };
  };
  bugReports: {
    total: number;
    bySeverity: { [severity: string]: number };
    byCategory: { [category: string]: number };
  };
  featureUsage: { [featureId: string]: number };
  userJourney: {
    commonPaths: string[][];
    dropOffPoints: string[];
    bottlenecks: string[];
  };
}

export interface UserTestManager {
  tests: UserTest[];
  sessions: UserTestSession[];
  feedback: UserTestFeedback[];
  analytics: Map<string, UserTestAnalytics>;
}

export class UserTestManager {
  private tests: UserTest[] = [];
  private sessions: UserTestSession[] = [];
  private feedback: UserTestFeedback[] = [];
  private analytics: Map<string, UserTestAnalytics> = new Map();

  constructor() {
    this.initializeSampleTests();
  }

  private initializeSampleTests() {
    const sampleTests: UserTest[] = [
      // Teste de Usabilidade - Coach IA
      {
        id: 'test_coach_ai_usability',
        name: 'Teste de Usabilidade - Coach IA',
        description: 'Validar a facilidade de uso e eficácia do sistema de Coach IA',
        objective: 'Identificar pontos de melhoria na interface e experiência do usuário com o Coach IA',
        type: 'usability',
        status: 'active',
        priority: 'high',
        targetAudience: {
          userLevel: 'intermediate',
          userCount: 50,
          criteria: [
            'Usuários que correram pelo menos 10 vezes',
            'Usuários com nível 5+',
            'Usuários que nunca usaram Coach IA'
          ]
        },
        features: ['ai_coach', 'voice_commands', 'training_recommendations'],
        tasks: [
          {
            id: 'task_coach_setup',
            title: 'Configurar Coach IA',
            description: 'Configurar e personalizar o Coach IA pela primeira vez',
            instructions: [
              'Acesse a seção Coach IA',
              'Complete o perfil inicial',
              'Configure suas preferências de treino',
              'Ative as notificações do coach'
            ],
            expectedOutcome: 'Coach IA configurado e personalizado com sucesso',
            difficulty: 'easy',
            estimatedTime: 120,
            isRequired: true,
            order: 1,
            successCriteria: [
              'Perfil inicial preenchido',
              'Preferências configuradas',
              'Notificações ativadas'
            ],
            metrics: {
              attempts: 0,
              isCompleted: false,
              success: false
            }
          },
          {
            id: 'task_voice_commands',
            title: 'Usar Comandos de Voz',
            description: 'Testar os comandos de voz durante uma corrida simulada',
            instructions: [
              'Inicie uma corrida simulada',
              'Use o comando "mais rápido"',
              'Use o comando "status"',
              'Use o comando "motivação"'
            ],
            expectedOutcome: 'Comandos de voz funcionando corretamente',
            difficulty: 'medium',
            estimatedTime: 180,
            isRequired: true,
            order: 2,
            dependencies: ['task_coach_setup'],
            successCriteria: [
              'Comando "mais rápido" executado',
              'Comando "status" respondido',
              'Comando "motivação" funcionando'
            ],
            metrics: {
              attempts: 0,
              isCompleted: false,
              success: false
            }
          },
          {
            id: 'task_training_recommendation',
            title: 'Receber Recomendação de Treino',
            description: 'Solicitar e receber uma recomendação personalizada de treino',
            instructions: [
              'Acesse a seção de recomendações',
              'Solicite uma nova recomendação',
              'Revise os detalhes da recomendação',
              'Salve a recomendação'
            ],
            expectedOutcome: 'Recomendação personalizada recebida e salva',
            difficulty: 'medium',
            estimatedTime: 150,
            isRequired: true,
            order: 3,
            dependencies: ['task_coach_setup'],
            successCriteria: [
              'Recomendação solicitada',
              'Detalhes revisados',
              'Recomendação salva'
            ],
            metrics: {
              attempts: 0,
              isCompleted: false,
              success: false
            }
          }
        ],
        metrics: {
          completionRate: 0,
          averageTime: 0,
          successRate: 0,
          satisfactionScore: 0,
          bugCount: 0,
          feedbackCount: 0
        },
        schedule: {
          startDate: Date.now(),
          endDate: Date.now() + 14 * 24 * 60 * 60 * 1000, // 14 dias
          estimatedDuration: 15,
          reminderFrequency: 'daily'
        },
        rewards: {
          points: 500,
          badges: ['beta_tester', 'coach_expert'],
          earlyAccess: ['advanced_coach_features'],
          recognition: 'Testador Beta do Coach IA'
        },
        createdAt: Date.now(),
        createdBy: 'system',
        lastUpdated: Date.now()
      },

      // Teste de Validação - Navegação AR
      {
        id: 'test_ar_navigation_validation',
        name: 'Validação da Navegação AR',
        description: 'Validar a funcionalidade e precisão da navegação em realidade aumentada',
        objective: 'Confirmar que a navegação AR funciona corretamente em diferentes cenários',
        type: 'feature_validation',
        status: 'active',
        priority: 'critical',
        targetAudience: {
          userLevel: 'advanced',
          userCount: 30,
          criteria: [
            'Usuários com dispositivos compatíveis com AR',
            'Usuários que já usaram navegação GPS',
            'Usuários com experiência em corridas ao ar livre'
          ]
        },
        features: ['ar_navigation', 'gps_tracking', 'route_planning'],
        tasks: [
          {
            id: 'task_ar_calibration',
            title: 'Calibrar Dispositivo AR',
            description: 'Calibrar o dispositivo para navegação AR precisa',
            instructions: [
              'Acesse as configurações AR',
              'Execute a calibração automática',
              'Verifique a precisão da calibração',
              'Ajuste manual se necessário'
            ],
            expectedOutcome: 'Dispositivo calibrado com precisão aceitável',
            difficulty: 'medium',
            estimatedTime: 300,
            isRequired: true,
            order: 1,
            successCriteria: [
              'Calibração automática executada',
              'Precisão verificada',
              'Ajustes manuais feitos se necessário'
            ],
            metrics: {
              attempts: 0,
              isCompleted: false,
              success: false
            }
          },
          {
            id: 'task_ar_route_navigation',
            title: 'Navegar Rota com AR',
            description: 'Usar navegação AR para seguir uma rota pré-definida',
            instructions: [
              'Selecione uma rota de teste',
              'Ative a navegação AR',
              'Siga as instruções AR por pelo menos 500m',
              'Verifique a precisão das instruções'
            ],
            expectedOutcome: 'Navegação AR funcionando com precisão',
            difficulty: 'hard',
            estimatedTime: 600,
            isRequired: true,
            order: 2,
            dependencies: ['task_ar_calibration'],
            successCriteria: [
              'Rota selecionada',
              'Navegação AR ativada',
              '500m navegados com AR',
              'Precisão verificada'
            ],
            metrics: {
              attempts: 0,
              isCompleted: false,
              success: false
            }
          }
        ],
        metrics: {
          completionRate: 0,
          averageTime: 0,
          successRate: 0,
          satisfactionScore: 0,
          bugCount: 0,
          feedbackCount: 0
        },
        schedule: {
          startDate: Date.now(),
          endDate: Date.now() + 21 * 24 * 60 * 60 * 1000, // 21 dias
          estimatedDuration: 20,
          reminderFrequency: 'weekly'
        },
        rewards: {
          points: 1000,
          badges: ['ar_pioneer', 'navigation_expert'],
          earlyAccess: ['beta_ar_features'],
          recognition: 'Pioneiro da Navegação AR'
        },
        createdAt: Date.now(),
        createdBy: 'system',
        lastUpdated: Date.now()
      }
    ];

    this.tests.push(...sampleTests);
  }

  // Obter testes disponíveis
  public getAvailableTests(): UserTest[] {
    return this.tests.filter(test => test.status === 'active');
  }

  // Obter teste por ID
  public getTestById(testId: string): UserTest | undefined {
    return this.tests.find(test => test.id === testId);
  }

  // Obter testes por tipo
  public getTestsByType(type: string): UserTest[] {
    return this.tests.filter(test => test.type === type);
  }

  // Obter testes por prioridade
  public getTestsByPriority(priority: string): UserTest[] {
    return this.tests.filter(test => test.priority === priority);
  }

  // Obter testes por status
  public getTestsByStatus(status: string): UserTest[] {
    return this.tests.filter(test => test.status === status);
  }

  // Criar sessão de teste
  public createTestSession(testId: string, userId: string, deviceInfo: any): UserTestSession | null {
    const test = this.getTestById(testId);
    if (!test || test.status !== 'active') return null;

    // Verificar se usuário já tem sessão ativa
    const existingSession = this.sessions.find(s => 
      s.testId === testId && 
      s.userId === userId && 
      ['started', 'in_progress'].includes(s.status)
    );

    if (existingSession) return existingSession;

    const session: UserTestSession = {
      id: `session_${Date.now()}`,
      testId,
      userId,
      status: 'started',
      startTime: Date.now(),
      currentTaskIndex: 0,
      completedTasks: [],
      taskResults: new Map(),
      feedback: [],
      deviceInfo,
      sessionData: {
        appVersion: '1.0.0',
        buildNumber: '100',
        timestamp: Date.now()
      }
    };

    this.sessions.push(session);
    return session;
  }

  // Iniciar tarefa
  public startTask(sessionId: string, taskId: string): boolean {
    const session = this.sessions.find(s => s.id === sessionId);
    if (!session) return false;

    const test = this.getTestById(session.testId);
    if (!test) return false;

    const task = test.tasks.find(t => t.id === taskId);
    if (!task) return false;

    // Verificar dependências
    if (task.dependencies) {
      const completedDependencies = task.dependencies.every(depId => 
        session.completedTasks.includes(depId)
      );
      if (!completedDependencies) return false;
    }

    // Inicializar resultado da tarefa
    const taskResult: UserTestTaskResult = {
      taskId,
      startTime: Date.now(),
      attempts: 0,
      isCompleted: false,
      success: false,
      screenshots: [],
      interactions: []
    };

    session.taskResults.set(taskId, taskResult);
    session.status = 'in_progress';

    return true;
  }

  // Completar tarefa
  public completeTask(
    sessionId: string, 
    taskId: string, 
    success: boolean, 
    userNotes?: string,
    screenshots?: string[]
  ): boolean {
    const session = this.sessions.find(s => s.id === sessionId);
    if (!session) return false;

    const taskResult = session.taskResults.get(taskId);
    if (!taskResult) return false;

    taskResult.endTime = Date.now();
    taskResult.duration = taskResult.endTime - taskResult.startTime;
    taskResult.isCompleted = true;
    taskResult.success = success;
    taskResult.userNotes = userNotes;
    if (screenshots) {
      taskResult.screenshots.push(...screenshots);
    }

    // Adicionar à lista de tarefas completadas
    if (!session.completedTasks.includes(taskId)) {
      session.completedTasks.push(taskId);
    }

    // Verificar se todas as tarefas foram completadas
    const test = this.getTestById(session.testId);
    if (test) {
      const requiredTasks = test.tasks.filter(t => t.isRequired);
      const completedRequiredTasks = requiredTasks.every(t => 
        session.completedTasks.includes(t.id)
      );

      if (completedRequiredTasks) {
        session.status = 'completed';
        session.endTime = Date.now();
        session.duration = session.endTime - session.startTime;
      }
    }

    return true;
  }

  // Registrar interação do usuário
  public recordUserInteraction(
    sessionId: string,
    taskId: string,
    interaction: Omit<UserInteraction, 'timestamp'>
  ): boolean {
    const session = this.sessions.find(s => s.id === sessionId);
    if (!session) return false;

    const taskResult = session.taskResults.get(taskId);
    if (!taskResult) return false;

    const fullInteraction: UserInteraction = {
      ...interaction,
      timestamp: Date.now()
    };

    taskResult.interactions.push(fullInteraction);
    return true;
  }

  // Adicionar feedback
  public addFeedback(
    sessionId: string,
    feedback: Omit<UserTestFeedback, 'id' | 'createdAt' | 'updatedAt'>
  ): UserTestFeedback | null {
    const session = this.sessions.find(s => s.id === sessionId);
    if (!session) return null;

    const newFeedback: UserTestFeedback = {
      id: `feedback_${Date.now()}`,
      ...feedback,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    session.feedback.push(newFeedback);
    this.feedback.push(newFeedback);

    return newFeedback;
  }

  // Obter sessões do usuário
  public getUserSessions(userId: string): UserTestSession[] {
    return this.sessions
      .filter(s => s.userId === userId)
      .sort((a, b) => b.startTime - a.startTime);
  }

  // Obter sessões de um teste
  public getTestSessions(testId: string): UserTestSession[] {
    return this.sessions
      .filter(s => s.testId === testId)
      .sort((a, b) => b.startTime - a.startTime);
  }

  // Obter estatísticas de um teste
  public getTestAnalytics(testId: string): UserTestAnalytics {
    const test = this.getTestById(testId);
    if (!test) {
      throw new Error('Teste não encontrado');
    }

    const sessions = this.getTestSessions(testId);
    const completedSessions = sessions.filter(s => s.status === 'completed');
    const abandonedSessions = sessions.filter(s => s.status === 'abandoned');

    // Calcular taxas de conclusão por tarefa
    const taskCompletionRates: { [taskId: string]: number } = {};
    test.tasks.forEach(task => {
      const completedCount = completedSessions.filter(s => 
        s.completedTasks.includes(task.id)
      ).length;
      taskCompletionRates[task.id] = sessions.length > 0 ? 
        (completedCount / sessions.length) * 100 : 0;
    });

    // Calcular tempo médio de conclusão
    const completionTimes = completedSessions
      .map(s => s.duration || 0)
      .filter(duration => duration > 0);
    
    const averageCompletionTime = completionTimes.length > 0 ? 
      completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length : 0;

    // Calcular satisfação do usuário (simulado)
    const satisfactionScores = [4, 4, 5, 4, 3, 5, 4, 4, 5, 4]; // Placeholder
    const averageSatisfaction = satisfactionScores.reduce((sum, score) => sum + score, 0) / satisfactionScores.length;
    
    const satisfactionDistribution: { [score: number]: number } = {};
    satisfactionScores.forEach(score => {
      satisfactionDistribution[score] = (satisfactionDistribution[score] || 0) + 1;
    });

    // Contar bugs por severidade
    const testFeedback = this.feedback.filter(f => 
      sessions.some(s => s.id === f.id) && f.type === 'bug_report'
    );

    const bugsBySeverity: { [severity: string]: number } = {};
    const bugsByCategory: { [category: string]: number } = {};

    testFeedback.forEach(feedback => {
      bugsBySeverity[feedback.severity] = (bugsBySeverity[feedback.severity] || 0) + 1;
      bugsByCategory[feedback.category] = (bugsByCategory[feedback.category] || 0) + 1;
    });

    // Análise de jornada do usuário (simplificada)
    const commonPaths: string[][] = [
      ['task_coach_setup', 'task_voice_commands', 'task_training_recommendation'],
      ['task_coach_setup', 'task_training_recommendation']
    ];

    const dropOffPoints = ['task_voice_commands'];
    const bottlenecks = ['task_ar_calibration'];

    const analytics: UserTestAnalytics = {
      testId,
      totalParticipants: sessions.length,
      activeParticipants: sessions.filter(s => s.status === 'in_progress').length,
      completedSessions: completedSessions.length,
      abandonedSessions: abandonedSessions.length,
      averageCompletionTime: Math.round(averageCompletionTime / 1000 / 60), // converter para minutos
      taskCompletionRates,
      userSatisfaction: {
        average: Math.round(averageSatisfaction * 100) / 100,
        distribution: satisfactionDistribution
      },
      bugReports: {
        total: testFeedback.length,
        bySeverity: bugsBySeverity,
        byCategory: bugsByCategory
      },
      featureUsage: {
        ai_coach: sessions.length,
        voice_commands: completedSessions.filter(s => 
          s.completedTasks.includes('task_voice_commands')
        ).length,
        ar_navigation: completedSessions.filter(s => 
          s.completedTasks.includes('task_ar_route_navigation')
        ).length
      },
      userJourney: {
        commonPaths,
        dropOffPoints,
        bottlenecks
      }
    };

    this.analytics.set(testId, analytics);
    return analytics;
  }

  // Obter estatísticas gerais
  public getGeneralAnalytics(): {
    totalTests: number;
    activeTests: number;
    totalParticipants: number;
    totalSessions: number;
    averageCompletionRate: number;
    totalFeedback: number;
    mostTestedFeatures: string[];
  } {
    const totalTests = this.tests.length;
    const activeTests = this.tests.filter(t => t.status === 'active').length;
    const totalParticipants = new Set(this.sessions.map(s => s.userId)).size;
    const totalSessions = this.sessions.length;
    
    const completedSessions = this.sessions.filter(s => s.status === 'completed').length;
    const averageCompletionRate = totalSessions > 0 ? 
      (completedSessions / totalSessions) * 100 : 0;

    const totalFeedback = this.feedback.length;

    // Features mais testadas
    const featureUsage: { [featureId: string]: number } = {};
    this.tests.forEach(test => {
      test.features.forEach(featureId => {
        featureUsage[featureId] = (featureUsage[featureId] || 0) + 1;
      });
    });

    const mostTestedFeatures = Object.entries(featureUsage)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([featureId]) => featureId);

    return {
      totalTests,
      activeTests,
      totalParticipants,
      totalSessions,
      averageCompletionRate: Math.round(averageCompletionRate * 100) / 100,
      totalFeedback,
      mostTestedFeatures
    };
  }

  // Criar novo teste
  public createTest(testData: Omit<UserTest, 'id' | 'createdAt' | 'lastUpdated'>): UserTest {
    const newTest: UserTest = {
      ...testData,
      id: `test_${Date.now()}`,
      createdAt: Date.now(),
      lastUpdated: Date.now()
    };

    this.tests.push(newTest);
    return newTest;
  }

  // Atualizar teste
  public updateTest(testId: string, updates: Partial<UserTest>): UserTest | null {
    const test = this.tests.find(t => t.id === testId);
    if (!test) return null;

    Object.assign(test, updates);
    test.lastUpdated = Date.now();
    return test;
  }

  // Atualizar métricas do teste
  public updateTestMetrics(testId: string): boolean {
    try {
      this.getTestAnalytics(testId);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Exportar dados do teste
  public exportTestData(testId: string): {
    test: UserTest;
    sessions: UserTestSession[];
    feedback: UserTestFeedback[];
    analytics: UserTestAnalytics;
  } | null {
    const test = this.getTestById(testId);
    if (!test) return null;

    const sessions = this.getTestSessions(testId);
    const feedback = this.feedback.filter(f => 
      sessions.some(s => s.id === f.id)
    );
    const analytics = this.analytics.get(testId);

    return {
      test,
      sessions,
      feedback,
      analytics: analytics || this.getTestAnalytics(testId)
    };
  }

  // Limpar dados antigos
  public cleanupOldData(daysToKeep: number = 90): {
    sessionsRemoved: number;
    feedbackRemoved: number;
  } {
    const cutoffDate = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    
    const initialSessionsCount = this.sessions.length;
    const initialFeedbackCount = this.feedback.length;
    
    this.sessions = this.sessions.filter(s => s.startTime >= cutoffDate);
    this.feedback = this.feedback.filter(f => f.createdAt >= cutoffDate);
    
    const sessionsRemoved = initialSessionsCount - this.sessions.length;
    const feedbackRemoved = initialFeedbackCount - this.feedback.length;
    
    return { sessionsRemoved, feedbackRemoved };
  }
}

export function createUserTestManager(): UserTestManager {
  return new UserTestManager();
}