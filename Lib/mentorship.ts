export interface Mentor {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  experience: number; // anos de experiência
  level: 'beginner' | 'intermediate' | 'advanced' | 'elite' | 'professional';
  specialties: string[]; // ['5k', 'marathon', 'trail', 'speed', 'endurance']
  certifications: string[]; // ['personal_trainer', 'running_coach', 'physio']
  bio: string;
  achievements: string[];
  rating: number; // 1-5
  totalMentees: number;
  isAvailable: boolean;
  hourlyRate?: number; // para mentoria paga
  languages: string[];
  timezone: string;
  availability: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
    sunday: string[];
  };
}

export interface Mentee {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  experience: number; // meses de experiência
  level: 'beginner' | 'intermediate' | 'advanced';
  goals: string[]; // ['5k', 'weight_loss', 'endurance']
  currentChallenges: string[];
  preferredMentorType: 'free' | 'paid' | 'both';
  budget?: number; // para mentoria paga
  timezone: string;
  availability: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
    sunday: string[];
  };
}

export interface MentorshipRequest {
  id: string;
  menteeId: string;
  mentorId: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  message: string;
  goals: string[];
  expectedDuration: number; // semanas
  preferredSchedule: string[];
  createdAt: number;
  respondedAt?: number;
  startedAt?: number;
  completedAt?: number;
}

export interface MentorshipSession {
  id: string;
  mentorshipId: string;
  mentorId: string;
  menteeId: string;
  date: number;
  duration: number; // minutos
  type: 'initial' | 'training' | 'review' | 'motivation' | 'technical';
  topics: string[];
  notes: string;
  actionItems: string[];
  nextSessionDate?: number;
  rating?: number; // 1-5
  feedback?: string;
}

export interface TrainingPlan {
  id: string;
  mentorshipId: string;
  mentorId: string;
  menteeId: string;
  name: string;
  description: string;
  duration: number; // semanas
  phases: TrainingPhase[];
  currentPhase: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface TrainingPhase {
  id: string;
  name: string;
  duration: number; // semanas
  focus: string;
  workouts: TrainingWorkout[];
  goals: string[];
  notes: string;
}

export interface TrainingWorkout {
  id: string;
  name: string;
  type: 'easy_run' | 'tempo_run' | 'long_run' | 'interval' | 'strength' | 'recovery';
  distance?: number;
  duration: number; // minutos
  intensity: number; // 0-100
  pace?: string;
  heartRateZones?: string[];
  description: string;
  tips: string[];
  progression: string;
}

export interface MentorshipChat {
  id: string;
  mentorshipId: string;
  senderId: string;
  message: string;
  timestamp: number;
  type: 'text' | 'voice' | 'image' | 'file';
  isRead: boolean;
}

export class MentorshipManager {
  private mentors: Mentor[] = [];
  private mentees: Mentee[] = [];
  private mentorshipRequests: MentorshipRequest[] = [];
  private mentorshipSessions: MentorshipSession[] = [];
  private trainingPlans: TrainingPlan[] = [];
  private chats: MentorshipChat[] = [];

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Mentores de exemplo
    const mentors: Mentor[] = [
      {
        id: 'mentor_1',
        userId: 'user_1',
        username: 'Carlos Elite',
        experience: 8,
        level: 'elite',
        specialties: ['marathon', 'speed', 'endurance'],
        certifications: ['personal_trainer', 'running_coach'],
        bio: 'Ex-atleta olímpico com 8 anos de experiência em coaching. Especialista em maratonas e treinos de velocidade.',
        achievements: ['Maratona 2:15:30', 'Coach do ano 2023', '100+ corredores treinados'],
        rating: 4.9,
        totalMentees: 15,
        isAvailable: true,
        hourlyRate: 150,
        languages: ['pt-BR', 'en'],
        timezone: 'America/Sao_Paulo',
        availability: {
          monday: ['09:00-12:00', '18:00-21:00'],
          tuesday: ['09:00-12:00', '18:00-21:00'],
          wednesday: ['09:00-12:00', '18:00-21:00'],
          thursday: ['09:00-12:00', '18:00-21:00'],
          friday: ['09:00-12:00', '18:00-21:00'],
          saturday: ['08:00-12:00'],
          sunday: ['08:00-12:00']
        }
      },
      {
        id: 'mentor_2',
        userId: 'user_2',
        username: 'Ana Trail',
        experience: 5,
        level: 'advanced',
        specialties: ['trail', 'ultra', 'endurance'],
        certifications: ['running_coach'],
        bio: 'Especialista em corridas de trilha e ultra maratonas. Apaixonada por montanhas e desafios extremos.',
        achievements: ['Ultra Trail 100km', '3x Campeã estadual trail', '50+ corredores treinados'],
        rating: 4.8,
        totalMentees: 8,
        isAvailable: true,
        hourlyRate: 100,
        languages: ['pt-BR'],
        timezone: 'America/Sao_Paulo',
        availability: {
          monday: ['19:00-22:00'],
          tuesday: ['19:00-22:00'],
          wednesday: ['19:00-22:00'],
          thursday: ['19:00-22:00'],
          friday: ['19:00-22:00'],
          saturday: ['07:00-12:00'],
          sunday: ['07:00-12:00']
        }
      },
      {
        id: 'mentor_3',
        userId: 'user_3',
        username: 'Pedro Iniciante',
        experience: 3,
        level: 'intermediate',
        specialties: ['5k', '10k', 'beginner'],
        certifications: [],
        bio: 'Corredor intermediário que ama ajudar iniciantes. Especialista em transição de caminhada para corrida.',
        achievements: ['10K em 45min', '5K em 22min', '20+ corredores ajudados'],
        rating: 4.6,
        totalMentees: 5,
        isAvailable: true,
        hourlyRate: 0, // gratuito
        languages: ['pt-BR'],
        timezone: 'America/Sao_Paulo',
        availability: {
          monday: ['18:00-20:00'],
          tuesday: ['18:00-20:00'],
          wednesday: ['18:00-20:00'],
          thursday: ['18:00-20:00'],
          friday: ['18:00-20:00'],
          saturday: ['08:00-10:00'],
          sunday: ['08:00-10:00']
        }
      }
    ];

    // Mentees de exemplo
    const mentees: Mentee[] = [
      {
        id: 'mentee_1',
        userId: 'user_4',
        username: 'Maria Iniciante',
        experience: 2,
        level: 'beginner',
        goals: ['5k', 'weight_loss', 'consistency'],
        currentChallenges: ['Falta de motivação', 'Dificuldade com respiração', 'Dores nas pernas'],
        preferredMentorType: 'free',
        timezone: 'America/Sao_Paulo',
        availability: {
          monday: ['18:00-20:00'],
          tuesday: ['18:00-20:00'],
          wednesday: ['18:00-20:00'],
          thursday: ['18:00-20:00'],
          friday: ['18:00-20:00'],
          saturday: ['08:00-10:00'],
          sunday: ['08:00-10:00']
        }
      },
      {
        id: 'mentee_2',
        userId: 'user_5',
        username: 'João Intermediário',
        experience: 12,
        level: 'intermediate',
        goals: ['10k', 'half_marathon', 'speed_improvement'],
        currentChallenges: ['Platô de performance', 'Lesões recorrentes', 'Estratégia de corrida'],
        preferredMentorType: 'paid',
        budget: 200,
        timezone: 'America/Sao_Paulo',
        availability: {
          monday: ['19:00-21:00'],
          tuesday: ['19:00-21:00'],
          wednesday: ['19:00-21:00'],
          thursday: ['19:00-21:00'],
          friday: ['19:00-21:00'],
          saturday: ['07:00-10:00'],
          sunday: ['07:00-10:00']
        }
      }
    ];

    this.mentors.push(...mentors);
    this.mentees.push(...mentees);
  }

  // Buscar mentores disponíveis
  public searchMentors(filters: {
    specialties?: string[];
    level?: string[];
    maxPrice?: number;
    languages?: string[];
    timezone?: string;
  }): Mentor[] {
    let filteredMentors = this.mentors.filter(mentor => mentor.isAvailable);

    if (filters.specialties && filters.specialties.length > 0) {
      filteredMentors = filteredMentors.filter(mentor =>
        mentor.specialties.some(specialty => filters.specialties!.includes(specialty))
      );
    }

    if (filters.level && filters.level.length > 0) {
      filteredMentors = filteredMentors.filter(mentor =>
        filters.level!.includes(mentor.level)
      );
    }

    if (filters.maxPrice !== undefined) {
      filteredMentors = filteredMentors.filter(mentor =>
        mentor.hourlyRate === undefined || mentor.hourlyRate <= filters.maxPrice!
      );
    }

    if (filters.languages && filters.languages.length > 0) {
      filteredMentors = filteredMentors.filter(mentor =>
        mentor.languages.some(lang => filters.languages!.includes(lang))
      );
    }

    if (filters.timezone) {
      filteredMentors = filteredMentors.filter(mentor =>
        mentor.timezone === filters.timezone
      );
    }

    // Ordenar por rating e experiência
    return filteredMentors.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.experience - a.experience;
    });
  }

  // Solicitar mentoria
  public requestMentorship(
    menteeId: string,
    mentorId: string,
    message: string,
    goals: string[],
    expectedDuration: number,
    preferredSchedule: string[]
  ): MentorshipRequest {
    const mentee = this.mentees.find(m => m.id === menteeId);
    const mentor = this.mentors.find(m => m.id === mentorId);

    if (!mentee || !mentor) {
      throw new Error('Mentee ou mentor não encontrado');
    }

    if (!mentor.isAvailable) {
      throw new Error('Mentor não está disponível no momento');
    }

    const request: MentorshipRequest = {
      id: `request_${Date.now()}`,
      menteeId,
      mentorId,
      status: 'pending',
      message,
      goals,
      expectedDuration,
      preferredSchedule,
      createdAt: Date.now()
    };

    this.mentorshipRequests.push(request);
    return request;
  }

  // Aceitar solicitação de mentoria
  public acceptMentorship(requestId: string): MentorshipRequest {
    const request = this.mentorshipRequests.find(r => r.id === requestId);
    if (!request) throw new Error('Solicitação não encontrada');

    request.status = 'accepted';
    request.respondedAt = Date.now();
    request.startedAt = Date.now();

    // Criar plano de treino inicial
    this.createInitialTrainingPlan(request);

    return request;
  }

  // Recusar solicitação de mentoria
  public declineMentorship(requestId: string, reason?: string): MentorshipRequest {
    const request = this.mentorshipRequests.find(r => r.id === requestId);
    if (!request) throw new Error('Solicitação não encontrada');

    request.status = 'declined';
    request.respondedAt = Date.now();

    return request;
  }

  // Criar plano de treino inicial
  private createInitialTrainingPlan(request: MentorshipRequest): TrainingPlan {
    const mentee = this.mentees.find(m => m.id === request.menteeId);
    const mentor = this.mentors.find(m => m.id === request.mentorId);

    if (!mentee || !mentor) throw new Error('Dados não encontrados');

    const plan: TrainingPlan = {
      id: `plan_${Date.now()}`,
      mentorshipId: request.id,
      mentorId: request.mentorId,
      menteeId: request.menteeId,
      name: `Plano ${mentee.username} - ${mentor.username}`,
      description: `Plano personalizado para ${mentee.username} focado em ${request.goals.join(', ')}`,
      duration: request.expectedDuration,
      phases: this.generateInitialPhases(mentee, request.goals),
      currentPhase: 0,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.trainingPlans.push(plan);
    return plan;
  }

  // Gerar fases iniciais do treino
  private generateInitialPhases(mentee: Mentee, goals: string[]): TrainingPhase[] {
    const phases: TrainingPhase[] = [];

    // Fase 1: Base (2-4 semanas)
    phases.push({
      id: `phase_1_${Date.now()}`,
      name: 'Construção de Base',
      duration: Math.min(4, Math.max(2, mentee.experience / 3)),
      focus: 'Construir resistência e técnica básica',
      workouts: this.generateBaseWorkouts(mentee.level),
      goals: ['Estabelecer rotina', 'Melhorar técnica', 'Construir base aeróbica'],
      notes: 'Foque na consistência, não na velocidade'
    });

    // Fase 2: Desenvolvimento (4-6 semanas)
    phases.push({
      id: `phase_2_${Date.now()}`,
      name: 'Desenvolvimento',
      duration: Math.min(6, Math.max(4, mentee.experience / 2)),
      focus: 'Aumentar volume e introduzir intensidade',
      workouts: this.generateDevelopmentWorkouts(mentee.level, goals),
      goals: ['Aumentar distância', 'Introduzir treinos de velocidade', 'Melhorar resistência'],
      notes: 'Mantenha 80% dos treinos em intensidade baixa'
    });

    // Fase 3: Específica (2-4 semanas)
    if (goals.includes('5k') || goals.includes('10k')) {
      phases.push({
        id: `phase_3_${Date.now()}`,
        name: 'Específica',
        duration: Math.min(4, Math.max(2, mentee.experience / 4)),
        focus: 'Treinos específicos para a distância alvo',
        workouts: this.generateSpecificWorkouts(mentee.level, goals),
        goals: ['Treinos de ritmo', 'Simulações de prova', 'Taper final'],
        notes: 'Reduza volume, mantenha intensidade'
      });
    }

    return phases;
  }

  // Gerar treinos de base
  private generateBaseWorkouts(level: string): TrainingWorkout[] {
    const workouts: TrainingWorkout[] = [];

    if (level === 'beginner') {
      workouts.push(
        {
          id: `workout_1_${Date.now()}`,
          name: 'Caminhada Progressiva',
          type: 'easy_run',
          duration: 20,
          intensity: 30,
          description: 'Caminhada com pequenos intervalos de corrida',
          tips: ['Mantenha ritmo conversável', 'Foque na respiração', 'Não se preocupe com velocidade'],
          progression: 'Aumentar tempo de corrida gradualmente'
        },
        {
          id: `workout_2_${Date.now()}`,
          name: 'Corrida Leve',
          type: 'easy_run',
          duration: 15,
          intensity: 40,
          description: 'Corrida em ritmo muito confortável',
          tips: ['Ritmo conversável', 'Postura ereta', 'Respiração controlada'],
          progression: 'Aumentar duração em 2-3 min por semana'
        }
      );
    } else {
      workouts.push(
        {
          id: `workout_1_${Date.now()}`,
          name: 'Corrida de Base',
          type: 'easy_run',
          duration: 30,
          intensity: 50,
          description: 'Corrida em ritmo confortável para construir base',
          tips: ['Mantenha ritmo conversável', 'Foque na técnica', 'Hidrate-se adequadamente'],
          progression: 'Aumentar duração gradualmente'
        },
        {
          id: `workout_2_${Date.now()}`,
          name: 'Corrida Longa',
          type: 'long_run',
          duration: 45,
          intensity: 60,
          description: 'Corrida mais longa para construir resistência',
          tips: ['Ritmo sustentável', 'Hidratação regular', 'Alimentação se necessário'],
          progression: 'Aumentar duração em 5-10 min por semana'
        }
      );
    }

    return workouts;
  }

  // Gerar treinos de desenvolvimento
  private generateDevelopmentWorkouts(level: string, goals: string[]): TrainingWorkout[] {
    const workouts: TrainingWorkout[] = [];

    workouts.push(
      {
        id: `workout_1_${Date.now()}`,
        name: 'Tempo Run',
        type: 'tempo_run',
        duration: 25,
        intensity: 75,
        description: 'Corrida em ritmo de prova com aquecimento e desaquecimento',
        tips: ['Ritmo sustentável por 20 min', 'Foque na respiração', 'Mantenha forma técnica'],
        progression: 'Aumentar duração do tempo em 2-3 min por semana'
      },
      {
        id: `workout_2_${Date.now()}`,
        name: 'Intervalos',
        type: 'interval',
        duration: 30,
        intensity: 85,
        description: 'Intervalos de alta intensidade com recuperação ativa',
        tips: ['Recuperação completa entre intervalos', 'Mantenha forma técnica', 'Não se esforce demais'],
        progression: 'Aumentar número de intervalos ou duração'
      }
    );

    return workouts;
  }

  // Gerar treinos específicos
  private generateSpecificWorkouts(level: string, goals: string[]): TrainingWorkout[] {
    const workouts: TrainingWorkout[] = [];

    if (goals.includes('5k')) {
      workouts.push({
        id: `workout_1_${Date.now()}`,
        name: 'Simulação 5K',
        type: 'tempo_run',
        duration: 35,
        intensity: 80,
        description: 'Simulação de prova com ritmo alvo',
        tips: ['Ritmo de prova por 5km', 'Hidratação adequada', 'Alimentação prévia'],
        progression: 'Aumentar distância gradualmente'
      });
    }

    if (goals.includes('10k')) {
      workouts.push({
        id: `workout_2_${Date.now()}`,
        name: 'Simulação 10K',
        type: 'long_run',
        duration: 50,
        intensity: 75,
        description: 'Simulação de prova com ritmo alvo',
        tips: ['Ritmo de prova por 10km', 'Hidratação regular', 'Géis se necessário'],
        progression: 'Aumentar distância gradualmente'
      });
    }

    return workouts;
  }

  // Agendar sessão de mentoria
  public scheduleSession(
    mentorshipId: string,
    date: number,
    duration: number,
    type: string,
    topics: string[]
  ): MentorshipSession {
    const mentorship = this.mentorshipRequests.find(r => r.id === mentorshipId);
    if (!mentorship || mentorship.status !== 'accepted') {
      throw new Error('Mentoria não está ativa');
    }

    const session: MentorshipSession = {
      id: `session_${Date.now()}`,
      mentorshipId,
      mentorId: mentorship.mentorId,
      menteeId: mentorship.menteeId,
      date,
      duration,
      type: type as any,
      topics,
      notes: '',
      actionItems: [],
      nextSessionDate: undefined
    };

    this.mentorshipSessions.push(session);
    return session;
  }

  // Adicionar mensagem ao chat
  public sendMessage(
    mentorshipId: string,
    senderId: string,
    message: string,
    type: 'text' | 'voice' | 'image' | 'file' = 'text'
  ): MentorshipChat {
    const mentorship = this.mentorshipRequests.find(r => r.id === mentorshipId);
    if (!mentorship || mentorship.status !== 'accepted') {
      throw new Error('Mentoria não está ativa');
    }

    const chat: MentorshipChat = {
      id: `chat_${Date.now()}`,
      mentorshipId,
      senderId,
      message,
      timestamp: Date.now(),
      type,
      isRead: false
    };

    this.chats.push(chat);
    return chat;
  }

  // Obter chat de uma mentoria
  public getMentorshipChat(mentorshipId: string): MentorshipChat[] {
    return this.chats
      .filter(chat => chat.mentorshipId === mentorshipId)
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  // Marcar mensagens como lidas
  public markMessagesAsRead(mentorshipId: string, userId: string): void {
    this.chats
      .filter(chat => chat.mentorshipId === mentorshipId && chat.senderId !== userId)
      .forEach(chat => chat.isRead = true);
  }

  // Obter solicitações de mentoria de um mentor
  public getMentorRequests(mentorId: string): MentorshipRequest[] {
    return this.mentorshipRequests.filter(r => r.mentorId === mentorId);
  }

  // Obter solicitações de mentoria de um mentee
  public getMenteeRequests(menteeId: string): MentorshipRequest[] {
    return this.mentorshipRequests.filter(r => r.menteeId === menteeId);
  }

  // Obter sessões de uma mentoria
  public getMentorshipSessions(mentorshipId: string): MentorshipSession[] {
    return this.mentorshipSessions
      .filter(s => s.mentorshipId === mentorshipId)
      .sort((a, b) => a.date - b.date);
  }

  // Obter plano de treino de uma mentoria
  public getMentorshipTrainingPlan(mentorshipId: string): TrainingPlan | undefined {
    return this.trainingPlans.find(p => p.mentorshipId === mentorshipId);
  }

  // Atualizar plano de treino
  public updateTrainingPlan(planId: string, updates: Partial<TrainingPlan>): TrainingPlan | null {
    const plan = this.trainingPlans.find(p => p.id === planId);
    if (!plan) return null;

    Object.assign(plan, updates);
    plan.updatedAt = Date.now();
    return plan;
  }

  // Avaliar sessão
  public rateSession(sessionId: string, rating: number, feedback?: string): MentorshipSession | null {
    const session = this.mentorshipSessions.find(s => s.id === sessionId);
    if (!session) return null;

    session.rating = Math.max(1, Math.min(5, rating));
    session.feedback = feedback;
    return session;
  }

  // Finalizar mentoria
  public completeMentorship(mentorshipId: string): MentorshipRequest | null {
    const request = this.mentorshipRequests.find(r => r.id === mentorshipId);
    if (!request) return null;

    request.status = 'completed';
    request.completedAt = Date.now();

    // Desativar plano de treino
    const plan = this.trainingPlans.find(p => p.mentorshipId === mentorshipId);
    if (plan) {
      plan.isActive = false;
    }

    return request;
  }

  // Obter estatísticas de um mentor
  public getMentorStats(mentorId: string): {
    totalMentees: number;
    averageRating: number;
    completedMentorships: number;
    activeMentorships: number;
  } {
    const mentorRequests = this.mentorshipRequests.filter(r => r.mentorId === mentorId);
    const completed = mentorRequests.filter(r => r.status === 'completed').length;
    const active = mentorRequests.filter(r => r.status === 'accepted').length;

    const sessions = this.mentorshipSessions.filter(s => 
      mentorRequests.some(r => r.id === s.mentorshipId)
    );
    const ratings = sessions.filter(s => s.rating).map(s => s.rating!);
    const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

    return {
      totalMentees: new Set(mentorRequests.map(r => r.menteeId)).size,
      averageRating: Math.round(averageRating * 10) / 10,
      completedMentorships: completed,
      activeMentorships: active
    };
  }

  // Obter estatísticas de um mentee
  public getMenteeStats(menteeId: string): {
    totalMentors: number;
    completedMentorships: number;
    activeMentorships: number;
    totalSessions: number;
  } {
    const menteeRequests = this.mentorshipRequests.filter(r => r.menteeId === menteeId);
    const completed = menteeRequests.filter(r => r.status === 'completed').length;
    const active = menteeRequests.filter(r => r.status === 'accepted').length;

    const sessions = this.mentorshipSessions.filter(s => 
      menteeRequests.some(r => r.id === s.mentorshipId)
    );

    return {
      totalMentors: new Set(menteeRequests.map(r => r.mentorId)).size,
      completedMentorships: completed,
      activeMentorships: active,
      totalSessions: sessions.length
    };
  }
}

export function createMentorshipManager(): MentorshipManager {
  return new MentorshipManager();
}