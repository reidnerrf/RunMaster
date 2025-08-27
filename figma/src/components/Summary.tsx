import React, { useState } from 'react';
import { useAppState } from './AppState';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Share2, 
  Download, 
  Calendar, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Heart,
  AlertTriangle,
  Trophy,
  Activity,
  ArrowLeft,
  Save,
  Users,
  Target,
  Zap
} from 'lucide-react';

export function Summary() {
  const { state, actions } = useAppState();
  const [selectedExport, setSelectedExport] = useState<'gpx' | 'tcx' | 'pdf' | null>(null);

  const runData = state.currentRun || {
    duration: 1548, // 25:48
    distance: 5.2,
    pace: '4:58',
    calories: 320,
    avgHeartRate: 152,
    maxHeartRate: 178,
    elevation: 45
  };

  const splits = [
    { km: 1, time: '4:45', pace: '4:45/km', heartRate: 148 },
    { km: 2, time: '4:52', pace: '4:52/km', heartRate: 151 },
    { km: 3, time: '5:01', pace: '5:01/km', heartRate: 155 },
    { km: 4, time: '4:58', pace: '4:58/km', heartRate: 153 },
    { km: 5, time: '5:12', pace: '5:12/km', heartRate: 149 },
  ];

  const injuryRisk = {
    level: 'Baixo',
    score: 25,
    factors: [
      { name: 'Volume de treino', status: 'Adequado', risk: 'low', description: 'Aumento gradual semanal' },
      { name: 'Frequência cardíaca', status: 'Ideal', risk: 'low', description: 'Zona aeróbica mantida' },
      { name: 'Variação de pace', status: 'Boa', risk: 'low', description: 'Consistência adequada' },
      { name: 'Tempo de recuperação', status: 'Suficiente', risk: 'low', description: 'Últimos 3 dias de descanso' },
    ]
  };

  const achievements = [
    'Melhor pace dos últimos 7 dias',
    'Meta de distância semanal atingida',
    '5km em menos de 26 minutos',
    'Sequência de 5 corridas mantida'
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShare = () => {
    // Simulate sharing
    navigator.share?.({
      title: 'Minha corrida - RunTracker',
      text: `Acabei de correr ${runData.distance}km em ${formatTime(runData.duration)}! 🏃‍♂️`,
      url: window.location.href
    });
  };

  const handleExport = (format: 'gpx' | 'tcx' | 'pdf') => {
    setSelectedExport(format);
    // Simulate export
    setTimeout(() => {
      setSelectedExport(null);
      // Simulate download
    }, 1500);
  };

  const handleSaveRoute = () => {
    // Save route logic
    alert('Rota salva com sucesso!');
  };

  const handleAddToCalendar = () => {
    // Add to calendar logic
    const event = {
      title: `Corrida - ${runData.distance}km`,
      start: new Date().toISOString(),
      description: `Corrida de ${runData.distance}km em ${formatTime(runData.duration)}`
    };
    // Simulate calendar integration
    alert('Evento adicionado ao calendário!');
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-success';
      case 'medium': return 'text-warning';
      case 'high': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => actions.setCurrentFlow('main')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <div className="text-center">
          <h1 className="text-xl font-semibold">Resumo da Corrida</h1>
          <p className="text-sm text-muted-foreground">27 de agosto, 2025</p>
        </div>
        <div className="w-16"></div>
      </div>

      {/* Main Stats */}
      <Card className="card-elevated bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{runData.distance} km</p>
              <p className="text-sm text-muted-foreground">Distância</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">{formatTime(runData.duration)}</p>
              <p className="text-sm text-muted-foreground">Tempo</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">{runData.pace}/km</p>
              <p className="text-sm text-muted-foreground">Pace Médio</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{runData.calories}</p>
              <p className="text-sm text-muted-foreground">Calorias</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Heart Rate */}
      <Card className="card-elevated">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Heart className="h-5 w-5 text-red-500" />
            Frequência Cardíaca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">{runData.avgHeartRate}</p>
              <p className="text-sm text-muted-foreground">BPM Médio</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{runData.maxHeartRate}</p>
              <p className="text-sm text-muted-foreground">BPM Máximo</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-muted/50 rounded-lg text-center">
            <Badge className="bg-success text-success-foreground">
              <Heart className="w-3 w-3 mr-1" />
              Zona Aeróbica - Ideal para resistência
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Splits */}
      <Card className="card-elevated">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-5 w-5 text-primary" />
            Splits por Quilômetro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {splits.map((split, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border rounded-xl hover:bg-muted/30 transition-smooth">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="w-12 justify-center">KM {split.km}</Badge>
                  <div>
                    <p className="font-semibold text-sm">{split.time}</p>
                    <p className="text-xs text-muted-foreground">{split.heartRate} BPM</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">{split.pace}</p>
                  <div className="w-16 h-1 bg-muted rounded-full mt-1">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.min((5 * 60) / (parseInt(split.time.split(':')[0]) * 60 + parseInt(split.time.split(':')[1])) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Injury Risk Analysis */}
      <Card className="card-elevated">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-5 w-5 text-accent" />
            Análise de Risco de Lesão
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Risco Geral</span>
            <Badge className="bg-success text-success-foreground">
              {injuryRisk.level} ({injuryRisk.score}%)
            </Badge>
          </div>
          
          <Progress value={injuryRisk.score} className="h-3" />
          
          <div className="space-y-3">
            {injuryRisk.factors.map((factor, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{factor.name}</p>
                  <p className="text-xs text-muted-foreground">{factor.description}</p>
                </div>
                <Badge 
                  variant="outline"
                  className={`${getRiskColor(factor.risk)} border-current`}
                >
                  {factor.status}
                </Badge>
              </div>
            ))}
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm">
              <strong>💡 Recomendação:</strong> Mantenha esse ritmo! Considere incluir um dia de cross-training na próxima semana.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="card-elevated">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-5 w-5 text-accent" />
            Conquistas desta Corrida
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-accent/5 to-secondary/5 rounded-lg">
                <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-accent" />
                </div>
                <span className="text-sm font-medium">{achievement}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-4">
        {/* Primary Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            className="button-primary h-12 flex items-center gap-2"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            Compartilhar
          </Button>
          <Button 
            variant="outline" 
            className="h-12 flex items-center gap-2"
            onClick={handleSaveRoute}
          >
            <Save className="h-4 w-4" />
            Salvar Rota
          </Button>
        </div>

        {/* Export Options */}
        <Card className="card-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Exportar Dados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {(['gpx', 'tcx', 'pdf'] as const).map((format) => (
                <Button
                  key={format}
                  size="sm"
                  variant="outline"
                  onClick={() => handleExport(format)}
                  disabled={selectedExport === format}
                  className="flex items-center gap-1"
                >
                  {selectedExport === format ? (
                    <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Download className="h-3 w-3" />
                  )}
                  {format.toUpperCase()}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="h-12 flex items-center gap-2"
            onClick={handleAddToCalendar}
          >
            <Calendar className="h-4 w-4" />
            Adicionar ao Calendário
          </Button>
          <Button 
            variant="outline" 
            className="h-12 flex items-center gap-2"
            onClick={() => actions.setCurrentFlow('insights')}
          >
            <TrendingUp className="h-4 w-4" />
            Ver Análise Completa
          </Button>
        </div>
      </div>

      {/* Social Integration */}
      {state.user?.isPremium && (
        <Card className="card-elevated bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-sm">Compartilhar com a Comunidade</h3>
              <Badge className="bg-primary text-primary-foreground text-xs">Premium</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Inspire outros corredores compartilhando sua conquista
            </p>
            <Button size="sm" className="w-full button-primary">
              <Zap className="h-3 w-3 mr-2" />
              Postar no Feed
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}