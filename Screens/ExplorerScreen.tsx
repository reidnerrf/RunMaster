import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import Banner from '../components/ui/Banner';
import AppBar from '../components/ui/AppBar';
import Chip from '../components/ui/Chip';
import { createExplorerManager, ExplorerRoute, ExplorerWaypoint, SecretPoint } from '../Lib/explorer';
import * as Location from 'expo-location';

const explorerManager = createExplorerManager();
const { width } = Dimensions.get('window');

export default function ExplorerScreen({ navigation }: any) {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [activeTab, setActiveTab] = useState<'routes' | 'secret-points' | 'treasure-hunt' | 'discoveries'>('routes');
  const [routes, setRoutes] = useState<ExplorerRoute[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<ExplorerRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<ExplorerRoute | null>(null);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [secretPoints, setSecretPoints] = useState<SecretPoint[]>([]);
  const [userProgress, setUserProgress] = useState({
    discoveredPoints: 0,
    totalPoints: 0,
    routesCompleted: 0,
    treasureChests: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const difficulties = ['easy', 'medium', 'hard', 'expert'];
  const routeTypes = ['random', 'curated', 'challenge', 'discovery'];

  useEffect(() => {
    getUserLocation();
    loadExplorerData();
  }, []);

  useEffect(() => {
    filterRoutes();
  }, [searchQuery, selectedDifficulty, selectedType, routes]);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Precisamos da sua localização para criar rotas personalizadas');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });
      
      // Gerar rotas baseadas na localização
      generateLocalRoutes(latitude, longitude);
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      setError('Erro ao obter localização');
      // Usar localização padrão (São Paulo)
      setUserLocation({ latitude: -23.5505, longitude: -46.6333 });
      generateLocalRoutes(-23.5505, -46.6333);
    }
  };

  const generateLocalRoutes = (latitude: number, longitude: number) => {
    const localRoutes = explorerManager.generateRandomRoute('current_user', {
      latitude,
      longitude,
      maxDistance: 10000, // 10km
      preferredTerrain: 'mixed',
      difficulty: 'medium',
    });

    if (localRoutes) {
      setRoutes(prev => [localRoutes, ...prev]);
    }
  };

  const loadExplorerData = () => {
    const availableRoutes = explorerManager.getAvailableRoutes(1);
    setRoutes(availableRoutes);
    setLoading(false);
    
    // Simular dados do usuário
    setUserProgress({
      discoveredPoints: 3,
      totalPoints: 10,
      routesCompleted: 2,
      treasureChests: 1,
    });
  };

  const filterRoutes = () => {
    let filtered = routes;

    if (searchQuery) {
      filtered = filtered.filter(route =>
        route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedDifficulty) {
      filtered = filtered.filter(route => route.difficulty === selectedDifficulty);
    }

    if (selectedType) {
      filtered = filtered.filter(route => route.type === selectedType);
    }

    setFilteredRoutes(filtered);
  };

  const startRoute = (route: ExplorerRoute) => {
    if (!userLocation) {
      Alert.alert('Localização necessária', 'Precisamos da sua localização para começar a rota');
      return;
    }

    const session = explorerManager.startExplorerSession('current_user', route.id);
    if (session) {
      Alert.alert(
        'Rota Iniciada!',
        `Boa sorte na ${route.name}! Descubra todos os pontos secretos.`,
        [{ text: 'Vamos lá!' }]
      );
      setShowRouteModal(false);
    }
  };

  const renderRouteCard = ({ item }: { item: ExplorerRoute }) => (
    <TouchableOpacity
      style={styles.routeCard}
      onPress={() => {
        setSelectedRoute(item);
        setShowRouteModal(true);
      }}
    >
      <View style={styles.routeHeader}>
        <View style={styles.routeInfo}>
          <Text style={styles.routeName}>{item.name}</Text>
          <View style={styles.routeMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="location" size={16} color="#667eea" />
              <Text style={styles.metaText}>{item.distance}km</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={16} color="#667eea" />
              <Text style={styles.metaText}>{item.estimatedTime}min</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="trending-up" size={16} color="#667eea" />
              <Text style={styles.metaText}>{item.elevationGain}m</Text>
            </View>
          </View>
        </View>
        <View style={styles.routeBadges}>
          <View style={[styles.difficultyBadge, styles[`difficulty${item.difficulty}`]]}>
            <Text style={styles.difficultyText}>{item.difficulty}</Text>
          </View>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{item.type}</Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.routeDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.routeFeatures}>
        <Text style={styles.featuresTitle}>Pontos de Interesse:</Text>
        <View style={styles.featuresList}>
          {item.waypoints.slice(0, 3).map((waypoint, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.featureText}>{waypoint.name}</Text>
            </View>
          ))}
          {item.waypoints.length > 3 && (
            <Text style={styles.moreFeatures}>+{item.waypoints.length - 3} mais</Text>
          )}
        </View>
      </View>

      <View style={styles.routeRewards}>
        <Text style={styles.rewardsTitle}>Recompensas:</Text>
        <View style={styles.rewardsList}>
          <View style={styles.rewardItem}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rewardText}>{item.rewards.experience} XP</Text>
          </View>
          <View style={styles.rewardItem}>
            <Ionicons name="gift" size={16} color="#FF6B6B" />
            <Text style={styles.rewardText}>{item.rewards.items.length} itens</Text>
          </View>
          <View style={styles.rewardItem}>
            <Ionicons name="trophy" size={16} color="#FF9800" />
            <Text style={styles.rewardText}>{item.rewards.achievements.length} conquistas</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.startRouteButton}
        onPress={() => startRoute(item)}
      >
        <Text style={styles.startRouteButtonText}>Começar Rota</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderSecretPoint = ({ item }: { item: SecretPoint }) => (
    <View style={styles.secretPointCard}>
      <View style={styles.pointHeader}>
        <View style={[styles.rarityBadge, styles[`rarity${item.rarity}`]]}>
          <Text style={styles.rarityText}>{item.rarity}</Text>
        </View>
        <View style={styles.pointLocation}>
          <Ionicons name="location" size={16} color="#667eea" />
          <Text style={styles.locationText}>{item.location.name}</Text>
        </View>
      </View>
      
      <Text style={styles.pointName}>{item.name}</Text>
      <Text style={styles.pointDescription}>{item.description}</Text>
      
      <View style={styles.pointRewards}>
        <Text style={styles.rewardsTitle}>Recompensas:</Text>
        <View style={styles.rewardsList}>
          {item.rewards.map((reward, index) => (
            <View key={index} style={styles.rewardItem}>
              <Ionicons name="gift" size={16} color="#FF6B6B" />
              <Text style={styles.rewardText}>{reward}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.discoveryStatus}>
        <Ionicons 
          name={item.discovered ? "checkmark-circle" : "help-circle"} 
          size={24} 
          color={item.discovered ? "#4CAF50" : "#FF9800"} 
        />
        <Text style={[styles.statusText, item.discovered && styles.discoveredText]}>
          {item.discovered ? 'Descoberto' : 'Ainda não descoberto'}
        </Text>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'routes':
        return (
          <View style={styles.tabContent}>
            <AppBar title="Explorar" />
            <View style={styles.searchContainer}>
              <Input value={searchQuery} onChangeText={setSearchQuery} placeholder="Buscar rotas..." />
              
              <View style={styles.filtersContainer}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.difficultyFilters}
                >
                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      !selectedDifficulty && styles.filterChipActive
                    ]}
                    onPress={() => setSelectedDifficulty('')}
                  >
                    <Text style={[
                      styles.filterChipText,
                      !selectedDifficulty && styles.filterChipTextActive
                    ]}>
                      Todas
                    </Text>
                  </TouchableOpacity>
                  
                  {difficulties.map((difficulty) => (
                    <Chip key={difficulty} label={difficulty} selected={selectedDifficulty === difficulty} onPress={() => setSelectedDifficulty(difficulty)} style={{ marginRight: 8 }} />
                  ))}
                </ScrollView>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.typeFilters}
                >
                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      !selectedType && styles.filterChipActive
                    ]}
                    onPress={() => setSelectedType('')}
                  >
                    <Text style={[
                      styles.filterChipText,
                      !selectedType && styles.filterChipTextActive
                    ]}>
                      Todos os tipos
                    </Text>
                  </TouchableOpacity>
                  
                  {routeTypes.map((type) => (
                    <Chip key={type} label={type} selected={selectedType === type} onPress={() => setSelectedType(type)} style={{ marginRight: 8 }} />
                  ))}
                </ScrollView>
              </View>
            </View>

            {error ? <Banner type="error" title={error} /> : null}
            {loading ? (
              <View style={{ gap: 10 }}>
                <Skeleton height={18} />
                <Skeleton height={14} />
                <Skeleton height={18} />
              </View>
            ) : filteredRoutes.length === 0 ? (
              <EmptyState title="Nenhuma rota encontrada" description="Tente ajustar os filtros ou busque por outro termo." />
            ) : (
              <FlatList
                data={filteredRoutes}
                renderItem={({ item }) => (
                  <View style={{ marginBottom: 12 }}>
                    {renderRouteCard({ item })}
                  </View>
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                windowSize={8}
                removeClippedSubviews
                initialNumToRender={8}
                contentContainerStyle={styles.routesList}
              />
            )}
          </View>
        );

      case 'secret-points':
        return (
          <View style={styles.tabContent}>
            <View style={styles.progressHeader}>
              <View style={styles.progressCard}>
                <Text style={styles.progressTitle}>Progresso de Descobertas</Text>
                <View style={styles.progressStats}>
                  <View style={styles.progressStat}>
                    <Text style={styles.progressValue}>{userProgress.discoveredPoints}</Text>
                    <Text style={styles.progressLabel}>Descobertos</Text>
                  </View>
                  <View style={styles.progressDivider} />
                  <View style={styles.progressStat}>
                    <Text style={styles.progressValue}>{userProgress.totalPoints}</Text>
                    <Text style={styles.progressLabel}>Total</Text>
                  </View>
                  <View style={styles.progressDivider} />
                  <View style={styles.progressStat}>
                    <Text style={styles.progressValue}>
                      {Math.round((userProgress.discoveredPoints / userProgress.totalPoints) * 100)}%
                    </Text>
                    <Text style={styles.progressLabel}>Completo</Text>
                  </View>
                </View>
              </View>
            </View>

            <FlatList
              data={secretPoints}
              renderItem={renderSecretPoint}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.pointsList}
            />
          </View>
        );

      case 'treasure-hunt':
        return (
          <View style={styles.tabContent}>
            <View style={styles.treasureHeader}>
              <Ionicons name="treasure-chest" size={64} color="#FFD700" />
              <Text style={styles.treasureTitle}>Caça ao Tesouro Digital</Text>
              <Text style={styles.treasureSubtitle}>
                A cada 5km você desbloqueia baús virtuais com recompensas incríveis!
              </Text>
            </View>

            <View style={styles.treasureProgress}>
              <Text style={styles.progressTitle}>Próximo Baú em:</Text>
              <View style={styles.distanceProgress}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '60%' }]} />
                </View>
                <Text style={styles.distanceText}>3.0km / 5.0km</Text>
              </View>
            </View>

            <View style={styles.treasureRewards}>
              <Text style={styles.rewardsTitle}>Recompensas Desbloqueadas:</Text>
              <View style={styles.rewardItem}>
                <Ionicons name="star" size={20} color="#FFD700" />
                <Text style={styles.rewardText}>+500 XP por descoberta</Text>
              </View>
              <View style={styles.rewardItem}>
                <Ionicons name="gift" size={20} color="#FF6B6B" />
                <Text style={styles.rewardText}>Itens raros e exclusivos</Text>
              </View>
              <View style={styles.rewardItem}>
                <Ionicons name="trophy" size={20} color="#FF9800" />
                <Text style={styles.rewardText}>Conquistas especiais</Text>
              </View>
              <View style={styles.rewardItem}>
                <Ionicons name="diamond" size={20} color="#9C27B0" />
                <Text style={styles.rewardText}>Descontos em produtos</Text>
              </View>
            </View>
          </View>
        );

      case 'discoveries':
        return (
          <View style={styles.tabContent}>
            <View style={styles.discoveriesHeader}>
              <Text style={styles.discoveriesTitle}>Suas Descobertas</Text>
              <Text style={styles.discoveriesSubtitle}>
                Histórico de rotas completadas e conquistas
              </Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Ionicons name="map" size={32} color="#667eea" />
                <Text style={styles.statValue}>{userProgress.routesCompleted}</Text>
                <Text style={styles.statLabel}>Rotas Completadas</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="treasure-chest" size={32} color="#FFD700" />
                <Text style={styles.statValue}>{userProgress.treasureChests}</Text>
                <Text style={styles.statLabel}>Baús Desbloqueados</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="star" size={32} color="#FF9800" />
                <Text style={styles.statValue}>{userProgress.discoveredPoints}</Text>
                <Text style={styles.statLabel}>Pontos Secretos</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="trophy" size={32} color="#4CAF50" />
                <Text style={styles.statValue}>15</Text>
                <Text style={styles.statLabel}>Conquistas</Text>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Explorador</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'routes' && styles.activeTab]}
          onPress={() => setActiveTab('routes')}
        >
          <Ionicons 
            name="map" 
            size={20} 
            color={activeTab === 'routes' ? '#667eea' : '#666'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'routes' && styles.activeTabText
          ]}>
            Rotas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'secret-points' && styles.activeTab]}
          onPress={() => setActiveTab('secret-points')}
        >
          <Ionicons 
            name="location" 
            size={20} 
            color={activeTab === 'secret-points' ? '#667eea' : '#666'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'secret-points' && styles.activeTabText
          ]}>
            Pontos Secretos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'treasure-hunt' && styles.activeTab]}
          onPress={() => setActiveTab('treasure-hunt')}
        >
          <Ionicons 
            name="treasure-chest" 
            size={20} 
            color={activeTab === 'treasure-hunt' ? '#667eea' : '#666'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'treasure-hunt' && styles.activeTabText
          ]}>
            Caça ao Tesouro
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'discoveries' && styles.activeTab]}
          onPress={() => setActiveTab('discoveries')}
        >
          <Ionicons 
            name="trophy" 
            size={20} 
            color={activeTab === 'discoveries' ? '#667eea' : '#666'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'discoveries' && styles.activeTabText
          ]}>
            Descobertas
          </Text>
        </TouchableOpacity>
      </View>

      {renderTabContent()}

      {/* Modal de Detalhes da Rota */}
      <Modal
        visible={showRouteModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRouteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalhes da Rota</Text>
              <TouchableOpacity
                onPress={() => setShowRouteModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedRoute && (
              <ScrollView style={styles.modalBody}>
                <Text style={styles.modalRouteName}>{selectedRoute.name}</Text>
                <Text style={styles.modalRouteDescription}>{selectedRoute.description}</Text>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Informações da Rota</Text>
                  <View style={styles.routeInfoGrid}>
                    <View style={styles.infoItem}>
                      <Ionicons name="location" size={20} color="#667eea" />
                      <Text style={styles.infoLabel}>Distância</Text>
                      <Text style={styles.infoValue}>{selectedRoute.distance}km</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Ionicons name="time" size={20} color="#667eea" />
                      <Text style={styles.infoLabel}>Tempo Estimado</Text>
                      <Text style={styles.infoValue}>{selectedRoute.estimatedTime}min</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Ionicons name="trending-up" size={20} color="#667eea" />
                      <Text style={styles.infoLabel}>Elevação</Text>
                      <Text style={styles.infoValue}>{selectedRoute.elevationGain}m</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Ionicons name="star" size={20} color="#667eea" />
                      <Text style={styles.infoLabel}>Dificuldade</Text>
                      <Text style={styles.infoValue}>{selectedRoute.difficulty}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Pontos de Interesse</Text>
                  {selectedRoute.waypoints.map((waypoint, index) => (
                    <View key={index} style={styles.waypointItem}>
                      <View style={styles.waypointIcon}>
                        <Ionicons name="location" size={20} color="#667eea" />
                      </View>
                      <View style={styles.waypointInfo}>
                        <Text style={styles.waypointName}>{waypoint.name}</Text>
                        <Text style={styles.waypointDescription}>{waypoint.description}</Text>
                        <Text style={styles.waypointDistance}>{waypoint.distance}km do início</Text>
                      </View>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.startRouteModalButton}
                  onPress={() => startRoute(selectedRoute)}
                >
                  <Text style={styles.startRouteModalButtonText}>Começar Rota</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 21,
  },
  activeTab: {
    backgroundColor: '#f0f0f0',
  },
  tabText: {
    marginLeft: 6,
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#667eea',
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  filtersContainer: {
    marginBottom: 16,
  },
  difficultyFilters: {
    marginBottom: 12,
  },
  typeFilters: {
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 12,
  },
  filterChipActive: {
    backgroundColor: '#667eea',
  },
  filterChipText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  routesList: {
    paddingBottom: 20,
  },
  routeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  routeMeta: {
    flexDirection: 'row',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  routeBadges: {
    alignItems: 'flex-end',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  difficultyeasy: { backgroundColor: '#4CAF50' },
  difficultymedium: { backgroundColor: '#FF9800' },
  difficultyhard: { backgroundColor: '#F44336' },
  difficultyexpert: { backgroundColor: '#9C27B0' },
  difficultyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  typeBadge: {
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  routeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  routeFeatures: {
    marginBottom: 16,
  },
  featuresTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  moreFeatures: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '500',
  },
  routeRewards: {
    marginBottom: 16,
  },
  rewardsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  rewardsList: {
    flexDirection: 'row',
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  rewardText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  startRouteButton: {
    backgroundColor: '#667eea',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  startRouteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  progressHeader: {
    marginBottom: 20,
  },
  progressCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressStat: {
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  progressDivider: {
    width: 1,
    backgroundColor: '#ddd',
  },
  pointsList: {
    paddingBottom: 20,
  },
  secretPointCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pointHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rarityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  raritycommon: { backgroundColor: '#9E9E9E' },
  rarityrare: { backgroundColor: '#2196F3' },
  rarityepic: { backgroundColor: '#9C27B0' },
  raritylegendary: { backgroundColor: '#FFD700' },
  rarityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  pointLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  pointName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  pointDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  pointRewards: {
    marginBottom: 16,
  },
  discoveryStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: '#FF9800',
    marginLeft: 8,
    fontWeight: '500',
  },
  discoveredText: {
    color: '#4CAF50',
  },
  treasureHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  treasureTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  treasureSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  treasureProgress: {
    marginBottom: 32,
  },
  distanceProgress: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  distanceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  treasureRewards: {
    marginBottom: 32,
  },
  rewardsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  discoveriesHeader: {
    marginBottom: 24,
  },
  discoveriesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  discoveriesSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: (width - 80) / 2,
    marginBottom: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  modalRouteName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  modalRouteDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  routeInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  waypointItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  waypointIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  waypointInfo: {
    flex: 1,
  },
  waypointName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  waypointDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 4,
  },
  waypointDistance: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '500',
  },
  startRouteModalButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  startRouteModalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});