export interface CommunityMember {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  joinedAt: number;
  totalCalories: number;
  totalDistance: number;
  totalRuns: number;
  level: number;
  points: number;
  isAdmin: boolean;
  isModerator: boolean;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  createdBy: string;
  members: CommunityMember[];
  maxMembers: number;
  isPrivate: boolean;
  tags: string[];
  avatarUrl?: string;
  bannerUrl?: string;
  rules: string[];
  challenges: string[]; // IDs dos desafios ativos
}

export interface CommunityInvite {
  id: string;
  communityId: string;
  invitedBy: string;
  invitedUserId?: string;
  invitedEmail?: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expiresAt: number;
  message?: string;
}

export interface CommunityRanking {
  memberId: string;
  username: string;
  avatarUrl?: string;
  totalCalories: number;
  totalDistance: number;
  level: number;
  points: number;
  rank: number;
}

export class CommunityManager {
  private communities: Community[] = [];
  private invites: CommunityInvite[] = [];
  private members: CommunityMember[] = [];

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Comunidade de exemplo
    const sampleCommunity: Community = {
      id: 'com_1',
      name: 'Corredores de São Paulo',
      description: 'Comunidade para corredores da capital paulista',
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
      createdBy: 'user_1',
      members: [],
      maxMembers: 100,
      isPrivate: false,
      tags: ['sao-paulo', 'corrida', 'comunidade'],
      rules: [
        'Respeite todos os membros',
        'Compartilhe suas conquistas',
        'Ajude iniciantes'
      ],
      challenges: []
    };

    // Membros de exemplo
    const sampleMembers: CommunityMember[] = [
      {
        id: 'mem_1',
        userId: 'user_1',
        username: 'João Corredor',
        joinedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
        totalCalories: 15420,
        totalDistance: 156.8,
        totalRuns: 23,
        level: 8,
        points: 1250,
        isAdmin: true,
        isModerator: false
      },
      {
        id: 'mem_2',
        userId: 'user_2',
        username: 'Maria Veloz',
        joinedAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
        totalCalories: 18950,
        totalDistance: 203.2,
        totalRuns: 31,
        level: 12,
        points: 1890,
        isAdmin: false,
        isModerator: true
      },
      {
        id: 'mem_3',
        userId: 'user_3',
        username: 'Pedro Resistente',
        joinedAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
        totalCalories: 12340,
        totalDistance: 98.5,
        totalRuns: 18,
        level: 5,
        points: 780,
        isAdmin: false,
        isModerator: false
      }
    ];

    sampleCommunity.members = sampleMembers;
    this.communities.push(sampleCommunity);
    this.members.push(...sampleMembers);
  }

  // Criar comunidade
  public createCommunity(data: Omit<Community, 'id' | 'createdAt' | 'members'>): Community {
    const newCommunity: Community = {
      ...data,
      id: `com_${Date.now()}`,
      createdAt: Date.now(),
      members: []
    };

    // Adicionar criador como admin
    const creatorMember: CommunityMember = {
      id: `mem_${Date.now()}`,
      userId: data.createdBy,
      username: 'Você', // Será substituído pelo username real
      joinedAt: Date.now(),
      totalCalories: 0,
      totalDistance: 0,
      totalRuns: 0,
      level: 1,
      points: 0,
      isAdmin: true,
      isModerator: false
    };

    newCommunity.members.push(creatorMember);
    this.communities.push(newCommunity);
    this.members.push(creatorMember);

    return newCommunity;
  }

  // Editar comunidade
  public updateCommunity(communityId: string, updates: Partial<Community>, userId: string): Community | null {
    const community = this.communities.find(c => c.id === communityId);
    if (!community) return null;

    const member = community.members.find(m => m.userId === userId);
    if (!member || !member.isAdmin) return null;

    Object.assign(community, updates);
    return community;
  }

  // Deletar comunidade
  public deleteCommunity(communityId: string, userId: string): boolean {
    const communityIndex = this.communities.findIndex(c => c.id === communityId);
    if (communityIndex === -1) return false;

    const community = this.communities[communityIndex];
    const member = community.members.find(m => m.userId === userId);
    if (!member || !member.isAdmin) return false;

    // Remover membros
    this.members = this.members.filter(m => !community.members.some(cm => cm.id === m.id));
    
    // Remover convites
    this.invites = this.invites.filter(i => i.communityId !== communityId);
    
    // Remover comunidade
    this.communities.splice(communityIndex, 1);
    
    return true;
  }

  // Enviar convite
  public sendInvite(communityId: string, invitedBy: string, invitedEmail: string, message?: string): CommunityInvite {
    const community = this.communities.find(c => c.id === communityId);
    if (!community) throw new Error('Comunidade não encontrada');

    const inviter = community.members.find(m => m.userId === invitedBy);
    if (!inviter || (!inviter.isAdmin && !inviter.isModerator)) {
      throw new Error('Sem permissão para convidar');
    }

    const newInvite: CommunityInvite = {
      id: `inv_${Date.now()}`,
      communityId,
      invitedBy,
      invitedEmail,
      status: 'pending',
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 dias
      message
    };

    this.invites.push(newInvite);
    return newInvite;
  }

  // Aceitar convite
  public acceptInvite(inviteId: string, userId: string, username: string): CommunityMember | null {
    const invite = this.invites.find(i => i.id === inviteId);
    if (!invite || invite.status !== 'pending' || invite.expiresAt < Date.now()) {
      return null;
    }

    const community = this.communities.find(c => c.id === invite.communityId);
    if (!community) return null;

    // Verificar se já é membro
    if (community.members.some(m => m.userId === userId)) {
      return null;
    }

    // Verificar limite de membros
    if (community.members.length >= community.maxMembers) {
      return null;
    }

    const newMember: CommunityMember = {
      id: `mem_${Date.now()}`,
      userId,
      username,
      joinedAt: Date.now(),
      totalCalories: 0,
      totalDistance: 0,
      totalRuns: 0,
      level: 1,
      points: 0,
      isAdmin: false,
      isModerator: false
    };

    community.members.push(newMember);
    this.members.push(newMember);
    invite.status = 'accepted';

    return newMember;
  }

  // Recusar convite
  public declineInvite(inviteId: string): boolean {
    const invite = this.invites.find(i => i.id === inviteId);
    if (!invite || invite.status !== 'pending') return false;

    invite.status = 'declined';
    return true;
  }

  // Atualizar estatísticas do membro
  public updateMemberStats(userId: string, communityId: string, calories: number, distance: number): boolean {
    const community = this.communities.find(c => c.id === communityId);
    if (!community) return false;

    const member = community.members.find(m => m.userId === userId);
    if (!member) return false;

    member.totalCalories += calories;
    member.totalDistance += distance;
    member.totalRuns += 1;

    // Calcular pontos (1 ponto por 100 calorias + 10 pontos por km)
    member.points = Math.floor(member.totalCalories / 100) + Math.floor(member.totalDistance * 10);
    
    // Calcular nível (1 nível a cada 1000 pontos)
    member.level = Math.floor(member.points / 1000) + 1;

    return true;
  }

  // Obter ranking da comunidade
  public getCommunityRanking(communityId: string): CommunityRanking[] {
    const community = this.communities.find(c => c.id === communityId);
    if (!community) return [];

    const ranking = community.members
      .map(member => ({
        memberId: member.id,
        username: member.username,
        avatarUrl: member.avatarUrl,
        totalCalories: member.totalCalories,
        totalDistance: member.totalDistance,
        level: member.level,
        points: member.points,
        rank: 0
      }))
      .sort((a, b) => b.totalCalories - a.totalCalories) // Ranking por calorias
      .map((member, index) => ({
        ...member,
        rank: index + 1
      }));

    return ranking;
  }

  // Obter comunidades do usuário
  public getUserCommunities(userId: string): Community[] {
    return this.communities.filter(c => 
      c.members.some(m => m.userId === userId)
    );
  }

  // Obter convites pendentes do usuário
  public getUserPendingInvites(userEmail: string): CommunityInvite[] {
    return this.invites.filter(i => 
      i.invitedEmail === userEmail && i.status === 'pending'
    );
  }

  // Obter comunidade por ID
  public getCommunityById(communityId: string): Community | undefined {
    return this.communities.find(c => c.id === communityId);
  }

  // Buscar comunidades públicas
  public searchPublicCommunities(query: string): Community[] {
    return this.communities
      .filter(c => !c.isPrivate)
      .filter(c => 
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase()) ||
        c.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
  }
}

export function createCommunityManager(): CommunityManager {
  return new CommunityManager();
}