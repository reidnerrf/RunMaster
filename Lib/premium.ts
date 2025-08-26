export interface PremiumPlan {
  id: string;
  name: string;
  description: string;
  type: 'free' | 'trial' | 'monthly' | 'annual' | 'lifetime';
  price: number;
  currency: string;
  originalPrice?: number;
  discount?: number;
  duration: number; // dias
  features: PremiumFeature[];
  isPopular: boolean;
  isBestValue: boolean;
  isActive: boolean;
  maxUsers?: number;
  maxStorage?: number; // GB
  priority: number; // para ordenação
  createdAt: number;
  updatedAt: number;
}

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'advanced' | 'exclusive' | 'social' | 'analytics' | 'customization';
  isAvailable: boolean;
  isHighlighted: boolean;
  icon: string;
  details: string[];
  limitations?: {
    free: string;
    premium: string;
  };
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending' | 'trial';
  startDate: number;
  endDate: number;
  trialEndDate?: number;
  autoRenew: boolean;
  paymentMethod: string;
  lastPayment: number;
  nextPayment?: number;
  totalPayments: number;
  amount: number;
  currency: string;
  platform: 'ios' | 'android' | 'web' | 'stripe' | 'paypal';
  receiptData?: string;
  isTrial: boolean;
  trialDaysUsed: number;
  maxTrialDays: number;
  cancellationReason?: string;
  cancelledAt?: number;
  refundedAt?: number;
  refundAmount?: number;
  notes?: string;
}

export interface PremiumGate {
  featureId: string;
  isLocked: boolean;
  lockReason: string;
  upgradeMessage: string;
  trialAvailable: boolean;
  trialDaysLeft: number;
  planRequired: string;
  alternatives?: string[];
}

export interface PremiumAnalytics {
  totalSubscribers: number;
  activeSubscriptions: number;
  trialConversions: number;
  monthlyRevenue: number;
  annualRevenue: number;
  churnRate: number;
  averageLifetime: number;
  popularPlans: string[];
  conversionFunnel: {
    trialStarts: number;
    trialCompletions: number;
    subscriptions: number;
    renewals: number;
  };
}

export class PremiumManager {
  private plans: PremiumPlan[] = [];
  private features: PremiumFeature[] = [];
  private subscriptions: UserSubscription[] = [];
  private userTrials: Map<string, any> = new Map();

  constructor() {
    this.initializeFeatures();
    this.initializePlans();
  }

  private initializeFeatures() {
    const features: PremiumFeature[] = [
      // Features Core (Free)
      {
        id: 'feature_basic_tracking',
        name: 'Rastreamento Básico',
        description: 'Rastreie suas corridas com GPS básico',
        category: 'core',
        isAvailable: true,
        isHighlighted: false,
        icon: '📍',
        details: [
          'Rastreamento GPS básico',
          'Distância e tempo',
          'Histórico de 30 dias',
          'Estatísticas básicas'
        ],
        limitations: {
          free: 'Até 10 corridas por mês',
          premium: 'Corridas ilimitadas'
        }
      },

      {
        id: 'feature_basic_community',
        name: 'Comunidade Básica',
        description: 'Participe de comunidades e desafios básicos',
        category: 'social',
        isAvailable: true,
        isHighlighted: false,
        icon: '👥',
        details: [
          'Participar de comunidades',
          'Desafios básicos',
          'Rankings simples',
          'Chat básico'
        ],
        limitations: {
          free: '1 comunidade ativa',
          premium: 'Comunidades ilimitadas'
        }
      },

      // Features Avançadas (Premium)
      {
        id: 'feature_advanced_analytics',
        name: 'Análise Avançada',
        description: 'Análise detalhada de performance e progresso',
        category: 'analytics',
        isAvailable: false,
        isHighlighted: true,
        icon: '📊',
        details: [
          'Análise biomecânica avançada',
          'Predição de lesões',
          'Análise de tendências',
          'Relatórios personalizados',
          'Exportação de dados'
        ]
      },

      {
        id: 'feature_ai_coach',
        name: 'Coach Virtual IA',
        description: 'Coach personalizado com inteligência artificial',
        category: 'exclusive',
        isAvailable: false,
        isHighlighted: true,
        icon: '🤖',
        details: [
          'Planos de treino personalizados',
          'Recomendações nutricionais',
          'Análise de performance preditiva',
          'Comandos de voz',
          'Adaptação automática'
        ]
      },

      {
        id: 'feature_ar_navigation',
        name: 'Navegação AR',
        description: 'Navegação em realidade aumentada',
        category: 'exclusive',
        isAvailable: false,
        isHighlighted: true,
        icon: '🥽',
        details: [
          'Setas AR no mundo real',
          'Navegação turn-by-turn',
          'Elementos 3D interativos',
          'Calibração automática',
          'Rotas temáticas'
        ]
      },

      {
        id: 'feature_ghost_runs',
        name: 'Corridas Fantasma',
        description: 'Corra contra corredores famosos e recordes',
        category: 'exclusive',
        isAvailable: false,
        isHighlighted: true,
        icon: '👻',
        details: [
          'Ghost runs de atletas olímpicos',
          'Recordes mundiais',
          'Desafios históricos',
          'Rankings globais',
          'Conquistas exclusivas'
        ]
      },

      {
        id: 'feature_mentorship',
        name: 'Sistema de Mentoria',
        description: 'Conecte-se com mentores experientes',
        category: 'social',
        isAvailable: false,
        isHighlighted: true,
        icon: '🎓',
        details: [
          'Perfis de mentores verificados',
          'Planos de treino personalizados',
          'Sessões de mentoria',
          'Chat privado',
          'Feedback em tempo real'
        ]
      },

      {
        id: 'feature_biomechanics',
        name: 'Análise Biomecânica',
        description: 'Análise avançada usando apenas o smartphone',
        category: 'advanced',
        isAvailable: false,
        isHighlighted: true,
        icon: '🔬',
        details: [
          'Análise de cadência',
          'Detecção de assimetria',
          'Análise de impacto',
          'Recomendações personalizadas',
          'Relatórios detalhados'
        ]
      },

      {
        id: 'feature_events_integration',
        name: 'Integração com Eventos',
        description: 'Acesso completo a eventos locais e globais',
        category: 'social',
        isAvailable: false,
        isHighlighted: true,
        icon: '🎯',
        details: [
          'Eventos exclusivos',
          'Inscrições prioritárias',
          'Descontos especiais',
          'Meetups premium',
          'Networking exclusivo'
        ]
      },

      {
        id: 'feature_customization',
        name: 'Personalização Avançada',
        description: 'Personalize completamente sua experiência',
        category: 'customization',
        isAvailable: false,
        isHighlighted: false,
        icon: '🎨',
        details: [
          'Temas personalizados',
          'Widgets customizáveis',
          'Notificações avançadas',
          'Layout personalizado',
          'Atalhos personalizados'
        ]
      },

      {
        id: 'feature_priority_support',
        name: 'Suporte Prioritário',
        description: 'Suporte técnico prioritário 24/7',
        category: 'exclusive',
        isAvailable: false,
        isHighlighted: false,
        icon: '🎧',
        details: [
          'Suporte 24/7',
          'Resposta em até 2 horas',
          'Suporte por videochamada',
          'Atendimento personalizado',
          'Resolução garantida'
        ]
      }
    ];

    this.features.push(...features);
  }

  private initializePlans() {
    const plans: PremiumPlan[] = [
      // Plano Gratuito
      {
        id: 'plan_free',
        name: 'Gratuito',
        description: 'Acesso básico para começar sua jornada',
        type: 'free',
        price: 0,
        currency: 'BRL',
        duration: 0,
        features: [
          'feature_basic_tracking',
          'feature_basic_community'
        ],
        isPopular: false,
        isBestValue: false,
        isActive: true,
        priority: 1,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },

      // Plano Trial (7 dias)
      {
        id: 'plan_trial',
        name: 'Trial Premium',
        description: 'Experimente todas as funcionalidades premium por 7 dias',
        type: 'trial',
        price: 0,
        currency: 'BRL',
        duration: 7,
        features: [
          'feature_advanced_analytics',
          'feature_ai_coach',
          'feature_ar_navigation',
          'feature_ghost_runs',
          'feature_mentorship',
          'feature_biomechanics',
          'feature_events_integration',
          'feature_customization',
          'feature_priority_support'
        ],
        isPopular: false,
        isBestValue: false,
        isActive: true,
        priority: 2,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },

      // Plano Mensal
      {
        id: 'plan_monthly',
        name: 'Premium Mensal',
        description: 'Acesso completo a todas as funcionalidades premium',
        type: 'monthly',
        price: 19.90,
        currency: 'BRL',
        duration: 30,
        features: [
          'feature_advanced_analytics',
          'feature_ai_coach',
          'feature_ar_navigation',
          'feature_ghost_runs',
          'feature_mentorship',
          'feature_biomechanics',
          'feature_events_integration',
          'feature_customization',
          'feature_priority_support'
        ],
        isPopular: false,
        isBestValue: false,
        isActive: true,
        priority: 3,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },

      // Plano Anual (Melhor Valor)
      {
        id: 'plan_annual',
        name: 'Premium Anual',
        description: 'Melhor valor com 40% de desconto',
        type: 'annual',
        price: 119.90,
        currency: 'BRL',
        originalPrice: 238.80,
        discount: 40,
        duration: 365,
        features: [
          'feature_advanced_analytics',
          'feature_ai_coach',
          'feature_ar_navigation',
          'feature_ghost_runs',
          'feature_mentorship',
          'feature_biomechanics',
          'feature_events_integration',
          'feature_customization',
          'feature_priority_support'
        ],
        isPopular: true,
        isBestValue: true,
        isActive: true,
        priority: 4,
        createdAt: Date.now(),
        updatedAt: Date.now()
      },

      // Plano Lifetime
      {
        id: 'plan_lifetime',
        name: 'Premium Vitalício',
        description: 'Acesso permanente a todas as funcionalidades',
        type: 'lifetime',
        price: 499.90,
        currency: 'BRL',
        duration: 36500, // 100 anos
        features: [
          'feature_advanced_analytics',
          'feature_ai_coach',
          'feature_ar_navigation',
          'feature_ghost_runs',
          'feature_mentorship',
          'feature_biomechanics',
          'feature_events_integration',
          'feature_customization',
          'feature_priority_support'
        ],
        isPopular: false,
        isBestValue: false,
        isActive: true,
        priority: 5,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    ];

    this.plans.push(...plans);
  }

  // Obter planos disponíveis
  public getAvailablePlans(): PremiumPlan[] {
    return this.plans
      .filter(plan => plan.isActive)
      .sort((a, b) => a.priority - b.priority);
  }

  // Obter plano por ID
  public getPlanById(planId: string): PremiumPlan | undefined {
    return this.plans.find(plan => plan.id === planId);
  }

  // Obter plano gratuito
  public getFreePlan(): PremiumPlan | undefined {
    return this.plans.find(plan => plan.type === 'free');
  }

  // Obter plano trial
  public getTrialPlan(): PremiumPlan | undefined {
    return this.plans.find(plan => plan.type === 'trial');
  }

  // Obter plano mais popular
  public getPopularPlan(): PremiumPlan | undefined {
    return this.plans.find(plan => plan.isPopular);
  }

  // Obter plano com melhor valor
  public getBestValuePlan(): PremiumPlan | undefined {
    return this.plans.find(plan => plan.isBestValue);
  }

  // Obter features disponíveis
  public getAvailableFeatures(): PremiumFeature[] {
    return this.features.filter(feature => feature.isAvailable);
  }

  // Obter feature por ID
  public getFeatureById(featureId: string): PremiumFeature | undefined {
    return this.features.find(feature => feature.id === featureId);
  }

  // Obter features premium
  public getPremiumFeatures(): PremiumFeature[] {
    return this.features.filter(feature => !feature.isAvailable);
  }

  // Obter features destacadas
  public getHighlightedFeatures(): PremiumFeature[] {
    return this.features.filter(feature => feature.isHighlighted);
  }

  // Verificar se usuário tem acesso a uma feature
  public hasFeatureAccess(userId: string, featureId: string): boolean {
    const subscription = this.getActiveSubscription(userId);
    if (!subscription) return false;

    const plan = this.getPlanById(subscription.planId);
    if (!plan) return false;

    return plan.features.includes(featureId);
  }

  // Verificar se feature está bloqueada
  public isFeatureLocked(userId: string, featureId: string): PremiumGate {
    const hasAccess = this.hasFeatureAccess(userId, featureId);
    const subscription = this.getActiveSubscription(userId);
    const trial = this.getUserTrial(userId);

    if (hasAccess) {
      return {
        featureId,
        isLocked: false,
        lockReason: '',
        upgradeMessage: '',
        trialAvailable: false,
        trialDaysLeft: 0,
        planRequired: '',
        alternatives: []
      };
    }

    const feature = this.getFeatureById(featureId);
    const trialPlan = this.getTrialPlan();
    const bestValuePlan = this.getBestValuePlan();

    let lockReason = 'Funcionalidade premium';
    let upgradeMessage = 'Atualize para Premium para acessar esta funcionalidade';
    let planRequired = 'Premium';
    let alternatives: string[] = [];

    if (trial && trial.isActive && trialPlan) {
      lockReason = 'Trial expirado';
      upgradeMessage = 'Seu trial expirou. Atualize para continuar usando';
      planRequired = 'Premium';
    } else if (!trial && trialPlan) {
      lockReason = 'Funcionalidade premium';
      upgradeMessage = 'Experimente gratuitamente por 7 dias';
      planRequired = 'Trial';
      alternatives = ['Trial gratuito', 'Premium mensal', 'Premium anual'];
    } else {
      alternatives = ['Premium mensal', 'Premium anual', 'Premium vitalício'];
    }

    return {
      featureId,
      isLocked: true,
      lockReason,
      upgradeMessage,
      trialAvailable: !trial || !trial.isActive,
      trialDaysLeft: trial ? Math.max(0, trial.daysLeft) : 7,
      planRequired,
      alternatives
    };
  }

  // Iniciar trial para usuário
  public startTrial(userId: string): UserSubscription | null {
    const existingTrial = this.getUserTrial(userId);
    if (existingTrial && existingTrial.isActive) {
      throw new Error('Usuário já possui trial ativo');
    }

    const trialPlan = this.getTrialPlan();
    if (!trialPlan) {
      throw new Error('Plano trial não disponível');
    }

    const now = Date.now();
    const trialEndDate = now + (trialPlan.duration * 24 * 60 * 60 * 1000);

    const subscription: UserSubscription = {
      id: `trial_${userId}_${Date.now()}`,
      userId,
      planId: trialPlan.id,
      status: 'trial',
      startDate: now,
      endDate: trialEndDate,
      trialEndDate,
      autoRenew: false,
      paymentMethod: 'trial',
      lastPayment: now,
      totalPayments: 0,
      amount: 0,
      currency: trialPlan.currency,
      platform: 'web',
      isTrial: true,
      trialDaysUsed: 0,
      maxTrialDays: trialPlan.duration
    };

    this.subscriptions.push(subscription);
    return subscription;
  }

  // Ativar assinatura premium
  public activateSubscription(
    userId: string,
    planId: string,
    paymentMethod: string,
    platform: 'ios' | 'android' | 'web' | 'stripe' | 'paypal',
    receiptData?: string
  ): UserSubscription | null {
    const plan = this.getPlanById(planId);
    if (!plan || plan.type === 'free') {
      throw new Error('Plano inválido');
    }

    // Cancelar trial se existir
    this.cancelTrial(userId);

    const now = Date.now();
    const endDate = now + (plan.duration * 24 * 60 * 60 * 1000);

    const subscription: UserSubscription = {
      id: `sub_${userId}_${Date.now()}`,
      userId,
      planId,
      status: 'active',
      startDate: now,
      endDate,
      autoRenew: true,
      paymentMethod,
      lastPayment: now,
      nextPayment: plan.type === 'monthly' || plan.type === 'annual' ? endDate : undefined,
      totalPayments: 1,
      amount: plan.price,
      currency: plan.currency,
      platform,
      receiptData,
      isTrial: false,
      trialDaysUsed: 0,
      maxTrialDays: 0
    };

    this.subscriptions.push(subscription);
    return subscription;
  }

  // Renovar assinatura
  public renewSubscription(subscriptionId: string): boolean {
    const subscription = this.subscriptions.find(s => s.id === subscriptionId);
    if (!subscription || subscription.status !== 'active') return false;

    const plan = this.getPlanById(subscription.planId);
    if (!plan || plan.type === 'lifetime') return false;

    const now = Date.now();
    const newEndDate = subscription.endDate + (plan.duration * 24 * 60 * 60 * 1000);

    subscription.endDate = newEndDate;
    subscription.lastPayment = now;
    subscription.totalPayments++;
    subscription.nextPayment = newEndDate;

    return true;
  }

  // Cancelar assinatura
  public cancelSubscription(subscriptionId: string, reason?: string): boolean {
    const subscription = this.subscriptions.find(s => s.id === subscriptionId);
    if (!subscription) return false;

    subscription.status = 'cancelled';
    subscription.autoRenew = false;
    subscription.cancellationReason = reason;
    subscription.cancelledAt = Date.now();

    return true;
  }

  // Cancelar trial
  public cancelTrial(userId: string): boolean {
    const trial = this.subscriptions.find(s => 
      s.userId === userId && s.status === 'trial'
    );

    if (!trial) return false;

    trial.status = 'expired';
    return true;
  }

  // Obter assinatura ativa do usuário
  public getActiveSubscription(userId: string): UserSubscription | undefined {
    const now = Date.now();
    return this.subscriptions.find(s => 
      s.userId === userId && 
      s.status === 'active' && 
      s.endDate > now
    );
  }

  // Obter trial do usuário
  public getUserTrial(userId: string): UserSubscription | undefined {
    return this.subscriptions.find(s => 
      s.userId === userId && s.status === 'trial'
    );
  }

  // Verificar se usuário está em trial
  public isUserInTrial(userId: string): boolean {
    const trial = this.getUserTrial(userId);
    if (!trial) return false;

    const now = Date.now();
    return trial.endDate > now;
  }

  // Verificar se usuário é premium
  public isUserPremium(userId: string): boolean {
    const subscription = this.getActiveSubscription(userId);
    return !!subscription;
  }

  // Obter status da assinatura do usuário
  public getUserSubscriptionStatus(userId: string): {
    isPremium: boolean;
    isTrial: boolean;
    planType: string;
    daysLeft: number;
    trialDaysLeft: number;
    canUpgrade: boolean;
    upgradeOptions: PremiumPlan[];
  } {
    const subscription = this.getActiveSubscription(userId);
    const trial = this.getUserTrial(userId);
    const now = Date.now();

    const isPremium = !!subscription;
    const isTrial = trial && trial.endDate > now;

    let planType = 'free';
    let daysLeft = 0;
    let trialDaysLeft = 0;

    if (subscription) {
      planType = subscription.planId;
      daysLeft = Math.max(0, Math.ceil((subscription.endDate - now) / (24 * 60 * 60 * 1000)));
    }

    if (trial) {
      trialDaysLeft = Math.max(0, Math.ceil((trial.endDate - now) / (24 * 60 * 60 * 1000)));
    }

    const canUpgrade = !isPremium || (subscription && subscription.planId !== 'plan_lifetime');
    const upgradeOptions = this.plans
      .filter(plan => plan.type !== 'free' && plan.type !== 'trial')
      .sort((a, b) => a.priority - b.priority);

    return {
      isPremium,
      isTrial,
      planType,
      daysLeft,
      trialDaysLeft,
      canUpgrade,
      upgradeOptions
    };
  }

  // Obter estatísticas premium
  public getPremiumAnalytics(): PremiumAnalytics {
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    const oneYearAgo = now - (365 * 24 * 60 * 60 * 1000);

    const activeSubscriptions = this.subscriptions.filter(s => 
      s.status === 'active' && s.endDate > now
    );

    const trialSubscriptions = this.subscriptions.filter(s => 
      s.status === 'trial' && s.endDate > now
    );

    const expiredTrials = this.subscriptions.filter(s => 
      s.status === 'trial' && s.endDate <= now
    );

    const convertedTrials = this.subscriptions.filter(s => 
      s.status === 'active' && s.isTrial === false && s.trialDaysUsed > 0
    );

    const monthlyRevenue = activeSubscriptions
      .filter(s => s.startDate >= thirtyDaysAgo)
      .reduce((sum, s) => sum + s.amount, 0);

    const annualRevenue = activeSubscriptions
      .filter(s => s.startDate >= oneYearAgo)
      .reduce((sum, s) => sum + s.amount, 0);

    const trialConversions = expiredTrials.length > 0 ? 
      (convertedTrials.length / expiredTrials.length) * 100 : 0;

    const churnRate = this.calculateChurnRate();
    const averageLifetime = this.calculateAverageLifetime();

    const planCounts = this.plans
      .filter(plan => plan.type !== 'free')
      .map(plan => ({
        planId: plan.id,
        count: activeSubscriptions.filter(s => s.planId === plan.id).length
      }))
      .sort((a, b) => b.count - a.count);

    const popularPlans = planCounts.slice(0, 3).map(p => p.planId);

    return {
      totalSubscribers: activeSubscriptions.length,
      activeSubscriptions: activeSubscriptions.length,
      trialConversions: Math.round(trialConversions * 100) / 100,
      monthlyRevenue,
      annualRevenue,
      churnRate,
      averageLifetime,
      popularPlans,
      conversionFunnel: {
        trialStarts: trialSubscriptions.length,
        trialCompletions: expiredTrials.length,
        subscriptions: activeSubscriptions.length,
        renewals: activeSubscriptions.filter(s => s.totalPayments > 1).length
      }
    };
  }

  // Calcular taxa de churn
  private calculateChurnRate(): number {
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);

    const activeThirtyDaysAgo = this.subscriptions.filter(s => 
      s.status === 'active' && s.startDate < thirtyDaysAgo && s.endDate > thirtyDaysAgo
    );

    const cancelledThisMonth = this.subscriptions.filter(s => 
      s.status === 'cancelled' && s.cancelledAt && s.cancelledAt >= thirtyDaysAgo
    );

    if (activeThirtyDaysAgo.length === 0) return 0;

    return (cancelledThisMonth.length / activeThirtyDaysAgo.length) * 100;
  }

  // Calcular tempo médio de vida
  private calculateAverageLifetime(): number {
    const cancelledSubscriptions = this.subscriptions.filter(s => 
      s.status === 'cancelled' && s.cancelledAt
    );

    if (cancelledSubscriptions.length === 0) return 0;

    const totalLifetime = cancelledSubscriptions.reduce((sum, s) => {
      const lifetime = s.cancelledAt! - s.startDate;
      return sum + lifetime;
    }, 0);

    return Math.round(totalLifetime / cancelledSubscriptions.length / (24 * 60 * 60 * 1000)); // dias
  }

  // Obter assinaturas do usuário
  public getUserSubscriptions(userId: string): UserSubscription[] {
    return this.subscriptions
      .filter(s => s.userId === userId)
      .sort((a, b) => b.startDate - a.startDate);
  }

  // Obter todas as assinaturas
  public getAllSubscriptions(): UserSubscription[] {
    return this.subscriptions.sort((a, b) => b.startDate - a.startDate);
  }

  // Atualizar assinatura
  public updateSubscription(
    subscriptionId: string,
    updates: Partial<UserSubscription>
  ): UserSubscription | null {
    const subscription = this.subscriptions.find(s => s.id === subscriptionId);
    if (!subscription) return null;

    Object.assign(subscription, updates);
    return subscription;
  }

  // Processar pagamento
  public processPayment(
    subscriptionId: string,
    amount: number,
    currency: string,
    platform: string
  ): boolean {
    const subscription = this.subscriptions.find(s => s.id === subscriptionId);
    if (!subscription) return false;

    subscription.lastPayment = Date.now();
    subscription.totalPayments++;
    subscription.amount = amount;
    subscription.currency = currency;
    subscription.platform = platform as any;

    return true;
  }

  // Verificar assinaturas expiradas
  public checkExpiredSubscriptions(): UserSubscription[] {
    const now = Date.now();
    const expired = this.subscriptions.filter(s => 
      s.status === 'active' && s.endDate <= now
    );

    expired.forEach(s => {
      s.status = 'expired';
    });

    return expired;
  }

  // Limpar dados antigos
  public cleanupOldData(daysToKeep: number = 365): number {
    const cutoffDate = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    const initialCount = this.subscriptions.length;

    this.subscriptions = this.subscriptions.filter(s => 
      s.startDate >= cutoffDate || s.status === 'active'
    );

    return initialCount - this.subscriptions.length;
  }
}

export function createPremiumManager(): PremiumManager {
  return new PremiumManager();
}