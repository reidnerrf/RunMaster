export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'distance' | 'streak' | 'speed' | 'social' | 'charity' | 'challenge' | 'special' | 'seasonal' | 'milestone' | 'competition';
  difficulty: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  rarity: number; // 0-100 (percentual de usuários que possuem)
  points: number;
  xpReward: number;
  icon: string;
  isSecret: boolean;
  isHidden: boolean;
  requirements: AchievementRequirement[];
  rewards: AchievementReward[];
  unlockedAt?: number;
  progress?: number; // 0-100
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  maxTier: number; // máximo de vezes que pode ser desbloqueado
  currentTier: number;
  isRepeatable: boolean;
  cooldown?: number; // tempo em ms entre desbloqueios
  lastUnlocked?: number;
}

export interface AchievementRequirement {
  type: 'distance' | 'time' | 'count' | 'streak' | 'speed' | 'elevation' | 'social' | 'charity' | 'challenge' | 'combination';
  value: number;
  unit?: string;
  condition: 'greater_than' | 'less_than' | 'equal_to' | 'multiple_of' | 'consecutive' | 'total';
  timeframe?: number; // ms
  location?: string;
  weather?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek?: number[]; // 0-6 (domingo-sábado)
  month?: number[]; // 1-12
  season?: 'spring' | 'summer' | 'autumn' | 'winter';
  equipment?: string[];
  route?: string;
  companion?: string;
  challenge?: string;
  social?: {
    followers: number;
    likes: number;
    shares: number;
    comments: number;
  };
}

export interface AchievementReward {
  type: 'points' | 'xp' | 'badge' | 'title' | 'item' | 'currency' | 'feature' | 'discount';
  value: number | string;
  description: string;
  isUnlocked: boolean;
}

export interface Collectible {
  id: string;
  name: string;
  description: string;
  category: 'badge' | 'medal' | 'trophy' | 'title' | 'emote' | 'avatar' | 'banner' | 'theme' | 'sound' | 'animation';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  rarityScore: number; // 0-1000
  points: number;
  xpReward: number;
  icon: string;
  isAnimated: boolean;
  isLimited: boolean;
  availableUntil?: number;
  isSeasonal: boolean;
  season?: string;
  year?: number;
  collection: string;
  setSize: number;
  currentSet: number;
  isComplete: boolean;
  unlockMethod: 'achievement' | 'purchase' | 'event' | 'challenge' | 'social' | 'random' | 'special';
  requirements?: CollectibleRequirement[];
  tradeable: boolean;
  giftable: boolean;
  marketValue: number;
  unlockDate?: number;
}

export interface CollectibleRequirement {
  type: 'level' | 'achievement' | 'points' | 'social' | 'charity' | 'challenge' | 'time' | 'location';
  value: number | string;
  condition: 'greater_than' | 'less_than' | 'equal_to' | 'completed' | 'owned';
}

export interface UserProfile {
  userId: string;
  level: number;
  experience: number;
  totalPoints: number;
  currentPoints: number;
  rank: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'grandmaster' | 'legend';
  rankProgress: number; // 0-100
  achievements: string[]; // IDs das conquistas
  collectibles: string[]; // IDs dos colecionáveis
  badges: string[];
  titles: string[];
  stats: {
    totalRuns: number;
    totalDistance: number;
    totalTime: number;
    averagePace: string;
    bestPace: string;
    longestStreak: number;
    currentStreak: number;
    totalElevation: number;
    totalCalories: number;
    personalBests: {
      '5k': string;
      '10k': string;
      'half_marathon': string;
      'marathon': string;
    };
    weeklyDistance: number;
    monthlyDistance: number;
    yearlyDistance: number;
    weeklyGoal: number;
    monthlyGoal: number;
    yearlyGoal: number;
    goalCompletion: number; // percentual
  };
  preferences: {
    showAchievements: boolean;
    showCollectibles: boolean;
    showStats: boolean;
    showRank: boolean;
    notifications: boolean;
    privacy: 'public' | 'friends' | 'private';
  };
  lastUpdated: number;
  createdAt: number;
}

export interface Leaderboard {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'all_time' | 'event' | 'challenge' | 'category';
  category?: string;
  metric: 'distance' | 'time' | 'pace' | 'elevation' | 'calories' | 'points' | 'xp' | 'streak' | 'achievements';
  timeFrame: {
    start: number;
    end: number;
  };
  participants: number;
  entries: LeaderboardEntry[];
  lastUpdated: number;
  isActive: boolean;
  rewards: LeaderboardReward[];
  requirements: LeaderboardRequirement[];
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatarUrl?: string;
  rank: number;
  value: number;
  displayValue: string;
  change: 'up' | 'down' | 'stable' | 'new';
  previousRank?: number;
  previousValue?: number;
  metadata: {
    runs: number;
    distance: number;
    time: number;
    pace: string;
    achievements: number;
    collectibles: number;
  };
  lastUpdated: number;
}

export interface LeaderboardReward {
  type: 'points' | 'xp' | 'badge' | 'title' | 'item' | 'currency';
  value: number | string;
  rank: number; // rank mínimo para receber
  description: string;
}

export interface LeaderboardRequirement {
  type: 'level' | 'achievement' | 'points' | 'participation';
  value: number | string;
  condition: 'greater_than' | 'less_than' | 'equal_to' | 'completed';
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'special' | 'event' | 'challenge';
  category: 'distance' | 'time' | 'social' | 'charity' | 'exploration' | 'competition' | 'collection';
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  points: number;
  xpReward: number;
  requirements: QuestRequirement[];
  rewards: QuestReward[];
  startDate: number;
  endDate: number;
  isActive: boolean;
  isCompleted: boolean;
  progress: number; // 0-100
  completedAt?: number;
  isRepeatable: boolean;
  cooldown?: number;
  lastCompleted?: number;
  completionCount: number;
  maxCompletions: number;
  streak: number;
  maxStreak: number;
}

export interface QuestRequirement {
  type: 'distance' | 'time' | 'count' | 'streak' | 'speed' | 'elevation' | 'social' | 'charity' | 'challenge' | 'location' | 'weather' | 'timeOfDay' | 'combination';
  value: number;
  unit?: string;
  condition: 'greater_than' | 'less_than' | 'equal_to' | 'multiple_of' | 'consecutive' | 'total' | 'average';
  timeframe?: number;
  location?: string;
  weather?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  dayOfWeek?: number[];
  month?: number[];
  season?: 'spring' | 'summer' | 'autumn' | 'winter';
  equipment?: string[];
  route?: string;
  companion?: string;
  challenge?: string;
  social?: {
    followers: number;
    likes: number;
    shares: number;
    comments: number;
    invites: number;
    groupActivities: number;
  };
}

export interface QuestReward {
  type: 'points' | 'xp' | 'badge' | 'title' | 'item' | 'currency' | 'feature' | 'discount' | 'bonus';
  value: number | string;
  description: string;
  isUnlocked: boolean;
  bonus?: {
    type: 'multiplier' | 'bonus_points' | 'extra_xp' | 'special_item';
    value: number | string;
    condition: string;
  };
}

export class GamificationManager {
  private achievements: Achievement[] = [];
  private collectibles: Collectible[] = [];
  private userProfiles: UserProfile[] = [];
  private leaderboards: Leaderboard[] = [];
  private quests: Quest[] = [];
  private collections: Map<string, string[]> = new Map();

  constructor() {
    this.initializeAchievements();
    this.initializeCollectibles();
    this.initializeQuests();
    this.initializeLeaderboards();
  }

  private initializeAchievements() {
    const achievements: Achievement[] = [
      // Conquistas de Distância - Níveis Difíceis
      {
        id: 'achievement_distance_1000km',
        name: 'Maratonista de Ferro',
        description: 'Complete 1000km de corrida',
        category: 'distance',
        difficulty: 'legendary',
        rarity: 2,
        points: 1000,
        xpReward: 5000,
        icon: '🏃‍♂️',
        isSecret: false,
        isHidden: false,
        requirements: [
          {
            type: 'distance',
            value: 1000,
            unit: 'km',
            condition: 'greater_than'
          }
        ],
        rewards: [
          { type: 'badge', value: 'marathon_iron', description: 'Badge Maratonista de Ferro', isUnlocked: false },
          { type: 'title', value: 'Maratonista de Ferro', description: 'Título exclusivo', isUnlocked: false }
        ],
        tier: 'diamond',
        maxTier: 5,
        currentTier: 1,
        isRepeatable: true,
        cooldown: 30 * 24 * 60 * 60 * 1000 // 30 dias
      },
      
      {
        id: 'achievement_distance_5000km',
        name: 'Ultra Maratonista',
        description: 'Complete 5000km de corrida',
        category: 'distance',
        difficulty: 'mythic',
        rarity: 0.5,
        points: 5000,
        xpReward: 25000,
        icon: '🏃‍♂️',
        isSecret: false,
        isHidden: false,
        requirements: [
          {
            type: 'distance',
            value: 5000,
            unit: 'km',
            condition: 'greater_than'
          }
        ],
        rewards: [
          { type: 'badge', value: 'ultra_marathon', description: 'Badge Ultra Maratonista', isUnlocked: false },
          { type: 'title', value: 'Ultra Maratonista', description: 'Título lendário', isUnlocked: false }
        ],
        tier: 'diamond',
        maxTier: 1,
        currentTier: 1,
        isRepeatable: false
      },

      // Conquistas de Streak - Extremamente Difíceis
      {
        id: 'achievement_streak_365',
        name: 'Corredor do Ano',
        description: 'Corra por 365 dias consecutivos',
        category: 'streak',
        difficulty: 'mythic',
        rarity: 0.1,
        points: 10000,
        xpReward: 50000,
        icon: '📅',
        isSecret: false,
        isHidden: false,
        requirements: [
          {
            type: 'streak',
            value: 365,
            unit: 'days',
            condition: 'consecutive'
          }
        ],
        rewards: [
          { type: 'badge', value: 'year_runner', description: 'Badge Corredor do Ano', isUnlocked: false },
          { type: 'title', value: 'Corredor do Ano', description: 'Título mítico', isUnlocked: false },
          { type: 'feature', value: 'exclusive_theme', description: 'Tema exclusivo', isUnlocked: false }
        ],
        tier: 'diamond',
        maxTier: 1,
        currentTier: 1,
        isRepeatable: false
      },

      // Conquistas de Velocidade - Elite
      {
        id: 'achievement_speed_sub3_marathon',
        name: 'Sub-3 Maratonista',
        description: 'Complete uma maratona em menos de 3 horas',
        category: 'speed',
        difficulty: 'legendary',
        rarity: 1,
        points: 2000,
        xpReward: 10000,
        icon: '⚡',
        isSecret: false,
        isHidden: false,
        requirements: [
          {
            type: 'time',
            value: 3 * 60 * 60, // 3 horas em segundos
            unit: 'seconds',
            condition: 'less_than'
          },
          {
            type: 'distance',
            value: 42.2,
            unit: 'km',
            condition: 'equal_to'
          }
        ],
        rewards: [
          { type: 'badge', value: 'sub3_marathon', description: 'Badge Sub-3', isUnlocked: false },
          { type: 'title', value: 'Sub-3 Maratonista', description: 'Título de elite', isUnlocked: false }
        ],
        tier: 'platinum',
        maxTier: 1,
        currentTier: 1,
        isRepeatable: false
      },

      // Conquistas Sociais - Complexas
      {
        id: 'achievement_social_influencer',
        name: 'Influenciador da Corrida',
        description: 'Alcance 10.000 seguidores e inspire 1000 pessoas a correr',
        category: 'social',
        difficulty: 'epic',
        rarity: 5,
        points: 800,
        xpReward: 4000,
        icon: '🌟',
        isSecret: false,
        isHidden: false,
        requirements: [
          {
            type: 'social',
            value: 10000,
            condition: 'greater_than',
            social: { followers: 10000, likes: 0, shares: 0, comments: 0 }
          },
          {
            type: 'social',
            value: 1000,
            condition: 'greater_than',
            social: { followers: 0, likes: 0, shares: 0, comments: 0 }
          }
        ],
        rewards: [
          { type: 'badge', value: 'influencer', description: 'Badge Influenciador', isUnlocked: false },
          { type: 'title', value: 'Influenciador da Corrida', description: 'Título social', isUnlocked: false }
        ],
        tier: 'gold',
        maxTier: 1,
        currentTier: 1,
        isRepeatable: false
      },

      // Conquistas de Caridade - Especiais
      {
        id: 'achievement_charity_1000km',
        name: 'Corredor Solidário',
        description: 'Doe 1000km para causas sociais',
        category: 'charity',
        difficulty: 'epic',
        rarity: 8,
        points: 600,
        xpReward: 3000,
        icon: '❤️',
        isSecret: false,
        isHidden: false,
        requirements: [
          {
            type: 'charity',
            value: 1000,
            unit: 'km',
            condition: 'greater_than'
          }
        ],
        rewards: [
          { type: 'badge', value: 'charity_runner', description: 'Badge Solidário', isUnlocked: false },
          { type: 'title', value: 'Corredor Solidário', description: 'Título de caridade', isUnlocked: false }
        ],
        tier: 'gold',
        maxTier: 1,
        currentTier: 1,
        isRepeatable: true,
        cooldown: 90 * 24 * 60 * 60 * 1000 // 90 dias
      },

      // Conquistas de Desafio - Extremamente Difíceis
      {
        id: 'achievement_challenge_100_completed',
        name: 'Mestre dos Desafios',
        description: 'Complete 100 desafios diferentes',
        category: 'challenge',
        difficulty: 'mythic',
        rarity: 0.2,
        points: 8000,
        xpReward: 40000,
        icon: '🏆',
        isSecret: false,
        isHidden: false,
        requirements: [
          {
            type: 'challenge',
            value: 100,
            condition: 'greater_than'
          }
        ],
        rewards: [
          { type: 'badge', value: 'challenge_master', description: 'Badge Mestre dos Desafios', isUnlocked: false },
          { type: 'title', value: 'Mestre dos Desafios', description: 'Título supremo', isUnlocked: false },
          { type: 'feature', value: 'custom_challenges', description: 'Criar desafios personalizados', isUnlocked: false }
        ],
        tier: 'diamond',
        maxTier: 1,
        currentTier: 1,
        isRepeatable: false
      },

      // Conquistas Sazonais - Limitadas
      {
        id: 'achievement_seasonal_winter_warrior',
        name: 'Guerreiro do Inverno',
        description: 'Corra 100km em temperaturas abaixo de 0°C',
        category: 'seasonal',
        difficulty: 'rare',
        rarity: 15,
        points: 400,
        xpReward: 2000,
        icon: '❄️',
        isSecret: false,
        isHidden: false,
        requirements: [
          {
            type: 'distance',
            value: 100,
            unit: 'km',
            condition: 'greater_than'
          },
          {
            type: 'weather',
            value: 0,
            unit: 'celsius',
            condition: 'less_than'
          },
          {
            type: 'season',
            value: 1,
            condition: 'equal_to',
            season: 'winter'
          }
        ],
        rewards: [
          { type: 'badge', value: 'winter_warrior', description: 'Badge Guerreiro do Inverno', isUnlocked: false },
          { type: 'title', value: 'Guerreiro do Inverno', description: 'Título sazonal', isUnlocked: false }
        ],
        tier: 'silver',
        maxTier: 1,
        currentTier: 1,
        isRepeatable: true,
        cooldown: 365 * 24 * 60 * 60 * 1000 // 1 ano
      }
    ];

    this.achievements.push(...achievements);
  }

  private initializeCollectibles() {
    const collectibles: Collectible[] = [
      // Coleções de Badges - Extremamente Raras
      {
        id: 'collectible_badge_marathon_legend',
        name: 'Badge Maratona Lendária',
        description: 'Badge exclusivo para maratonistas lendários',
        category: 'badge',
        rarity: 'mythic',
        rarityScore: 950,
        points: 2000,
        xpReward: 10000,
        icon: '🏃‍♂️',
        isAnimated: true,
        isLimited: true,
        availableUntil: Date.now() + 365 * 24 * 60 * 60 * 1000,
        isSeasonal: false,
        collection: 'marathon_legends',
        setSize: 5,
        currentSet: 1,
        isComplete: false,
        unlockMethod: 'achievement',
        requirements: [
          { type: 'achievement', value: 'achievement_distance_5000km', condition: 'completed' }
        ],
        tradeable: false,
        giftable: false,
        marketValue: 10000
      },

      // Coleções de Títulos - Únicos
      {
        id: 'collectible_title_legendary_runner',
        name: 'Corredor Lendário',
        description: 'Título exclusivo para corredores lendários',
        category: 'title',
        rarity: 'mythic',
        rarityScore: 1000,
        points: 5000,
        xpReward: 25000,
        icon: '👑',
        isAnimated: true,
        isLimited: true,
        availableUntil: Date.now() + 2 * 365 * 24 * 60 * 60 * 1000,
        isSeasonal: false,
        collection: 'legendary_titles',
        setSize: 3,
        currentSet: 1,
        isComplete: false,
        unlockMethod: 'achievement',
        requirements: [
          { type: 'level', value: 100, condition: 'greater_than' },
          { type: 'achievement', value: 'achievement_streak_365', condition: 'completed' }
        ],
        tradeable: false,
        giftable: false,
        marketValue: 50000
      }
    ];

    this.collectibles.push(...collectibles);
  }

  private initializeQuests() {
    const quests: Quest[] = [
      // Quest Diária - Difícil
      {
        id: 'quest_daily_ultra_distance',
        name: 'Corredor de Ultra Distância',
        description: 'Complete 30km em um único dia',
        type: 'daily',
        category: 'distance',
        difficulty: 'hard',
        points: 300,
        xpReward: 1500,
        requirements: [
          {
            type: 'distance',
            value: 30,
            unit: 'km',
            condition: 'greater_than',
            timeframe: 24 * 60 * 60 * 1000 // 24 horas
          }
        ],
        rewards: [
          { type: 'points', value: 300, description: '300 pontos', isUnlocked: false },
          { type: 'xp', value: 1500, description: '1500 XP', isUnlocked: false },
          { type: 'bonus', value: 'streak_multiplier', description: 'Multiplicador de streak', isUnlocked: false }
        ],
        startDate: Date.now(),
        endDate: Date.now() + 24 * 60 * 60 * 1000,
        isActive: true,
        isCompleted: false,
        progress: 0,
        isRepeatable: true,
        cooldown: 24 * 60 * 60 * 1000,
        completionCount: 0,
        maxCompletions: 1,
        streak: 0,
        maxStreak: 7
      },

      // Quest Semanal - Extremamente Difícil
      {
        id: 'quest_weekly_marathon_training',
        name: 'Treino de Maratona',
        description: 'Complete 100km em uma semana com pelo menos 5 dias de treino',
        type: 'weekly',
        category: 'distance',
        difficulty: 'extreme',
        points: 1000,
        xpReward: 5000,
        requirements: [
          {
            type: 'distance',
            value: 100,
            unit: 'km',
            condition: 'greater_than',
            timeframe: 7 * 24 * 60 * 60 * 1000 // 7 dias
          },
          {
            type: 'count',
            value: 5,
            unit: 'days',
            condition: 'greater_than',
            timeframe: 7 * 24 * 60 * 60 * 1000
          }
        ],
        rewards: [
          { type: 'points', value: 1000, description: '1000 pontos', isUnlocked: false },
          { type: 'xp', value: 5000, description: '5000 XP', isUnlocked: false },
          { type: 'badge', value: 'marathon_training', description: 'Badge de Treino', isUnlocked: false }
        ],
        startDate: Date.now(),
        endDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
        isActive: true,
        isCompleted: false,
        progress: 0,
        isRepeatable: true,
        cooldown: 7 * 24 * 60 * 60 * 1000,
        completionCount: 0,
        maxCompletions: 1,
        streak: 0,
        maxStreak: 4
      }
    ];

    this.quests.push(...quests);
  }

  private initializeLeaderboards() {
    const leaderboards: Leaderboard[] = [
      // Leaderboard Mensal - Competitivo
      {
        id: 'leaderboard_monthly_distance',
        name: 'Ranking Mensal de Distância',
        type: 'monthly',
        category: 'distance',
        metric: 'distance',
        timeFrame: {
          start: Date.now(),
          end: Date.now() + 30 * 24 * 60 * 60 * 1000
        },
        participants: 0,
        entries: [],
        lastUpdated: Date.now(),
        isActive: true,
        rewards: [
          { type: 'badge', value: 'monthly_champion', description: 'Badge Campeão Mensal', rank: 1 },
          { type: 'title', value: 'Campeão Mensal', description: 'Título de campeão', rank: 1 },
          { type: 'points', value: 1000, description: '1000 pontos', rank: 1 },
          { type: 'badge', value: 'monthly_runner', description: 'Badge Corredor Mensal', rank: 10 },
          { type: 'points', value: 500, description: '500 pontos', rank: 10 }
        ],
        requirements: [
          { type: 'level', value: 5, condition: 'greater_than' }
        ]
      }
    ];

    this.leaderboards.push(...leaderboards);
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
      currentPoints: 0,
      rank: 'bronze',
      rankProgress: 0,
      achievements: [],
      collectibles: [],
      badges: [],
      titles: [],
      stats: {
        totalRuns: 0,
        totalDistance: 0,
        totalTime: 0,
        averagePace: '0:00',
        bestPace: '0:00',
        longestStreak: 0,
        currentStreak: 0,
        totalElevation: 0,
        totalCalories: 0,
        personalBests: {
          '5k': '0:00',
          '10k': '0:00',
          'half_marathon': '0:00',
          'marathon': '0:00'
        },
        weeklyDistance: 0,
        monthlyDistance: 0,
        yearlyDistance: 0,
        weeklyGoal: 0,
        monthlyGoal: 0,
        yearlyGoal: 0,
        goalCompletion: 0
      },
      preferences: {
        showAchievements: true,
        showCollectibles: true,
        showStats: true,
        showRank: true,
        notifications: true,
        privacy: 'public'
      },
      lastUpdated: Date.now(),
      createdAt: Date.now()
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

    profile.stats.totalDistance += distance;
    profile.stats.totalRuns += 1;
    profile.stats.totalTime += time;
    
    if (pace > 0 && (profile.stats.bestPace === '0:00' || pace < profile.stats.bestPace)) {
      profile.stats.bestPace = pace.toFixed(2); // Formato HH:MM
    }

    profile.lastUpdated = Date.now();

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
            currentValue = profile.stats.totalDistance;
            break;
          case 'streak':
            currentValue = profile.stats.currentStreak;
            break;
          case 'speed':
            currentValue = profile.stats.bestPace !== '0:00' ? 60 / parseFloat(profile.stats.bestPace) : 0; // km/h
            break;
          case 'social':
            // Implementar lógica social
            currentValue = 0;
            break;
          case 'charity':
            // Implementar lógica de caridade
            currentValue = 0;
            break;
          case 'challenge':
            // Implementar lógica de desafios
            currentValue = 0;
            break;
          case 'combination':
            // Implementar lógica de combinação
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
    profile.currentPoints += achievement.points;
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
      if (collectible.id === 'collectible_badge_marathon_legend' && profile.stats.totalDistance >= 5000) {
        this.unlockCollectible(userId, collectible.id);
      } else if (collectible.id === 'collectible_title_legendary_runner' && profile.level >= 100 && profile.stats.currentStreak >= 365) {
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
    collectible.unlockDate = Date.now();
  }

  // Atualizar experiência e nível
  private updateExperienceAndLevel(userId: string): void {
    const profile = this.getUserProfile(userId);
    if (!profile) return;

    // Calcular experiência baseada em corridas e conquistas
    const runExperience = profile.stats.totalRuns * 50;
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
          switch (leaderboard.metric) {
            case 'distance':
              value = profile.stats.totalDistance;
              break;
            case 'time':
              value = profile.stats.totalTime;
              break;
            case 'pace':
              value = profile.stats.bestPace !== '0:00' ? 60 / parseFloat(profile.stats.bestPace) : 0; // km/h
              break;
            case 'elevation':
              value = profile.stats.totalElevation;
              break;
            case 'calories':
              value = profile.stats.totalCalories;
              break;
            case 'points':
              value = profile.currentPoints;
              break;
            case 'xp':
              value = profile.experience;
              break;
            case 'streak':
              value = profile.stats.currentStreak;
              break;
            case 'achievements':
              value = profile.achievements.length;
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
      quest.endDate > Date.now() && !quest.isCompleted
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