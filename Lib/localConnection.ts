export interface LocalRunner {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  currentLocation: {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
  };
  lastSeen: number;
  isOnline: boolean;
  isRunning: boolean;
  currentWorkout?: {
    id: string;
    type: string;
    startTime: number;
    distance: number;
    pace: number;
  };
  preferences: {
    shareLocation: boolean;
    allowConnections: boolean;
    maxDistance: number; // metros
    notificationTypes: string[];
  };
  stats: {
    totalRuns: number;
    totalDistance: number;
    averagePace: number;
    favoriteRoutes: string[];
    achievements: string[];
  };
}

export interface StreetRanking {
  id: string;
  streetName: string;
  city: string;
  state: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
    bounds: {
      north: number;
      south: number;
      east: number;
      west: number;
    };
  };
  runners: {
    userId: string;
    name: string;
    totalRuns: number;
    totalDistance: number;
    bestPace: number;
    lastRun: number;
    points: number;
  }[];
  totalRuns: number;
  totalDistance: number;
  averagePace: number;
  lastUpdated: number;
  isActive: boolean;
}

export interface NeighborhoodChallenge {
  id: string;
  name: string;
  description: string;
  type: 'distance' | 'speed' | 'frequency' | 'exploration';
  neighborhoods: string[];
  startDate: number;
  endDate: number;
  status: 'upcoming' | 'active' | 'completed';
  participants: {
    userId: string;
    name: string;
    neighborhood: string;
    progress: number;
    rank: number;
    points: number;
  }[];
  leaderboard: {
    rank: number;
    userId: string;
    name: string;
    neighborhood: string;
    score: number;
    details: any;
  }[];
  rewards: {
    points: number;
    badges: string[];
    recognition: string;
  };
  rules: string[];
  createdAt: number;
  createdBy: string;
}

export interface LocalConnection {
  id: string;
  runner1Id: string;
  runner2Id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  initiatedBy: string;
  initiatedAt: number;
  respondedAt?: number;
  lastInteraction: number;
  sharedWorkouts: number;
  mutualRuns: number;
  connectionStrength: number; // 0-100
}

export interface LocalEvent {
  id: string;
  name: string;
  description: string;
  type: 'group_run' | 'race' | 'training' | 'social';
  date: number;
  duration: number; // minutos
  location: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    meetingPoint: string;
  };
  organizer: {
    userId: string;
    name: string;
    avatar: string;
  };
  participants: {
    userId: string;
    name: string;
    avatar: string;
    status: 'registered' | 'confirmed' | 'maybe' | 'declined';
    joinedAt: number;
  }[];
  maxParticipants: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  pace: 'slow' | 'moderate' | 'fast';
  distance: number; // km
  route?: {
    waypoints: {
      latitude: number;
      longitude: number;
      description: string;
    }[];
    totalDistance: number;
    elevation: number;
  };
  tags: string[];
  isPublic: boolean;
  createdAt: number;
  lastUpdated: number;
}

export interface LocalManager {
  runners: LocalRunner[];
  streetRankings: StreetRanking[];
  challenges: NeighborhoodChallenge[];
  connections: LocalConnection[];
  events: LocalEvent[];
}

export class LocalManager {
  private runners: LocalRunner[] = [];
  private streetRankings: StreetRanking[] = [];
  private challenges: NeighborhoodChallenge[] = [];
  private connections: LocalConnection[] = [];
  private events: LocalEvent[] = [];

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Inicializar corredores de exemplo
    const sampleRunners: LocalRunner[] = [
      {
        id: 'runner_1',
        userId: 'user_1',
        name: 'João Silva',
        avatar: 'https://example.com/joao.jpg',
        currentLocation: {
          latitude: -23.5505,
          longitude: -46.6333,
          accuracy: 10,
          timestamp: Date.now()
        },
        lastSeen: Date.now(),
        isOnline: true,
        isRunning: false,
        preferences: {
          shareLocation: true,
          allowConnections: true,
          maxDistance: 5000,
          notificationTypes: ['nearby_runners', 'challenges', 'events']
        },
        stats: {
          totalRuns: 45,
          totalDistance: 180.5,
          averagePace: 5.2,
          favoriteRoutes: ['route_paulista', 'route_ibirapuera'],
          achievements: ['first_5k', 'streak_7_days', 'explorer_10_routes']
        }
      },
      {
        id: 'runner_2',
        userId: 'user_2',
        name: 'Maria Santos',
        avatar: 'https://example.com/maria.jpg',
        currentLocation: {
          latitude: -23.5510,
          longitude: -46.6338,
          accuracy: 15,
          timestamp: Date.now()
        },
        lastSeen: Date.now(),
        isOnline: true,
        isRunning: true,
        currentWorkout: {
          id: 'workout_1',
          type: 'easy_run',
          startTime: Date.now() - 1800000, // 30 minutos atrás
          distance: 3.2,
          pace: 6.1
        },
        preferences: {
          shareLocation: true,
          allowConnections: true,
          maxDistance: 3000,
          notificationTypes: ['nearby_runners', 'challenges']
        },
        stats: {
          totalRuns: 32,
          totalDistance: 128.7,
          averagePace: 5.8,
          favoriteRoutes: ['route_ibirapuera', 'route_vila_madalena'],
          achievements: ['first_10k', 'consistency_30_days']
        }
      }
    ];

    this.runners.push(...sampleRunners);

    // Inicializar rankings de ruas
    const sampleStreetRankings: StreetRanking[] = [
      {
        id: 'street_1',
        streetName: 'Avenida Paulista',
        city: 'São Paulo',
        state: 'SP',
        country: 'Brasil',
        coordinates: {
          latitude: -23.5505,
          longitude: -46.6333,
          bounds: {
            north: -23.5400,
            south: -23.5600,
            east: -46.6230,
            west: -46.6430
          }
        },
        runners: [
          {
            userId: 'user_1',
            name: 'João Silva',
            totalRuns: 15,
            totalDistance: 67.5,
            bestPace: 4.8,
            lastRun: Date.now() - 86400000, // 1 dia atrás
            points: 1250
          },
          {
            userId: 'user_2',
            name: 'Maria Santos',
            totalRuns: 12,
            totalDistance: 54.2,
            bestPace: 5.2,
            lastRun: Date.now() - 172800000, // 2 dias atrás
            points: 980
          }
        ],
        totalRuns: 27,
        totalDistance: 121.7,
        averagePace: 5.0,
        lastUpdated: Date.now(),
        isActive: true
      }
    ];

    this.streetRankings.push(...sampleStreetRankings);

    // Inicializar desafios de bairro
    const sampleChallenges: NeighborhoodChallenge[] = [
      {
        id: 'challenge_1',
        name: 'Desafio Paulista vs Ibirapuera',
        description: 'Qual bairro corre mais em uma semana?',
        type: 'distance',
        neighborhoods: ['Paulista', 'Ibirapuera'],
        startDate: Date.now() + 86400000, // amanhã
        endDate: Date.now() + 691200000, // 8 dias
        status: 'upcoming',
        participants: [
          {
            userId: 'user_1',
            name: 'João Silva',
            neighborhood: 'Paulista',
            progress: 0,
            rank: 1,
            points: 0
          },
          {
            userId: 'user_2',
            name: 'Maria Santos',
            neighborhood: 'Ibirapuera',
            progress: 0,
            rank: 1,
            points: 0
          }
        ],
        leaderboard: [],
        rewards: {
          points: 500,
          badges: ['neighborhood_champion', 'team_player'],
          recognition: 'Campeão do Bairro'
        },
        rules: [
          'Corridas devem ser feitas dentro dos limites do bairro',
          'Mínimo de 3 corridas por semana',
          'Distância total será somada para o ranking'
        ],
        createdAt: Date.now(),
        createdBy: 'system'
      }
    ];

    this.challenges.push(...sampleChallenges);

    // Inicializar eventos locais
    const sampleEvents: LocalEvent[] = [
      {
        id: 'event_1',
        name: 'Corrida Matinal Paulista',
        description: 'Corrida em grupo pela manhã na Avenida Paulista',
        type: 'group_run',
        date: Date.now() + 259200000, // 3 dias
        duration: 60,
        location: {
          address: 'Avenida Paulista, 1000 - São Paulo, SP',
          coordinates: {
            latitude: -23.5505,
            longitude: -46.6333
          },
          meetingPoint: 'Em frente ao Shopping Paulista'
        },
        organizer: {
          userId: 'user_1',
          name: 'João Silva',
          avatar: 'https://example.com/joao.jpg'
        },
        participants: [
          {
            userId: 'user_1',
            name: 'João Silva',
            avatar: 'https://example.com/joao.jpg',
            status: 'confirmed',
            joinedAt: Date.now()
          },
          {
            userId: 'user_2',
            name: 'Maria Santos',
            avatar: 'https://example.com/maria.jpg',
            status: 'registered',
            joinedAt: Date.now() - 3600000
          }
        ],
        maxParticipants: 20,
        difficulty: 'intermediate',
        pace: 'moderate',
        distance: 5.0,
        tags: ['group_run', 'morning', 'paulista', 'social'],
        isPublic: true,
        createdAt: Date.now(),
        lastUpdated: Date.now()
      }
    ];

    this.events.push(...sampleEvents);
  }

  // Obter corredores próximos
  public getNearbyRunners(
    latitude: number,
    longitude: number,
    maxDistance: number = 5000
  ): LocalRunner[] {
    return this.runners.filter(runner => {
      if (!runner.isOnline || !runner.preferences.shareLocation) return false;
      
      const distance = this.calculateDistance(
        latitude,
        longitude,
        runner.currentLocation.latitude,
        runner.currentLocation.longitude
      );
      
      return distance <= maxDistance;
    }).sort((a, b) => {
      const distanceA = this.calculateDistance(
        latitude,
        longitude,
        a.currentLocation.latitude,
        a.currentLocation.longitude
      );
      const distanceB = this.calculateDistance(
        latitude,
        longitude,
        b.currentLocation.latitude,
        b.currentLocation.longitude
      );
      
      return distanceA - distanceB;
    });
  }

  // Calcular distância entre dois pontos (fórmula de Haversine)
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Raio da Terra em metros
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
  }

  // Atualizar localização de um corredor
  public updateRunnerLocation(
    runnerId: string,
    latitude: number,
    longitude: number,
    accuracy: number
  ): boolean {
    const runner = this.runners.find(r => r.id === runnerId);
    if (!runner) return false;

    runner.currentLocation = {
      latitude,
      longitude,
      accuracy,
      timestamp: Date.now()
    };
    runner.lastSeen = Date.now();

    // Atualizar ranking de ruas
    this.updateStreetRankings(runner);

    return true;
  }

  // Atualizar rankings de ruas
  private updateStreetRankings(runner: LocalRunner) {
    // Encontrar rua mais próxima
    for (const street of this.streetRankings) {
      const distance = this.calculateDistance(
        runner.currentLocation.latitude,
        runner.currentLocation.longitude,
        street.coordinates.latitude,
        street.coordinates.longitude
      );

      // Se está dentro dos limites da rua
      if (this.isWithinStreetBounds(
        runner.currentLocation.latitude,
        runner.currentLocation.longitude,
        street.coordinates.bounds
      )) {
        this.addRunnerToStreet(runner, street);
        break;
      }
    }
  }

  // Verificar se está dentro dos limites da rua
  private isWithinStreetBounds(
    lat: number,
    lon: number,
    bounds: any
  ): boolean {
    return lat >= bounds.south && lat <= bounds.north &&
           lon >= bounds.west && lon <= bounds.east;
  }

  // Adicionar corredor à rua
  private addRunnerToStreet(runner: LocalRunner, street: StreetRanking) {
    const existingRunner = street.runners.find(r => r.userId === runner.userId);
    
    if (existingRunner) {
      // Atualizar estatísticas existentes
      existingRunner.lastRun = Date.now();
      existingRunner.points += 10; // Pontos por atividade
    } else {
      // Adicionar novo corredor
      street.runners.push({
        userId: runner.userId,
        name: runner.name,
        totalRuns: 1,
        totalDistance: 0,
        bestPace: 0,
        lastRun: Date.now(),
        points: 50 // Pontos iniciais
      });
    }

    street.totalRuns++;
    street.lastUpdated = Date.now();
  }

  // Obter ranking de uma rua
  public getStreetRanking(streetId: string): StreetRanking | undefined {
    const street = this.streetRankings.find(s => s.id === streetId);
    if (!street) return undefined;

    // Ordenar corredores por pontos
    street.runners.sort((a, b) => b.points - a.points);
    
    // Atualizar rankings
    street.runners.forEach((runner, index) => {
      runner.rank = index + 1;
    });

    return street;
  }

  // Obter top ruas por atividade
  public getTopStreets(limit: number = 10): StreetRanking[] {
    return this.streetRankings
      .filter(street => street.isActive)
      .sort((a, b) => b.totalRuns - a.totalRuns)
      .slice(0, limit);
  }

  // Criar desafio de bairro
  public createNeighborhoodChallenge(
    name: string,
    description: string,
    type: string,
    neighborhoods: string[],
    startDate: number,
    endDate: number,
    createdBy: string
  ): NeighborhoodChallenge {
    const challenge: NeighborhoodChallenge = {
      id: `challenge_${Date.now()}`,
      name,
      description,
      type: type as any,
      neighborhoods,
      startDate,
      endDate,
      status: 'upcoming',
      participants: [],
      leaderboard: [],
      rewards: {
        points: 500,
        badges: ['neighborhood_champion'],
        recognition: 'Campeão do Desafio'
      },
      rules: [
        'Corridas devem ser feitas dentro dos limites dos bairros participantes',
        'Mínimo de 3 corridas por semana',
        'Respeitar as regras específicas do tipo de desafio'
      ],
      createdAt: Date.now(),
      createdBy
    };

    this.challenges.push(challenge);
    return challenge;
  }

  // Participar de um desafio
  public joinChallenge(
    challengeId: string,
    userId: string,
    neighborhood: string
  ): boolean {
    const challenge = this.challenges.find(c => c.id === challengeId);
    if (!challenge || challenge.status !== 'upcoming') return false;

    const runner = this.runners.find(r => r.userId === userId);
    if (!runner) return false;

    // Verificar se já participa
    const existingParticipant = challenge.participants.find(p => p.userId === userId);
    if (existingParticipant) return false;

    // Verificar se o bairro é válido
    if (!challenge.neighborhoods.includes(neighborhood)) return false;

    challenge.participants.push({
      userId,
      name: runner.name,
      neighborhood,
      progress: 0,
      rank: challenge.participants.length + 1,
      points: 0
    });

    return true;
  }

  // Atualizar progresso de um desafio
  public updateChallengeProgress(
    challengeId: string,
    userId: string,
    progress: number,
    details: any
  ): boolean {
    const challenge = this.challenges.find(c => c.id === challengeId);
    if (!challenge || challenge.status !== 'active') return false;

    const participant = challenge.participants.find(p => p.userId === userId);
    if (!participant) return false;

    participant.progress = progress;
    participant.points = this.calculateChallengePoints(challenge.type, progress, details);

    // Atualizar leaderboard
    this.updateChallengeLeaderboard(challenge);

    return true;
  }

  // Calcular pontos de um desafio
  private calculateChallengePoints(
    type: string,
    progress: number,
    details: any
  ): number {
    switch (type) {
      case 'distance':
        return Math.floor(progress * 10); // 10 pontos por km
      case 'speed':
        return Math.floor(progress * 100); // 100 pontos por min/km melhorado
      case 'frequency':
        return progress * 50; // 50 pontos por corrida
      case 'exploration':
        return progress * 25; // 25 pontos por rota explorada
      default:
        return progress;
    }
  }

  // Atualizar leaderboard de um desafio
  private updateChallengeLeaderboard(challenge: NeighborhoodChallenge) {
    // Ordenar participantes por pontos
    challenge.participants.sort((a, b) => b.points - a.points);
    
    // Atualizar rankings
    challenge.participants.forEach((participant, index) => {
      participant.rank = index + 1;
    });

    // Atualizar leaderboard geral
    challenge.leaderboard = challenge.participants.map(participant => ({
      rank: participant.rank,
      userId: participant.userId,
      name: participant.name,
      neighborhood: participant.neighborhood,
      score: participant.points,
      details: {
        progress: participant.progress,
        neighborhood: participant.neighborhood
      }
    }));
  }

  // Criar evento local
  public createLocalEvent(
    name: string,
    description: string,
    type: string,
    date: number,
    duration: number,
    location: any,
    organizerId: string,
    maxParticipants: number,
    difficulty: string,
    pace: string,
    distance: number,
    tags: string[]
  ): LocalEvent | null {
    const organizer = this.runners.find(r => r.userId === organizerId);
    if (!organizer) return null;

    const event: LocalEvent = {
      id: `event_${Date.now()}`,
      name,
      description,
      type: type as any,
      date,
      duration,
      location,
      organizer: {
        userId: organizerId,
        name: organizer.name,
        avatar: organizer.avatar
      },
      participants: [
        {
          userId: organizerId,
          name: organizer.name,
          avatar: organizer.avatar,
          status: 'confirmed',
          joinedAt: Date.now()
        }
      ],
      maxParticipants,
      difficulty: difficulty as any,
      pace: pace as any,
      distance,
      tags,
      isPublic: true,
      createdAt: Date.now(),
      lastUpdated: Date.now()
    };

    this.events.push(event);
    return event;
  }

  // Participar de um evento
  public joinEvent(eventId: string, userId: string, status: string = 'registered'): boolean {
    const event = this.events.find(e => e.id === eventId);
    if (!event) return false;

    // Verificar se já participa
    const existingParticipant = event.participants.find(p => p.userId === userId);
    if (existingParticipant) return false;

    // Verificar se há vagas
    if (event.participants.length >= event.maxParticipants) return false;

    const runner = this.runners.find(r => r.userId === userId);
    if (!runner) return false;

    event.participants.push({
      userId,
      name: runner.name,
      avatar: runner.avatar,
      status: status as any,
      joinedAt: Date.now()
    });

    event.lastUpdated = Date.now();
    return true;
  }

  // Obter eventos próximos
  public getNearbyEvents(
    latitude: number,
    longitude: number,
    maxDistance: number = 10000
  ): LocalEvent[] {
    return this.events.filter(event => {
      const distance = this.calculateDistance(
        latitude,
        longitude,
        event.location.coordinates.latitude,
        event.location.coordinates.longitude
      );
      
      return distance <= maxDistance && event.date > Date.now();
    }).sort((a, b) => a.date - b.date);
  }

  // Conectar corredores
  public connectRunners(runner1Id: string, runner2Id: string): LocalConnection | null {
    // Verificar se já existe conexão
    const existingConnection = this.connections.find(c => 
      (c.runner1Id === runner1Id && c.runner2Id === runner2Id) ||
      (c.runner1Id === runner2Id && c.runner2Id === runner1Id)
    );

    if (existingConnection) return existingConnection;

    const connection: LocalConnection = {
      id: `connection_${Date.now()}`,
      runner1Id,
      runner2Id,
      status: 'pending',
      initiatedBy: runner1Id,
      initiatedAt: Date.now(),
      lastInteraction: Date.now(),
      sharedWorkouts: 0,
      mutualRuns: 0,
      connectionStrength: 0
    };

    this.connections.push(connection);
    return connection;
  }

  // Responder a uma conexão
  public respondToConnection(
    connectionId: string,
    status: 'accepted' | 'rejected'
  ): boolean {
    const connection = this.connections.find(c => c.id === connectionId);
    if (!connection || connection.status !== 'pending') return false;

    connection.status = status;
    connection.respondedAt = Date.now();
    connection.lastInteraction = Date.now();

    return true;
  }

  // Obter conexões de um corredor
  public getRunnerConnections(userId: string): LocalConnection[] {
    return this.connections.filter(c => 
      c.runner1Id === userId || c.runner2Id === userId
    );
  }

  // Obter estatísticas locais
  public getLocalStats(): {
    totalRunners: number;
    onlineRunners: number;
    activeChallenges: number;
    upcomingEvents: number;
    totalStreetRankings: number;
    mostActiveStreet: string;
    totalConnections: number;
  } {
    const totalRunners = this.runners.length;
    const onlineRunners = this.runners.filter(r => r.isOnline).length;
    const activeChallenges = this.challenges.filter(c => c.status === 'active').length;
    const upcomingEvents = this.events.filter(e => e.date > Date.now()).length;
    const totalStreetRankings = this.streetRankings.filter(s => s.isActive).length;
    
    // Rua mais ativa
    const mostActiveStreet = this.streetRankings
      .sort((a, b) => b.totalRuns - a.totalRuns)[0]?.streetName || 'N/A';
    
    const totalConnections = this.connections.filter(c => c.status === 'accepted').length;

    return {
      totalRunners,
      onlineRunners,
      activeChallenges,
      upcomingEvents,
      totalStreetRankings,
      mostActiveStreet,
      totalConnections
    };
  }

  // Buscar corredores por critérios
  public searchRunners(
    criteria: {
      name?: string;
      neighborhood?: string;
      pace?: { min: number; max: number };
      achievements?: string[];
      maxDistance?: number;
    }
  ): LocalRunner[] {
    let filteredRunners = this.runners.filter(r => r.isOnline);

    if (criteria.name) {
      filteredRunners = filteredRunners.filter(r => 
        r.name.toLowerCase().includes(criteria.name!.toLowerCase())
      );
    }

    if (criteria.neighborhood) {
      // Filtrar por bairro baseado na localização
      filteredRunners = filteredRunners.filter(runner => {
        return this.streetRankings.some(street => 
          street.city.toLowerCase().includes(criteria.neighborhood!.toLowerCase()) &&
          this.isWithinStreetBounds(
            runner.currentLocation.latitude,
            runner.currentLocation.longitude,
            street.coordinates.bounds
          )
        );
      });
    }

    if (criteria.pace) {
      filteredRunners = filteredRunners.filter(r => 
        r.stats.averagePace >= criteria.pace!.min && 
        r.stats.averagePace <= criteria.pace!.max
      );
    }

    if (criteria.achievements) {
      filteredRunners = filteredRunners.filter(runner => 
        criteria.achievements!.some(achievement => 
          runner.stats.achievements.includes(achievement)
        )
      );
    }

    return filteredRunners;
  }
}

export function createLocalManager(): LocalManager {
  return new LocalManager();
}