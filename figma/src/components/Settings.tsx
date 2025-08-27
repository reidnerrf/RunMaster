import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Bell, 
  Clock, 
  Shield, 
  User, 
  MapPin,
  Heart,
  Smartphone,
  Moon,
  Volume2,
  Vibrate
} from 'lucide-react';

export function Settings() {
  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    achievementAlerts: true,
    socialUpdates: false,
    weeklyReports: true,
    goalProgress: true
  });

  const [reminders, setReminders] = useState({
    morningRun: { enabled: true, time: '07:00' },
    eveningRun: { enabled: false, time: '18:00' },
    restDay: { enabled: true, time: '10:00' },
    hydration: { enabled: true, time: 'During runs' }
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    activitySharing: true,
    locationSharing: false,
    performanceStats: true
  });

  const toggleNotification = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const toggleReminder = (key: string) => {
    setReminders(prev => ({
      ...prev,
      [key]: {
        ...prev[key as keyof typeof prev],
        enabled: !prev[key as keyof typeof prev].enabled
      }
    }));
  };

  const togglePrivacy = (key: string) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Personalize sua experiência</p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Nome</p>
              <p className="text-sm text-muted-foreground">João Silva</p>
            </div>
            <Button variant="outline" size="sm">Editar</Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-muted-foreground">joao@email.com</p>
            </div>
            <Button variant="outline" size="sm">Alterar</Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Plano</p>
              <Badge variant="default">Premium</Badge>
            </div>
            <Button variant="outline" size="sm">Gerenciar</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {key === 'workoutReminders' && 'Lembretes de Treino'}
                  {key === 'achievementAlerts' && 'Alertas de Conquista'}
                  {key === 'socialUpdates' && 'Atualizações Sociais'}
                  {key === 'weeklyReports' && 'Relatórios Semanais'}
                  {key === 'goalProgress' && 'Progresso de Metas'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {key === 'workoutReminders' && 'Receba lembretes para suas corridas'}
                  {key === 'achievementAlerts' && 'Notificações de recordes e metas'}
                  {key === 'socialUpdates' && 'Atividades de amigos e grupos'}
                  {key === 'weeklyReports' && 'Resumo semanal de performance'}
                  {key === 'goalProgress' && 'Atualizações sobre suas metas'}
                </p>
              </div>
              <Switch 
                checked={value} 
                onCheckedChange={() => toggleNotification(key)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Lembretes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(reminders).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium">
                  {key === 'morningRun' && 'Corrida Matinal'}
                  {key === 'eveningRun' && 'Corrida Noturna'}
                  {key === 'restDay' && 'Dia de Descanso'}
                  {key === 'hydration' && 'Hidratação'}
                </p>
                <p className="text-sm text-muted-foreground">{value.time}</p>
              </div>
              <Switch 
                checked={value.enabled} 
                onCheckedChange={() => toggleReminder(key)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacidade & Segurança
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Visibilidade do Perfil</p>
              <p className="text-sm text-muted-foreground">Quem pode ver seu perfil</p>
            </div>
            <Badge variant="outline">Público</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Compartilhar Atividades</p>
              <p className="text-sm text-muted-foreground">Atividades visíveis para amigos</p>
            </div>
            <Switch 
              checked={privacy.activitySharing} 
              onCheckedChange={() => togglePrivacy('activitySharing')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Localização em Tempo Real</p>
              <p className="text-sm text-muted-foreground">Compartilhar localização durante corridas</p>
            </div>
            <Switch 
              checked={privacy.locationSharing} 
              onCheckedChange={() => togglePrivacy('locationSharing')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Estatísticas de Performance</p>
              <p className="text-sm text-muted-foreground">Dados visíveis no ranking</p>
            </div>
            <Switch 
              checked={privacy.performanceStats} 
              onCheckedChange={() => togglePrivacy('performanceStats')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Device Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Dispositivo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Modo Escuro</p>
              <p className="text-sm text-muted-foreground">Tema escuro do aplicativo</p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Som</p>
              <p className="text-sm text-muted-foreground">Alertas sonoros durante corridas</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Vibração</p>
              <p className="text-sm text-muted-foreground">Feedback tátil</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Connected Devices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Dispositivos Conectados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">Monitor Cardíaco</p>
              <p className="text-sm text-muted-foreground">Polar H10</p>
            </div>
            <Badge variant="secondary">Conectado</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">Smartwatch</p>
              <p className="text-sm text-muted-foreground">Apple Watch Series 8</p>
            </div>
            <Badge variant="outline">Desconectado</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <Button variant="outline" className="w-full">
            Exportar Dados
          </Button>
          <Button variant="outline" className="w-full">
            Suporte
          </Button>
          <Separator />
          <Button variant="destructive" className="w-full">
            Sair da Conta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}