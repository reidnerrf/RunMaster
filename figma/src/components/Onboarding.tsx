import React, { useState } from 'react';
import { useAppState } from './AppState';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Target, 
  Clock, 
  MapPin, 
  Bell, 
  ArrowRight, 
  ArrowLeft,
  Check,
  Zap,
  Trophy,
  Heart
} from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  component: React.ReactNode;
}

export function Onboarding() {
  const { actions } = useAppState();
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    goal: null as 'weight-loss' | '10k' | 'performance' | null,
    preferredTime: null as 'morning' | 'afternoon' | 'evening' | null,
    terrain: null as 'road' | 'trail' | 'track' | null,
    notifications: false,
    gpsPermission: false,
    healthPermission: false
  });

  const updatePreference = (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleComplete = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    actions.completeOnboarding(preferences);
  };

  const steps: OnboardingStep[] = [
    {
      id: 0,
      title: "Qual é seu objetivo?",
      subtitle: "Vamos personalizar sua experiência",
      component: (
        <div className="space-y-4">
          {[
            { id: 'weight-loss', title: 'Perder Peso', subtitle: 'Queimar calorias e manter forma', icon: Heart, color: 'bg-red-500' },
            { id: '10k', title: 'Correr 10K', subtitle: 'Completar uma corrida de 10 quilômetros', icon: Target, color: 'bg-blue-500' },
            { id: 'performance', title: 'Melhorar Performance', subtitle: 'Aumentar velocidade e resistência', icon: Zap, color: 'bg-purple-500' }
          ].map((goal) => (
            <Card 
              key={goal.id}
              className={`cursor-pointer transition-all ${
                preferences.goal === goal.id 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => updatePreference('goal', goal.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${goal.color} rounded-xl flex items-center justify-center`}>
                    <goal.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{goal.title}</h3>
                    <p className="text-sm text-muted-foreground">{goal.subtitle}</p>
                  </div>
                  {preferences.goal === goal.id && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    },
    {
      id: 1,
      title: "Quando prefere correr?",
      subtitle: "Configuraremos lembretes personalizados",
      component: (
        <div className="space-y-4">
          {[
            { id: 'morning', title: 'Manhã', subtitle: '06:00 - 10:00', icon: '🌅' },
            { id: 'afternoon', title: 'Tarde', subtitle: '12:00 - 17:00', icon: '☀️' },
            { id: 'evening', title: 'Noite', subtitle: '18:00 - 21:00', icon: '🌙' }
          ].map((time) => (
            <Card 
              key={time.id}
              className={`cursor-pointer transition-all ${
                preferences.preferredTime === time.id 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => updatePreference('preferredTime', time.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-2xl">
                    {time.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{time.title}</h3>
                    <p className="text-sm text-muted-foreground">{time.subtitle}</p>
                  </div>
                  {preferences.preferredTime === time.id && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    },
    {
      id: 2,
      title: "Onde gosta de correr?",
      subtitle: "Recomendaremos rotas adequadas",
      component: (
        <div className="space-y-4">
          {[
            { id: 'road', title: 'Asfalto', subtitle: 'Ruas e avenidas urbanas', icon: MapPin, color: 'bg-gray-500' },
            { id: 'trail', title: 'Trilha', subtitle: 'Parques e áreas naturais', icon: MapPin, color: 'bg-green-500' },
            { id: 'track', title: 'Pista', subtitle: 'Pistas de atletismo', icon: MapPin, color: 'bg-orange-500' }
          ].map((terrain) => (
            <Card 
              key={terrain.id}
              className={`cursor-pointer transition-all ${
                preferences.terrain === terrain.id 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => updatePreference('terrain', terrain.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${terrain.color} rounded-xl flex items-center justify-center`}>
                    <terrain.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{terrain.title}</h3>
                    <p className="text-sm text-muted-foreground">{terrain.subtitle}</p>
                  </div>
                  {preferences.terrain === terrain.id && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    },
    {
      id: 3,
      title: "Permissões necessárias",
      subtitle: "Para melhor experiência do app",
      component: (
        <div className="space-y-6">
          <div className="space-y-4">
            <Card className="border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Localização (GPS)</h3>
                      <p className="text-sm text-muted-foreground">Para rastrear suas corridas</p>
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => updatePreference('gpsPermission', true)}
                    disabled={preferences.gpsPermission}
                    className={preferences.gpsPermission ? 'bg-success' : ''}
                  >
                    {preferences.gpsPermission ? <Check className="w-4 h-4" /> : 'Permitir'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-secondary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <Bell className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Notificações</h3>
                      <p className="text-sm text-muted-foreground">Lembretes e atualizações</p>
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => updatePreference('notifications', !preferences.notifications)}
                    className={preferences.notifications ? 'bg-success text-white' : ''}
                  >
                    {preferences.notifications ? <Check className="w-4 h-4" /> : 'Permitir'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-medium">HealthKit</h3>
                      <p className="text-sm text-muted-foreground">Sincronizar dados de saúde</p>
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => updatePreference('healthPermission', !preferences.healthPermission)}
                    className={preferences.healthPermission ? 'bg-success text-white' : ''}
                  >
                    {preferences.healthPermission ? <Check className="w-4 h-4" /> : 'Permitir'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-sm text-muted-foreground">
              ✨ <strong>Dica:</strong> Todas as permissões podem ser alteradas depois nas configurações.
            </p>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const canProceed = 
    (currentStep === 0 && preferences.goal) ||
    (currentStep === 1 && preferences.preferredTime) ||
    (currentStep === 2 && preferences.terrain) ||
    (currentStep === 3 && preferences.gpsPermission);

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col">
      {/* Header */}
      <div className="pt-8 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Configuração Inicial</h1>
          <Badge variant="outline">{currentStep + 1} de {steps.length}</Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">{currentStepData.title}</h2>
          <p className="text-muted-foreground">{currentStepData.subtitle}</p>
        </div>

        <div className="max-w-md mx-auto">
          {currentStepData.component}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep(prev => prev - 1)}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        {currentStep === steps.length - 1 ? (
          <Button 
            onClick={handleComplete}
            disabled={!canProceed}
            className="flex items-center gap-2 button-primary"
          >
            Começar
            <Trophy className="w-4 h-4" />
          </Button>
        ) : (
          <Button 
            onClick={() => setCurrentStep(prev => prev + 1)}
            disabled={!canProceed}
            className="flex items-center gap-2 button-primary"
          >
            Continuar
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}