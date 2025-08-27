export interface TestInterfaceConfig {
  id: string;
  name: string;
  description: string;
  type: 'usability' | 'feature_validation' | 'performance' | 'accessibility' | 'beta_testing' | 'a_b_testing';
  targetAudience: {
    userTypes: string[];
    experienceLevels: string[];
    devices: string[];
    locations: string[];
  };
  features: string[];
  tasks: TestTask[];
  metrics: {
    completionRate: number;
    averageTime: number;
    satisfactionScore: number;
    errorRate: number;
  };
  schedule: {
    startDate: number;
    endDate: number;
    duration: number; // dias
    maxParticipants: number;
    currentParticipants: number;
  };
  rewards: {
    points: number;
    badges: string[];
    experience: number;
    unlockables: string[];
  };
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  createdAt: number;
  createdBy: string;
  lastUpdated: number;
}

export interface TestTask {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  type: 'navigation' | 'interaction' | 'completion' | 'observation' | 'feedback';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // segundos
  required: boolean;
  successCriteria: string[];
  hints: string[];
  isCompleted: boolean;
  completedAt?: number;
  userNotes?: string;
  screenshots?: string[];
  timeSpent: number;
  attempts: number;
  success: boolean;
}

export interface TestSession {
  id: string;
  testId: string;
  userId: string;
  deviceInfo: {
    platform: string;
    version: string;
    screenSize: string;
    orientation: string;
  };
  startTime: number;
  endTime?: number;
  duration?: number;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  currentTask: number;
  completedTasks: string[];
  taskResults: TaskResult[];
  userFeedback: UserFeedback[];
  overallSatisfaction?: number;
  completionNotes?: string;
  lastUpdated: number;
}

export interface TaskResult {
  taskId: string;
  startTime: number;
  endTime?: number;
  duration: number;
  attempts: number;
  success: boolean;
  userNotes?: string;
  screenshots: string[];
  interactions: UserInteraction[];
  errors: string[];
  rating: number; // 1-5
}

export interface UserInteraction {
  id: string;
  type: 'tap' | 'swipe' | 'scroll' | 'type' | 'long_press' | 'pinch' | 'rotate';
  target: string;
  coordinates?: { x: number; y: number };
  timestamp: number;
  duration: number;
  metadata?: any;
}

export interface UserFeedback {
  id: string;
  type: 'bug_report' | 'feature_request' | 'usability_issue' | 'general_feedback';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  steps: string[];
  expectedBehavior: string;
  actualBehavior: string;
  attachments: string[];
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  createdAt: number;
  updatedAt: number;
}

export interface TestAnalytics {
  testId: string;
  totalSessions: number;
  completedSessions: number;
  abandonedSessions: number;
  averageCompletionTime: number;
  averageSatisfaction: number;
  taskCompletionRates: { [taskId: string]: number };
  commonIssues: string[];
  userDemographics: {
    platforms: { [platform: string]: number };
    experienceLevels: { [level: string]: number };
    locations: { [location: string]: number };
  };
  feedbackSummary: {
    bugReports: number;
    featureRequests: number;
    usabilityIssues: number;
    generalFeedback: number;
  };
  recommendations: string[];
  lastUpdated: number;
}

export interface UserTestingInterface {
  tests: TestInterfaceConfig[];
  sessions: TestSession[];
  analytics: Map<string, TestAnalytics>;
  userProgress: Map<string, UserProgress>;
}

export interface UserProgress {
  userId: string;
  completedTests: string[];
  totalPoints: number;
  badges: string[];
  experience: number;
  currentStreak: number;
  longestStreak: number;
  lastTestDate?: number;
  preferences: {
    preferredTestTypes: string[];
    notificationEnabled: boolean;
    autoSave: boolean;
    privacyLevel: 'public' | 'private' | 'anonymous';
  };
}

export class UserTestingInterface {
  private tests: TestInterfaceConfig[] = [];
  private sessions: TestSession[] = [];
  private analytics: Map<string, TestAnalytics> = new Map();
  private userProgress: Map<string, UserProgress> = new Map();

  constructor() {
    this.initializeTestData();
  }

  private initializeTestData() {
    // Teste de usabilidade para AI Coach
    const aiCoachTest: TestInterfaceConfig = {
      id: 'test_ai_coach',
      name: 'Teste de Usabilidade - AI Coach',
      description: 'Avalie a facilidade de uso e eficácia do sistema de coach virtual',
      type: 'usability',
      targetAudience: {
        userTypes: ['runners', 'beginners', 'experienced'],
        experienceLevels: ['novice', 'intermediate', 'advanced'],
        devices: ['ios', 'android'],
        locations: ['brazil', 'global']
      },
      features: ['voice_commands', 'training_recommendations', 'performance_analysis'],
      tasks: [
        {
          id: 'task_1',
          title: 'Ativar AI Coach',
          description: 'Inicie uma sessão com o AI Coach e configure suas preferências',
          instructions: [
            'Abra a tela do AI Coach',
            'Toque no botão "Iniciar Sessão"',
            'Configure seu nível de experiência',
            'Selecione seus objetivos de treino',
            'Confirme as configurações'
          ],
          type: 'navigation',
          difficulty: 'easy',
          estimatedTime: 60,
          required: true,
          successCriteria: [
            'AI Coach foi ativado com sucesso',
            'Preferências foram configuradas',
            'Sessão está ativa'
          ],
          hints: [
            'Procure pelo ícone do AI Coach na barra de navegação',
            'As configurações estão na parte inferior da tela'
          ],
          isCompleted: false,
          timeSpent: 0,
          attempts: 0,
          success: false
        },
        {
          id: 'task_2',
          title: 'Comando de Voz',
          description: 'Use comandos de voz para interagir com o AI Coach',
          instructions: [
            'Na sessão ativa, toque no botão de microfone',
            'Diga "mais rápido" para aumentar o ritmo',
            'Diga "status" para ver informações do treino',
            'Diga "motivação" para receber incentivo'
          ],
          type: 'interaction',
          difficulty: 'medium',
          estimatedTime: 90,
          required: true,
          successCriteria: [
            'Microfone foi ativado',
            'Comando "mais rápido" foi reconhecido',
            'Comando "status" foi reconhecido',
            'Comando "motivação" foi reconhecido'
          ],
          hints: [
            'Fale claramente e próximo ao microfone',
            'Aguarde a confirmação visual antes do próximo comando'
          ],
          isCompleted: false,
          timeSpent: 0,
          attempts: 0,
          success: false
        },
        {
          id: 'task_3',
          title: 'Recomendações Personalizadas',
          description: 'Receba e implemente recomendações de treino do AI Coach',
          instructions: [
            'Aguarde o AI Coach analisar seus dados',
            'Leia a recomendação de treino fornecida',
            'Aceite a recomendação',
            'Inicie o treino recomendado',
            'Complete pelo menos 5 minutos do treino'
          ],
          type: 'completion',
          difficulty: 'hard',
          estimatedTime: 300,
          required: true,
          successCriteria: [
            'Recomendação foi recebida',
            'Recomendação foi aceita',
            'Treino foi iniciado',
            'Pelo menos 5 minutos foram completados'
          ],
          hints: [
            'As recomendações aparecem após alguns segundos',
            'Você pode rejeitar e solicitar uma nova recomendação',
            'O treino pode ser pausado se necessário'
          ],
          isCompleted: false,
          timeSpent: 0,
          attempts: 0,
          success: false
        }
      ],
      metrics: {
        completionRate: 0,
        averageTime: 0,
        satisfactionScore: 0,
        errorRate: 0
      },
      schedule: {
        startDate: Date.now(),
        endDate: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 dias
        duration: 30,
        maxParticipants: 100,
        currentParticipants: 0
      },
      rewards: {
        points: 500,
        badges: ['ai_coach_tester', 'voice_commander'],
        experience: 300,
        unlockables: ['early_access_features', 'beta_tester_badge']
      },
      status: 'active',
      createdAt: Date.now(),
      createdBy: 'system',
      lastUpdated: Date.now()
    };

    // Teste de validação de funcionalidade para AR Navigation
    const arNavigationTest: TestInterfaceConfig = {
      id: 'test_ar_navigation',
      name: 'Teste de Validação - Navegação AR',
      description: 'Teste a funcionalidade de navegação com realidade aumentada',
      type: 'feature_validation',
      targetAudience: {
        userTypes: ['runners', 'explorers', 'tech_enthusiasts'],
        experienceLevels: ['intermediate', 'advanced'],
        devices: ['ios', 'android'],
        locations: ['brazil', 'global']
      },
      features: ['ar_waypoints', 'real_time_navigation', 'device_calibration'],
      tasks: [
        {
          id: 'task_4',
          title: 'Calibração do Dispositivo',
          description: 'Calibre os sensores do dispositivo para navegação AR precisa',
          instructions: [
            'Abra a tela de navegação AR',
            'Toque em "Calibrar Dispositivo"',
            'Siga as instruções de calibração',
            'Mova o dispositivo em padrões específicos',
            'Aguarde a confirmação de calibração'
          ],
          type: 'interaction',
          difficulty: 'medium',
          estimatedTime: 120,
          required: true,
          successCriteria: [
            'Calibração foi iniciada',
            'Padrões de movimento foram seguidos',
            'Calibração foi concluída com sucesso'
          ],
          hints: [
            'Mantenha o dispositivo estável durante a calibração',
            'Siga exatamente os padrões mostrados na tela',
            'Não interrompa o processo de calibração'
          ],
          isCompleted: false,
          timeSpent: 0,
          attempts: 0,
          success: false
        },
        {
          id: 'task_5',
          title: 'Navegação com Waypoints AR',
          description: 'Use a navegação AR para seguir uma rota com waypoints virtuais',
          instructions: [
            'Selecione uma rota de teste',
            'Ative a visualização AR',
            'Siga as setas virtuais na tela',
            'Passe por pelo menos 3 waypoints',
            'Complete a rota ou caminhe por 10 minutos'
          ],
          type: 'completion',
          difficulty: 'hard',
          estimatedTime: 600,
          required: true,
          successCriteria: [
            'Rota foi selecionada',
            'Visualização AR foi ativada',
            'Pelo menos 3 waypoints foram visitados',
            'Navegação foi mantida por 10 minutos'
          ],
          hints: [
            'Mantenha o dispositivo apontado para a frente',
            'As setas indicam a direção correta',
            'Waypoints aparecem como elementos 3D na tela'
          ],
          isCompleted: false,
          timeSpent: 0,
          attempts: 0,
          success: false
        }
      ],
      metrics: {
        completionRate: 0,
        averageTime: 0,
        satisfactionScore: 0,
        errorRate: 0
      },
      schedule: {
        startDate: Date.now(),
        endDate: Date.now() + (45 * 24 * 60 * 60 * 1000), // 45 dias
        duration: 45,
        maxParticipants: 50,
        currentParticipants: 0
      },
      rewards: {
        points: 800,
        badges: ['ar_navigator', 'tech_pioneer'],
        experience: 500,
        unlockables: ['exclusive_ar_routes', 'beta_tester_status']
      },
      status: 'active',
      createdAt: Date.now(),
      createdBy: 'system',
      lastUpdated: Date.now()
    };

    this.tests.push(aiCoachTest, arNavigationTest);
  }

  // Obter testes disponíveis
  public getAvailableTests(userId: string): TestInterfaceConfig[] {
    const userProgress = this.userProgress.get(userId);
    const completedTests = userProgress?.completedTests || [];

    return this.tests.filter(test => 
      test.status === 'active' &&
      !completedTests.includes(test.id) &&
      test.schedule.currentParticipants < test.schedule.maxParticipants
    );
  }

  // Obter teste por ID
  public getTestById(testId: string): TestInterfaceConfig | undefined {
    return this.tests.find(test => test.id === testId);
  }

  // Iniciar sessão de teste
  public startTestSession(
    testId: string,
    userId: string,
    deviceInfo: any
  ): TestSession | null {
    const test = this.getTestById(testId);
    if (!test) return null;

    // Verificar se já existe sessão ativa
    const existingSession = this.sessions.find(s => 
      s.testId === testId && s.userId === userId && s.status === 'active'
    );

    if (existingSession) {
      return existingSession;
    }

    // Verificar se o teste ainda aceita participantes
    if (test.schedule.currentParticipants >= test.schedule.maxParticipants) {
      return null;
    }

    const session: TestSession = {
      id: `session_${Date.now()}`,
      testId,
      userId,
      deviceInfo,
      startTime: Date.now(),
      status: 'active',
      currentTask: 0,
      completedTasks: [],
      taskResults: [],
      userFeedback: [],
      lastUpdated: Date.now()
    };

    this.sessions.push(session);
    
    // Incrementar contador de participantes
    test.schedule.currentParticipants++;
    test.lastUpdated = Date.now();

    return session;
  }

  // Iniciar tarefa
  public startTask(sessionId: string, taskId: string): boolean {
    const session = this.sessions.find(s => s.id === sessionId);
    if (!session || session.status !== 'active') return false;

    const test = this.getTestById(session.testId);
    if (!test) return false;

    const task = test.tasks.find(t => t.id === taskId);
    if (!task) return false;

    // Verificar se a tarefa anterior foi completada (se não for a primeira)
    if (session.currentTask > 0) {
      const previousTask = test.tasks[session.currentTask - 1];
      if (previousTask && previousTask.required && !previousTask.isCompleted) {
        return false; // Tarefa anterior obrigatória não foi completada
      }
    }

    // Iniciar nova tarefa
    session.currentTask = test.tasks.findIndex(t => t.id === taskId);
    session.lastUpdated = Date.now();

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
    if (!session || session.status !== 'active') return false;

    const test = this.getTestById(session.testId);
    if (!test) return false;

    const task = test.tasks.find(t => t.id === taskId);
    if (!task) return false;

    // Atualizar tarefa
    task.isCompleted = true;
    task.completedAt = Date.now();
    task.userNotes = userNotes;
    task.screenshots = screenshots || [];
    task.success = success;
    task.attempts++;

    // Adicionar à lista de tarefas completadas
    if (!session.completedTasks.includes(taskId)) {
      session.completedTasks.push(taskId);
    }

    // Atualizar resultado da tarefa
    const existingResult = session.taskResults.find(r => r.taskId === taskId);
    if (existingResult) {
      existingResult.endTime = Date.now();
      existingResult.duration = existingResult.endTime - existingResult.startTime;
      existingResult.success = success;
      existingResult.userNotes = userNotes;
      existingResult.screenshots = screenshots || [];
    }

    session.lastUpdated = Date.now();

    // Verificar se todas as tarefas obrigatórias foram completadas
    this.checkTestCompletion(session, test);

    return true;
  }

  // Verificar se o teste foi completado
  private checkTestCompletion(session: TestSession, test: TestInterfaceConfig) {
    const requiredTasks = test.tasks.filter(t => t.required);
    const completedRequired = requiredTasks.every(t => 
      session.completedTasks.includes(t.id)
    );

    if (completedRequired) {
      session.status = 'completed';
      session.endTime = Date.now();
      session.duration = session.endTime - session.startTime;

      // Atualizar progresso do usuário
      this.updateUserProgress(session.userId, test);

      // Atualizar analytics do teste
      this.updateTestAnalytics(test.id);
    }
  }

  // Atualizar progresso do usuário
  private updateUserProgress(userId: string, test: TestInterfaceConfig) {
    let userProgress = this.userProgress.get(userId);
    
    if (!userProgress) {
      userProgress = {
        userId,
        completedTests: [],
        totalPoints: 0,
        badges: [],
        experience: 0,
        currentStreak: 0,
        longestStreak: 0,
        preferences: {
          preferredTestTypes: [],
          notificationEnabled: true,
          autoSave: true,
          privacyLevel: 'public'
        }
      };
      this.userProgress.set(userId, userProgress);
    }

    // Adicionar teste completado
    if (!userProgress.completedTests.includes(test.id)) {
      userProgress.completedTests.push(test.id);
    }

    // Adicionar pontos e experiência
    userProgress.totalPoints += test.rewards.points;
    userProgress.experience += test.rewards.experience;

    // Adicionar badges
    test.rewards.badges.forEach(badge => {
      if (!userProgress.badges.includes(badge)) {
        userProgress.badges.push(badge);
      }
    });

    // Atualizar streak
    const today = new Date().toDateString();
    const lastTestDate = userProgress.lastTestDate ? 
      new Date(userProgress.lastTestDate).toDateString() : null;

    if (lastTestDate === today) {
      // Mesmo dia, manter streak
    } else if (lastTestDate === new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()) {
      // Dia consecutivo
      userProgress.currentStreak++;
      if (userProgress.currentStreak > userProgress.longestStreak) {
        userProgress.longestStreak = userProgress.currentStreak;
      }
    } else {
      // Quebrar streak
      userProgress.currentStreak = 1;
    }

    userProgress.lastTestDate = Date.now();
  }

  // Registrar interação do usuário
  public recordUserInteraction(
    sessionId: string,
    taskId: string,
    interaction: Omit<UserInteraction, 'id' | 'timestamp'>
  ): boolean {
    const session = this.sessions.find(s => s.id === sessionId);
    if (!session || session.status !== 'active') return false;

    const newInteraction: UserInteraction = {
      ...interaction,
      id: `interaction_${Date.now()}`,
      timestamp: Date.now()
    };

    // Adicionar à sessão
    const taskResult = session.taskResults.find(r => r.taskId === taskId);
    if (taskResult) {
      taskResult.interactions.push(newInteraction);
    }

    session.lastUpdated = Date.now();
    return true;
  }

  // Adicionar feedback do usuário
  public addUserFeedback(
    sessionId: string,
    feedback: Omit<UserFeedback, 'id' | 'createdAt' | 'updatedAt'>
  ): UserFeedback | null {
    const session = this.sessions.find(s => s.id === sessionId);
    if (!session) return null;

    const newFeedback: UserFeedback = {
      ...feedback,
      id: `feedback_${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    session.userFeedback.push(newFeedback);
    session.lastUpdated = Date.now();

    return newFeedback;
  }

  // Pausar sessão
  public pauseSession(sessionId: string): boolean {
    const session = this.sessions.find(s => s.id === sessionId);
    if (!session || session.status !== 'active') return false;

    session.status = 'paused';
    session.lastUpdated = Date.now();
    return true;
  }

  // Retomar sessão
  public resumeSession(sessionId: string): boolean {
    const session = this.sessions.find(s => s.id === sessionId);
    if (!session || session.status !== 'paused') return false;

    session.status = 'active';
    session.lastUpdated = Date.now();
    return true;
  }

  // Abandonar sessão
  public abandonSession(sessionId: string): boolean {
    const session = this.sessions.find(s => s.id === sessionId);
    if (!session || session.status === 'completed') return false;

    session.status = 'abandoned';
    session.endTime = Date.now();
    session.duration = session.endTime - session.startTime;
    session.lastUpdated = Date.now();

    return true;
  }

  // Obter sessões do usuário
  public getUserSessions(userId: string): TestSession[] {
    return this.sessions
      .filter(s => s.userId === userId)
      .sort((a, b) => b.startTime - a.startTime);
  }

  // Obter sessão ativa do usuário
  public getUserActiveSession(userId: string): TestSession | undefined {
    return this.sessions.find(s => 
      s.userId === userId && s.status === 'active'
    );
  }

  // Obter progresso do usuário
  public getUserProgress(userId: string): UserProgress | undefined {
    return this.userProgress.get(userId);
  }

  // Atualizar analytics do teste
  private updateTestAnalytics(testId: string) {
    const test = this.getTestById(testId);
    if (!test) return;

    const testSessions = this.sessions.filter(s => s.testId === testId);
    const completedSessions = testSessions.filter(s => s.status === 'completed');
    const abandonedSessions = testSessions.filter(s => s.status === 'abandoned');

    const totalSessions = testSessions.length;
    const completedCount = completedSessions.length;
    const abandonedCount = abandonedSessions.length;

    // Calcular métricas
    const completionRate = totalSessions > 0 ? (completedCount / totalSessions) * 100 : 0;
    
    const totalTime = completedSessions.reduce((sum, s) => 
      sum + (s.duration || 0), 0
    );
    const averageTime = completedCount > 0 ? totalTime / completedCount : 0;

    // Calcular satisfação média
    const satisfactionScores = completedSessions
      .map(s => s.overallSatisfaction)
      .filter(score => score !== undefined);
    const averageSatisfaction = satisfactionScores.length > 0 ? 
      satisfactionScores.reduce((sum, score) => sum + score!, 0) / satisfactionScores.length : 0;

    // Calcular taxa de erro
    const totalTasks = completedSessions.reduce((sum, s) => 
      sum + s.taskResults.length, 0
    );
    const successfulTasks = completedSessions.reduce((sum, s) => 
      sum + s.taskResults.filter(r => r.success).length, 0
    );
    const errorRate = totalTasks > 0 ? ((totalTasks - successfulTasks) / totalTasks) * 100 : 0;

    // Atualizar métricas do teste
    test.metrics = {
      completionRate: Math.round(completionRate * 100) / 100,
      averageTime: Math.round(averageTime / 1000), // converter para segundos
      satisfactionScore: Math.round(averageSatisfaction * 100) / 100,
      errorRate: Math.round(errorRate * 100) / 100
    };

    // Criar ou atualizar analytics
    const analytics: TestAnalytics = {
      testId,
      totalSessions,
      completedSessions: completedCount,
      abandonedSessions: abandonedCount,
      averageCompletionTime: Math.round(averageTime / 1000),
      averageSatisfaction: Math.round(averageSatisfaction * 100) / 100,
      taskCompletionRates: this.calculateTaskCompletionRates(testId),
      commonIssues: this.identifyCommonIssues(testId),
      userDemographics: this.calculateUserDemographics(testId),
      feedbackSummary: this.summarizeFeedback(testId),
      recommendations: this.generateRecommendations(testId),
      lastUpdated: Date.now()
    };

    this.analytics.set(testId, analytics);
  }

  // Calcular taxas de conclusão por tarefa
  private calculateTaskCompletionRates(testId: string): { [taskId: string]: number } {
    const test = this.getTestById(testId);
    if (!test) return {};

    const rates: { [taskId: string]: number } = {};
    const testSessions = this.sessions.filter(s => s.testId === testId);

    test.tasks.forEach(task => {
      const sessionsWithTask = testSessions.filter(s => 
        s.taskResults.some(r => r.taskId === task.id)
      );
      const completedTask = testSessions.filter(s => 
        s.completedTasks.includes(task.id)
      );

      rates[task.id] = sessionsWithTask.length > 0 ? 
        (completedTask.length / sessionsWithTask.length) * 100 : 0;
    });

    return rates;
  }

  // Identificar problemas comuns
  private identifyCommonIssues(testId: string): string[] {
    const testSessions = this.sessions.filter(s => s.testId === testId);
    const allFeedback = testSessions.flatMap(s => s.userFeedback);

    // Agrupar feedback por categoria
    const feedbackByCategory = new Map<string, number>();
    allFeedback.forEach(feedback => {
      const count = feedbackByCategory.get(feedback.category) || 0;
      feedbackByCategory.set(feedback.category, count + 1);
    });

    // Retornar categorias mais frequentes
    return Array.from(feedbackByCategory.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category]) => category);
  }

  // Calcular demografia dos usuários
  private calculateUserDemographics(testId: string): {
    platforms: { [platform: string]: number };
    experienceLevels: { [level: string]: number };
    locations: { [location: string]: number };
  } {
    const testSessions = this.sessions.filter(s => s.testId === testId);
    
    const platforms: { [platform: string]: number } = {};
    const experienceLevels: { [level: string]: number } = {};
    const locations: { [location: string]: number } = {};

    testSessions.forEach(session => {
      // Plataforma
      const platform = session.deviceInfo.platform;
      platforms[platform] = (platforms[platform] || 0) + 1;

      // Localização (simulado)
      const location = 'brazil'; // Em produção, obter da localização do usuário
      locations[location] = (locations[location] || 0) + 1;
    });

    return { platforms, experienceLevels, locations };
  }

  // Resumir feedback
  private summarizeFeedback(testId: string): {
    bugReports: number;
    featureRequests: number;
    usabilityIssues: number;
    generalFeedback: number;
  } {
    const testSessions = this.sessions.filter(s => s.testId === testId);
    const allFeedback = testSessions.flatMap(s => s.userFeedback);

    return {
      bugReports: allFeedback.filter(f => f.type === 'bug_report').length,
      featureRequests: allFeedback.filter(f => f.type === 'feature_request').length,
      usabilityIssues: allFeedback.filter(f => f.type === 'usability_issue').length,
      generalFeedback: allFeedback.filter(f => f.type === 'general_feedback').length
    };
  }

  // Gerar recomendações
  private generateRecommendations(testId: string): string[] {
    const analytics = this.analytics.get(testId);
    if (!analytics) return [];

    const recommendations: string[] = [];

    // Recomendações baseadas na taxa de conclusão
    if (analytics.completionRate < 70) {
      recommendations.push('Simplificar tarefas ou adicionar mais instruções');
      recommendations.push('Reduzir tempo estimado das tarefas');
    }

    // Recomendações baseadas na satisfação
    if (analytics.averageSatisfaction < 3.5) {
      recommendations.push('Revisar interface e experiência do usuário');
      recommendations.push('Adicionar mais feedback visual durante as tarefas');
    }

    // Recomendações baseadas na taxa de erro
    if (analytics.errorRate > 30) {
      recommendations.push('Melhorar instruções e critérios de sucesso');
      recommendations.push('Adicionar mais dicas e orientações');
    }

    // Recomendações baseadas no feedback
    if (analytics.feedbackSummary.bugReports > analytics.feedbackSummary.featureRequests) {
      recommendations.push('Priorizar correção de bugs antes de novas funcionalidades');
    }

    return recommendations;
  }

  // Obter analytics do teste
  public getTestAnalytics(testId: string): TestAnalytics | undefined {
    return this.analytics.get(testId);
  }

  // Obter analytics gerais
  public getGeneralAnalytics(): {
    totalTests: number;
    activeTests: number;
    totalSessions: number;
    completedSessions: number;
    averageCompletionRate: number;
    totalParticipants: number;
    mostPopularTest: string;
  } {
    const totalTests = this.tests.length;
    const activeTests = this.tests.filter(t => t.status === 'active').length;
    const totalSessions = this.sessions.length;
    const completedSessions = this.sessions.filter(s => s.status === 'completed').length;
    const totalParticipants = this.userProgress.size;

    const averageCompletionRate = totalSessions > 0 ? 
      (completedSessions / totalSessions) * 100 : 0;

    // Teste mais popular
    const testPopularity = this.tests.map(test => ({
      name: test.name,
      participants: test.schedule.currentParticipants
    }));

    const mostPopularTest = testPopularity
      .sort((a, b) => b.participants - a.participants)[0]?.name || 'N/A';

    return {
      totalTests,
      activeTests,
      totalSessions,
      completedSessions,
      averageCompletionRate: Math.round(averageCompletionRate * 100) / 100,
      totalParticipants,
      mostPopularTest
    };
  }

  // Buscar testes por critérios
  public searchTests(criteria: {
    type?: string;
    difficulty?: string;
    duration?: number;
    features?: string[];
    status?: string;
  }): TestInterfaceConfig[] {
    let filteredTests = this.tests;

    if (criteria.type) {
      filteredTests = filteredTests.filter(t => t.type === criteria.type);
    }

    if (criteria.difficulty) {
      filteredTests = filteredTests.filter(t => 
        t.tasks.some(task => task.difficulty === criteria.difficulty)
      );
    }

    if (criteria.duration) {
      filteredTests = filteredTests.filter(t => t.schedule.duration <= criteria.duration);
    }

    if (criteria.features && criteria.features.length > 0) {
      filteredTests = filteredTests.filter(t => 
        criteria.features!.some(feature => t.features.includes(feature))
      );
    }

    if (criteria.status) {
      filteredTests = filteredTests.filter(t => t.status === criteria.status);
    }

    return filteredTests;
  }

  // Sugerir próximo teste
  public suggestNextTest(userId: string): TestInterfaceConfig | null {
    const userProgress = this.userProgress.get(userId);
    if (!userProgress) return null;

    const completedTests = userProgress.completedTests;
    const availableTests = this.tests.filter(t => 
      t.status === 'active' &&
      !completedTests.includes(t.id) &&
      t.schedule.currentParticipants < t.schedule.maxParticipants
    );

    if (availableTests.length === 0) return null;

    // Ordenar por pontos de recompensa e dificuldade
    availableTests.sort((a, b) => {
      const aDifficulty = Math.max(...a.tasks.map(t => 
        t.difficulty === 'easy' ? 1 : t.difficulty === 'medium' ? 2 : 3
      ));
      const bDifficulty = Math.max(...b.tasks.map(t => 
        t.difficulty === 'easy' ? 1 : t.difficulty === 'medium' ? 2 : 3
      ));

      if (aDifficulty !== bDifficulty) return aDifficulty - bDifficulty;
      return b.rewards.points - a.rewards.points;
    });

    return availableTests[0];
  }
}

export function createUserTestingInterface(): UserTestingInterface {
  return new UserTestingInterface();
}