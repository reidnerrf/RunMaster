import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../store';
import { 
  syncPendingChanges,
  getStoreStats 
} from '../store/utils';

// Configurações de sincronização
const SYNC_CONFIG = {
  baseUrl: 'https://api.runtracker.com/v1',
  timeout: 30000, // 30 segundos
  retryAttempts: 3,
  retryDelay: 5000, // 5 segundos
  batchSize: 50, // itens por lote
  syncInterval: 2 * 60 * 1000, // 2 minutos
  maxOfflineData: 1000, // máximo de dados offline
  compression: true,
  encryption: true,
};

// Interface para dados de sincronização
interface SyncData {
  id: string;
  type: 'user' | 'workout' | 'community' | 'mentorship' | 'explorer' | 'payment' | 'gamification';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: string;
  userId: string;
  deviceId: string;
  version: number;
}

// Interface para resposta de sincronização
interface SyncResponse {
  success: boolean;
  syncedItems: string[];
  conflicts: Array<{
    id: string;
    type: string;
    localVersion: number;
    serverVersion: number;
    resolution: 'local' | 'server' | 'manual';
  }>;
  errors: Array<{
    id: string;
    type: string;
    error: string;
    retry: boolean;
  }>;
  serverTimestamp: string;
  nextSync: string;
}

// Interface para status de sincronização
interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSync: string | null;
  nextSync: string | null;
  pendingItems: number;
  syncedItems: number;
  failedItems: number;
  conflicts: number;
  errors: string[];
}

// Interface para configuração de API
interface ApiConfig {
  baseUrl: string;
  timeout: number;
  headers: Record<string, string>;
  retryAttempts: number;
  retryDelay: number;
}

// Classe principal de sincronização
class SyncService {
  private isOnline: boolean = true;
  private isSyncing: boolean = false;
  private syncInterval: NodeJS.Timeout | null = null;
  private apiConfig: ApiConfig;
  private deviceId: string = '';

  constructor() {
    this.apiConfig = {
      baseUrl: SYNC_CONFIG.baseUrl,
      timeout: SYNC_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'RunTracker/1.0.0',
      },
      retryAttempts: SYNC_CONFIG.retryAttempts,
      retryDelay: SYNC_CONFIG.retryDelay,
    };
    
    this.initialize();
  }

  // Inicializar serviço
  private async initialize(): Promise<void> {
    try {
      console.log('🔄 Inicializando serviço de sincronização...');
      
      // Obter ID do dispositivo
      this.deviceId = await this.getDeviceId();
      
      // Verificar conectividade
      this.isOnline = await this.checkConnectivity();
      
      // Configurar intervalo de sincronização
      this.setupSyncInterval();
      
      // Configurar listeners de conectividade
      this.setupConnectivityListeners();
      
      console.log('✅ Serviço de sincronização inicializado');
      
    } catch (error) {
      console.error('❌ Erro na inicialização do serviço de sincronização:', error);
    }
  }

  // Obter ID do dispositivo
  private async getDeviceId(): Promise<string> {
    try {
      let deviceId = await AsyncStorage.getItem('device_id');
      
      if (!deviceId) {
        deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await AsyncStorage.setItem('device_id', deviceId);
      }
      
      return deviceId;
    } catch (error) {
      console.error('Erro ao obter ID do dispositivo:', error);
      return `device_${Date.now()}`;
    }
  }

  // Verificar conectividade
  private async checkConnectivity(): Promise<boolean> {
    try {
      // Em produção, usar:
      // const response = await fetch('https://www.google.com', { mode: 'no-cors' });
      // return true;
      
      // Simular conectividade para demonstração
      return true;
    } catch (error) {
      console.log('❌ Sem conectividade com a internet');
      return false;
    }
  }

  // Configurar intervalo de sincronização
  private setupSyncInterval(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    this.syncInterval = setInterval(async () => {
      if (this.isOnline && !this.isSyncing) {
        await this.performSync();
      }
    }, SYNC_CONFIG.syncInterval);
  }

  // Configurar listeners de conectividade
  private setupConnectivityListeners(): void {
    // Em produção, usar:
    // NetInfo.addEventListener(state => {
    //   this.isOnline = state.isConnected && state.isInternetReachable;
    //   this.handleConnectivityChange();
    // });
    
    // Simular mudança de conectividade para demonstração
    setInterval(() => {
      this.isOnline = Math.random() > 0.1; // 90% de chance de estar online
      this.handleConnectivityChange();
    }, 30000);
  }

  // Manipular mudança de conectividade
  private handleConnectivityChange(): void {
    if (this.isOnline) {
      console.log('🌐 Conectividade restaurada');
      this.performSync();
    } else {
      console.log('📡 Conectividade perdida');
      this.stopSync();
    }
  }

  // Iniciar sincronização
  public async startSync(): Promise<void> {
    try {
      if (this.isSyncing) {
        console.log('⏳ Sincronização já em andamento');
        return;
      }
      
      console.log('🚀 Iniciando sincronização...');
      this.isSyncing = true;
      
      await this.performSync();
      
    } catch (error) {
      console.error('❌ Erro ao iniciar sincronização:', error);
      this.isSyncing = false;
    }
  }

  // Parar sincronização
  public stopSync(): void {
    console.log('🛑 Parando sincronização...');
    this.isSyncing = false;
  }

  // Executar sincronização
  private async performSync(): Promise<void> {
    try {
      if (!this.isOnline) {
        console.log('📡 Sem conectividade, pulando sincronização');
        return;
      }
      
      // Obter dados pendentes
      const pendingData = await this.getPendingData();
      
      if (pendingData.length === 0) {
        console.log('✅ Nenhum dado pendente para sincronizar');
        return;
      }
      
      console.log(`📤 Sincronizando ${pendingData.length} itens...`);
      
      // Sincronizar em lotes
      const batches = this.createBatches(pendingData, SYNC_CONFIG.batchSize);
      
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        console.log(`📦 Processando lote ${i + 1}/${batches.length} (${batch.length} itens)`);
        
        const response = await this.syncBatch(batch);
        
        if (response.success) {
          await this.handleSuccessfulSync(response, batch);
        } else {
          await this.handleFailedSync(response, batch);
        }
        
        // Aguardar entre lotes para não sobrecarregar o servidor
        if (i < batches.length - 1) {
          await this.delay(1000);
        }
      }
      
      console.log('✅ Sincronização concluída');
      
    } catch (error) {
      console.error('❌ Erro durante sincronização:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  // Obter dados pendentes
  private async getPendingData(): Promise<SyncData[]> {
    try {
      const state = store.getState();
      const pendingData: SyncData[] = [];
      
      // Obter mudanças pendentes de cada slice
      const slices = ['user', 'workout', 'community', 'mentorship', 'explorer', 'payment', 'gamification'];
      
      slices.forEach(sliceName => {
        const slice = state[sliceName as keyof typeof state];
        if (slice && slice.pendingChanges) {
          slice.pendingChanges.forEach(change => {
            pendingData.push({
              id: `${sliceName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              type: sliceName as SyncData['type'],
              action: 'update',
              data: { change },
              timestamp: new Date().toISOString(),
              userId: 'current_user',
              deviceId: this.deviceId,
              version: 1,
            });
          });
        }
      });
      
      return pendingData;
      
    } catch (error) {
      console.error('Erro ao obter dados pendentes:', error);
      return [];
    }
  }

  // Criar lotes de dados
  private createBatches(data: SyncData[], batchSize: number): SyncData[][] {
    const batches: SyncData[][] = [];
    
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }
    
    return batches;
  }

  // Sincronizar lote de dados
  private async syncBatch(batch: SyncData[]): Promise<SyncResponse> {
    try {
      const url = `${this.apiConfig.baseUrl}/sync`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: this.apiConfig.headers,
        body: JSON.stringify({
          deviceId: this.deviceId,
          userId: 'current_user',
          timestamp: new Date().toISOString(),
          data: batch,
        }),
        signal: AbortSignal.timeout(this.apiConfig.timeout),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result: SyncResponse = await response.json();
      return result;
      
    } catch (error) {
      console.error('Erro ao sincronizar lote:', error);
      
      // Retornar resposta de erro
      return {
        success: false,
        syncedItems: [],
        conflicts: [],
        errors: batch.map(item => ({
          id: item.id,
          type: item.type,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
          retry: true,
        })),
        serverTimestamp: new Date().toISOString(),
        nextSync: new Date(Date.now() + SYNC_CONFIG.retryDelay).toISOString(),
      };
    }
  }

  // Manipular sincronização bem-sucedida
  private async handleSuccessfulSync(response: SyncResponse, batch: SyncData[]): Promise<void> {
    try {
      console.log(`✅ Lote sincronizado: ${response.syncedItems.length} itens`);
      
      // Limpar mudanças pendentes
      await this.clearPendingChanges(response.syncedItems);
      
      // Atualizar timestamp da última sincronização
      await this.updateLastSyncTimestamp(response.serverTimestamp);
      
      // Processar conflitos se houver
      if (response.conflicts.length > 0) {
        await this.handleConflicts(response.conflicts);
      }
      
    } catch (error) {
      console.error('Erro ao processar sincronização bem-sucedida:', error);
    }
  }

  // Manipular sincronização falhada
  private async handleFailedSync(response: SyncResponse, batch: SyncData[]): Promise<void> {
    try {
      console.log(`❌ Falha na sincronização: ${response.errors.length} erros`);
      
      // Processar erros
      const retryErrors = response.errors.filter(error => error.retry);
      const permanentErrors = response.errors.filter(error => !error.retry);
      
      if (retryErrors.length > 0) {
        console.log(`🔄 ${retryErrors.length} itens serão tentados novamente`);
        // Adicionar à fila de retry
        await this.addToRetryQueue(retryErrors);
      }
      
      if (permanentErrors.length > 0) {
        console.log(`💀 ${permanentErrors.length} itens falharam permanentemente`);
        // Marcar como falhado permanentemente
        await this.markAsPermanentlyFailed(permanentErrors);
      }
      
    } catch (error) {
      console.error('Erro ao processar falha na sincronização:', error);
    }
  }

  // Limpar mudanças pendentes
  private async clearPendingChanges(syncedItems: string[]): Promise<void> {
    try {
      // Limpar mudanças pendentes de cada slice
      const slices = ['user', 'workout', 'community', 'mentorship', 'explorer', 'payment', 'gamification'];
      
      slices.forEach(sliceName => {
        store.dispatch({
          type: `${sliceName}/clearPendingChanges`,
        });
      });
      
      console.log(`🧹 ${syncedItems.length} mudanças pendentes limpas`);
      
    } catch (error) {
      console.error('Erro ao limpar mudanças pendentes:', error);
    }
  }

  // Atualizar timestamp da última sincronização
  private async updateLastSyncTimestamp(timestamp: string): Promise<void> {
    try {
      await AsyncStorage.setItem('last_sync_timestamp', timestamp);
      console.log(`⏰ Timestamp de sincronização atualizado: ${timestamp}`);
      
    } catch (error) {
      console.error('Erro ao atualizar timestamp de sincronização:', error);
    }
  }

  // Manipular conflitos
  private async handleConflicts(conflicts: SyncResponse['conflicts']): Promise<void> {
    try {
      console.log(`⚠️ Processando ${conflicts.length} conflitos...`);
      
      for (const conflict of conflicts) {
        console.log(`🔄 Resolvendo conflito: ${conflict.type} (${conflict.id})`);
        
        // Implementar lógica de resolução de conflitos
        switch (conflict.resolution) {
          case 'local':
            console.log('📱 Usando versão local');
            break;
          case 'server':
            console.log('🌐 Usando versão do servidor');
            break;
          case 'manual':
            console.log('👤 Resolução manual necessária');
            break;
        }
      }
      
      console.log('✅ Conflitos processados');
      
    } catch (error) {
      console.error('Erro ao processar conflitos:', error);
    }
  }

  // Adicionar à fila de retry
  private async addToRetryQueue(errors: SyncResponse['errors']): Promise<void> {
    try {
      const retryQueue = await this.getRetryQueue();
      
      errors.forEach(error => {
        retryQueue.push({
          ...error,
          retryCount: 0,
          nextRetry: new Date(Date.now() + SYNC_CONFIG.retryDelay).toISOString(),
        });
      });
      
      await AsyncStorage.setItem('retry_queue', JSON.stringify(retryQueue));
      console.log(`📋 ${errors.length} itens adicionados à fila de retry`);
      
    } catch (error) {
      console.error('Erro ao adicionar à fila de retry:', error);
    }
  }

  // Marcar como falhado permanentemente
  private async markAsPermanentlyFailed(errors: SyncResponse['errors']): Promise<void> {
    try {
      const failedItems = await this.getFailedItems();
      
      errors.forEach(error => {
        failedItems.push({
          ...error,
          failedAt: new Date().toISOString(),
          reason: error.error,
        });
      });
      
      await AsyncStorage.setItem('failed_items', JSON.stringify(failedItems));
      console.log(`💀 ${errors.length} itens marcados como falhados permanentemente`);
      
    } catch (error) {
      console.error('Erro ao marcar como falhado:', error);
    }
  }

  // Obter fila de retry
  private async getRetryQueue(): Promise<any[]> {
    try {
      const queue = await AsyncStorage.getItem('retry_queue');
      return queue ? JSON.parse(queue) : [];
    } catch (error) {
      console.error('Erro ao obter fila de retry:', error);
      return [];
    }
  }

  // Obter itens falhados
  private async getFailedItems(): Promise<any[]> {
    try {
      const items = await AsyncStorage.getItem('failed_items');
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Erro ao obter itens falhados:', error);
      return [];
    }
  }

  // Obter status de sincronização
  public async getSyncStatus(): Promise<SyncStatus> {
    try {
      const lastSync = await AsyncStorage.getItem('last_sync_timestamp');
      const pendingData = await this.getPendingData();
      const retryQueue = await this.getRetryQueue();
      const failedItems = await this.getFailedItems();
      
      return {
        isOnline: this.isOnline,
        isSyncing: this.isSyncing,
        lastSync,
        nextSync: this.syncInterval ? new Date(Date.now() + SYNC_CONFIG.syncInterval).toISOString() : null,
        pendingItems: pendingData.length,
        syncedItems: 0, // Seria calculado baseado no histórico
        failedItems: failedItems.length,
        conflicts: 0, // Seria calculado baseado no histórico
        errors: [], // Seria obtido do histórico
      };
      
    } catch (error) {
      console.error('Erro ao obter status de sincronização:', error);
      return {
        isOnline: false,
        isSyncing: false,
        lastSync: null,
        nextSync: null,
        pendingItems: 0,
        syncedItems: 0,
        failedItems: 0,
        conflicts: 0,
        errors: [],
      };
    }
  }

  // Forçar sincronização
  public async forceSync(): Promise<boolean> {
    try {
      console.log('🚀 Forçando sincronização...');
      
      if (this.isSyncing) {
        console.log('⏳ Sincronização já em andamento');
        return false;
      }
      
      await this.performSync();
      return true;
      
    } catch (error) {
      console.error('❌ Erro na sincronização forçada:', error);
      return false;
    }
  }

  // Limpar dados de sincronização
  public async clearSyncData(): Promise<void> {
    try {
      console.log('🧹 Limpando dados de sincronização...');
      
      await AsyncStorage.multiRemove([
        'last_sync_timestamp',
        'retry_queue',
        'failed_items',
      ]);
      
      console.log('✅ Dados de sincronização limpos');
      
    } catch (error) {
      console.error('Erro ao limpar dados de sincronização:', error);
    }
  }

  // Utilitário para delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Instância singleton do serviço
const syncService = new SyncService();

// Exportar funções públicas
export const startSync = () => syncService.startSync();
export const stopSync = () => syncService.stopSync();
export const forceSync = () => syncService.forceSync();
export const getSyncStatus = () => syncService.getSyncStatus();
export const clearSyncData = () => syncService.clearSyncData();

export default syncService;