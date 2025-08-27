export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'distance' | 'streak' | 'speed' | 'social' | 'charity' | 'challenge' | 'ghost_run' | 'biomechanics' | 'wellness' | 'territory' | 'mentorship' | 'ar_navigation';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'legendary' | 'mythic';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master';
  requirements: {
    type: 'single' | 'cumulative' | 'consecutive' | 'time_based' | 'combination';
    value: number;
    unit?: string;
    timeFrame?: number; // em dias
    conditions?: string[];
    milestones?: number[];
  };
  rewards: {
    points: number;
    xp: number;
    badges: string[];
    titles: string[];
    specialEffects?: string[];
    unlockables?: string[];
  };
  isHidden: boolean;
  isSecret: boolean;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  unlockDate?: number;
  progress?: number;
  maxProgress?: number;
}

export interface Collectible {
  id: string;
  name: string;
  description: string;
  type: 'badge' | 'medal' | 'trophy' | 'title' | 'emote' | 'avatar_frame' | 'route_skin' | 'sound_effect' | 'animation' | 'special_item';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  category: 'achievement' | 'event' | 'seasonal' | 'limited' | 'challenge' | 'social' | 'premium';
  unlockCondition: string;
  unlockDate?: number;
  isEquipped: boolean;
  isTradeable: boolean;
  isLimited: boolean;
  expirationDate?: number;
  collection?: string;
  set?: string;
  powerLevel?: number;
  specialEffects?: string[];
}

export interface UserProfile {
  id: string;
  level: number;
  xp: number;
  totalXp: number;
  points: number;
  totalPoints: number;
  rank: 'novice' | 'apprentice' | 'journeyman' | 'expert' | 'master' | 'grandmaster' | 'legend' | 'mythic';
  title: string;
  badges: string[];
  achievements: string[];
  collectibles: string[];
  stats: {
    totalRuns: number;
    totalDistance: number;
    totalTime: number;
    averagePace: string;
    longestStreak: number;
    currentStreak: number;
    fastest5k: string;
    fastest10k: string;
    fastestHalfMarathon: string;
    fastestMarathon: string;
    totalCalories: number;
    totalElevation: number;
    totalRoutes: number;
    ghostRunsCompleted: number;
    eventsParticipated: number;
    challengesCompleted: number;
    socialActionsCompleted: number;
    mentorshipSessions: number;
    arRoutesCompleted: number;
    biomechanicsSessions: number;
  };
  preferences: {
    favoriteDistance: string;
    favoriteSurface: string;
    favoriteTimeOfDay: string;
    goals: string[];
    challenges: string[];
  };
  inventory: {
    badges: string[];
    medals: string[];
    trophies: string[];
    titles: string[];
    emotes: string[];
    avatarFrames: string[];
    routeSkins: string[];
    soundEffects: string[];
    animations: string[];
    specialItems: string[];
  };
  progress: {
    currentLevelXp: number;
    nextLevelXp: number;
    levelProgress: number;
    rankProgress: number;
    achievementProgress: number;
    collectionProgress: number;
  };
  lastUpdated: number;
}

export interface Leaderboard {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'all_time' | 'event' | 'challenge';
  category: 'distance' | 'speed' | 'streak' | 'points' | 'achievements' | 'social' | 'overall';
  timeFrame: {
    start: number;
    end: number;
  };
  entries: Array<{
    userId: string;
    username: string;
    avatarUrl?: string;
    value: number;
    unit: string;
    rank: number;
    previousRank?: number;
    change: 'up' | 'down' | 'same' | 'new';
    badges: string[];
    title: string;
    level: number;
    xp: number;
  }>;
  totalParticipants: number;
  lastUpdated: number;
  rewards: {
    top1: string[];
    top3: string[];
    top10: string[];
    top100: string[];
  };
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'special' | 'event' | 'challenge';
  category: 'distance' | 'speed' | 'streak' | 'social' | 'exploration' | 'skill' | 'collection';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'legendary';
  requirements: {
    type: 'single' | 'multiple' | 'progressive' | 'time_based' | 'conditional';
    tasks: Array<{
      id: string;
      description: string;
      target: number;
      current: number;
      unit: string;
      isCompleted: boolean;
      reward: number;
    }>;
    timeLimit?: number; // em segundos
    dependencies?: string[]; // IDs de outras quests
  };
  rewards: {
    xp: number;
    points: number;
    badges: string[];
    collectibles: string[];
    specialRewards?: string[];
  };
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  isActive: boolean;
  startDate: number;
  endDate?: number;
  completionDate?: number;
  streak: number;
  maxStreak: number;
}

export interface Season {
  id: string;
  name: string;
  description: string;
  startDate: number;
  endDate: number;
  theme: string;
  specialEvents: string[];
  exclusiveRewards: string[];
  leaderboards: string[];
  challenges: string[];
  isActive: boolean;
  progress: number;
  maxProgress: number;
  rewards: {
    bronze: string[];
    silver: string[];
    gold: string[];
    platinum: string[];
    diamond: string[];
  };
}

export class GamificationManager {
  private achievements: Achievement[] = [];
  private collectibles: Collectible[] = [];
  private userProfiles: UserProfile[] = [];
  private leaderboards: Leaderboard[] = [];
  private quests: Quest[] = [];
  private seasons: Season[] = [];
  private currentSeason: Season | null = null;

  constructor() {
    this.initializeAdvancedAchievements();
    this.initializeCollectibles();
    this.initializeSeasons();
    this.initializeQuests();
  }

  private initializeAdvancedAchievements() {
    const advancedAchievements: Achievement[] = [
      // Conquistas de Distância Avançadas
      {
        id: 'achievement_ultra_runner',
        name: 'Ultra Runner',
        description: 'Complete uma corrida de ultra maratona (50km+)',
        category: 'distance',
        difficulty: 'expert',
        tier: 'platinum',
        requirements: {
          type: 'single',
          value: 50,
          unit: 'km',
          conditions: ['single_run']
        },
        rewards: {
          points: 1000,
          xp: 5000,
          badges: ['ultra_runner'],
          titles: ['Ultra Runner'],
          specialEffects: ['glow_effect'],
          unlockables: ['ultra_route_access']
        },
        isHidden: false,
        isSecret: false,
        rarity: 'epic'
      },
      
      {
        id: 'achievement_century_run',
        name: 'Century Runner',
        description: 'Complete uma corrida de 100km em uma única sessão',
        category: 'distance',
        difficulty: 'legendary',
        tier: 'diamond',
        requirements: {
          type: 'single',
          value: 100,
          unit: 'km',
          conditions: ['single_run', 'no_breaks']
        },
        rewards: {
          points: 5000,
          xp: 25000,
          badges: ['century_runner'],
          titles: ['Century Runner', 'Iron Legs'],
          specialEffects: ['fire_trail', 'legendary_aura'],
          unlockables: ['century_club_access', 'special_medal']
        },
        isHidden: false,
        isSecret: false,
        rarity: 'legendary'
      },

      // Conquistas de Velocidade Avançadas
      {
        id: 'achievement_speed_demon',
        name: 'Speed Demon',
        description: 'Mantenha pace de 3:00/km por 10km consecutivos',
        category: 'speed',
        difficulty: 'expert',
        tier: 'platinum',
        requirements: {
          type: 'consecutive',
          value: 10,
          unit: 'km',
          conditions: ['pace_3min_km', 'consecutive']
        },
        rewards: {
          points: 800,
          xp: 4000,
          badges: ['speed_demon'],
          titles: ['Speed Demon'],
          specialEffects: ['speed_lines'],
          unlockables: ['speed_training_plan']
        },
        isHidden: false,
        isSecret: false,
        rarity: 'epic'
      },

      // Conquistas de Streak Avançadas
      {
        id: 'achievement_streak_master',
        name: 'Streak Master',
        description: 'Mantenha uma sequência de 365 dias consecutivos',
        category: 'streak',
        difficulty: 'legendary',
        tier: 'diamond',
        requirements: {
          type: 'consecutive',
          value: 365,
          unit: 'days',
          conditions: ['daily_run', 'consecutive']
        },
        rewards: {
          points: 10000,
          xp: 50000,
          badges: ['streak_master'],
          titles: ['Streak Master', 'Year Runner'],
          specialEffects: ['golden_aura', 'streak_counter'],
          unlockables: ['streak_master_club', 'special_achievement']
        },
        isHidden: false,
        isSecret: false,
        rarity: 'legendary'
      },

      // Conquistas de Ghost Run Avançadas
      {
        id: 'achievement_ghost_hunter',
        name: 'Ghost Hunter',
        description: 'Complete 50 ghost runs diferentes',
        category: 'ghost_run',
        difficulty: 'advanced',
        tier: 'gold',
        requirements: {
          type: 'cumulative',
          value: 50,
          unit: 'ghost_runs',
          conditions: ['different_ghosts', 'completed']
        },
        rewards: {
          points: 600,
          xp: 3000,
          badges: ['ghost_hunter'],
          titles: ['Ghost Hunter'],
          specialEffects: ['ghost_trail'],
          unlockables: ['exclusive_ghost_runs']
        },
        isHidden: false,
        isSecret: false,
        rarity: 'rare'
      },

      // Conquistas de Biomecânica Avançadas
      {
        id: 'achievement_biomechanics_master',
        name: 'Biomechanics Master',
        description: 'Mantenha score de biomecânica acima de 95 por 30 dias consecutivos',
        category: 'biomechanics',
        difficulty: 'expert',
        tier: 'platinum',
        requirements: {
          type: 'consecutive',
          value: 30,
          unit: 'days',
          conditions: ['biomechanics_score_95', 'consecutive']
        },
        rewards: {
          points: 1200,
          xp: 6000,
          badges: ['biomechanics_master'],
          titles: ['Biomechanics Master'],
          specialEffects: ['perfect_form_aura'],
          unlockables: ['advanced_biomechanics_analysis']
        },
        isHidden: false,
        isSecret: false,
        rarity: 'epic'
      },

      // Conquistas de AR Navigation Avançadas
      {
        id: 'achievement_ar_explorer',
        name: 'AR Explorer',
        description: 'Complete 100 rotas usando navegação AR',
        category: 'ar_navigation',
        difficulty: 'advanced',
        tier: 'gold',
        requirements: {
          type: 'cumulative',
          value: 100,
          unit: 'ar_routes',
          conditions: ['ar_navigation', 'completed']
        },
        rewards: {
          points: 700,
          xp: 3500,
          badges: ['ar_explorer'],
          titles: ['AR Explorer'],
          specialEffects: ['ar_glow'],
          unlockables: ['exclusive_ar_routes']
        },
        isHidden: false,
        isSecret: false,
        rarity: 'rare'
      },

      // Conquistas de Mentoria Avançadas
      {
        id: 'achievement_mentorship_legend',
        name: 'Mentorship Legend',
        description: 'Complete 100 sessões de mentoria como mentor',
        category: 'mentorship',
        difficulty: 'legendary',
        tier: 'diamond',
        requirements: {
          type: 'cumulative',
          value: 100,
          unit: 'mentorship_sessions',
          conditions: ['as_mentor', 'completed']
        },
        rewards: {
          points: 8000,
          xp: 40000,
          badges: ['mentorship_legend'],
          titles: ['Mentorship Legend', 'Sage Runner'],
          specialEffects: ['wisdom_aura', 'mentor_glow'],
          unlockables: ['mentorship_hall_of_fame', 'special_title']
        },
        isHidden: false,
        isSecret: false,
        rarity: 'legendary'
      },

      // Conquistas Secretas/Míticas
      {
        id: 'achievement_runner_god',
        name: 'Runner God',
        description: 'Complete todas as conquistas de nível mítico',
        category: 'challenge',
        difficulty: 'mythic',
        tier: 'master',
        requirements: {
          type: 'combination',
          value: 1,
          conditions: ['all_mythic_achievements'],
          milestones: [10, 25, 50, 100]
        },
        rewards: {
          points: 50000,
          xp: 250000,
          badges: ['runner_god'],
          titles: ['Runner God', 'Divine Runner', 'Immortal'],
          specialEffects: ['divine_aura', 'god_rays', 'celestial_music'],
          unlockables: ['runner_god_club', 'exclusive_content', 'special_medal']
        },
        isHidden: true,
        isSecret: true,
        rarity: 'mythic'
      }
    ];

    this.achievements.push(...advancedAchievements);
  }

  private initializeCollectibles() {
    const advancedCollectibles: Collectible[] = [
      // Badges Avançados
      {
        id: 'badge_ultra_marathoner',
        name: 'Ultra Marathoner',
        description: 'Conquistado por completar uma ultra maratona',
        type: 'badge',
        rarity: 'epic',
        category: 'achievement',
        unlockCondition: 'Complete achievement_ultra_runner',
        isEquipped: false,
        isTradeable: false,
        isLimited: false,
        powerLevel: 85,
        specialEffects: ['glow_effect']
      },

      // Títulos Avançados
      {
        id: 'title_runner_god',
        name: 'Runner God',
        description: 'Título mítico para os maiores corredores',
        type: 'title',
        rarity: 'mythic',
        category: 'achievement',
        unlockCondition: 'Complete achievement_runner_god',
        isEquipped: false,
        isTradeable: false,
        isLimited: true,
        powerLevel: 100,
        specialEffects: ['divine_aura', 'god_rays']
      },

      // Medalhas Especiais
      {
        id: 'medal_century_club',
        name: 'Century Club Medal',
        description: 'Medalha exclusiva para membros do Century Club',
        type: 'medal',
        rarity: 'legendary',
        category: 'achievement',
        unlockCondition: 'Complete achievement_century_run',
        isEquipped: false,
        isTradeable: false,
        isLimited: true,
        powerLevel: 95,
        specialEffects: ['golden_glow', 'precious_metal']
      }
    ];

    this.collectibles.push(...advancedCollectibles);
  }

  private initializeSeasons() {
    const newSeason: Season = {
      id: 'season_2024_spring',
      name: 'Spring Running 2024',
      description: 'Temporada de primavera com foco em velocidade e resistência',
      startDate: Date.now(),
      endDate: Date.now() + 90 * 24 * 60 * 60 * 1000, // 90 dias
      theme: 'Spring Speed',
      specialEvents: ['spring_speed_challenge', 'flower_run_5k', 'spring_marathon'],
      exclusiveRewards: ['spring_medal', 'flower_badge', 'speed_title'],
      leaderboards: ['spring_speed', 'spring_distance', 'spring_achievements'],
      challenges: ['spring_streak', 'speed_improvement', 'distance_goals'],
      isActive: true,
      progress: 0,
      maxProgress: 1000,
      rewards: {
        bronze: ['spring_bronze_medal'],
        silver: ['spring_silver_medal', 'spring_badge'],
        gold: ['spring_gold_medal', 'spring_title'],
        platinum: ['spring_platinum_medal', 'exclusive_spring_content'],
        diamond: ['spring_diamond_medal', 'legendary_spring_reward']
      }
    };

    this.seasons.push(newSeason);
    this.currentSeason = newSeason;
  }

  private initializeQuests() {
    const advancedQuests: Quest[] = [
      // Quest Diária Avançada
      {
        id: 'quest_daily_speed_challenge',
        name: 'Speed Challenge',
        description: 'Complete uma corrida com pace melhor que seu recorde pessoal',
        type: 'daily',
        category: 'speed',
        difficulty: 'hard',
        requirements: {
          type: 'single',
          tasks: [
            {
              id: 'task_beat_personal_record',
              description: 'Corra com pace melhor que seu recorde pessoal',
              target: 1,
              current: 0,
              unit: 'run',
              isCompleted: false,
              reward: 100
            }
          ]
        },
        rewards: {
          xp: 200,
          points: 50,
          badges: ['speed_improver'],
          collectibles: ['speed_medal']
        },
        progress: 0,
        maxProgress: 1,
        isCompleted: false,
        isActive: true,
        startDate: Date.now(),
        streak: 0,
        maxStreak: 0
      },

      // Quest Semanal Avançada
      {
        id: 'quest_weekly_distance_master',
        name: 'Distance Master',
        description: 'Complete 50km em uma semana com pelo menos 5 corridas',
        type: 'weekly',
        category: 'distance',
        difficulty: 'expert',
        requirements: {
          type: 'multiple',
          tasks: [
            {
              id: 'task_weekly_distance',
              description: 'Complete 50km em uma semana',
              target: 50,
              current: 0,
              unit: 'km',
              isCompleted: false,
              reward: 500
            },
            {
              id: 'task_weekly_runs',
              description: 'Complete pelo menos 5 corridas',
              target: 5,
              current: 0,
              unit: 'runs',
              isCompleted: false,
              reward: 300
            }
          ]
        },
        rewards: {
          xp: 1000,
          points: 200,
          badges: ['distance_master'],
          collectibles: ['weekly_distance_medal']
        },
        progress: 0,
        maxProgress: 2,
        isCompleted: false,
        isActive: true,
        startDate: Date.now(),
        streak: 0,
        maxStreak: 0
      }
    ];

    this.quests.push(...advancedQuests);
  }

  // Obter conquistas por dificuldade
  public getAchievementsByDifficulty(difficulty: string): Achievement[] {
    return this.achievements.filter(a => a.difficulty === difficulty);
  }

  // Obter conquistas por categoria
  public getAchievementsByCategory(category: string): Achievement[] {
    return this.achievements.filter(a => a.category === category);
  }

  // Obter conquistas por raridade
  public getAchievementsByRarity(rarity: string): Achievement[] {
    return this.achievements.filter(a => a.rarity === rarity);
  }

  // Obter conquistas secretas
  public getSecretAchievements(): Achievement[] {
    return this.achievements.filter(a => a.isSecret);
  }

  // Obter conquistas ocultas
  public getHiddenAchievements(): Achievement[] {
    return this.achievements.filter(a => a.isHidden);
  }

  // Obter conquistas por tier
  public getAchievementsByTier(tier: string): Achievement[] {
    return this.achievements.filter(a => a.tier === tier);
  }

  // Obter conquistas por usuário
  public getUserAchievements(userId: string): Achievement[] {
    const userProfile = this.userProfiles.find(p => p.id === userId);
    if (!userProfile) return [];

    return this.achievements.filter(a => 
      userProfile.achievements.includes(a.id)
    );
  }

  // Obter conquistas disponíveis para usuário
  public getAvailableAchievements(userId: string): Achievement[] {
    const userProfile = this.userProfiles.find(p => p.id === userId);
    if (!userProfile) return [];

    return this.achievements.filter(a => 
      !userProfile.achievements.includes(a.id) && 
      this.checkAchievementRequirements(a, userProfile)
    );
  }

  // Verificar requisitos de conquista
  private checkAchievementRequirements(achievement: Achievement, userProfile: UserProfile): boolean {
    // Implementar lógica de verificação baseada nos requisitos
    // Esta é uma implementação simplificada
    return true;
  }

  // Obter colecionáveis por usuário
  public getUserCollectibles(userId: string): Collectible[] {
    const userProfile = this.userProfiles.find(p => p.id === userId);
    if (!userProfile) return [];

    return this.collectibles.filter(c => 
      userProfile.collectibles.includes(c.id)
    );
  }

  // Obter colecionáveis por raridade
  public getCollectiblesByRarity(rarity: string): Collectible[] {
    return this.collectibles.filter(c => c.rarity === rarity);
  }

  // Obter colecionáveis por categoria
  public getCollectiblesByCategory(category: string): Collectible[] {
    return this.collectibles.filter(c => c.category === category);
  }

  // Obter colecionáveis limitados
  public getLimitedCollectibles(): Collectible[] {
    return this.collectibles.filter(c => c.isLimited);
  }

  // Obter colecionáveis colecionáveis
  public getCollectibleSets(): { [key: string]: Collectible[] } {
    const sets: { [key: string]: Collectible[] } = {};
    
    this.collectibles.forEach(collectible => {
      if (collectible.set) {
        if (!sets[collectible.set]) {
          sets[collectible.set] = [];
        }
        sets[collectible.set].push(collectible);
      }
    });

    return sets;
  }

  // Obter perfil do usuário
  public getUserProfile(userId: string): UserProfile | undefined {
    return this.userProfiles.find(p => p.id === userId);
  }

  // Atualizar perfil do usuário
  public updateUserProfile(userId: string, updates: Partial<UserProfile>): UserProfile | null {
    const profile = this.userProfiles.find(p => p.id === userId);
    if (!profile) return null;

    Object.assign(profile, updates);
    profile.lastUpdated = Date.now();
    return profile;
  }

  // Adicionar XP ao usuário
  public addUserXP(userId: string, xp: number): boolean {
    const profile = this.userProfiles.find(p => p.id === userId);
    if (!profile) return false;

    profile.xp += xp;
    profile.totalXp += xp;
    
    // Verificar se subiu de nível
    this.checkLevelUp(profile);
    
    profile.lastUpdated = Date.now();
    return true;
  }

  // Verificar se usuário subiu de nível
  private checkLevelUp(profile: UserProfile): void {
    const xpForNextLevel = this.calculateXPForLevel(profile.level + 1);
    
    if (profile.xp >= xpForNextLevel) {
      profile.level++;
      profile.xp -= xpForNextLevel;
      profile.currentLevelXp = profile.xp;
      profile.nextLevelXp = this.calculateXPForLevel(profile.level + 1);
      
      // Verificar se subiu de rank
      this.checkRankUp(profile);
      
      // Atualizar progresso
      this.updateProgress(profile);
    }
  }

  // Calcular XP necessário para um nível
  private calculateXPForLevel(level: number): number {
    // Fórmula exponencial para XP necessário
    return Math.floor(100 * Math.pow(1.5, level - 1));
  }

  // Verificar se usuário subiu de rank
  private checkRankUp(profile: UserProfile): void {
    const ranks = ['novice', 'apprentice', 'journeyman', 'expert', 'master', 'grandmaster', 'legend', 'mythic'];
    const currentRankIndex = ranks.indexOf(profile.rank);
    
    if (currentRankIndex < ranks.length - 1) {
      const nextRank = ranks[currentRankIndex + 1];
      const requiredLevel = this.getRequiredLevelForRank(nextRank);
      
      if (profile.level >= requiredLevel) {
        profile.rank = nextRank as UserProfile['rank'];
      }
    }
  }

  // Obter nível necessário para um rank
  private getRequiredLevelForRank(rank: string): number {
    const rankRequirements: { [key: string]: number } = {
      'novice': 1,
      'apprentice': 10,
      'journeyman': 25,
      'expert': 50,
      'master': 100,
      'grandmaster': 200,
      'legend': 500,
      'mythic': 1000
    };
    
    return rankRequirements[rank] || 1;
  }

  // Atualizar progresso do usuário
  private updateProgress(profile: UserProfile): void {
    // Progresso do nível atual
    profile.progress.currentLevelXp = profile.xp;
    profile.progress.nextLevelXp = this.calculateXPForLevel(profile.level + 1);
    profile.progress.levelProgress = (profile.xp / profile.progress.nextLevelXp) * 100;
    
    // Progresso do rank
    const currentRankIndex = ['novice', 'apprentice', 'journeyman', 'expert', 'master', 'grandmaster', 'legend', 'mythic'].indexOf(profile.rank);
    const nextRank = ['novice', 'apprentice', 'journeyman', 'expert', 'master', 'grandmaster', 'legend', 'mythic'][currentRankIndex + 1];
    
    if (nextRank) {
      const currentLevel = profile.level;
      const requiredLevel = this.getRequiredLevelForRank(nextRank);
      const previousLevel = currentRankIndex > 0 ? this.getRequiredLevelForRank(['novice', 'apprentice', 'journeyman', 'expert', 'master', 'grandmaster', 'legend', 'mythic'][currentRankIndex - 1]) : 1;
      
      profile.progress.rankProgress = ((currentLevel - previousLevel) / (requiredLevel - previousLevel)) * 100;
    }
    
    // Progresso das conquistas
    const totalAchievements = this.achievements.length;
    const userAchievements = profile.achievements.length;
    profile.progress.achievementProgress = (userAchievements / totalAchievements) * 100;
    
    // Progresso das coleções
    const totalCollectibles = this.collectibles.length;
    const userCollectibles = profile.collectibles.length;
    profile.progress.collectionProgress = (userCollectibles / totalCollectibles) * 100;
  }

  // Obter leaderboards
  public getLeaderboards(type?: string): Leaderboard[] {
    if (type) {
      return this.leaderboards.filter(l => l.type === type);
    }
    return this.leaderboards;
  }

  // Obter leaderboard por categoria
  public getLeaderboardByCategory(category: string): Leaderboard | undefined {
    return this.leaderboards.find(l => l.category === category);
  }

  // Obter quests ativas
  public getActiveQuests(userId: string): Quest[] {
    return this.quests.filter(q => q.isActive && !q.isCompleted);
  }

  // Obter quests por tipo
  public getQuestsByType(type: string): Quest[] {
    return this.quests.filter(q => q.type === type);
  }

  // Obter quests por dificuldade
  public getQuestsByDifficulty(difficulty: string): Quest[] {
    return this.quests.filter(q => q.difficulty === difficulty);
  }

  // Obter quests por categoria
  public getQuestsByCategory(category: string): Quest[] {
    return this.quests.filter(q => q.category === category);
  }

  // Obter quests completadas
  public getCompletedQuests(userId: string): Quest[] {
    return this.quests.filter(q => q.isCompleted);
  }

  // Obter temporada atual
  public getCurrentSeason(): Season | null {
    return this.currentSeason;
  }

  // Obter temporadas
  public getSeasons(): Season[] {
    return this.seasons;
  }

  // Obter temporada por ID
  public getSeasonById(seasonId: string): Season | undefined {
    return this.seasons.find(s => s.id === seasonId);
  }

  // Obter estatísticas gerais
  public getGeneralStats(): {
    totalAchievements: number;
    totalCollectibles: number;
    totalUsers: number;
    averageLevel: number;
    averageRank: string;
    mostRareAchievement: string;
    mostRareCollectible: string;
    totalXP: number;
    totalPoints: number;
  } {
    const totalAchievements = this.achievements.length;
    const totalCollectibles = this.collectibles.length;
    const totalUsers = this.userProfiles.length;
    
    const totalXP = this.userProfiles.reduce((sum, p) => sum + p.totalXp, 0);
    const totalPoints = this.userProfiles.reduce((sum, p) => sum + p.totalPoints, 0);
    
    const averageLevel = totalUsers > 0 ? 
      this.userProfiles.reduce((sum, p) => sum + p.level, 0) / totalUsers : 0;
    
    // Rank mais comum
    const rankCounts = this.userProfiles.reduce((acc, profile) => {
      acc[profile.rank] = (acc[profile.rank] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const averageRank = Object.entries(rankCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'novice';
    
    // Conquista mais rara
    const mostRareAchievement = this.achievements
      .sort((a, b) => this.getRarityValue(b.rarity) - this.getRarityValue(a.rarity))[0]?.name || 'N/A';
    
    // Colecionável mais raro
    const mostRareCollectible = this.collectibles
      .sort((a, b) => this.getRarityValue(b.rarity) - this.getRarityValue(a.rarity))[0]?.name || 'N/A';

    return {
      totalAchievements,
      totalCollectibles,
      totalUsers,
      averageLevel: Math.round(averageLevel * 100) / 100,
      averageRank,
      mostRareAchievement,
      mostRareCollectible,
      totalXP,
      totalPoints
    };
  }

  // Obter valor numérico da raridade
  private getRarityValue(rarity: string): number {
    const rarityValues: { [key: string]: number } = {
      'common': 1,
      'uncommon': 2,
      'rare': 3,
      'epic': 4,
      'legendary': 5,
      'mythic': 6
    };
    
    return rarityValues[rarity] || 0;
  }
}

export function createGamificationManager(): GamificationManager {
  return new GamificationManager();
}