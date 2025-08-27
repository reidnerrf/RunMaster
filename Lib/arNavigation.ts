export interface ARWaypoint {
  id: string;
  latitude: number;
  longitude: number;
  elevation: number;
  type: 'turn' | 'landmark' | 'hazard' | 'checkpoint';
  instruction: string;
  distance: number; // metros até o próximo waypoint
  bearing: number; // direção em graus
  arElements: ARElement[];
}

export interface ARElement {
  id: string;
  type: 'arrow' | 'text' | '3d_model' | 'line' | 'circle';
  position: {
    x: number; // posição relativa na tela
    y: number;
    z: number; // profundidade
  };
  rotation: {
    x: number; // rotação em graus
    y: number;
    z: number;
  };
  scale: number;
  color: string;
  opacity: number;
  animation?: 'pulse' | 'fade' | 'bounce' | 'none';
  text?: string;
  icon?: string;
}

export interface ARRoute {
  id: string;
  name: string;
  waypoints: ARWaypoint[];
  totalDistance: number;
  estimatedTime: number;
  difficulty: 'easy' | 'moderate' | 'hard';
  surface: 'road' | 'trail' | 'mixed';
  elevationGain: number;
  elevationLoss: number;
  isActive: boolean;
}

export interface ARSession {
  id: string;
  routeId: string;
  userId: string;
  startTime: number;
  currentWaypointIndex: number;
  completedWaypoints: string[];
  arMode: 'full' | 'minimal' | 'audio_only';
  deviceOrientation: {
    alpha: number; // rotação Z (azimute)
    beta: number; // inclinação X (pitch)
    gamma: number; // inclinação Y (roll)
  };
  cameraPosition: {
    x: number;
    y: number;
    z: number;
  };
  isActive: boolean;
}

export interface ARCalibration {
  deviceId: string;
  compassOffset: number;
  accelerometerOffset: {
    x: number;
    y: number;
    z: number;
  };
  gyroscopeOffset: {
    x: number;
    y: number;
    z: number;
  };
  lastCalibrated: number;
  accuracy: number; // 0-100
}

export class ARNavigationManager {
  private routes: ARRoute[] = [];
  private activeSessions: ARSession[] = [];
  private calibrations: ARCalibration[] = [];
  private deviceCapabilities: any = {};

  constructor() {
    this.initializeSampleRoutes();
    this.checkDeviceCapabilities();
  }

  private initializeSampleRoutes() {
    // Rota de exemplo: Parque Ibirapuera
    const ibirapueraRoute: ARRoute = {
      id: 'route_ibirapuera',
      name: 'Volta do Parque Ibirapuera',
      waypoints: [
        {
          id: 'wp_1',
          latitude: -23.5874,
          longitude: -46.6576,
          elevation: 760,
          type: 'checkpoint',
          instruction: 'Início da rota - Portão 10',
          distance: 0,
          bearing: 0,
          arElements: [
            {
              id: 'ar_1',
              type: 'circle',
              position: { x: 0, y: 0, z: 2 },
              rotation: { x: 0, y: 0, z: 0 },
              scale: 1,
              color: '#00FF00',
              opacity: 0.8,
              animation: 'pulse'
            }
          ]
        },
        {
          id: 'wp_2',
          latitude: -23.5878,
          longitude: -46.6582,
          elevation: 762,
          type: 'turn',
          instruction: 'Vire à direita na próxima bifurcação',
          distance: 150,
          bearing: 90,
          arElements: [
            {
              id: 'ar_2',
              type: 'arrow',
              position: { x: 0.5, y: 0, z: 3 },
              rotation: { x: 0, y: 0, z: 90 },
              scale: 1.2,
              color: '#FF6B35',
              opacity: 0.9,
              animation: 'bounce'
            },
            {
              id: 'ar_2_text',
              type: 'text',
              position: { x: 0.5, y: 0.3, z: 3 },
              rotation: { x: 0, y: 0, z: 0 },
              scale: 0.8,
              color: '#FFFFFF',
              opacity: 1,
              text: 'DIREITA',
              animation: 'none'
            }
          ]
        },
        {
          id: 'wp_3',
          latitude: -23.5882,
          longitude: -46.6588,
          elevation: 765,
          type: 'landmark',
          instruction: 'Museu de Arte Moderna - Continue reto',
          distance: 200,
          bearing: 0,
          arElements: [
            {
              id: 'ar_3',
              type: '3d_model',
              position: { x: 0, y: 0, z: 5 },
              rotation: { x: 0, y: 0, z: 0 },
              scale: 0.5,
              color: '#4ECDC4',
              opacity: 0.7,
              animation: 'fade',
              icon: '🏛️'
            }
          ]
        },
        {
          id: 'wp_4',
          latitude: -23.5886,
          longitude: -46.6594,
          elevation: 768,
          type: 'hazard',
          instruction: 'Atenção: Superfície irregular à frente',
          distance: 100,
          bearing: 45,
          arElements: [
            {
              id: 'ar_4',
              type: 'circle',
              position: { x: 0, y: 0, z: 2 },
              rotation: { x: 0, y: 0, z: 0 },
              scale: 1.5,
              color: '#FF0000',
              opacity: 0.6,
              animation: 'pulse'
            },
            {
              id: 'ar_4_text',
              type: 'text',
              position: { x: 0, y: 0.5, z: 2 },
              rotation: { x: 0, y: 0, z: 0 },
              scale: 0.7,
              color: '#FFFFFF',
              opacity: 1,
              text: '⚠️ ATENÇÃO',
              animation: 'none'
            }
          ]
        },
        {
          id: 'wp_5',
          latitude: -23.5890,
          longitude: -46.6600,
          elevation: 770,
          type: 'checkpoint',
          instruction: 'Fim da rota - Portão 10',
          distance: 0,
          bearing: 0,
          arElements: [
            {
              id: 'ar_5',
              type: 'circle',
              position: { x: 0, y: 0, z: 2 },
              rotation: { x: 0, y: 0, z: 0 },
              scale: 1.2,
              color: '#00FF00',
              opacity: 0.8,
              animation: 'pulse'
            },
            {
              id: 'ar_5_text',
              type: 'text',
              position: { x: 0, y: 0.4, z: 2 },
              rotation: { x: 0, y: 0, z: 0 },
              scale: 0.8,
              color: '#FFFFFF',
              opacity: 1,
              text: 'META! 🎉',
              animation: 'bounce'
            }
          ]
        }
      ],
      totalDistance: 2.1,
      estimatedTime: 15,
      difficulty: 'easy',
      surface: 'mixed',
      elevationGain: 10,
      elevationLoss: 10,
      isActive: true
    };

    this.routes.push(ibirapueraRoute);
  }

  private checkDeviceCapabilities() {
    // Verificar capacidades do dispositivo
    this.deviceCapabilities = {
      hasGyroscope: true,
      hasAccelerometer: true,
      hasCompass: true,
      hasCamera: true,
      supportsARKit: false, // iOS
      supportsARCore: false, // Android
      supportsWebXR: true,
      maxARObjects: 50,
      trackingAccuracy: 'high'
    };
  }

  // Iniciar sessão AR
  public startARSession(
    routeId: string,
    userId: string,
    arMode: 'full' | 'minimal' | 'audio_only' = 'full'
  ): ARSession {
    const route = this.routes.find(r => r.id === routeId);
    if (!route) throw new Error('Rota não encontrada');

    // Verificar se já existe uma sessão ativa
    const existingSession = this.activeSessions.find(s => 
      s.userId === userId && s.isActive
    );
    if (existingSession) {
      existingSession.isActive = false;
    }

    const session: ARSession = {
      id: `session_${Date.now()}`,
      routeId,
      userId,
      startTime: Date.now(),
      currentWaypointIndex: 0,
      completedWaypoints: [],
      arMode,
      deviceOrientation: { alpha: 0, beta: 0, gamma: 0 },
      cameraPosition: { x: 0, y: 0, z: 0 },
      isActive: true
    };

    this.activeSessions.push(session);
    return session;
  }

  // Atualizar orientação do dispositivo
  public updateDeviceOrientation(
    sessionId: string,
    alpha: number,
    beta: number,
    gamma: number
  ): void {
    const session = this.activeSessions.find(s => s.id === sessionId);
    if (!session) return;

    session.deviceOrientation = { alpha, beta, gamma };
  }

  // Atualizar posição da câmera
  public updateCameraPosition(
    sessionId: string,
    x: number,
    y: number,
    z: number
  ): void {
    const session = this.activeSessions.find(s => s.id === sessionId);
    if (!session) return;

    session.cameraPosition = { x, y, z };
  }

  // Obter elementos AR para renderização
  public getARElements(
    sessionId: string,
    userLatitude: number,
    userLongitude: number,
    userBearing: number
  ): ARElement[] {
    const session = this.activeSessions.find(s => s.id === sessionId);
    if (!session || !session.isActive) return [];

    const route = this.routes.find(r => r.id === session.routeId);
    if (!route) return [];

    const currentWaypoint = route.waypoints[session.currentWaypointIndex];
    if (!currentWaypoint) return [];

    // Calcular posição relativa do usuário em relação ao waypoint
    const relativePosition = this.calculateRelativePosition(
      userLatitude,
      userLongitude,
      currentWaypoint.latitude,
      currentWaypoint.longitude,
      userBearing
    );

    // Ajustar elementos AR baseado na posição relativa
    return this.adjustARElements(currentWaypoint.arElements, relativePosition);
  }

  // Calcular posição relativa
  private calculateRelativePosition(
    userLat: number,
    userLng: number,
    waypointLat: number,
    waypointLng: number,
    userBearing: number
  ): { distance: number; bearing: number; elevation: number } {
    // Fórmula de Haversine para calcular distância
    const R = 6371000; // Raio da Terra em metros
    const dLat = (waypointLat - userLat) * Math.PI / 180;
    const dLng = (waypointLng - userLng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
               Math.cos(userLat * Math.PI / 180) * Math.cos(waypointLat * Math.PI / 180) *
               Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    // Calcular bearing
    const y = Math.sin(dLng) * Math.cos(waypointLat * Math.PI / 180);
    const x = Math.cos(userLat * Math.PI / 180) * Math.sin(waypointLat * Math.PI / 180) -
              Math.sin(userLat * Math.PI / 180) * Math.cos(waypointLat * Math.PI / 180) * Math.cos(dLng);
    const bearing = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;

    return {
      distance,
      bearing: (bearing - userBearing + 360) % 360,
      elevation: 0 // Simplificado por enquanto
    };
  }

  // Ajustar elementos AR baseado na posição relativa
  private adjustARElements(
    elements: ARElement[],
    relativePosition: { distance: number; bearing: number; elevation: number }
  ): ARElement[] {
    return elements.map(element => {
      const adjustedElement = { ...element };

      // Ajustar posição baseado na distância e bearing
      if (relativePosition.distance < 50) {
        // Muito próximo - aumentar escala
        adjustedElement.scale *= 1.5;
        adjustedElement.opacity = Math.min(1, adjustedElement.opacity * 1.2);
      } else if (relativePosition.distance > 200) {
        // Muito longe - diminuir escala
        adjustedElement.scale *= 0.7;
        adjustedElement.opacity *= 0.8;
      }

      // Ajustar posição baseado no bearing
      const bearingRad = relativePosition.bearing * Math.PI / 180;
      adjustedElement.position.x = Math.sin(bearingRad) * 2;
      adjustedElement.position.z = Math.cos(bearingRad) * 2;

      return adjustedElement;
    });
  }

  // Avançar para o próximo waypoint
  public advanceToNextWaypoint(sessionId: string): boolean {
    const session = this.activeSessions.find(s => s.id === sessionId);
    if (!session) return false;

    const route = this.routes.find(r => r.id === session.routeId);
    if (!route) return false;

    // Marcar waypoint atual como completado
    if (session.currentWaypointIndex < route.waypoints.length) {
      const currentWaypoint = route.waypoints[session.currentWaypointIndex];
      session.completedWaypoints.push(currentWaypoint.id);
    }

    // Avançar para o próximo waypoint
    session.currentWaypointIndex++;

    // Verificar se a rota foi completada
    if (session.currentWaypointIndex >= route.waypoints.length) {
      this.completeARRoute(sessionId);
      return true;
    }

    return false;
  }

  // Completar rota AR
  private completeARRoute(sessionId: string): void {
    const session = this.activeSessions.find(s => s.id === sessionId);
    if (!session) return;

    session.isActive = false;
    
    // Aqui você pode adicionar lógica para:
    // - Salvar estatísticas da corrida
    // - Mostrar tela de conclusão
    // - Desbloquear conquistas
    // - etc.
  }

  // Obter instrução atual
  public getCurrentInstruction(sessionId: string): string | null {
    const session = this.activeSessions.find(s => s.id === sessionId);
    if (!session || !session.isActive) return null;

    const route = this.routes.find(r => r.id === session.routeId);
    if (!route) return null;

    const currentWaypoint = route.waypoints[session.currentWaypointIndex];
    if (!currentWaypoint) return null;

    return currentWaypoint.instruction;
  }

  // Obter próximo waypoint
  public getNextWaypoint(sessionId: string): ARWaypoint | null {
    const session = this.activeSessions.find(s => s.id === sessionId);
    if (!session || !session.isActive) return null;

    const route = this.routes.find(r => r.id === session.routeId);
    if (!route) return null;

    const nextIndex = session.currentWaypointIndex + 1;
    if (nextIndex >= route.waypoints.length) return null;

    return route.waypoints[nextIndex];
  }

  // Calibrar dispositivo
  public calibrateDevice(deviceId: string): ARCalibration {
    // Simular calibração
    const calibration: ARCalibration = {
      deviceId,
      compassOffset: Math.random() * 10 - 5, // -5 a +5 graus
      accelerometerOffset: {
        x: Math.random() * 0.2 - 0.1,
        y: Math.random() * 0.2 - 0.1,
        z: Math.random() * 0.2 - 0.1
      },
      gyroscopeOffset: {
        x: Math.random() * 0.5 - 0.25,
        y: Math.random() * 0.5 - 0.25,
        z: Math.random() * 0.5 - 0.25
      },
      lastCalibrated: Date.now(),
      accuracy: 85 + Math.random() * 15 // 85-100%
    };

    // Atualizar ou adicionar calibração
    const existingIndex = this.calibrations.findIndex(c => c.deviceId === deviceId);
    if (existingIndex >= 0) {
      this.calibrations[existingIndex] = calibration;
    } else {
      this.calibrations.push(calibration);
    }

    return calibration;
  }

  // Obter calibração do dispositivo
  public getDeviceCalibration(deviceId: string): ARCalibration | null {
    return this.calibrations.find(c => c.deviceId === deviceId) || null;
  }

  // Verificar precisão da calibração
  public checkCalibrationAccuracy(deviceId: string): number {
    const calibration = this.getDeviceCalibration(deviceId);
    if (!calibration) return 0;

    // Calcular precisão baseada na idade da calibração
    const hoursSinceCalibration = (Date.now() - calibration.lastCalibrated) / (1000 * 60 * 60);
    
    if (hoursSinceCalibration < 1) return calibration.accuracy;
    if (hoursSinceCalibration < 24) return calibration.accuracy * 0.9;
    if (hoursSinceCalibration < 168) return calibration.accuracy * 0.7; // 1 semana
    return calibration.accuracy * 0.5;
  }

  // Parar sessão AR
  public stopARSession(sessionId: string): boolean {
    const session = this.activeSessions.find(s => s.id === sessionId);
    if (!session) return false;

    session.isActive = false;
    return true;
  }

  // Obter estatísticas da sessão
  public getSessionStats(sessionId: string): {
    duration: number;
    waypointsCompleted: number;
    totalWaypoints: number;
    progress: number;
  } | null {
    const session = this.activeSessions.find(s => s.id === sessionId);
    if (!session) return null;

    const route = this.routes.find(r => r.id === session.routeId);
    if (!route) return null;

    const duration = session.isActive ? 
      (Date.now() - session.startTime) / 1000 : 
      (session.completedWaypoints.length > 0 ? 
        (Date.now() - session.startTime) / 1000 : 0);

    return {
      duration: Math.round(duration),
      waypointsCompleted: session.completedWaypoints.length,
      totalWaypoints: route.waypoints.length,
      progress: Math.round((session.completedWaypoints.length / route.waypoints.length) * 100)
    };
  }

  // Obter rota por ID
  public getRouteById(routeId: string): ARRoute | undefined {
    return this.routes.find(r => r.id === routeId);
  }

  // Obter rotas disponíveis
  public getAvailableRoutes(): ARRoute[] {
    return this.routes.filter(r => r.isActive);
  }

  // Obter sessão ativa do usuário
  public getUserActiveSession(userId: string): ARSession | undefined {
    return this.activeSessions.find(s => s.userId === userId && s.isActive);
  }

  // Verificar se dispositivo suporta AR
  public isARSupported(): boolean {
    return this.deviceCapabilities.supportsARKit || 
           this.deviceCapabilities.supportsARCore || 
           this.deviceCapabilities.supportsWebXR;
  }

  // Obter capacidades do dispositivo
  public getDeviceCapabilities(): any {
    return { ...this.deviceCapabilities };
  }

  // Criar nova rota AR
  public createARRoute(routeData: Omit<ARRoute, 'id'>): ARRoute {
    const newRoute: ARRoute = {
      ...routeData,
      id: `route_${Date.now()}`
    };

    this.routes.push(newRoute);
    return newRoute;
  }

  // Adicionar waypoint à rota
  public addWaypointToRoute(routeId: string, waypoint: Omit<ARWaypoint, 'id'>): ARWaypoint | null {
    const route = this.routes.find(r => r.id === routeId);
    if (!route) return null;

    const newWaypoint: ARWaypoint = {
      ...waypoint,
      id: `wp_${Date.now()}`
    };

    route.waypoints.push(newWaypoint);
    return newWaypoint;
  }
}

export function createARNavigationManager(): ARNavigationManager {
  return new ARNavigationManager();
}