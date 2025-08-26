import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export interface SafetyAlert {
  id: string;
  type: 'crime' | 'lighting' | 'traffic' | 'weather' | 'medical';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  location: { lat: number; lng: number };
  radius: number; // km
  timestamp: number;
  expiresAt: number;
  source: 'user' | 'police' | 'community' | 'system';
  confirmed: boolean;
  confirmedBy: number;
}

export interface LiveTrackingSession {
  id: string;
  userId: string;
  startTime: number;
  endTime?: number;
  coordinates: { lat: number; lng: number; timestamp: number }[];
  status: 'active' | 'paused' | 'completed' | 'emergency';
  checkIns: CheckIn[];
  emergencyContacts: EmergencyContact[];
  lastLocation: { lat: number; lng: number; timestamp: number };
  isPublic: boolean;
  shareUrl?: string;
}

export interface CheckIn {
  id: string;
  location: { lat: number; lng: number };
  timestamp: number;
  type: 'manual' | 'auto' | 'emergency';
  message?: string;
  photoUrl?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
  notified: boolean;
  lastNotified?: number;
}

export interface Buddy {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  pace: { min: number; max: number }; // min/km
  preferredDistance: { min: number; max: number }; // km
  preferredTime: 'morning' | 'afternoon' | 'evening' | 'night';
  location: { lat: number; lng: number };
  isOnline: boolean;
  lastSeen: number;
  rating: number;
  totalRuns: number;
  compatibility: number; // 0-100
}

export interface SafetyScore {
  overall: number; // 0-100
  crime: number;
  lighting: number;
  traffic: number;
  weather: number;
  factors: string[];
  recommendations: string[];
}

export interface RouteSafety {
  routeId: string;
  safetyScore: SafetyScore;
  dangerousSegments: DangerousSegment[];
  safeAlternatives: SafeAlternative[];
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  weatherCondition: string;
}

export interface DangerousSegment {
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
  risk: 'low' | 'medium' | 'high';
  reason: string;
  alternative?: { lat: number; lng: number }[];
}

export interface SafeAlternative {
  routeId: string;
  name: string;
  distance: number; // km
  safetyScore: number;
  reason: string;
}

export class SafetyManager {
  private safetyAlerts: SafetyAlert[] = [];
  private liveSessions: Map<string, LiveTrackingSession> = new Map();
  private buddies: Buddy[] = [];
  private crimeData: any[] = [];
  private lightingData: any[] = [];
  private trafficData: any[] = [];

  constructor() {
    this.initializeSafetyData();
    this.startPeriodicCheckIns();
  }

  private initializeSafetyData() {
    // Dados simulados de segurança
    this.crimeData = [
      { lat: -23.5505, lng: -46.6333, type: 'theft', severity: 'medium', timestamp: Date.now() - 86400000 },
      { lat: -23.5600, lng: -46.6400, type: 'assault', severity: 'high', timestamp: Date.now() - 172800000 }
    ];
    
    this.lightingData = [
      { lat: -23.5505, lng: -46.6333, quality: 'good', timestamp: Date.now() },
      { lat: -23.5600, lng: -46.6400, quality: 'poor', timestamp: Date.now() }
    ];
    
    this.trafficData = [
      { lat: -23.5505, lng: -46.6333, congestion: 'low', timestamp: Date.now() },
      { lat: -23.5600, lng: -46.6400, congestion: 'high', timestamp: Date.now() }
    ];
  }

  public startLiveTracking(userId: string, isPublic: boolean = false): LiveTrackingSession {
    const session: LiveTrackingSession = {
      id: `session_${Date.now()}`,
      userId,
      startTime: Date.now(),
      coordinates: [],
      status: 'active',
      checkIns: [],
      emergencyContacts: this.getEmergencyContacts(userId),
      lastLocation: { lat: 0, lng: 0, timestamp: 0 },
      isPublic
    };

    this.liveSessions.set(session.id, session);
    
    // Primeiro check-in automático
    this.addCheckIn(session.id, 'auto', 'Iniciou corrida');
    
    return session;
  }

  public updateLocation(sessionId: string, lat: number, lng: number) {
    const session = this.liveSessions.get(sessionId);
    if (!session) return;

    const location = { lat, lng, timestamp: Date.now() };
    session.coordinates.push(location);
    session.lastLocation = location;

    // Check-in automático a cada 5 minutos
    const lastCheckIn = session.checkIns[session.checkIns.length - 1];
    if (!lastCheckIn || (Date.now() - lastCheckIn.timestamp) > 300000) {
      this.addCheckIn(sessionId, 'auto', 'Check-in automático');
    }

    // Verifica segurança da localização
    this.checkLocationSafety(sessionId, lat, lng);
  }

  private checkLocationSafety(sessionId: string, lat: number, lng: number) {
    const session = this.liveSessions.get(sessionId);
    if (!session) return;

    // Verifica alertas de segurança próximos
    const nearbyAlerts = this.getNearbyAlerts(lat, lng, 0.5);
    
    if (nearbyAlerts.length > 0) {
      const criticalAlert = nearbyAlerts.find(a => a.severity === 'critical');
      if (criticalAlert) {
        this.triggerEmergencyAlert(sessionId, criticalAlert);
      } else {
        this.showSafetyWarning(sessionId, nearbyAlerts);
      }
    }

    // Verifica se está em área segura para check-in
    const safetyScore = this.calculateSafetyScore(lat, lng);
    if (safetyScore.overall > 70) {
      this.suggestCheckIn(sessionId, lat, lng);
    }
  }

  private getNearbyAlerts(lat: number, lng: number, radius: number): SafetyAlert[] {
    return this.safetyAlerts.filter(alert => {
      const distance = this.calculateDistance(
        { lat, lng },
        alert.location
      );
      return distance <= radius && Date.now() < alert.expiresAt;
    });
  }

  private calculateSafetyScore(lat: number, lng: number): SafetyScore {
    let crimeScore = 100;
    let lightingScore = 100;
    let trafficScore = 100;
    let weatherScore = 100;
    const factors: string[] = [];
    const recommendations: string[] = [];

    // Análise de crime
    const nearbyCrimes = this.crimeData.filter(crime => {
      const distance = this.calculateDistance({ lat, lng }, crime);
      return distance <= 1.0; // 1km
    });

    if (nearbyCrimes.length > 0) {
      const recentCrimes = nearbyCrimes.filter(c => Date.now() - c.timestamp < 86400000 * 7);
      if (recentCrimes.length > 0) {
        crimeScore = Math.max(0, 100 - (recentCrimes.length * 20));
        factors.push(`${recentCrimes.length} incidentes recentes`);
        recommendations.push('Evite esta área à noite');
      }
    }

    // Análise de iluminação
    const nearbyLighting = this.lightingData.find(light => {
      const distance = this.calculateDistance({ lat, lng }, light);
      return distance <= 0.5; // 500m
    });

    if (nearbyLighting && nearbyLighting.quality === 'poor') {
      lightingScore = 40;
      factors.push('Iluminação inadequada');
      recommendations.push('Use roupas refletivas');
    }

    // Análise de tráfego
    const nearbyTraffic = this.trafficData.find(traffic => {
      const distance = this.calculateDistance({ lat, lng }, traffic);
      return distance <= 0.3; // 300m
    });

    if (nearbyTraffic && nearbyTraffic.congestion === 'high') {
      trafficScore = 60;
      factors.push('Tráfego intenso');
      recommendations.push('Use calçadas quando possível');
    }

    // Análise de clima (simulada)
    const hour = new Date().getHours();
    if (hour < 6 || hour > 20) {
      weatherScore = 80;
      factors.push('Corrida noturna');
      recommendations.push('Use equipamentos de visibilidade');
    }

    const overall = Math.round((crimeScore + lightingScore + trafficScore + weatherScore) / 4);

    return {
      overall,
      crime: crimeScore,
      lighting: lightingScore,
      traffic: trafficScore,
      weather: weatherScore,
      factors,
      recommendations
    };
  }

  private triggerEmergencyAlert(sessionId: string, alert: SafetyAlert) {
    const session = this.liveSessions.get(sessionId);
    if (!session) return;

    session.status = 'emergency';
    
    // Notifica contatos de emergência
    this.notifyEmergencyContacts(session);
    
    // Feedback háptico
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    
    // Cria alerta de emergência
    const emergencyAlert: SafetyAlert = {
      id: `emergency_${Date.now()}`,
      type: 'medical',
      severity: 'critical',
      message: `ALERTA DE EMERGÊNCIA: ${alert.message}`,
      location: alert.location,
      radius: 2.0,
      timestamp: Date.now(),
      expiresAt: Date.now() + 3600000, // 1 hora
      source: 'system',
      confirmed: false,
      confirmedBy: 0
    };

    this.safetyAlerts.push(emergencyAlert);
  }

  private showSafetyWarning(sessionId: string, alerts: SafetyAlert[]) {
    // Feedback háptico para alertas
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Log do aviso
    console.log(`Safety warning for session ${sessionId}:`, alerts);
  }

  private suggestCheckIn(sessionId: string, lat: number, lng: number) {
    const session = this.liveSessions.get(sessionId);
    if (!session) return;

    // Sugere check-in em área segura
    const lastCheckIn = session.checkIns[session.checkIns.length - 1];
    if (lastCheckIn && (Date.now() - lastCheckIn.timestamp) > 600000) { // 10 minutos
      this.addCheckIn(sessionId, 'auto', 'Área segura - check-in sugerido');
    }
  }

  public addCheckIn(sessionId: string, type: 'manual' | 'auto' | 'emergency', message?: string) {
    const session = this.liveSessions.get(sessionId);
    if (!session) return;

    const checkIn: CheckIn = {
      id: `checkin_${Date.now()}`,
      location: session.lastLocation,
      timestamp: Date.now(),
      type,
      message
    };

    session.checkIns.push(checkIn);

    // Feedback háptico para check-ins manuais
    if (type === 'manual') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }

  private notifyEmergencyContacts(session: LiveTrackingSession) {
    session.emergencyContacts.forEach(contact => {
      if (contact.isPrimary) {
        // Simula notificação
        console.log(`Notificando ${contact.name} em ${contact.phone}`);
        contact.notified = true;
        contact.lastNotified = Date.now();
      }
    });
  }

  public findBuddies(userLocation: { lat: number; lng: number }, userPace: number, userDistance: number): Buddy[] {
    return this.buddies
      .filter(buddy => {
        // Filtra por compatibilidade de ritmo (±1 min/km)
        const paceCompatible = Math.abs(buddy.pace.min - userPace) <= 1;
        
        // Filtra por distância preferida
        const distanceCompatible = userDistance >= buddy.preferredDistance.min && 
                                 userDistance <= buddy.preferredDistance.max;
        
        // Filtra por localização (máximo 5km)
        const locationCompatible = this.calculateDistance(userLocation, buddy.location) <= 5;
        
        return paceCompatible && distanceCompatible && locationCompatible && buddy.isOnline;
      })
      .map(buddy => ({
        ...buddy,
        compatibility: this.calculateCompatibility(buddy, userPace, userDistance, userLocation)
      }))
      .sort((a, b) => b.compatibility - a.compatibility)
      .slice(0, 10); // Top 10
  }

  private calculateCompatibility(buddy: Buddy, userPace: number, userDistance: number, userLocation: { lat: number; lng: number }): number {
    let score = 0;
    
    // Compatibilidade de ritmo (40%)
    const paceDiff = Math.abs(buddy.pace.min - userPace);
    score += Math.max(0, 40 - (paceDiff * 10));
    
    // Compatibilidade de distância (30%)
    const distanceDiff = Math.abs(buddy.preferredDistance.min - userDistance);
    score += Math.max(0, 30 - (distanceDiff * 2));
    
    // Proximidade (20%)
    const distance = this.calculateDistance(userLocation, buddy.location);
    score += Math.max(0, 20 - (distance * 2));
    
    // Rating do buddy (10%)
    score += buddy.rating * 0.1;
    
    return Math.round(score);
  }

  public createSafetyAlert(alert: Omit<SafetyAlert, 'id' | 'timestamp' | 'confirmed' | 'confirmedBy'>): SafetyAlert {
    const newAlert: SafetyAlert = {
      ...alert,
      id: `alert_${Date.now()}`,
      timestamp: Date.now(),
      confirmed: false,
      confirmedBy: 0
    };

    this.safetyAlerts.push(newAlert);
    return newAlert;
  }

  public getRouteSafety(route: { coordinates: { lat: number; lng: number }[] }, timeOfDay: string, weather: string): RouteSafety {
    const dangerousSegments: DangerousSegment[] = [];
    const safeAlternatives: SafeAlternative[] = [];
    
    // Analisa cada segmento da rota
    for (let i = 0; i < route.coordinates.length - 1; i++) {
      const start = route.coordinates[i];
      const end = route.coordinates[i + 1];
      
      const safetyScore = this.calculateSafetyScore(start.lat, start.lng);
      
      if (safetyScore.overall < 50) {
        dangerousSegments.push({
          start,
          end,
          risk: safetyScore.overall < 30 ? 'high' : 'medium',
          reason: safetyScore.factors.join(', '),
          alternative: this.findSafeAlternative(start, end)
        });
      }
    }

    const overallSafety = this.calculateOverallRouteSafety(route.coordinates);

    return {
      routeId: `route_${Date.now()}`,
      safetyScore: overallSafety,
      dangerousSegments,
      safeAlternatives,
      timeOfDay: timeOfDay as any,
      weatherCondition: weather
    };
  }

  private calculateOverallRouteSafety(coordinates: { lat: number; lng: number }[]): SafetyScore {
    const safetyScores = coordinates.map(coord => this.calculateSafetyScore(coord.lat, coord.lng));
    
    const avgCrime = safetyScores.reduce((sum, s) => sum + s.crime, 0) / safetyScores.length;
    const avgLighting = safetyScores.reduce((sum, s) => sum + s.lighting, 0) / safetyScores.length;
    const avgTraffic = safetyScores.reduce((sum, s) => sum + s.traffic, 0) / safetyScores.length;
    const avgWeather = safetyScores.reduce((sum, s) => sum + s.weather, 0) / safetyScores.length;
    
    const overall = Math.round((avgCrime + avgLighting + avgTraffic + avgWeather) / 4);
    
    return {
      overall,
      crime: Math.round(avgCrime),
      lighting: Math.round(avgLighting),
      traffic: Math.round(avgTraffic),
      weather: Math.round(avgWeather),
      factors: [],
      recommendations: []
    };
  }

  private findSafeAlternative(start: { lat: number; lng: number }, end: { lat: number; lng: number }): { lat: number; lng: number }[] {
    // Simula rota alternativa segura
    return [
      { lat: start.lat + 0.001, lng: start.lng + 0.001 },
      { lat: end.lat + 0.001, lng: end.lng + 0.001 }
    ];
  }

  private getEmergencyContacts(userId: string): EmergencyContact[] {
    // Simula contatos de emergência do usuário
    return [
      {
        id: 'contact_1',
        name: 'Contato Principal',
        phone: '+5511999999999',
        relationship: 'Familiar',
        isPrimary: true,
        notified: false
      }
    ];
  }

  private startPeriodicCheckIns() {
    // Check-ins automáticos a cada 5 minutos para sessões ativas
    setInterval(() => {
      this.liveSessions.forEach((session, sessionId) => {
        if (session.status === 'active' && session.coordinates.length > 0) {
          const lastCheckIn = session.checkIns[session.checkIns.length - 1];
          if (!lastCheckIn || (Date.now() - lastCheckIn.timestamp) > 300000) {
            this.addCheckIn(sessionId, 'auto', 'Check-in automático');
          }
        }
      });
    }, 300000); // 5 minutos
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

  public getLiveSessions(): LiveTrackingSession[] {
    return Array.from(this.liveSessions.values());
  }

  public getSafetyAlerts(): SafetyAlert[] {
    return this.safetyAlerts.filter(alert => Date.now() < alert.expiresAt);
  }

  public endLiveTracking(sessionId: string) {
    const session = this.liveSessions.get(sessionId);
    if (session) {
      session.status = 'completed';
      session.endTime = Date.now();
      
      // Check-in final
      this.addCheckIn(sessionId, 'manual', 'Corrida finalizada');
    }
  }
}

// Função helper para criar gerenciador de segurança
export function createSafetyManager(): SafetyManager {
  return new SafetyManager();
}