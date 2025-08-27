export interface ExplorerRoute {
  id: string;
  name: string;
  description: string;
  type: 'random' | 'curated' | 'challenge' | 'discovery';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  distance: number; // km
  estimatedTime: number; // minutos
  elevation: number; // metros
  terrain: 'flat' | 'hilly' | 'mountainous' | 'mixed';
  surface: 'asphalt' | 'dirt' | 'grass' | 'mixed';
  waypoints: ExplorerWaypoint[];
  secretPoints: SecretPoint[];
  rewards: {
    points: number;
    badges: string[];
    experience: number;
    unlockables: string[];
  };
  requirements: {
    minLevel: number;
    achievements: string[];
    previousRoutes: string[];
  };
  isActive: boolean;
  createdAt: number;
  createdBy: string;
  completionStats: {
    totalAttempts: number;
    successfulCompletions: number;
    averageCompletionTime: number;
    bestTime: number;
    bestRunner: string;
  };
}

export interface ExplorerWaypoint {
  id: string;
  name: string;
  description: string;
  type: 'landmark' | 'checkpoint' | 'challenge' | 'rest' | 'viewpoint';
  coordinates: {
    latitude: number;
    longitude: number;
    altitude?: number;
  };
  order: number;
  isRequired: boolean;
  challenge?: {
    type: 'photo' | 'question' | 'activity' | 'social';
    description: string;
    points: number;
    timeLimit?: number; // segundos
  };
  photo?: {
    url: string;
    description: string;
    required: boolean;
  };
  trivia?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
}

export interface SecretPoint {
  id: string;
  name: string;
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
    altitude?: number;
  };
  type: 'treasure' | 'mystery' | 'achievement' | 'bonus';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlockCondition: {
    type: 'distance' | 'time' | 'speed' | 'exploration' | 'combination';
    value: number;
    unit?: string;
    additionalRequirements?: string[];
  };
  rewards: {
    points: number;
    badges: string[];
    experience: number;
    items: ExplorerItem[];
    unlockables: string[];
  };
  isHidden: boolean;
  discoveryRadius: number; // metros
  isDiscovered: boolean;
  discoveredBy?: string;
  discoveredAt?: number;
}

export interface ExplorerItem {
  id: string;
  name: string;
  description: string;
  type: 'badge' | 'title' | 'powerup' | 'cosmetic' | 'currency';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  icon: string;
  isStackable: boolean;
  maxStack?: number;
  quantity: number;
  effects?: {
    type: string;
    value: number;
    duration?: number;
  }[];
  unlockDate?: number;
}

export interface ExplorerSession {
  id: string;
  userId: string;
  routeId: string;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  startTime: number;
  endTime?: number;
  duration?: number; // segundos
  currentWaypoint: number;
  completedWaypoints: string[];
  discoveredSecrets: string[];
  collectedItems: ExplorerItem[];
  progress: {
    distance: number;
    waypointsCompleted: number;
    secretsFound: number;
    totalPoints: number;
    timeElapsed: number;
  };
  challenges: {
    waypointId: string;
    type: string;
    completed: boolean;
    score: number;
    timeSpent: number;
  }[];
  photos: {
    waypointId: string;
    url: string;
    timestamp: number;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  }[];
  achievements: string[];
  lastUpdated: number;
}

export interface ExplorerAchievement {
  id: string;
  name: string;
  description: string;
  category: 'exploration' | 'speed' | 'distance' | 'discovery' | 'social';
  requirements: {
    type: 'single' | 'cumulative' | 'consecutive' | 'combination';
    value: number;
    unit?: string;
    conditions?: string[];
  };
  rewards: {
    points: number;
    experience: number;
    badges: string[];
    unlockables: string[];
  };
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  isHidden: boolean;
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  completedAt?: number;
}

export interface ExplorerManager {
  routes: ExplorerRoute[];
  sessions: ExplorerSession[];
  achievements: ExplorerAchievement[];
  items: ExplorerItem[];
}

export class ExplorerManager {
  private routes: ExplorerRoute[] = [];
  private sessions: ExplorerSession[] = [];
  private achievements: ExplorerAchievement[] = [];
  private items: ExplorerItem[] = [];

  constructor() {
    this.initializeExplorerData();
  }

  private initializeExplorerData() {
    // Inicializar rotas exploradoras
    const sampleRoutes: ExplorerRoute[] = [
      {
        id: 'route_1',
        name: 'Descoberta Paulista',
        description: 'Explore os segredos da Avenida Paulista e descubra pontos históricos escondidos',
        type: 'discovery',
        difficulty: 'easy',
        distance: 3.2,
        estimatedTime: 25,
        elevation: 45,
        terrain: 'flat',
        surface: 'asphalt',
        waypoints: [
          {
            id: 'wp_1',
            name: 'MASP',
            description: 'Museu de Arte de São Paulo - Tire uma foto da arquitetura icônica',
            type: 'landmark',
            coordinates: {
              latitude: -23.5614,
              longitude: -46.6564
            },
            order: 1,
            isRequired: true,
            challenge: {
              type: 'photo',
              description: 'Tire uma foto do MASP',
              points: 50,
              timeLimit: 300
            },
            photo: {
              url: 'https://example.com/masp.jpg',
              description: 'MASP - Museu de Arte de São Paulo',
              required: true
            }
          },
          {
            id: 'wp_2',
            name: 'Parque Trianon',
            description: 'Oásis verde no meio da cidade - Descubra a história do parque',
            type: 'checkpoint',
            coordinates: {
              latitude: -23.5589,
              longitude: -46.6589
            },
            order: 2,
            isRequired: true,
            trivia: {
              question: 'Em que ano foi inaugurado o Parque Trianon?',
              options: ['1924', '1934', '1944', '1954'],
              correctAnswer: 0,
              explanation: 'O Parque Trianon foi inaugurado em 1924, projetado pelo paisagista francês Paul Villon.'
            }
          }
        ],
        secretPoints: [
          {
            id: 'secret_1',
            name: 'Vista Secreta',
            description: 'Ponto de vista escondido com vista panorâmica da cidade',
            coordinates: {
              latitude: -23.5595,
              longitude: -46.6575
            },
            type: 'viewpoint',
            rarity: 'rare',
            unlockCondition: {
              type: 'exploration',
              value: 2,
              unit: 'waypoints',
              additionalRequirements: ['photo_challenge_completed']
            },
            rewards: {
              points: 200,
              badges: ['secret_explorer'],
              experience: 150,
              items: [
                {
                  id: 'item_1',
                  name: 'Badge Vista Secreta',
                  description: 'Conquistado ao descobrir um ponto de vista escondido',
                  type: 'badge',
                  rarity: 'rare',
                  icon: '🏆',
                  isStackable: false,
                  quantity: 1
                }
              ],
              unlockables: ['route_paulista_night']
            },
            isHidden: true,
            discoveryRadius: 50,
            isDiscovered: false
          }
        ],
        rewards: {
          points: 500,
          badges: ['paulista_explorer', 'city_discoverer'],
          experience: 300,
          unlockables: ['route_paulista_extended']
        },
        requirements: {
          minLevel: 1,
          achievements: [],
          previousRoutes: []
        },
        isActive: true,
        createdAt: Date.now(),
        createdBy: 'system',
        completionStats: {
          totalAttempts: 45,
          successfulCompletions: 38,
          averageCompletionTime: 28,
          bestTime: 18,
          bestRunner: 'João Silva'
        }
      },
      {
        id: 'route_2',
        name: 'Caça ao Tesouro Ibirapuera',
        description: 'Aventure-se pelo parque e descubra 10 pontos secretos escondidos',
        type: 'challenge',
        difficulty: 'medium',
        distance: 5.8,
        estimatedTime: 45,
        elevation: 120,
        terrain: 'mixed',
        surface: 'mixed',
        waypoints: [
          {
            id: 'wp_3',
            name: 'Monumento às Bandeiras',
            description: 'Monumento histórico - Resolva o enigma escondido',
            type: 'challenge',
            coordinates: {
              latitude: -23.5874,
              longitude: -46.6576
            },
            order: 1,
            isRequired: true,
            challenge: {
              type: 'question',
              description: 'Quantas bandeiras estão representadas no monumento?',
              points: 100,
              timeLimit: 600
            },
            trivia: {
              question: 'Quantas bandeiras estão representadas no Monumento às Bandeiras?',
              options: ['12', '16', '20', '24'],
              correctAnswer: 1,
              explanation: 'O monumento representa 16 bandeiras, simbolizando os estados brasileiros da época.'
            }
          }
        ],
        secretPoints: [
          {
            id: 'secret_2',
            name: 'Baú do Tesouro',
            description: 'Baú virtual com recompensas especiais - Desbloqueie a cada 5km',
            coordinates: {
              latitude: -23.5880,
              longitude: -46.6580
            },
            type: 'treasure',
            rarity: 'epic',
            unlockCondition: {
              type: 'distance',
              value: 5,
              unit: 'km'
            },
            rewards: {
              points: 500,
              badges: ['treasure_hunter'],
              experience: 300,
              items: [
                {
                  id: 'item_2',
                  name: 'Chave Dourada',
                  description: 'Chave para desbloquear rotas secretas',
                  type: 'powerup',
                  rarity: 'epic',
                  icon: '🔑',
                  isStackable: true,
                  maxStack: 5,
                  quantity: 1
                }
              ],
              unlockables: ['secret_ibirapuera_route']
            },
            isHidden: false,
            discoveryRadius: 100,
            isDiscovered: false
          }
        ],
        rewards: {
          points: 1000,
          badges: ['ibirapuera_master', 'treasure_hunter'],
          experience: 600,
          unlockables: ['route_ibirapuera_night', 'route_ibirapuera_extreme']
        },
        requirements: {
          minLevel: 3,
          achievements: ['paulista_explorer'],
          previousRoutes: ['route_1']
        },
        isActive: true,
        createdAt: Date.now(),
        createdBy: 'system',
        completionStats: {
          totalAttempts: 23,
          successfulCompletions: 15,
          averageCompletionTime: 52,
          bestTime: 38,
          bestRunner: 'Maria Santos'
        }
      }
    ];

    this.routes.push(...sampleRoutes);

    // Inicializar conquistas
    const sampleAchievements: ExplorerAchievement[] = [
      {
        id: 'achievement_1',
        name: 'Primeiro Explorador',
        description: 'Complete sua primeira rota exploradora',
        category: 'exploration',
        requirements: {
          type: 'single',
          value: 1,
          unit: 'route'
        },
        rewards: {
          points: 100,
          experience: 50,
          badges: ['first_explorer'],
          unlockables: []
        },
        rarity: 'common',
        isHidden: false,
        progress: 0,
        maxProgress: 1,
        isCompleted: false
      },
      {
        id: 'achievement_2',
        name: 'Caçador de Segredos',
        description: 'Descubra 10 pontos secretos',
        category: 'discovery',
        requirements: {
          type: 'cumulative',
          value: 10,
          unit: 'secret_points'
        },
        rewards: {
          points: 500,
          experience: 200,
          badges: ['secret_hunter'],
          unlockables: ['special_explorer_routes']
        },
        rarity: 'rare',
        isHidden: false,
        progress: 0,
        maxProgress: 10,
        isCompleted: false
      },
      {
        id: 'achievement_3',
        name: 'Mestre Explorador',
        description: 'Complete 25 rotas exploradoras',
        category: 'exploration',
        requirements: {
          type: 'cumulative',
          value: 25,
          unit: 'routes'
        },
        rewards: {
          points: 2000,
          experience: 1000,
          badges: ['master_explorer'],
          unlockables: ['legendary_routes', 'exclusive_items']
        },
        rarity: 'legendary',
        isHidden: false,
        progress: 0,
        maxProgress: 25,
        isCompleted: false
      }
    ];

    this.achievements.push(...sampleAchievements);
  }

  // Obter rotas disponíveis
  public getAvailableRoutes(userLevel: number = 1): ExplorerRoute[] {
    return this.routes.filter(route => 
      route.isActive && route.requirements.minLevel <= userLevel
    );
  }

  // Obter rota por ID
  public getRouteById(routeId: string): ExplorerRoute | undefined {
    return this.routes.find(route => route.id === routeId);
  }

  // Obter rotas por tipo
  public getRoutesByType(type: string): ExplorerRoute[] {
    return this.routes.filter(route => route.type === type && route.isActive);
  }

  // Obter rotas por dificuldade
  public getRoutesByDifficulty(difficulty: string): ExplorerRoute[] {
    return this.routes.filter(route => route.difficulty === difficulty && route.isActive);
  }

  // Gerar rota aleatória
  public generateRandomRoute(
    userId: string,
    preferences: {
      maxDistance: number;
      difficulty: string;
      terrain: string;
      estimatedTime: number;
    }
  ): ExplorerRoute | null {
    const availableRoutes = this.routes.filter(route => 
      route.isActive &&
      route.distance <= preferences.maxDistance &&
      route.difficulty === preferences.difficulty &&
      route.terrain === preferences.terrain &&
      route.estimatedTime <= preferences.estimatedTime
    );

    if (availableRoutes.length === 0) return null;

    // Selecionar rota aleatória
    const randomIndex = Math.floor(Math.random() * availableRoutes.length);
    return availableRoutes[randomIndex];
  }

  // Iniciar sessão exploradora
  public startExplorerSession(
    userId: string,
    routeId: string
  ): ExplorerSession | null {
    const route = this.getRouteById(routeId);
    if (!route) return null;

    // Verificar se já existe sessão ativa
    const existingSession = this.sessions.find(s => 
      s.userId === userId && s.status === 'active'
    );

    if (existingSession) {
      return existingSession;
    }

    const session: ExplorerSession = {
      id: `session_${Date.now()}`,
      userId,
      routeId,
      status: 'active',
      startTime: Date.now(),
      currentWaypoint: 0,
      completedWaypoints: [],
      discoveredSecrets: [],
      collectedItems: [],
      progress: {
        distance: 0,
        waypointsCompleted: 0,
        secretsFound: 0,
        totalPoints: 0,
        timeElapsed: 0
      },
      challenges: [],
      photos: [],
      achievements: [],
      lastUpdated: Date.now()
    };

    this.sessions.push(session);
    return session;
  }

  // Atualizar progresso da sessão
  public updateSessionProgress(
    sessionId: string,
    updates: {
      distance?: number;
      waypointCompleted?: string;
      secretFound?: string;
      itemCollected?: ExplorerItem;
      photoTaken?: {
        waypointId: string;
        url: string;
        coordinates: { latitude: number; longitude: number };
      };
      challengeCompleted?: {
        waypointId: string;
        type: string;
        score: number;
        timeSpent: number;
      };
    }
  ): boolean {
    const session = this.sessions.find(s => s.id === sessionId);
    if (!session) return false;

    // Atualizar distância
    if (updates.distance !== undefined) {
      session.progress.distance = updates.distance;
    }

    // Completar waypoint
    if (updates.waypointCompleted) {
      if (!session.completedWaypoints.includes(updates.waypointCompleted)) {
        session.completedWaypoints.push(updates.waypointCompleted);
        session.progress.waypointsCompleted++;
        session.progress.totalPoints += 50; // Pontos por waypoint
      }
    }

    // Descobrir ponto secreto
    if (updates.secretFound) {
      if (!session.discoveredSecrets.includes(updates.secretFound)) {
        session.discoveredSecrets.push(updates.secretFound);
        session.progress.secretsFound++;
        session.progress.totalPoints += 200; // Pontos por segredo
      }
    }

    // Coletar item
    if (updates.itemCollected) {
      const existingItem = session.collectedItems.find(item => item.id === updates.itemCollected!.id);
      if (existingItem && existingItem.isStackable) {
        existingItem.quantity += updates.itemCollected.quantity;
      } else {
        session.collectedItems.push(updates.itemCollected);
      }
    }

    // Tirar foto
    if (updates.photoTaken) {
      session.photos.push({
        waypointId: updates.photoTaken.waypointId,
        url: updates.photoTaken.url,
        timestamp: Date.now(),
        coordinates: updates.photoTaken.coordinates
      });
    }

    // Completar desafio
    if (updates.challengeCompleted) {
      const existingChallenge = session.challenges.find(c => c.waypointId === updates.challengeCompleted!.waypointId);
      if (existingChallenge) {
        existingChallenge.completed = true;
        existingChallenge.score = updates.challengeCompleted.score;
        existingChallenge.timeSpent = updates.challengeCompleted.timeSpent;
      } else {
        session.challenges.push({
          waypointId: updates.challengeCompleted.waypointId,
          type: updates.challengeCompleted.type,
          completed: true,
          score: updates.challengeCompleted.score,
          timeSpent: updates.challengeCompleted.timeSpent
        });
      }
    }

    session.lastUpdated = Date.now();
    session.progress.timeElapsed = Date.now() - session.startTime;

    // Verificar se a rota foi completada
    this.checkRouteCompletion(session);

    return true;
  }

  // Verificar se a rota foi completada
  private checkRouteCompletion(session: ExplorerSession) {
    const route = this.getRouteById(session.routeId);
    if (!route) return;

    const requiredWaypoints = route.waypoints.filter(wp => wp.isRequired);
    const completedRequired = requiredWaypoints.every(wp => 
      session.completedWaypoints.includes(wp.id)
    );

    if (completedRequired) {
      session.status = 'completed';
      session.endTime = Date.now();
      session.duration = session.endTime - session.startTime;

      // Calcular pontos finais
      const timeBonus = Math.max(0, 1000 - session.progress.timeElapsed / 1000); // Bônus por tempo
      const distanceBonus = session.progress.distance * 10; // Bônus por distância
      const secretBonus = session.progress.secretsFound * 100; // Bônus por segredos

      session.progress.totalPoints += timeBonus + distanceBonus + secretBonus;

      // Verificar conquistas
      this.checkExplorerAchievements(session);

      // Atualizar estatísticas da rota
      this.updateRouteStats(route, session);
    }
  }

  // Verificar conquistas exploradoras
  private checkExplorerAchievements(session: ExplorerSession) {
    this.achievements.forEach(achievement => {
      if (achievement.isCompleted) return;

      let progress = 0;
      let shouldComplete = false;

      switch (achievement.requirements.type) {
        case 'single':
          if (achievement.requirements.unit === 'route') {
            progress = 1;
            shouldComplete = true;
          }
          break;
        case 'cumulative':
          if (achievement.requirements.unit === 'secret_points') {
            progress = session.progress.secretsFound;
            shouldComplete = progress >= achievement.requirements.value;
          } else if (achievement.requirements.unit === 'routes') {
            const userSessions = this.sessions.filter(s => 
              s.userId === session.userId && s.status === 'completed'
            );
            progress = userSessions.length;
            shouldComplete = progress >= achievement.requirements.value;
          }
          break;
      }

      if (shouldComplete) {
        achievement.isCompleted = true;
        achievement.completedAt = Date.now();
        session.achievements.push(achievement.id);
      } else {
        achievement.progress = progress;
      }
    });
  }

  // Atualizar estatísticas da rota
  private updateRouteStats(route: ExplorerRoute, session: ExplorerSession) {
    route.completionStats.totalAttempts++;
    route.completionStats.successfulCompletions++;

    // Atualizar tempo médio
    const totalTime = route.completionStats.averageCompletionTime * (route.completionStats.successfulCompletions - 1);
    route.completionStats.averageCompletionTime = Math.round(
      (totalTime + session.progress.timeElapsed / 60000) / route.completionStats.successfulCompletions
    );

    // Verificar melhor tempo
    const sessionTime = session.progress.timeElapsed / 60000; // converter para minutos
    if (route.completionStats.bestTime === 0 || sessionTime < route.completionStats.bestTime) {
      route.completionStats.bestTime = Math.round(sessionTime);
      route.completionStats.bestRunner = 'Usuário Atual'; // Em produção, buscar nome real
    }
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

    // Atualizar estatísticas da rota
    const route = this.getRouteById(session.routeId);
    if (route) {
      route.completionStats.totalAttempts++;
    }

    return true;
  }

  // Obter sessões do usuário
  public getUserSessions(userId: string): ExplorerSession[] {
    return this.sessions
      .filter(s => s.userId === userId)
      .sort((a, b) => b.startTime - a.startTime);
  }

  // Obter sessão ativa do usuário
  public getUserActiveSession(userId: string): ExplorerSession | undefined {
    return this.sessions.find(s => 
      s.userId === userId && s.status === 'active'
    );
  }

  // Obter conquistas do usuário
  public getUserAchievements(userId: string): ExplorerAchievement[] {
    const userSessions = this.sessions.filter(s => s.userId === userId);
    const completedRoutes = userSessions.filter(s => s.status === 'completed').length;
    const totalSecrets = userSessions.reduce((sum, s) => sum + s.progress.secretsFound, 0);

    // Atualizar progresso das conquistas
    this.achievements.forEach(achievement => {
      if (achievement.isCompleted) return;

      switch (achievement.requirements.unit) {
        case 'route':
          achievement.progress = completedRoutes;
          break;
        case 'secret_points':
          achievement.progress = totalSecrets;
          break;
      }
    });

    return this.achievements;
  }

  // Obter itens do usuário
  public getUserItems(userId: string): ExplorerItem[] {
    const userSessions = this.sessions.filter(s => s.userId === userId);
    const allItems: ExplorerItem[] = [];

    userSessions.forEach(session => {
      session.collectedItems.forEach(item => {
        const existingItem = allItems.find(i => i.id === item.id);
        if (existingItem && item.isStackable) {
          existingItem.quantity += item.quantity;
        } else {
          allItems.push({ ...item });
        }
      });
    });

    return allItems;
  }

  // Obter estatísticas exploradoras
  public getExplorerStats(): {
    totalRoutes: number;
    activeRoutes: number;
    totalSessions: number;
    completedSessions: number;
    totalAchievements: number;
    totalItems: number;
    averageCompletionRate: number;
    mostPopularRoute: string;
  } {
    const totalRoutes = this.routes.length;
    const activeRoutes = this.routes.filter(r => r.isActive).length;
    const totalSessions = this.sessions.length;
    const completedSessions = this.sessions.filter(s => s.status === 'completed').length;
    const totalAchievements = this.achievements.length;
    const totalItems = this.items.length;

    const averageCompletionRate = totalSessions > 0 ? 
      (completedSessions / totalSessions) * 100 : 0;

    // Rota mais popular
    const routeStats = this.routes.map(route => ({
      name: route.name,
      attempts: route.completionStats.totalAttempts
    }));

    const mostPopularRoute = routeStats
      .sort((a, b) => b.attempts - a.attempts)[0]?.name || 'N/A';

    return {
      totalRoutes,
      activeRoutes,
      totalSessions,
      completedSessions,
      totalAchievements,
      totalItems,
      averageCompletionRate: Math.round(averageCompletionRate * 100) / 100,
      mostPopularRoute
    };
  }

  // Buscar rotas por critérios
  public searchRoutes(criteria: {
    type?: string;
    difficulty?: string;
    terrain?: string;
    maxDistance?: number;
    maxTime?: number;
    hasSecrets?: boolean;
    minRating?: number;
  }): ExplorerRoute[] {
    let filteredRoutes = this.routes.filter(r => r.isActive);

    if (criteria.type) {
      filteredRoutes = filteredRoutes.filter(r => r.type === criteria.type);
    }

    if (criteria.difficulty) {
      filteredRoutes = filteredRoutes.filter(r => r.difficulty === criteria.difficulty);
    }

    if (criteria.terrain) {
      filteredRoutes = filteredRoutes.filter(r => r.terrain === criteria.terrain);
    }

    if (criteria.maxDistance) {
      filteredRoutes = filteredRoutes.filter(r => r.distance <= criteria.maxDistance);
    }

    if (criteria.maxTime) {
      filteredRoutes = filteredRoutes.filter(r => r.estimatedTime <= criteria.maxTime);
    }

    if (criteria.hasSecrets) {
      filteredRoutes = filteredRoutes.filter(r => r.secretPoints.length > 0);
    }

    return filteredRoutes;
  }

  // Sugerir próxima rota
  public suggestNextRoute(
    userId: string,
    userLevel: number,
    preferences: {
      difficulty: string;
      terrain: string;
      maxDistance: number;
    }
  ): ExplorerRoute | null {
    const completedRoutes = this.sessions
      .filter(s => s.userId === userId && s.status === 'completed')
      .map(s => s.routeId);

    const availableRoutes = this.routes.filter(route => 
      route.isActive &&
      !completedRoutes.includes(route.id) &&
      route.requirements.minLevel <= userLevel &&
      route.difficulty === preferences.difficulty &&
      route.terrain === preferences.terrain &&
      route.distance <= preferences.maxDistance
    );

    if (availableRoutes.length === 0) return null;

    // Ordenar por dificuldade e distância
    availableRoutes.sort((a, b) => {
      const difficultyOrder = { easy: 1, medium: 2, hard: 3, expert: 4 };
      const aDiff = difficultyOrder[a.difficulty as keyof typeof difficultyOrder];
      const bDiff = difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
      
      if (aDiff !== bDiff) return aDiff - bDiff;
      return a.distance - b.distance;
    });

    return availableRoutes[0];
  }
}

export function createExplorerManager(): ExplorerManager {
  return new ExplorerManager();
}