import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../store';

// Configurações do serviço meteorológico
const WEATHER_CONFIG = {
  // APIs
  openWeatherApiKey: 'YOUR_OPENWEATHER_API_KEY',
  openWeatherBaseUrl: 'https://api.openweathermap.org/data/2.5',
  
  // Cache
  cacheExpiration: 30 * 60 * 1000, // 30 minutos
  maxCacheSize: 10 * 1024 * 1024, // 10MB
  
  // Atualizações
  updateInterval: 15 * 60 * 1000, // 15 minutos
  backgroundUpdateInterval: 60 * 60 * 1000, // 1 hora
  
  // Precisão
  locationAccuracy: 1000, // metros
  forecastDays: 7, // dias de previsão
  
  // Alertas
  alertThresholds: {
    temperature: { min: -10, max: 40 }, // °C
    humidity: { min: 20, max: 90 }, // %
    windSpeed: { max: 25 }, // m/s
    precipitation: { max: 50 }, // mm/h
    uvIndex: { max: 10 }, // escala UV
  },
};

// Interface para dados meteorológicos
interface WeatherData {
  id: string;
  location: {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
    timezone: string;
  };
  current: {
    temperature: number; // °C
    feelsLike: number; // °C
    humidity: number; // %
    pressure: number; // hPa
    windSpeed: number; // m/s
    windDirection: number; // graus
    visibility: number; // km
    uvIndex: number;
    cloudCover: number; // %
    description: string;
    icon: string;
    timestamp: string;
  };
  forecast: WeatherForecast[];
  alerts: WeatherAlert[];
  airQuality?: AirQualityData;
  sunrise: string;
  sunset: string;
  lastUpdated: string;
}

// Interface para previsão do tempo
interface WeatherForecast {
  date: string;
  temperature: {
    min: number;
    max: number;
    day: number;
    night: number;
  };
  humidity: number;
  windSpeed: number;
  windDirection: number;
  precipitation: {
    probability: number; // %
    amount: number; // mm
  };
  description: string;
  icon: string;
  uvIndex: number;
}

// Interface para alertas meteorológicos
interface WeatherAlert {
  id: string;
  type: 'storm' | 'rain' | 'snow' | 'heat' | 'cold' | 'wind' | 'fog' | 'other';
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  affectedAreas: string[];
  recommendations: string[];
}

// Interface para qualidade do ar
interface AirQualityData {
  aqi: number; // Air Quality Index
  category: 'good' | 'moderate' | 'unhealthy_sensitive' | 'unhealthy' | 'very_unhealthy' | 'hazardous';
  pollutants: {
    co: number; // ppm
    no2: number; // ppb
    o3: number; // ppb
    pm25: number; // μg/m³
    pm10: number; // μg/m³
    so2: number; // ppb
  };
  healthEffects: string;
  recommendations: string[];
}

// Interface para recomendações de treino
interface TrainingRecommendation {
  type: 'weather' | 'air_quality' | 'safety';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  suggestions: string[];
  alternativeRoutes?: Array<{
    name: string;
    distance: number;
    weather: string;
    airQuality: string;
  }>;
}

// Classe principal do serviço meteorológico
class WeatherService {
  private cache: Map<string, { data: WeatherData; timestamp: number }> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;
  private isUpdating: boolean = false;
  private currentLocation: { latitude: number; longitude: number } | null = null;

  constructor() {
    this.initialize();
  }

  // Inicializar serviço
  private async initialize(): Promise<void> {
    try {
      console.log('🌤️ Inicializando serviço meteorológico...');
      
      // Carregar cache salvo
      await this.loadCache();
      
      // Configurar atualizações automáticas
      this.setupAutoUpdates();
      
      // Configurar listeners de localização
      this.setupLocationListeners();
      
      console.log('✅ Serviço meteorológico inicializado');
      
    } catch (error) {
      console.error('❌ Erro na inicialização do serviço meteorológico:', error);
    }
  }

  // Carregar cache salvo
  private async loadCache(): Promise<void> {
    try {
      const cacheData = await AsyncStorage.getItem('weather_cache');
      
      if (cacheData) {
        const parsedCache = JSON.parse(cacheData);
        this.cache = new Map(Object.entries(parsedCache));
        console.log(`📦 Cache carregado: ${this.cache.size} localizações`);
      }
      
    } catch (error) {
      console.error('Erro ao carregar cache:', error);
      this.cache = new Map();
    }
  }

  // Salvar cache
  private async saveCache(): Promise<void> {
    try {
      const cacheObject = Object.fromEntries(this.cache);
      await AsyncStorage.setItem('weather_cache', JSON.stringify(cacheObject));
      
    } catch (error) {
      console.error('Erro ao salvar cache:', error);
    }
  }

  // Configurar atualizações automáticas
  private setupAutoUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    this.updateInterval = setInterval(async () => {
      if (this.currentLocation && !this.isUpdating) {
        await this.updateWeatherData(this.currentLocation.latitude, this.currentLocation.longitude);
      }
    }, WEATHER_CONFIG.updateInterval);
    
    console.log('⏰ Atualizações automáticas configuradas');
  }

  // Configurar listeners de localização
  private setupLocationListeners(): void {
    // Em produção, usar:
    // Location.watchPositionAsync({}, (location) => {
    //   this.handleLocationChange(location);
    // });
    
    // Simular mudança de localização para demonstração
    setInterval(() => {
      if (Math.random() > 0.9) { // 10% de chance de mudança
        this.handleLocationChange({
          coords: {
            latitude: -23.5505 + (Math.random() - 0.5) * 0.1,
            longitude: -46.6333 + (Math.random() - 0.5) * 0.1,
          },
        });
      }
    }, 60000);
  }

  // Manipular mudança de localização
  private handleLocationChange(location: any): void {
    try {
      const { latitude, longitude } = location.coords;
      
      if (this.currentLocation) {
        const distance = this.calculateDistance(
          this.currentLocation.latitude,
          this.currentLocation.longitude,
          latitude,
          longitude
        );
        
        // Só atualizar se a mudança for significativa
        if (distance > WEATHER_CONFIG.locationAccuracy) {
          console.log(`📍 Nova localização detectada: ${latitude}, ${longitude}`);
          this.currentLocation = { latitude, longitude };
          this.updateWeatherData(latitude, longitude);
        }
      } else {
        this.currentLocation = { latitude, longitude };
        this.updateWeatherData(latitude, longitude);
      }
      
    } catch (error) {
      console.error('Erro ao manipular mudança de localização:', error);
    }
  }

  // Calcular distância entre dois pontos
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Raio da Terra em metros
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
  }

  // Atualizar dados meteorológicos
  public async updateWeatherData(latitude: number, longitude: number): Promise<WeatherData | null> {
    try {
      if (this.isUpdating) {
        console.log('⏳ Atualização já em andamento');
        return null;
      }
      
      this.isUpdating = true;
      console.log(`🌤️ Atualizando dados meteorológicos para ${latitude}, ${longitude}...`);
      
      // Verificar cache primeiro
      const cacheKey = `${latitude.toFixed(3)},${longitude.toFixed(3)}`;
      const cachedData = this.cache.get(cacheKey);
      
      if (cachedData && Date.now() - cachedData.timestamp < WEATHER_CONFIG.cacheExpiration) {
        console.log('✅ Dados do cache ainda válidos');
        this.isUpdating = false;
        return cachedData.data;
      }
      
      // Buscar dados da API
      const weatherData = await this.fetchWeatherData(latitude, longitude);
      
      if (weatherData) {
        // Salvar no cache
        this.cache.set(cacheKey, {
          data: weatherData,
          timestamp: Date.now(),
        });
        
        // Limpar cache antigo se necessário
        this.cleanupCache();
        
        // Salvar cache
        await this.saveCache();
        
        console.log('✅ Dados meteorológicos atualizados');
        
        // Gerar recomendações de treino
        const recommendations = this.generateTrainingRecommendations(weatherData);
        this.notifyTrainingRecommendations(recommendations);
        
        return weatherData;
      }
      
      return null;
      
    } catch (error) {
      console.error('❌ Erro ao atualizar dados meteorológicos:', error);
      return null;
    } finally {
      this.isUpdating = false;
    }
  }

  // Buscar dados da API
  private async fetchWeatherData(latitude: number, longitude: number): Promise<WeatherData | null> {
    try {
      // Em produção, usar API real:
      // const response = await fetch(
      //   `${WEATHER_CONFIG.openWeatherBaseUrl}/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_CONFIG.openWeatherApiKey}&units=metric`
      // );
      
      // Simular dados para demonstração
      const mockWeatherData: WeatherData = {
        id: `weather_${Date.now()}`,
        location: {
          latitude,
          longitude,
          city: 'São Paulo',
          country: 'BR',
          timezone: 'America/Sao_Paulo',
        },
        current: {
          temperature: 22 + (Math.random() - 0.5) * 10,
          feelsLike: 24 + (Math.random() - 0.5) * 8,
          humidity: 60 + Math.random() * 30,
          pressure: 1013 + (Math.random() - 0.5) * 20,
          windSpeed: Math.random() * 15,
          windDirection: Math.random() * 360,
          visibility: 10 + Math.random() * 10,
          uvIndex: Math.floor(Math.random() * 11),
          cloudCover: Math.random() * 100,
          description: this.getRandomWeatherDescription(),
          icon: this.getRandomWeatherIcon(),
          timestamp: new Date().toISOString(),
        },
        forecast: this.generateMockForecast(),
        alerts: this.generateMockAlerts(),
        airQuality: this.generateMockAirQuality(),
        sunrise: '06:30',
        sunset: '17:45',
        lastUpdated: new Date().toISOString(),
      };
      
      return mockWeatherData;
      
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
      return null;
    }
  }

  // Gerar previsão simulada
  private generateMockForecast(): WeatherForecast[] {
    const forecast: WeatherForecast[] = [];
    
    for (let i = 1; i <= WEATHER_CONFIG.forecastDays; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        temperature: {
          min: 15 + Math.random() * 10,
          max: 25 + Math.random() * 15,
          day: 22 + Math.random() * 10,
          night: 18 + Math.random() * 8,
        },
        humidity: 50 + Math.random() * 40,
        windSpeed: Math.random() * 20,
        windDirection: Math.random() * 360,
        precipitation: {
          probability: Math.random() * 100,
          amount: Math.random() * 20,
        },
        description: this.getRandomWeatherDescription(),
        icon: this.getRandomWeatherIcon(),
        uvIndex: Math.floor(Math.random() * 11),
      });
    }
    
    return forecast;
  }

  // Gerar alertas simulados
  private generateMockAlerts(): WeatherAlert[] {
    const alerts: WeatherAlert[] = [];
    
    // Simular alertas baseados em probabilidade
    if (Math.random() > 0.7) {
      alerts.push({
        id: `alert_${Date.now()}`,
        type: 'rain',
        severity: 'moderate',
        title: 'Chuva Moderada',
        description: 'Previsão de chuva moderada nas próximas horas',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        affectedAreas: ['Centro', 'Zona Sul'],
        recommendations: [
          'Leve guarda-chuva',
          'Evite treinos ao ar livre',
          'Use roupas impermeáveis',
        ],
      });
    }
    
    return alerts;
  }

  // Gerar qualidade do ar simulada
  private generateMockAirQuality(): AirQualityData {
    const aqi = Math.floor(Math.random() * 200) + 1;
    
    let category: AirQualityData['category'];
    if (aqi <= 50) category = 'good';
    else if (aqi <= 100) category = 'moderate';
    else if (aqi <= 150) category = 'unhealthy_sensitive';
    else if (aqi <= 200) category = 'unhealthy';
    else if (aqi <= 300) category = 'very_unhealthy';
    else category = 'hazardous';
    
    return {
      aqi,
      category,
      pollutants: {
        co: Math.random() * 5,
        no2: Math.random() * 100,
        o3: Math.random() * 150,
        pm25: Math.random() * 50,
        pm10: Math.random() * 100,
        so2: Math.random() * 50,
      },
      healthEffects: this.getHealthEffects(category),
      recommendations: this.getAirQualityRecommendations(category),
    };
  }

  // Obter efeitos na saúde
  private getHealthEffects(category: AirQualityData['category']): string {
    switch (category) {
      case 'good':
        return 'Qualidade do ar satisfatória, risco mínimo para a saúde';
      case 'moderate':
        return 'Qualidade do ar aceitável, risco baixo para a saúde';
      case 'unhealthy_sensitive':
        return 'Pessoas sensíveis podem ter problemas respiratórios';
      case 'unhealthy':
        return 'Todos podem ter problemas respiratórios';
      case 'very_unhealthy':
        return 'Alerta de saúde, todos podem ter problemas sérios';
      case 'hazardous':
        return 'Alerta de emergência, toda a população afetada';
      default:
        return 'Informação não disponível';
    }
  }

  // Obter recomendações de qualidade do ar
  private getAirQualityRecommendations(category: AirQualityData['category']): string[] {
    switch (category) {
      case 'good':
        return ['Qualidade do ar excelente para treinos ao ar livre'];
      case 'moderate':
        return ['Qualidade do ar adequada para treinos'];
      case 'unhealthy_sensitive':
        return [
          'Pessoas sensíveis devem reduzir atividades ao ar livre',
          'Considere treinos em ambientes fechados',
        ];
      case 'unhealthy':
        return [
          'Reduza atividades ao ar livre',
          'Use máscara se necessário',
          'Prefira treinos em ambientes fechados',
        ];
      case 'very_unhealthy':
        return [
          'Evite atividades ao ar livre',
          'Use máscara obrigatoriamente',
          'Treinos apenas em ambientes fechados',
        ];
      case 'hazardous':
        return [
          'NÃO pratique atividades ao ar livre',
          'Use máscara de proteção',
          'Mantenha-se em ambientes fechados',
        ];
      default:
        return ['Informação não disponível'];
    }
  }

  // Obter descrição aleatória do tempo
  private getRandomWeatherDescription(): string {
    const descriptions = [
      'Céu limpo',
      'Parcialmente nublado',
      'Nublado',
      'Chuva leve',
      'Chuva moderada',
      'Chuva forte',
      'Tempestade',
      'Neblina',
      'Ventoso',
      'Ensolarado',
    ];
    
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  // Obter ícone aleatório do tempo
  private getRandomWeatherIcon(): string {
    const icons = [
      '01d', '01n', '02d', '02n', '03d', '03n',
      '04d', '04n', '09d', '09n', '10d', '10n',
      '11d', '11n', '13d', '13n', '50d', '50n',
    ];
    
    return icons[Math.floor(Math.random() * icons.length)];
  }

  // Gerar recomendações de treino
  private generateTrainingRecommendations(weatherData: WeatherData): TrainingRecommendation[] {
    const recommendations: TrainingRecommendation[] = [];
    
    // Recomendações baseadas no tempo
    const current = weatherData.current;
    
    if (current.temperature < WEATHER_CONFIG.alertThresholds.temperature.min) {
      recommendations.push({
        type: 'weather',
        priority: 'high',
        title: 'Temperatura Baixa',
        description: 'Temperatura muito baixa para treinos ao ar livre',
        impact: 'negative',
        suggestions: [
          'Use roupas adequadas para frio',
          'Aqueça bem antes do treino',
          'Considere treinos em ambientes fechados',
          'Hidrate-se adequadamente',
        ],
      });
    }
    
    if (current.temperature > WEATHER_CONFIG.alertThresholds.temperature.max) {
      recommendations.push({
        type: 'weather',
        priority: 'high',
        title: 'Temperatura Alta',
        description: 'Temperatura muito alta para treinos intensos',
        impact: 'negative',
        suggestions: [
          'Treine em horários mais frescos',
          'Hidrate-se abundantemente',
          'Use protetor solar',
          'Reduza intensidade do treino',
        ],
      });
    }
    
    if (current.windSpeed > WEATHER_CONFIG.alertThresholds.windSpeed.max) {
      recommendations.push({
        type: 'weather',
        priority: 'medium',
        title: 'Vento Forte',
        description: 'Condições de vento podem afetar o treino',
        impact: 'negative',
        suggestions: [
          'Evite rotas muito abertas',
          'Use roupas adequadas',
          'Considere treinos em ambientes fechados',
        ],
      });
    }
    
    // Recomendações baseadas na qualidade do ar
    if (weatherData.airQuality) {
      const aq = weatherData.airQuality;
      
      if (aq.category === 'unhealthy' || aq.category === 'very_unhealthy' || aq.category === 'hazardous') {
        recommendations.push({
          type: 'air_quality',
          priority: 'high',
          title: 'Qualidade do Ar Ruim',
          description: 'Condições de ar inadequadas para treinos ao ar livre',
          impact: 'negative',
          suggestions: [
            'Evite treinos ao ar livre',
            'Use máscara se necessário',
            'Prefira ambientes fechados',
            'Monitore sintomas respiratórios',
          ],
        });
      }
    }
    
    // Recomendações positivas
    if (current.temperature >= 18 && current.temperature <= 25 && current.humidity < 70) {
      recommendations.push({
        type: 'weather',
        priority: 'low',
        title: 'Condições Ideais',
        description: 'Tempo perfeito para treinos ao ar livre',
        impact: 'positive',
        suggestions: [
          'Aproveite as condições ideais',
          'Treinos de alta intensidade recomendados',
          'Hidratação normal',
          'Roupas leves e confortáveis',
        ],
      });
    }
    
    return recommendations;
  }

  // Notificar recomendações de treino
  private notifyTrainingRecommendations(recommendations: TrainingRecommendation[]): void {
    try {
      if (recommendations.length === 0) return;
      
      console.log('💡 Recomendações de treino geradas:', recommendations.length);
      
      // Em produção, enviar notificações push
      recommendations.forEach(recommendation => {
        if (recommendation.priority === 'high') {
          console.log(`🚨 ${recommendation.title}: ${recommendation.description}`);
        } else if (recommendation.priority === 'medium') {
          console.log(`⚠️ ${recommendation.title}: ${recommendation.description}`);
        } else {
          console.log(`ℹ️ ${recommendation.title}: ${recommendation.description}`);
        }
      });
      
    } catch (error) {
      console.error('Erro ao notificar recomendações:', error);
    }
  }

  // Limpar cache antigo
  private cleanupCache(): void {
    try {
      const now = Date.now();
      const maxAge = WEATHER_CONFIG.cacheExpiration;
      
      for (const [key, value] of this.cache.entries()) {
        if (now - value.timestamp > maxAge) {
          this.cache.delete(key);
        }
      }
      
      // Verificar tamanho do cache
      let totalSize = 0;
      for (const [key, value] of this.cache.entries()) {
        totalSize += JSON.stringify(value).length;
      }
      
      if (totalSize > WEATHER_CONFIG.maxCacheSize) {
        // Remover entradas mais antigas
        const entries = Array.from(this.cache.entries());
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
        
        while (totalSize > WEATHER_CONFIG.maxCacheSize && entries.length > 0) {
          const [key] = entries.shift()!;
          this.cache.delete(key);
          totalSize = JSON.stringify(this.cache.get(key)).length;
        }
      }
      
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
    }
  }

  // Obter dados meteorológicos atuais
  public async getCurrentWeather(latitude?: number, longitude?: number): Promise<WeatherData | null> {
    try {
      const lat = latitude || this.currentLocation?.latitude;
      const lon = longitude || this.currentLocation?.longitude;
      
      if (!lat || !lon) {
        console.log('❌ Localização não disponível');
        return null;
      }
      
      return await this.updateWeatherData(lat, lon);
      
    } catch (error) {
      console.error('Erro ao obter tempo atual:', error);
      return null;
    }
  }

  // Obter previsão do tempo
  public async getWeatherForecast(latitude?: number, longitude?: number): Promise<WeatherForecast[] | null> {
    try {
      const weatherData = await this.getCurrentWeather(latitude, longitude);
      return weatherData?.forecast || null;
      
    } catch (error) {
      console.error('Erro ao obter previsão:', error);
      return null;
    }
  }

  // Obter alertas meteorológicos
  public async getWeatherAlerts(latitude?: number, longitude?: number): Promise<WeatherAlert[] | null> {
    try {
      const weatherData = await this.getCurrentWeather(latitude, longitude);
      return weatherData?.alerts || null;
      
    } catch (error) {
      console.error('Erro ao obter alertas:', error);
      return null;
    }
  }

  // Obter qualidade do ar
  public async getAirQuality(latitude?: number, longitude?: number): Promise<AirQualityData | null> {
    try {
      const weatherData = await this.getCurrentWeather(latitude, longitude);
      return weatherData?.airQuality || null;
      
    } catch (error) {
      console.error('Erro ao obter qualidade do ar:', error);
      return null;
    }
  }

  // Obter recomendações de treino
  public async getTrainingRecommendations(latitude?: number, longitude?: number): Promise<TrainingRecommendation[]> {
    try {
      const weatherData = await this.getCurrentWeather(latitude, longitude);
      
      if (!weatherData) return [];
      
      return this.generateTrainingRecommendations(weatherData);
      
    } catch (error) {
      console.error('Erro ao obter recomendações:', error);
      return [];
    }
  }

  // Limpar cache
  public clearCache(): void {
    try {
      this.cache.clear();
      this.saveCache();
      console.log('🧹 Cache meteorológico limpo');
      
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
    }
  }

  // Parar serviço
  public stop(): void {
    try {
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
        this.updateInterval = null;
      }
      
      console.log('🛑 Serviço meteorológico parado');
      
    } catch (error) {
      console.error('Erro ao parar serviço:', error);
    }
  }
}

// Instância singleton do serviço
const weatherService = new WeatherService();

// Exportar funções públicas
export const getCurrentWeather = (lat?: number, lon?: number) => weatherService.getCurrentWeather(lat, lon);
export const getWeatherForecast = (lat?: number, lon?: number) => weatherService.getWeatherForecast(lat, lon);
export const getWeatherAlerts = (lat?: number, lon?: number) => weatherService.getWeatherAlerts(lat, lon);
export const getAirQuality = (lat?: number, lon?: number) => weatherService.getAirQuality(lat, lon);
export const getTrainingRecommendations = (lat?: number, lon?: number) => weatherService.getTrainingRecommendations(lat, lon);
export const clearWeatherCache = () => weatherService.clearCache();
export const stopWeatherService = () => weatherService.stop();

export default weatherService;