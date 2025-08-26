export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'distance' | 'streak' | 'speed' | 'social' | 'charity' | 'special';
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  isSecret: boolean;
  requirements: {
    type: 'distance' | 'streak' | 'speed' | 'social' | 'charity' | 'custom';
    value: number;
    description: string;
  }[];
  unlockedAt?: number;
  progress?: number;
  maxProgress?: number;
}

export interface Collectible {
  id: string;
  name: string;
  description: string;
  type: 'badge' | 'medal' | 'trophy' | 'title' | 'avatar' | 'theme';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  imageUrl?: string;
  unlockCondition: string;
  isUnlocked: boolean;
  unlockedAt?: number;
  collection?: string; // Nome da coleção
}

export interface UserProfile {
  userId: string;
  username: string;
  avatarUrl?: string;
  level: number;
  experience: number;
  totalPoints: number;
  achievements: string[]; // IDs das conquistas
  collectibles: string[]; // IDs dos colecionáveis
  titles: string[];
  currentTitle: string;
  streak: number;
  longestStreak: number;
  totalDistance: number;
  totalRuns: number;
  totalTime: number;
  bestPace: number;
  rank: number;
  joinDate: number;
  lastActive: Date;
}

export interface Leaderboard {
  id: string;
  name: string;
  category: 'distance' | 'streak' | 'speed' | 'points' | 'charity';
  timeFrame: 'daily' | 'weekly' | 'monthly' | 'allTime';
  entries: Array<{
    userId: string;
    username: string;
    avatarUrl?: string;
    value: number;
    rank: number;
    lastUpdated: number;
  }>;
  lastUpdated: number;
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'special';
  requirements: {
    type: 'distance' | 'streak' | 'speed' | 'social' | 'charity';
    value: number;
    description: string;
  }[];
  rewards: {
    experience: number;
    points: number;
    collectibles?: string[];
    achievements?: string[];
  };
  isCompleted: boolean;
  progress: number;
  maxProgress: number;
  expiresAt: number;
  startedAt: number;
}

export class GamificationManager {
  private achievements: Achievement[] = [];
  private collectibles: Collectible[] = [];
  private userProfiles: UserProfile[] = [];
  private leaderboards: Leaderboard[] = [];
  private quests: Quest[] = [];

  constructor() {
    this.initializeAchievements();
    this.initializeCollectibles();
    this.initializeLeaderboards();
    this.initializeQuests();
  }

  private initializeAchievements() {
    // Conquistas de Distância
    const distanceAchievements: Achievement[] = [
      {
        id: 'first_5k',
        name: 'Primeiro 5K',
        description: 'Complete sua primeira corrida de 5km',
        category: 'distance',
        icon: '🏃‍♂️',
        rarity: 'common',
        points: 50,
        isSecret: false,
        requirements: [{ type: 'distance', value: 5, description: 'Corra 5km' }]
      },
      {
        id: 'first_10k',
        name: 'Primeiro 10K',
        description: 'Complete sua primeira corrida de 10km',
        category: 'distance',
        icon: '🏃‍♂️',
        rarity: 'common',
        points: 100,
        isSecret: false,
        requirements: [{ type: 'distance', value: 10, description: 'Corra 10km' }]
      },
      {
        id: 'half_marathon',
        name: 'Meia Maratona',
        description: 'Complete uma meia maratona (21km)',
        category: 'distance',
        icon: '🏃‍♂️',
        rarity: 'rare',
        points: 250,
        isSecret: false,
        requirements: [{ type: 'distance', value: 21, description: 'Corra 21km' }]
      },
      {
        id: 'marathon',
        name: 'Maratona',
        description: 'Complete uma maratona (42km)',
        category: 'distance',
        icon: '🏃‍♂️',
        rarity: 'epic',
        points: 500,
        isSecret: false,
        requirements: [{ type: 'distance', value: 42, description: 'Corra 42km' }]
      },
      {
        id: 'ultra_marathon',
        name: 'Ultra Maratona',
        description: 'Complete uma ultra maratona (50km+)',
        category: 'distance',
        icon: '🏃‍♂️',
        rarity: 'legendary',
        points: 1000,
        isSecret: false,
        requirements: [{ type: 'distance', value: 50, description: 'Corra 50km' }]
      }
    ];

    // Conquistas de Streak
    const streakAchievements: Achievement[] = [
      {
        id: 'week_streak',
        name: 'Semana Consistente',
        description: 'Corra por 7 dias consecutivos',
        category: 'streak',
        icon: '🔥',
        rarity: 'common',
        points: 75,
        isSecret: false,
        requirements: [{ type: 'streak', value: 7, description: '7 dias seguidos' }]
      },
      {
        id: 'month_streak',
        name: 'Mês Consistente',
        description: 'Corra por 30 dias consecutivos',
        category: 'streak',
        icon: '🔥',
        rarity: 'rare',
        points: 300,
        isSecret: false,
        requirements: [{ type: 'streak', value: 30, description: '30 dias seguidos' }]
      },
      {
        id: 'year_streak',
        name: 'Ano Consistente',
        description: 'Corra por 365 dias consecutivos',
        category: 'streak',
        icon: '🔥',
        rarity: 'legendary',
        points: 2000,
        isSecret: false,
        requirements: [{ type: 'streak', value: 365, description: '365 dias seguidos' }]
      }
    ];

    // Conquistas de Velocidade
    const speedAchievements: Achievement[] = [
      {
        id: 'sub_5_pace',
        name: 'Sub-5 Pace',
        description: 'Mantenha ritmo abaixo de 5min/km por 5km',
        category: 'speed',
        icon: '⚡',
        rarity: 'rare',
        points: 150,
        isSecret: false,
        requirements: [{ type: 'speed', value: 5, description: '5km em ritmo <5min/km' }]
      },
      {
        id: 'sub_4_pace',
        name: 'Sub-4 Pace',
        description: 'Mantenha ritmo abaixo de 4min/km por 5km',
        category: 'speed',
        icon: '⚡',
        rarity: 'epic',
        points: 300,
        isSecret: false,
        requirements: [{ type: 'speed', value: 4, description: '5km em ritmo <4min/km' }]
      }
    ];

    // Conquistas Sociais
    const socialAchievements: Achievement[] = [
      {
        id: 'first_group_run',
        name: 'Corrida em Grupo',
        description: 'Participe de sua primeira corrida em grupo',
        category: 'social',
        icon: '👥',
        rarity: 'common',
        points: 50,
        isSecret: false,
        requirements: [{ type: 'social', value: 1, description: '1 corrida em grupo' }]
      },
      {
        id: 'community_leader',
        name: 'Líder da Comunidade',
        description: 'Seja o primeiro em um ranking de comunidade',
        category: 'social',
        icon: '👑',
        rarity: 'epic',
        points: 400,
        isSecret: false,
        requirements: [{ type: 'social', value: 1, description: '1º lugar em ranking' }]
      }
    ];

    // Conquistas de Caridade
    const charityAchievements: Achievement[] = [
      {
        id: 'first_donation',
        name: 'Primeira Doação',
        description: 'Faça sua primeira doação convertendo KM',
        category: 'charity',
        icon: '❤️',
        rarity: 'common',
        points: 100,
        isSecret: false,
        requirements: [{ type: 'charity', value: 1, description: '1 doação' }]
      },
      {
        id: 'charity_champion',
        name: 'Campeão da Caridade',
        description: 'Doe pelo menos R$ 100 convertendo KM',
        category: 'charity',
        icon: '💝',
        rarity: 'epic',
        points: 500,
        isSecret: false,
        requirements: [{ type: 'charity', value: 100, description: 'R$ 100 doados' }]
      }
    ];

    this.achievements.push(
      ...distanceAchievements,
      ...streakAchievements,
      ...speedAchievements,
      ...socialAchievements,
      ...charityAchievements
    );
  }

  private initializeCollectibles() {
    const collectibles: Collectible[] = [
      // Badges
      {
        id: 'badge_beginner',
        name: 'Badge Iniciante',
        description: 'Para corredores que estão começando',
        type: 'badge',
        rarity: 'common',
        unlockCondition: 'Complete sua primeira corrida',
        isUnlocked: false
      },
      {
        id: 'badge_consistent',
        name: 'Badge Consistente',
        description: 'Para corredores que mantêm a rotina',
        type: 'badge',
        rarity: 'rare',
        unlockCondition: 'Corra por 30 dias consecutivos',
        isUnlocked: false
      },
      {
        id: 'badge_speedster',
        name: 'Badge Speedster',
        description: 'Para corredores rápidos',
        type: 'badge',
        rarity: 'epic',
        unlockCondition: 'Mantenha ritmo <4min/km por 10km',
        isUnlocked: false
      },

      // Medals
      {
        id: 'medal_5k',
        name: 'Medalha 5K',
        description: 'Medalha de bronze para 5km',
        type: 'medal',
        rarity: 'common',
        unlockCondition: 'Complete uma corrida de 5km',
        isUnlocked: false
      },
      {
        id: 'medal_10k',
        name: 'Medalha 10K',
        description: 'Medalha de prata para 10km',
        type: 'medal',
        rarity: 'rare',
        unlockCondition: 'Complete uma corrida de 10km',
        isUnlocked: false
      },
      {
        id: 'medal_21k',
        name: 'Medalha 21K',
        description: 'Medalha de ouro para meia maratona',
        type: 'medal',
        rarity: 'epic',
        unlockCondition: 'Complete uma meia maratona',
        isUnlocked: false
      },

      // Trophies
      {
        id: 'trophy_marathon',
        name: 'Troféu Maratona',
        description: 'Troféu especial para maratonistas',
        type: 'trophy',
        rarity: 'legendary',
        unlockCondition: 'Complete uma maratona',
        isUnlocked: false
      },

      // Titles
      {
        id: 'title_runner',
        name: 'Corredor',
        description: 'Título básico para corredores',
        type: 'title',
        rarity: 'common',
        unlockCondition: 'Complete 10 corridas',
        isUnlocked: false
      },
      {
        id: 'title_athlete',
        name: 'Atleta',
        description: 'Título para corredores experientes',
        type: 'title',
        rarity: 'rare',
        unlockCondition: 'Complete 100 corridas',
        isUnlocked: false
      },
      {
        id: 'title_champion',
        name: 'Campeão',
        description: 'Título para corredores elite',
        type: 'title',
        rarity: 'epic',
        unlockCondition: 'Seja 1º em 5 rankings diferentes',
        isUnlocked: false
      }
    ];

    this.collectibles.push(...collectibles);
  }

  private initializeLeaderboards() {
    const leaderboards: Leaderboard[] = [
      {
        id: 'daily_distance',
        name: 'Distância Diária',
        category: 'distance',
        timeFrame: 'daily',
        entries: [],
        lastUpdated: Date.now()
      },
      {
        id: 'weekly_distance',
        name: 'Distância Semanal',
        category: 'distance',
        timeFrame: 'weekly',
        entries: [],
        lastUpdated: Date.now()
      },
      {
        id: 'monthly_distance',
        name: 'Distância Mensal',
        category: 'distance',
        timeFrame: 'monthly',
        entries: [],
        lastUpdated: Date.now()
      },
      {
        id: 'all_time_points',
        name: 'Pontos Totais',
        category: 'points',
        timeFrame: 'allTime',
        entries: [],
        lastUpdated: Date.now()
      },
      {
        id: 'charity_ranking',
        name: 'Ranking de Caridade',
        category: 'charity',
        timeFrame: 'allTime',
        entries: [],
        lastUpdated: Date.now()
      }
    ];

    this.leaderboards.push(...leaderboards);
  }

  private initializeQuests() {
    const quests: Quest[] = [
      // Quest Diária
      {
        id: 'daily_5k',
        name: '5K Diário',
        description: 'Corra 5km hoje',
        type: 'daily',
        requirements: [{ type: 'distance', value: 5, description: '5km' }],
        rewards: {
          experience: 100,
          points: 50
        },
        isCompleted: false,
        progress: 0,
        maxProgress: 5,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        startedAt: Date.now()
      },

      // Quest Semanal
      {
        id: 'weekly_30k',
        name: '30K Semanal',
        description: 'Corra 30km esta semana',
        type: 'weekly',
        requirements: [{ type: 'distance', value: 30, description: '30km' }],
        rewards: {
          experience: 300,
          points: 150,
          collectibles: ['badge_consistent']
        },
        isCompleted: false,
        progress: 0,
        maxProgress: 30,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        startedAt: Date.now()
      }
    ];

    this.quests.push(...quests);
  }

  // Obter perfil do usuário
  public getUserProfile(userId: string): UserProfile | undefined {
    return this.userProfiles.find(profile => profile.userId === userId);
  }

  // Criar perfil do usuário
  public createUserProfile(userId: string, username: string): UserProfile {
    const existingProfile = this.getUserProfile(userId);
    if (existingProfile) return existingProfile;

    const newProfile: UserProfile = {
      userId,
      username,
      level: 1,
      experience: 0,
      totalPoints: 0,
      achievements: [],
      collectibles: [],
      titles: [],
      currentTitle: 'Corredor',
      streak: 0,
      longestStreak: 0,
      totalDistance: 0,
      totalRuns: 0,
      totalTime: 0,
      bestPace: 0,
      rank: 0,
      joinDate: Date.now(),
      lastActive: new Date()
    };

    this.userProfiles.push(newProfile);
    return newProfile;
  }

  // Atualizar estatísticas do usuário
  public updateUserStats(
    userId: string,
    distance: number,
    time: number,
    pace: number
  ): boolean {
    const profile = this.getUserProfile(userId);
    if (!profile) return false;

    profile.totalDistance += distance;
    profile.totalRuns += 1;
    profile.totalTime += time;
    
    if (pace > 0 && (profile.bestPace === 0 || pace < profile.bestPace)) {
      profile.bestPace = pace;
    }

    profile.lastActive = new Date();

    // Verificar conquistas
    this.checkAchievements(userId);

    // Atualizar experiência e nível
    this.updateExperienceAndLevel(userId);

    // Atualizar rankings
    this.updateLeaderboards();

    return true;
  }

  // Verificar conquistas
  private checkAchievements(userId: string): void {
    const profile = this.getUserProfile(userId);
    if (!profile) return;

    this.achievements.forEach(achievement => {
      if (profile.achievements.includes(achievement.id)) return; // Já desbloqueada

      let isUnlocked = true;
      let progress = 0;

      achievement.requirements.forEach(req => {
        let currentValue = 0;

        switch (req.type) {
          case 'distance':
            currentValue = profile.totalDistance;
            break;
          case 'streak':
            currentValue = profile.streak;
            break;
          case 'speed':
            currentValue = profile.bestPace > 0 ? 60 / profile.bestPace : 0; // km/h
            break;
          case 'social':
            // Implementar lógica social
            currentValue = 0;
            break;
          case 'charity':
            // Implementar lógica de caridade
            currentValue = 0;
            break;
        }

        if (currentValue < req.value) {
          isUnlocked = false;
        }

        progress = Math.max(progress, Math.min(currentValue, req.value));
      });

      if (isUnlocked) {
        this.unlockAchievement(userId, achievement.id);
      } else {
        // Atualizar progresso
        achievement.progress = progress;
        achievement.maxProgress = Math.max(...achievement.requirements.map(r => r.value));
      }
    });
  }

  // Desbloquear conquista
  private unlockAchievement(userId: string, achievementId: string): void {
    const profile = this.getUserProfile(userId);
    const achievement = this.achievements.find(a => a.id === achievementId);
    
    if (!profile || !achievement) return;

    profile.achievements.push(achievementId);
    profile.totalPoints += achievement.points;
    achievement.unlockedAt = Date.now();

    // Verificar se desbloqueia colecionáveis
    this.checkCollectibles(userId);
  }

  // Verificar colecionáveis
  private checkCollectibles(userId: string): void {
    const profile = this.getUserProfile(userId);
    if (!profile) return;

    this.collectibles.forEach(collectible => {
      if (profile.collectibles.includes(collectible.id)) return;

      // Lógica para desbloquear colecionáveis baseada em conquistas
      if (collectible.id === 'badge_beginner' && profile.totalRuns >= 1) {
        this.unlockCollectible(userId, collectible.id);
      } else if (collectible.id === 'badge_consistent' && profile.streak >= 30) {
        this.unlockCollectible(userId, collectible.id);
      } else if (collectible.id === 'medal_5k' && profile.totalDistance >= 5) {
        this.unlockCollectible(userId, collectible.id);
      }
    });
  }

  // Desbloquear colecionável
  private unlockCollectible(userId: string, collectibleId: string): void {
    const profile = this.getUserProfile(userId);
    const collectible = this.collectibles.find(c => c.id === collectibleId);
    
    if (!profile || !collectible) return;

    profile.collectibles.push(collectibleId);
    collectible.isUnlocked = true;
    collectible.unlockedAt = Date.now();
  }

  // Atualizar experiência e nível
  private updateExperienceAndLevel(userId: string): void {
    const profile = this.getUserProfile(userId);
    if (!profile) return;

    // Calcular experiência baseada em corridas e conquistas
    const runExperience = profile.totalRuns * 50;
    const achievementExperience = profile.achievements.length * 100;
    const totalExperience = runExperience + achievementExperience;

    profile.experience = totalExperience;

    // Calcular nível (1 nível a cada 1000 XP)
    const newLevel = Math.floor(totalExperience / 1000) + 1;
    if (newLevel > profile.level) {
      profile.level = newLevel;
      // Pode adicionar recompensas por nível aqui
    }
  }

  // Atualizar rankings
  private updateLeaderboards(): void {
    this.leaderboards.forEach(leaderboard => {
      const entries = this.userProfiles
        .map(profile => {
          let value = 0;
          switch (leaderboard.category) {
            case 'distance':
              value = profile.totalDistance;
              break;
            case 'points':
              value = profile.totalPoints;
              break;
            case 'streak':
              value = profile.streak;
              break;
            case 'speed':
              value = profile.bestPace > 0 ? 60 / profile.bestPace : 0;
              break;
            case 'charity':
              // Implementar lógica de caridade
              value = 0;
              break;
          }

          return {
            userId: profile.userId,
            username: profile.username,
            avatarUrl: profile.avatarUrl,
            value,
            rank: 0,
            lastUpdated: Date.now()
          };
        })
        .filter(entry => entry.value > 0)
        .sort((a, b) => b.value - a.value)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1
        }));

      leaderboard.entries = entries;
      leaderboard.lastUpdated = Date.now();
    });
  }

  // Obter conquistas do usuário
  public getUserAchievements(userId: string): Achievement[] {
    const profile = this.getUserProfile(userId);
    if (!profile) return [];

    return this.achievements.filter(achievement => 
      profile.achievements.includes(achievement.id)
    );
  }

  // Obter colecionáveis do usuário
  public getUserCollectibles(userId: string): Collectible[] {
    const profile = this.getUserProfile(userId);
    if (!profile) return [];

    return this.collectibles.filter(collectible => 
      profile.collectibles.includes(collectible.id)
    );
  }

  // Obter quests ativas do usuário
  public getUserQuests(userId: string): Quest[] {
    return this.quests.filter(quest => 
      quest.expiresAt > Date.now() && !quest.isCompleted
    );
  }

  // Obter ranking específico
  public getLeaderboard(leaderboardId: string): Leaderboard | undefined {
    return this.leaderboards.find(lb => lb.id === leaderboardId);
  }

  // Obter todas as conquistas disponíveis
  public getAllAchievements(): Achievement[] {
    return this.achievements;
  }

  // Obter todos os colecionáveis disponíveis
  public getAllCollectibles(): Collectible[] {
    return this.collectibles;
  }
}

export function createGamificationManager(): GamificationManager {
  return new GamificationManager();
}