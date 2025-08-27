import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../store';
import { 
  updateWorkoutLocation,
  addLocationUpdate 
} from '../store/slices/workoutSlice';
import { 
  updateExplorerLocation,
  addExplorerLocationUpdate 
} from '../store/slices/explorerSlice';

// Configurações de localização
const LOCATION_CONFIG = {
  accuracy: {
    high: 5, // metros
    medium: 10,
    low: 50,
  },
  updateInterval: {
    active: 1000, // 1 segundo durante treino
    passive: 5000, // 5 segundos em background
    background: 10000, // 10 segundos em background
  },
  distanceFilter: 5, // metros
  maxLocations: 1000, // máximo de localizações em memória
  geofencing: {
    enabled: true,
    radius: 100, // metros
    accuracy: 20, // metros
  },
};

// Interface para coordenadas de localização
interface LocationCoordinate {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  timestamp: number;
}

// Interface para dados de localização
interface LocationData extends LocationCoordinate {
  id: string;
  speed?: number; // m/s
  heading?: number; // graus
  course?: number; // graus
  verticalAccuracy?: number;
  horizontalAccuracy?: number;
  floor?: number;
  building?: string;
  address?: string;
  isFromGPS: boolean;
  source: 'gps' | 'network' | 'passive' | 'manual';
}

// Interface para permissões de localização
interface LocationPermissions {
  location: 'granted' | 'denied' | 'restricted' | 'undetermined';
  backgroundLocation: 'granted' | 'denied' | 'restricted' | 'undetermined';
  locationAlways: 'granted' | 'denied' | 'restricted' | 'undetermined';
  lastRequested: string;
}

// Função principal de configuração
export const setupLocationServices = async (): Promise<void> => {
  try {
    console.log('📍 Configurando serviços de localização...');
    
    // Passo 1: Verificar permissões
    const permissions = await checkLocationPermissions();
    
    if (permissions.location === 'denied') {
      console.log('❌ Permissão de localização negada');
      return;
    }
    
    // Passo 2: Configurar serviços de localização
    await configureLocationServices();
    
    // Passo 3: Configurar geofencing
    if (LOCATION_CONFIG.geofencing.enabled) {
      await setupGeofencing();
    }
    
    // Passo 4: Configurar monitoramento de localização
    await setupLocationMonitoring();
    
    // Passo 5: Configurar precisão baseada no contexto
    await configureLocationAccuracy();
    
    console.log('✅ Serviços de localização configurados com sucesso');
    
  } catch (error) {
    console.error('❌ Erro na configuração de localização:', error);
    throw error;
  }
};

// Verificar permissões de localização
const checkLocationPermissions = async (): Promise<LocationPermissions> => {
  try {
    const permissionsKey = 'location_permissions';
    let permissions = await AsyncStorage.getItem(permissionsKey);
    
    if (!permissions) {
      console.log('📍 Solicitando permissões de localização...');
      
      // Em produção, usar:
      // const { status } = await Location.requestForegroundPermissionsAsync();
      // const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
      
      permissions = JSON.stringify({
        location: 'granted',
        backgroundLocation: 'granted',
        locationAlways: 'granted',
        lastRequested: new Date().toISOString(),
      });
      
      await AsyncStorage.setItem(permissionsKey, permissions);
    }
    
    return JSON.parse(permissions);
    
  } catch (error) {
    console.error('Erro ao verificar permissões:', error);
    return {
      location: 'denied',
      backgroundLocation: 'denied',
      locationAlways: 'denied',
      lastRequested: new Date().toISOString(),
    };
  }
};

// Configurar serviços de localização
const configureLocationServices = async (): Promise<void> => {
  try {
    console.log('⚙️ Configurando serviços de localização...');
    
    // Em produção, usar:
    // await Location.setGoogleApiKey(GOOGLE_MAPS_API_KEY);
    // await Location.enableNetworkProviderAsync();
    // await Location.enableLocationServicesAsync();
    
    // Configurar precisão
    const accuracy = LOCATION_CONFIG.accuracy.high;
    console.log(`🎯 Precisão configurada: ${accuracy}m`);
    
    // Configurar filtro de distância
    const distanceFilter = LOCATION_CONFIG.distanceFilter;
    console.log(`📏 Filtro de distância: ${distanceFilter}m`);
    
    console.log('✅ Serviços de localização configurados');
    
  } catch (error) {
    console.error('Erro ao configurar serviços:', error);
    throw error;
  }
};

// Configurar geofencing
const setupGeofencing = async (): Promise<void> => {
  try {
    console.log('🗺️ Configurando geofencing...');
    
    // Em produção, usar:
    // await Location.startGeofencingAsync('workout_zone', [{
    //   latitude: centerLat,
    //   longitude: centerLng,
    //   radius: LOCATION_CONFIG.geofencing.radius,
    // }]);
    
    console.log('✅ Geofencing configurado');
    
  } catch (error) {
    console.error('Erro ao configurar geofencing:', error);
    throw error;
  }
};

// Configurar monitoramento de localização
const setupLocationMonitoring = async (): Promise<void> => {
  try {
    console.log('📡 Configurando monitoramento de localização...');
    
    // Em produção, usar:
    // await Location.watchPositionAsync({
    //   accuracy: Location.Accuracy.High,
    //   timeInterval: LOCATION_CONFIG.updateInterval.active,
    //   distanceInterval: LOCATION_CONFIG.distanceFilter,
    // }, handleLocationUpdate);
    
    console.log('✅ Monitoramento configurado');
    
  } catch (error) {
    console.error('Erro ao configurar monitoramento:', error);
    throw error;
  }
};

// Configurar precisão baseada no contexto
const configureLocationAccuracy = async (): Promise<void> => {
  try {
    console.log('🎯 Configurando precisão baseada no contexto...');
    
    // Em produção, ajustar precisão baseada no estado da aplicação
    const state = store.getState();
    const hasActiveWorkout = !!state.workout.currentSession;
    const hasActiveExplorer = !!state.explorer.activeSession;
    
    if (hasActiveWorkout) {
      console.log('🏃‍♂️ Treino ativo - usando alta precisão');
      // await Location.setAccuracyAsync(Location.Accuracy.High);
    } else if (hasActiveExplorer) {
      console.log('🗺️ Explorador ativo - usando precisão média');
      // await Location.setAccuracyAsync(Location.Accuracy.Balanced);
    } else {
      console.log('😴 Aplicação em background - usando baixa precisão');
      // await Location.setAccuracyAsync(Location.Accuracy.Low);
    }
    
    console.log('✅ Precisão configurada');
    
  } catch (error) {
    console.error('Erro ao configurar precisão:', error);
    throw error;
  }
};

// Função para obter localização atual
export const getCurrentLocation = async (): Promise<LocationData | null> => {
  try {
    console.log('📍 Obtendo localização atual...');
    
    // Em produção, usar:
    // const location = await Location.getCurrentPositionAsync({
    //   accuracy: Location.Accuracy.High,
    //   timeInterval: 5000,
    // });
    
    // Simular localização para demonstração
    const mockLocation: LocationData = {
      id: `loc_${Date.now()}`,
      latitude: -23.5505, // São Paulo
      longitude: -46.6333,
      altitude: 760,
      accuracy: 5,
      timestamp: Date.now(),
      speed: 0,
      heading: 0,
      course: 0,
      verticalAccuracy: 10,
      horizontalAccuracy: 5,
      isFromGPS: true,
      source: 'gps',
    };
    
    console.log('✅ Localização obtida:', mockLocation.latitude, mockLocation.longitude);
    return mockLocation;
    
  } catch (error) {
    console.error('Erro ao obter localização:', error);
    return null;
  }
};

// Função para calcular distância entre dois pontos
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  try {
    const R = 6371e3; // Raio da Terra em metros
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c; // Distância em metros
  } catch (error) {
    console.error('Erro ao calcular distância:', error);
    return 0;
  }
};

// Função para calcular velocidade média
export const calculateAverageSpeed = (locations: LocationData[]): number => {
  try {
    if (locations.length < 2) return 0;
    
    let totalDistance = 0;
    let totalTime = 0;
    
    for (let i = 1; i < locations.length; i++) {
      const prev = locations[i - 1];
      const curr = locations[i];
      
      const distance = calculateDistance(
        prev.latitude,
        prev.longitude,
        curr.latitude,
        curr.longitude
      );
      
      const time = (curr.timestamp - prev.timestamp) / 1000; // segundos
      
      totalDistance += distance;
      totalTime += time;
    }
    
    if (totalTime === 0) return 0;
    
    return totalDistance / totalTime; // m/s
  } catch (error) {
    console.error('Erro ao calcular velocidade média:', error);
    return 0;
  }
};

// Função para calcular elevação total
export const calculateTotalElevation = (locations: LocationData[]): number => {
  try {
    if (locations.length < 2) return 0;
    
    let totalElevation = 0;
    
    for (let i = 1; i < locations.length; i++) {
      const prev = locations[i - 1];
      const curr = locations[i];
      
      if (prev.altitude && curr.altitude) {
        const elevation = curr.altitude - prev.altitude;
        if (elevation > 0) {
          totalElevation += elevation;
        }
      }
    }
    
    return totalElevation; // metros
  } catch (error) {
    console.error('Erro ao calcular elevação:', error);
    return 0;
  }
};

// Função para obter endereço das coordenadas
export const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number
): Promise<string | null> => {
  try {
    // Em produção, usar Google Geocoding API ou similar
    // const response = await fetch(
    //   `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
    // );
    // const data = await response.json();
    // return data.results[0]?.formatted_address || null;
    
    // Simular endereço para demonstração
    return 'São Paulo, SP, Brasil';
    
  } catch (error) {
    console.error('Erro ao obter endereço:', error);
    return null;
  }
};

// Função para configurar precisão baseada no contexto
export const setLocationAccuracy = async (context: 'workout' | 'explorer' | 'background'): Promise<void> => {
  try {
    let accuracy: number;
    let interval: number;
    
    switch (context) {
      case 'workout':
        accuracy = LOCATION_CONFIG.accuracy.high;
        interval = LOCATION_CONFIG.updateInterval.active;
        console.log('🏃‍♂️ Configurando alta precisão para treino');
        break;
        
      case 'explorer':
        accuracy = LOCATION_CONFIG.accuracy.medium;
        interval = LOCATION_CONFIG.updateInterval.passive;
        console.log('🗺️ Configurando precisão média para explorador');
        break;
        
      case 'background':
        accuracy = LOCATION_CONFIG.accuracy.low;
        interval = LOCATION_CONFIG.updateInterval.background;
        console.log('😴 Configurando baixa precisão para background');
        break;
        
      default:
        accuracy = LOCATION_CONFIG.accuracy.medium;
        interval = LOCATION_CONFIG.updateInterval.passive;
    }
    
    // Em produção, aplicar configurações:
    // await Location.setAccuracyAsync(accuracy);
    // await Location.setUpdateIntervalAsync(interval);
    
    console.log(`✅ Precisão configurada: ${accuracy}m, intervalo: ${interval}ms`);
    
  } catch (error) {
    console.error('Erro ao configurar precisão:', error);
    throw error;
  }
};

// Função para iniciar monitoramento de localização
export const startLocationMonitoring = async (context: 'workout' | 'explorer' | 'background'): Promise<void> => {
  try {
    console.log(`📍 Iniciando monitoramento de localização para: ${context}`);
    
    // Configurar precisão baseada no contexto
    await setLocationAccuracy(context);
    
    // Em produção, usar:
    // const subscription = await Location.watchPositionAsync({
    //   accuracy: Location.Accuracy.High,
    //   timeInterval: LOCATION_CONFIG.updateInterval.active,
    //   distanceInterval: LOCATION_CONFIG.distanceFilter,
    // }, (location) => handleLocationUpdate(location, context));
    
    console.log(`✅ Monitoramento iniciado para: ${context}`);
    
  } catch (error) {
    console.error('Erro ao iniciar monitoramento:', error);
    throw error;
  }
};

// Função para parar monitoramento de localização
export const stopLocationMonitoring = async (): Promise<void> => {
  try {
    console.log('🛑 Parando monitoramento de localização...');
    
    // Em produção, usar:
    // if (locationSubscription) {
    //   locationSubscription.remove();
    // }
    
    console.log('✅ Monitoramento parado');
    
  } catch (error) {
    console.error('Erro ao parar monitoramento:', error);
    throw error;
  }
};

// Função para obter estatísticas de localização
export const getLocationStats = async (): Promise<{
  totalLocations: number;
  lastLocation: LocationData | null;
  averageAccuracy: number;
  gpsLocations: number;
  networkLocations: number;
  lastUpdate: string | null;
}> => {
  try {
    const state = store.getState();
    const workoutLocations = state.workout.locationUpdates || [];
    const explorerLocations = state.explorer.locationUpdates || [];
    
    const allLocations = [...workoutLocations, ...explorerLocations];
    
    if (allLocations.length === 0) {
      return {
        totalLocations: 0,
        lastLocation: null,
        averageAccuracy: 0,
        gpsLocations: 0,
        networkLocations: 0,
        lastUpdate: null,
      };
    }
    
    const gpsLocations = allLocations.filter(loc => loc.isFromGPS).length;
    const networkLocations = allLocations.filter(loc => !loc.isFromGPS).length;
    
    const totalAccuracy = allLocations.reduce((sum, loc) => sum + (loc.accuracy || 0), 0);
    const averageAccuracy = totalAccuracy / allLocations.length;
    
    const lastLocation = allLocations[allLocations.length - 1];
    
    return {
      totalLocations: allLocations.length,
      lastLocation,
      averageAccuracy,
      gpsLocations,
      networkLocations,
      lastUpdate: lastLocation?.timestamp ? new Date(lastLocation.timestamp).toISOString() : null,
    };
    
  } catch (error) {
    console.error('Erro ao obter estatísticas de localização:', error);
    return {
      totalLocations: 0,
      lastLocation: null,
      averageAccuracy: 0,
      gpsLocations: 0,
      networkLocations: 0,
      lastUpdate: null,
    };
  }
};

// Função para limpar dados de localização antigos
export const cleanupOldLocationData = async (maxAge: number = 7): Promise<{ removed: number; remaining: number }> => {
  try {
    console.log(`🧹 Limpando dados de localização com mais de ${maxAge} dias...`);
    
    const cutoffDate = Date.now() - (maxAge * 24 * 60 * 60 * 1000);
    
    const state = store.getState();
    const workoutLocations = state.workout.locationUpdates || [];
    const explorerLocations = state.explorer.locationUpdates || [];
    
    const oldWorkoutLocations = workoutLocations.filter(loc => loc.timestamp < cutoffDate);
    const oldExplorerLocations = explorerLocations.filter(loc => loc.timestamp < cutoffDate);
    
    // Remover localizações antigas
    if (oldWorkoutLocations.length > 0) {
      store.dispatch({
        type: 'workout/cleanupLocationUpdates',
        payload: { maxAge },
      });
    }
    
    if (oldExplorerLocations.length > 0) {
      store.dispatch({
        type: 'explorer/cleanupLocationUpdates',
        payload: { maxAge },
      });
    }
    
    const totalRemoved = oldWorkoutLocations.length + oldExplorerLocations.length;
    
    console.log(`✅ ${totalRemoved} localizações antigas removidas`);
    
    return {
      removed: totalRemoved,
      remaining: workoutLocations.length + explorerLocations.length - totalRemoved,
    };
    
  } catch (error) {
    console.error('Erro ao limpar dados de localização:', error);
    return { removed: 0, remaining: 0 };
  }
};

export default {
  setupLocationServices,
  getCurrentLocation,
  calculateDistance,
  calculateAverageSpeed,
  calculateTotalElevation,
  getAddressFromCoordinates,
  setLocationAccuracy,
  startLocationMonitoring,
  stopLocationMonitoring,
  getLocationStats,
  cleanupOldLocationData,
};