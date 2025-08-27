import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Card, Badge, Button } from './index';
import { 
  Brain, 
  Zap, 
  Clock, 
  MapPin, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Heart,
  Target,
  RefreshCw,
  Cloud,
  Users
} from 'lucide-react-native';
import { hapticSuccess, hapticWarning } from '../../utils/haptics';

export type SmartSuggestion = {
  id: string;
  type: 'route' | 'workout' | 'nutrition' | 'recovery' | 'goal' | 'weather' | 'social';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  icon: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  dismissible?: boolean;
  expiresAt?: Date;
  aiReasoning: string;
  confidence: number; // 0-100
  personalizationFactors: string[];
};

type AISmartSuggestionsProps = {
  userContext: {
    currentLocation?: { lat: number; lon: number };
    lastWorkout?: any;
    currentGoals?: any[];
    weatherConditions?: any;
    timeOfDay?: string;
    energyLevel?: 'low' | 'medium' | 'high';
    recentInjuries?: string[];
  };
  onSuggestionAccepted?: (suggestion: SmartSuggestion) => void;
  onSuggestionDismissed?: (suggestion: SmartSuggestion) => void;
};

export default function AISmartSuggestions({ 
  userContext, 
  onSuggestionAccepted, 
  onSuggestionDismissed 
}: AISmartSuggestionsProps) {
  const { theme } = useTheme();
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [visibleSuggestions, setVisibleSuggestions] = useState<SmartSuggestion[]>([]);
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    generateSmartSuggestions();
  }, [userContext]);

  useEffect(() => {
    setVisibleSuggestions(suggestions.slice(0, 3)); // Mostra apenas as 3 principais
  }, [suggestions]);

  const generateSmartSuggestions = () => {
    const newSuggestions: SmartSuggestion[] = [];

    // Sugestão baseada no horário
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 9) {
      newSuggestions.push({
        id: 'morning-run',
        type: 'workout',
        priority: 'high',
        title: 'Corrida Matinal Ideal',
        description: 'Perfeito para começar o dia com energia. Temperatura amena e ar limpo.',
        icon: '🌅',
        action: {
          label: 'Iniciar Corrida',
          onPress: () => {
            hapticSuccess();
            onSuggestionAccepted?.(newSuggestions[0]);
          }
        },
        aiReasoning: 'Horário ideal para corrida: temperatura amena, menos poluição, mais energia natural',
        confidence: 95,
        personalizationFactors: ['Horário preferido', 'Condições climáticas']
      });
    }

    // Sugestão baseada no clima
    if (userContext.weatherConditions) {
      const { temperature, precipitation, wind } = userContext.weatherConditions;
      if (temperature > 25 && precipitation < 0.3) {
        newSuggestions.push({
          id: 'weather-optimization',
          type: 'weather',
          priority: 'medium',
          title: 'Otimização Climática',
          description: 'Temperatura alta - considere hidratação extra e roupas leves.',
          icon: '🌡️',
          action: {
            label: 'Ver Detalhes',
            onPress: () => {
              hapticSuccess();
              onSuggestionAccepted?.(newSuggestions[1]);
            }
          },
          aiReasoning: 'Temperatura acima de 25°C requer ajustes na hidratação e vestuário',
          confidence: 88,
          personalizationFactors: ['Condições climáticas', 'Histórico de performance']
        });
      }
    }

    // Sugestão baseada na recuperação
    if (userContext.lastWorkout && userContext.lastWorkout.intensity === 'high') {
      newSuggestions.push({
        id: 'recovery-suggestion',
        type: 'recovery',
        priority: 'high',
        title: 'Dia de Recuperação',
        description: 'Treino intenso ontem - hoje é ideal para descanso ativo ou treino leve.',
        icon: '🔄',
        action: {
          label: 'Ver Plano',
          onPress: () => {
            hapticSuccess();
            onSuggestionAccepted?.(newSuggestions[2]);
          }
        },
        aiReasoning: 'Treino de alta intensidade requer 24-48h de recuperação para evitar overtraining',
        confidence: 92,
        personalizationFactors: ['Histórico de treinos', 'Padrão de recuperação']
      });
    }

    // Sugestão baseada em metas
    if (userContext.currentGoals?.some(goal => goal.deadline && new Date(goal.deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))) {
      newSuggestions.push({
        id: 'goal-reminder',
        type: 'goal',
        priority: 'medium',
        title: 'Meta Próxima do Prazo',
        description: 'Você tem uma meta vencendo em breve. Vamos ajustar o plano?',
        icon: '🎯',
        action: {
          label: 'Revisar Meta',
          onPress: () => {
            hapticSuccess();
            onSuggestionAccepted?.(newSuggestions[3]);
          }
        },
        aiReasoning: 'Meta com prazo próximo requer ajustes no plano de treino para maximizar chances de sucesso',
        confidence: 85,
        personalizationFactors: ['Progresso atual', 'Prazo da meta']
      });
    }

    // Sugestão baseada na localização
    if (userContext.currentLocation) {
      newSuggestions.push({
        id: 'location-route',
        type: 'route',
        priority: 'medium',
        title: 'Nova Rota Descoberta',
        description: 'Encontramos uma rota interessante perto de você com base no seu histórico.',
        icon: '🗺️',
        action: {
          label: 'Explorar',
          onPress: () => {
            hapticSuccess();
            onSuggestionAccepted?.(newSuggestions[4]);
          }
        },
        aiReasoning: 'Análise de padrões de movimento e preferências de rota para sugestão personalizada',
        confidence: 78,
        personalizationFactors: ['Localização atual', 'Histórico de rotas', 'Preferências de terreno']
      });
    }

    // Sugestão baseada no nível de energia
    if (userContext.energyLevel === 'low') {
      newSuggestions.push({
        id: 'energy-boost',
        type: 'nutrition',
        priority: 'high',
        title: 'Boost de Energia Natural',
        description: 'Nível de energia baixo detectado. Considere um snack pré-treino leve.',
        icon: '⚡',
        action: {
          label: 'Ver Opções',
          onPress: () => {
            hapticSuccess();
            onSuggestionAccepted?.(newSuggestions[5]);
          }
        },
        aiReasoning: 'Nível de energia baixo pode comprometer performance e aumentar risco de lesão',
        confidence: 90,
        personalizationFactors: ['Nível de energia atual', 'Histórico nutricional', 'Horário do dia']
      });
    }

    // Ordenar por prioridade e confiança
    newSuggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.confidence - a.confidence;
    });

    setSuggestions(newSuggestions);
  };

  const handleDismiss = (suggestion: SmartSuggestion) => {
    hapticWarning();
    setVisibleSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    onSuggestionDismissed?.(suggestion);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return theme.colors.error;
      case 'medium': return theme.colors.warning;
      case 'low': return theme.colors.success;
      default: return theme.colors.muted;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'route': return <MapPin size={16} color={theme.colors.primary} />;
      case 'workout': return <Zap size={16} color={theme.colors.secondary} />;
      case 'nutrition': return <Heart size={16} color={theme.colors.accent} />;
      case 'recovery': return <RefreshCw size={16} color={theme.colors.success} />;
      case 'goal': return <Target size={16} color={theme.colors.primary} />;
      case 'weather': return <Cloud size={16} color={theme.colors.info} />;
      case 'social': return <Users size={16} color={theme.colors.secondary} />;
      default: return <Lightbulb size={16} color={theme.colors.muted} />;
    }
  };

  if (visibleSuggestions.length === 0) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Brain size={20} color={theme.colors.primary} />
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Sugestões Inteligentes
          </Text>
        </View>
        <Badge label={`${visibleSuggestions.length} novas`} variant="primary" />
      </View>

      {visibleSuggestions.map((suggestion, index) => (
        <Card key={suggestion.id} style={styles.suggestionCard}>
          <View style={styles.suggestionHeader}>
            <View style={styles.suggestionLeft}>
              <Text style={styles.suggestionIcon}>{suggestion.icon}</Text>
              <View style={styles.suggestionInfo}>
                <Text style={[styles.suggestionTitle, { color: theme.colors.text }]}>
                  {suggestion.title}
                </Text>
                <Text style={[styles.suggestionDescription, { color: theme.colors.muted }]}>
                  {suggestion.description}
                </Text>
              </View>
            </View>
            <View style={styles.suggestionRight}>
              <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(suggestion.priority) }]} />
              <Text style={[styles.confidenceText, { color: theme.colors.muted }]}>
                {suggestion.confidence}%
              </Text>
            </View>
          </View>

          <View style={styles.aiSection}>
            <View style={styles.aiHeader}>
              <Brain size={14} color={theme.colors.primary} />
              <Text style={[styles.aiLabel, { color: theme.colors.primary }]}>
                IA Reasoning
              </Text>
            </View>
            <Text style={[styles.aiReasoning, { color: theme.colors.muted }]}>
              {suggestion.aiReasoning}
            </Text>
          </View>

          <View style={styles.personalizationSection}>
            <Text style={[styles.personalizationLabel, { color: theme.colors.muted }]}>
              Personalizado para você:
            </Text>
            <View style={styles.personalizationFactors}>
              {suggestion.personalizationFactors.map((factor, idx) => (
                <Badge key={idx} label={factor} variant="outline" style={styles.factorBadge} />
              ))}
            </View>
          </View>

          <View style={styles.actions}>
            {suggestion.action && (
              <Button 
                title={suggestion.action.label} 
                onPress={suggestion.action.onPress}
                variant="primary"
                style={styles.actionButton}
              />
            )}
            {suggestion.dismissible && (
              <Button 
                title="Dispensar" 
                onPress={() => handleDismiss(suggestion)}
                variant="outline"
                style={styles.dismissButton}
              />
            )}
          </View>
        </Card>
      ))}

      {suggestions.length > 3 && (
        <Pressable 
          style={styles.showMoreButton}
          onPress={() => {
            hapticSuccess();
            // Mostrar mais sugestões
          }}
        >
          <Text style={[styles.showMoreText, { color: theme.colors.primary }]}>
            Ver mais {suggestions.length - 3} sugestões
          </Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

// Componente auxiliar para o ícone de refresh
const RefreshCw = ({ size, color }: { size: number; color: string }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: size, color }}>🔄</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  suggestionCard: {
    marginBottom: 12,
    padding: 16,
    gap: 16,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  suggestionLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  suggestionIcon: {
    fontSize: 24,
  },
  suggestionInfo: {
    flex: 1,
    gap: 4,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  suggestionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  suggestionRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
  },
  aiSection: {
    gap: 8,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  aiReasoning: {
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  personalizationSection: {
    gap: 8,
  },
  personalizationLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  personalizationFactors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  factorBadge: {
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  dismissButton: {
    minWidth: 80,
  },
  showMoreButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: '600',
  },
});