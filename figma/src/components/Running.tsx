import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Play, 
  Pause, 
  Square, 
  Navigation, 
  Cloud, 
  Thermometer, 
  Wind,
  Heart,
  Zap,
  MapPin,
  Timer,
  Activity
} from 'lucide-react';

export function Running() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [pace, setPace] = useState('0:00');
  const [heartRate, setHeartRate] = useState(0);
  const [calories, setCalories] = useState(0);

  // Mock live metrics
  useEffect(() => {
    if (isRunning && !isPaused) {
      const interval = setInterval(() => {
        setTime(prev => prev + 1);
        setDistance(prev => prev + 0.01);
        setHeartRate(prev => 145 + Math.random() * 20);
        setCalories(prev => prev + 0.15);
        
        // Calculate pace
        if (distance > 0) {
          const paceSeconds = (time / 60) / distance;
          const minutes = Math.floor(paceSeconds);
          const seconds = Math.floor((paceSeconds - minutes) * 60);
          setPace(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isRunning, isPaused, distance, time]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTime(0);
    setDistance(0);
    setPace('0:00');
    setHeartRate(0);
    setCalories(0);
  };

  const heartRateZone = heartRate > 0 ? (
    heartRate < 120 ? 'Zona 1' :
    heartRate < 140 ? 'Zona 2' :
    heartRate < 160 ? 'Zona 3' :
    heartRate < 180 ? 'Zona 4' : 'Zona 5'
  ) : 'Zona 1';

  const zoneColor = 
    heartRateZone === 'Zona 1' ? 'text-blue-500' :
    heartRateZone === 'Zona 2' ? 'text-green-500' :
    heartRateZone === 'Zona 3' ? 'text-yellow-500' :
    heartRateZone === 'Zona 4' ? 'text-orange-500' : 'text-red-500';

  return (
    <div className="p-4 space-y-6 pb-32">
      {/* Header */}
      <div className="text-center pt-2">
        <h1 className="text-2xl font-semibold">
          {!isRunning ? 'Pronto para Correr' : isPaused ? 'Corrida Pausada' : 'Correndo'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {!isRunning ? 'Inicie sua atividade' : 'Acompanhe suas métricas em tempo real'}
        </p>
      </div>

      {/* Weather card */}
      <Card className="card-elevated">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Cloud className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">São Paulo</h3>
                <p className="text-xs text-muted-foreground">Parcialmente nublado</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Thermometer className="h-4 w-4 text-red-500" />
                <span>22°C</span>
              </div>
              <div className="flex items-center gap-1">
                <Wind className="h-4 w-4 text-blue-500" />
                <span>15 km/h</span>
              </div>
            </div>
          </div>
          <div className="mt-3 text-center">
            <Badge className="bg-success text-success-foreground">
              Condições Ideais para Corrida
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Map view */}
      <Card className="card-elevated h-48">
        <CardContent className="p-0 h-full relative">
          <div className="w-full h-full bg-muted rounded-xl flex items-center justify-center">
            <div className="text-center space-y-2">
              <Navigation className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">Mapa em Tempo Real</p>
            </div>
          </div>
          
          {/* Overlay badges */}
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-success text-success-foreground">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              GPS Conectado
            </Badge>
          </div>
          
          {isRunning && (
            <div className="absolute bottom-4 right-4">
              <Badge variant="outline" className="bg-card">
                <MapPin className="h-3 w-3 mr-1" />
                Rastreando
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="card-elevated">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Timer className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold">{formatTime(time)}</p>
            <p className="text-xs text-muted-foreground mt-1">Tempo</p>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <MapPin className="h-5 w-5 text-secondary" />
            </div>
            <p className="text-2xl font-bold">{distance.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">Km</p>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Activity className="h-5 w-5 text-accent" />
            </div>
            <p className="text-2xl font-bold">{pace}</p>
            <p className="text-xs text-muted-foreground mt-1">Pace /km</p>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Heart className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-red-500">
              {Math.round(heartRate)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">BPM</p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="card-elevated">
          <CardContent className="p-3 text-center">
            <p className="text-lg font-semibold">{Math.round(calories)}</p>
            <p className="text-xs text-muted-foreground">Calorias</p>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardContent className="p-3 text-center">
            <p className="text-lg font-semibold">156</p>
            <p className="text-xs text-muted-foreground">Passos/min</p>
          </CardContent>
        </Card>
        
        <Card className="card-elevated">
          <CardContent className="p-3 text-center">
            <p className="text-lg font-semibold">12m</p>
            <p className="text-xs text-muted-foreground">Elevação</p>
          </CardContent>
        </Card>
      </div>

      {/* Heart rate zone */}
      {heartRate > 0 && (
        <Card className="card-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Heart className="h-4 w-4 text-red-500" />
              Zona de Treino
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-center">
              <Badge className={`${zoneColor} bg-card border-current`}>
                <Zap className="h-3 w-3 mr-1" />
                {heartRateZone} - Aeróbica
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Z1</span>
                <span>Z2</span>
                <span>Z3</span>
                <span>Z4</span>
                <span>Z5</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 via-orange-400 to-red-400"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Control buttons */}
      <div className="fixed bottom-24 left-4 right-4">
        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-6">
              {!isRunning ? (
                <Button 
                  onClick={handleStart} 
                  className="button-primary rounded-full h-16 w-16 haptic-feedback"
                  size="lg"
                >
                  <Play className="h-8 w-8" />
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={handlePause} 
                    variant="outline" 
                    size="lg" 
                    className="rounded-full h-12 w-12 haptic-feedback border-2"
                  >
                    <Pause className="h-6 w-6" />
                  </Button>
                  <Button 
                    onClick={handleStop} 
                    variant="destructive" 
                    size="lg" 
                    className="rounded-full h-12 w-12 haptic-feedback"
                  >
                    <Square className="h-6 w-6" />
                  </Button>
                </>
              )}
            </div>
            {isPaused && (
              <p className="text-center text-sm text-muted-foreground mt-3">
                Corrida pausada • Toque para continuar
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}