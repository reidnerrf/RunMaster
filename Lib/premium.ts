export interface PremiumPlan {
  id: string;
  name: string;
  description: string;
  type: 'free' | 'premium_monthly' | 'premium_annual' | 'premium_lifetime';
  price: {
    amount: number;
    currency: string;
    originalAmount?: number;
    discountPercentage?: number;
    billingCycle: 'monthly' | 'annual' | 'lifetime';
    trialDays: number;
  };
  features: {
    basic: string[];
    premium: string[];
    exclusive: string[];
    limitations: {
      free: string[];
      premium: string[];
    };
  };
  benefits: {
    immediate: string[];
    longTerm: string[];
    exclusive: string[];
  };
  restrictions: {
    free: string[];
    premium: string[];
  };
  isPopular: boolean;
  isBestValue: boolean;
  isActive: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial' | 'past_due' | 'unpaid';
  startDate: number;
  endDate: number;
  trialEndDate?: number;
  nextBillingDate?: number;
  autoRenew: boolean;
  paymentMethod: {
    type: 'credit_card' | 'debit_card' | 'paypal' | 'apple_pay' | 'google_pay';
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
  };
  billingHistory: BillingEvent[];
  features: string[];
  usage: {
    currentPeriod: {
      start: number;
      end: number;
      usage: { [key: string]: number };
      limits: { [key: string]: number };
    };
    totalUsage: { [key: string]: number };
  };
  metadata: {
    source: 'app' | 'website' | 'promo' | 'referral';
    campaign?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
}

export interface BillingEvent {
  id: string;
  subscriptionId: string;
  type: 'subscription_start' | 'renewal' | 'trial_start' | 'trial_end' | 'cancellation' | 'refund' | 'charge_failed';
  amount: number;
  currency: string;
  date: number;
  description: string;
  status: 'success' | 'failed' | 'pending' | 'refunded';
  receiptUrl?: string;
  errorMessage?: string;
}

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'advanced' | 'exclusive' | 'social' | 'analytics' | 'training' | 'safety' | 'wellness';
  access: 'free' | 'premium' | 'premium_plus';
  limitations: {
    free: {
      count?: number;
      duration?: number;
      features?: string[];
      restrictions?: string[];
    };
    premium: {
      count?: number;
      duration?: number;
      features?: string[];
      restrictions?: string[];
    };
  };
  isPopular: boolean;
  isEssential: boolean;
  upgradePrompt: string;
}

export interface PremiumManager {
  plans: PremiumPlan[];
  features: PremiumFeature[];
  subscriptions: Subscription[];
  userFeatures: Map<string, string[]>;
  trialUsers: Map<string, number>;
}

export class PremiumManager {
  private plans: PremiumPlan[] = [];
  private features: PremiumFeature[] = [];
  private subscriptions: Subscription[] = [];
  private userFeatures: Map<string, string[]> = new Map();
  private trialUsers: Map<string, number> = new Map();

  constructor() {
    this.initializePremiumPlans();
    this.initializePremiumFeatures();
  }

  private initializePremiumPlans() {
    const plans: PremiumPlan[] = [
      // Plano Gratuito
      {
        id: 'plan_free',
        name: 'Free',
        description: 'Acesso básico para começar sua jornada de corrida',
        type: 'free',
        price: {
          amount: 0,
          currency: 'BRL',
          billingCycle: 'monthly',
          trialDays: 0
        },
        features: {
          basic: [
            'Rastreamento básico de corridas',
            'Histórico de 10 corridas',
            'Estatísticas básicas',
            '3 rotas salvas',
            'Comunidade básica',
            'Desafios diários simples',
            'Suporte por email'
          ],
          premium: [],
          exclusive: [],
          limitations: {
            free: [
              'Máximo 10 corridas no histórico',
              'Apenas 3 rotas salvas',
              'Estatísticas limitadas',
              'Sem análise avançada',
              'Sem coach IA',
              'Sem rotas temáticas',
              'Sem ghost runs',
              'Sem AR navigation',
              'Sem biomechanics',
              'Sem mentoria',
              'Sem eventos premium',
              'Sem gamificação avançada'
            ],
            premium: []
          }
        },
        benefits: {
          immediate: [
            'Comece a correr imediatamente',
            'Acesso básico a todas as funcionalidades essenciais',
            'Comunidade de corredores'
          ],
          longTerm: [
            'Desenvolvimento gradual de hábitos',
            'Progresso visível',
            'Base sólida para upgrade'
          ],
          exclusive: []
        },
        restrictions: {
          free: [
            'Anúncios limitados',
            'Funcionalidades premium bloqueadas',
            'Suporte básico'
          ],
          premium: []
        },
        isPopular: false,
        isBestValue: false,
        isActive: true
      },

      // Plano Premium Mensal
      {
        id: 'plan_premium_monthly',
        name: 'Premium Mensal',
        description: 'Acesso completo a todas as funcionalidades premium',
        type: 'premium_monthly',
        price: {
          amount: 19.90,
          currency: 'BRL',
          billingCycle: 'monthly',
          trialDays: 7
        },
        features: {
          basic: [
            'Tudo do plano gratuito',
            'Rastreamento ilimitado de corridas',
            'Histórico completo',
            'Estatísticas avançadas',
            'Rotas ilimitadas',
            'Análise de performance',
            'Coach IA personalizado',
            'Rotas temáticas',
            'Ghost runs',
            'AR Navigation',
            'Biomechanics analysis',
            'Mentoria',
            'Eventos premium',
            'Gamificação avançada',
            'Sem anúncios'
          ],
          premium: [
            'Coach IA com voz',
            'Análise preditiva de lesões',
            'Planos de treino adaptativos',
            'Métricas de bem-estar',
            'Sistema de segurança avançado',
            'Integração com wearables',
            'Exportação de dados',
            'Suporte prioritário'
          ],
          exclusive: [
            'Funcionalidades beta',
            'Conteúdo exclusivo',
            'Eventos especiais',
            'Desafios premium'
          ],
          limitations: {
            free: [],
            premium: [
              'Algumas funcionalidades beta podem ter limitações',
              'Eventos especiais podem ter custo adicional'
            ]
          }
        },
        benefits: {
          immediate: [
            '7 dias de teste gratuito',
            'Acesso imediato a todas as funcionalidades',
            'Experiência premium sem anúncios'
          ],
          longTerm: [
            'Melhoria contínua da performance',
            'Treinos personalizados e adaptativos',
            'Comunidade premium exclusiva'
          ],
          exclusive: [
            'Funcionalidades em desenvolvimento',
            'Conteúdo exclusivo da equipe',
            'Acesso antecipado a novos recursos'
          ]
        },
        restrictions: {
          free: [],
          premium: [
            'Cancelamento a qualquer momento',
            'Sem compromisso de longo prazo',
            'Flexibilidade total'
          ]
        },
        isPopular: true,
        isBestValue: false,
        isActive: true
      },

      // Plano Premium Anual
      {
        id: 'plan_premium_annual',
        name: 'Premium Anual',
        description: 'Melhor valor com desconto de 40% no plano anual',
        type: 'premium_annual',
        price: {
          amount: 119.90,
          currency: 'BRL',
          originalAmount: 238.80,
          discountPercentage: 40,
          billingCycle: 'annual',
          trialDays: 7
        },
        features: {
          basic: [
            'Tudo do plano premium mensal',
            'Desconto de 40% no preço anual',
            'Economia de R$ 118,90 por ano'
          ],
          premium: [
            'Todas as funcionalidades premium',
            'Conteúdo exclusivo anual',
            'Eventos especiais prioritários'
          ],
          exclusive: [
            'Badge de membro anual',
            'Conteúdo exclusivo da equipe',
            'Acesso antecipado a funcionalidades',
            'Desafios exclusivos anuais'
          ],
          limitations: {
            free: [],
            premium: [
              'Compromisso anual',
              'Renovação automática'
            ]
          }
        },
        benefits: {
          immediate: [
            '7 dias de teste gratuito',
            'Desconto imediato de 40%',
            'Acesso a todas as funcionalidades'
          ],
          longTerm: [
            'Economia significativa',
            'Compromisso com objetivos de longo prazo',
            'Progresso contínuo e sustentável'
          ],
          exclusive: [
            'Status de membro anual',
            'Conteúdo exclusivo',
            'Eventos especiais'
          ]
        },
        restrictions: {
          free: [],
          premium: [
            'Compromisso anual',
            'Renovação automática',
            'Cancelamento após o período anual'
          ]
        },
        isPopular: false,
        isBestValue: true,
        isActive: true
      },

      // Plano Premium Lifetime
      {
        id: 'plan_premium_lifetime',
        name: 'Premium Lifetime',
        description: 'Acesso vitalício a todas as funcionalidades premium',
        type: 'premium_lifetime',
        price: {
          amount: 499.90,
          currency: 'BRL',
          originalAmount: 1194.80,
          discountPercentage: 58,
          billingCycle: 'lifetime',
          trialDays: 7
        },
        features: {
          basic: [
            'Tudo dos planos premium',
            'Acesso vitalício',
            'Sem renovação',
            'Sem compromisso mensal/anual'
          ],
          premium: [
            'Todas as funcionalidades premium',
            'Atualizações futuras incluídas',
            'Conteúdo exclusivo vitalício'
          ],
          exclusive: [
            'Badge de membro vitalício',
            'Status VIP permanente',
            'Conteúdo exclusivo vitalício',
            'Eventos especiais prioritários',
            'Suporte VIP dedicado'
          ],
          limitations: {
            free: [],
            premium: [
              'Pagamento único',
              'Sem renovação automática'
            ]
          }
        },
        benefits: {
          immediate: [
            '7 dias de teste gratuito',
            'Acesso imediato a todas as funcionalidades',
            'Economia de longo prazo'
          ],
          longTerm: [
            'Economia máxima a longo prazo',
            'Sem preocupações com renovação',
            'Investimento único para toda a vida'
          ],
          exclusive: [
            'Status VIP permanente',
            'Conteúdo exclusivo vitalício',
            'Suporte dedicado'
          ]
        },
        restrictions: {
          free: [],
          premium: [
            'Pagamento único',
            'Sem renovação',
            'Sem reembolso após 30 dias'
          ]
        },
        isPopular: false,
        isBestValue: false,
        isActive: true
      }
    ];

    this.plans.push(...plans);
  }

  private initializePremiumFeatures() {
    const features: PremiumFeature[] = [
      // Funcionalidades Core
      {
        id: 'feature_basic_tracking',
        name: 'Rastreamento Básico',
        description: 'Rastreamento básico de corridas com GPS',
        category: 'core',
        access: 'free',
        limitations: {
          free: { count: 10, restrictions: ['Apenas corridas básicas'] },
          premium: { count: -1, restrictions: ['Rastreamento completo'] }
        },
        isPopular: true,
        isEssential: true,
        upgradePrompt: 'Desbloqueie rastreamento ilimitado com Premium'
      },

      // Funcionalidades Avançadas
      {
        id: 'feature_ai_coach',
        name: 'Coach IA Personalizado',
        description: 'Coach virtual com IA que aprende e se adapta',
        category: 'advanced',
        access: 'premium',
        limitations: {
          free: { count: 0, restrictions: ['Bloqueado para usuários gratuitos'] },
          premium: { count: -1, restrictions: ['Acesso completo'] }
        },
        isPopular: true,
        isEssential: false,
        upgradePrompt: 'Desbloqueie seu coach IA personalizado com Premium'
      },

      // Funcionalidades Exclusivas
      {
        id: 'feature_ar_navigation',
        name: 'Navegação AR',
        description: 'Navegação em realidade aumentada',
        category: 'exclusive',
        access: 'premium',
        limitations: {
          free: { count: 0, restrictions: ['Bloqueado para usuários gratuitos'] },
          premium: { count: -1, restrictions: ['Acesso completo'] }
        },
        isPopular: false,
        isEssential: false,
        upgradePrompt: 'Experimente a navegação do futuro com Premium'
      },

      // Funcionalidades de Treino
      {
        id: 'feature_adaptive_training',
        name: 'Planos de Treino Adaptativos',
        description: 'Planos que se ajustam automaticamente ao seu progresso',
        category: 'training',
        access: 'premium',
        limitations: {
          free: { count: 0, restrictions: ['Bloqueado para usuários gratuitos'] },
          premium: { count: -1, restrictions: ['Acesso completo'] }
        },
        isPopular: true,
        isEssential: false,
        upgradePrompt: 'Desbloqueie treinos personalizados com Premium'
      },

      // Funcionalidades de Segurança
      {
        id: 'feature_safety_manager',
        name: 'Sistema de Segurança Avançado',
        description: 'Alertas inteligentes e rastreamento de segurança',
        category: 'safety',
        access: 'premium',
        limitations: {
          free: { count: 0, restrictions: ['Bloqueado para usuários gratuitos'] },
          premium: { count: -1, restrictions: ['Acesso completo'] }
        },
        isPopular: true,
        isEssential: false,
        upgradePrompt: 'Mantenha-se seguro com recursos premium de segurança'
      },

      // Funcionalidades de Bem-estar
      {
        id: 'feature_wellness_metrics',
        name: 'Métricas de Bem-estar',
        description: 'Análise completa de saúde e bem-estar',
        category: 'wellness',
        access: 'premium',
        limitations: {
          free: { count: 0, restrictions: ['Bloqueado para usuários gratuitos'] },
          premium: { count: -1, restrictions: ['Acesso completo'] }
        },
        isPopular: true,
        isEssential: false,
        upgradePrompt: 'Monitore sua saúde completa com Premium'
      },

      // Funcionalidades Sociais
      {
        id: 'feature_community_premium',
        name: 'Comunidade Premium',
        description: 'Acesso a grupos exclusivos e desafios premium',
        category: 'social',
        access: 'premium',
        limitations: {
          free: { count: 0, restrictions: ['Bloqueado para usuários gratuitos'] },
          premium: { count: -1, restrictions: ['Acesso completo'] }
        },
        isPopular: true,
        isEssential: false,
        upgradePrompt: 'Junte-se à comunidade premium exclusiva'
      },

      // Funcionalidades de Análise
      {
        id: 'feature_advanced_analytics',
        name: 'Análise Avançada',
        description: 'Estatísticas detalhadas e insights personalizados',
        category: 'analytics',
        access: 'premium',
        limitations: {
          free: { count: 0, restrictions: ['Bloqueado para usuários gratuitos'] },
          premium: { count: -1, restrictions: ['Acesso completo'] }
        },
        isPopular: true,
        isEssential: false,
        upgradePrompt: 'Desbloqueie insights avançados com Premium'
      }
    ];

    this.features.push(...features);
  }

  // Obter planos disponíveis
  public getAvailablePlans(): PremiumPlan[] {
    return this.plans.filter(plan => plan.isActive);
  }

  // Obter plano por ID
  public getPlanById(planId: string): PremiumPlan | undefined {
    return this.plans.find(plan => plan.id === planId);
  }

  // Obter plano gratuito
  public getFreePlan(): PremiumPlan | undefined {
    return this.plans.find(plan => plan.type === 'free');
  }

  // Obter planos premium
  public getPremiumPlans(): PremiumPlan[] {
    return this.plans.filter(plan => plan.type !== 'free' && plan.isActive);
  }

  // Obter melhor valor
  public getBestValuePlan(): PremiumPlan | undefined {
    return this.plans.find(plan => plan.isBestValue);
  }

  // Obter plano mais popular
  public getMostPopularPlan(): PremiumPlan | undefined {
    return this.plans.find(plan => plan.isPopular);
  }

  // Obter funcionalidades por categoria
  public getFeaturesByCategory(category: string): PremiumFeature[] {
    return this.features.filter(feature => feature.category === category);
  }

  // Obter funcionalidades por acesso
  public getFeaturesByAccess(access: string): PremiumFeature[] {
    return this.features.filter(feature => feature.access === access);
  }

  // Obter funcionalidades populares
  public getPopularFeatures(): PremiumFeature[] {
    return this.features.filter(feature => feature.isPopular);
  }

  // Obter funcionalidades essenciais
  public getEssentialFeatures(): PremiumFeature[] {
    return this.features.filter(feature => feature.isEssential);
  }

  // Verificar se usuário tem acesso a funcionalidade
  public hasFeatureAccess(userId: string, featureId: string): boolean {
    const userFeatures = this.userFeatures.get(userId) || [];
    const feature = this.features.find(f => f.id === featureId);
    
    if (!feature) return false;
    
    if (feature.access === 'free') return true;
    
    return userFeatures.includes(featureId);
  }

  // Verificar se usuário está em período de teste
  public isUserInTrial(userId: string): boolean {
    const trialEnd = this.trialUsers.get(userId);
    if (!trialEnd) return false;
    
    return Date.now() < trialEnd;
  }

  // Iniciar período de teste
  public startTrial(userId: string, planId: string): boolean {
    const plan = this.getPlanById(planId);
    if (!plan || plan.type === 'free') return false;
    
    const trialEnd = Date.now() + (plan.price.trialDays * 24 * 60 * 60 * 1000);
    this.trialUsers.set(userId, trialEnd);
    
    // Dar acesso temporário às funcionalidades premium
    this.grantTemporaryAccess(userId, plan);
    
    return true;
  }

  // Conceder acesso temporário
  private grantTemporaryAccess(userId: string, plan: PremiumPlan): void {
    const premiumFeatures = this.features.filter(f => f.access === 'premium');
    const featureIds = premiumFeatures.map(f => f.id);
    
    this.userFeatures.set(userId, featureIds);
  }

  // Criar assinatura
  public createSubscription(
    userId: string,
    planId: string,
    paymentMethod: any
  ): Subscription | null {
    const plan = this.getPlanById(planId);
    if (!plan || plan.type === 'free') return null;
    
    const now = Date.now();
    let endDate: number;
    
    if (plan.type === 'premium_lifetime') {
      endDate = now + (100 * 365 * 24 * 60 * 60 * 1000); // 100 anos
    } else if (plan.type === 'premium_annual') {
      endDate = now + (365 * 24 * 60 * 60 * 1000); // 1 ano
    } else {
      endDate = now + (30 * 24 * 60 * 60 * 1000); // 1 mês
    }
    
    const subscription: Subscription = {
      id: `sub_${Date.now()}`,
      userId,
      planId,
      status: 'active',
      startDate: now,
      endDate,
      trialEndDate: this.trialUsers.get(userId),
      nextBillingDate: plan.type !== 'premium_lifetime' ? endDate : undefined,
      autoRenew: plan.type !== 'premium_lifetime',
      paymentMethod,
      billingHistory: [],
      features: this.getPlanFeatures(plan),
      usage: {
        currentPeriod: {
          start: now,
          end,
          usage: {},
          limits: {}
        },
        totalUsage: {}
      },
      metadata: {
        source: 'app'
      }
    };
    
    this.subscriptions.push(subscription);
    
    // Remover do período de teste
    this.trialUsers.delete(userId);
    
    // Conceder acesso às funcionalidades
    this.userFeatures.set(userId, subscription.features);
    
    return subscription;
  }

  // Obter funcionalidades do plano
  private getPlanFeatures(plan: PremiumPlan): string[] {
    const allFeatures = [
      ...plan.features.basic,
      ...plan.features.premium,
      ...plan.features.exclusive
    ];
    
    // Mapear nomes para IDs de funcionalidades
    return this.features
      .filter(f => allFeatures.some(name => 
        name.toLowerCase().includes(f.name.toLowerCase()) ||
        f.name.toLowerCase().includes(name.toLowerCase())
      ))
      .map(f => f.id);
  }

  // Verificar status da assinatura
  public getSubscriptionStatus(userId: string): 'free' | 'trial' | 'premium' | 'expired' {
    if (this.isUserInTrial(userId)) return 'trial';
    
    const subscription = this.subscriptions.find(s => 
      s.userId === userId && s.status === 'active'
    );
    
    if (subscription) return 'premium';
    
    return 'free';
  }

  // Obter assinatura ativa do usuário
  public getUserActiveSubscription(userId: string): Subscription | undefined {
    return this.subscriptions.find(s => 
      s.userId === userId && s.status === 'active'
    );
  }

  // Cancelar assinatura
  public cancelSubscription(userId: string): boolean {
    const subscription = this.getUserActiveSubscription(userId);
    if (!subscription) return false;
    
    subscription.status = 'cancelled';
    subscription.autoRenew = false;
    
    // Manter acesso até o final do período
    return true;
  }

  // Renovar assinatura
  public renewSubscription(userId: string): boolean {
    const subscription = this.getUserActiveSubscription(userId);
    if (!subscription) return false;
    
    const plan = this.getPlanById(subscription.planId);
    if (!plan || plan.type === 'premium_lifetime') return false;
    
    const now = Date.now();
    let newEndDate: number;
    
    if (plan.type === 'premium_annual') {
      newEndDate = now + (365 * 24 * 60 * 60 * 1000);
    } else {
      newEndDate = now + (30 * 24 * 60 * 60 * 1000);
    }
    
    subscription.endDate = newEndDate;
    subscription.nextBillingDate = newEndDate;
    subscription.status = 'active';
    
    return true;
  }

  // Obter estatísticas de assinaturas
  public getSubscriptionStats(): {
    totalSubscriptions: number;
    activeSubscriptions: number;
    trialUsers: number;
    freeUsers: number;
    revenue: {
      monthly: number;
      annual: number;
      lifetime: number;
      total: number;
    };
    conversionRate: number;
  } {
    const totalSubscriptions = this.subscriptions.length;
    const activeSubscriptions = this.subscriptions.filter(s => s.status === 'active').length;
    const trialUsers = this.trialUsers.size;
    
    const revenue = this.subscriptions.reduce((acc, sub) => {
      const plan = this.getPlanById(sub.planId);
      if (!plan) return acc;
      
      if (plan.type === 'premium_monthly') acc.monthly += plan.price.amount;
      else if (plan.type === 'premium_annual') acc.annual += plan.price.amount;
      else if (plan.type === 'premium_lifetime') acc.lifetime += plan.price.amount;
      
      return acc;
    }, { monthly: 0, annual: 0, lifetime: 0, total: 0 });
    
    revenue.total = revenue.monthly + revenue.annual + revenue.lifetime;
    
    const totalUsers = totalSubscriptions + trialUsers;
    const conversionRate = totalUsers > 0 ? (activeSubscriptions / totalUsers) * 100 : 0;
    
    return {
      totalSubscriptions,
      activeSubscriptions,
      trialUsers,
      freeUsers: 0, // Placeholder
      revenue,
      conversionRate: Math.round(conversionRate * 100) / 100
    };
  }

  // Obter comparação de planos
  public getPlanComparison(): {
    features: string[];
    comparison: Array<{
      feature: string;
      free: string;
      premium: string;
      highlight: boolean;
    }>;
  } {
    const features = this.features.filter(f => f.isEssential || f.isPopular);
    const freePlan = this.getFreePlan();
    const premiumPlan = this.getPremiumPlans()[0]; // Usar primeiro plano premium como referência
    
    const comparison = features.map(feature => {
      const freeAccess = feature.access === 'free';
      const premiumAccess = feature.access === 'premium';
      
      return {
        feature: feature.name,
        free: freeAccess ? '✅ Incluído' : '❌ Não incluído',
        premium: premiumAccess ? '✅ Incluído' : '❌ Não incluído',
        highlight: !freeAccess && premiumAccess
      };
    });
    
    return {
      features: features.map(f => f.name),
      comparison
    };
  }
}

export function createPremiumManager(): PremiumManager {
  return new PremiumManager();
}