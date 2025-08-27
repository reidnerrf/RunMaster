import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Dimensions
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ThemedText } from '../../components/ThemedText';
import { ActionButton } from '../../components/ActionButton';
import { BlurCard } from '../../components/ui/BlurCard';
import { createGhostManager, GhostRun } from '../../Lib/ghost';
import { createRitualsManager } from '../../Lib/rituals';
import { MapPin, Clock, TrendingUp, Trophy, Users, Heart } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function RouteDetailScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const [ghostManager, setGhostManager] = useState<any>(null);
  const [ritualsManager, setRitualsManager] = useState<any>(null);
  const [selectedGhost, setSelectedGhost] = useState<GhostRun | null>(null);
  const [showGhostComparison, setShowGhostComparison] = useState(false);

  // Mock route data
  const routeData = {
    id: 'rota-historica',
    name: 'Rota Histórica',
    description: 'Passeio pelos principais pontos históricos de São Paulo',
    distance: 6.2,
    estimatedTime: 35,
    difficulty: 'easy',
    points: 100,
    landmarks: [
      { name: 'Mosteiro de São Bento', type: 'monument', points: 40 },
      { name: 'Edifício Martinelli', type: 'architecture', points: 35 }
    ],
    coordinates: [
      { lat: -23.5505, lng: -46.6333 },
      { lat: -23.5550, lng: -46.6380 },
      { lat: -23.5600, lng: -46.6430 }
    ],
    elevation: 80,
    surface: 'road',
    totalRunners: 2100,
    tags: ['historia', 'arquitetura', 'cultura', 'facil']
  };

  useEffect(() => {
    setGhostManager(createGhostManager());
    setRitualsManager(createRitualsManager());
  }, []);

  const getGhostsForRoute = () => {
    if (!ghostManager || !routeData) return [];
    return ghostManager.getGhostsForRoute(routeData.id);
  };

  const compareWithGhost = (ghostId: string) => {
    if (!ghostManager || !routeData) return;
    // Simula splits do usuário (em produção viria do GPS)
    const userSplits = Array.from({length: Math.ceil(routeData.distance)}, (_,i) => 180 + Math.random()*30);
    const comparison = ghostManager.compareWithGhost(routeData.id, userSplits, ghostId);
    if (comparison) {
      setSelectedGhost(ghostManager.ghosts.find((g: GhostRun) => g.id === ghostId));
      setShowGhostComparison(true);
    }
  };

  const startRun = () => {
    Alert.alert('Iniciar Corrida', 'Navegar para tela de corrida?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Iniciar', onPress: () => navigation.navigate('Run' as never) }
    ]);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>{routeData.name}</ThemedText>
        <ThemedText style={styles.subtitle}>{routeData.description}</ThemedText>
      </View>

      {/* Route Info */}
      <BlurCard style={styles.card}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <MapPin color={theme.colors.primary} size={20} />
            <ThemedText style={styles.infoValue}>{routeData.distance} km</ThemedText>
            <ThemedText style={styles.infoLabel}>Distância</ThemedText>
          </View>
          <View style={styles.infoItem}>
            <Clock color={theme.colors.primary} size={20} />
            <ThemedText style={styles.infoValue}>{routeData.estimatedTime} min</ThemedText>
            <ThemedText style={styles.infoLabel}>Tempo</ThemedText>
          </View>
          <View style={styles.infoItem}>
            <TrendingUp color={theme.colors.primary} size={20} />
            <ThemedText style={styles.infoValue}>{routeData.difficulty}</ThemedText>
            <ThemedText style={styles.infoLabel}>Dificuldade</ThemedText>
          </View>
        </View>
      </BlurCard>

      {/* Landmarks */}
      <BlurCard style={styles.card}>
        <View style={styles.cardHeader}>
          <Trophy color={theme.colors.primary} size={24} />
          <ThemedText style={styles.cardTitle}>Pontos de Interesse</ThemedText>
        </View>
        {routeData.landmarks.map((landmark, index) => (
          <View key={index} style={styles.landmarkItem}>
            <ThemedText style={styles.landmarkName}>{landmark.name}</ThemedText>
            <ThemedText style={styles.landmarkType}>{landmark.type}</ThemedText>
            <ThemedText style={styles.landmarkPoints}>+{landmark.points} pts</ThemedText>
          </View>
        ))}
      </BlurCard>

      {/* Ghost Runs Section */}
      <BlurCard style={styles.card}>
        <View style={styles.cardHeader}>
          <Users color={theme.colors.primary} size={24} />
          <ThemedText style={styles.cardTitle}>Corridas Fantasma</ThemedText>
          <Pressable onPress={() => setShowGhostComparison(!showGhostComparison)}>
            <ThemedText style={[styles.toggleText, { color: theme.colors.primary }]}>
              {showGhostComparison ? 'Ocultar' : 'Mostrar'}
            </ThemedText>
          </Pressable>
        </View>
        
        {showGhostComparison && (
          <View style={styles.ghostContainer}>
            {getGhostsForRoute().map((ghost: GhostRun) => (
              <Pressable
                key={ghost.id}
                style={[styles.ghostItem, { backgroundColor: theme.colors.card }]}
                onPress={() => compareWithGhost(ghost.id)}
              >
                <View style={styles.ghostInfo}>
                  <ThemedText style={styles.ghostName}>{ghost.name}</ThemedText>
                  <ThemedText style={styles.ghostType}>
                    {ghost.type === 'famous' ? '🏆 Elite' : 
                     ghost.type === 'friend' ? '👥 Amigo' : '👤 Você'}
                  </ThemedText>
                </View>
                <View style={styles.ghostStats}>
                  <ThemedText style={styles.ghostTime}>
                    {Math.floor(ghost.totalSec / 60)}:{(ghost.totalSec % 60).toString().padStart(2, '0')}
                  </ThemedText>
                  <ThemedText style={styles.ghostPace}>
                    {Math.floor(ghost.totalSec / 60 / routeData.distance)}:{(Math.floor(ghost.totalSec / routeData.distance) % 60).toString().padStart(2, '0')}/km
                  </ThemedText>
                </View>
              </Pressable>
            ))}
            
            {selectedGhost && (
              <View style={[styles.comparisonCard, { backgroundColor: theme.colors.card }]}>
                <ThemedText style={styles.comparisonTitle}>
                  Comparação com {selectedGhost.name}
                </ThemedText>
                <View style={styles.comparisonStats}>
                  <View style={styles.comparisonItem}>
                    <ThemedText style={styles.comparisonLabel}>Tempo Total</ThemedText>
                    <ThemedText style={styles.comparisonValue}>
                      {Math.floor(selectedGhost.totalSec / 60)}:{(selectedGhost.totalSec % 60).toString().padStart(2, '0')}
                    </ThemedText>
                  </View>
                  <View style={styles.comparisonItem}>
                    <ThemedText style={styles.comparisonLabel}>Ritmo</ThemedText>
                    <ThemedText style={styles.comparisonValue}>
                      {Math.floor(selectedGhost.totalSec / 60 / routeData.distance)}:{(Math.floor(selectedGhost.totalSec / routeData.distance) % 60).toString().padStart(2, '0')}/km
                    </ThemedText>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      </BlurCard>

      {/* Start Run Button */}
      <View style={styles.buttonContainer}>
        <ActionButton
          label="Iniciar Corrida"
          onPress={startRun}
          style={styles.startButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    lineHeight: 22,
  },
  card: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
    flex: 1,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  landmarkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  landmarkName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  landmarkType: {
    fontSize: 12,
    opacity: 0.7,
    marginRight: 12,
  },
  landmarkPoints: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
  },
  ghostContainer: {
    marginTop: 12,
  },
  ghostItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  ghostInfo: {
    flex: 1,
  },
  ghostName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  ghostType: {
    fontSize: 12,
    opacity: 0.7,
  },
  ghostStats: {
    alignItems: 'flex-end',
  },
  ghostTime: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  ghostPace: {
    fontSize: 12,
    opacity: 0.7,
  },
  comparisonCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  comparisonStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  comparisonItem: {
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  comparisonValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    padding: 20,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#00B894',
  },
});