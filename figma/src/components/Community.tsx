import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Users, 
  Calendar, 
  Trophy, 
  Heart,
  MessageCircle,
  UserPlus,
  MapPin,
  Clock,
  Star,
  TrendingUp,
  Activity
} from 'lucide-react';

export function Community() {
  const [following, setFollowing] = useState<string[]>(['user1', 'user3']);

  const communityStats = {
    totalMembers: 1247,
    activeToday: 89,
    runningNow: 12
  };

  const groups = [
    {
      id: '1',
      name: 'Corredores SP',
      members: 1247,
      description: 'Grupo para corredores da região de São Paulo',
      image: '/api/placeholder/40/40',
      joined: true,
      activity: 'high'
    },
    {
      id: '2',
      name: 'Runners Ibirapuera',
      members: 567,
      description: 'Encontros no Parque Ibirapuera',
      image: '/api/placeholder/40/40',
      joined: false,
      activity: 'medium'
    },
    {
      id: '3',
      name: 'Maratona Training',
      members: 892,
      description: 'Preparação para maratonas',
      image: '/api/placeholder/40/40',
      joined: true,
      activity: 'high'
    }
  ];

  const events = [
    {
      id: '1',
      title: 'Corrida Matinal Ibirapuera',
      date: '30 de agosto',
      time: '06:00',
      location: 'Parque Ibirapuera',
      participants: 23,
      distance: '10km',
      difficulty: 'Médio',
      featured: true
    },
    {
      id: '2',
      title: 'Treino Intervalado',
      date: '2 de setembro',
      time: '07:30',
      location: 'Pista de Atletismo USP',
      participants: 15,
      distance: '5km',
      difficulty: 'Avançado',
      featured: false
    },
    {
      id: '3',
      title: 'Long Run Domingo',
      date: '3 de setembro',
      time: '06:30',
      location: 'Marginal Tietê',
      participants: 34,
      distance: '21km',
      difficulty: 'Médio',
      featured: false
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Ana Silva', distance: 145.2, avatar: 'AS', trend: 'up' },
    { rank: 2, name: 'Carlos Santos', distance: 138.7, avatar: 'CS', trend: 'up' },
    { rank: 3, name: 'Maria Oliveira', distance: 132.1, avatar: 'MO', trend: 'down' },
    { rank: 4, name: 'João Costa', distance: 128.9, avatar: 'JC', trend: 'up' },
    { rank: 5, name: 'Você', distance: 124.5, avatar: 'VC', isUser: true, trend: 'up' },
  ];

  const feed = [
    {
      id: '1',
      user: 'Ana Silva',
      avatar: 'AS',
      action: 'completou uma corrida',
      details: '8.2 km em 38:45',
      time: '2h atrás',
      likes: 12,
      comments: 3,
      type: 'achievement'
    },
    {
      id: '2',
      user: 'Carlos Santos',
      avatar: 'CS',
      action: 'atingiu uma nova meta',
      details: 'Meta mensal de 80km concluída! 🎯',
      time: '4h atrás',
      likes: 28,
      comments: 8,
      type: 'milestone'
    },
    {
      id: '3',
      user: 'Maria Oliveira',
      avatar: 'MO',
      action: 'entrou no grupo',
      details: 'Maratona Training',
      time: '6h atrás',
      likes: 5,
      comments: 1,
      type: 'social'
    }
  ];

  const toggleFollow = (userId: string) => {
    setFollowing(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="p-4 pb-24">
      {/* Header */}
      <div className="text-center pt-2 mb-6">
        <h1 className="text-2xl font-semibold">Comunidade</h1>
        <p className="text-sm text-muted-foreground mt-1">Conecte-se com outros corredores</p>
      </div>

      {/* Community stats */}
      <Card className="card-elevated mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{communityStats.totalMembers}</p>
              <p className="text-xs text-muted-foreground">Membros</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">{communityStats.activeToday}</p>
              <p className="text-xs text-muted-foreground">Ativos hoje</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">{communityStats.runningNow}</p>
              <p className="text-xs text-muted-foreground">Correndo agora</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50 rounded-xl p-1">
          <TabsTrigger value="feed" className="rounded-lg">Feed</TabsTrigger>
          <TabsTrigger value="groups" className="rounded-lg">Grupos</TabsTrigger>
          <TabsTrigger value="events" className="rounded-lg">Eventos</TabsTrigger>
          <TabsTrigger value="ranking" className="rounded-lg">Ranking</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4">
          {feed.map((post) => (
            <Card key={post.id} className="card-elevated">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {post.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div>
                      <span className="font-semibold text-sm">{post.user}</span>{' '}
                      <span className="text-muted-foreground text-sm">{post.action}</span>
                    </div>
                    <p className="font-medium text-sm">{post.details}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{post.time}</span>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-500 transition-smooth">
                          <Heart className="h-4 w-4" />
                          {post.likes}
                        </button>
                        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-smooth">
                          <MessageCircle className="h-4 w-4" />
                          {post.comments}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          {groups.map((group) => (
            <Card key={group.id} className="card-elevated">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-secondary/10 text-secondary">
                      <Users className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{group.name}</h3>
                      {group.activity === 'high' && (
                        <Badge className="bg-success text-success-foreground text-xs">Ativo</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{group.description}</p>
                    <p className="text-xs text-muted-foreground">{group.members} membros</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant={group.joined ? "outline" : "default"}
                    className={group.joined ? "" : "button-primary"}
                  >
                    {group.joined ? 'Membro' : 'Entrar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          {events.map((event) => (
            <Card key={event.id} className={`card-elevated ${event.featured ? 'ring-2 ring-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5' : ''}`}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{event.title}</h3>
                        {event.featured && (
                          <Badge className="bg-accent text-accent-foreground text-xs">Destaque</Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {event.date} às {event.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {event.participants} participantes
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          {event.distance}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {event.difficulty}
                    </Badge>
                  </div>
                  <Button className="w-full button-primary" size="sm">
                    Participar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="ranking" className="space-y-4">
          <Card className="card-elevated">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Trophy className="h-5 w-5 text-accent" />
                Ranking Mensal (Km)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((user) => (
                  <div 
                    key={user.rank} 
                    className={`flex items-center gap-3 p-3 rounded-xl transition-smooth ${
                      user.isUser ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/30'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${
                      user.rank === 1 ? 'bg-yellow-500 text-white' :
                      user.rank === 2 ? 'bg-gray-400 text-white' :
                      user.rank === 3 ? 'bg-orange-500 text-white' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {user.rank}
                    </div>
                    
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={user.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}>
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{user.name}</p>
                        {user.trend === 'up' && (
                          <TrendingUp className="h-3 w-3 text-success" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{user.distance} km este mês</p>
                    </div>
                    
                    {user.rank <= 3 && (
                      <Trophy className={`h-5 w-5 ${
                        user.rank === 1 ? 'text-yellow-500' : 
                        user.rank === 2 ? 'text-gray-400' : 'text-orange-500'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}