export interface SocialAction {
  id: string;
  name: string;
  description: string;
  category: 'environment' | 'health' | 'education' | 'poverty' | 'animals' | 'community';
  conversionRate: number; // KM para R$ (ex: 1km = R$ 0.50)
  minKmRequired: number;
  maxKmPerDay: number;
  totalKmDonated: number;
  totalMoneyRaised: number;
  goalKm: number;
  goalMoney: number;
  startDate: number;
  endDate: number;
  isActive: boolean;
  imageUrl?: string;
  organization: string;
  organizationUrl?: string;
  impactDescription: string;
  tags: string[];
}

export interface UserDonation {
  id: string;
  userId: string;
  socialActionId: string;
  kmDonated: number;
  moneyDonated: number;
  runId?: string;
  date: number;
  message?: string;
  isAnonymous: boolean;
}

export interface DonationCampaign {
  id: string;
  name: string;
  description: string;
  socialActions: string[]; // IDs das ações sociais
  startDate: number;
  endDate: number;
  goalKm: number;
  goalMoney: number;
  currentKm: number;
  currentMoney: number;
  participants: number;
  isActive: boolean;
  imageUrl?: string;
  sponsor?: string;
  sponsorLogo?: string;
}

export interface UserImpact {
  userId: string;
  totalKmDonated: number;
  totalMoneyDonated: number;
  totalActions: number;
  badges: string[];
  rank: number;
  impactStories: string[];
}

export class SocialActionManager {
  private socialActions: SocialAction[] = [];
  private userDonations: UserDonation[] = [];
  private campaigns: DonationCampaign[] = [];
  private userImpact: UserImpact[] = [];

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Ação Social: Reflorestamento
    const reforestationAction: SocialAction = {
      id: 'action_reforestation',
      name: 'Plante uma Árvore',
      description: 'Cada 5km correndo planta uma árvore na Mata Atlântica',
      category: 'environment',
      conversionRate: 0.20, // R$ 0.20 por km
      minKmRequired: 5,
      maxKmPerDay: 20,
      totalKmDonated: 1250,
      totalMoneyRaised: 250,
      goalKm: 10000,
      goalMoney: 2000,
      startDate: Date.now() - 60 * 24 * 60 * 60 * 1000,
      endDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
      isActive: true,
      imageUrl: 'https://example.com/tree.jpg',
      organization: 'Instituto Terra',
      organizationUrl: 'https://institutoterra.org',
      impactDescription: 'Já plantamos 250 árvores! Ajude a chegar em 1000.',
      tags: ['meio-ambiente', 'reflorestamento', 'mata-atlantica']
    };

    // Ação Social: Água Potável
    const waterAction: SocialAction = {
      id: 'action_water',
      name: 'Água para Todos',
      description: 'Cada 3km fornece 1 litro de água potável para comunidades carentes',
      category: 'health',
      conversionRate: 0.33, // R$ 0.33 por km
      minKmRequired: 3,
      maxKmPerDay: 15,
      totalKmDonated: 2100,
      totalMoneyRaised: 700,
      goalKm: 15000,
      goalMoney: 5000,
      startDate: Date.now() - 45 * 24 * 60 * 60 * 1000,
      endDate: Date.now() + 45 * 24 * 60 * 60 * 1000,
      isActive: true,
      imageUrl: 'https://example.com/water.jpg',
      organization: 'Água Limpa Brasil',
      organizationUrl: 'https://agualimpa.org',
      impactDescription: 'Já fornecemos 700 litros de água! Meta: 5000 litros.',
      tags: ['saude', 'agua', 'comunidades']
    };

    // Ação Social: Educação
    const educationAction: SocialAction = {
      id: 'action_education',
      name: 'Educação para Crianças',
      description: 'Cada 10km doa material escolar para uma criança',
      category: 'education',
      conversionRate: 0.50, // R$ 0.50 por km
      minKmRequired: 10,
      maxKmPerDay: 30,
      totalKmDonated: 800,
      totalMoneyRaised: 400,
      goalKm: 5000,
      goalMoney: 2500,
      startDate: Date.now() - 30 * 24 * 60 * 60 * 1000,
      endDate: Date.now() + 60 * 24 * 60 * 60 * 1000,
      isActive: true,
      imageUrl: 'https://example.com/education.jpg',
      organization: 'Educa Brasil',
      organizationUrl: 'https://educabrasil.org',
      impactDescription: 'Já ajudamos 40 crianças! Meta: 250 crianças.',
      tags: ['educacao', 'criancas', 'material-escolar']
    };

    this.socialActions.push(reforestationAction, waterAction, educationAction);

    // Campanha: Corrida Solidária
    const solidarityCampaign: DonationCampaign = {
      id: 'campaign_solidarity',
      name: 'Corrida Solidária 2024',
      description: 'Junte-se a milhares de corredores para fazer a diferença',
      socialActions: [reforestationAction.id, waterAction.id, educationAction.id],
      startDate: Date.now() - 30 * 24 * 60 * 60 * 1000,
      endDate: Date.now() + 60 * 24 * 60 * 60 * 1000,
      goalKm: 50000,
      goalMoney: 15000,
      currentKm: 4150,
      currentMoney: 1350,
      participants: 156,
      isActive: true,
      imageUrl: 'https://example.com/campaign.jpg',
      sponsor: 'Corrida Brasil',
      sponsorLogo: 'https://example.com/sponsor.png'
    };

    this.campaigns.push(solidarityCampaign);

    // Impacto do usuário de exemplo
    const sampleUserImpact: UserImpact = {
      userId: 'user_1',
      totalKmDonated: 45.5,
      totalMoneyDonated: 12.50,
      totalActions: 8,
      badges: ['🌱 Primeiro Plantador', '💧 Doador de Água', '📚 Educador'],
      rank: 15,
      impactStories: [
        'Plantei 9 árvores correndo 45km!',
        'Forneci água para 15 pessoas!',
        'Ajudei 4 crianças com material escolar!'
      ]
    };

    this.userImpact.push(sampleUserImpact);
  }

  // Obter ações sociais ativas
  public getActiveSocialActions(): SocialAction[] {
    const now = Date.now();
    return this.socialActions.filter(action => 
      action.isActive && now >= action.startDate && now <= action.endDate
    );
  }

  // Obter ação social por ID
  public getSocialActionById(actionId: string): SocialAction | undefined {
    return this.socialActions.find(action => action.id === actionId);
  }

  // Doar KM para uma ação social
  public donateKm(
    userId: string,
    socialActionId: string,
    kmDonated: number,
    runId?: string,
    message?: string,
    isAnonymous: boolean = false
  ): UserDonation | null {
    const action = this.getSocialActionById(socialActionId);
    if (!action) return null;

    // Verificar requisitos mínimos
    if (kmDonated < action.minKmRequired) {
      throw new Error(`Mínimo de ${action.minKmRequired}km necessário`);
    }

    // Verificar limite diário
    const today = new Date().toDateString();
    const todayDonations = this.userDonations.filter(d => 
      d.userId === userId && 
      d.socialActionId === socialActionId &&
      new Date(d.date).toDateString() === today
    );
    
    const todayKm = todayDonations.reduce((sum, d) => sum + d.kmDonated, 0);
    if (todayKm + kmDonated > action.maxKmPerDay) {
      throw new Error(`Limite diário de ${action.maxKmPerDay}km excedido`);
    }

    // Calcular valor da doação
    const moneyDonated = kmDonated * action.conversionRate;

    // Criar doação
    const donation: UserDonation = {
      id: `donation_${Date.now()}`,
      userId,
      socialActionId,
      kmDonated,
      moneyDonated,
      runId,
      date: Date.now(),
      message,
      isAnonymous
    };

    this.userDonations.push(donation);

    // Atualizar estatísticas da ação social
    action.totalKmDonated += kmDonated;
    action.totalMoneyRaised += moneyDonated;

    // Atualizar impacto do usuário
    this.updateUserImpact(userId, kmDonated, moneyDonated);

    return donation;
  }

  // Atualizar impacto do usuário
  private updateUserImpact(userId: string, kmDonated: number, moneyDonated: number): void {
    let userImpact = this.userImpact.find(ui => ui.userId === userId);
    
    if (!userImpact) {
      userImpact = {
        userId,
        totalKmDonated: 0,
        totalMoneyDonated: 0,
        totalActions: 0,
        badges: [],
        rank: 0,
        impactStories: []
      };
      this.userImpact.push(userImpact);
    }

    userImpact.totalKmDonated += kmDonated;
    userImpact.totalMoneyDonated += moneyDonated;
    userImpact.totalActions += 1;

    // Verificar badges
    this.checkAndAwardBadges(userImpact);

    // Atualizar ranking
    this.updateUserRankings();
  }

  // Verificar e conceder badges
  private checkAndAwardBadges(userImpact: UserImpact): void {
    const newBadges: string[] = [];

    // Badge por primeira doação
    if (userImpact.totalActions === 1 && !userImpact.badges.includes('🌱 Primeiro Plantador')) {
      newBadges.push('🌱 Primeiro Plantador');
    }

    // Badge por 10km doados
    if (userImpact.totalKmDonated >= 10 && !userImpact.badges.includes('🏃‍♂️ Doador Iniciante')) {
      newBadges.push('🏃‍♂️ Doador Iniciante');
    }

    // Badge por 50km doados
    if (userImpact.totalKmDonated >= 50 && !userImpact.badges.includes('🔥 Doador Consistente')) {
      newBadges.push('🔥 Doador Consistente');
    }

    // Badge por 100km doados
    if (userImpact.totalKmDonated >= 100 && !userImpact.badges.includes('💎 Doador Elite')) {
      newBadges.push('💎 Doador Elite');
    }

    // Badge por R$ 50 doados
    if (userImpact.totalMoneyDonated >= 50 && !userImpact.badges.includes('💝 Doador Generoso')) {
      newBadges.push('💝 Doador Generoso');
    }

    userImpact.badges.push(...newBadges);
  }

  // Atualizar rankings dos usuários
  private updateUserRankings(): void {
    const sortedUsers = [...this.userImpact].sort((a, b) => b.totalKmDonated - a.totalKmDonated);
    
    sortedUsers.forEach((user, index) => {
      user.rank = index + 1;
    });
  }

  // Obter doações do usuário
  public getUserDonations(userId: string): UserDonation[] {
    return this.userDonations.filter(d => d.userId === userId);
  }

  // Obter impacto do usuário
  public getUserImpact(userId: string): UserImpact | undefined {
    return this.userImpact.find(ui => ui.userId === userId);
  }

  // Obter ranking de doadores
  public getDonorRanking(): UserImpact[] {
    return [...this.userImpact].sort((a, b) => b.totalKmDonated - a.totalKmDonated);
  }

  // Obter campanhas ativas
  public getActiveCampaigns(): DonationCampaign[] {
    const now = Date.now();
    return this.campaigns.filter(campaign => 
      campaign.isActive && now >= campaign.startDate && now <= campaign.endDate
    );
  }

  // Obter campanha por ID
  public getCampaignById(campaignId: string): DonationCampaign | undefined {
    return this.campaigns.find(campaign => campaign.id === campaignId);
  }

  // Criar nova ação social
  public createSocialAction(data: Omit<SocialAction, 'id' | 'totalKmDonated' | 'totalMoneyRaised'>): SocialAction {
    const newAction: SocialAction = {
      ...data,
      id: `action_${Date.now()}`,
      totalKmDonated: 0,
      totalMoneyRaised: 0
    };

    this.socialActions.push(newAction);
    return newAction;
  }

  // Criar nova campanha
  public createCampaign(data: Omit<DonationCampaign, 'id' | 'currentKm' | 'currentMoney' | 'participants'>): DonationCampaign {
    const newCampaign: DonationCampaign = {
      ...data,
      id: `campaign_${Date.now()}`,
      currentKm: 0,
      currentMoney: 0,
      participants: 0
    };

    this.campaigns.push(newCampaign);
    return newCampaign;
  }

  // Obter estatísticas gerais
  public getOverallStats(): {
    totalKmDonated: number;
    totalMoneyRaised: number;
    totalDonations: number;
    activeUsers: number;
    activeActions: number;
  } {
    const totalKmDonated = this.socialActions.reduce((sum, action) => sum + action.totalKmDonated, 0);
    const totalMoneyRaised = this.socialActions.reduce((sum, action) => sum + action.totalMoneyRaised, 0);
    const totalDonations = this.userDonations.length;
    const activeUsers = new Set(this.userDonations.map(d => d.userId)).size;
    const activeActions = this.socialActions.filter(action => action.isActive).length;

    return {
      totalKmDonated,
      totalMoneyRaised,
      totalDonations,
      activeUsers,
      activeActions
    };
  }

  // Buscar ações sociais por categoria
  public getSocialActionsByCategory(category: SocialAction['category']): SocialAction[] {
    return this.socialActions.filter(action => action.category === category);
  }

  // Buscar ações sociais por tags
  public searchSocialActions(query: string): SocialAction[] {
    const lowerQuery = query.toLowerCase();
    return this.socialActions.filter(action => 
      action.name.toLowerCase().includes(lowerQuery) ||
      action.description.toLowerCase().includes(lowerQuery) ||
      action.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
}

export function createSocialActionManager(): SocialActionManager {
  return new SocialActionManager();
}