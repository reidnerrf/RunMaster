export interface Territory {
  id: string;
  name: string;
  type: 'neighborhood' | 'district' | 'city' | 'region';
  coordinates: { lat: number; lng: number };
  radius: number; // km
  points: number;
  unlocked: boolean;
  unlockedAt?: number;
  runsRequired: number;
  runsCompleted: number;
  theme?: 'parks' | 'historical' | 'gastronomic' | 'cultural' | 'nature';
  description: string;
  landmarks: Landmark[];
  difficulty: 'easy' | 'moderate' | 'hard';
  bestTime?: number; // seconds
  totalRunners: number;
}

export interface Landmark {
  id: string;
  name: string;
  type: 'park' | 'monument' | 'restaurant' | 'museum' | 'viewpoint' | 'trail';
  coordinates: { lat: number; lng: number };
  description: string;
  photoUrl?: string;
  points: number;
  visited: boolean;
  visitedAt?: number;
}

export interface ThematicRoute {
  id: string;
  name: string;
  theme: 'parks' | 'historical' | 'gastronomic' | 'cultural' | 'nature' | 'art' | 'architecture';
  description: string;
  distance: number; // km
  estimatedTime: number; // minutes
  difficulty: 'easy' | 'moderate' | 'hard';
  points: number;
  landmarks: Landmark[];
  coordinates: { lat: number; lng: number }[];
  elevation: number; // meters
  surface: 'road' | 'trail' | 'mixed';
  bestTime?: number;
  totalRunners: number;
  seasonal?: boolean;
  weatherDependent?: boolean;
  tags: string[];
}

export interface TerritoryProgress {
  totalTerritories: number;
  unlockedTerritories: number;
  totalPoints: number;
  rank: number;
  nextUnlock?: Territory;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  points: number;
  type: 'territory' | 'route' | 'streak' | 'social' | 'special';
}

export class TerritoryManager {
  private territories: Territory[] = [];
  private thematicRoutes: ThematicRoute[] = [];
  private userProgress: TerritoryProgress;
  private visitedLandmarks: Set<string> = new Set();

  constructor() {
    this.initializeTerritories();
    this.initializeThematicRoutes();
    this.userProgress = this.calculateProgress();
  }

  private initializeTerritories() {
    // Territórios de São Paulo como exemplo
    this.territories = [
      {
        id: 'vila-madalenna',
        name: 'Vila Madalena',
        type: 'neighborhood',
        coordinates: { lat: -23.5505, lng: -46.6333 },
        radius: 1.5,
        points: 100,
        unlocked: false,
        runsRequired: 3,
        runsCompleted: 0,
        theme: 'cultural',
        description: 'Bairro boêmio com arte de rua e vida noturna',
        landmarks: [
          {
            id: 'beco-batman',
            name: 'Beco do Batman',
            type: 'art',
            coordinates: { lat: -23.5505, lng: -46.6333 },
            description: 'Famoso beco com grafites coloridos',
            points: 25,
            visited: false
          },
          {
            id: 'parque-villa-lobos',
            name: 'Parque Villa-Lobos',
            type: 'park',
            coordinates: { lat: -23.5450, lng: -46.7300 },
            description: 'Parque urbano com trilhas e lago',
            points: 30,
            visited: false
          }
        ],
        difficulty: 'moderate',
        totalRunners: 1250
      },
      {
        id: 'ibirapuera',
        name: 'Parque Ibirapuera',
        type: 'district',
        coordinates: { lat: -23.5882, lng: -46.6564 },
        radius: 2.0,
        points: 150,
        unlocked: false,
        runsRequired: 2,
        runsCompleted: 0,
        theme: 'parks',
        description: 'O pulmão verde de São Paulo',
        landmarks: [
          {
            id: 'monumento-bandeiras',
            name: 'Monumento às Bandeiras',
            type: 'monument',
            coordinates: { lat: -23.5882, lng: -46.6564 },
            description: 'Monumento histórico de Victor Brecheret',
            points: 40,
            visited: false
          },
          {
            id: 'mam',
            name: 'MAM - Museu de Arte Moderna',
            type: 'museum',
            coordinates: { lat: -23.5882, lng: -46.6564 },
            description: 'Museu com arquitetura icônica',
            points: 35,
            visited: false
          }
        ],
        difficulty: 'easy',
        totalRunners: 3200
      },
      {
        id: 'centro-historico',
        name: 'Centro Histórico',
        type: 'district',
        coordinates: { lat: -23.5505, lng: -46.6333 },
        radius: 2.5,
        points: 200,
        unlocked: false,
        runsRequired: 5,
        runsCompleted: 0,
        theme: 'historical',
        description: 'Coração histórico de São Paulo',
        landmarks: [
          {
            id: 'pateo-collegio',
            name: 'Pateo do Collegio',
            type: 'monument',
            coordinates: { lat: -23.5505, lng: -46.6333 },
            description: 'Local da fundação de São Paulo',
            points: 50,
            visited: false
          },
          {
            id: 'catedral-se',
            name: 'Catedral da Sé',
            type: 'monument',
            coordinates: { lat: -23.5505, lng: -46.6333 },
            description: 'Catedral gótica no centro',
            points: 45,
            visited: false
          }
        ],
        difficulty: 'hard',
        totalRunners: 890
      }
    ];
  }

  private initializeThematicRoutes() {
    this.thematicRoutes = [
      {
        id: 'corrida-parques',
        name: 'Corrida dos Parques',
        theme: 'parks',
        description: 'Rota que conecta os principais parques da cidade',
        distance: 8.5,
        estimatedTime: 45,
        difficulty: 'moderate',
        points: 120,
        landmarks: [
          {
            id: 'parque-trianon',
            name: 'Parque Trianon',
            type: 'park',
            coordinates: { lat: -23.5505, lng: -46.6333 },
            description: 'Parque histórico no coração da cidade',
            points: 30,
            visited: false
          },
          {
            id: 'parque-augusta',
            name: 'Parque Augusta',
            type: 'park',
            coordinates: { lat: -23.5505, lng: -46.6333 },
            description: 'Parque urbano com vista para o centro',
            points: 25,
            visited: false
          }
        ],
        coordinates: [
          { lat: -23.5505, lng: -46.6333 },
          { lat: -23.5600, lng: -46.6400 },
          { lat: -23.5700, lng: -46.6500 }
        ],
        elevation: 120,
        surface: 'mixed',
        totalRunners: 1560,
        seasonal: false,
        weatherDependent: false,
        tags: ['parques', 'natura', 'urbano', 'moderado']
      },
      {
        id: 'rota-historica',
        name: 'Rota Histórica',
        theme: 'historical',
        description: 'Passeio pelos principais pontos históricos',
        distance: 6.2,
        estimatedTime: 35,
        difficulty: 'easy',
        points: 100,
        landmarks: [
          {
            id: 'mosteiro-sao-bento',
            name: 'Mosteiro de São Bento',
            type: 'monument',
            coordinates: { lat: -23.5505, lng: -46.6333 },
            description: 'Mosteiro centenário com arquitetura impressionante',
            points: 40,
            visited: false
          },
          {
            id: 'edificio-martinelli',
            name: 'Edifício Martinelli',
            type: 'architecture',
            coordinates: { lat: -23.5505, lng: -46.6333 },
            description: 'Primeiro arranha-céu de São Paulo',
            points: 35,
            visited: false
          }
        ],
        coordinates: [
          { lat: -23.5505, lng: -46.6333 },
          { lat: -23.5550, lng: -46.6380 },
          { lat: -23.5600, lng: -46.6430 }
        ],
        elevation: 80,
        surface: 'road',
        totalRunners: 2100,
        seasonal: false,
        weatherDependent: false,
        tags: ['historia', 'arquitetura', 'cultura', 'facil']
      },
      {
        id: 'rota-gastronomica',
        name: 'Rota Gastronômica',
        theme: 'gastronomic',
        description: 'Corrida passando pelos melhores restaurantes',
        distance: 4.8,
        estimatedTime: 25,
        difficulty: 'easy',
        points: 80,
        landmarks: [
          {
            id: 'mercado-municipal',
            name: 'Mercado Municipal',
            type: 'restaurant',
            coordinates: { lat: -23.5505, lng: -46.6333 },
            description: 'Famoso mercado com gastronomia local',
            points: 30,
            visited: false
          },
          {
            id: 'liberdade',
            name: 'Bairro da Liberdade',
            type: 'restaurant',
            coordinates: { lat: -23.5505, lng: -46.6333 },
            description: 'Maior comunidade japonesa fora do Japão',
            points: 25,
            visited: false
          }
        ],
        coordinates: [
          { lat: -23.5505, lng: -46.6333 },
          { lat: -23.5530, lng: -46.6360 },
          { lat: -23.5560, lng: -46.6390 }
        ],
        elevation: 60,
        surface: 'road',
        totalRunners: 1800,
        seasonal: false,
        weatherDependent: false,
        tags: ['gastronomia', 'cultura', 'urbano', 'facil']
      }
    ];
  }

  public checkTerritoryUnlock(runCoordinates: { lat: number; lng: number }[], runDistance: number): Territory[] {
    const newlyUnlocked: Territory[] = [];
    
    for (const territory of this.territories) {
      if (territory.unlocked) continue;
      
      // Verifica se a corrida passou pelo território
      const visitedLandmarks = this.countVisitedLandmarks(runCoordinates, territory.landmarks);
      const territoryVisited = this.isTerritoryVisited(runCoordinates, territory);
      
      if (territoryVisited || visitedLandmarks > 0) {
        territory.runsCompleted++;
        
        if (territory.runsCompleted >= territory.runsRequired) {
          territory.unlocked = true;
          territory.unlockedAt = Date.now();
          newlyUnlocked.push(territory);
          
          // Desbloqueia marcos visitados
          this.unlockVisitedLandmarks(runCoordinates, territory.landmarks);
        }
      }
    }
    
    if (newlyUnlocked.length > 0) {
      this.userProgress = this.calculateProgress();
    }
    
    return newlyUnlocked;
  }

  private countVisitedLandmarks(runCoordinates: { lat: number; lng: number }[], landmarks: Landmark[]): number {
    let count = 0;
    
    for (const landmark of landmarks) {
      if (this.isLandmarkVisited(runCoordinates, landmark)) {
        count++;
      }
    }
    
    return count;
  }

  private isTerritoryVisited(runCoordinates: { lat: number; lng: number }[], territory: Territory): boolean {
    // Verifica se pelo menos 70% da corrida passou pelo território
    const pointsInTerritory = runCoordinates.filter(coord => 
      this.calculateDistance(coord, territory.coordinates) <= territory.radius
    );
    
    return pointsInTerritory.length / runCoordinates.length >= 0.7;
  }

  private isLandmarkVisited(runCoordinates: { lat: number; lng: number }[], landmark: Landmark): boolean {
    // Verifica se a corrida passou próximo ao marco (100m)
    return runCoordinates.some(coord => 
      this.calculateDistance(coord, landmark.coordinates) <= 0.1
    );
  }

  private unlockVisitedLandmarks(runCoordinates: { lat: number; lng: number }[], landmarks: Landmark[]) {
    for (const landmark of landmarks) {
      if (this.isLandmarkVisited(runCoordinates, landmark)) {
        landmark.visited = true;
        landmark.visitedAt = Date.now();
        this.visitedLandmarks.add(landmark.id);
      }
    }
  }

  private calculateDistance(point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): number {
    const R = 6371; // Raio da Terra em km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLng = (point2.lng - point1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  public getTerritories(): Territory[] {
    return this.territories;
  }

  public getThematicRoutes(): ThematicRoute[] {
    return this.thematicRoutes;
  }

  public getTerritoryProgress(): TerritoryProgress {
    return this.userProgress;
  }

  private calculateProgress(): TerritoryProgress {
    const unlockedTerritories = this.territories.filter(t => t.unlocked);
    const totalPoints = unlockedTerritories.reduce((sum, t) => sum + t.points, 0);
    
    // Calcula rank baseado em pontos (simulado)
    const rank = Math.floor(Math.random() * 1000) + 1;
    
    // Próximo território para desbloquear
    const nextUnlock = this.territories.find(t => !t.unlocked);
    
    // Conquistas
    const achievements = this.generateAchievements();
    
    return {
      totalTerritories: this.territories.length,
      unlockedTerritories: unlockedTerritories.length,
      totalPoints,
      rank,
      nextUnlock,
      achievements
    };
  }

  private generateAchievements(): Achievement[] {
    const unlockedTerritories = this.territories.filter(t => t.unlocked);
    
    return [
      {
        id: 'first-territory',
        name: 'Primeiro Território',
        description: 'Desbloqueou seu primeiro território',
        icon: '🏆',
        unlocked: unlockedTerritories.length > 0,
        unlockedAt: unlockedTerritories.length > 0 ? Date.now() : undefined,
        points: 50,
        type: 'territory'
      },
      {
        id: 'park-explorer',
        name: 'Explorador de Parques',
        description: 'Completou 3 rotas de parques',
        icon: '🌳',
        unlocked: false,
        points: 100,
        type: 'route'
      },
      {
        id: 'history-buff',
        name: 'Amante da História',
        description: 'Visitou 5 marcos históricos',
        icon: '🏛️',
        unlocked: false,
        points: 150,
        type: 'territory'
      },
      {
        id: 'food-runner',
        name: 'Corredor Gastronômico',
        description: 'Completou a rota gastronômica',
        icon: '🍕',
        unlocked: false,
        points: 80,
        type: 'route'
      }
    ];
  }

  public getRecommendations(userLocation: { lat: number; lng: number }, weather?: any): ThematicRoute[] {
    // Filtra rotas baseado em localização, clima e preferências
    return this.thematicRoutes
      .filter(route => {
        // Distância máxima de 10km da localização do usuário
        const distanceFromUser = this.calculateDistance(userLocation, route.coordinates[0]);
        if (distanceFromUser > 10) return false;
        
        // Filtra por clima se a rota for dependente
        if (route.weatherDependent && weather) {
          if (weather.precipitation > 0 && route.surface === 'trail') return false;
          if (weather.temperature > 35 && route.shade === false) return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        // Prioriza por proximidade e popularidade
        const distanceA = this.calculateDistance(userLocation, a.coordinates[0]);
        const distanceB = this.calculateDistance(userLocation, b.coordinates[0]);
        
        const scoreA = (1 / distanceA) * (a.totalRunners / 1000);
        const scoreB = (1 / distanceB) * (b.totalRunners / 1000);
        
        return scoreB - scoreA;
      })
      .slice(0, 5); // Retorna top 5
  }

  public getTerritoryStats(): { totalRunners: number; totalPoints: number; averageDifficulty: number } {
    const totalRunners = this.territories.reduce((sum, t) => sum + t.totalRunners, 0);
    const totalPoints = this.territories.reduce((sum, t) => sum + t.points, 0);
    
    const difficultyMap = { easy: 1, moderate: 2, hard: 3 };
    const avgDifficulty = this.territories.reduce((sum, t) => sum + difficultyMap[t.difficulty], 0) / this.territories.length;
    
    return {
      totalRunners,
      totalPoints,
      averageDifficulty: avgDifficulty
    };
  }
}

// Função helper para criar gerenciador
export function createTerritoryManager(): TerritoryManager {
  return new TerritoryManager();
}