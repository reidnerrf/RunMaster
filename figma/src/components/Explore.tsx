import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Thermometer,
  MapPin,
  Clock,
  TrendingUp,
  Star
} from 'lucide-react';

export function Explore() {
  const currentWeather = {
    location: 'São Paulo, SP',
    condition: 'Ensolarado',
    temperature: 24,
    humidity: 65,
    windSpeed: 12,
    uvIndex: 7,
    airQuality: 'Moderado'
  };

  const bestRoutes = [
    {
      name: 'Circuito Ibirapuera Manhã',
      rating: 4.8,
      distance: '5.2 km',
      difficulty: 'Fácil',
      traffic: 'Baixo',
      airQuality: 'Bom',
      temperature: '22°C',
      recommended: true
    },
    {
      name: 'Marginal Pinheiros',
      rating: 4.2,
      distance: '8.5 km',
      difficulty: 'Médio',
      traffic: 'Médio',
      airQuality: 'Moderado',
      temperature: '24°C',
      recommended: false
    },
    {
      name: 'Parque Villa-Lobos',
      rating: 4.6,
      distance: '6.1 km',
      difficulty: 'Fácil',
      traffic: 'Baixo',
      airQuality: 'Bom',
      temperature: '23°C',
      recommended: true
    }
  ];

  const hourlyForecast = [
    { time: '09:00', temp: 22, condition: 'sun', windSpeed: 10 },
    { time: '10:00', temp: 24, condition: 'sun', windSpeed: 12 },
    { time: '11:00', temp: 26, condition: 'cloud', windSpeed: 15 },
    { time: '12:00', temp: 28, condition: 'cloud', windSpeed: 18 },
    { time: '13:00', temp: 29, condition: 'rain', windSpeed: 20 },
    { time: '14:00', temp: 27, condition: 'rain', windSpeed: 16 },
  ];

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sun': return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'cloud': return <Cloud className="h-6 w-6 text-gray-500" />;
      case 'rain': return <CloudRain className="h-6 w-6 text-blue-500" />;
      default: return <Sun className="h-6 w-6" />;
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Explorar</h1>
        <p className="text-muted-foreground">Condições ideais para correr</p>
      </div>

      {/* Current Weather */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Clima Atual
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{currentWeather.location}</p>
              <p className="text-sm text-muted-foreground">{currentWeather.condition}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{currentWeather.temperature}°C</p>
              <Sun className="h-8 w-8 text-yellow-500 ml-auto" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Wind className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium">{currentWeather.windSpeed} km/h</p>
              <p className="text-xs text-muted-foreground">Vento</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Thermometer className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium">{currentWeather.humidity}%</p>
              <p className="text-xs text-muted-foreground">Umidade</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Sun className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium">UV {currentWeather.uvIndex}</p>
              <p className="text-xs text-muted-foreground">Índice UV</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <Badge variant="secondary">
              Qualidade do Ar: {currentWeather.airQuality}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Best Route Now */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Melhor Rota Agora
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{bestRoutes[0].name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span className="text-sm">{bestRoutes[0].rating}</span>
                  </div>
                  <Badge variant="secondary">{bestRoutes[0].distance}</Badge>
                  <Badge variant="outline">{bestRoutes[0].difficulty}</Badge>
                </div>
              </div>
              <Badge className="bg-green-500">Recomendado</Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <p className="font-medium">Tráfego</p>
                <p className="text-muted-foreground">{bestRoutes[0].traffic}</p>
              </div>
              <div>
                <p className="font-medium">Ar</p>
                <p className="text-muted-foreground">{bestRoutes[0].airQuality}</p>
              </div>
              <div>
                <p className="font-medium">Temp.</p>
                <p className="text-muted-foreground">{bestRoutes[0].temperature}</p>
              </div>
            </div>
            
            <Button className="w-full">
              <MapPin className="h-4 w-4 mr-2" />
              Iniciar Nesta Rota
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hourly Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Previsão por Hora
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {hourlyForecast.map((hour, index) => (
              <div key={index} className="flex flex-col items-center min-w-[60px] text-center">
                <p className="text-sm font-medium">{hour.time}</p>
                <div className="my-2">
                  {getWeatherIcon(hour.condition)}
                </div>
                <p className="text-sm font-medium">{hour.temp}°</p>
                <p className="text-xs text-muted-foreground">{hour.windSpeed} km/h</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Routes */}
      <Card>
        <CardHeader>
          <CardTitle>Todas as Rotas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {bestRoutes.map((route, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{route.name}</h4>
                  {route.recommended && (
                    <Badge variant="secondary" className="text-xs">Recomendado</Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span>{route.rating}</span>
                  </div>
                  <span>{route.distance}</span>
                  <span>{route.difficulty}</span>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Ver Rota
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}