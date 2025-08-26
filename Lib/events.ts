export interface LocalEvent {
  id: string;
  name: string;
  description: string;
  type: 'race' | 'fun_run' | 'charity_run' | 'training_session' | 'expo' | 'workshop';
  category: '5k' | '10k' | 'half_marathon' | 'marathon' | 'ultra' | 'trail' | 'obstacle' | 'other';
  date: number;
  endDate?: number;
  time: string; // hora de início
  duration: number; // duração em minutos
  location: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    venue: string;
    parking: boolean;
    accessibility: boolean;
  };
  organizer: {
    name: string;
    contact: string;
    email: string;
    website: string;
    socialMedia: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
    };
    reputation: number; // 1-5
    totalEvents: number;
  };
  details: {
    distance: number; // km
    elevation: number; // metros
    surface: 'road' | 'trail' | 'track' | 'mixed';
    difficulty: 'easy' | 'moderate' | 'hard' | 'extreme';
    maxParticipants: number;
    currentParticipants: number;
    registrationDeadline: number;
    price: {
      early: number;
      regular: number;
      late: number;
      currency: string;
    };
    included: string[]; // medalha, camiseta, etc.
    notIncluded: string[]; // transporte, hospedagem, etc.
  };
  features: {
    chipTiming: boolean;
    liveTracking: boolean;
    photos: boolean;
    video: boolean;
    medicalSupport: boolean;
    aidStations: boolean;
    pacers: boolean;
    music: boolean;
    food: boolean;
    expo: boolean;
    kidsRun: boolean;
    wheelchair: boolean;
  };
  routes: EventRoute[];
  participants: EventParticipant[];
  sponsors: EventSponsor[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface EventRoute {
  id: string;
  name: string;
  distance: number; // km
  elevation: number; // metros
  surface: 'road' | 'trail' | 'track' | 'mixed';
  difficulty: 'easy' | 'moderate' | 'hard' | 'extreme';
  startPoint: {
    name: string;
    coordinates: { latitude: number; longitude: number };
    description: string;
  };
  finishPoint: {
    name: string;
    coordinates: { latitude: number; longitude: number };
    description: string;
  };
  checkpoints: EventCheckpoint[];
  timeLimit: number; // minutos
  cutOffTimes: {
    km: number;
    time: string;
  }[];
  description: string;
  highlights: string[];
  warnings: string[];
  mapUrl?: string;
  gpxFile?: string;
}

export interface EventCheckpoint {
  id: string;
  name: string;
  km: number;
  coordinates: { latitude: number; longitude: number };
  type: 'aid_station' | 'medical' | 'timing' | 'viewpoint' | 'restroom';
  services: string[];
  cutOffTime: string;
  description: string;
}

export interface EventParticipant {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  registrationDate: number;
  category: 'age_group' | 'elite' | 'open' | 'wheelchair' | 'visually_impaired';
  ageGroup?: string;
  bibNumber?: string;
  estimatedTime: string;
  goal: string;
  previousResults: string[];
  isConfirmed: boolean;
  hasCheckedIn: boolean;
  checkInTime?: number;
  startTime?: number;
  finishTime?: string;
  finalTime?: string;
  pace?: string;
  rank?: number;
  categoryRank?: number;
  ageGroupRank?: number;
  achievements: string[];
  notes?: string;
}

export interface EventSponsor {
  id: string;
  name: string;
  logo: string;
  website: string;
  category: 'platinum' | 'gold' | 'silver' | 'bronze' | 'supporting';
  contribution: string;
  benefits: string[];
  socialMedia: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  registrationDate: number;
  category: string;
  ageGroup?: string;
  estimatedTime: string;
  goal: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalInfo: {
    conditions: string[];
    allergies: string[];
    medications: string[];
    bloodType?: string;
  };
  tshirtSize?: string;
  dietaryRestrictions?: string[];
  specialRequests?: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  amount: number;
  currency: string;
  isConfirmed: boolean;
  confirmationEmail?: string;
  cancellationDate?: number;
  refundAmount?: number;
}

export interface EventSearchFilters {
  dateRange?: {
    start: number;
    end: number;
  };
  location?: {
    city?: string;
    state?: string;
    country?: string;
    radius?: number; // km
    coordinates?: { latitude: number; longitude: number };
  };
  type?: string[];
  category?: string[];
  difficulty?: string[];
  price?: {
    min?: number;
    max?: number;
  };
  features?: string[];
  distance?: {
    min?: number;
    max?: number;
  };
  organizer?: string;
  isFree?: boolean;
  hasRegistration?: boolean;
}

export interface EventRecommendation {
  eventId: string;
  score: number; // 0-100
  reasons: string[];
  matchPercentage: number;
  userPreferences: string[];
  alternativeEvents: string[];
}

export class EventManager {
  private events: LocalEvent[] = [];
  private registrations: EventRegistration[] = [];
  private userPreferences: Map<string, any> = new Map();

  constructor() {
    this.initializeSampleEvents();
  }

  private initializeSampleEvents() {
    const sampleEvents: LocalEvent[] = [
      // Maratona de São Paulo
      {
        id: 'event_sp_marathon_2024',
        name: 'Maratona Internacional de São Paulo 2024',
        description: 'A maior maratona da América Latina, percorrendo os principais pontos turísticos da cidade de São Paulo.',
        type: 'race',
        category: 'marathon',
        date: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 dias
        time: '07:00',
        duration: 420, // 7 horas
        location: {
          name: 'Parque Ibirapuera',
          address: 'Av. Paulista, 1313',
          city: 'São Paulo',
          state: 'SP',
          country: 'Brasil',
          coordinates: { latitude: -23.5874, longitude: -46.6576 },
          venue: 'Parque Ibirapuera - Portão 10',
          parking: true,
          accessibility: true
        },
        organizer: {
          name: 'Corrida São Paulo',
          contact: '(11) 99999-9999',
          email: 'contato@corridasp.com.br',
          website: 'https://corridasp.com.br',
          socialMedia: {
            instagram: '@corridasp',
            facebook: 'CorridaSP',
            twitter: '@CorridaSP'
          },
          reputation: 4.8,
          totalEvents: 45
        },
        details: {
          distance: 42.2,
          elevation: 350,
          surface: 'road',
          difficulty: 'hard',
          maxParticipants: 15000,
          currentParticipants: 8500,
          registrationDeadline: Date.now() + 15 * 24 * 60 * 60 * 1000,
          price: {
            early: 89.90,
            regular: 129.90,
            late: 159.90,
            currency: 'BRL'
          },
          included: [
            'Medalha de participação',
            'Camiseta técnica',
            'Chip de cronometragem',
            'Kit de corrida',
            'Certificado digital',
            'Fotos oficiais',
            'Pós-corrida com frutas e bebidas'
          ],
          notIncluded: [
            'Transporte para o local',
            'Hospedagem',
            'Seguro pessoal',
            'Equipamentos de corrida'
          ]
        },
        features: {
          chipTiming: true,
          liveTracking: true,
          photos: true,
          video: true,
          medicalSupport: true,
          aidStations: true,
          pacers: true,
          music: true,
          food: true,
          expo: true,
          kidsRun: true,
          wheelchair: true
        },
        routes: [
          {
            id: 'route_sp_marathon',
            name: 'Rota Principal - Maratona',
            distance: 42.2,
            elevation: 350,
            surface: 'road',
            difficulty: 'hard',
            startPoint: {
              name: 'Parque Ibirapuera - Portão 10',
              coordinates: { latitude: -23.5874, longitude: -46.6576 },
              description: 'Largada com vista para o lago do parque'
            },
            finishPoint: {
              name: 'Parque Ibirapuera - Portão 10',
              coordinates: { latitude: -23.5874, longitude: -46.6576 },
              description: 'Chegada emocionante com arquibancadas'
            },
            checkpoints: [
              {
                id: 'cp_5k',
                name: '5K - Avenida Paulista',
                km: 5,
                coordinates: { latitude: -23.5600, longitude: -46.6600 },
                type: 'aid_station',
                services: ['Água', 'Isotônico', 'Banana'],
                cutOffTime: '08:00',
                description: 'Primeiro posto de abastecimento'
              },
              {
                id: 'cp_10k',
                name: '10K - Museu de Arte',
                km: 10,
                coordinates: { latitude: -23.5500, longitude: -46.6500 },
                type: 'aid_station',
                services: ['Água', 'Isotônico', 'Géis energéticos'],
                cutOffTime: '08:45',
                description: 'Posto com vista para o museu'
              },
              {
                id: 'cp_21k',
                name: '21K - Parque Villa-Lobos',
                km: 21.1,
                coordinates: { latitude: -23.5400, longitude: -46.7200 },
                type: 'aid_station',
                services: ['Água', 'Isotônico', 'Banana', 'Primeiros socorros'],
                cutOffTime: '10:30',
                description: 'Meia maratona - ponto de virada'
              }
            ],
            timeLimit: 420,
            cutOffTimes: [
              { km: 5, time: '08:00' },
              { km: 10, time: '08:45' },
              { km: 21.1, time: '10:30' },
              { km: 30, time: '12:00' },
              { km: 35, time: '13:00' }
            ],
            description: 'Rota urbana passando pelos principais pontos turísticos de São Paulo',
            highlights: [
              'Avenida Paulista',
              'Museu de Arte Moderna',
              'Parque Villa-Lobos',
              'Marginal Pinheiros',
              'Centro Histórico'
            ],
            warnings: [
              'Atenção ao tráfego em alguns pontos',
              'Superfícies irregulares em algumas ruas',
              'Subidas moderadas entre km 15-20'
            ]
          }
        ],
        participants: [],
        sponsors: [
          {
            id: 'sponsor_nike',
            name: 'Nike',
            logo: 'https://example.com/nike-logo.png',
            website: 'https://nike.com',
            category: 'platinum',
            contribution: 'Patrocinador Principal',
            benefits: ['Logo na camiseta', 'Stand no expo', 'Produtos para premiação'],
            socialMedia: {
              instagram: '@nike',
              facebook: 'Nike',
              twitter: '@Nike'
            }
          }
        ],
        isActive: true,
        isFeatured: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },

      // Corrida 5K Parque
      {
        id: 'event_5k_park_run',
        name: '5K Parque Ibirapuera - Corrida da Família',
        description: 'Corrida recreativa de 5km no Parque Ibirapuera, ideal para iniciantes e famílias.',
        type: 'fun_run',
        category: '5k',
        date: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 dias
        time: '08:00',
        duration: 120, // 2 horas
        location: {
          name: 'Parque Ibirapuera',
          address: 'Av. Paulista, 1313',
          city: 'São Paulo',
          state: 'SP',
          country: 'Brasil',
          coordinates: { latitude: -23.5874, longitude: -46.6576 },
          venue: 'Parque Ibirapuera - Portão 7',
          parking: true,
          accessibility: true
        },
        organizer: {
          name: 'Parque Run Brasil',
          contact: '(11) 88888-8888',
          email: 'contato@parquerun.com.br',
          website: 'https://parquerun.com.br',
          socialMedia: {
            instagram: '@parquerun',
            facebook: 'ParqueRunBrasil'
          },
          reputation: 4.5,
          totalEvents: 23
        },
        details: {
          distance: 5,
          elevation: 20,
          surface: 'mixed',
          difficulty: 'easy',
          maxParticipants: 2000,
          currentParticipants: 1200,
          registrationDeadline: Date.now() + 3 * 24 * 60 * 60 * 1000,
          price: {
            early: 29.90,
            regular: 39.90,
            late: 49.90,
            currency: 'BRL'
          },
          included: [
            'Medalha de participação',
            'Camiseta',
            'Chip de cronometragem',
            'Certificado digital',
            'Café da manhã pós-corrida'
          ],
          notIncluded: [
            'Transporte',
            'Equipamentos'
          ]
        },
        features: {
          chipTiming: true,
          liveTracking: false,
          photos: true,
          video: false,
          medicalSupport: true,
          aidStations: true,
          pacers: false,
          music: true,
          food: true,
          expo: false,
          kidsRun: true,
          wheelchair: true
        },
        routes: [
          {
            id: 'route_5k_park',
            name: '5K Parque Ibirapuera',
            distance: 5,
            elevation: 20,
            surface: 'mixed',
            difficulty: 'easy',
            startPoint: {
              name: 'Portão 7 - Parque Ibirapuera',
              coordinates: { latitude: -23.5874, longitude: -46.6576 },
              description: 'Largada próxima ao lago'
            },
            finishPoint: {
              name: 'Portão 7 - Parque Ibirapuera',
              coordinates: { latitude: -23.5874, longitude: -46.6576 },
              description: 'Chegada no mesmo local da largada'
            },
            checkpoints: [
              {
                id: 'cp_2k',
                name: '2K - Lago das Garças',
                km: 2,
                coordinates: { latitude: -23.5850, longitude: -46.6550 },
                type: 'aid_station',
                services: ['Água'],
                cutOffTime: '08:30',
                description: 'Posto de hidratação'
              }
            ],
            timeLimit: 120,
            cutOffTimes: [
              { km: 2, time: '08:30' },
              { km: 5, time: '09:00' }
            ],
            description: 'Rota circular pelo parque, passando pelos principais pontos',
            highlights: [
              'Lago das Garças',
              'Museu de Arte Moderna',
              'Viveiro Manequinho Lopes',
              'Bosque da Leitura'
            ],
            warnings: [
              'Atenção aos pedestres',
              'Caminhos estreitos em alguns pontos'
            ]
          }
        ],
        participants: [],
        sponsors: [],
        isActive: true,
        isFeatured: false,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },

      // Corrida de Caridade
      {
        id: 'event_charity_10k',
        name: '10K Corrida pela Vida - Combate ao Câncer',
        description: 'Corrida beneficente de 10km para arrecadar fundos para o tratamento de pacientes com câncer.',
        type: 'charity_run',
        category: '10k',
        date: Date.now() + 14 * 24 * 60 * 60 * 1000, // 14 dias
        time: '07:30',
        duration: 180, // 3 horas
        location: {
          name: 'Parque do Povo',
          address: 'Av. Henrique Schaumann, 1000',
          city: 'São Paulo',
          state: 'SP',
          country: 'Brasil',
          coordinates: { latitude: -23.5700, longitude: -46.6800 },
          venue: 'Parque do Povo - Área Central',
          parking: true,
          accessibility: true
        },
        organizer: {
          name: 'Instituto Combate ao Câncer',
          contact: '(11) 77777-7777',
          email: 'contato@combatecancer.org.br',
          website: 'https://combatecancer.org.br',
          socialMedia: {
            instagram: '@combatecancer',
            facebook: 'CombateCancer'
          },
          reputation: 4.9,
          totalEvents: 12
        },
        details: {
          distance: 10,
          elevation: 80,
          surface: 'road',
          difficulty: 'moderate',
          maxParticipants: 5000,
          currentParticipants: 3200,
          registrationDeadline: Date.now() + 10 * 24 * 60 * 60 * 1000,
          price: {
            early: 45.00,
            regular: 55.00,
            late: 65.00,
            currency: 'BRL'
          },
          included: [
            'Medalha de participação',
            'Camiseta',
            'Chip de cronometragem',
            'Certificado digital',
            'Kit de corrida',
            'Café da manhã'
          ],
          notIncluded: [
            'Transporte',
            'Equipamentos'
          ]
        },
        features: {
          chipTiming: true,
          liveTracking: true,
          photos: true,
          video: false,
          medicalSupport: true,
          aidStations: true,
          pacers: true,
          music: true,
          food: true,
          expo: true,
          kidsRun: false,
          wheelchair: true
        },
        routes: [
          {
            id: 'route_charity_10k',
            name: '10K Corrida pela Vida',
            distance: 10,
            elevation: 80,
            surface: 'road',
            difficulty: 'moderate',
            startPoint: {
              name: 'Parque do Povo - Área Central',
              coordinates: { latitude: -23.5700, longitude: -46.6800 },
              description: 'Largada com palco e arquibancadas'
            },
            finishPoint: {
              name: 'Parque do Povo - Área Central',
              coordinates: { latitude: -23.5700, longitude: -46.6800 },
              description: 'Chegada com festa e premiação'
            },
            checkpoints: [
              {
                id: 'cp_3k',
                name: '3K - Avenida Paulista',
                km: 3,
                coordinates: { latitude: -23.5600, longitude: -46.6600 },
                type: 'aid_station',
                services: ['Água', 'Isotônico'],
                cutOffTime: '08:00',
                description: 'Primeiro posto de abastecimento'
              },
              {
                id: 'cp_6k',
                name: '6K - Rua Augusta',
                km: 6,
                coordinates: { latitude: -23.5500, longitude: -46.6500 },
                type: 'aid_station',
                services: ['Água', 'Isotônico', 'Banana'],
                cutOffTime: '08:30',
                description: 'Posto intermediário'
              }
            ],
            timeLimit: 180,
            cutOffTimes: [
              { km: 3, time: '08:00' },
              { km: 6, time: '08:30' },
              { km: 10, time: '09:00' }
            ],
            description: 'Rota urbana com foco na conscientização sobre o câncer',
            highlights: [
              'Avenida Paulista',
              'Rua Augusta',
              'Vila Madalena',
              'Parque do Povo'
            ],
            warnings: [
              'Tráfego controlado',
              'Superfícies regulares',
              'Subidas leves'
            ]
          }
        ],
        participants: [],
        sponsors: [],
        isActive: true,
        isFeatured: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    ];

    this.events.push(...sampleEvents);
  }

  // Buscar eventos
  public searchEvents(filters: EventSearchFilters): LocalEvent[] {
    let filtered = [...this.events];

    // Filtro por data
    if (filters.dateRange) {
      filtered = filtered.filter(event => 
        event.date >= filters.dateRange!.start && 
        event.date <= filters.dateRange!.end
      );
    }

    // Filtro por localização
    if (filters.location) {
      if (filters.location.coordinates && filters.location.radius) {
        filtered = filtered.filter(event => {
          const distance = this.calculateDistance(
            filters.location!.coordinates!,
            event.location.coordinates
          );
          return distance <= filters.location!.radius!;
        });
      } else if (filters.location.city) {
        filtered = filtered.filter(event => 
          event.location.city.toLowerCase().includes(filters.location!.city!.toLowerCase())
        );
      }
    }

    // Filtro por tipo
    if (filters.type && filters.type.length > 0) {
      filtered = filtered.filter(event => 
        filters.type!.includes(event.type)
      );
    }

    // Filtro por categoria
    if (filters.category && filters.category.length > 0) {
      filtered = filtered.filter(event => 
        filters.category!.includes(event.category)
      );
    }

    // Filtro por dificuldade
    if (filters.difficulty && filters.difficulty.length > 0) {
      filtered = filtered.filter(event => 
        filters.difficulty!.includes(event.details.difficulty)
      );
    }

    // Filtro por preço
    if (filters.price) {
      filtered = filtered.filter(event => {
        const currentPrice = this.getCurrentPrice(event);
        if (filters.price!.min !== undefined && currentPrice < filters.price!.min) return false;
        if (filters.price!.max !== undefined && currentPrice > filters.price!.max) return false;
        return true;
      });
    }

    // Filtro por recursos
    if (filters.features && filters.features.length > 0) {
      filtered = filtered.filter(event => 
        filters.features!.every(feature => 
          event.features[feature as keyof typeof event.features] === true
        )
      );
    }

    // Filtro por distância
    if (filters.distance) {
      filtered = filtered.filter(event => {
        if (filters.distance!.min !== undefined && event.details.distance < filters.distance!.min) return false;
        if (filters.distance!.max !== undefined && event.details.distance > filters.distance!.max) return false;
        return true;
      });
    }

    // Filtro por organizador
    if (filters.organizer) {
      filtered = filtered.filter(event => 
        event.organizer.name.toLowerCase().includes(filters.organizer!.toLowerCase())
      );
    }

    // Filtro por eventos gratuitos
    if (filters.isFree !== undefined) {
      filtered = filtered.filter(event => {
        const currentPrice = this.getCurrentPrice(event);
        return filters.isFree ? currentPrice === 0 : currentPrice > 0;
      });
    }

    // Filtro por disponibilidade de inscrição
    if (filters.hasRegistration !== undefined) {
      filtered = filtered.filter(event => {
        const hasSpots = event.details.currentParticipants < event.details.maxParticipants;
        const notExpired = Date.now() < event.details.registrationDeadline;
        return filters.hasRegistration ? (hasSpots && notExpired) : (!hasSpots || !notExpired);
      });
    }

    // Ordenar por data e destaque
    return filtered.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return a.date - b.date;
    });
  }

  // Calcular distância entre duas coordenadas
  private calculateDistance(
    coord1: { latitude: number; longitude: number },
    coord2: { latitude: number; longitude: number }
  ): number {
    const R = 6371; // Raio da Terra em km
    const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
    const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
               Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) *
               Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Obter preço atual do evento
  private getCurrentPrice(event: LocalEvent): number {
    const now = Date.now();
    const daysUntilEvent = (event.date - now) / (1000 * 60 * 60 * 24);
    
    if (daysUntilEvent > 30) return event.details.price.early;
    if (daysUntilEvent > 7) return event.details.price.regular;
    return event.details.price.late;
  }

  // Obter evento por ID
  public getEventById(eventId: string): LocalEvent | undefined {
    return this.events.find(e => e.id === eventId);
  }

  // Obter eventos próximos
  public getNearbyEvents(
    coordinates: { latitude: number; longitude: number },
    radius: number = 50
  ): LocalEvent[] {
    return this.events.filter(event => {
      const distance = this.calculateDistance(coordinates, event.location.coordinates);
      return distance <= radius && event.isActive;
    }).sort((a, b) => {
      const distanceA = this.calculateDistance(coordinates, a.location.coordinates);
      const distanceB = this.calculateDistance(coordinates, b.location.coordinates);
      return distanceA - distanceB;
    });
  }

  // Obter eventos por categoria
  public getEventsByCategory(category: string): LocalEvent[] {
    return this.events.filter(e => e.category === category && e.isActive);
  }

  // Obter eventos por organizador
  public getEventsByOrganizer(organizerName: string): LocalEvent[] {
    return this.events.filter(e => 
      e.organizer.name.toLowerCase().includes(organizerName.toLowerCase()) && 
      e.isActive
    );
  }

  // Obter eventos em destaque
  public getFeaturedEvents(): LocalEvent[] {
    return this.events.filter(e => e.isFeatured && e.isActive);
  }

  // Obter eventos gratuitos
  public getFreeEvents(): LocalEvent[] {
    return this.events.filter(e => 
      this.getCurrentPrice(e) === 0 && e.isActive
    );
  }

  // Obter eventos com inscrições abertas
  public getEventsWithOpenRegistration(): LocalEvent[] {
    const now = Date.now();
    return this.events.filter(e => 
      e.isActive && 
      now < e.details.registrationDeadline &&
      e.details.currentParticipants < e.details.maxParticipants
    );
  }

  // Registrar usuário em evento
  public registerUserForEvent(
    eventId: string,
    userId: string,
    registrationData: Omit<EventRegistration, 'id' | 'eventId' | 'userId' | 'registrationDate' | 'paymentStatus' | 'isConfirmed'>
  ): EventRegistration | null {
    const event = this.events.find(e => e.id === eventId);
    if (!event || !event.isActive) return null;

    // Verificar se há vagas
    if (event.details.currentParticipants >= event.details.maxParticipants) {
      throw new Error('Evento lotado');
    }

    // Verificar se inscrições ainda estão abertas
    if (Date.now() > event.details.registrationDeadline) {
      throw new Error('Inscrições encerradas');
    }

    // Verificar se usuário já está inscrito
    const existingRegistration = this.registrations.find(r => 
      r.eventId === eventId && r.userId === userId
    );
    if (existingRegistration) {
      throw new Error('Usuário já inscrito neste evento');
    }

    const registration: EventRegistration = {
      id: `registration_${Date.now()}`,
      eventId,
      userId,
      registrationDate: Date.now(),
      ...registrationData,
      paymentStatus: 'pending',
      isConfirmed: false
    };

    this.registrations.push(registration);
    
    // Atualizar contador de participantes
    event.details.currentParticipants++;

    return registration;
  }

  // Confirmar inscrição
  public confirmRegistration(registrationId: string): boolean {
    const registration = this.registrations.find(r => r.id === registrationId);
    if (!registration) return false;

    registration.paymentStatus = 'completed';
    registration.isConfirmed = true;
    registration.confirmationEmail = `confirmation_${registrationId}@example.com`;

    return true;
  }

  // Cancelar inscrição
  public cancelRegistration(registrationId: string): boolean {
    const registration = this.registrations.find(r => r.id === registrationId);
    if (!registration) return false;

    registration.cancellationDate = Date.now();
    registration.refundAmount = registration.amount * 0.8; // 80% de reembolso

    // Atualizar contador de participantes
    const event = this.events.find(e => e.id === registration.eventId);
    if (event) {
      event.details.currentParticipants--;
    }

    return true;
  }

  // Obter inscrições do usuário
  public getUserRegistrations(userId: string): EventRegistration[] {
    return this.registrations
      .filter(r => r.userId === userId)
      .sort((a, b) => b.registrationDate - a.registrationDate);
  }

  // Obter inscrições de um evento
  public getEventRegistrations(eventId: string): EventRegistration[] {
    return this.registrations
      .filter(r => r.eventId === eventId)
      .sort((a, b) => a.registrationDate - b.registrationDate);
  }

  // Adicionar participante ao evento
  public addParticipantToEvent(
    eventId: string,
    participant: Omit<EventParticipant, 'id'>
  ): EventParticipant | null {
    const event = this.events.find(e => e.id === eventId);
    if (!event) return null;

    const newParticipant: EventParticipant = {
      id: `participant_${Date.now()}`,
      ...participant
    };

    event.participants.push(newParticipant);
    return newParticipant;
  }

  // Atualizar participante
  public updateParticipant(
    eventId: string,
    participantId: string,
    updates: Partial<EventParticipant>
  ): EventParticipant | null {
    const event = this.events.find(e => e.id === eventId);
    if (!event) return null;

    const participant = event.participants.find(p => p.id === participantId);
    if (!participant) return null;

    Object.assign(participant, updates);
    return participant;
  }

  // Obter estatísticas do evento
  public getEventStats(eventId: string): {
    totalRegistrations: number;
    confirmedRegistrations: number;
    pendingRegistrations: number;
    cancellationRate: number;
    averageRating: number;
    revenue: number;
  } {
    const eventRegistrations = this.registrations.filter(r => r.eventId === eventId);
    const totalRegistrations = eventRegistrations.length;
    const confirmedRegistrations = eventRegistrations.filter(r => r.isConfirmed).length;
    const pendingRegistrations = eventRegistrations.filter(r => r.paymentStatus === 'pending').length;
    const cancelledRegistrations = eventRegistrations.filter(r => r.cancellationDate).length;
    
    const cancellationRate = totalRegistrations > 0 ? 
      (cancelledRegistrations / totalRegistrations) * 100 : 0;
    
    const revenue = eventRegistrations
      .filter(r => r.paymentStatus === 'completed')
      .reduce((sum, r) => sum + r.amount, 0);

    return {
      totalRegistrations,
      confirmedRegistrations,
      pendingRegistrations,
      cancellationRate: Math.round(cancellationRate * 100) / 100,
      averageRating: 4.5, // Placeholder
      revenue
    };
  }

  // Criar novo evento
  public createEvent(eventData: Omit<LocalEvent, 'id' | 'createdAt' | 'updatedAt'>): LocalEvent {
    const newEvent: LocalEvent = {
      ...eventData,
      id: `event_${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.events.push(newEvent);
    return newEvent;
  }

  // Atualizar evento
  public updateEvent(eventId: string, updates: Partial<LocalEvent>): LocalEvent | null {
    const event = this.events.find(e => e.id === eventId);
    if (!event) return null;

    Object.assign(event, updates);
    event.updatedAt = Date.now();
    return event;
  }

  // Desativar evento
  public deactivateEvent(eventId: string): boolean {
    const event = this.events.find(e => e.id === eventId);
    if (!event) return false;

    event.isActive = false;
    event.updatedAt = Date.now();
    return true;
  }

  // Obter estatísticas gerais
  public getGeneralStats(): {
    totalEvents: number;
    activeEvents: number;
    totalRegistrations: number;
    totalRevenue: number;
    averageEventRating: number;
    mostPopularCategory: string;
    upcomingEvents: number;
  } {
    const totalEvents = this.events.length;
    const activeEvents = this.events.filter(e => e.isActive).length;
    const totalRegistrations = this.registrations.length;
    const totalRevenue = this.registrations
      .filter(r => r.paymentStatus === 'completed')
      .reduce((sum, r) => sum + r.amount, 0);
    
    const now = Date.now();
    const upcomingEvents = this.events.filter(e => e.date > now && e.isActive).length;
    
    // Categoria mais popular
    const categoryCounts = this.events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostPopularCategory = Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

    return {
      totalEvents,
      activeEvents,
      totalRegistrations,
      totalRevenue,
      averageEventRating: 4.6, // Placeholder
      mostPopularCategory,
      upcomingEvents
    };
  }
}

export function createEventManager(): EventManager {
  return new EventManager();
}