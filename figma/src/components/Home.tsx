import React from 'react';
import { useAppState } from './AppState';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Play, 
  Target, 
  MapPin, 
  Clock, 
  Zap, 
  Trophy,
  Settings,
  TrendingUp,
  Activity,
  Crown,
  Bell,
  Bluetooth,
  Music
} from 'lucide-react';

export function Home() {
  const { state, actions } = useAppState();
  const user = state.user;

  if (!user) return null;

  const quickStats = {
    weekDistance: user.stats.weeklyDistance,
    weekTarget: 20,
    monthDistance: user.stats.monthlyDistance,
    monthTarget: 80,
    streak: 5
  };
  
  const suggestedRoutes = [
    { 
      name: 'Parque Ibirapuera', 
      distance: '5.2 km', 
      duration: '25 min', 
      difficulty: 'Fácil',
      rating: 4.8,
      weather: 'Ideal',
      premium: false
    },
    { 
      name: 'Rota IA: Clima Perfeito', 
      distance: '8.1 km', 
      duration: '40 min', 
      difficulty: 'Médio',
      rating: 4.9,
      weather: 'Ideal',
      premium: true
    },
    { 
      name: 'Circuito Vila Olímpia', 
      distance: '3.8 km', 
      duration: '18 min', 
      difficulty: 'Fácil',
      rating: 4.6,
      weather: 'Bom',
      premium: false
    },
  ];

  const recentActivities = [
    { date: 'Hoje', distance: '5.2 km', time: '24:15', pace: '4:40/km', type: 'run' },
    { date: 'Ontem', distance: '7.3 km', time: '35:22', pace: '4:51/km', type: 'run' },
    { date: '2 dias atrás', distance: '10.1 km', time: '48:30', pace: '4:48/km', type: 'run' },
  ];

  const achievements = [
    `Meta semanal: ${Math.round((quickStats.weekDistance / quickStats.weekTarget) * 100)}%`,
    'Sequência de 5 dias',
    'Melhor pace do mês'
  ];

  const quickActions = [
    {
      icon: MapPin,
      title: 'Explorar Rotas',
      subtitle: 'Descobrir novos caminhos',
      color: 'bg-secondary/10 text-secondary',
      action: () => actions.setSelectedTab('explore')
    },
    {
      icon: TrendingUp,
      title: 'Meus Insights',
      subtitle: 'Acompanhar progresso',
      color: 'bg-primary/10 text-primary',
      action: () => actions.setSelectedTab('insights')
    },
    {
      icon: Bluetooth,
      title: 'Conectar Dispositivos',
      subtitle: 'Relógio e fones',
      color: 'bg-accent/10 text-accent',
      action: () => actions.setSelectedTab('settings')
    },
    {
      icon: Music,
      title: 'Spotify',
      subtitle: 'Suas playlists',
      color: 'bg-green-500/10 text-green-600',
      action: () => alert('Conectar ao Spotify em breve!')
    }
  ];

  const handleStartRun = () => {
    actions.startRun();
  };

  const handleRouteSelect = (route: any) => {
    if (route.premium && !user.isPremium) {
      actions.showPremiumUpgrade();
      return;
    }
    
    // Start run with selected route
    actions.startRun();
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header with user greeting and notifications */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {user.avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                {new Date().getHours() < 12 ? 'Bom dia' : 
                 new Date().getHours() < 18 ? 'Boa tarde' : 'Boa noite'},
              </p>
              {user.isPremium && (
                <Crown className="h-3 w-3 text-accent" />
              )}
            </div>
            <h1 className="text-xl font-semibold">{user.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" className="rounded-full h-10 w-10 p-0">
            <Bell className="h-5 w-5" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="rounded-full h-10 w-10 p-0"
            onClick={() => actions.setSelectedTab('settings')}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Quick start section */}
      <Card className="card-elevated">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-1">Pronto para correr?</h2>
              <p className="text-sm text-muted-foreground">
                {user.preferences.goal === 'weight-loss' ? 'Vamos queimar calorias!' :
                 user.preferences.goal === '10k' ? 'Rumo aos 10K!' :
                 user.preferences.goal === 'performance' ? 'Melhore sua performance!' :
                 'Condições ideais para sua corrida'}
              </p>
            </div>
            <Button 
              className="button-primary w-full h-14 text-lg font-semibold rounded-xl haptic-feedback"
              size="lg"
              onClick={handleStartRun}
            >
              <Play className="h-6 w-6 mr-3" />
              Iniciar Corrida
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Goals progress */}
      <Card className="card-elevated">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="h-5 w-5 text-primary" />
            Suas Metas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Meta Semanal</span>
              <span className="text-sm text-muted-foreground">
                {quickStats.weekDistance}km / {quickStats.weekTarget}km
              </span>
            </div>
            <Progress 
              value={(quickStats.weekDistance / quickStats.weekTarget) * 100} 
              className="h-2"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Meta Mensal</span>
              <span className="text-sm text-muted-foreground">
                {quickStats.monthDistance}km / {quickStats.monthTarget}km
              </span>
            </div>
            <Progress 
              value={(quickStats.monthDistance / quickStats.monthTarget) * 100} 
              className="h-2"
            />
          </div>

          <div className="flex items-center justify-center pt-2">
            <Badge variant="secondary" className="bg-accent/10 text-accent-foreground border-accent/20">
              <Zap className="h-3 w-3 mr-1" />
              Sequência de {quickStats.streak} dias
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((action, index) => (
          <Card 
            key={index}
            className="card-elevated haptic-feedback transition-smooth hover:shadow-elevated cursor-pointer"
            onClick={action.action}
          >
            <CardContent className="p-4 text-center">
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <action.icon className="h-6 w-6" />
              </div>
              <h3 className="font-medium text-sm mb-1">{action.title}</h3>
              <p className="text-xs text-muted-foreground">{action.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Suggested routes */}
      <Card className="card-elevated">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-5 w-5 text-secondary" />
              Rotas Recomendadas
            </CardTitle>
            <Badge variant="outline" className="text-xs">Hoje</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {suggestedRoutes.map((route, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/30 transition-smooth cursor-pointer"
              onClick={() => handleRouteSelect(route)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-sm">{route.name}</h4>
                  {route.premium && (
                    <Badge className="bg-accent text-accent-foreground text-xs">
                      <Crown className="h-2 w-2 mr-1" />
                      Premium
                    </Badge>
                  )}
                  <Badge 
                    variant={route.weather === 'Ideal' ? 'default' : 'secondary'}
                    className={route.weather === 'Ideal' ? 'bg-success text-success-foreground' : ''}
                  >
                    {route.weather}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {route.distance}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {route.duration}
                  </span>
                  <Badge variant="outline" className="text-xs px-2 py-0">
                    {route.difficulty}
                  </Badge>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="rounded-lg">
                <Play className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent activities */}
      <Card className="card-elevated">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-5 w-5 text-accent" />
            Atividades Recentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-smooth">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{activity.distance}</span>
                    <Badge variant="outline" className="text-xs">
                      {activity.pace}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm">{activity.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Achievements banner */}
      <Card className="card-elevated bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
              <Trophy className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Conquistas Recentes</h3>
              <p className="text-xs text-muted-foreground">Continue assim!</p>
            </div>
          </div>
          <div className="space-y-2">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                <span>{achievement}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}