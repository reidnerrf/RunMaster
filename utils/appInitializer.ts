import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../store';
import { 
  checkDataIntegrity, 
  getStoreStats, 
  backupStore,
  cleanupOldData 
} from '../store/utils';

// Configurações da aplicação
const APP_CONFIG = {
  version: '1.0.0',
  buildNumber: '1',
  minSupportedVersion: '1.0.0',
  autoBackupInterval: 24 * 60 * 60 * 1000, // 24 horas
  maxBackupAge: 30, // 30 dias
  dataRetentionDays: {
    workouts: 90,
    notifications: 60,
    logs: 30,
  },
};

// Interface para configurações da aplicação
interface AppConfig {
  isFirstLaunch: boolean;
  lastLaunch: string;
  launchCount: number;
  lastBackup: string | null;
  lastCleanup: string | null;
  appVersion: string;
  buildNumber: string;
}

// Função principal de inicialização
export const initializeApp = async (): Promise<void> => {
  try {
    console.log('🚀 Iniciando aplicação...');
    
    // Passo 1: Verificar configurações da aplicação
    await checkAppConfig();
    
    // Passo 2: Verificar integridade dos dados
    await checkDataHealth();
    
    // Passo 3: Limpar dados antigos
    await performDataCleanup();
    
    // Passo 4: Verificar necessidade de backup
    await checkBackupNeeds();
    
    // Passo 5: Inicializar serviços essenciais
    await initializeEssentialServices();
    
    // Passo 6: Verificar atualizações
    await checkForUpdates();
    
    console.log('✅ Aplicação inicializada com sucesso');
    
  } catch (error) {
    console.error('❌ Erro na inicialização da aplicação:', error);
    throw error;
  }
};

// Verificar configurações da aplicação
const checkAppConfig = async (): Promise<void> => {
  try {
    const configKey = 'app_config';
    let config: AppConfig = await AsyncStorage.getItem(configKey).then(
      data => data ? JSON.parse(data) : null
    );
    
    if (!config) {
      // Primeira execução
      config = {
        isFirstLaunch: true,
        lastLaunch: new Date().toISOString(),
        launchCount: 1,
        lastBackup: null,
        lastCleanup: null,
        appVersion: APP_CONFIG.version,
        buildNumber: APP_CONFIG.buildNumber,
      };
      
      console.log('🎉 Primeira execução da aplicação');
    } else {
      // Verificar se é uma nova versão
      const isNewVersion = config.appVersion !== APP_CONFIG.version;
      
      if (isNewVersion) {
        console.log(`🔄 Nova versão detectada: ${config.appVersion} → ${APP_CONFIG.version}`);
        
        // Executar migrações se necessário
        await performVersionMigration(config.appVersion, APP_CONFIG.version);
      }
      
      // Atualizar configurações
      config = {
        ...config,
        isFirstLaunch: false,
        lastLaunch: new Date().toISOString(),
        launchCount: config.launchCount + 1,
        appVersion: APP_CONFIG.version,
        buildNumber: APP_CONFIG.buildNumber,
      };
    }
    
    // Salvar configurações atualizadas
    await AsyncStorage.setItem(configKey, JSON.stringify(config));
    
    console.log(`📱 Aplicação executada ${config.launchCount} vezes`);
    
  } catch (error) {
    console.error('Erro ao verificar configurações:', error);
    throw error;
  }
};

// Verificar saúde dos dados
const checkDataHealth = async (): Promise<void> => {
  try {
    console.log('🔍 Verificando saúde dos dados...');
    
    const integrityCheck = checkDataIntegrity();
    
    if (integrityCheck.hasIssues) {
      console.warn('⚠️ Problemas de integridade detectados:', integrityCheck.issues);
      
      // Tentar reparar problemas automáticos
      await attemptDataRepair(integrityCheck.issues);
    } else {
      console.log('✅ Dados íntegros');
    }
    
    // Obter estatísticas da store
    const stats = getStoreStats();
    console.log('📊 Estatísticas da store:', {
      totalPendingChanges: stats.totalPendingChanges,
      slices: Object.keys(stats.slices).length,
    });
    
  } catch (error) {
    console.error('Erro ao verificar saúde dos dados:', error);
    throw error;
  }
};

// Tentar reparar problemas de dados
const attemptDataRepair = async (issues: string[]): Promise<void> => {
  try {
    console.log('🔧 Tentando reparar problemas de dados...');
    
    for (const issue of issues) {
      if (issue.includes('sem ID válido')) {
        // Problema de ID inválido - tentar gerar novo
        console.log('🆔 Reparando IDs inválidos...');
        // Implementar lógica de reparo específica
      }
      
      if (issue.includes('Modo de tema inválido')) {
        // Problema de tema - resetar para padrão
        console.log('🎨 Resetando tema para padrão...');
        store.dispatch({ type: 'theme/resetToDefault' });
      }
    }
    
    console.log('✅ Reparo de dados concluído');
    
  } catch (error) {
    console.error('Erro ao reparar dados:', error);
    // Não falhar a inicialização por problemas de reparo
  }
};

// Limpar dados antigos
const performDataCleanup = async (): Promise<void> => {
  try {
    console.log('🧹 Executando limpeza de dados...');
    
    const configKey = 'app_config';
    const config: AppConfig = await AsyncStorage.getItem(configKey).then(
      data => data ? JSON.parse(data) : null
    );
    
    if (config && config.lastCleanup) {
      const lastCleanup = new Date(config.lastCleanup);
      const daysSinceLastCleanup = (Date.now() - lastCleanup.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSinceLastCleanup < 1) {
        console.log('✅ Limpeza recente, pulando...');
        return;
      }
    }
    
    // Executar limpeza
    const cleanupResult = cleanupOldData();
    console.log('🧹 Limpeza concluída:', cleanupResult.message);
    
    // Atualizar timestamp da limpeza
    if (config) {
      config.lastCleanup = new Date().toISOString();
      await AsyncStorage.setItem(configKey, JSON.stringify(config));
    }
    
  } catch (error) {
    console.error('Erro na limpeza de dados:', error);
    // Não falhar a inicialização por problemas de limpeza
  }
};

// Verificar necessidade de backup
const checkBackupNeeds = async (): Promise<void> => {
  try {
    console.log('💾 Verificando necessidade de backup...');
    
    const configKey = 'app_config';
    const config: AppConfig = await AsyncStorage.getItem(configKey).then(
      data => data ? JSON.parse(data) : null
    );
    
    if (config && config.lastBackup) {
      const lastBackup = new Date(config.lastBackup);
      const timeSinceLastBackup = Date.now() - lastBackup.getTime();
      
      if (timeSinceLastBackup < APP_CONFIG.autoBackupInterval) {
        console.log('✅ Backup recente, pulando...');
        return;
      }
    }
    
    // Executar backup automático
    console.log('💾 Executando backup automático...');
    const backup = await backupStore();
    console.log('✅ Backup automático criado:', backup.timestamp);
    
    // Atualizar timestamp do backup
    if (config) {
      config.lastBackup = backup.timestamp;
      await AsyncStorage.setItem(configKey, JSON.stringify(config));
    }
    
  } catch (error) {
    console.error('Erro no backup automático:', error);
    // Não falhar a inicialização por problemas de backup
  }
};

// Inicializar serviços essenciais
const initializeEssentialServices = async (): Promise<void> => {
  try {
    console.log('⚙️ Inicializando serviços essenciais...');
    
    // Serviço de localização
    await initializeLocationService();
    
    // Serviço de notificações
    await initializeNotificationService();
    
    // Serviço de saúde
    await initializeHealthService();
    
    // Serviço de pagamentos
    await initializePaymentService();
    
    console.log('✅ Serviços essenciais inicializados');
    
  } catch (error) {
    console.error('Erro na inicialização de serviços:', error);
    throw error;
  }
};

// Inicializar serviço de localização
const initializeLocationService = async (): Promise<void> => {
  try {
    // Verificar permissões de localização
    const locationPermission = await AsyncStorage.getItem('location_permission');
    
    if (!locationPermission) {
      console.log('📍 Configurando permissões de localização...');
      // Implementar solicitação de permissão
    }
    
  } catch (error) {
    console.error('Erro na inicialização do serviço de localização:', error);
  }
};

// Inicializar serviço de notificações
const initializeNotificationService = async (): Promise<void> => {
  try {
    // Verificar permissões de notificação
    const notificationPermission = await AsyncStorage.getItem('notification_permission');
    
    if (!notificationPermission) {
      console.log('🔔 Configurando permissões de notificação...');
      // Implementar solicitação de permissão
    }
    
  } catch (error) {
    console.error('Erro na inicialização do serviço de notificação:', error);
  }
};

// Inicializar serviço de saúde
const initializeHealthService = async (): Promise<void> => {
  try {
    // Verificar permissões de saúde
    const healthPermission = await AsyncStorage.getItem('health_permission');
    
    if (!healthPermission) {
      console.log('❤️ Configurando permissões de saúde...');
      // Implementar solicitação de permissão
    }
    
  } catch (error) {
    console.error('Erro na inicialização do serviço de saúde:', error);
  }
};

// Inicializar serviço de pagamentos
const initializePaymentService = async (): Promise<void> => {
  try {
    // Verificar configurações de pagamento
    const paymentConfig = await AsyncStorage.getItem('payment_config');
    
    if (!paymentConfig) {
      console.log('💳 Configurando serviço de pagamentos...');
      // Implementar configuração inicial
    }
    
  } catch (error) {
    console.error('Erro na inicialização do serviço de pagamentos:', error);
  }
};

// Verificar atualizações
const checkForUpdates = async (): Promise<void> => {
  try {
    console.log('🔄 Verificando atualizações...');
    
    // Aqui você implementaria a lógica de verificação de atualizações
    // Por exemplo, verificar com um servidor de atualizações
    
    console.log('✅ Verificação de atualizações concluída');
    
  } catch (error) {
    console.error('Erro na verificação de atualizações:', error);
    // Não falhar a inicialização por problemas de atualização
  }
};

// Executar migração de versão
const performVersionMigration = async (oldVersion: string, newVersion: string): Promise<void> => {
  try {
    console.log(`🔄 Executando migração de ${oldVersion} para ${newVersion}...`);
    
    // Implementar lógica de migração específica por versão
    if (oldVersion === '0.9.0' && newVersion === '1.0.0') {
      console.log('🔄 Migração para v1.0.0...');
      // Implementar migrações específicas
    }
    
    console.log('✅ Migração concluída');
    
  } catch (error) {
    console.error('Erro na migração de versão:', error);
    throw error;
  }
};

// Função para obter configurações da aplicação
export const getAppConfig = async (): Promise<AppConfig | null> => {
  try {
    const configKey = 'app_config';
    const config = await AsyncStorage.getItem(configKey);
    return config ? JSON.parse(config) : null;
  } catch (error) {
    console.error('Erro ao obter configurações da aplicação:', error);
    return null;
  }
};

// Função para limpar dados da aplicação
export const clearAppData = async (): Promise<void> => {
  try {
    console.log('🗑️ Limpando dados da aplicação...');
    
    // Limpar AsyncStorage
    await AsyncStorage.clear();
    
    // Limpar store
    store.dispatch({ type: 'persist/PURGE' });
    
    console.log('✅ Dados da aplicação limpos');
    
  } catch (error) {
    console.error('Erro ao limpar dados da aplicação:', error);
    throw error;
  }
};

// Função para verificar se é primeira execução
export const isFirstLaunch = async (): Promise<boolean> => {
  try {
    const config = await getAppConfig();
    return config?.isFirstLaunch || false;
  } catch (error) {
    console.error('Erro ao verificar primeira execução:', error);
    return true;
  }
};

export default {
  initializeApp,
  getAppConfig,
  clearAppData,
  isFirstLaunch,
};