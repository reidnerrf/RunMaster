export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // segundos
  bpm: number; // batidas por minuto
  genre: string;
  energy: number; // 0-100
  mood: 'energetic' | 'calm' | 'motivational' | 'focus' | 'recovery';
  tags: string[];
  audioUrl: string;
  artworkUrl: string;
  isExplicit: boolean;
  releaseDate: number;
  popularity: number; // 0-100
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  type: 'workout' | 'recovery' | 'motivation' | 'focus' | 'custom';
  tracks: string[]; // IDs das músicas
  targetBPM: {
    min: number;
    max: number;
    optimal: number;
  };
  energyCurve: {
    warmup: number; // 0-100
    build: number;
    peak: number;
    cooldown: number;
  };
  duration: number; // duração total em segundos
  isPublic: boolean;
  createdBy: string;
  createdAt: number;
  lastUpdated: number;
  playCount: number;
  rating: number; // 0-5
}

export interface WorkoutMusicSession {
  id: string;
  userId: string;
  workoutId: string;
  playlistId: string;
  currentTrackIndex: number;
  currentBPM: number;
  targetBPM: number;
  bpmDifference: number;
  isAdaptive: boolean;
  audioGuidance: {
    enabled: boolean;
    frequency: 'low' | 'medium' | 'high';
    lastGuidance: number;
    guidanceCount: number;
  };
  sessionData: {
    startTime: number;
    endTime?: number;
    totalTracksPlayed: number;
    averageBPM: number;
    bpmVariations: number[];
    energyLevels: number[];
  };
}

export interface AudioGuidance {
  id: string;
  type: 'pace' | 'breathing' | 'terrain' | 'motivation' | 'recovery';
  message: string;
  audioUrl: string;
  duration: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  triggerConditions: {
    bpmThreshold?: number;
    heartRateThreshold?: number;
    terrainType?: string;
    workoutPhase?: string;
    timeInterval?: number;
  };
  isActive: boolean;
  lastPlayed?: number;
  playCount: number;
}

export interface BPMAnalysis {
  trackId: string;
  bpm: number;
  confidence: number; // 0-100
  tempoChanges: {
    timestamp: number;
    bpm: number;
    confidence: number;
  }[];
  averageBPM: number;
  bpmRange: {
    min: number;
    max: number;
  };
  rhythmPattern: 'steady' | 'variable' | 'progressive';
}

export interface MusicRecommendation {
  id: string;
  userId: string;
  trackId: string;
  reason: string;
  score: number; // 0-100
  category: 'workout' | 'recovery' | 'discovery' | 'mood';
  isPersonalized: boolean;
  createdAt: number;
  isPlayed: boolean;
  playCount: number;
  rating?: number;
}

export interface MusicManager {
  tracks: MusicTrack[];
  playlists: Playlist[];
  sessions: WorkoutMusicSession[];
  audioGuidance: AudioGuidance[];
  bpmAnalysis: Map<string, BPMAnalysis>;
  recommendations: MusicRecommendation[];
}

export class MusicManager {
  private tracks: MusicTrack[] = [];
  private playlists: Playlist[] = [];
  private sessions: WorkoutMusicSession[] = [];
  private audioGuidance: AudioGuidance[] = [];
  private bpmAnalysis: Map<string, BPMAnalysis> = new Map();
  private recommendations: MusicRecommendation[] = [];

  constructor() {
    this.initializeMusicTracks();
    this.initializePlaylists();
    this.initializeAudioGuidance();
  }

  private initializeMusicTracks() {
    const tracks: MusicTrack[] = [
      // Músicas Energeticas (BPM Alto)
      {
        id: 'track_1',
        title: 'Eye of the Tiger',
        artist: 'Survivor',
        album: 'Eye of the Tiger',
        duration: 264,
        bpm: 109,
        genre: 'Rock',
        energy: 95,
        mood: 'energetic',
        tags: ['motivation', 'workout', 'classic'],
        audioUrl: 'https://example.com/eye-of-tiger.mp3',
        artworkUrl: 'https://example.com/eye-of-tiger.jpg',
        isExplicit: false,
        releaseDate: 1982,
        popularity: 90
      },
      {
        id: 'track_2',
        title: 'Lose Yourself',
        artist: 'Eminem',
        album: '8 Mile',
        duration: 326,
        bpm: 171,
        genre: 'Hip Hop',
        energy: 92,
        mood: 'motivational',
        tags: ['motivation', 'workout', 'hip-hop'],
        audioUrl: 'https://example.com/lose-yourself.mp3',
        artworkUrl: 'https://example.com/lose-yourself.jpg',
        isExplicit: true,
        releaseDate: 2002,
        popularity: 95
      },
      {
        id: 'track_3',
        title: 'Stronger',
        artist: 'Kanye West',
        album: 'Graduation',
        duration: 312,
        genre: 'Hip Hop',
        bpm: 104,
        energy: 88,
        mood: 'energetic',
        tags: ['workout', 'motivation', 'electronic'],
        audioUrl: 'https://example.com/stronger.mp3',
        artworkUrl: 'https://example.com/stronger.jpg',
        isExplicit: false,
        releaseDate: 2007,
        popularity: 88
      },

      // Músicas de Recuperação (BPM Médio-Baixo)
      {
        id: 'track_4',
        title: 'Weightless',
        artist: 'Marconi Union',
        album: 'Different Colours',
        duration: 480,
        bpm: 60,
        genre: 'Ambient',
        energy: 25,
        mood: 'calm',
        tags: ['recovery', 'relaxation', 'ambient'],
        audioUrl: 'https://example.com/weightless.mp3',
        artworkUrl: 'https://example.com/weightless.jpg',
        isExplicit: false,
        releaseDate: 2011,
        popularity: 75
      },
      {
        id: 'track_5',
        title: 'Claire de Lune',
        artist: 'Debussy',
        album: 'Suite bergamasque',
        duration: 330,
        bpm: 72,
        genre: 'Classical',
        energy: 30,
        mood: 'calm',
        tags: ['recovery', 'classical', 'piano'],
        audioUrl: 'https://example.com/claire-de-lune.mp3',
        artworkUrl: 'https://example.com/claire-de-lune.jpg',
        isExplicit: false,
        releaseDate: 1905,
        popularity: 85
      },

      // Músicas de Foco (BPM Médio)
      {
        id: 'track_6',
        title: 'The Scientist',
        artist: 'Coldplay',
        album: 'A Rush of Blood to the Head',
        duration: 309,
        bpm: 85,
        genre: 'Alternative Rock',
        energy: 65,
        mood: 'focus',
        tags: ['focus', 'running', 'alternative'],
        audioUrl: 'https://example.com/the-scientist.mp3',
        artworkUrl: 'https://example.com/the-scientist.jpg',
        isExplicit: false,
        releaseDate: 2002,
        popularity: 82
      }
    ];

    this.tracks.push(...tracks);
  }

  private initializePlaylists() {
    const playlists: Playlist[] = [
      {
        id: 'playlist_1',
        name: 'Corrida Energética',
        description: 'Playlist para corridas de alta intensidade',
        type: 'workout',
        tracks: ['track_1', 'track_2', 'track_3'],
        targetBPM: {
          min: 100,
          max: 180,
          optimal: 140
        },
        energyCurve: {
          warmup: 60,
          build: 80,
          peak: 95,
          cooldown: 40
        },
        duration: 900, // 15 minutos
        isPublic: true,
        createdBy: 'system',
        createdAt: Date.now(),
        lastUpdated: Date.now(),
        playCount: 1250,
        rating: 4.5
      },
      {
        id: 'playlist_2',
        name: 'Recuperação Suave',
        description: 'Músicas para relaxar após o treino',
        type: 'recovery',
        tracks: ['track_4', 'track_5'],
        targetBPM: {
          min: 60,
          max: 80,
          optimal: 70
        },
        energyCurve: {
          warmup: 30,
          build: 25,
          peak: 20,
          cooldown: 15
        },
        duration: 810, // 13.5 minutos
        isPublic: true,
        createdBy: 'system',
        createdAt: Date.now(),
        lastUpdated: Date.now(),
        playCount: 890,
        rating: 4.2
      },
      {
        id: 'playlist_3',
        name: 'Foco na Corrida',
        description: 'Músicas para manter o foco durante longas distâncias',
        type: 'focus',
        tracks: ['track_6'],
        targetBPM: {
          min: 80,
          max: 90,
          optimal: 85
        },
        energyCurve: {
          warmup: 50,
          build: 65,
          peak: 70,
          cooldown: 55
        },
        duration: 309, // 5 minutos
        isPublic: true,
        createdBy: 'system',
        createdAt: Date.now(),
        lastUpdated: Date.now(),
        playCount: 567,
        rating: 4.0
      }
    ];

    this.playlists.push(...playlists);
  }

  private initializeAudioGuidance() {
    const guidance: AudioGuidance[] = [
      {
        id: 'guidance_1',
        type: 'pace',
        message: 'Ajusta a passada, você está muito rápido para esta fase do treino',
        audioUrl: 'https://example.com/pace-adjustment.mp3',
        duration: 8,
        priority: 'medium',
        triggerConditions: {
          bpmThreshold: 20, // 20 BPM acima do alvo
          workoutPhase: 'build'
        },
        isActive: true,
        playCount: 0
      },
      {
        id: 'guidance_2',
        type: 'breathing',
        message: 'Respiração controlada: inspire por 3 passos, expire por 2',
        audioUrl: 'https://example.com/breathing-pattern.mp3',
        duration: 12,
        priority: 'high',
        triggerConditions: {
          heartRateThreshold: 85, // 85% da frequência máxima
          timeInterval: 300 // a cada 5 minutos
        },
        isActive: true,
        playCount: 0
      },
      {
        id: 'guidance_3',
        type: 'terrain',
        message: 'Atenção: subida à frente. Mantenha o ritmo, mas ajuste a passada',
        audioUrl: 'https://example.com/terrain-warning.mp3',
        duration: 10,
        priority: 'high',
        triggerConditions: {
          terrainType: 'uphill',
          bpmThreshold: 10
        },
        isActive: true,
        playCount: 0
      },
      {
        id: 'guidance_4',
        type: 'motivation',
        message: 'Excelente ritmo! Você está no seu melhor momento. Continue assim!',
        audioUrl: 'https://example.com/motivation.mp3',
        duration: 6,
        priority: 'low',
        triggerConditions: {
          bpmThreshold: -5, // 5 BPM abaixo do alvo (ritmo perfeito)
          workoutPhase: 'peak'
        },
        isActive: true,
        playCount: 0
      },
      {
        id: 'guidance_5',
        type: 'recovery',
        message: 'Diminui o ritmo agora, você vai durar mais no treino',
        audioUrl: 'https://example.com/recovery-advice.mp3',
        duration: 9,
        priority: 'medium',
        triggerConditions: {
          heartRateThreshold: 90,
          workoutPhase: 'build'
        },
        isActive: true,
        playCount: 0
      }
    ];

    this.audioGuidance.push(...guidance);
  }

  // Obter todas as músicas
  public getAllTracks(): MusicTrack[] {
    return this.tracks;
  }

  // Obter música por ID
  public getTrackById(trackId: string): MusicTrack | undefined {
    return this.tracks.find(track => track.id === trackId);
  }

  // Obter músicas por BPM
  public getTracksByBPM(minBPM: number, maxBPM: number): MusicTrack[] {
    return this.tracks.filter(track => 
      track.bpm >= minBPM && track.bpm <= maxBPM
    );
  }

  // Obter músicas por energia
  public getTracksByEnergy(minEnergy: number, maxEnergy: number): MusicTrack[] {
    return this.tracks.filter(track => 
      track.energy >= minEnergy && track.energy <= maxEnergy
    );
  }

  // Obter músicas por humor
  public getTracksByMood(mood: string): MusicTrack[] {
    return this.tracks.filter(track => track.mood === mood);
  }

  // Obter músicas por gênero
  public getTracksByGenre(genre: string): MusicTrack[] {
    return this.tracks.filter(track => track.genre.toLowerCase() === genre.toLowerCase());
  }

  // Obter todas as playlists
  public getAllPlaylists(): Playlist[] {
    return this.playlists;
  }

  // Obter playlist por ID
  public getPlaylistById(playlistId: string): Playlist | undefined {
    return this.playlists.find(playlist => playlist.id === playlistId);
  }

  // Obter playlists por tipo
  public getPlaylistsByType(type: string): Playlist[] {
    return this.playlists.filter(playlist => playlist.type === type);
  }

  // Obter playlists por BPM alvo
  public getPlaylistsByTargetBPM(targetBPM: number, tolerance: number = 10): Playlist[] {
    return this.playlists.filter(playlist => 
      Math.abs(playlist.targetBPM.optimal - targetBPM) <= tolerance
    );
  }

  // Criar sessão de música para treino
  public createWorkoutMusicSession(
    userId: string,
    workoutId: string,
    playlistId: string,
    targetBPM: number,
    isAdaptive: boolean = true
  ): WorkoutMusicSession | null {
    const playlist = this.getPlaylistById(playlistId);
    if (!playlist) return null;

    const session: WorkoutMusicSession = {
      id: `session_${Date.now()}`,
      userId,
      workoutId,
      playlistId,
      currentTrackIndex: 0,
      currentBPM: playlist.tracks[0] ? this.getTrackById(playlist.tracks[0])?.bpm || 0 : 0,
      targetBPM,
      bpmDifference: 0,
      isAdaptive,
      audioGuidance: {
        enabled: true,
        frequency: 'medium',
        lastGuidance: 0,
        guidanceCount: 0
      },
      sessionData: {
        startTime: Date.now(),
        totalTracksPlayed: 0,
        averageBPM: 0,
        bpmVariations: [],
        energyLevels: []
      }
    };

    this.sessions.push(session);
    return session;
  }

  // Obter próxima música da sessão
  public getNextTrack(sessionId: string): MusicTrack | null {
    const session = this.sessions.find(s => s.id === sessionId);
    if (!session) return null;

    const playlist = this.getPlaylistById(session.playlistId);
    if (!playlist) return null;

    if (session.currentTrackIndex >= playlist.tracks.length) {
      return null; // Fim da playlist
    }

    const trackId = playlist.tracks[session.currentTrackIndex];
    const track = this.getTrackById(trackId);
    
    if (track) {
      // Atualizar sessão
      session.currentTrackIndex++;
      session.currentBPM = track.bpm;
      session.bpmDifference = track.bpm - session.targetBPM;
      session.sessionData.totalTracksPlayed++;
      session.sessionData.bpmVariations.push(session.bpmDifference);
      session.sessionData.energyLevels.push(track.energy);
      
      // Calcular BPM médio
      const totalBPM = session.sessionData.bpmVariations.reduce((sum, bpm) => sum + bpm, 0);
      session.sessionData.averageBPM = totalBPM / session.sessionData.bpmVariations.length;
    }

    return track || null;
  }

  // Verificar se deve tocar orientação por áudio
  public shouldPlayAudioGuidance(
    sessionId: string,
    currentHeartRate?: number,
    currentTerrain?: string,
    workoutPhase?: string
  ): AudioGuidance | null {
    const session = this.sessions.find(s => s.id === sessionId);
    if (!session || !session.audioGuidance.enabled) return null;

    const now = Date.now();
    const timeSinceLastGuidance = now - session.audioGuidance.lastGuidance;
    const minInterval = this.getGuidanceInterval(session.audioGuidance.frequency);

    if (timeSinceLastGuidance < minInterval) return null;

    // Verificar condições para cada orientação
    for (const guidance of this.audioGuidance) {
      if (!guidance.isActive) continue;

      if (this.checkGuidanceConditions(guidance, session, currentHeartRate, currentTerrain, workoutPhase)) {
        // Atualizar sessão
        session.audioGuidance.lastGuidance = now;
        session.audioGuidance.guidanceCount++;
        guidance.lastPlayed = now;
        guidance.playCount++;

        return guidance;
      }
    }

    return null;
  }

  // Verificar condições para orientação
  private checkGuidanceConditions(
    guidance: AudioGuidance,
    session: WorkoutMusicSession,
    heartRate?: number,
    terrain?: string,
    workoutPhase?: string
  ): boolean {
    const conditions = guidance.triggerConditions;

    // Verificar BPM
    if (conditions.bpmThreshold !== undefined) {
      const bpmDiff = Math.abs(session.bpmDifference);
      if (bpmDiff < Math.abs(conditions.bpmThreshold)) {
        return false;
      }
    }

    // Verificar frequência cardíaca
    if (conditions.heartRateThreshold !== undefined && heartRate) {
      if (heartRate < conditions.heartRateThreshold) {
        return false;
      }
    }

    // Verificar tipo de terreno
    if (conditions.terrainType && terrain) {
      if (terrain !== conditions.terrainType) {
        return false;
      }
    }

    // Verificar fase do treino
    if (conditions.workoutPhase && workoutPhase) {
      if (workoutPhase !== conditions.workoutPhase) {
        return false;
      }
    }

    // Verificar intervalo de tempo
    if (conditions.timeInterval) {
      const sessionDuration = Date.now() - session.sessionData.startTime;
      if (sessionDuration % conditions.timeInterval !== 0) {
        return false;
      }
    }

    return true;
  }

  // Obter intervalo mínimo entre orientações
  private getGuidanceInterval(frequency: string): number {
    switch (frequency) {
      case 'low': return 120000; // 2 minutos
      case 'medium': return 60000; // 1 minuto
      case 'high': return 30000; // 30 segundos
      default: return 60000;
    }
  }

  // Analisar BPM de uma música
  public analyzeBPM(trackId: string, audioData: any): BPMAnalysis {
    // Simulação de análise de BPM
    const track = this.getTrackById(trackId);
    if (!track) {
      throw new Error('Música não encontrada');
    }

    const analysis: BPMAnalysis = {
      trackId,
      bpm: track.bpm,
      confidence: 95,
      tempoChanges: [
        { timestamp: 0, bpm: track.bpm, confidence: 95 },
        { timestamp: 60, bpm: track.bpm + 2, confidence: 90 },
        { timestamp: 120, bpm: track.bpm - 1, confidence: 92 }
      ],
      averageBPM: track.bpm,
      bpmRange: {
        min: track.bpm - 3,
        max: track.bpm + 3
      },
      rhythmPattern: 'steady'
    };

    this.bpmAnalysis.set(trackId, analysis);
    return analysis;
  }

  // Obter análise BPM de uma música
  public getBPMAnalysis(trackId: string): BPMAnalysis | undefined {
    return this.bpmAnalysis.get(trackId);
  }

  // Criar playlist personalizada baseada em BPM
  public createPersonalizedPlaylist(
    userId: string,
    targetBPM: number,
    duration: number,
    energyPreference: 'low' | 'medium' | 'high'
  ): Playlist {
    const tracks = this.getTracksByBPM(targetBPM - 10, targetBPM + 10);
    
    // Filtrar por energia se especificado
    let filteredTracks = tracks;
    if (energyPreference !== 'medium') {
      const energyRange = energyPreference === 'low' ? [0, 50] : [50, 100];
      filteredTracks = tracks.filter(track => 
        track.energy >= energyRange[0] && track.energy <= energyRange[1]
      );
    }

    // Selecionar músicas para atingir a duração desejada
    const selectedTracks: string[] = [];
    let currentDuration = 0;
    
    for (const track of filteredTracks) {
      if (currentDuration + track.duration <= duration) {
        selectedTracks.push(track.id);
        currentDuration += track.duration;
      }
      
      if (currentDuration >= duration) break;
    }

    const playlist: Playlist = {
      id: `personalized_${Date.now()}`,
      name: `Playlist Personalizada - ${targetBPM} BPM`,
      description: `Playlist criada automaticamente para ${targetBPM} BPM`,
      type: 'custom',
      tracks: selectedTracks,
      targetBPM: {
        min: targetBPM - 10,
        max: targetBPM + 10,
        optimal: targetBPM
      },
      energyCurve: {
        warmup: 60,
        build: 70,
        peak: 80,
        cooldown: 50
      },
      duration: currentDuration,
      isPublic: false,
      createdBy: userId,
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      playCount: 0,
      rating: 0
    };

    this.playlists.push(playlist);
    return playlist;
  }

  // Gerar recomendações de música
  public generateMusicRecommendations(
    userId: string,
    workoutHistory: any[],
    preferences: any
  ): MusicRecommendation[] {
    const recommendations: MusicRecommendation[] = [];
    
    // Analisar histórico de treinos para entender preferências
    const preferredBPM = this.calculatePreferredBPM(workoutHistory);
    const preferredGenres = this.calculatePreferredGenres(workoutHistory);
    
    // Encontrar músicas que se encaixam nas preferências
    const candidateTracks = this.tracks.filter(track => 
      Math.abs(track.bpm - preferredBPM) <= 15 &&
      preferredGenres.includes(track.genre)
    );
    
    // Gerar recomendações
    candidateTracks.slice(0, 10).forEach(track => {
      const score = this.calculateRecommendationScore(track, preferredBPM, preferences);
      
      const recommendation: MusicRecommendation = {
        id: `rec_${Date.now()}_${track.id}`,
        userId,
        trackId: track.id,
        reason: `Baseado no seu BPM preferido (${preferredBPM}) e gênero favorito (${track.genre})`,
        score,
        category: 'workout',
        isPersonalized: true,
        createdAt: Date.now(),
        isPlayed: false,
        playCount: 0
      };
      
      recommendations.push(recommendation);
    });
    
    // Ordenar por score
    recommendations.sort((a, b) => b.score - a.score);
    
    this.recommendations.push(...recommendations);
    return recommendations;
  }

  // Calcular BPM preferido baseado no histórico
  private calculatePreferredBPM(workoutHistory: any[]): number {
    if (workoutHistory.length === 0) return 140; // BPM padrão
    
    const bpmValues = workoutHistory
      .map(workout => workout.averageBPM || workout.targetBPM)
      .filter(bpm => bpm > 0);
    
    if (bpmValues.length === 0) return 140;
    
    const sum = bpmValues.reduce((total, bpm) => total + bpm, 0);
    return Math.round(sum / bpmValues.length);
  }

  // Calcular gêneros preferidos baseado no histórico
  private calculatePreferredGenres(workoutHistory: any[]): string[] {
    if (workoutHistory.length === 0) return ['Rock', 'Pop'];
    
    const genreCounts: { [key: string]: number } = {};
    
    workoutHistory.forEach(workout => {
      if (workout.playlistId) {
        const playlist = this.getPlaylistById(workout.playlistId);
        if (playlist) {
          playlist.tracks.forEach(trackId => {
            const track = this.getTrackById(trackId);
            if (track) {
              genreCounts[track.genre] = (genreCounts[track.genre] || 0) + 1;
            }
          });
        }
      }
    });
    
    // Retornar top 3 gêneros
    return Object.entries(genreCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre);
  }

  // Calcular score de recomendação
  private calculateRecommendationScore(
    track: MusicTrack,
    preferredBPM: number,
    preferences: any
  ): number {
    let score = 0;
    
    // Score baseado no BPM (quanto mais próximo, melhor)
    const bpmDifference = Math.abs(track.bpm - preferredBPM);
    score += Math.max(0, 100 - bpmDifference * 2);
    
    // Score baseado na energia
    if (preferences.energyPreference === 'high' && track.energy > 80) score += 20;
    else if (preferences.energyPreference === 'low' && track.energy < 50) score += 20;
    else if (preferences.energyPreference === 'medium' && track.energy >= 50 && track.energy <= 80) score += 20;
    
    // Score baseado na popularidade
    score += track.popularity * 0.3;
    
    // Score baseado no humor
    if (preferences.moodPreference === track.mood) score += 15;
    
    return Math.min(100, Math.max(0, score));
  }

  // Obter estatísticas de música
  public getMusicStats(): {
    totalTracks: number;
    totalPlaylists: number;
    totalSessions: number;
    averageBPM: number;
    genreDistribution: { [key: string]: number };
    moodDistribution: { [key: string]: number };
    mostPlayedTracks: string[];
  } {
    const totalTracks = this.tracks.length;
    const totalPlaylists = this.playlists.length;
    const totalSessions = this.sessions.length;
    
    // Calcular BPM médio
    const totalBPM = this.tracks.reduce((sum, track) => sum + track.bpm, 0);
    const averageBPM = totalTracks > 0 ? Math.round(totalBPM / totalTracks) : 0;
    
    // Distribuição por gênero
    const genreDistribution: { [key: string]: number } = {};
    this.tracks.forEach(track => {
      genreDistribution[track.genre] = (genreDistribution[track.genre] || 0) + 1;
    });
    
    // Distribuição por humor
    const moodDistribution: { [key: string]: number } = {};
    this.tracks.forEach(track => {
      moodDistribution[track.mood] = (moodDistribution[track.mood] || 0) + 1;
    });
    
    // Músicas mais tocadas
    const mostPlayedTracks = this.tracks
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 5)
      .map(track => track.title);
    
    return {
      totalTracks,
      totalPlaylists,
      totalSessions,
      averageBPM,
      genreDistribution,
      moodDistribution,
      mostPlayedTracks
    };
  }

  // Finalizar sessão de música
  public endMusicSession(sessionId: string): WorkoutMusicSession | null {
    const session = this.sessions.find(s => s.id === sessionId);
    if (!session) return null;
    
    session.sessionData.endTime = Date.now();
    
    return session;
  }
}

export function createMusicManager(): MusicManager {
  return new MusicManager();
}