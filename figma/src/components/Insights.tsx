import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Activity,
  Download,
  Share2,
  BarChart3,
  Clock,
  MapPin,
  Heart,
  Trophy
} from 'lucide-react';

export function Insights() {
  const weeklyStats = {
    totalDistance: 28.5,
    totalTime: '2h 18min',
    averagePace: '4:52/km',
    runs: 4,
    calories: 1850
  };

  const monthlyStats = {
    totalDistance: 124.3,
    totalTime: '10h 45min',
    averagePace: '4:58/km',
    runs: 18,
    calories: 7890
  };

  const trends = [
    {
      metric: 'Distância Semanal',
      current: 28.5,
      previous: 24.2,
      change: '+17.8%',
      trend: 'up'
    },
    {
      metric: 'Pace Médio',
      current: '4:52',
      previous: '5:08',
      change: '-16s/km',
      trend: 'up'
    },
    {
      metric: 'Frequência Cardíaca',
      current: 152,
      previous: 158,
      change: '-6 BPM',
      trend: 'up'
    },
    {
      metric: 'Calorias/Corrida',
      current: 435,
      previous: 398,
      change: '+37 cal',
      trend: 'up'
    }
  ];

  const personalRecords = [
    { distance: '5K', time: '22:45', date: '15 ago 2025', improved: true },
    { distance: '10K', time: '47:32', date: '8 ago 2025', improved: false },
    { distance: '21K', time: '1:45:20', date: '25 jul 2025', improved: true },
    { distance: 'Maratona', time: '3:42:15', date: '10 jun 2025', improved: false },
  ];

  const goals = [
    {
      name: 'Correr 80km este mês',
      current: 58.2,
      target: 80,
      progress: 72.75,
      status: 'on-track'
    },
    {
      name: 'Sub 22min nos 5K',
      current: '22:45',
      target: '22:00',
      progress: 85,
      status: 'challenging'
    },
    {
      name: 'Correr 4x por semana',
      current: 3,
      target: 4,
      progress: 75,
      status: 'on-track'
    }
  ];

  const comparisons = [
    {
      category: 'Corredores da sua idade (30-35)',
      yourRank: 'Top 15%',
      avgPace: '5:15/km',
      yourPace: '4:52/km',
      avgDistance: '18km/semana',
      yourDistance: '28.5km/semana'
    },
    {
      category: 'Corredores da sua região',
      yourRank: 'Top 25%',
      avgPace: '5:02/km',
      yourPace: '4:52/km',
      avgDistance: '22km/semana',
      yourDistance: '28.5km/semana'
    }
  ];

  return (
    <div className="p-4 pb-24">
      {/* Header */}
      <div className="text-center pt-2 mb-6">
        <h1 className="text-2xl font-semibold">Insights</h1>
        <p className="text-sm text-muted-foreground mt-1">Analise seu progresso e performance</p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50 rounded-xl p-1">
          <TabsTrigger value="dashboard" className="rounded-lg">Dashboard</TabsTrigger>
          <TabsTrigger value="trends" className="rounded-lg">Tendências</TabsTrigger>
          <TabsTrigger value="compare" className="rounded-lg">Comparar</TabsTrigger>
          <TabsTrigger value="goals" className="rounded-lg">Metas</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="card-elevated">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Esta Semana</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-2xl font-bold text-primary">{weeklyStats.totalDistance} km</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>{weeklyStats.runs} corridas • {weeklyStats.totalTime}</p>
                  <p>Pace: {weeklyStats.averagePace}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Este Mês</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-2xl font-bold text-secondary">{monthlyStats.totalDistance} km</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>{monthlyStats.runs} corridas • {monthlyStats.totalTime}</p>
                  <p>Pace: {monthlyStats.averagePace}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Personal Records */}
          <Card className="card-elevated">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Trophy className="h-5 w-5 text-accent" />
                Recordes Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {personalRecords.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-xl hover:bg-muted/30 transition-smooth">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-medium">{record.distance}</Badge>
                      <div>
                        <p className="font-semibold text-sm">{record.time}</p>
                        <p className="text-xs text-muted-foreground">{record.date}</p>
                      </div>
                    </div>
                    {record.improved && (
                      <Badge className="bg-success text-success-foreground">Melhorou!</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="flex items-center gap-2 h-12">
              <Download className="h-4 w-4" />
              Exportar Dados
            </Button>
            <Button variant="outline" className="flex items-center gap-2 h-12">
              <Share2 className="h-4 w-4" />
              Compartilhar
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="card-elevated">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-5 w-5 text-primary" />
                Análise de Tendências
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/30 transition-smooth">
                    <div className="flex-1">
                      <p className="font-semibold text-sm mb-1">{trend.metric}</p>
                      <p className="text-xs text-muted-foreground">
                        Atual: {trend.current} | Anterior: {trend.previous}
                      </p>
                    </div>
                    <Badge 
                      variant={trend.trend === 'up' ? 'default' : 'destructive'}
                      className={trend.trend === 'up' ? 'bg-success text-success-foreground' : ''}
                    >
                      {trend.change}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chart Placeholder */}
          <Card className="card-elevated">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Evolução Semanal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 bg-muted/50 rounded-xl flex items-center justify-center">
                <div className="text-center space-y-2">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">Gráfico de Performance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compare" className="space-y-6">
          {comparisons.map((comparison, index) => (
            <Card key={index} className="card-elevated">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">{comparison.category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Badge className="bg-success text-success-foreground text-base px-6 py-2 font-semibold">
                    {comparison.yourRank}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div className="space-y-2">
                    <p className="font-semibold">Pace Médio</p>
                    <p className="text-muted-foreground">Média: {comparison.avgPace}</p>
                    <p className="font-semibold text-primary">Seu: {comparison.yourPace}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold">Distância Semanal</p>
                    <p className="text-muted-foreground">Média: {comparison.avgDistance}</p>
                    <p className="font-semibold text-primary">Sua: {comparison.yourDistance}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          {goals.map((goal, index) => (
            <Card key={index} className="card-elevated">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex-1">{goal.name}</CardTitle>
                  <Badge 
                    variant={goal.status === 'on-track' ? 'default' : 'destructive'}
                    className={goal.status === 'on-track' ? 'bg-success text-success-foreground' : ''}
                  >
                    {goal.status === 'on-track' ? 'No Ritmo' : 'Desafio'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Progresso: <span className="font-semibold">{goal.current}</span></span>
                  <span>Meta: <span className="font-semibold">{goal.target}</span></span>
                </div>
                <Progress value={goal.progress} className="h-3" />
                <p className="text-xs text-muted-foreground text-center">
                  {goal.progress.toFixed(1)}% concluído
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}