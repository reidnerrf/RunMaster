import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  CreditCard,
  TrendingUp,
  UserCheck,
  UserX,
  Star,
  MapPin,
  Clock
} from 'lucide-react';

export function Admin() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');

  const stats = {
    totalUsers: 12547,
    activeUsers: 8932,
    newUsers: 245,
    premiumUsers: 3421,
    monthlyRevenue: 45680,
    events: 28,
    totalDistance: 892456
  };

  const users = [
    {
      id: '1',
      name: 'Ana Silva',
      email: 'ana@email.com',
      plan: 'Premium',
      joinDate: '15 mar 2025',
      lastActive: '1h atrás',
      status: 'active'
    },
    {
      id: '2',
      name: 'Carlos Santos',
      email: 'carlos@email.com',
      plan: 'Free',
      joinDate: '22 fev 2025',
      lastActive: '3 dias atrás',
      status: 'inactive'
    },
    {
      id: '3',
      name: 'Maria Oliveira',
      email: 'maria@email.com',
      plan: 'Premium',
      joinDate: '8 jan 2025',
      lastActive: '30min atrás',
      status: 'active'
    }
  ];

  const events = [
    {
      id: '1',
      title: 'Corrida Matinal Ibirapuera',
      date: '30 ago 2025',
      participants: 23,
      status: 'active',
      location: 'São Paulo'
    },
    {
      id: '2',
      title: 'Maratona de SP',
      date: '15 set 2025',
      participants: 156,
      status: 'pending',
      location: 'São Paulo'
    },
    {
      id: '3',
      title: 'Treino Intervalado',
      date: '2 set 2025',
      participants: 12,
      status: 'active',
      location: 'Rio de Janeiro'
    }
  ];

  const subscriptions = [
    {
      id: '1',
      user: 'Ana Silva',
      plan: 'Premium Anual',
      price: 'R$ 199,90',
      nextBilling: '15 mar 2026',
      status: 'active'
    },
    {
      id: '2',
      user: 'João Costa',
      plan: 'Premium Mensal',
      price: 'R$ 19,90',
      nextBilling: '5 set 2025',
      status: 'active'
    },
    {
      id: '3',
      user: 'Pedro Lima',
      plan: 'Premium Mensal',
      price: 'R$ 19,90',
      nextBilling: '12 set 2025',
      status: 'cancelled'
    }
  ];

  const financialData = {
    monthlyRevenue: 45680,
    yearlyRevenue: 548160,
    averageRevenuePerUser: 13.35,
    churnRate: 4.2,
    conversionRate: 12.8
  };

  return (
    <div className="p-4">
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="finance">Finanças</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Usuários Totais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">+{stats.newUsers} este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Usuários Ativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% do total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Receita Mensal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">R$ {stats.monthlyRevenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">+12.5% vs mês anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Premium
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats.premiumUsers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  {((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1)}% conversão
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12">
                  <Users className="h-4 w-4 mr-2" />
                  Gerenciar Usuários
                </Button>
                <Button variant="outline" className="h-12">
                  <Calendar className="h-4 w-4 mr-2" />
                  Criar Evento
                </Button>
                <Button variant="outline" className="h-12">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Relatórios
                </Button>
                <Button variant="outline" className="h-12">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Assinaturas
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 border rounded">
                  <UserCheck className="h-4 w-4 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">23 novos usuários hoje</p>
                    <p className="text-xs text-muted-foreground">2h atrás</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 border rounded">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Evento "Corrida Matinal" criado</p>
                    <p className="text-xs text-muted-foreground">4h atrás</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 border rounded">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">15 novas assinaturas Premium</p>
                    <p className="text-xs text-muted-foreground">6h atrás</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          {/* User Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <UserCheck className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Ativos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                <p className="text-2xl font-bold">{stats.premiumUsers.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Premium</p>
              </CardContent>
            </Card>
          </div>

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle>Usuários Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <Badge variant={user.plan === 'Premium' ? 'default' : 'outline'}>
                          {user.plan}
                        </Badge>
                        <Badge 
                          variant={user.status === 'active' ? 'secondary' : 'destructive'}
                          className={user.status === 'active' ? 'bg-green-500 text-white' : ''}
                        >
                          {user.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span>Entrou: {user.joinDate}</span>
                        <span>Último acesso: {user.lastActive}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Gerenciar
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          {/* Event Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-6 w-6 mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.events}</p>
                <p className="text-sm text-muted-foreground">Eventos Ativos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 mx-auto mb-2" />
                <p className="text-2xl font-bold">191</p>
                <p className="text-sm text-muted-foreground">Participantes</p>
              </CardContent>
            </Card>
          </div>

          {/* Events List */}
          <Card>
            <CardHeader>
              <CardTitle>Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-medium">{event.title}</h3>
                        <Badge 
                          variant={event.status === 'active' ? 'default' : 'outline'}
                          className={event.status === 'active' ? 'bg-green-500' : ''}
                        >
                          {event.status === 'active' ? 'Ativo' : 'Pendente'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {event.participants} participantes
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Editar
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finance" className="space-y-4">
          {/* Financial Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5" />
                  <span className="font-medium">Receita Mensal</span>
                </div>
                <p className="text-2xl font-bold">R$ {financialData.monthlyRevenue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">+12.5% vs mês anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-medium">Receita Anual</span>
                </div>
                <p className="text-2xl font-bold">R$ {financialData.yearlyRevenue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Projeção baseada em 12 meses</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5" />
                  <span className="font-medium">ARPU</span>
                </div>
                <p className="text-2xl font-bold">R$ {financialData.averageRevenuePerUser}</p>
                <p className="text-sm text-muted-foreground">Receita média por usuário</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <UserX className="h-5 w-5" />
                  <span className="font-medium">Churn Rate</span>
                </div>
                <p className="text-2xl font-bold">{financialData.churnRate}%</p>
                <p className="text-sm text-muted-foreground">Taxa de cancelamento mensal</p>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Assinaturas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {subscriptions.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-medium">{sub.user}</p>
                        <Badge variant="outline">{sub.plan}</Badge>
                        <Badge 
                          variant={sub.status === 'active' ? 'default' : 'destructive'}
                          className={sub.status === 'active' ? 'bg-green-500' : ''}
                        >
                          {sub.status === 'active' ? 'Ativa' : 'Cancelada'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{sub.price}</span>
                        <span>Próximo pagamento: {sub.nextBilling}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Ver Detalhes
                    </Button>
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