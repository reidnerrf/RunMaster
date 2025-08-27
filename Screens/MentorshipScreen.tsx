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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { createMentorshipManager, MentorProfile, MentorshipSubscription, MentorshipSession } from '../Lib/mentorshipSystem';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import Banner from '../components/ui/Banner';

const mentorshipManager = createMentorshipManager();

export default function MentorshipScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<'browse' | 'my-mentors' | 'sessions' | 'apply'>('browse');
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<MentorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [mySubscriptions, setMySubscriptions] = useState<MentorshipSubscription[]>([]);
  const [mySessions, setMySessions] = useState<MentorshipSession[]>([]);

  const specialties = [
    'marathon', 'ultra_marathon', 'endurance', 'trail_running',
    '5k', '10k', 'beginner_training', 'weight_loss', 'speed_training'
  ];

  useEffect(() => {
    loadMentorshipData();
  }, []);

  useEffect(() => {
    filterMentors();
  }, [searchQuery, selectedSpecialty, mentors]);

  const loadMentorshipData = () => {
    try {
      const availableMentors = mentorshipManager.getAvailableMentors();
      setMentors(availableMentors);
    } catch (e) {
      setError('Falha ao carregar mentores');
    } finally {
      setLoading(false);
    }
    
    // Simular dados do usuário atual
    const userId = 'current_user_id';
    const userSubscriptions = mentorshipManager.getUserSubscriptions(userId, 'mentee');
    const userSessions = mentorshipManager.getUserSessions(userId, 'mentee');
    
    setMySubscriptions(userSubscriptions);
    setMySessions(userSessions);
  };

  const filterMentors = () => {
    let filtered = mentors;

    if (searchQuery) {
      filtered = filtered.filter(mentor =>
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedSpecialty) {
      filtered = filtered.filter(mentor =>
        mentor.specialties.includes(selectedSpecialty)
      );
    }

    setFilteredMentors(filtered);
  };

  const handleMentorSelect = (mentor: MentorProfile) => {
    setSelectedMentor(mentor);
    setShowMentorModal(true);
  };

  const handleSubscribe = (mentor: MentorProfile, plan: any) => {
    setSelectedMentor(mentor);
    setSelectedPlan(plan);
    setShowSubscriptionModal(true);
  };

  const confirmSubscription = () => {
    if (!selectedMentor || !selectedPlan) return;

    const userId = 'current_user_id';
    const subscription = mentorshipManager.subscribeToMentor(
      selectedMentor.id,
      userId,
      selectedPlan.name,
      'credit_card'
    );

    if (subscription) {
      Alert.alert(
        'Sucesso!',
        `Assinatura ${selectedPlan.name} ativada com ${selectedMentor.name}`,
        [{ text: 'OK' }]
      );
      
      // Recarregar dados
      loadMentorshipData();
      setShowSubscriptionModal(false);
      setShowMentorModal(false);
    } else {
      Alert.alert('Erro', 'Não foi possível ativar a assinatura');
    }
  };

  const renderMentorCard = ({ item }: { item: MentorProfile }) => (
    <TouchableOpacity
      style={styles.mentorCard}
      onPress={() => handleMentorSelect(item)}
    >
      <View style={styles.mentorHeader}>
        <Image
          source={{ uri: item.avatar }}
          style={styles.mentorAvatar}
          defaultSource={require('../assets/default-avatar.png')}
        />
        <View style={styles.mentorInfo}>
          <Text style={styles.mentorName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
            <Text style={styles.reviewsText}>({item.totalReviews})</Text>
          </View>
          <Text style={styles.mentorSpecialties}>
            {item.specialties.slice(0, 2).join(', ')}
          </Text>
        </View>
        <View style={styles.mentorPricing}>
          <Text style={styles.priceText}>R$ {item.pricing.hourlyRate}/h</Text>
          <Text style={styles.availabilityText}>
            {item.availability.currentMentees}/{item.availability.maxMentees} vagas
          </Text>
        </View>
      </View>
      
      <Text style={styles.mentorBio} numberOfLines={2}>
        {item.bio}
      </Text>
      
      <View style={styles.mentorStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.experience.years}</Text>
          <Text style={styles.statLabel}>Anos exp.</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.experience.certifications.length}</Text>
          <Text style={styles.statLabel}>Certificações</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.experience.completedRaces.length}</Text>
          <Text style={styles.statLabel}>Corridas</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.subscribeButton}
        onPress={() => handleSubscribe(item, item.pricing.subscriptionPlans[0])}
      >
        <Text style={styles.subscribeButtonText}>Ver Planos</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderSubscriptionPlan = ({ item }: { item: any }) => (
    <View style={styles.planCard}>
      <View style={styles.planHeader}>
        <Text style={styles.planName}>{item.name}</Text>
        <Text style={styles.planPrice}>R$ {item.price}</Text>
      </View>
      
      <View style={styles.planFeatures}>
        <Text style={styles.sessionsText}>
          {item.sessionsPerMonth} sessões/mês
        </Text>
        {item.features.map((feature: string, index: number) => (
          <View key={index} style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.selectPlanButton}
        onPress={() => handleSubscribe(selectedMentor!, item)}
      >
        <Text style={styles.selectPlanButtonText}>Selecionar Plano</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'browse':
        return (
          <View style={styles.tabContent}>
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={20} color="#666" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar mentores..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.specialtiesContainer}
              >
                <TouchableOpacity
                  style={[
                    styles.specialtyChip,
                    !selectedSpecialty && styles.specialtyChipActive
                  ]}
                  onPress={() => setSelectedSpecialty('')}
                >
                  <Text style={[
                    styles.specialtyChipText,
                    !selectedSpecialty && styles.specialtyChipTextActive
                  ]}>
                    Todos
                  </Text>
                </TouchableOpacity>
                
                {specialties.map((specialty) => (
                  <TouchableOpacity
                    key={specialty}
                    style={[
                      styles.specialtyChip,
                      selectedSpecialty === specialty && styles.specialtyChipActive
                    ]}
                    onPress={() => setSelectedSpecialty(specialty)}
                  >
                    <Text style={[
                      styles.specialtyChipText,
                      selectedSpecialty === specialty && styles.specialtyChipTextActive
                    ]}>
                      {specialty.replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {error ? <Banner type="error" title={error} /> : null}
            {loading ? (
              <View style={{ gap: 10 }}>
                <Skeleton height={120} />
                <Skeleton height={120} />
              </View>
            ) : filteredMentors.length === 0 ? (
              <EmptyState title="Nenhum mentor encontrado" description="Ajuste os filtros ou busque outro termo." />
            ) : (
              <FlatList
                data={filteredMentors}
                renderItem={renderMentorCard}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                windowSize={8}
                removeClippedSubviews
                initialNumToRender={8}
                contentContainerStyle={styles.mentorsList}
              />
            )}
          </View>
        );

      case 'my-mentors':
        return (
          <View style={styles.tabContent}>
            {mySubscriptions.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={64} color="#ccc" />
                <Text style={styles.emptyStateTitle}>Nenhum mentor ainda</Text>
                <Text style={styles.emptyStateSubtitle}>
                  Explore mentores disponíveis e comece sua jornada de mentoria
                </Text>
              </View>
            ) : (
              <FlatList
                data={mySubscriptions}
                renderItem={({ item }) => {
                  const mentor = mentors.find(m => m.id === item.mentorId);
                  if (!mentor) return null;
                  
                  return (
                    <View style={styles.subscriptionCard}>
                      <View style={styles.subscriptionHeader}>
                        <Image
                          source={{ uri: mentor.avatar }}
                          style={styles.subscriptionAvatar}
                        />
                        <View style={styles.subscriptionInfo}>
                          <Text style={styles.subscriptionMentorName}>
                            {mentor.name}
                          </Text>
                          <Text style={styles.subscriptionPlan}>
                            {item.planName}
                          </Text>
                          <Text style={styles.subscriptionStatus}>
                            Status: {item.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.subscriptionDetails}>
                        <Text style={styles.subscriptionSessions}>
                          {item.sessionsPerMonth} sessões por mês
                        </Text>
                        <Text style={styles.subscriptionDates}>
                          {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  );
                }}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        );

      case 'sessions':
        return (
          <View style={styles.tabContent}>
            {mySessions.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={64} color="#ccc" />
                <Text style={styles.emptyStateTitle}>Nenhuma sessão agendada</Text>
                <Text style={styles.emptyStateSubtitle}>
                  Agende sua primeira sessão com um mentor
                </Text>
              </View>
            ) : (
              <FlatList
                data={mySessions}
                renderItem={({ item }) => {
                  const mentor = mentors.find(m => m.id === item.mentorId);
                  if (!mentor) return null;
                  
                  return (
                    <View style={styles.sessionCard}>
                      <View style={styles.sessionHeader}>
                        <Image
                          source={{ uri: mentor.avatar }}
                          style={styles.sessionAvatar}
                        />
                        <View style={styles.sessionInfo}>
                          <Text style={styles.sessionMentorName}>
                            {mentor.name}
                          </Text>
                          <Text style={styles.sessionType}>
                            {item.type.replace('_', ' ')}
                          </Text>
                          <Text style={styles.sessionStatus}>
                            {item.status === 'scheduled' ? 'Agendada' : 
                             item.status === 'completed' ? 'Concluída' : 
                             item.status === 'cancelled' ? 'Cancelada' : 'Em andamento'}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.sessionDetails}>
                        <Text style={styles.sessionDateTime}>
                          {new Date(item.scheduledDate).toLocaleString()}
                        </Text>
                        <Text style={styles.sessionDuration}>
                          {item.duration} minutos
                        </Text>
                        <Text style={styles.sessionPrice}>
                          R$ {item.price}
                        </Text>
                      </View>
                    </View>
                  );
                }}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        );

      case 'apply':
        return (
          <View style={styles.tabContent}>
            <View style={styles.applyContainer}>
              <Ionicons name="person-add-outline" size={64} color="#667eea" />
              <Text style={styles.applyTitle}>Torne-se um Mentor</Text>
              <Text style={styles.applySubtitle}>
                Compartilhe sua experiência e ajude outros corredores a alcançarem seus objetivos
              </Text>
              
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => navigation.navigate('MentorApplication')}
              >
                <Text style={styles.applyButtonText}>Aplicar Agora</Text>
              </TouchableOpacity>
              
              <View style={styles.benefitsContainer}>
                <Text style={styles.benefitsTitle}>Benefícios de ser um Mentor:</Text>
                <View style={styles.benefitItem}>
                  <Ionicons name="cash-outline" size={20} color="#4CAF50" />
                  <Text style={styles.benefitText}>Ganhe dinheiro compartilhando conhecimento</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="trophy-outline" size={20} color="#FF9800" />
                  <Text style={styles.benefitText}>Construa sua reputação na comunidade</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="people-outline" size={20} color="#2196F3" />
                  <Text style={styles.benefitText}>Conecte-se com corredores apaixonados</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Ionicons name="trending-up-outline" size={20} color="#9C27B0" />
                  <Text style={styles.benefitText}>Desenvolva suas habilidades de coaching</Text>
                </View>
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
        <Text style={styles.headerTitle}>Mentoria</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'browse' && styles.activeTab]}
          onPress={() => setActiveTab('browse')}
        >
          <Ionicons 
            name="search" 
            size={20} 
            color={activeTab === 'browse' ? '#667eea' : '#666'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'browse' && styles.activeTabText
          ]}>
            Explorar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'my-mentors' && styles.activeTab]}
          onPress={() => setActiveTab('my-mentors')}
        >
          <Ionicons 
            name="people" 
            size={20} 
            color={activeTab === 'my-mentors' ? '#667eea' : '#666'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'my-mentors' && styles.activeTabText
          ]}>
            Meus Mentores
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'sessions' && styles.activeTab]}
          onPress={() => setActiveTab('sessions')}
        >
          <Ionicons 
            name="calendar" 
            size={20} 
            color={activeTab === 'sessions' ? '#667eea' : '#666'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'sessions' && styles.activeTabText
          ]}>
            Sessões
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'apply' && styles.activeTab]}
          onPress={() => setActiveTab('apply')}
        >
          <Ionicons 
            name="person-add" 
            size={20} 
            color={activeTab === 'apply' ? '#667eea' : '#666'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'apply' && styles.activeTabText
          ]}>
            Aplicar
          </Text>
        </TouchableOpacity>
      </View>

      {renderTabContent()}

      {/* Modal de Perfil do Mentor */}
      <Modal
        visible={showMentorModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMentorModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Perfil do Mentor</Text>
              <TouchableOpacity
                onPress={() => setShowMentorModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedMentor && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.mentorProfileHeader}>
                  <Image
                    source={{ uri: selectedMentor.avatar }}
                    style={styles.modalMentorAvatar}
                  />
                  <View style={styles.modalMentorInfo}>
                    <Text style={styles.modalMentorName}>{selectedMentor.name}</Text>
                    <View style={styles.modalRatingContainer}>
                      <Ionicons name="star" size={20} color="#FFD700" />
                      <Text style={styles.modalRatingText}>
                        {selectedMentor.rating.toFixed(1)} ({selectedMentor.totalReviews} avaliações)
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.modalMentorBio}>{selectedMentor.bio}</Text>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Especialidades</Text>
                  <View style={styles.modalSpecialties}>
                    {selectedMentor.specialties.map((specialty, index) => (
                      <View key={index} style={styles.modalSpecialtyChip}>
                        <Text style={styles.modalSpecialtyText}>
                          {specialty.replace('_', ' ')}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Experiência</Text>
                  <Text style={styles.modalExperienceText}>
                    {selectedMentor.experience.years} anos de experiência
                  </Text>
                  <Text style={styles.modalExperienceText}>
                    {selectedMentor.experience.certifications.length} certificações
                  </Text>
                  <Text style={styles.modalExperienceText}>
                    {selectedMentor.experience.completedRaces.length} corridas completadas
                  </Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Planos de Assinatura</Text>
                  <FlatList
                    data={selectedMentor.pricing.subscriptionPlans}
                    renderItem={renderSubscriptionPlan}
                    keyExtractor={(item) => item.name}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.plansList}
                  />
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal de Assinatura */}
      <Modal
        visible={showSubscriptionModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSubscriptionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirmar Assinatura</Text>
              <TouchableOpacity
                onPress={() => setShowSubscriptionModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedMentor && selectedPlan && (
              <View style={styles.modalBody}>
                <View style={styles.confirmationContainer}>
                  <Image
                    source={{ uri: selectedMentor.avatar }}
                    style={styles.confirmationAvatar}
                  />
                  <Text style={styles.confirmationMentorName}>
                    {selectedMentor.name}
                  </Text>
                  <Text style={styles.confirmationPlanName}>
                    {selectedPlan.name}
                  </Text>
                  <Text style={styles.confirmationPrice}>
                    R$ {selectedPlan.price}
                  </Text>
                  <Text style={styles.confirmationSessions}>
                    {selectedPlan.sessionsPerMonth} sessões por mês
                  </Text>
                </View>

                <View style={styles.confirmationFeatures}>
                  <Text style={styles.confirmationFeaturesTitle}>
                    Inclui:
                  </Text>
                  {selectedPlan.features.map((feature: string, index: number) => (
                    <View key={index} style={styles.confirmationFeatureItem}>
                      <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                      <Text style={styles.confirmationFeatureText}>{feature}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.confirmSubscriptionButton}
                  onPress={confirmSubscription}
                >
                  <Text style={styles.confirmSubscriptionButtonText}>
                    Confirmar Assinatura
                  </Text>
                </TouchableOpacity>
              </View>
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
    fontSize: 12,
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
  specialtiesContainer: {
    marginBottom: 16,
  },
  specialtyChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 12,
  },
  specialtyChipActive: {
    backgroundColor: '#667eea',
  },
  specialtyChipText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  specialtyChipTextActive: {
    color: '#fff',
  },
  mentorsList: {
    paddingBottom: 20,
  },
  mentorCard: {
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
  mentorHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  mentorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  mentorInfo: {
    flex: 1,
  },
  mentorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  mentorSpecialties: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '500',
  },
  mentorPricing: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  availabilityText: {
    fontSize: 12,
    color: '#666',
  },
  mentorBio: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  mentorStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  subscribeButton: {
    backgroundColor: '#667eea',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 24,
  },
  subscriptionCard: {
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
  subscriptionHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  subscriptionAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  subscriptionInfo: {
    flex: 1,
  },
  subscriptionMentorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subscriptionPlan: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '500',
    marginBottom: 4,
  },
  subscriptionStatus: {
    fontSize: 12,
    color: '#666',
  },
  subscriptionDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  subscriptionSessions: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  subscriptionDates: {
    fontSize: 12,
    color: '#666',
  },
  sessionCard: {
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
  sessionHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  sessionAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionMentorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sessionType: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '500',
    marginBottom: 4,
  },
  sessionStatus: {
    fontSize: 12,
    color: '#666',
  },
  sessionDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  sessionDateTime: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  sessionDuration: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  sessionPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  applyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  applyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  applySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
    marginBottom: 32,
  },
  applyButton: {
    backgroundColor: '#667eea',
    borderRadius: 25,
    paddingHorizontal: 32,
    paddingVertical: 16,
    marginBottom: 40,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  benefitsContainer: {
    width: '100%',
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  benefitText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
    flex: 1,
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
  mentorProfileHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  modalMentorAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  modalMentorInfo: {
    flex: 1,
  },
  modalMentorName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalRatingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    fontWeight: '500',
  },
  modalMentorBio: {
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
    marginBottom: 12,
  },
  modalSpecialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  modalSpecialtyChip: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 8,
  },
  modalSpecialtyText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  modalExperienceText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  plansList: {
    paddingRight: 20,
  },
  planCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    minWidth: 200,
  },
  planHeader: {
    marginBottom: 16,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  planFeatures: {
    marginBottom: 20,
  },
  sessionsText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  selectPlanButton: {
    backgroundColor: '#667eea',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  selectPlanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmationContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  confirmationAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  confirmationMentorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  confirmationPlanName: {
    fontSize: 18,
    color: '#667eea',
    fontWeight: '600',
    marginBottom: 8,
  },
  confirmationPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  confirmationSessions: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  confirmationFeatures: {
    marginBottom: 24,
  },
  confirmationFeaturesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  confirmationFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  confirmationFeatureText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  confirmSubscriptionButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmSubscriptionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});