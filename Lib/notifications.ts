export interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  body: string;
  category: 'achievement' | 'challenge' | 'social' | 'reminder' | 'promotion' | 'system';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  sound?: string;
  badge?: number;
  data?: { [key: string]: any };
  actions?: NotificationAction[];
  isActive: boolean;
  schedule?: {
    type: 'immediate' | 'delayed' | 'recurring';
    delay?: number; // segundos
    interval?: number; // segundos
    maxOccurrences?: number;
  };
}

export interface NotificationAction {
  id: string;
  title: string;
  action: string;
  icon?: string;
  destructive?: boolean;
  authenticationRequired?: boolean;
}

export interface PushNotification {
  id: string;
  userId: string;
  templateId: string;
  title: string;
  body: string;
  category: string;
  priority: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'cancelled';
  sentAt?: number;
  deliveredAt?: number;
  failedAt?: number;
  failureReason?: string;
  deviceTokens: string[];
  metadata: {
    source: 'system' | 'user' | 'achievement' | 'challenge' | 'social';
    trigger?: string;
    context?: any;
  };
  createdAt: number;
  scheduledFor?: number;
}

export interface NotificationPreference {
  userId: string;
  categories: {
    achievement: boolean;
    challenge: boolean;
    social: boolean;
    reminder: boolean;
    promotion: boolean;
    system: boolean;
  };
  schedule: {
    quietHours: {
      enabled: boolean;
      start: string; // HH:MM
      end: string; // HH:MM
      timezone: string;
    };
    maxPerDay: number;
    maxPerHour: number;
  };
  channels: {
    push: boolean;
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
  frequency: 'immediate' | 'batched' | 'digest';
  lastUpdated: number;
}

export interface NotificationCampaign {
  id: string;
  name: string;
  description: string;
  templateId: string;
  targetAudience: {
    type: 'all' | 'segment' | 'individual';
    filters?: {
      userLevel?: number;
      userRank?: string;
      userActivity?: string;
      userLocation?: string;
      userPreferences?: string[];
    };
    userIds?: string[];
  };
  schedule: {
    startDate: number;
    endDate?: number;
    sendTime: string; // HH:MM
    timezone: string;
    frequency: 'once' | 'daily' | 'weekly' | 'monthly';
    maxSends?: number;
  };
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    failed: number;
  };
  createdAt: number;
  createdBy: string;
}

export interface NotificationManager {
  templates: NotificationTemplate[];
  notifications: PushNotification[];
  preferences: Map<string, NotificationPreference>;
  campaigns: NotificationCampaign[];
  deviceTokens: Map<string, string[]>; // userId -> deviceTokens[]
}

export class NotificationManager {
  private templates: NotificationTemplate[] = [];
  private notifications: PushNotification[] = [];
  private preferences: Map<string, NotificationPreference> = new Map();
  private campaigns: NotificationCampaign[] = [];
  private deviceTokens: Map<string, string[]> = new Map();

  constructor() {
    this.initializeNotificationTemplates();
    this.initializeDefaultPreferences();
  }

  private initializeNotificationTemplates() {
    const templates: NotificationTemplate[] = [
      // Notificações de Conquistas
      {
        id: 'achievement_unlocked',
        name: 'Conquista Desbloqueada',
        title: '🎉 Nova Conquista!',
        body: 'Você desbloqueou "{achievement_name}"! Parabéns pela dedicação!',
        category: 'achievement',
        priority: 'high',
        sound: 'achievement.mp3',
        badge: 1,
        data: {
          type: 'achievement',
          achievementId: '{achievement_id}',
          points: '{points}',
          xp: '{xp}'
        },
        actions: [
          {
            id: 'view_achievement',
            title: 'Ver Conquista',
            action: 'VIEW_ACHIEVEMENT'
          },
          {
            id: 'share_achievement',
            title: 'Compartilhar',
            action: 'SHARE_ACHIEVEMENT'
          }
        ],
        isActive: true,
        schedule: {
          type: 'immediate'
        }
      },

      {
        id: 'level_up',
        name: 'Subiu de Nível',
        title: '🚀 Novo Nível Alcançado!',
        body: 'Parabéns! Você alcançou o nível {level}! Continue assim!',
        category: 'achievement',
        priority: 'high',
        sound: 'level_up.mp3',
        badge: 1,
        data: {
          type: 'level_up',
          newLevel: '{level}',
          rewards: '{rewards}'
        },
        actions: [
          {
            id: 'view_profile',
            title: 'Ver Perfil',
            action: 'VIEW_PROFILE'
          }
        ],
        isActive: true,
        schedule: {
          type: 'immediate'
        }
      },

      // Notificações de Desafios
      {
        id: 'challenge_started',
        name: 'Desafio Iniciado',
        title: '🏁 Desafio Iniciado!',
        body: 'O desafio "{challenge_name}" começou! Você tem {time_left} para completar!',
        category: 'challenge',
        priority: 'normal',
        sound: 'challenge.mp3',
        data: {
          type: 'challenge_started',
          challengeId: '{challenge_id}',
          timeLeft: '{time_left}'
        },
        actions: [
          {
            id: 'view_challenge',
            title: 'Ver Desafio',
            action: 'VIEW_CHALLENGE'
          },
          {
            id: 'start_activity',
            title: 'Começar Atividade',
            action: 'START_ACTIVITY'
          }
        ],
        isActive: true,
        schedule: {
          type: 'immediate'
        }
      },

      {
        id: 'challenge_completed',
        name: 'Desafio Completado',
        title: '🎯 Desafio Completado!',
        body: 'Parabéns! Você completou "{challenge_name}" e ganhou {rewards}!',
        category: 'challenge',
        priority: 'high',
        sound: 'success.mp3',
        badge: 1,
        data: {
          type: 'challenge_completed',
          challengeId: '{challenge_id}',
          rewards: '{rewards}'
        },
        actions: [
          {
            id: 'claim_rewards',
            title: 'Resgatar Prêmios',
            action: 'CLAIM_REWARDS'
          },
          {
            id: 'view_leaderboard',
            title: 'Ver Ranking',
            action: 'VIEW_LEADERBOARD'
          }
        ],
        isActive: true,
        schedule: {
          type: 'immediate'
        }
      },

      // Notificações Sociais
      {
        id: 'friend_achievement',
        name: 'Conquista de Amigo',
        title: '👥 {friend_name} fez uma conquista!',
        body: 'Seu amigo {friend_name} desbloqueou "{achievement_name}"!',
        category: 'social',
        priority: 'normal',
        sound: 'social.mp3',
        data: {
          type: 'friend_achievement',
          friendId: '{friend_id}',
          friendName: '{friend_name}',
          achievementId: '{achievement_id}'
        },
        actions: [
          {
            id: 'congratulate',
            title: 'Parabenizar',
            action: 'CONGRATULATE_FRIEND'
          },
          {
            id: 'view_friend',
            title: 'Ver Perfil',
            action: 'VIEW_FRIEND_PROFILE'
          }
        ],
        isActive: true,
        schedule: {
          type: 'immediate'
        }
      },

      {
        id: 'community_invite',
        name: 'Convite para Comunidade',
        title: '🤝 Convite para Comunidade',
        body: '{inviter_name} te convidou para participar da comunidade "{community_name}"!',
        category: 'social',
        priority: 'normal',
        sound: 'invite.mp3',
        data: {
          type: 'community_invite',
          inviterId: '{inviter_id}',
          inviterName: '{inviter_name}',
          communityId: '{community_id}',
          communityName: '{community_name}'
        },
        actions: [
          {
            id: 'accept_invite',
            title: 'Aceitar',
            action: 'ACCEPT_INVITE'
          },
          {
            id: 'decline_invite',
            title: 'Recusar',
            action: 'DECLINE_INVITE',
            destructive: true
          }
        ],
        isActive: true,
        schedule: {
          type: 'immediate'
        }
      },

      // Notificações de Lembretes
      {
        id: 'daily_reminder',
        name: 'Lembrete Diário',
        title: '🏃‍♂️ Hora de Correr!',
        body: 'Não esqueça de sua corrida diária! Mantenha sua sequência de {streak} dias!',
        category: 'reminder',
        priority: 'normal',
        sound: 'reminder.mp3',
        data: {
          type: 'daily_reminder',
          streak: '{streak}',
          goal: '{daily_goal}'
        },
        actions: [
          {
            id: 'start_run',
            title: 'Começar Corrida',
            action: 'START_RUN'
          },
          {
            id: 'snooze',
            title: 'Adiar',
            action: 'SNOOZE_REMINDER'
          }
        ],
        isActive: true,
        schedule: {
          type: 'recurring',
          interval: 24 * 60 * 60, // 24 horas
          maxOccurrences: -1 // indefinido
        }
      },

      {
        id: 'goal_reminder',
        name: 'Lembrete de Meta',
        title: '🎯 Meta Semanal em Andamento',
        body: 'Você está a {distance_left}km de alcançar sua meta semanal de {weekly_goal}km!',
        category: 'reminder',
        priority: 'normal',
        sound: 'goal.mp3',
        data: {
          type: 'goal_reminder',
          distanceLeft: '{distance_left}',
          weeklyGoal: '{weekly_goal}',
          progress: '{progress_percentage}'
        },
        actions: [
          {
            id: 'view_progress',
            title: 'Ver Progresso',
            action: 'VIEW_PROGRESS'
          },
          {
            id: 'adjust_goal',
            title: 'Ajustar Meta',
            action: 'ADJUST_GOAL'
          }
        ],
        isActive: true,
        schedule: {
          type: 'recurring',
          interval: 7 * 24 * 60 * 60, // 7 dias
          maxOccurrences: -1
        }
      },

      // Notificações de Promoção
      {
        id: 'premium_offer',
        name: 'Oferta Premium',
        title: '⭐ Oferta Especial Premium',
        body: 'Desconto de 50% no primeiro mês! Experimente todas as funcionalidades premium!',
        category: 'promotion',
        priority: 'normal',
        sound: 'promotion.mp3',
        data: {
          type: 'premium_offer',
          discount: '50%',
          duration: '1 mês',
          offerCode: 'PREMIUM50'
        },
        actions: [
          {
            id: 'view_offer',
            title: 'Ver Oferta',
            action: 'VIEW_PREMIUM_OFFER'
          },
          {
            id: 'dismiss',
            title: 'Agora Não',
            action: 'DISMISS_OFFER'
          }
        ],
        isActive: true,
        schedule: {
          type: 'delayed',
          delay: 7 * 24 * 60 * 60 // 7 dias após registro
        }
      },

      // Notificações do Sistema
      {
        id: 'app_update',
        name: 'Atualização do App',
        title: '🔄 Nova Atualização Disponível',
        body: 'Uma nova versão do app está disponível com melhorias e correções!',
        category: 'system',
        priority: 'low',
        sound: 'system.mp3',
        data: {
          type: 'app_update',
          version: '{version}',
          features: '{new_features}'
        },
        actions: [
          {
            id: 'update_now',
            title: 'Atualizar Agora',
            action: 'UPDATE_APP'
          },
          {
            id: 'remind_later',
            title: 'Lembrar Depois',
            action: 'REMIND_LATER'
          }
        ],
        isActive: true,
        schedule: {
          type: 'delayed',
          delay: 24 * 60 * 60 // 24 horas após disponibilização
        }
      }
    ];

    this.templates.push(...templates);
  }

  private initializeDefaultPreferences() {
    const defaultPreferences: NotificationPreference = {
      userId: 'default',
      categories: {
        achievement: true,
        challenge: true,
        social: true,
        reminder: true,
        promotion: false,
        system: true
      },
      schedule: {
        quietHours: {
          enabled: true,
          start: '22:00',
          end: '08:00',
          timezone: 'America/Sao_Paulo'
        },
        maxPerDay: 20,
        maxPerHour: 3
      },
      channels: {
        push: true,
        email: false,
        sms: false,
        inApp: true
      },
      frequency: 'immediate',
      lastUpdated: Date.now()
    };

    this.preferences.set('default', defaultPreferences);
  }

  // Obter templates de notificação
  public getNotificationTemplates(category?: string): NotificationTemplate[] {
    if (category) {
      return this.templates.filter(t => t.category === category && t.isActive);
    }
    return this.templates.filter(t => t.isActive);
  }

  // Obter template por ID
  public getTemplateById(templateId: string): NotificationTemplate | undefined {
    return this.templates.find(t => t.id === templateId);
  }

  // Obter preferências do usuário
  public getUserPreferences(userId: string): NotificationPreference {
    return this.preferences.get(userId) || this.preferences.get('default')!;
  }

  // Atualizar preferências do usuário
  public updateUserPreferences(
    userId: string,
    updates: Partial<NotificationPreference>
  ): NotificationPreference {
    const current = this.getUserPreferences(userId);
    const updated = { ...current, ...updates, lastUpdated: Date.now() };
    
    this.preferences.set(userId, updated);
    return updated;
  }

  // Registrar token de dispositivo
  public registerDeviceToken(userId: string, token: string): boolean {
    const userTokens = this.deviceTokens.get(userId) || [];
    
    if (!userTokens.includes(token)) {
      userTokens.push(token);
      this.deviceTokens.set(userId, userTokens);
    }
    
    return true;
  }

  // Remover token de dispositivo
  public removeDeviceToken(userId: string, token: string): boolean {
    const userTokens = this.deviceTokens.get(userId) || [];
    const filteredTokens = userTokens.filter(t => t !== token);
    
    if (filteredTokens.length !== userTokens.length) {
      this.deviceTokens.set(userId, filteredTokens);
      return true;
    }
    
    return false;
  }

  // Enviar notificação
  public async sendNotification(
    userId: string,
    templateId: string,
    data: { [key: string]: any } = {},
    context?: any
  ): Promise<PushNotification | null> {
    const template = this.getTemplateById(templateId);
    if (!template || !template.isActive) return null;

    const preferences = this.getUserPreferences(userId);
    
    // Verificar se categoria está habilitada
    if (!preferences.categories[template.category as keyof typeof preferences.categories]) {
      return null;
    }

    // Verificar horário silencioso
    if (this.isInQuietHours(preferences)) {
      return null;
    }

    // Verificar limites de frequência
    if (!this.canSendNotification(userId, preferences)) {
      return null;
    }

    // Substituir placeholders nos dados
    const title = this.replacePlaceholders(template.title, data);
    const body = this.replacePlaceholders(template.body, data);

    const notification: PushNotification = {
      id: `notif_${Date.now()}`,
      userId,
      templateId,
      title,
      body,
      category: template.category,
      priority: template.priority,
      status: 'pending',
      deviceTokens: this.deviceTokens.get(userId) || [],
      metadata: {
        source: 'system',
        trigger: templateId,
        context
      },
      createdAt: Date.now(),
      scheduledFor: this.calculateScheduledTime(template)
    };

    this.notifications.push(notification);

    // Processar envio
    await this.processNotification(notification);

    return notification;
  }

  // Substituir placeholders
  private replacePlaceholders(text: string, data: { [key: string]: any }): string {
    let result = text;
    
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      result = result.replace(new RegExp(placeholder, 'g'), String(value));
    });
    
    return result;
  }

  // Verificar horário silencioso
  private isInQuietHours(preferences: NotificationPreference): boolean {
    if (!preferences.schedule.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      timeZone: preferences.schedule.quietHours.timezone 
    });
    
    const start = preferences.schedule.quietHours.start;
    const end = preferences.schedule.quietHours.end;
    
    if (start <= end) {
      return currentTime >= start && currentTime <= end;
    } else {
      // Horário silencioso cruza a meia-noite
      return currentTime >= start || currentTime <= end;
    }
  }

  // Verificar se pode enviar notificação
  private canSendNotification(userId: string, preferences: NotificationPreference): boolean {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const oneHourAgo = now - (60 * 60 * 1000);
    
    const todayNotifications = this.notifications.filter(n => 
      n.userId === userId && 
      n.createdAt >= oneDayAgo
    );
    
    const lastHourNotifications = this.notifications.filter(n => 
      n.userId === userId && 
      n.createdAt >= oneHourAgo
    );
    
    if (todayNotifications.length >= preferences.schedule.maxPerDay) return false;
    if (lastHourNotifications.length >= preferences.schedule.maxPerHour) return false;
    
    return true;
  }

  // Calcular tempo agendado
  private calculateScheduledTime(template: NotificationTemplate): number | undefined {
    if (!template.schedule) return undefined;
    
    const now = Date.now();
    
    switch (template.schedule.type) {
      case 'immediate':
        return now;
      case 'delayed':
        return now + (template.schedule.delay || 0) * 1000;
      case 'recurring':
        return now + (template.schedule.interval || 0) * 1000;
      default:
        return now;
    }
  }

  // Processar notificação
  private async processNotification(notification: PushNotification): Promise<void> {
    try {
      notification.status = 'sent';
      notification.sentAt = Date.now();
      
      // Simular envio para dispositivos
      await this.sendToDevices(notification);
      
      notification.status = 'delivered';
      notification.deliveredAt = Date.now();
      
    } catch (error) {
      notification.status = 'failed';
      notification.failedAt = Date.now();
      notification.failureReason = error instanceof Error ? error.message : 'Erro desconhecido';
    }
  }

  // Enviar para dispositivos
  private async sendToDevices(notification: PushNotification): Promise<void> {
    // Simular envio para FCM/APNS
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simular falha ocasional (5% de chance)
    if (Math.random() < 0.05) {
      throw new Error('Falha na entrega da notificação');
    }
  }

  // Enviar notificação em massa
  public async sendBulkNotification(
    userIds: string[],
    templateId: string,
    data: { [key: string]: any } = {},
    context?: any
  ): Promise<PushNotification[]> {
    const notifications: PushNotification[] = [];
    
    for (const userId of userIds) {
      const notification = await this.sendNotification(userId, templateId, data, context);
      if (notification) {
        notifications.push(notification);
      }
    }
    
    return notifications;
  }

  // Criar campanha de notificação
  public createNotificationCampaign(
    name: string,
    description: string,
    templateId: string,
    targetAudience: NotificationCampaign['targetAudience'],
    schedule: NotificationCampaign['schedule'],
    createdBy: string
  ): NotificationCampaign {
    const campaign: NotificationCampaign = {
      id: `campaign_${Date.now()}`,
      name,
      description,
      templateId,
      targetAudience,
      schedule,
      status: 'draft',
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        failed: 0
      },
      createdAt: Date.now(),
      createdBy
    };
    
    this.campaigns.push(campaign);
    return campaign;
  }

  // Executar campanha
  public async executeCampaign(campaignId: string): Promise<boolean> {
    const campaign = this.campaigns.find(c => c.id === campaignId);
    if (!campaign || campaign.status !== 'active') return false;
    
    try {
      campaign.status = 'active';
      
      // Determinar usuários alvo
      const targetUsers = this.getTargetUsers(campaign.targetAudience);
      
      // Enviar notificações
      const notifications = await this.sendBulkNotification(
        targetUsers,
        campaign.templateId,
        {},
        { campaignId: campaign.id }
      );
      
      // Atualizar métricas
      campaign.metrics.sent = notifications.length;
      campaign.metrics.delivered = notifications.filter(n => n.status === 'delivered').length;
      campaign.metrics.failed = notifications.filter(n => n.status === 'failed').length;
      
      return true;
    } catch (error) {
      campaign.status = 'paused';
      return false;
    }
  }

  // Obter usuários alvo
  private getTargetUsers(targetAudience: NotificationCampaign['targetAudience']): string[] {
    // Implementação simplificada - em produção, consultaria o banco de dados
    const allUsers = Array.from(this.preferences.keys()).filter(id => id !== 'default');
    
    switch (targetAudience.type) {
      case 'all':
        return allUsers;
      case 'individual':
        return targetAudience.userIds || [];
      case 'segment':
        // Implementar filtros por segmento
        return allUsers;
      default:
        return [];
    }
  }

  // Obter estatísticas de notificações
  public getNotificationStats(): {
    totalNotifications: number;
    sentNotifications: number;
    deliveredNotifications: number;
    failedNotifications: number;
    deliveryRate: number;
    categoryDistribution: { [key: string]: number };
    priorityDistribution: { [key: string]: number };
  } {
    const totalNotifications = this.notifications.length;
    const sentNotifications = this.notifications.filter(n => n.status === 'sent').length;
    const deliveredNotifications = this.notifications.filter(n => n.status === 'delivered').length;
    const failedNotifications = this.notifications.filter(n => n.status === 'failed').length;
    
    const deliveryRate = totalNotifications > 0 ? 
      (deliveredNotifications / totalNotifications) * 100 : 0;
    
    // Distribuição por categoria
    const categoryDistribution: { [key: string]: number } = {};
    this.notifications.forEach(notification => {
      categoryDistribution[notification.category] = 
        (categoryDistribution[notification.category] || 0) + 1;
    });
    
    // Distribuição por prioridade
    const priorityDistribution: { [key: string]: number } = {};
    this.notifications.forEach(notification => {
      priorityDistribution[notification.priority] = 
        (priorityDistribution[notification.priority] || 0) + 1;
    });
    
    return {
      totalNotifications,
      sentNotifications,
      deliveredNotifications,
      failedNotifications,
      deliveryRate: Math.round(deliveryRate * 100) / 100,
      categoryDistribution,
      priorityDistribution
    };
  }

  // Obter histórico de notificações do usuário
  public getUserNotificationHistory(userId: string): PushNotification[] {
    return this.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  // Marcar notificação como lida
  public markNotificationAsRead(notificationId: string): boolean {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (!notification) return false;
    
    // Adicionar campo de leitura se não existir
    (notification as any).readAt = Date.now();
    return true;
  }

  // Limpar notificações antigas
  public cleanupOldNotifications(daysToKeep: number = 30): number {
    const cutoffDate = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    const initialCount = this.notifications.length;
    
    this.notifications = this.notifications.filter(n => 
      n.createdAt >= cutoffDate || n.status === 'pending'
    );
    
    return initialCount - this.notifications.length;
  }
}

export function createNotificationManager(): NotificationManager {
  return new NotificationManager();
}