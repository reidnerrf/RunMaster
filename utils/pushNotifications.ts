import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../store';
import { 
  addNotificationDevice, 
  updateNotificationPreference,
  sendNotification 
} from '../store/slices/notificationSlice';

// Configurações de notificações
const NOTIFICATION_CONFIG = {
  defaultPreferences: {
    workouts: true,
    achievements: true,
    community: true,
    mentorship: true,
    payments: true,
    wellness: true,
    marketing: false,
    sound: true,
    vibration: true,
    badge: true,
  },
  categories: {
    workouts: {
      id: 'workouts',
      name: 'Treinos',
      description: 'Notificações sobre seus treinos e progresso',
      icon: '🏃‍♂️',
    },
    achievements: {
      id: 'achievements',
      name: 'Conquistas',
      description: 'Notificações sobre conquistas desbloqueadas',
      icon: '🏆',
    },
    community: {
      id: 'community',
      name: 'Comunidade',
      description: 'Notificações sobre atividades da comunidade',
      icon: '👥',
    },
    mentorship: {
      id: 'mentorship',
      name: 'Mentoria',
      description: 'Notificações sobre sessões de mentoria',
      icon: '🎓',
    },
    payments: {
      id: 'payments',
      name: 'Pagamentos',
      description: 'Notificações sobre transações e assinaturas',
      icon: '💳',
    },
    wellness: {
      id: 'wellness',
      name: 'Bem-estar',
      description: 'Notificações sobre nutrição e hidratação',
      icon: '💚',
    },
    marketing: {
      id: 'marketing',
      name: 'Marketing',
      description: 'Notificações promocionais e novidades',
      icon: '📢',
    },
  },
};

// Interface para dispositivo de notificação
interface NotificationDevice {
  id: string;
  token: string;
  platform: 'ios' | 'android' | 'web';
  isActive: boolean;
  lastSeen: string;
  preferences: Record<string, boolean>;
}

// Função principal de configuração
export const setupPushNotifications = async (): Promise<void> => {
  try {
    console.log('🔔 Configurando notificações push...');
    
    // Passo 1: Verificar permissões
    const hasPermission = await checkNotificationPermission();
    
    if (!hasPermission) {
      console.log('❌ Permissão de notificação negada');
      return;
    }
    
    // Passo 2: Configurar dispositivo
    await setupNotificationDevice();
    
    // Passo 3: Configurar preferências padrão
    await setupDefaultPreferences();
    
    // Passo 4: Configurar categorias
    await setupNotificationCategories();
    
    // Passo 5: Configurar handlers
    await setupNotificationHandlers();
    
    console.log('✅ Notificações push configuradas com sucesso');
    
  } catch (error) {
    console.error('❌ Erro na configuração de notificações:', error);
    throw error;
  }
};

// Verificar permissão de notificação
const checkNotificationPermission = async (): Promise<boolean> => {
  try {
    // Em React Native, você usaria expo-notifications ou react-native-push-notification
    // Aqui está uma implementação simulada
    
    const permissionKey = 'notification_permission';
    let permission = await AsyncStorage.getItem(permissionKey);
    
    if (!permission) {
      // Simular solicitação de permissão
      console.log('🔔 Solicitando permissão de notificação...');
      
      // Em produção, usar:
      // const { status } = await Notifications.requestPermissionsAsync();
      // permission = status === 'granted' ? 'granted' : 'denied';
      
      permission = 'granted'; // Simulado para demonstração
      await AsyncStorage.setItem(permissionKey, permission);
    }
    
    return permission === 'granted';
    
  } catch (error) {
    console.error('Erro ao verificar permissão:', error);
    return false;
  }
};

// Configurar dispositivo de notificação
const setupNotificationDevice = async (): Promise<void> => {
  try {
    console.log('📱 Configurando dispositivo de notificação...');
    
    // Em produção, obter token real do dispositivo
    // const token = await Notifications.getExpoPushTokenAsync();
    
    const deviceId = `device_${Date.now()}`;
    const token = `expo_push_token_${Date.now()}`;
    const platform = 'ios'; // Detectar automaticamente
    
    const device: NotificationDevice = {
      id: deviceId,
      token,
      platform,
      isActive: true,
      lastSeen: new Date().toISOString(),
      preferences: NOTIFICATION_CONFIG.defaultPreferences,
    };
    
    // Salvar dispositivo na store
    store.dispatch(addNotificationDevice(device));
    
    // Salvar no AsyncStorage
    await AsyncStorage.setItem('notification_device', JSON.stringify(device));
    
    console.log('✅ Dispositivo configurado:', deviceId);
    
  } catch (error) {
    console.error('Erro ao configurar dispositivo:', error);
    throw error;
  }
};

// Configurar preferências padrão
const setupDefaultPreferences = async (): Promise<void> => {
  try {
    console.log('⚙️ Configurando preferências padrão...');
    
    const userId = 'current_user'; // Obter do contexto de autenticação
    
    // Configurar cada categoria
    Object.entries(NOTIFICATION_CONFIG.categories).forEach(([key, category]) => {
      const isEnabled = NOTIFICATION_CONFIG.defaultPreferences[key as keyof typeof NOTIFICATION_CONFIG.defaultPreferences];
      
      store.dispatch(updateNotificationPreference({
        userId,
        categoryId: category.id,
        isEnabled,
        sound: NOTIFICATION_CONFIG.defaultPreferences.sound,
        vibration: NOTIFICATION_CONFIG.defaultPreferences.vibration,
        badge: NOTIFICATION_CONFIG.defaultPreferences.badge,
      }));
    });
    
    console.log('✅ Preferências padrão configuradas');
    
  } catch (error) {
    console.error('Erro ao configurar preferências:', error);
    throw error;
  }
};

// Configurar categorias de notificação
const setupNotificationCategories = async (): Promise<void> => {
  try {
    console.log('📂 Configurando categorias de notificação...');
    
    // Em produção, usar:
    // await Notifications.setNotificationCategoryAsync(categoryId, actions, options);
    
    Object.values(NOTIFICATION_CONFIG.categories).forEach(category => {
      console.log(`📂 Categoria configurada: ${category.name} (${category.icon})`);
    });
    
    console.log('✅ Categorias configuradas');
    
  } catch (error) {
    console.error('Erro ao configurar categorias:', error);
    throw error;
  }
};

// Configurar handlers de notificação
const setupNotificationHandlers = async (): Promise<void> => {
  try {
    console.log('🎯 Configurando handlers de notificação...');
    
    // Em produção, usar:
    // Notifications.addNotificationReceivedListener(handleNotificationReceived);
    // Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);
    
    console.log('✅ Handlers configurados');
    
  } catch (error) {
    console.error('Erro ao configurar handlers:', error);
    throw error;
  }
};

// Função para enviar notificação local
export const sendLocalNotification = async (
  title: string,
  body: string,
  data?: Record<string, any>,
  category?: string
): Promise<void> => {
  try {
    const userId = 'current_user'; // Obter do contexto de autenticação
    
    const notification = {
      id: `local_${Date.now()}`,
      userId,
      title,
      body,
      data: data || {},
      category: category || 'general',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    
    // Enviar para store
    store.dispatch(sendNotification(notification));
    
    // Em produção, usar:
    // await Notifications.scheduleNotificationAsync({
    //   content: { title, body, data },
    //   trigger: null, // Imediato
    // });
    
    console.log('✅ Notificação local enviada:', title);
    
  } catch (error) {
    console.error('Erro ao enviar notificação local:', error);
    throw error;
  }
};

// Função para agendar notificação
export const scheduleNotification = async (
  title: string,
  body: string,
  trigger: {
    seconds?: number;
    minutes?: number;
    hours?: number;
    days?: number;
    date?: Date;
  },
  data?: Record<string, any>,
  category?: string
): Promise<string> => {
  try {
    const notificationId = `scheduled_${Date.now()}`;
    
    // Em produção, usar:
    // const id = await Notifications.scheduleNotificationAsync({
    //   content: { title, body, data },
    //   trigger,
    // });
    
    console.log('✅ Notificação agendada:', title, 'para', trigger);
    
    return notificationId;
    
  } catch (error) {
    console.error('Erro ao agendar notificação:', error);
    throw error;
  }
};

// Função para cancelar notificação agendada
export const cancelScheduledNotification = async (notificationId: string): Promise<void> => {
  try {
    // Em produção, usar:
    // await Notifications.cancelScheduledNotificationAsync(notificationId);
    
    console.log('✅ Notificação cancelada:', notificationId);
    
  } catch (error) {
    console.error('Erro ao cancelar notificação:', error);
    throw error;
  }
};

// Função para obter notificações agendadas
export const getScheduledNotifications = async (): Promise<any[]> => {
  try {
    // Em produção, usar:
    // return await Notifications.getAllScheduledNotificationsAsync();
    
    return [];
    
  } catch (error) {
    console.error('Erro ao obter notificações agendadas:', error);
    return [];
  }
};

// Função para limpar todas as notificações
export const clearAllNotifications = async (): Promise<void> => {
  try {
    // Em produção, usar:
    // await Notifications.dismissAllNotificationsAsync();
    
    console.log('✅ Todas as notificações foram limpas');
    
  } catch (error) {
    console.error('Erro ao limpar notificações:', error);
    throw error;
  }
};

// Função para verificar se as notificações estão ativas
export const areNotificationsActive = async (): Promise<boolean> => {
  try {
    const device = await AsyncStorage.getItem('notification_device');
    if (!device) return false;
    
    const deviceData: NotificationDevice = JSON.parse(device);
    return deviceData.isActive;
    
  } catch (error) {
    console.error('Erro ao verificar status das notificações:', error);
    return false;
  }
};

// Função para ativar/desativar notificações
export const toggleNotifications = async (enabled: boolean): Promise<void> => {
  try {
    const device = await AsyncStorage.getItem('notification_device');
    if (!device) return;
    
    const deviceData: NotificationDevice = JSON.parse(device);
    deviceData.isActive = enabled;
    
    await AsyncStorage.setItem('notification_device', JSON.stringify(deviceData));
    
    console.log(`✅ Notificações ${enabled ? 'ativadas' : 'desativadas'}`);
    
  } catch (error) {
    console.error('Erro ao alternar notificações:', error);
    throw error;
  }
};

// Função para obter estatísticas de notificação
export const getNotificationStats = async (): Promise<{
  totalSent: number;
  totalRead: number;
  totalUnread: number;
  categories: Record<string, number>;
}> => {
  try {
    const state = store.getState();
    const notifications = state.notification.userNotifications;
    
    const stats = {
      totalSent: notifications.length,
      totalRead: notifications.filter(n => n.isRead).length,
      totalUnread: notifications.filter(n => !n.isRead).length,
      categories: {} as Record<string, number>,
    };
    
    // Contar por categoria
    notifications.forEach(notification => {
      const category = notification.category || 'general';
      stats.categories[category] = (stats.categories[category] || 0) + 1;
    });
    
    return stats;
    
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    return {
      totalSent: 0,
      totalRead: 0,
      totalUnread: 0,
      categories: {},
    };
  }
};

export default {
  setupPushNotifications,
  sendLocalNotification,
  scheduleNotification,
  cancelScheduledNotification,
  getScheduledNotifications,
  clearAllNotifications,
  areNotificationsActive,
  toggleNotifications,
  getNotificationStats,
};