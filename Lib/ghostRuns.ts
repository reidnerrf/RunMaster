export interface FamousRunner {
  id: string;
  name: string;
  nickname: string;
  country: string;
  achievements: string[];
  personalBests: {
    '5k': string;
    '10k': string;
    'half_marathon': string;
    'marathon': string;
  };
  worldRecords: string[];
  olympicMedals: string[];
  career: {
    startYear: number;
    endYear?: number;
    totalRaces: number;
    wins: number;
    worldChampionships: number;
  };
  runningStyle: 'speed' | 'endurance' | 'tactical' | 'versatile';
  specialties: string[];
  bio: string;
  avatarUrl?: string;
  isActive: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite';
}

export interface GhostRun {
  id: string;
  runnerId: string;
  routeId: string;
  name: string;
  description: string;
  distance: number; // km
  targetTime: string; // formato "HH:MM:SS"
  targetPace: string; // formato "MM:SS"
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  category: 'famous_runner' | 'olympic_race' | 'world_record' | 'personal_challenge';
  weather: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    conditions: 'sunny' | 'cloudy' | 'rainy' | 'windy';
  };
  elevation: {
    gain: number;
    loss: number;
    profile: 'flat' | 'rolling' | 'hilly' | 'mountainous';
  };
  surface: 'road' | 'track' | 'trail' | 'mixed';
  isActive: boolean;
  createdAt: number;
  totalAttempts: number;
  successfulAttempts: number;
  bestTime: string;
  averageTime: string;
}

export interface GhostRunAttempt {
  id: string;
  userId: string;
  ghostRunId: string;
  startTime: number;
  endTime?: number;
  duration?: number; // segundos
  distance: number;
  pace: string;
  splits: {
    km: number;
    time: string;
    pace: string;
    heartRate?: number;
  }[];
  comparison: {
    timeDifference: number; // segundos (negativo = mais rápido)
    paceDifference: string;
    percentageDifference: number;
    result: 'faster' | 'slower' | 'tied';
    rank: number;
  };
  weather: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    conditions: string;
  };
  notes?: string;
  isCompleted: boolean;
  achievements: string[];
}

export interface GhostRunLeaderboard {
  ghostRunId: string;
  entries: Array<{
    userId: string;
    username: string;
    time: string;
    pace: string;
    date: number;
    rank: number;
    percentageDifference: number;
  }>;
  lastUpdated: number;
}

export interface GhostRunChallenge {
  id: string;
  name: string;
  description: string;
  ghostRuns: string[]; // IDs dos ghost runs
  startDate: number;
  endDate: number;
  isActive: boolean;
  participants: string[]; // IDs dos usuários
  leaderboard: Array<{
    userId: string;
    username: string;
    totalTime: string;
    averagePace: string;
    completedRuns: number;
    totalRuns: number;
    score: number;
    rank: number;
  }>;
  rewards: {
    badges: string[];
    points: number;
    title?: string;
  };
}

export class GhostRunManager {
  private famousRunners: FamousRunner[] = [];
  private ghostRuns: GhostRun[] = [];
  private attempts: GhostRunAttempt[] = [];
  private leaderboards: GhostRunLeaderboard[] = [];
  private challenges: GhostRunChallenge[] = [];

  constructor() {
    this.initializeFamousRunners();
    this.initializeGhostRuns();
    this.initializeChallenges();
  }

  private initializeFamousRunners() {
    const runners: FamousRunner[] = [
      // Corredores de 5K/10K
      {
        id: 'eliud_kipchoge',
        name: 'Eliud Kipchoge',
        nickname: 'The Philosopher',
        country: 'Kenya',
        achievements: [
          'Maratona em 1:59:40 (Breaking2)',
          '2x Campeão Olímpico (2016, 2020)',
          '4x Vencedor da Maratona de Londres',
          '4x Vencedor da Maratona de Berlim'
        ],
        personalBests: {
          '5k': '12:46',
          '10k': '26:24',
          'half_marathon': '58:18',
          'marathon': '2:01:09'
        },
        worldRecords: ['Maratona: 2:01:09'],
        olympicMedals: ['Ouro 2016', 'Ouro 2020'],
        career: {
          startYear: 2003,
          totalRaces: 25,
          wins: 23,
          worldChampionships: 2
        },
        runningStyle: 'endurance',
        specialties: ['maratona', 'meia maratona'],
        bio: 'Considerado o maior maratonista da história, Kipchoge é conhecido por sua filosofia de vida e técnica perfeita.',
        isActive: true,
        difficulty: 'elite'
      },
      {
        id: 'haile_gebrselassie',
        name: 'Haile Gebrselassie',
        nickname: 'The Emperor',
        country: 'Etiópia',
        achievements: [
          '27 recordes mundiais',
          '2x Campeão Olímpico (1996, 2000)',
          '4x Campeão Mundial (1993, 1995, 1997, 1999)',
          'Vencedor da Maratona de Berlim 4x'
        ],
        personalBests: {
          '5k': '12:56',
          '10k': '26:22',
          'half_marathon': '58:55',
          'marathon': '2:03:59'
        },
        worldRecords: ['10.000m: 26:22.75', 'Meia Maratona: 58:55'],
        olympicMedals: ['Ouro 1996', 'Ouro 2000'],
        career: {
          startYear: 1992,
          endYear: 2015,
          totalRaces: 45,
          wins: 38,
          worldChampionships: 4
        },
        runningStyle: 'versatile',
        specialties: ['5k', '10k', 'meia maratona'],
        bio: 'Um dos maiores corredores de todos os tempos, Gebrselassie dominou as distâncias de 5K a maratona por duas décadas.',
        isActive: false,
        difficulty: 'elite'
      },
      {
        id: 'kenenisa_bekele',
        name: 'Kenenisa Bekele',
        nickname: 'The King',
        country: 'Etiópia',
        achievements: [
          'Recordista mundial 5K e 10K',
          '3x Campeão Mundial (2003, 2005, 2007)',
          'Campeão Olímpico (2004, 2008)',
          'Vencedor da Maratona de Berlim (2019)'
        ],
        personalBests: {
          '5k': '12:37',
          '10k': '26:17',
          'half_marathon': '59:25',
          'marathon': '2:01:41'
        },
        worldRecords: ['5.000m: 12:37.35', '10.000m: 26:17.53'],
        olympicMedals: ['Ouro 2004', 'Ouro 2008'],
        career: {
          startYear: 2001,
          totalRaces: 35,
          wins: 28,
          worldChampionships: 3
        },
        runningStyle: 'speed',
        specialties: ['5k', '10k', 'cross country'],
        bio: 'Especialista em distâncias médias, Bekele é conhecido por sua velocidade explosiva e táticas inteligentes.',
        isActive: true,
        difficulty: 'advanced'
      },
      {
        id: 'paula_radcliffe',
        name: 'Paula Radcliffe',
        nickname: 'The Queen of the Road',
        country: 'Reino Unido',
        achievements: [
          'Recordista mundial feminina maratona (2:15:25)',
          '3x Vencedora da Maratona de Londres',
          'Campeã Mundial (2005)',
          'Vencedora da Maratona de Nova York (2004)'
        ],
        personalBests: {
          '5k': '14:29',
          '10k': '30:01',
          'half_marathon': '1:05:40',
          'marathon': '2:15:25'
        },
        worldRecords: ['Maratona Feminina: 2:15:25'],
        olympicMedals: [],
        career: {
          startYear: 1992,
          endYear: 2015,
          totalRaces: 28,
          wins: 18,
          worldChampionships: 1
        },
        runningStyle: 'endurance',
        specialties: ['maratona', 'meia maratona'],
        bio: 'Uma das maiores maratonistas femininas da história, Radcliffe revolucionou o esporte com sua abordagem científica.',
        isActive: false,
        difficulty: 'advanced'
      },
      {
        id: 'mo_farah',
        name: 'Mo Farah',
        nickname: 'Mobot',
        country: 'Reino Unido',
        achievements: [
          '4x Campeão Olímpico (2012, 2016)',
          '6x Campeão Mundial (2011, 2013, 2015, 2017)',
          'Vencedor da Maratona de Chicago (2018)',
          'Vencedor da Maratona de Londres (2018)'
        ],
        personalBests: {
          '5k': '12:53',
          '10k': '26:46',
          'half_marathon': '59:07',
          'marathon': '2:05:11'
        },
        worldRecords: [],
        olympicMedals: ['Ouro 2012 (5K, 10K)', 'Ouro 2016 (5K, 10K)'],
        career: {
          startYear: 2005,
          totalRaces: 42,
          wins: 31,
          worldChampionships: 6
        },
        runningStyle: 'tactical',
        specialties: ['5k', '10k', 'maratona'],
        bio: 'Especialista em táticas de corrida, Farah é conhecido por sua capacidade de acelerar no final das provas.',
        isActive: true,
        difficulty: 'advanced'
      }
    ];

    this.famousRunners.push(...runners);
  }

  private initializeGhostRuns() {
    const runs: GhostRun[] = [
      // Ghost Run: Eliud Kipchoge - Breaking2
      {
        id: 'ghost_kipchoge_breaking2',
        runnerId: 'eliud_kipchoge',
        routeId: 'route_breaking2',
        name: 'Breaking2 com Eliud Kipchoge',
        description: 'Corra contra o tempo histórico de 1:59:40 estabelecido por Kipchoge no projeto Breaking2. Esta é uma das maiores conquistas da história da corrida.',
        distance: 42.2,
        targetTime: '1:59:40',
        targetPace: '2:50',
        difficulty: 'elite',
        category: 'famous_runner',
        weather: {
          temperature: 12,
          humidity: 65,
          windSpeed: 5,
          conditions: 'sunny'
        },
        elevation: {
          gain: 50,
          loss: 50,
          profile: 'flat'
        },
        surface: 'road',
        isActive: true,
        createdAt: Date.now(),
        totalAttempts: 0,
        successfulAttempts: 0,
        bestTime: '',
        averageTime: ''
      },
      
      // Ghost Run: Haile Gebrselassie - 10K World Record
      {
        id: 'ghost_gebrselassie_10k',
        runnerId: 'haile_gebrselassie',
        routeId: 'route_10k_world_record',
        name: '10K World Record com Haile Gebrselassie',
        description: 'Desafie o recorde mundial de 26:22 estabelecido por Gebrselassie. Uma prova de velocidade e resistência.',
        distance: 10,
        targetTime: '26:22',
        targetPace: '2:38',
        difficulty: 'elite',
        category: 'world_record',
        weather: {
          temperature: 18,
          humidity: 55,
          windSpeed: 3,
          conditions: 'cloudy'
        },
        elevation: {
          gain: 20,
          loss: 20,
          profile: 'flat'
        },
        surface: 'track',
        isActive: true,
        createdAt: Date.now(),
        totalAttempts: 0,
        successfulAttempts: 0,
        bestTime: '',
        averageTime: ''
      },
      
      // Ghost Run: Kenenisa Bekele - 5K Speed
      {
        id: 'ghost_bekele_5k',
        runnerId: 'kenenisa_bekele',
        routeId: 'route_5k_speed',
        name: '5K Speed com Kenenisa Bekele',
        description: 'Teste sua velocidade contra o recorde mundial de 12:37 de Bekele. Uma prova explosiva de 5 quilômetros.',
        distance: 5,
        targetTime: '12:37',
        targetPace: '2:31',
        difficulty: 'advanced',
        category: 'world_record',
        weather: {
          temperature: 16,
          humidity: 60,
          windSpeed: 2,
          conditions: 'sunny'
        },
        elevation: {
          gain: 10,
          loss: 10,
          profile: 'flat'
        },
        surface: 'track',
        isActive: true,
        createdAt: Date.now(),
        totalAttempts: 0,
        successfulAttempts: 0,
        bestTime: '',
        averageTime: ''
      },
      
      // Ghost Run: Paula Radcliffe - London Marathon
      {
        id: 'ghost_radcliffe_london',
        runnerId: 'paula_radcliffe',
        routeId: 'route_london_marathon',
        name: 'London Marathon com Paula Radcliffe',
        description: 'Corra a Maratona de Londres contra o tempo de 2:15:25 de Radcliffe. Uma prova de resistência feminina.',
        distance: 42.2,
        targetTime: '2:15:25',
        targetPace: '3:12',
        difficulty: 'advanced',
        category: 'famous_runner',
        weather: {
          temperature: 14,
          humidity: 70,
          windSpeed: 8,
          conditions: 'cloudy'
        },
        elevation: {
          gain: 120,
          loss: 120,
          profile: 'rolling'
        },
        surface: 'road',
        isActive: true,
        createdAt: Date.now(),
        totalAttempts: 0,
        successfulAttempts: 0,
        bestTime: '',
        averageTime: ''
      },
      
      // Ghost Run: Mo Farah - Olympic 10K
      {
        id: 'ghost_farah_olympic_10k',
        runnerId: 'mo_farah',
        routeId: 'route_olympic_10k',
        name: 'Olympic 10K com Mo Farah',
        description: 'Reviva a final olímpica de 10K de 2012 com Mo Farah. Uma prova tática com sprint final.',
        distance: 10,
        targetTime: '27:30',
        targetPace: '2:45',
        difficulty: 'advanced',
        category: 'olympic_race',
        weather: {
          temperature: 22,
          humidity: 50,
          windSpeed: 4,
          conditions: 'sunny'
        },
        elevation: {
          gain: 15,
          loss: 15,
          profile: 'flat'
        },
        surface: 'track',
        isActive: true,
        createdAt: Date.now(),
        totalAttempts: 0,
        successfulAttempts: 0,
        bestTime: '',
        averageTime: ''
      }
    ];

    this.ghostRuns.push(...runs);
  }

  private initializeChallenges() {
    const challenges: GhostRunChallenge[] = [
      {
        id: 'challenge_olympic_legends',
        name: 'Desafio das Lendas Olímpicas',
        description: 'Complete ghost runs de 3 diferentes campeões olímpicos para desbloquear o título "Lenda da Corrida".',
        ghostRuns: [
          'ghost_kipchoge_breaking2',
          'ghost_gebrselassie_10k',
          'ghost_farah_olympic_10k'
        ],
        startDate: Date.now(),
        endDate: Date.now() + 90 * 24 * 60 * 60 * 1000, // 90 dias
        isActive: true,
        participants: [],
        leaderboard: [],
        rewards: {
          badges: ['olympic_legend', 'ghost_hunter', 'speed_demon'],
          points: 1000,
          title: 'Lenda da Corrida'
        }
      },
      
      {
        id: 'challenge_world_records',
        name: 'Desafio dos Recordes Mundiais',
        description: 'Tente quebrar 2 recordes mundiais em ghost runs para desbloquear o título "Quebrador de Recordes".',
        ghostRuns: [
          'ghost_gebrselassie_10k',
          'ghost_bekele_5k'
        ],
        startDate: Date.now(),
        endDate: Date.now() + 60 * 24 * 60 * 60 * 1000, // 60 dias
        isActive: true,
        participants: [],
        leaderboard: [],
        rewards: {
          badges: ['world_record_breaker', 'speed_legend'],
          points: 800,
          title: 'Quebrador de Recordes'
        }
      }
    ];

    this.challenges.push(...challenges);
  }

  // Obter corredores famosos
  public getFamousRunners(filters?: {
    country?: string;
    specialty?: string;
    difficulty?: string;
    isActive?: boolean;
  }): FamousRunner[] {
    let filtered = [...this.famousRunners];

    if (filters?.country) {
      filtered = filtered.filter(r => r.country === filters.country);
    }

    if (filters?.specialty) {
      filtered = filtered.filter(r => r.specialties.includes(filters.specialty!));
    }

    if (filters?.difficulty) {
      filtered = filtered.filter(r => r.difficulty === filters.difficulty);
    }

    if (filters?.isActive !== undefined) {
      filtered = filtered.filter(r => r.isActive === filters.isActive);
    }

    return filtered.sort((a, b) => b.career.wins - a.career.wins);
  }

  // Obter corredor famoso por ID
  public getFamousRunnerById(runnerId: string): FamousRunner | undefined {
    return this.famousRunners.find(r => r.id === runnerId);
  }

  // Obter ghost runs disponíveis
  public getGhostRuns(filters?: {
    runnerId?: string;
    category?: string;
    difficulty?: string;
    distance?: number;
    isActive?: boolean;
  }): GhostRun[] {
    let filtered = [...this.ghostRuns];

    if (filters?.runnerId) {
      filtered = filtered.filter(r => r.runnerId === filters.runnerId);
    }

    if (filters?.category) {
      filtered = filtered.filter(r => r.category === filters.category);
    }

    if (filters?.difficulty) {
      filtered = filtered.filter(r => r.difficulty === filters.difficulty);
    }

    if (filters?.distance) {
      filtered = filtered.filter(r => r.distance === filters.distance);
    }

    if (filters?.isActive !== undefined) {
      filtered = filtered.filter(r => r.isActive === filters.isActive);
    }

    return filtered.sort((a, b) => b.totalAttempts - a.totalAttempts);
  }

  // Obter ghost run por ID
  public getGhostRunById(ghostRunId: string): GhostRun | undefined {
    return this.ghostRuns.find(r => r.id === ghostRunId);
  }

  // Iniciar tentativa de ghost run
  public startGhostRunAttempt(
    userId: string,
    ghostRunId: string,
    startTime: number
  ): GhostRunAttempt {
    const ghostRun = this.ghostRuns.find(r => r.id === ghostRunId);
    if (!ghostRun) throw new Error('Ghost run não encontrado');

    const attempt: GhostRunAttempt = {
      id: `attempt_${Date.now()}`,
      userId,
      ghostRunId,
      startTime,
      distance: ghostRun.distance,
      pace: '',
      splits: [],
      comparison: {
        timeDifference: 0,
        paceDifference: '',
        percentageDifference: 0,
        result: 'tied',
        rank: 0
      },
      weather: ghostRun.weather,
      isCompleted: false,
      achievements: []
    };

    this.attempts.push(attempt);
    return attempt;
  }

  // Atualizar tentativa durante a corrida
  public updateGhostRunAttempt(
    attemptId: string,
    updates: Partial<GhostRunAttempt>
  ): GhostRunAttempt | null {
    const attempt = this.attempts.find(a => a.id === attemptId);
    if (!attempt) return null;

    Object.assign(attempt, updates);
    return attempt;
  }

  // Finalizar tentativa de ghost run
  public finishGhostRunAttempt(
    attemptId: string,
    endTime: number,
    finalDistance: number,
    finalPace: string,
    splits: any[]
  ): GhostRunAttempt | null {
    const attempt = this.attempts.find(a => a.id === attemptId);
    if (!attempt) return null;

    attempt.endTime = endTime;
    attempt.duration = endTime - attempt.startTime;
    attempt.distance = finalDistance;
    attempt.pace = finalPace;
    attempt.splits = splits;
    attempt.isCompleted = true;

    // Calcular comparação com o ghost
    const ghostRun = this.ghostRuns.find(r => r.id === attempt.ghostRunId);
    if (ghostRun) {
      const comparison = this.calculateComparison(attempt, ghostRun);
      attempt.comparison = comparison;

      // Atualizar estatísticas do ghost run
      this.updateGhostRunStats(ghostRun.id, attempt);

      // Verificar conquistas
      attempt.achievements = this.checkAchievements(attempt, ghostRun);
    }

    return attempt;
  }

  // Calcular comparação com o ghost
  private calculateComparison(
    attempt: GhostRunAttempt,
    ghostRun: GhostRun
  ): GhostRunAttempt['comparison'] {
    const targetTimeSeconds = this.timeToSeconds(ghostRun.targetTime);
    const actualTimeSeconds = attempt.duration!;
    
    const timeDifference = actualTimeSeconds - targetTimeSeconds;
    const percentageDifference = (timeDifference / targetTimeSeconds) * 100;
    
    let result: 'faster' | 'slower' | 'tied';
    if (timeDifference < 0) result = 'faster';
    else if (timeDifference > 0) result = 'slower';
    else result = 'tied';

    // Calcular diferença de pace
    const targetPaceSeconds = this.paceToSeconds(ghostRun.targetPace);
    const actualPaceSeconds = this.paceToSeconds(attempt.pace);
    const paceDifference = actualPaceSeconds - targetPaceSeconds;
    
    const paceDifferenceStr = this.formatPaceDifference(paceDifference);

    return {
      timeDifference,
      paceDifference: paceDifferenceStr,
      percentageDifference: Math.round(percentageDifference * 100) / 100,
      result,
      rank: 0 // Será calculado ao atualizar leaderboard
    };
  }

  // Converter tempo para segundos
  private timeToSeconds(time: string): number {
    const parts = time.split(':').map(Number);
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  }

  // Converter pace para segundos
  private paceToSeconds(pace: string): number {
    const parts = pace.split(':').map(Number);
    return parts[0] * 60 + parts[1];
  }

  // Formatar diferença de pace
  private formatPaceDifference(difference: number): string {
    const absDifference = Math.abs(difference);
    const minutes = Math.floor(absDifference / 60);
    const seconds = absDifference % 60;
    
    if (difference < 0) {
      return `-${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `+${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  // Atualizar estatísticas do ghost run
  private updateGhostRunStats(ghostRunId: string, attempt: GhostRunAttempt) {
    const ghostRun = this.ghostRuns.find(r => r.id === ghostRunId);
    if (!ghostRun) return;

    ghostRun.totalAttempts++;
    
    if (attempt.comparison.result === 'faster') {
      ghostRun.successfulAttempts++;
    }

    // Atualizar melhor tempo
    if (!ghostRun.bestTime || attempt.comparison.result === 'faster') {
      ghostRun.bestTime = this.secondsToTime(attempt.duration!);
    }

    // Atualizar tempo médio
    this.updateAverageTime(ghostRun, attempt);
  }

  // Converter segundos para formato de tempo
  private secondsToTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  }

  // Atualizar tempo médio
  private updateAverageTime(ghostRun: GhostRun, attempt: GhostRunAttempt) {
    const currentTotal = this.timeToSeconds(ghostRun.averageTime || '0:00') * (ghostRun.totalAttempts - 1);
    const newTotal = currentTotal + attempt.duration!;
    const newAverage = newTotal / ghostRun.totalAttempts;
    
    ghostRun.averageTime = this.secondsToTime(newAverage);
  }

  // Verificar conquistas
  private checkAchievements(attempt: GhostRunAttempt, ghostRun: GhostRun): string[] {
    const achievements: string[] = [];

    // Conquista por completar
    achievements.push('Ghost Run Completado');

    // Conquista por ser mais rápido
    if (attempt.comparison.result === 'faster') {
      achievements.push('Mais Rápido que o Ghost!');
      
      // Conquista por quebrar recorde
      if (ghostRun.category === 'world_record') {
        achievements.push('Recorde Mundial Quebrado!');
      }
    }

    // Conquista por proximidade
    if (Math.abs(attempt.comparison.percentageDifference) < 5) {
      achievements.push('Muito Próximo do Ghost!');
    }

    // Conquista por primeira tentativa
    if (ghostRun.totalAttempts === 1) {
      achievements.push('Primeira Tentativa!');
    }

    return achievements;
  }

  // Obter tentativas do usuário
  public getUserAttempts(userId: string): GhostRunAttempt[] {
    return this.attempts
      .filter(a => a.userId === userId)
      .sort((a, b) => (b.startTime || 0) - (a.startTime || 0));
  }

  // Obter tentativas de um ghost run
  public getGhostRunAttempts(ghostRunId: string): GhostRunAttempt[] {
    return this.attempts
      .filter(a => a.ghostRunId === ghostRunId && a.isCompleted)
      .sort((a, b) => (a.duration || 0) - (b.duration || 0));
  }

  // Obter leaderboard de um ghost run
  public getGhostRunLeaderboard(ghostRunId: string): GhostRunLeaderboard | undefined {
    return this.leaderboards.find(l => l.ghostRunId === ghostRunId);
  }

  // Obter desafios ativos
  public getActiveChallenges(): GhostRunChallenge[] {
    return this.challenges.filter(c => c.isActive);
  }

  // Participar de um desafio
  public joinChallenge(challengeId: string, userId: string): boolean {
    const challenge = this.challenges.find(c => c.id === challengeId);
    if (!challenge || !challenge.isActive) return false;

    if (!challenge.participants.includes(userId)) {
      challenge.participants.push(userId);
    }

    return true;
  }

  // Atualizar leaderboard de um desafio
  public updateChallengeLeaderboard(challengeId: string): void {
    const challenge = this.challenges.find(c => c.id === challengeId);
    if (!challenge) return;

    const participants = challenge.participants.map(userId => {
      const userAttempts = this.attempts.filter(a => 
        a.userId === userId && 
        challenge.ghostRuns.includes(a.ghostRunId) &&
        a.isCompleted
      );

      if (userAttempts.length === 0) return null;

      const totalTime = userAttempts.reduce((sum, a) => sum + (a.duration || 0), 0);
      const averagePace = this.calculateAveragePace(userAttempts);
      const completedRuns = userAttempts.length;
      const totalRuns = challenge.ghostRuns.length;
      
      // Calcular score baseado em tempo e completude
      const score = this.calculateChallengeScore(userAttempts, challenge);

      return {
        userId,
        username: `User_${userId.slice(-4)}`, // Simplificado
        totalTime: this.secondsToTime(totalTime),
        averagePace,
        completedRuns,
        totalRuns,
        score,
        rank: 0
      };
    }).filter(Boolean);

    // Ordenar por score e atribuir ranks
    participants.sort((a, b) => b!.score - a!.score);
    participants.forEach((p, index) => {
      if (p) p.rank = index + 1;
    });

    challenge.leaderboard = participants as any;
    challenge.lastUpdated = Date.now();
  }

  // Calcular pace médio
  private calculateAveragePace(attempts: GhostRunAttempt[]): string {
    if (attempts.length === 0) return '0:00';

    const totalSeconds = attempts.reduce((sum, a) => sum + (a.duration || 0), 0);
    const totalDistance = attempts.reduce((sum, a) => sum + a.distance, 0);
    
    const averagePaceSeconds = totalSeconds / totalDistance;
    const minutes = Math.floor(averagePaceSeconds / 60);
    const seconds = Math.floor(averagePaceSeconds % 60);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Calcular score do desafio
  private calculateChallengeScore(attempts: GhostRunAttempt[], challenge: GhostRunChallenge): number {
    let score = 0;
    
    // Pontos por completar cada ghost run
    score += attempts.length * 100;
    
    // Pontos por ser mais rápido que o ghost
    attempts.forEach(attempt => {
      if (attempt.comparison.result === 'faster') {
        score += 200;
        
        // Bônus por quebrar recorde
        const ghostRun = this.ghostRuns.find(r => r.id === attempt.ghostRunId);
        if (ghostRun?.category === 'world_record') {
          score += 500;
        }
      }
    });

    // Bônus por completar todos os ghost runs
    if (attempts.length === challenge.ghostRuns.length) {
      score += 1000;
    }

    return score;
  }

  // Criar novo ghost run
  public createGhostRun(ghostRunData: Omit<GhostRun, 'id' | 'createdAt' | 'totalAttempts' | 'successfulAttempts' | 'bestTime' | 'averageTime'>): GhostRun {
    const newGhostRun: GhostRun = {
      ...ghostRunData,
      id: `ghost_${Date.now()}`,
      createdAt: Date.now(),
      totalAttempts: 0,
      successfulAttempts: 0,
      bestTime: '',
      averageTime: ''
    };

    this.ghostRuns.push(newGhostRun);
    return newGhostRun;
  }

  // Obter estatísticas gerais
  public getGeneralStats(): {
    totalGhostRuns: number;
    totalAttempts: number;
    successfulAttempts: number;
    mostPopularGhostRun: string;
    averageCompletionRate: number;
  } {
    const totalGhostRuns = this.ghostRuns.length;
    const totalAttempts = this.ghostRuns.reduce((sum, r) => sum + r.totalAttempts, 0);
    const successfulAttempts = this.ghostRuns.reduce((sum, r) => sum + r.successfulAttempts, 0);
    
    const mostPopular = this.ghostRuns.reduce((max, r) => 
      r.totalAttempts > max.totalAttempts ? r : max
    );
    
    const averageCompletionRate = totalAttempts > 0 ? 
      (successfulAttempts / totalAttempts) * 100 : 0;

    return {
      totalGhostRuns,
      totalAttempts,
      successfulAttempts,
      mostPopularGhostRun: mostPopular.name,
      averageCompletionRate: Math.round(averageCompletionRate * 100) / 100
    };
  }
}

export function createGhostRunManager(): GhostRunManager {
  return new GhostRunManager();
}