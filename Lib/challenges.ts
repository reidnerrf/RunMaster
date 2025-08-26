export interface ChallengeTask {
  id: string;
  name: string;
  description: string;
  type: 'distance' | 'frequency' | 'streak' | 'time' | 'social' | 'custom';
  target: number; // Valor alvo (km, dias, etc.)
  current: number; // Valor atual
  unit: string; // Unidade (km, dias, horas, etc.)
  isCompleted: boolean;
  completedAt?: number;
  reward: {
    points: number;
    experience: number;
    badge?: string;
    unlock?: string;
  };
}

export interface ChallengeLevel {
  id: string;
  level: number;
  name: string;
  description: string;
  requiredTasks: string[]; // IDs das tasks necessárias
  tasks: ChallengeTask[];
  isUnlocked: boolean;
  isCompleted: boolean;
  completedAt?: number;
  reward: {
    points: number;
    experience: number;
    badge: string;
    title?: string;
    specialFeature?: string;
  };
  nextLevel?: string; // ID do próximo nível
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  category: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'special';
  startDate: number;
  endDate: number;
  levels: ChallengeLevel[];
  currentLevel: number;
  totalParticipants: number;
  isActive: boolean;
  tags: string[];
  imageUrl?: string;
  communityId?: string; // Se for desafio de comunidade
}

export interface UserChallengeProgress {
  userId: string;
  challengeId: string;
  currentLevel: number;
  completedLevels: string[];
  totalPoints: number;
  totalExperience: number;
  badges: string[];
  startedAt: number;
  lastActivityAt: number;
}

export class ChallengeManager {
  private challenges: Challenge[] = [];
  private userProgress: UserChallengeProgress[] = [];

  constructor() {
    this.initializeSampleChallenges();
  }

  private initializeSampleChallenges() {
    // Desafio Semanal de Resistência
    const weeklyChallenge: Challenge = {
      id: 'challenge_weekly_resistance',
      name: 'Desafio Semanal de Resistência',
      description: 'Aumente sua resistência correndo consistentemente',
      category: 'weekly',
      startDate: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 dias atrás
      endDate: Date.now() + 4 * 24 * 60 * 60 * 1000, // 4 dias restantes
      levels: [],
      currentLevel: 1,
      totalParticipants: 45,
      isActive: true,
      tags: ['resistencia', 'consistencia', 'semanal']
    };

    // Nível 1: Iniciante
    const level1: ChallengeLevel = {
      id: 'level_1_weekly',
      level: 1,
      name: 'Iniciante',
      description: 'Comece sua jornada de resistência',
      requiredTasks: [],
      tasks: [
        {
          id: 'task_1_1',
          name: 'Primeira Corrida',
          description: 'Complete sua primeira corrida da semana',
          type: 'frequency',
          target: 1,
          current: 0,
          unit: 'corrida',
          isCompleted: false,
          reward: {
            points: 50,
            experience: 100
          }
        },
        {
          id: 'task_1_2',
          name: 'Distância Mínima',
          description: 'Corra pelo menos 3km',
          type: 'distance',
          target: 3,
          current: 0,
          unit: 'km',
          isCompleted: false,
          reward: {
            points: 75,
            experience: 150
          }
        }
      ],
      isUnlocked: true,
      isCompleted: false,
      reward: {
        points: 125,
        experience: 250,
        badge: '🏃‍♂️ Iniciante'
      },
      nextLevel: 'level_2_weekly'
    };

    // Nível 2: Consistente
    const level2: ChallengeLevel = {
      id: 'level_2_weekly',
      level: 2,
      name: 'Consistente',
      description: 'Mantenha a consistência na sua rotina',
      requiredTasks: ['task_1_1', 'task_1_2'],
      tasks: [
        {
          id: 'task_2_1',
          name: 'Dois Dias Seguidos',
          description: 'Corra por dois dias consecutivos',
          type: 'streak',
          target: 2,
          current: 0,
          unit: 'dias',
          isCompleted: false,
          reward: {
            points: 100,
            experience: 200
          }
        },
        {
          id: 'task_2_2',
          name: 'Distância Média',
          description: 'Corra pelo menos 5km em uma sessão',
          type: 'distance',
          target: 5,
          current: 0,
          unit: 'km',
          isCompleted: false,
          reward: {
            points: 125,
            experience: 250
          }
        }
      ],
      isUnlocked: false,
      isCompleted: false,
      reward: {
        points: 225,
        experience: 450,
        badge: '🔥 Consistente'
      },
      nextLevel: 'level_3_weekly'
    };

    // Nível 3: Avançado
    const level3: ChallengeLevel = {
      id: 'level_3_weekly',
      level: 3,
      name: 'Avançado',
      description: 'Desafie seus limites',
      requiredTasks: ['task_2_1', 'task_2_2'],
      tasks: [
        {
          id: 'task_3_1',
          name: 'Três Dias Seguidos',
          description: 'Corra por três dias consecutivos',
          type: 'streak',
          target: 3,
          current: 0,
          unit: 'dias',
          isCompleted: false,
          reward: {
            points: 150,
            experience: 300
          }
        },
        {
          id: 'task_3_2',
          name: 'Distância Longa',
          description: 'Corra pelo menos 8km em uma sessão',
          type: 'distance',
          target: 8,
          current: 0,
          unit: 'km',
          isCompleted: false,
          reward: {
            points: 200,
            experience: 400
          }
        },
        {
          id: 'task_3_3',
          name: 'Tempo Total',
          description: 'Acumule pelo menos 2 horas de corrida na semana',
          type: 'time',
          target: 120,
          current: 0,
          unit: 'minutos',
          isCompleted: false,
          reward: {
            points: 175,
            experience: 350
          }
        }
      ],
      isUnlocked: false,
      isCompleted: false,
      reward: {
        points: 525,
        experience: 1050,
        badge: '⚡ Avançado',
        title: 'Corredor Semanal'
      },
      nextLevel: 'level_4_weekly'
    };

    // Nível 4: Elite
    const level4: ChallengeLevel = {
      id: 'level_4_weekly',
      level: 4,
      name: 'Elite',
      description: 'Alcance o status de elite',
      requiredTasks: ['task_3_1', 'task_3_2', 'task_3_3'],
      tasks: [
        {
          id: 'task_4_1',
          name: 'Quatro Dias Seguidos',
          description: 'Corra por quatro dias consecutivos',
          type: 'streak',
          target: 4,
          current: 0,
          unit: 'dias',
          isCompleted: false,
          reward: {
            points: 250,
            experience: 500
          }
        },
        {
          id: 'task_4_2',
          name: 'Meia Maratona',
          description: 'Corra pelo menos 21km em uma sessão',
          type: 'distance',
          target: 21,
          current: 0,
          unit: 'km',
          isCompleted: false,
          reward: {
            points: 500,
            experience: 1000
          }
        },
        {
          id: 'task_4_3',
          name: 'Velocidade',
          description: 'Mantenha ritmo abaixo de 5min/km por 5km',
          type: 'custom',
          target: 5,
          current: 0,
          unit: 'km em ritmo rápido',
          isCompleted: false,
          reward: {
            points: 300,
            experience: 600
          }
        }
      ],
      isUnlocked: false,
      isCompleted: false,
      reward: {
        points: 1050,
        experience: 2100,
        badge: '👑 Elite',
        title: 'Corredor de Elite',
        specialFeature: 'Acesso ao grupo VIP'
      }
    };

    weeklyChallenge.levels = [level1, level2, level3, level4];
    this.challenges.push(weeklyChallenge);

    // Desafio Mensal de Distância
    const monthlyChallenge: Challenge = {
      id: 'challenge_monthly_distance',
      name: 'Desafio Mensal de Distância',
      description: 'Aumente sua distância mensal progressivamente',
      category: 'monthly',
      startDate: Date.now() - 15 * 24 * 60 * 60 * 1000,
      endDate: Date.now() + 15 * 24 * 60 * 60 * 1000,
      levels: [],
      currentLevel: 1,
      totalParticipants: 128,
      isActive: true,
      tags: ['distancia', 'mensal', 'progressivo']
    };

    // Níveis do desafio mensal
    const monthlyLevel1: ChallengeLevel = {
      id: 'monthly_level_1',
      level: 1,
      name: 'Iniciante Mensal',
      description: 'Complete 50km no mês',
      requiredTasks: [],
      tasks: [
        {
          id: 'monthly_task_1',
          name: '50km Mensais',
          description: 'Corra pelo menos 50km no mês',
          type: 'distance',
          target: 50,
          current: 0,
          unit: 'km',
          isCompleted: false,
          reward: {
            points: 200,
            experience: 400
          }
        }
      ],
      isUnlocked: true,
      isCompleted: false,
      reward: {
        points: 200,
        experience: 400,
        badge: '📅 Iniciante Mensal'
      },
      nextLevel: 'monthly_level_2'
    };

    const monthlyLevel2: ChallengeLevel = {
      id: 'monthly_level_2',
      level: 2,
      name: 'Intermediário Mensal',
      description: 'Complete 100km no mês',
      requiredTasks: ['monthly_task_1'],
      tasks: [
        {
          id: 'monthly_task_2',
          name: '100km Mensais',
          description: 'Corra pelo menos 100km no mês',
          type: 'distance',
          target: 100,
          current: 0,
          unit: 'km',
          isCompleted: false,
          reward: {
            points: 400,
            experience: 800
          }
        }
      ],
      isUnlocked: false,
      isCompleted: false,
      reward: {
        points: 400,
        experience: 800,
        badge: '📊 Intermediário Mensal'
      },
      nextLevel: 'monthly_level_3'
    };

    monthlyChallenge.levels = [monthlyLevel1, monthlyLevel2];
    this.challenges.push(monthlyChallenge);
  }

  // Obter desafios ativos
  public getActiveChallenges(): Challenge[] {
    const now = Date.now();
    return this.challenges.filter(c => 
      c.isActive && now >= c.startDate && now <= c.endDate
    );
  }

  // Obter desafio por ID
  public getChallengeById(challengeId: string): Challenge | undefined {
    return this.challenges.find(c => c.id === challengeId);
  }

  // Obter progresso do usuário
  public getUserProgress(userId: string, challengeId: string): UserChallengeProgress | undefined {
    return this.userProgress.find(p => p.userId === userId && p.challengeId === challengeId);
  }

  // Iniciar desafio para usuário
  public startChallenge(userId: string, challengeId: string): UserChallengeProgress {
    const existingProgress = this.getUserProgress(userId, challengeId);
    if (existingProgress) return existingProgress;

    const challenge = this.getChallengeById(challengeId);
    if (!challenge) throw new Error('Desafio não encontrado');

    const newProgress: UserChallengeProgress = {
      userId,
      challengeId,
      currentLevel: 1,
      completedLevels: [],
      totalPoints: 0,
      totalExperience: 0,
      badges: [],
      startedAt: Date.now(),
      lastActivityAt: Date.now()
    };

    this.userProgress.push(newProgress);
    return newProgress;
  }

  // Atualizar progresso de uma task
  public updateTaskProgress(
    userId: string, 
    challengeId: string, 
    taskId: string, 
    progress: number
  ): boolean {
    const userProgress = this.getUserProgress(userId, challengeId);
    if (!userProgress) return false;

    const challenge = this.getChallengeById(challengeId);
    if (!challenge) return false;

    const level = challenge.levels.find(l => l.level === userProgress.currentLevel);
    if (!level) return false;

    const task = level.tasks.find(t => t.id === taskId);
    if (!task) return false;

    task.current = progress;
    
    // Verificar se a task foi completada
    if (progress >= task.target && !task.isCompleted) {
      task.isCompleted = true;
      task.completedAt = Date.now();
      
      // Adicionar recompensas
      userProgress.totalPoints += task.reward.points;
      userProgress.totalExperience += task.reward.experience;
      
      // Verificar se o nível foi completado
      this.checkLevelCompletion(userId, challengeId, level);
    }

    userProgress.lastActivityAt = Date.now();
    return true;
  }

  // Verificar se o nível foi completado
  private checkLevelCompletion(userId: string, challengeId: string, level: ChallengeLevel): void {
    const userProgress = this.getUserProgress(userId, challengeId);
    if (!userProgress) return;

    const allTasksCompleted = level.tasks.every(t => t.isCompleted);
    if (allTasksCompleted && !level.isCompleted) {
      level.isCompleted = true;
      level.completedAt = Date.now();
      
      // Adicionar recompensas do nível
      userProgress.totalPoints += level.reward.points;
      userProgress.totalExperience += level.reward.experience;
      userProgress.badges.push(level.reward.badge);
      userProgress.completedLevels.push(level.id);
      
      // Desbloquear próximo nível
      if (level.nextLevel) {
        const nextLevel = this.getChallengeById(challengeId)?.levels.find(l => l.id === level.nextLevel);
        if (nextLevel) {
          nextLevel.isUnlocked = true;
          userProgress.currentLevel = nextLevel.level;
        }
      }
    }
  }

  // Obter desafios recomendados para o usuário
  public getRecommendedChallenges(userId: string): Challenge[] {
    const activeChallenges = this.getActiveChallenges();
    const userProgress = this.userProgress.filter(p => p.userId === userId);
    
    return activeChallenges.filter(challenge => {
      const progress = userProgress.find(p => p.challengeId === challenge.id);
      if (!progress) return true; // Desafios não iniciados
      
      // Recomendar desafios onde o usuário tem progresso
      return progress.totalPoints > 0 || progress.currentLevel < challenge.levels.length;
    });
  }

  // Obter ranking de um desafio
  public getChallengeRanking(challengeId: string): Array<{
    userId: string;
    username: string;
    totalPoints: number;
    currentLevel: number;
    rank: number;
  }> {
    const progress = this.userProgress.filter(p => p.challengeId === challengeId);
    
    return progress
      .map(p => ({
        userId: p.userId,
        username: `User ${p.userId}`, // Em produção viria do perfil
        totalPoints: p.totalPoints,
        currentLevel: p.currentLevel,
        rank: 0
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((user, index) => ({
        ...user,
        rank: index + 1
      }));
  }

  // Criar novo desafio
  public createChallenge(data: Omit<Challenge, 'id' | 'levels' | 'currentLevel' | 'totalParticipants'>): Challenge {
    const newChallenge: Challenge = {
      ...data,
      id: `challenge_${Date.now()}`,
      levels: [],
      currentLevel: 1,
      totalParticipants: 0
    };

    this.challenges.push(newChallenge);
    return newChallenge;
  }

  // Adicionar nível ao desafio
  public addLevelToChallenge(challengeId: string, level: Omit<ChallengeLevel, 'id'>): ChallengeLevel | null {
    const challenge = this.getChallengeById(challengeId);
    if (!challenge) return null;

    const newLevel: ChallengeLevel = {
      ...level,
      id: `level_${challengeId}_${Date.now()}`
    };

    challenge.levels.push(newLevel);
    return newLevel;
  }
}

export function createChallengeManager(): ChallengeManager {
  return new ChallengeManager();
}