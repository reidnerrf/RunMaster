export interface MentorProfile {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  bio: string;
  specialties: string[];
  experience: {
    years: number;
    certifications: string[];
    achievements: string[];
    completedRaces: {
      distance: string;
      count: number;
      bestTime?: string;
    }[];
  };
  pricing: {
    hourlyRate: number;
    packageRates: {
      name: string;
      sessions: number;
      price: number;
      discount: number;
    }[];
    subscriptionPlans: {
      name: string;
      price: number;
      sessionsPerMonth: number;
      features: string[];
    }[];
  };
  availability: {
    days: string[];
    timeSlots: string[];
    timezone: string;
    maxMentees: number;
    currentMentees: number;
  };
  rating: number;
  totalReviews: number;
  totalEarnings: number;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  verificationDocuments: string[];
  applicationDate: number;
  approvalDate?: number;
  rejectionReason?: string;
  subscriptionStatus: 'active' | 'inactive' | 'expired';
  subscriptionEndDate?: number;
}

export interface MentorshipSubscription {
  id: string;
  mentorId: string;
  planName: string;
  price: number;
  sessionsPerMonth: number;
  startDate: number;
  endDate: number;
  status: 'active' | 'cancelled' | 'expired';
  paymentMethod: string;
  autoRenew: boolean;
  nextBillingDate: number;
}

export interface MentorshipSession {
  id: string;
  mentorId: string;
  menteeId: string;
  type: 'consultation' | 'training_plan' | 'progress_review' | 'race_preparation';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: number;
  duration: number; // minutos
  price: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  meetingLink?: string;
  notes?: string;
  feedback?: {
    rating: number;
    comment: string;
    date: number;
  };
  recordingUrl?: string;
  materials?: string[];
}

export interface MentorshipPayment {
  id: string;
  sessionId?: string;
  subscriptionId?: string;
  mentorId: string;
  menteeId: string;
  amount: number;
  currency: string;
  type: 'session' | 'subscription' | 'package';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
  createdAt: number;
  completedAt?: number;
  platformFee: number;
  mentorEarnings: number;
}

export interface MentorshipManager {
  mentors: MentorProfile[];
  subscriptions: MentorshipSubscription[];
  sessions: MentorshipSession[];
  payments: MentorshipPayment[];
}

export class MentorshipManager {
  private mentors: MentorProfile[] = [];
  private subscriptions: MentorshipSubscription[] = [];
  private sessions: MentorshipSession[] = [];
  private payments: MentorshipPayment[] = [];

  constructor() {
    this.initializeMentorshipData();
  }

  private initializeMentorshipData() {
    // Mentor de exemplo aprovado
    const approvedMentor: MentorProfile = {
      id: 'mentor_1',
      userId: 'user_mentor_1',
      name: 'Carlos Silva',
      avatar: 'https://example.com/carlos.jpg',
      bio: 'Coach de corrida certificado com 15 anos de experiência. Especialista em maratonas e ultra-maratona.',
      specialties: ['marathon', 'ultra_marathon', 'endurance', 'trail_running'],
      experience: {
        years: 15,
        certifications: ['USATF Level 2', 'RRCA Certified Coach', 'Sports Nutrition Specialist'],
        achievements: ['Boston Qualifier 5x', 'Ultra Trail du Mont-Blanc finisher', 'Coach of the Year 2022'],
        completedRaces: [
          { distance: 'Maratona', count: 25, bestTime: '2:45:30' },
          { distance: 'Ultra 100km', count: 8, bestTime: '8:15:00' },
          { distance: 'Trail 50km', count: 15, bestTime: '4:20:00' }
        ]
      },
      pricing: {
        hourlyRate: 150,
        packageRates: [
          { name: 'Pacote Básico', sessions: 4, price: 500, discount: 17 },
          { name: 'Pacote Premium', sessions: 8, price: 900, discount: 25 },
          { name: 'Pacote Elite', sessions: 12, price: 1200, discount: 33 }
        ],
        subscriptionPlans: [
          { name: 'Mensal', price: 300, sessionsPerMonth: 2, features: ['Planos personalizados', 'Suporte por email'] },
          { name: 'Trimestral', price: 800, sessionsPerMonth: 3, features: ['Planos personalizados', 'Suporte prioritário', 'Análise de progresso'] },
          { name: 'Anual', price: 2800, sessionsPerMonth: 4, features: ['Planos personalizados', 'Suporte 24/7', 'Análise avançada', 'Acesso a grupo exclusivo'] }
        ]
      },
      availability: {
        days: ['monday', 'wednesday', 'friday', 'saturday'],
        timeSlots: ['08:00', '10:00', '14:00', '16:00'],
        timezone: 'America/Sao_Paulo',
        maxMentees: 10,
        currentMentees: 6
      },
      rating: 4.9,
      totalReviews: 47,
      totalEarnings: 12500,
      status: 'approved',
      verificationDocuments: ['certificate_1.pdf', 'id_document.pdf', 'background_check.pdf'],
      applicationDate: Date.now() - 86400000 * 30, // 30 dias atrás
      approvalDate: Date.now() - 86400000 * 25, // 25 dias atrás
      subscriptionStatus: 'active',
      subscriptionEndDate: Date.now() + 86400000 * 335 // 335 dias restantes
    };

    // Mentor pendente de aprovação
    const pendingMentor: MentorProfile = {
      id: 'mentor_2',
      userId: 'user_mentor_2',
      name: 'Ana Costa',
      avatar: 'https://example.com/ana.jpg',
      bio: 'Corredora amadora que se tornou profissional. Especialista em corridas de 5K e 10K para iniciantes.',
      specialties: ['5k', '10k', 'beginner_training', 'weight_loss'],
      experience: {
        years: 8,
        certifications: ['Personal Trainer', 'Nutrition Coach'],
        achievements: ['5K em 18:30', '10K em 38:45', 'Transformou 50+ vidas'],
        completedRaces: [
          { distance: '5K', count: 50, bestTime: '18:30' },
          { distance: '10K', count: 30, bestTime: '38:45' },
          { distance: 'Meia Maratona', count: 15, bestTime: '1:25:00' }
        ]
      },
      pricing: {
        hourlyRate: 80,
        packageRates: [
          { name: 'Pacote Iniciante', sessions: 3, price: 200, discount: 17 },
          { name: 'Pacote Progressivo', sessions: 6, price: 350, discount: 27 }
        ],
        subscriptionPlans: [
          { name: 'Mensal', price: 150, sessionsPerMonth: 2, features: ['Planos básicos', 'Suporte por email'] },
          { name: 'Trimestral', price: 400, sessionsPerMonth: 3, features: ['Planos personalizados', 'Suporte por WhatsApp'] }
        ]
      },
      availability: {
        days: ['tuesday', 'thursday', 'saturday'],
        timeSlots: ['09:00', '11:00', '15:00'],
        timezone: 'America/Sao_Paulo',
        maxMentees: 8,
        currentMentees: 0
      },
      rating: 0,
      totalReviews: 0,
      totalEarnings: 0,
      status: 'pending',
      verificationDocuments: ['certificate_2.pdf', 'id_document.pdf'],
      applicationDate: Date.now() - 86400000 * 5, // 5 dias atrás
      subscriptionStatus: 'inactive'
    };

    this.mentors.push(approvedMentor, pendingMentor);
  }

  // Aplicar para ser mentor
  public applyForMentorship(application: Omit<MentorProfile, 'id' | 'status' | 'applicationDate' | 'rating' | 'totalReviews' | 'totalEarnings'>): MentorProfile | null {
    // Verificar se já é mentor
    const existingMentor = this.mentors.find(m => m.userId === application.userId);
    if (existingMentor) {
      return null; // Já é mentor
    }

    const newMentor: MentorProfile = {
      ...application,
      id: `mentor_${Date.now()}`,
      status: 'pending',
      applicationDate: Date.now(),
      rating: 0,
      totalReviews: 0,
      totalEarnings: 0,
      subscriptionStatus: 'inactive'
    };

    this.mentors.push(newMentor);
    return newMentor;
  }

  // Aprovar/rejeitar mentor (admin)
  public reviewMentorApplication(mentorId: string, decision: 'approved' | 'rejected', reason?: string): boolean {
    const mentor = this.mentors.find(m => m.id === mentorId);
    if (!mentor || mentor.status !== 'pending') return false;

    mentor.status = decision;
    
    if (decision === 'approved') {
      mentor.approvalDate = Date.now();
      mentor.subscriptionStatus = 'active';
      mentor.subscriptionEndDate = Date.now() + 86400000 * 365; // 1 ano
    } else {
      mentor.rejectionReason = reason;
    }

    return true;
  }

  // Assinar plano de mentoria
  public subscribeToMentor(
    mentorId: string,
    menteeId: string,
    planName: string,
    paymentMethod: string
  ): MentorshipSubscription | null {
    const mentor = this.mentors.find(m => m.id === mentorId);
    if (!mentor || mentor.status !== 'approved') return null;

    const plan = mentor.pricing.subscriptionPlans.find(p => p.name === planName);
    if (!plan) return null;

    // Verificar disponibilidade
    if (mentor.availability.currentMentees >= mentor.availability.maxMentees) {
      return null; // Mentor lotado
    }

    const subscription: MentorshipSubscription = {
      id: `sub_${Date.now()}`,
      mentorId,
      planName,
      price: plan.price,
      sessionsPerMonth: plan.sessionsPerMonth,
      startDate: Date.now(),
      endDate: Date.now() + 86400000 * 30, // 1 mês
      status: 'active',
      paymentMethod,
      autoRenew: true,
      nextBillingDate: Date.now() + 86400000 * 30
    };

    this.subscriptions.push(subscription);

    // Incrementar contador de mentees
    mentor.availability.currentMentees++;

    // Processar pagamento
    this.processSubscriptionPayment(subscription, menteeId);

    return subscription;
  }

  // Agendar sessão
  public scheduleSession(
    mentorId: string,
    menteeId: string,
    type: string,
    scheduledDate: number,
    duration: number,
    paymentMethod: string
  ): MentorshipSession | null {
    const mentor = this.mentors.find(m => m.id === mentorId);
    if (!mentor || mentor.status !== 'approved') return null;

    // Verificar disponibilidade do mentor
    const mentorSessions = this.sessions.filter(s => 
      s.mentorId === mentorId && 
      s.status === 'scheduled' &&
      Math.abs(s.scheduledDate - scheduledDate) < duration * 60000 // Verificar conflito de horário
    );

    if (mentorSessions.length > 0) {
      return null; // Horário não disponível
    }

    const session: MentorshipSession = {
      id: `session_${Date.now()}`,
      mentorId,
      menteeId,
      type: type as any,
      status: 'scheduled',
      scheduledDate,
      duration,
      price: mentor.pricing.hourlyRate * (duration / 60),
      paymentStatus: 'pending'
    };

    this.sessions.push(session);

    // Processar pagamento
    this.processSessionPayment(session, paymentMethod);

    return session;
  }

  // Processar pagamento de sessão
  private processSessionPayment(session: MentorshipSession, paymentMethod: string): void {
    const platformFee = session.price * 0.15; // 15% de taxa da plataforma
    const mentorEarnings = session.price - platformFee;

    const payment: MentorshipPayment = {
      id: `payment_${Date.now()}`,
      sessionId: session.id,
      mentorId: session.mentorId,
      menteeId: session.menteeId,
      amount: session.price,
      currency: 'BRL',
      type: 'session',
      status: 'pending',
      paymentMethod,
      transactionId: `txn_${Date.now()}`,
      createdAt: Date.now(),
      platformFee,
      mentorEarnings
    };

    this.payments.push(payment);

    // Simular processamento de pagamento
    setTimeout(() => {
      payment.status = 'completed';
      payment.completedAt = Date.now();
      session.paymentStatus = 'paid';

      // Atualizar ganhos do mentor
      const mentor = this.mentors.find(m => m.id === session.mentorId);
      if (mentor) {
        mentor.totalEarnings += mentorEarnings;
      }
    }, 2000);
  }

  // Processar pagamento de assinatura
  private processSubscriptionPayment(subscription: MentorshipSubscription, menteeId: string): void {
    const platformFee = subscription.price * 0.20; // 20% de taxa da plataforma
    const mentorEarnings = subscription.price - platformFee;

    const payment: MentorshipPayment = {
      id: `payment_${Date.now()}`,
      subscriptionId: subscription.id,
      mentorId: subscription.mentorId,
      menteeId,
      amount: subscription.price,
      currency: 'BRL',
      type: 'subscription',
      status: 'pending',
      paymentMethod: subscription.paymentMethod,
      transactionId: `txn_${Date.now()}`,
      createdAt: Date.now(),
      platformFee,
      mentorEarnings
    };

    this.payments.push(payment);

    // Simular processamento de pagamento
    setTimeout(() => {
      payment.status = 'completed';
      payment.completedAt = Date.now();

      // Atualizar ganhos do mentor
      const mentor = this.mentors.find(m => m.id === subscription.mentorId);
      if (mentor) {
        mentor.totalEarnings += mentorEarnings;
      }
    }, 2000);
  }

  // Obter mentores disponíveis
  public getAvailableMentors(specialty?: string): MentorProfile[] {
    return this.mentors.filter(mentor => 
      mentor.status === 'approved' &&
      mentor.subscriptionStatus === 'active' &&
      mentor.availability.currentMentees < mentor.availability.maxMentees &&
      (!specialty || mentor.specialties.includes(specialty))
    );
  }

  // Obter mentor por ID
  public getMentorById(mentorId: string): MentorProfile | undefined {
    return this.mentors.find(m => m.id === mentorId);
  }

  // Obter sessões de um usuário
  public getUserSessions(userId: string, role: 'mentor' | 'mentee'): MentorshipSession[] {
    const filterField = role === 'mentor' ? 'mentorId' : 'menteeId';
    return this.sessions.filter(s => s[filterField] === userId);
  }

  // Obter assinaturas de um usuário
  public getUserSubscriptions(userId: string, role: 'mentor' | 'mentee'): MentorshipSubscription[] {
    const filterField = role === 'mentor' ? 'mentorId' : 'menteeId';
    return this.subscriptions.filter(s => s[filterField] === userId);
  }

  // Obter pagamentos de um usuário
  public getUserPayments(userId: string, role: 'mentor' | 'mentee'): MentorshipPayment[] {
    const filterField = role === 'mentor' ? 'mentorId' : 'menteeId';
    return this.payments.filter(p => p[filterField] === userId);
  }

  // Cancelar assinatura
  public cancelSubscription(subscriptionId: string): boolean {
    const subscription = this.subscriptions.find(s => s.id === subscriptionId);
    if (!subscription || subscription.status !== 'active') return false;

    subscription.status = 'cancelled';
    subscription.autoRenew = false;

    // Decrementar contador de mentees do mentor
    const mentor = this.mentors.find(m => m.id === subscription.mentorId);
    if (mentor) {
      mentor.availability.currentMentees = Math.max(0, mentor.availability.currentMentees - 1);
    }

    return true;
  }

  // Renovar assinatura
  public renewSubscription(subscriptionId: string): boolean {
    const subscription = this.subscriptions.find(s => s.id === subscriptionId);
    if (!subscription || subscription.status !== 'active') return false;

    subscription.endDate = Date.now() + 86400000 * 30; // +1 mês
    subscription.nextBillingDate = subscription.endDate;

    // Processar novo pagamento
    this.processSubscriptionPayment(subscription, subscription.menteeId || 'unknown');

    return true;
  }

  // Obter estatísticas de mentoria
  public getMentorshipStats(): {
    totalMentors: number;
    approvedMentors: number;
    pendingMentors: number;
    totalSessions: number;
    totalSubscriptions: number;
    totalRevenue: number;
    averageMentorRating: number;
  } {
    const totalMentors = this.mentors.length;
    const approvedMentors = this.mentors.filter(m => m.status === 'approved').length;
    const pendingMentors = this.mentors.filter(m => m.status === 'pending').length;
    const totalSessions = this.sessions.length;
    const totalSubscriptions = this.subscriptions.filter(s => s.status === 'active').length;
    
    const totalRevenue = this.payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const approvedMentorsWithRating = this.mentors.filter(m => m.status === 'approved' && m.rating > 0);
    const averageMentorRating = approvedMentorsWithRating.length > 0 ?
      approvedMentorsWithRating.reduce((sum, m) => sum + m.rating, 0) / approvedMentorsWithRating.length : 0;

    return {
      totalMentors,
      approvedMentors,
      pendingMentors,
      totalSessions,
      totalSubscriptions,
      totalRevenue,
      averageMentorRating: Math.round(averageMentorRating * 100) / 100
    };
  }

  // Buscar mentores por critérios
  public searchMentors(criteria: {
    specialty?: string;
    maxPrice?: number;
    minRating?: number;
    availability?: string[];
    experience?: number;
  }): MentorProfile[] {
    let filteredMentors = this.mentors.filter(m => m.status === 'approved');

    if (criteria.specialty) {
      filteredMentors = filteredMentors.filter(m => 
        m.specialties.includes(criteria.specialty!)
      );
    }

    if (criteria.maxPrice) {
      filteredMentors = filteredMentors.filter(m => 
        m.pricing.hourlyRate <= criteria.maxPrice!
      );
    }

    if (criteria.minRating) {
      filteredMentors = filteredMentors.filter(m => 
        m.rating >= criteria.minRating!
      );
    }

    if (criteria.availability && criteria.availability.length > 0) {
      filteredMentors = filteredMentors.filter(m => 
        criteria.availability!.some(day => m.availability.days.includes(day))
      );
    }

    if (criteria.experience) {
      filteredMentors = filteredMentors.filter(m => 
        m.experience.years >= criteria.experience!
      );
    }

    return filteredMentors.sort((a, b) => b.rating - a.rating);
  }
}

export function createMentorshipManager(): MentorshipManager {
  return new MentorshipManager();
}