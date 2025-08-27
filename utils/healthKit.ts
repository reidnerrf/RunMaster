import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../store';
import { 
  updateUserStats,
  addWorkoutData 
} from '../store/slices/userSlice';
import { 
  updateWorkoutMetrics 
} from '../store/slices/workoutSlice';

// Configurações do HealthKit
const HEALTH_CONFIG = {
  permissions: {
    read: [
      'steps',
      'distance',
      'calories',
      'heartRate',
      'sleep',
      'weight',
      'height',
      'bodyMassIndex',
      'activeEnergyBurned',
      'basalEnergyBurned',
      'flightsClimbed',
      'workouts',
    ],
    write: [
      'steps',
      'distance',
      'calories',
      'heartRate',
      'workouts',
      'activeEnergyBurned',
    ],
  },
  syncInterval: 5 * 60 * 1000, // 5 minutos
  maxDataAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
  batchSize: 100, // itens por sincronização
};

// Interface para dados de saúde
interface HealthData {
  id: string;
  type: 'steps' | 'distance' | 'calories' | 'heartRate' | 'sleep' | 'weight' | 'height' | 'bmi' | 'workout';
  value: number;
  unit: string;
  startDate: string;
  endDate: string;
  source: 'healthkit' | 'googlefit' | 'manual' | 'app';
  metadata?: Record<string, any>;
}

// Interface para dados de treino
interface WorkoutData {
  id: string;
  type: 'running' | 'walking' | 'cycling' | 'swimming' | 'strength' | 'yoga' | 'other';
  startDate: string;
  endDate: string;
  duration: number; // segundos
  distance?: number; // metros
  calories?: number;
  averageHeartRate?: number;
  maxHeartRate?: number;
  source: 'healthkit' | 'googlefit' | 'app';
  route?: Array<{
    latitude: number;
    longitude: number;
    timestamp: string;
  }>;
}

// Interface para permissões de saúde
interface HealthPermissions {
  steps: boolean;
  distance: boolean;
  calories: boolean;
  heartRate: boolean;
  sleep: boolean;
  weight: boolean;
  height: boolean;
  workouts: boolean;
  lastSync: string | null;
}

// Função principal de configuração
export const setupHealthKit = async (): Promise<void> => {
  try {
    console.log('❤️ Configurando HealthKit...');
    
    // Passo 1: Verificar disponibilidade
    const isAvailable = await checkHealthKitAvailability();
    
    if (!isAvailable) {
      console.log('❌ HealthKit não disponível nesta plataforma');
      return;
    }
    
    // Passo 2: Solicitar permissões
    const permissions = await requestHealthPermissions();
    
    if (!permissions) {
      console.log('❌ Permissões de saúde negadas');
      return;
    }
    
    // Passo 3: Configurar sincronização
    await setupHealthSync();
    
    // Passo 4: Sincronizar dados existentes
    await syncExistingHealthData();
    
    // Passo 5: Configurar observadores
    await setupHealthObservers();
    
    console.log('✅ HealthKit configurado com sucesso');
    
  } catch (error) {
    console.error('❌ Erro na configuração do HealthKit:', error);
    throw error;
  }
};

// Verificar disponibilidade do HealthKit
const checkHealthKitAvailability = async (): Promise<boolean> => {
  try {
    // Em produção, usar:
    // const isAvailable = await AppleHealthKit.isAvailable();
    
    // Simular disponibilidade baseada na plataforma
    const platform = 'ios'; // Detectar automaticamente
    const isAvailable = platform === 'ios';
    
    console.log(`📱 HealthKit disponível: ${isAvailable}`);
    return isAvailable;
    
  } catch (error) {
    console.error('Erro ao verificar disponibilidade:', error);
    return false;
  }
};

// Solicitar permissões de saúde
const requestHealthPermissions = async (): Promise<HealthPermissions | null> => {
  try {
    console.log('🔐 Solicitando permissões de saúde...');
    
    const permissionsKey = 'health_permissions';
    let permissions = await AsyncStorage.getItem(permissionsKey);
    
    if (!permissions) {
      // Em produção, usar:
      // const permissions = await AppleHealthKit.initHealthKit(HEALTH_CONFIG.permissions);
      
      // Simular permissões para demonstração
      const mockPermissions: HealthPermissions = {
        steps: true,
        distance: true,
        calories: true,
        heartRate: true,
        sleep: true,
        weight: true,
        height: true,
        workouts: true,
        lastSync: null,
      };
      
      await AsyncStorage.setItem(permissionsKey, JSON.stringify(mockPermissions));
      permissions = JSON.stringify(mockPermissions);
      
      console.log('✅ Permissões de saúde concedidas');
    }
    
    return JSON.parse(permissions);
    
  } catch (error) {
    console.error('Erro ao solicitar permissões:', error);
    return null;
  }
};

// Configurar sincronização de saúde
const setupHealthSync = async (): Promise<void> => {
  try {
    console.log('🔄 Configurando sincronização de saúde...');
    
    // Configurar intervalo de sincronização
    const syncInterval = HEALTH_CONFIG.syncInterval;
    console.log(`⏰ Intervalo de sincronização: ${syncInterval / 1000}s`);
    
    // Configurar tamanho do lote
    const batchSize = HEALTH_CONFIG.batchSize;
    console.log(`📦 Tamanho do lote: ${batchSize} itens`);
    
    console.log('✅ Sincronização configurada');
    
  } catch (error) {
    console.error('Erro ao configurar sincronização:', error);
    throw error;
  }
};

// Sincronizar dados existentes de saúde
const syncExistingHealthData = async (): Promise<void> => {
  try {
    console.log('📊 Sincronizando dados existentes de saúde...');
    
    // Sincronizar passos dos últimos 7 dias
    await syncStepsData(7);
    
    // Sincronizar distância dos últimos 7 dias
    await syncDistanceData(7);
    
    // Sincronizar calorias dos últimos 7 dias
    await syncCaloriesData(7);
    
    // Sincronizar treinos dos últimos 30 dias
    await syncWorkoutsData(30);
    
    console.log('✅ Dados existentes sincronizados');
    
  } catch (error) {
    console.error('Erro ao sincronizar dados existentes:', error);
    throw error;
  }
};

// Configurar observadores de saúde
const setupHealthObservers = async (): Promise<void> => {
  try {
    console.log('👁️ Configurando observadores de saúde...');
    
    // Em produção, usar:
    // await AppleHealthKit.observeHealthKit('steps', handleStepsUpdate);
    // await AppleHealthKit.observeHealthKit('distance', handleDistanceUpdate);
    // await AppleHealthKit.observeHealthKit('calories', handleCaloriesUpdate);
    // await AppleHealthKit.observeHealthKit('workouts', handleWorkoutUpdate);
    
    console.log('✅ Observadores configurados');
    
  } catch (error) {
    console.error('Erro ao configurar observadores:', error);
    throw error;
  }
};

// Sincronizar dados de passos
const syncStepsData = async (days: number): Promise<void> => {
  try {
    console.log(`👟 Sincronizando dados de passos dos últimos ${days} dias...`);
    
    // Em produção, usar:
    // const steps = await AppleHealthKit.getStepCount({
    //   date: new Date().toISOString(),
    //   days: days,
    // });
    
    // Simular dados para demonstração
    const mockSteps = Math.floor(Math.random() * 10000) + 5000;
    console.log(`✅ ${mockSteps} passos sincronizados`);
    
    // Atualizar na store
    store.dispatch(updateUserStats({
      userId: 'current_user',
      stats: { steps: mockSteps },
    }));
    
  } catch (error) {
    console.error('Erro ao sincronizar passos:', error);
  }
};

// Sincronizar dados de distância
const syncDistanceData = async (days: number): Promise<void> => {
  try {
    console.log(`📏 Sincronizando dados de distância dos últimos ${days} dias...`);
    
    // Em produção, usar:
    // const distance = await AppleHealthKit.getDistanceWalkingRunning({
    //   date: new Date().toISOString(),
    //   days: days,
    // });
    
    // Simular dados para demonstração
    const mockDistance = Math.floor(Math.random() * 20) + 5; // km
    console.log(`✅ ${mockDistance}km sincronizados`);
    
    // Atualizar na store
    store.dispatch(updateUserStats({
      userId: 'current_user',
      stats: { distance: mockDistance * 1000 }, // converter para metros
    }));
    
  } catch (error) {
    console.error('Erro ao sincronizar distância:', error);
  }
};

// Sincronizar dados de calorias
const syncCaloriesData = async (days: number): Promise<void> => {
  try {
    console.log(`🔥 Sincronizando dados de calorias dos últimos ${days} dias...`);
    
    // Em produção, usar:
    // const calories = await AppleHealthKit.getActiveEnergyBurned({
    //   date: new Date().toISOString(),
    //   days: days,
    // });
    
    // Simular dados para demonstração
    const mockCalories = Math.floor(Math.random() * 500) + 200;
    console.log(`✅ ${mockCalories} calorias sincronizadas`);
    
    // Atualizar na store
    store.dispatch(updateUserStats({
      userId: 'current_user',
      stats: { calories: mockCalories },
    }));
    
  } catch (error) {
    console.error('Erro ao sincronizar calorias:', error);
  }
};

// Sincronizar dados de treinos
const syncWorkoutsData = async (days: number): Promise<void> => {
  try {
    console.log(`🏃‍♂️ Sincronizando dados de treinos dos últimos ${days} dias...`);
    
    // Em produção, usar:
    // const workouts = await AppleHealthKit.getSamples({
    //   type: 'workout',
    //   date: new Date().toISOString(),
    //   days: days,
    // });
    
    // Simular dados para demonstração
    const mockWorkouts = [
      {
        id: `workout_${Date.now()}`,
        type: 'running',
        startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
        duration: 45 * 60, // 45 minutos
        distance: 5000, // 5km
        calories: 350,
        source: 'healthkit',
      },
    ];
    
    console.log(`✅ ${mockWorkouts.length} treinos sincronizados`);
    
    // Adicionar à store
    mockWorkouts.forEach(workout => {
      store.dispatch(addWorkoutData(workout));
    });
    
  } catch (error) {
    console.error('Erro ao sincronizar treinos:', error);
  }
};

// Função para obter dados de saúde
export const getHealthData = async (
  type: HealthData['type'],
  startDate: Date,
  endDate: Date
): Promise<HealthData[]> => {
  try {
    console.log(`📊 Obtendo dados de ${type}...`);
    
    // Em produção, usar:
    // const data = await AppleHealthKit.getSamples({
    //   type: type,
    //   startDate: startDate.toISOString(),
    //   endDate: endDate.toISOString(),
    // });
    
    // Simular dados para demonstração
    const mockData: HealthData[] = [
      {
        id: `health_${Date.now()}`,
        type,
        value: Math.floor(Math.random() * 100) + 10,
        unit: getUnitForType(type),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        source: 'healthkit',
      },
    ];
    
    console.log(`✅ ${mockData.length} registros de ${type} obtidos`);
    return mockData;
    
  } catch (error) {
    console.error(`Erro ao obter dados de ${type}:`, error);
    return [];
  }
};

// Função para obter unidade baseada no tipo
const getUnitForType = (type: HealthData['type']): string => {
  switch (type) {
    case 'steps':
      return 'steps';
    case 'distance':
      return 'meters';
    case 'calories':
      return 'kcal';
    case 'heartRate':
      return 'bpm';
    case 'sleep':
      return 'hours';
    case 'weight':
      return 'kg';
    case 'height':
      return 'cm';
    case 'bmi':
      return 'kg/m²';
    default:
      return 'units';
  }
};

// Função para salvar dados de saúde
export const saveHealthData = async (
  type: HealthData['type'],
  value: number,
  startDate: Date,
  endDate: Date,
  metadata?: Record<string, any>
): Promise<boolean> => {
  try {
    console.log(`💾 Salvando dados de ${type}: ${value}...`);
    
    // Em produção, usar:
    // await AppleHealthKit.saveSample({
    //   type: type,
    //   value: value,
    //   startDate: startDate.toISOString(),
    //   endDate: endDate.toISOString(),
    //   metadata: metadata,
    // });
    
    const healthData: HealthData = {
      id: `health_${Date.now()}`,
      type,
      value,
      unit: getUnitForType(type),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      source: 'app',
      metadata,
    };
    
    // Salvar na store local
    store.dispatch(updateUserStats({
      userId: 'current_user',
      stats: { [type]: value },
    }));
    
    console.log(`✅ Dados de ${type} salvos com sucesso`);
    return true;
    
  } catch (error) {
    console.error(`Erro ao salvar dados de ${type}:`, error);
    return false;
  }
};

// Função para salvar treino
export const saveWorkout = async (workout: Omit<WorkoutData, 'id' | 'source'>): Promise<string | null> => {
  try {
    console.log(`💾 Salvando treino: ${workout.type}...`);
    
    // Em produção, usar:
    // await AppleHealthKit.saveWorkout({
    //   type: workout.type,
    //   startDate: workout.startDate,
    //   endDate: workout.endDate,
    //   duration: workout.duration,
    //   distance: workout.distance,
    //   calories: workout.calories,
    //   route: workout.route,
    // });
    
    const workoutWithId: WorkoutData = {
      ...workout,
      id: `workout_${Date.now()}`,
      source: 'app',
    };
    
    // Salvar na store
    store.dispatch(addWorkoutData(workoutWithId));
    
    console.log(`✅ Treino salvo com sucesso: ${workoutWithId.id}`);
    return workoutWithId.id;
    
  } catch (error) {
    console.error('Erro ao salvar treino:', error);
    return null;
  }
};

// Função para obter estatísticas de saúde
export const getHealthStats = async (): Promise<{
  totalSteps: number;
  totalDistance: number;
  totalCalories: number;
  averageHeartRate: number;
  totalWorkouts: number;
  lastSync: string | null;
}> => {
  try {
    const permissionsKey = 'health_permissions';
    const permissions = await AsyncStorage.getItem(permissionsKey);
    
    if (!permissions) {
      return {
        totalSteps: 0,
        totalDistance: 0,
        totalCalories: 0,
        averageHeartRate: 0,
        totalWorkouts: 0,
        lastSync: null,
      };
    }
    
    const healthPermissions: HealthPermissions = JSON.parse(permissions);
    
    // Em produção, obter dados reais do HealthKit
    const stats = {
      totalSteps: 12500,
      totalDistance: 8500, // metros
      totalCalories: 450,
      averageHeartRate: 72,
      totalWorkouts: 3,
      lastSync: healthPermissions.lastSync,
    };
    
    return stats;
    
  } catch (error) {
    console.error('Erro ao obter estatísticas de saúde:', error);
    return {
      totalSteps: 0,
      totalDistance: 0,
      totalCalories: 0,
      averageHeartRate: 0,
      totalWorkouts: 0,
      lastSync: null,
    };
  }
};

// Função para forçar sincronização
export const forceHealthSync = async (): Promise<boolean> => {
  try {
    console.log('🔄 Forçando sincronização de saúde...');
    
    // Sincronizar todos os tipos de dados
    await syncStepsData(7);
    await syncDistanceData(7);
    await syncCaloriesData(7);
    await syncWorkoutsData(30);
    
    // Atualizar timestamp da última sincronização
    const permissionsKey = 'health_permissions';
    const permissions = await AsyncStorage.getItem(permissionsKey);
    
    if (permissions) {
      const healthPermissions: HealthPermissions = JSON.parse(permissions);
      healthPermissions.lastSync = new Date().toISOString();
      await AsyncStorage.setItem(permissionsKey, JSON.stringify(healthPermissions));
    }
    
    console.log('✅ Sincronização forçada concluída');
    return true;
    
  } catch (error) {
    console.error('Erro na sincronização forçada:', error);
    return false;
  }
};

// Função para limpar dados antigos
export const cleanupOldHealthData = async (maxAge: number = 30): Promise<{ removed: number; remaining: number }> => {
  try {
    console.log(`🧹 Limpando dados de saúde com mais de ${maxAge} dias...`);
    
    const cutoffDate = Date.now() - (maxAge * 24 * 60 * 60 * 1000);
    
    // Em produção, limpar dados antigos do HealthKit
    // await AppleHealthKit.deleteSamples({
    //   startDate: new Date(0).toISOString(),
    //   endDate: new Date(cutoffDate).toISOString(),
    // });
    
    console.log('✅ Limpeza de dados de saúde concluída');
    
    return { removed: 0, remaining: 0 };
    
  } catch (error) {
    console.error('Erro ao limpar dados de saúde:', error);
    return { removed: 0, remaining: 0 };
  }
};

export default {
  setupHealthKit,
  getHealthData,
  saveHealthData,
  saveWorkout,
  getHealthStats,
  forceHealthSync,
  cleanupOldHealthData,
};