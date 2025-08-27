import { store, persistor } from './index';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipos
export interface StoreBackup {
  timestamp: string;
  version: string;
  data: any;
  metadata: {
    totalSize: number;
    sliceCount: number;
    userCount: number;
    workoutCount: number;
  };
}

export interface StoreRestore {
  success: boolean;
  message: string;
  restoredSlices: string[];
  errors: string[];
  timestamp: string;
}

export interface StoreMetrics {
  totalSize: number;
  sliceSizes: Record<string, number>;
  lastBackup: string | null;
  lastRestore: string | null;
  backupCount: number;
  restoreCount: number;
}

// Função para fazer backup da store
export const backupStore = async (): Promise<StoreBackup> => {
  try {
    const state = store.getState();
    const timestamp = new Date().toISOString();
    
    // Calcula tamanhos dos slices
    const sliceSizes: Record<string, number> = {};
    let totalSize = 0;
    
    Object.keys(state).forEach(sliceName => {
      const sliceData = JSON.stringify(state[sliceName as keyof typeof state]);
      const size = new Blob([sliceData]).size;
      sliceSizes[sliceName] = size;
      totalSize += size;
    });
    
    // Cria backup
    const backup: StoreBackup = {
      timestamp,
      version: '1.0.0',
      data: state,
      metadata: {
        totalSize,
        sliceCount: Object.keys(state).length,
        userCount: state.user?.currentUser ? 1 : 0,
        workoutCount: state.workout?.sessions?.length || 0,
      },
    };
    
    // Salva backup no AsyncStorage
    const backupKey = `store_backup_${timestamp.replace(/[:.]/g, '-')}`;
    await AsyncStorage.setItem(backupKey, JSON.stringify(backup));
    
    // Salva metadados do backup
    const backupMetadata = await AsyncStorage.getItem('store_backups_metadata');
    const metadata = backupMetadata ? JSON.parse(backupMetadata) : { backups: [] };
    metadata.backups.push({
      key: backupKey,
      timestamp,
      size: totalSize,
    });
    
    // Mantém apenas os últimos 10 backups
    if (metadata.backups.length > 10) {
      const oldestBackup = metadata.backups.shift();
      if (oldestBackup) {
        await AsyncStorage.removeItem(oldestBackup.key);
      }
    }
    
    await AsyncStorage.setItem('store_backups_metadata', JSON.stringify(metadata));
    
    return backup;
  } catch (error) {
    throw new Error(`Erro ao fazer backup: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

// Função para restaurar store de um backup
export const restoreStore = async (backupKey: string): Promise<StoreRestore> => {
  try {
    // Busca backup
    const backupData = await AsyncStorage.getItem(backupKey);
    if (!backupData) {
      throw new Error('Backup não encontrado');
    }
    
    const backup: StoreBackup = JSON.parse(backupData);
    
    // Valida versão
    if (backup.version !== '1.0.0') {
      throw new Error('Versão de backup incompatível');
    }
    
    // Restaura dados slice por slice
    const restoredSlices: string[] = [];
    const errors: string[] = [];
    
    Object.keys(backup.data).forEach(sliceName => {
      try {
        store.dispatch({
          type: `${sliceName}/restoreFromBackup`,
          payload: backup.data[sliceName],
        });
        restoredSlices.push(sliceName);
      } catch (error) {
        errors.push(`Erro ao restaurar ${sliceName}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    });
    
    // Força persistência
    await persistor.flush();
    
    const result: StoreRestore = {
      success: errors.length === 0,
      message: errors.length === 0 
        ? 'Store restaurada com sucesso' 
        : `Store restaurada com ${errors.length} erros`,
      restoredSlices,
      errors,
      timestamp: new Date().toISOString(),
    };
    
    // Salva metadados da restauração
    const restoreMetadata = await AsyncStorage.getItem('store_restores_metadata');
    const metadata = restoreMetadata ? JSON.parse(restoreMetadata) : { restores: [] };
    metadata.restores.push({
      backupKey,
      timestamp: result.timestamp,
      success: result.success,
      errorCount: errors.length,
    });
    
    // Mantém apenas os últimos 20 registros
    if (metadata.restores.length > 20) {
      metadata.restores = metadata.restores.slice(-20);
    }
    
    await AsyncStorage.setItem('store_restores_metadata', JSON.stringify(metadata));
    
    return result;
  } catch (error) {
    throw new Error(`Erro ao restaurar store: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

// Função para listar backups disponíveis
export const listBackups = async (): Promise<Array<{ key: string; timestamp: string; size: number }>> => {
  try {
    const backupMetadata = await AsyncStorage.getItem('store_backups_metadata');
    if (!backupMetadata) {
      return [];
    }
    
    const metadata = JSON.parse(backupMetadata);
    return metadata.backups || [];
  } catch (error) {
    console.error('Erro ao listar backups:', error);
    return [];
  }
};

// Função para obter métricas da store
export const getStoreMetrics = async (): Promise<StoreMetrics> => {
  try {
    const state = store.getState();
    
    // Calcula tamanhos dos slices
    const sliceSizes: Record<string, number> = {};
    let totalSize = 0;
    
    Object.keys(state).forEach(sliceName => {
      const sliceData = JSON.stringify(state[sliceName as keyof typeof state]);
      const size = new Blob([sliceData]).size;
      sliceSizes[sliceName] = size;
      totalSize += size;
    });
    
    // Busca metadados de backup e restore
    const backupMetadata = await AsyncStorage.getItem('store_backups_metadata');
    const restoreMetadata = await AsyncStorage.getItem('store_restores_metadata');
    
    const backups = backupMetadata ? JSON.parse(backupMetadata) : { backups: [] };
    const restores = restoreMetadata ? JSON.parse(restoreMetadata) : { restores: [] };
    
    return {
      totalSize,
      sliceSizes,
      lastBackup: backups.backups.length > 0 ? backups.backups[backups.backups.length - 1].timestamp : null,
      lastRestore: restores.restores.length > 0 ? restores.restores[restores.restores.length - 1].timestamp : null,
      backupCount: backups.backups.length,
      restoreCount: restores.restores.length,
    };
  } catch (error) {
    throw new Error(`Erro ao obter métricas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

// Função para limpar backups antigos
export const cleanupOldBackups = async (maxAge: number = 30): Promise<{ removed: number; remaining: number }> => {
  try {
    const backupMetadata = await AsyncStorage.getItem('store_backups_metadata');
    if (!backupMetadata) {
      return { removed: 0, remaining: 0 };
    }
    
    const metadata = JSON.parse(backupMetadata);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - maxAge);
    
    const oldBackups = metadata.backups.filter((backup: any) => 
      new Date(backup.timestamp) < cutoffDate
    );
    
    // Remove backups antigos
    for (const backup of oldBackups) {
      await AsyncStorage.removeItem(backup.key);
    }
    
    // Atualiza metadados
    metadata.backups = metadata.backups.filter((backup: any) => 
      new Date(backup.timestamp) >= cutoffDate
    );
    
    await AsyncStorage.setItem('store_backups_metadata', JSON.stringify(metadata));
    
    return {
      removed: oldBackups.length,
      remaining: metadata.backups.length,
    };
  } catch (error) {
    throw new Error(`Erro ao limpar backups: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

// Função para exportar dados específicos da store
export const exportSliceData = (sliceName: string): any => {
  try {
    const state = store.getState();
    const sliceData = state[sliceName as keyof typeof state];
    
    if (!sliceData) {
      throw new Error(`Slice ${sliceName} não encontrado`);
    }
    
    return {
      sliceName,
      timestamp: new Date().toISOString(),
      data: sliceData,
      size: new Blob([JSON.stringify(sliceData)]).size,
    };
  } catch (error) {
    throw new Error(`Erro ao exportar slice ${sliceName}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

// Função para importar dados em um slice específico
export const importSliceData = (sliceName: string, data: any): boolean => {
  try {
    store.dispatch({
      type: `${sliceName}/importData`,
      payload: data,
    });
    
    return true;
  } catch (error) {
    console.error(`Erro ao importar dados no slice ${sliceName}:`, error);
    return false;
  }
};

// Função para validar integridade de um slice
export const validateSliceIntegrity = (sliceName: string): { isValid: boolean; issues: string[] } => {
  try {
    const state = store.getState();
    const sliceData = state[sliceName as keyof typeof state];
    
    if (!sliceData) {
      return { isValid: false, issues: ['Slice não encontrado'] };
    }
    
    const issues: string[] = [];
    
    // Validações específicas por slice
    switch (sliceName) {
      case 'user':
        if (sliceData.currentUser && !sliceData.currentUser.id) {
          issues.push('Usuário atual sem ID válido');
        }
        break;
        
      case 'workout':
        if (sliceData.currentSession && !sliceData.currentSession.id) {
          issues.push('Sessão atual sem ID válido');
        }
        break;
        
      case 'theme':
        if (sliceData.currentMode && !['light', 'dark', 'auto', 'custom'].includes(sliceData.currentMode)) {
          issues.push('Modo de tema inválido');
        }
        break;
        
      case 'payment':
        if (sliceData.paymentMethods?.some((pm: any) => !pm.id)) {
          issues.push('Métodos de pagamento com IDs inválidos');
        }
        break;
        
      case 'gamification':
        if (sliceData.achievements?.some((a: any) => !a.id)) {
          issues.push('Conquistas com IDs inválidos');
        }
        break;
    }
    
    return {
      isValid: issues.length === 0,
      issues,
    };
  } catch (error) {
    return {
      isValid: false,
      issues: [`Erro ao validar slice: ${error instanceof Error ? error.message : 'Erro desconhecido'}`],
    };
  }
};

// Função para compactar dados da store
export const compressStoreData = (): { originalSize: number; compressedSize: number; ratio: number } => {
  try {
    const state = store.getState();
    const originalData = JSON.stringify(state);
    const originalSize = new Blob([originalData]).size;
    
    // Simula compressão (em produção, usar biblioteca de compressão real)
    const compressedData = originalData.replace(/\s+/g, '');
    const compressedSize = new Blob([compressedData]).size;
    
    return {
      originalSize,
      compressedSize,
      ratio: ((originalSize - compressedSize) / originalSize) * 100,
    };
  } catch (error) {
    throw new Error(`Erro ao compactar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
};

// Função para obter estatísticas de uso da store
export const getStoreUsageStats = () => {
  const state = store.getState();
  
  return {
    timestamp: new Date().toISOString(),
    slices: Object.keys(state).map(sliceName => {
      const sliceData = state[sliceName as keyof typeof state];
      const dataSize = new Blob([JSON.stringify(sliceData)]).size;
      
      return {
        name: sliceName,
        size: dataSize,
        itemCount: Array.isArray(sliceData) ? sliceData.length : 
                   typeof sliceData === 'object' ? Object.keys(sliceData).length : 0,
      };
    }),
    totalSize: Object.keys(state).reduce((total, sliceName) => {
      const sliceData = state[sliceName as keyof typeof state];
      return total + new Blob([JSON.stringify(sliceData)]).size;
    }, 0),
  };
};

// Função para monitorar mudanças na store
export const createStoreMonitor = (callback: (action: any, state: any) => void) => {
  let previousState = store.getState();
  
  return store.subscribe(() => {
    const currentState = store.getState();
    const action = store.getState(); // Em produção, capturar ação real
    
    callback(action, currentState);
    previousState = currentState;
  });
};

// Função para criar snapshot da store
export const createStoreSnapshot = (): { timestamp: string; state: any; size: number } => {
  const state = store.getState();
  const timestamp = new Date().toISOString();
  const size = new Blob([JSON.stringify(state)]).size;
  
  return {
    timestamp,
    state,
    size,
  };
};

// Função para comparar snapshots
export const compareSnapshots = (snapshot1: any, snapshot2: any): { 
  changed: boolean; 
  changes: string[]; 
  added: string[]; 
  removed: string[]; 
} => {
  const changes: string[] = [];
  const added: string[] = [];
  const removed: string[] = [];
  
  // Compara slices
  const slices1 = Object.keys(snapshot1.state);
  const slices2 = Object.keys(snapshot2.state);
  
  // Slices adicionados
  slices2.forEach(slice => {
    if (!slices1.includes(slice)) {
      added.push(slice);
      changes.push(`Slice ${slice} foi adicionado`);
    }
  });
  
  // Slices removidos
  slices1.forEach(slice => {
    if (!slices2.includes(slice)) {
      removed.push(slice);
      changes.push(`Slice ${slice} foi removido`);
    }
  });
  
  // Slices modificados
  slices1.forEach(slice => {
    if (slices2.includes(slice)) {
      const data1 = snapshot1.state[slice];
      const data2 = snapshot2.state[slice];
      
      if (JSON.stringify(data1) !== JSON.stringify(data2)) {
        changes.push(`Slice ${slice} foi modificado`);
      }
    }
  });
  
  return {
    changed: changes.length > 0,
    changes,
    added,
    removed,
  };
};

export default {
  backupStore,
  restoreStore,
  listBackups,
  getStoreMetrics,
  cleanupOldBackups,
  exportSliceData,
  importSliceData,
  validateSliceIntegrity,
  compressStoreData,
  getStoreUsageStats,
  createStoreMonitor,
  createStoreSnapshot,
  compareSnapshots,
};