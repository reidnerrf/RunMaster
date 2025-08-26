export interface Charity {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  website: string;
  category: 'health' | 'education' | 'environment' | 'poverty' | 'animals' | 'disaster';
  verified: boolean;
  rating: number; // 0-5
  totalDonations: number;
  totalRunners: number;
  totalKm: number;
  active: boolean;
  featured: boolean;
}

export interface CharityRun {
  id: string;
  charityId: string;
  userId: string;
  runId: string;
  distance: number; // km
  duration: number; // seconds
  calories: number;
  donationAmount: number;
  donationType: 'per_km' | 'fixed' | 'pledge';
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: number;
  completedAt?: number;
  message?: string;
  photoUrl?: string;
  isPublic: boolean;
  likes: number;
  shares: number;
}

export interface CharityCampaign {
  id: string;
  charityId: string;
  name: string;
  description: string;
  goal: number; // km total
  current: number; // km atual
  deadline: number;
  reward: string;
  participants: number;
  totalDonations: number;
  status: 'active' | 'completed' | 'cancelled';
  startDate: number;
  endDate: number;
  tags: string[];
  featured: boolean;
}

export interface DonationPledge {
  id: string;
  userId: string;
  charityId: string;
  type: 'per_km' | 'fixed' | 'max_amount';
  amount: number;
  maxAmount?: number;
  active: boolean;
  startDate: number;
  endDate?: number;
  totalDonated: number;
  runs: string[]; // run IDs
}

export interface CharityLeaderboard {
  userId: string;
  userName: string;
  avatarUrl?: string;
  totalKm: number;
  totalDonations: number;
  runsCount: number;
  rank: number;
  badges: string[];
}

export interface CharityImpact {
  totalRunners: number;
  totalKm: number;
  totalDonations: number;
  livesImpacted: number;
  projectsFunded: number;
  environmentalImpact: string;
  socialImpact: string;
}

export class CharityManager {
  private charities: Charity[] = [];
  private charityRuns: CharityRun[] = [];
  private campaigns: CharityCampaign[] = [];
  private pledges: DonationPledge[] = [];
  private leaderboard: CharityLeaderboard[] = [];

  constructor() {
    this.initializeCharities();
    this.initializeCampaigns();
    this.generateLeaderboard();
  }

  private initializeCharities() {
    this.charities = [
      {
        id: 'charity_1',
        name: 'Corrida pela Água',
        description: 'Fornecendo água potável para comunidades carentes através de corridas.',
        website: 'https://corridapelaagua.org',
        category: 'health',
        verified: true,
        rating: 4.8,
        totalDonations: 125000,
        totalRunners: 8500,
        totalKm: 125000,
        active: true,
        featured: true
      },
      {
        id: 'charity_2',
        name: 'Educação em Movimento',
        description: 'Construindo escolas e fornecendo material escolar para crianças.',
        website: 'https://educacaoemmovimento.org',
        category: 'education',
        verified: true,
        rating: 4.9,
        totalDonations: 89000,
        totalRunners: 6200,
        totalKm: 89000,
        active: true,
        featured: true
      },
      {
        id: 'charity_3',
        name: 'Verde Correndo',
        description: 'Plantando árvores e protegendo florestas através de corridas.',
        website: 'https://verdecorrendo.org',
        category: 'environment',
        verified: true,
        rating: 4.7,
        totalDonations: 67000,
        totalRunners: 4800,
        totalKm: 67000,
        active: true,
        featured: false
      },
      {
        id: 'charity_4',
        name: 'Corrida Animal',
        description: 'Resgatando e cuidando de animais abandonados.',
        website: 'https://corridaanimal.org',
        category: 'animals',
        verified: true,
        rating: 4.6,
        totalDonations: 45000,
        totalRunners: 3200,
        totalKm: 45000,
        active: true,
        featured: false
      },
      {
        id: 'charity_5',
        name: 'Esperança em Movimento',
        description: 'Ajudando famílias em situação de vulnerabilidade social.',
        website: 'https://esperancaemmovimento.org',
        category: 'poverty',
        verified: true,
        rating: 4.8,
        totalDonations: 156000,
        totalRunners: 11200,
        totalKm: 156000,
        active: true,
        featured: true
      }
    ];
  }

  private initializeCampaigns() {
    const now = Date.now();
    const oneMonth = 30 * 24 * 60 * 60 * 1000;
    
    this.campaigns = [
      {
        id: 'campaign_1',
        charityId: 'charity_1',
        name: 'Maratona da Água 2024',
        description: 'Meta: 50.000 km para fornecer água potável para 10.000 pessoas.',
        goal: 50000,
        current: 32450,
        deadline: now + oneMonth,
        reward: 'Medalha especial + certificado de impacto',
        participants: 1250,
        totalDonations: 32450,
        status: 'active',
        startDate: now - oneMonth,
        endDate: now + oneMonth,
        tags: ['água', 'saúde', 'comunidade'],
        featured: true
      },
      {
        id: 'campaign_2',
        charityId: 'charity_2',
        name: 'Corrida pela Educação',
        description: 'Meta: 25.000 km para construir 5 escolas.',
        goal: 25000,
        current: 18750,
        deadline: now + (oneMonth * 2),
        reward: 'Visita à escola construída + agradecimento dos alunos',
        participants: 890,
        totalDonations: 18750,
        status: 'active',
        startDate: now - (oneMonth * 2),
        endDate: now + (oneMonth * 2),
        tags: ['educação', 'escolas', 'crianças'],
        featured: true
      },
      {
        id: 'campaign_3',
        charityId: 'charity_3',
        name: 'Verde em Movimento',
        description: 'Meta: 15.000 km para plantar 10.000 árvores.',
        goal: 15000,
        current: 12300,
        deadline: now + (oneMonth * 3),
        reward: 'Certificado de plantio + GPS da sua árvore',
        participants: 450,
        totalDonations: 12300,
        status: 'active',
        startDate: now - (oneMonth * 3),
        endDate: now + (oneMonth * 3),
        tags: ['meio ambiente', 'árvores', 'sustentabilidade'],
        featured: false
      }
    ];
  }

  public createCharityRun(
    userId: string,
    runId: string,
    charityId: string,
    distance: number,
    duration: number,
    calories: number,
    donationType: 'per_km' | 'fixed' | 'pledge',
    message?: string
  ): CharityRun {
    const charity = this.charities.find(c => c.id === charityId);
    if (!charity) {
      throw new Error('Charity not found');
    }

    let donationAmount = 0;
    
    switch (donationType) {
      case 'per_km':
        donationAmount = distance * 0.50; // R$ 0,50 por km
        break;
      case 'fixed':
        donationAmount = 10; // R$ 10,00 fixo
        break;
      case 'pledge':
        // Calcula baseado em pledges ativos do usuário
        donationAmount = this.calculatePledgeDonation(userId, distance);
        break;
    }

    const charityRun: CharityRun = {
      id: `charity_run_${Date.now()}`,
      charityId,
      userId,
      runId,
      distance,
      duration,
      calories,
      donationAmount,
      donationType,
      status: 'pending',
      createdAt: Date.now(),
      message,
      isPublic: true,
      likes: 0,
      shares: 0
    };

    this.charityRuns.push(charityRun);
    
    // Atualiza estatísticas da caridade
    this.updateCharityStats(charityId, distance, donationAmount);
    
    // Atualiza campanhas ativas
    this.updateCampaignProgress(charityId, distance);
    
    // Atualiza leaderboard
    this.updateLeaderboard(userId, distance, donationAmount);
    
    return charityRun;
  }

  private calculatePledgeDonation(userId: string, distance: number): number {
    const userPledges = this.pledges.filter(p => 
      p.userId === userId && p.active && p.endDate && Date.now() < p.endDate
    );

    let totalDonation = 0;
    
    userPledges.forEach(pledge => {
      if (pledge.type === 'per_km') {
        totalDonation += distance * pledge.amount;
      } else if (pledge.type === 'fixed') {
        totalDonation += pledge.amount;
      } else if (pledge.type === 'max_amount') {
        const kmDonation = distance * pledge.amount;
        totalDonation += Math.min(kmDonation, pledge.maxAmount || 0);
      }
    });

    return totalDonation;
  }

  private updateCharityStats(charityId: string, distance: number, donationAmount: number) {
    const charity = this.charities.find(c => c.id === charityId);
    if (charity) {
      charity.totalKm += distance;
      charity.totalDonations += donationAmount;
      charity.totalRunners += 1;
    }
  }

  private updateCampaignProgress(charityId: string, distance: number) {
    this.campaigns.forEach(campaign => {
      if (campaign.charityId === charityId && campaign.status === 'active') {
        campaign.current += distance;
        campaign.participants += 1;
        
        if (campaign.current >= campaign.goal) {
          campaign.status = 'completed';
          campaign.endDate = Date.now();
        }
      }
    });
  }

  private updateLeaderboard(userId: string, distance: number, donationAmount: number) {
    let userEntry = this.leaderboard.find(entry => entry.userId === userId);
    
    if (!userEntry) {
      userEntry = {
        userId,
        userName: `User_${userId.slice(-4)}`,
        totalKm: 0,
        totalDonations: 0,
        runsCount: 0,
        rank: 0,
        badges: []
      };
      this.leaderboard.push(userEntry);
    }

    userEntry.totalKm += distance;
    userEntry.totalDonations += donationAmount;
    userEntry.runsCount += 1;

    // Atualiza badges
    this.updateUserBadges(userEntry);

    // Recalcula ranking
    this.recalculateLeaderboard();
  }

  private updateUserBadges(userEntry: CharityLeaderboard) {
    const badges: string[] = [];
    
    if (userEntry.totalKm >= 100) badges.push('🏃‍♂️ Centenário');
    if (userEntry.totalKm >= 500) badges.push('🏃‍♀️ Maratonista');
    if (userEntry.totalKm >= 1000) badges.push('🏃 Ultra Runner');
    
    if (userEntry.totalDonations >= 1000) badges.push('💝 Doador Bronze');
    if (userEntry.totalDonations >= 5000) badges.push('💝 Doador Prata');
    if (userEntry.totalDonations >= 10000) badges.push('💝 Doador Ouro');
    
    if (userEntry.runsCount >= 10) badges.push('📅 Consistente');
    if (userEntry.runsCount >= 50) badges.push('📅 Dedicado');
    if (userEntry.runsCount >= 100) badges.push('📅 Lendário');
    
    userEntry.badges = badges;
  }

  private recalculateLeaderboard() {
    this.leaderboard.sort((a, b) => b.totalDonations - a.totalDonations);
    
    this.leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });
  }

  public getCharities(category?: string, featured?: boolean): Charity[] {
    let filtered = this.charities.filter(c => c.active);
    
    if (category) {
      filtered = filtered.filter(c => c.category === category);
    }
    
    if (featured) {
      filtered = filtered.filter(c => c.featured);
    }
    
    return filtered.sort((a, b) => b.rating - a.rating);
  }

  public getCampaigns(charityId?: string, status?: string): CharityCampaign[] {
    let filtered = this.campaigns;
    
    if (charityId) {
      filtered = filtered.filter(c => c.charityId === charityId);
    }
    
    if (status) {
      filtered = filtered.filter(c => c.status === status);
    }
    
    return filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.participants - a.participants;
    });
  }

  public getCharityRuns(userId?: string, charityId?: string): CharityRun[] {
    let filtered = this.charityRuns;
    
    if (userId) {
      filtered = filtered.filter(r => r.userId === userId);
    }
    
    if (charityId) {
      filtered = filtered.filter(r => r.charityId === charityId);
    }
    
    return filtered.sort((a, b) => b.createdAt - a.createdAt);
  }

  public getLeaderboard(limit: number = 50): CharityLeaderboard[] {
    return this.leaderboard.slice(0, limit);
  }

  public getUserCharityStats(userId: string): {
    totalKm: number;
    totalDonations: number;
    runsCount: number;
    rank: number;
    badges: string[];
    favoriteCharity?: string;
    impact: string;
  } {
    const userEntry = this.leaderboard.find(entry => entry.userId === userId);
    
    if (!userEntry) {
      return {
        totalKm: 0,
        totalDonations: 0,
        runsCount: 0,
        rank: 0,
        badges: [],
        impact: 'Comece a correr para fazer a diferença!'
      };
    }

    // Encontra caridade favorita
    const userRuns = this.charityRuns.filter(r => r.userId === userId);
    const charityCounts = userRuns.reduce((acc, run) => {
      acc[run.charityId] = (acc[run.charityId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const favoriteCharity = Object.entries(charityCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0];

    // Calcula impacto
    const impact = this.calculateUserImpact(userEntry.totalKm, userEntry.totalDonations);

    return {
      ...userEntry,
      favoriteCharity,
      impact
    };
  }

  private calculateUserImpact(totalKm: number, totalDonations: number): string {
    if (totalKm === 0) return 'Comece a correr para fazer a diferença!';
    
    const waterLiters = Math.floor(totalKm * 10); // 10L por km
    const treesPlanted = Math.floor(totalKm / 5); // 1 árvore a cada 5km
    const mealsProvided = Math.floor(totalDonations / 5); // 1 refeição a cada R$5
    
    if (totalKm < 10) {
      return `Você já correu ${totalKm}km! Continue assim!`;
    } else if (totalKm < 50) {
      return `Com ${totalKm}km, você já ajudou a fornecer ${waterLiters}L de água!`;
    } else if (totalKm < 100) {
      return `Incrível! ${totalKm}km = ${waterLiters}L de água + ${treesPlanted} árvores plantadas!`;
    } else {
      return `Lendário! ${totalKm}km = ${waterLiters}L de água + ${treesPlanted} árvores + ${mealsProvided} refeições!`;
    }
  }

  public getCharityImpact(charityId: string): CharityImpact {
    const charity = this.charities.find(c => c.id === charityId);
    if (!charity) {
      throw new Error('Charity not found');
    }

    const runs = this.charityRuns.filter(r => r.charityId === charityId);
    const totalRunners = new Set(runs.map(r => r.userId)).size;
    
    // Calcula impacto baseado na categoria
    let livesImpacted = 0;
    let projectsFunded = 0;
    let environmentalImpact = '';
    let socialImpact = '';

    switch (charity.category) {
      case 'health':
        livesImpacted = Math.floor(charity.totalDonations / 25); // R$25 por pessoa
        projectsFunded = Math.floor(charity.totalDonations / 5000); // R$5000 por projeto
        socialImpact = `${livesImpacted} pessoas com acesso à água potável`;
        break;
      case 'education':
        livesImpacted = Math.floor(charity.totalDonations / 100); // R$100 por aluno
        projectsFunded = Math.floor(charity.totalDonations / 15000); // R$15000 por escola
        socialImpact = `${livesImpacted} alunos com acesso à educação`;
        break;
      case 'environment':
        livesImpacted = Math.floor(charity.totalKm / 2); // 1 pessoa impactada a cada 2km
        projectsFunded = Math.floor(charity.totalDonations / 10000); // R$10000 por projeto
        environmentalImpact = `${Math.floor(charity.totalKm / 5)} árvores plantadas`;
        break;
      case 'animals':
        livesImpacted = Math.floor(charity.totalDonations / 50); // R$50 por animal
        projectsFunded = Math.floor(charity.totalDonations / 3000); // R$3000 por projeto
        socialImpact = `${livesImpacted} animais resgatados e cuidados`;
        break;
      case 'poverty':
        livesImpacted = Math.floor(charity.totalDonations / 75); // R$75 por família
        projectsFunded = Math.floor(charity.totalDonations / 8000); // R$8000 por projeto
        socialImpact = `${livesImpacted} famílias com melhores condições`;
        break;
    }

    return {
      totalRunners,
      totalKm: charity.totalKm,
      totalDonations: charity.totalDonations,
      livesImpacted,
      projectsFunded,
      environmentalImpact,
      socialImpact
    };
  }

  public createDonationPledge(
    userId: string,
    charityId: string,
    type: 'per_km' | 'fixed' | 'max_amount',
    amount: number,
    maxAmount?: number,
    endDate?: number
  ): DonationPledge {
    const pledge: DonationPledge = {
      id: `pledge_${Date.now()}`,
      userId,
      charityId,
      type,
      amount,
      maxAmount,
      active: true,
      startDate: Date.now(),
      endDate,
      totalDonated: 0,
      runs: []
    };

    this.pledges.push(pledge);
    return pledge;
  }

  public getCharityRunsByUser(userId: string): {
    runs: CharityRun[];
    totalKm: number;
    totalDonations: number;
    charities: string[];
  } {
    const userRuns = this.charityRuns.filter(r => r.userId === userId);
    const totalKm = userRuns.reduce((sum, r) => sum + r.distance, 0);
    const totalDonations = userRuns.reduce((sum, r) => sum + r.donationAmount, 0);
    const charities = [...new Set(userRuns.map(r => r.charityId))];

    return {
      runs: userRuns,
      totalKm,
      totalDonations,
      charities
    };
  }

  public getTopCharities(limit: number = 5): Charity[] {
    return this.charities
      .filter(c => c.active)
      .sort((a, b) => b.totalDonations - a.totalDonations)
      .slice(0, limit);
  }

  public getRecentCharityRuns(limit: number = 10): CharityRun[] {
    return this.charityRuns
      .filter(r => r.isPublic)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  }
}

// Função helper para criar gerenciador de caridade
export function createCharityManager(): CharityManager {
  return new CharityManager();
}