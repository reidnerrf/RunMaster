import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Modal,
  TextInput,
  Dimensions
} from 'react-native';
import Card from '../components/ui/Card';
import ListItem from '../components/ui/ListItem';
import EmptyState from '../components/ui/EmptyState';
import Skeleton from '../components/ui/Skeleton';
import Banner from '../components/ui/Banner';
import { track } from '@/utils/analyticsClient';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { createCommunityManager, Community, CommunityMember } from '../Lib/community';
import { createChallengeManager } from '../Lib/challenges';
import { createSocialActionManager } from '../Lib/socialActions';
import { createGamificationManager } from '../Lib/gamification';
import { ThemedText } from '../components/ThemedText';
import { ActionButton } from '../components/ActionButton';
import { BlurCard } from '../components/ui/BlurCard';
import { IconButton } from '../components/IconButton';
import { 
  Users, 
  Trophy, 
  Heart, 
  Plus, 
  Settings, 
  Trash2, 
  Edit, 
  Mail, 
  Star,
  TrendingUp,
  Award,
  Target,
  Zap
} from 'lucide-react-native';
import { addEventToCalendar } from '@/utils/calendarSync';

const { width } = Dimensions.get('window');

export default function CommunityScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [communityManager, setCommunityManager] = useState<any>(null);
  const [challengeManager, setChallengeManager] = useState<any>(null);
  const [socialActionManager, setSocialActionManager] = useState<any>(null);
  const [gamificationManager, setGamificationManager] = useState<any>(null);
  
  const [userCommunities, setUserCommunities] = useState<Community[]>([]);
  const [publicCommunities, setPublicCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showChallengesModal, setShowChallengesModal] = useState(false);
  const [showSocialActionsModal, setShowSocialActionsModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [localEvents, setLocalEvents] = useState<Array<{ id: string; name: string; date: string; city: string; address?: string; participants: number }>>([]);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventCity, setEventCity] = useState('');
  const [eventAddress, setEventAddress] = useState('');
  
  // Estados para formulários
  const [communityName, setCommunityName] = useState('');
  const [communityDescription, setCommunityDescription] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');

  useEffect(() => {
    initializeManagers();
  }, []);

  const initializeManagers = async () => {
    try {
      const community = createCommunityManager();
      const challenges = createChallengeManager();
      const socialActions = createSocialActionManager();
      const gamification = createGamificationManager();

      setCommunityManager(community);
      setChallengeManager(challenges);
      setSocialActionManager(socialActions);
      setGamificationManager(gamification);

      // Carregar dados iniciais
      if (user?.id) {
        const userComms = community.getUserCommunities(user.id);
        const publicComms = community.searchPublicCommunities('');
        
        setUserCommunities(userComms);
        setPublicCommunities(publicComms);
      }
    } catch (error) {
      console.error('Error initializing managers:', error);
    }
  };

  const createCommunity = () => {
    if (!communityName.trim() || !communityDescription.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (!user?.id) return;

    try {
      const newCommunity = communityManager.createCommunity({
        name: communityName.trim(),
        description: communityDescription.trim(),
        createdBy: user.id,
        maxMembers: 100,
        isPrivate: false,
        tags: ['corrida', 'comunidade'],
        rules: [
          'Respeite todos os membros',
          'Compartilhe suas conquistas',
          'Ajude iniciantes'
        ],
        challenges: []
      });

      setUserCommunities([...userCommunities, newCommunity]);
      setShowCreateModal(false);
      setCommunityName('');
      setCommunityDescription('');
      
      Alert.alert('Sucesso', 'Comunidade criada com sucesso!');
      try { track('group_created', { group_id: newCommunity.id }).catch(() => {}); } catch {}
    } catch (error) {
      Alert.alert('Erro', 'Erro ao criar comunidade');
    }
  };

  const editCommunity = () => {
    if (!selectedCommunity || !user?.id) return;

    try {
      const updated = communityManager.updateCommunity(
        selectedCommunity.id,
        {
          name: communityName.trim(),
          description: communityDescription.trim()
        },
        user.id
      );

      if (updated) {
        setUserCommunities(userCommunities.map(c => 
          c.id === selectedCommunity.id ? updated : c
        ));
        setShowEditModal(false);
        Alert.alert('Sucesso', 'Comunidade atualizada!');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar comunidade');
    }
  };

  const deleteCommunity = () => {
    if (!selectedCommunity || !user?.id) return;

    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta comunidade? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            try {
              const success = communityManager.deleteCommunity(selectedCommunity.id, user.id);
              if (success) {
                setUserCommunities(userCommunities.filter(c => c.id !== selectedCommunity.id));
                setSelectedCommunity(null);
                Alert.alert('Sucesso', 'Comunidade excluída');
              }
            } catch (error) {
              Alert.alert('Erro', 'Erro ao excluir comunidade');
            }
          }
        }
      ]
    );
  };

  const sendInvite = () => {
    if (!selectedCommunity || !user?.id || !inviteEmail.trim()) {
      Alert.alert('Erro', 'Preencha o email do convidado');
      return;
    }

    try {
      const invite = communityManager.sendInvite(
        selectedCommunity.id,
        user.id,
        inviteEmail.trim(),
        inviteMessage.trim()
      );

      setShowInviteModal(false);
      setInviteEmail('');
      setInviteMessage('');
      Alert.alert('Sucesso', 'Convite enviado com sucesso!');
      try { track('action_performed', { action_name: 'community_invite_sent', context: selectedCommunity.id }).catch(() => {}); } catch {}
    } catch (error) {
      Alert.alert('Erro', 'Erro ao enviar convite');
    }
  };

  const joinCommunity = (community: Community) => {
    if (!user?.id) return;

    try {
      // Simular aceitação de convite
      const member = communityManager.acceptInvite(
        `inv_${Date.now()}`,
        user.id,
        user.username || 'Usuário'
      );

      if (member) {
        setUserCommunities([...userCommunities, community]);
        Alert.alert('Sucesso', 'Você entrou na comunidade!');
        try { track('action_performed', { action_name: 'community_join', context: community.id }).catch(() => {}); } catch {}
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao entrar na comunidade');
    }
  };

  const openCommunityDetails = (community: Community) => {
    setSelectedCommunity(community);
  };

  const getCommunityRanking = (communityId: string) => {
    if (!communityManager) return [];
    return communityManager.getCommunityRanking(communityId);
  };

  const getActiveChallenges = () => {
    if (!challengeManager) return [];
    return challengeManager.getActiveChallenges();
  };

  const getActiveSocialActions = () => {
    if (!socialActionManager) return [];
    return socialActionManager.getActiveSocialActions();
  };

  const getUserProfile = () => {
    if (!gamificationManager || !user?.id) return null;
    return gamificationManager.getUserProfile(user.id);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>Comunidades</ThemedText>
        <ThemedText style={styles.subtitle}>
          Conecte-se com outros corredores e participe de desafios
        </ThemedText>
      </View>

      {/* Perfil do Usuário */}
      {getUserProfile() && (
        <BlurCard style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileInfo}>
              <ThemedText style={styles.profileName}>
                {getUserProfile()?.username || 'Corredor'}
              </ThemedText>
              <ThemedText style={styles.profileLevel}>
                Nível {getUserProfile()?.level} • {getUserProfile()?.totalPoints} pts
              </ThemedText>
            </View>
            <View style={styles.profileStats}>
              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>{getUserProfile()?.totalDistance.toFixed(1)}</ThemedText>
                <ThemedText style={styles.statLabel}>km</ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>{getUserProfile()?.totalRuns}</ThemedText>
                <ThemedText style={styles.statLabel}>corridas</ThemedText>
              </View>
              <View style={styles.statItem}>
                <ThemedText style={styles.statValue}>{getUserProfile()?.streak}</ThemedText>
                <ThemedText style={styles.statLabel}>dias</ThemedText>
              </View>
            </View>
          </View>
        </BlurCard>
      )}

      {/* Minhas Comunidades */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Minhas Comunidades</ThemedText>
          <Pressable onPress={() => setShowCreateModal(true)}>
            <IconButton>
              <Plus color={theme.colors.primary} size={20} />
            </IconButton>
          </Pressable>
        </View>

        {userCommunities.length === 0 ? (
          <EmptyState title="Nenhuma comunidade" description="Crie ou entre em uma comunidade para começar" ctaLabel="Criar Comunidade" onCtaPress={() => setShowCreateModal(true)} />
        ) : (
          userCommunities.map((community) => (
            <Card key={community.id} style={styles.communityCard}>
              <View style={styles.communityHeader}>
                <View style={styles.communityInfo}>
                  <Text style={styles.communityName}>{community.name}</Text>
                  <Text style={styles.communityDescription}>
                    {community.description}
                  </Text>
                  <Text style={styles.communityStats}>
                    {community.members.length} membros • {community.challenges.length} desafios
                  </Text>
                </View>
                <View style={styles.communityActions}>
                  <Pressable onPress={() => openCommunityDetails(community)}>
                    <Users color={theme.colors.primary} size={20} />
                  </Pressable>
                  <Pressable onPress={() => {
                    setSelectedCommunity(community);
                    setCommunityName(community.name);
                    setCommunityDescription(community.description);
                    setShowEditModal(true);
                  }}>
                    <Edit color={theme.colors.primary} size={20} />
                  </Pressable>
                  <Pressable onPress={() => {
                    setSelectedCommunity(community);
                    deleteCommunity();
                  }}>
                    <Trash2 color={theme.colors.danger || '#FF6B6B'} size={20} />
                  </Pressable>
                </View>
              </View>
            </Card>
          ))
        )}
      </View>

      {/* Comunidades Públicas */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Descobrir Comunidades</ThemedText>
        {publicCommunities.slice(0, 3).map((community) => (
          <Card key={community.id} style={styles.communityCard}>
            <View style={styles.communityHeader}>
              <View style={styles.communityInfo}>
                <Text style={styles.communityName}>{community.name}</Text>
                <Text style={styles.communityDescription}>
                  {community.description}
                </Text>
                <Text style={styles.communityStats}>
                  {community.members.length} membros • {community.tags.join(', ')}
                </Text>
              </View>
              <Pressable onPress={() => joinCommunity(community)}>
                <Text style={{ fontWeight: '800', color: theme.colors.primary }}>Entrar</Text>
              </Pressable>
            </View>
          </Card>
        ))}
      </View>

      {/* Ações Rápidas */}
      <View style={styles.quickActions}>
        <Pressable
          style={[styles.quickAction, { backgroundColor: theme.colors.card }]}
          onPress={() => setShowChallengesModal(true)}
        >
          <Target color={theme.colors.primary} size={24} />
          <ThemedText style={styles.quickActionLabel}>Desafios</ThemedText>
        </Pressable>

        <Pressable
          style={[styles.quickAction, { backgroundColor: theme.colors.card }]}
          onPress={() => setShowSocialActionsModal(true)}
        >
          <Heart color={theme.colors.primary} size={24} />
          <ThemedText style={styles.quickActionLabel}>Ações Sociais</ThemedText>
        </Pressable>

        <Pressable
          style={[styles.quickAction, { backgroundColor: theme.colors.card }]}
          onPress={() => setShowCreateEventModal(true)}
        >
          <Trophy color={theme.colors.primary} size={24} />
          <ThemedText style={styles.quickActionLabel}>Evento Local</ThemedText>
        </Pressable>
      </View>

      {/* Benchmarking (exemplo com primeira comunidade do usuário) */}
      {userCommunities[0] && (
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Comparação (Top 3)</ThemedText>
          <BlurCard style={styles.communityCard}>
            {getCommunityRanking(userCommunities[0].id).slice(0,3).map((row) => (
              <View key={row.memberId} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <ThemedText>{row.rank}. {row.username}</ThemedText>
                <ThemedText>{row.totalDistance.toFixed(1)} km</ThemedText>
              </View>
            ))}
          </BlurCard>
        </View>
      )}

      {/* Eventos Locais */}
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Eventos Locais</ThemedText>
        {localEvents.length === 0 ? (
          <BlurCard style={styles.emptyCard}>
            <ThemedText style={styles.emptyDescription}>Crie um evento na sua cidade</ThemedText>
            <ActionButton label="Criar Evento" onPress={() => setShowCreateEventModal(true)} style={styles.createButton} />
          </BlurCard>
        ) : (
          localEvents.map((ev) => (
            <BlurCard key={ev.id} style={styles.communityCard}>
              <View style={styles.communityHeader}>
                <View style={styles.communityInfo}>
                  <ThemedText style={styles.communityName}>{ev.name}</ThemedText>
                  <ThemedText style={styles.communityDescription}>{ev.city} • {new Date(ev.date).toLocaleDateString()} {ev.address ? `• ${ev.address}` : ''}</ThemedText>
                  <ThemedText style={styles.communityStats}>{ev.participants} participantes</ThemedText>
                </View>
                <ActionButton label="Participar" onPress={() => {
                  setLocalEvents((list) => list.map((e) => e.id === ev.id ? { ...e, participants: e.participants + 1 } : e));
                  try { track('event_joined', { event_id: ev.id }).catch(() => {}); } catch {}
                }} />
                <View style={{ width: 8 }} />
                <ActionButton label="Adicionar ao Calendário" onPress={async () => {
                  const start = new Date();
                  const end = new Date(start.getTime() + 60 * 60 * 1000);
                  const id = await addEventToCalendar({ title: ev.name, notes: ev.city, startDate: start, endDate: end, location: ev.address });
                  if (id) { try { await track('action_performed', { action_name: 'calendar_add_event', context: id }); } catch {} }
                }} />
              </View>
            </BlurCard>
          ))
        )}
      </View>

      {/* Modal Criar Comunidade */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <ThemedText style={styles.modalTitle}>Criar Comunidade</ThemedText>
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: theme.colors.border
              }]}
              placeholder="Nome da comunidade"
              placeholderTextColor={theme.colors.muted}
              value={communityName}
              onChangeText={setCommunityName}
            />
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: theme.colors.border
              }]}
              placeholder="Descrição"
              placeholderTextColor={theme.colors.muted}
              value={communityDescription}
              onChangeText={setCommunityDescription}
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.modalButtons}>
              <ActionButton
                label="Cancelar"
                onPress={() => setShowCreateModal(false)}
                style={[styles.cancelButton, { borderColor: theme.colors.border }]}
              />
              <ActionButton
                label="Criar"
                onPress={createCommunity}
                style={styles.createButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Editar Comunidade */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <ThemedText style={styles.modalTitle}>Editar Comunidade</ThemedText>
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: theme.colors.border
              }]}
              placeholder="Nome da comunidade"
              placeholderTextColor={theme.colors.muted}
              value={communityName}
              onChangeText={setCommunityName}
            />
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: theme.colors.border
              }]}
              placeholder="Descrição"
              placeholderTextColor={theme.colors.muted}
              value={communityDescription}
              onChangeText={setCommunityDescription}
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.modalButtons}>
              <ActionButton
                label="Cancelar"
                onPress={() => setShowEditModal(false)}
                style={[styles.cancelButton, { borderColor: theme.colors.border }]}
              />
              <ActionButton
                label="Salvar"
                onPress={editCommunity}
                style={styles.createButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Enviar Convite */}
      <Modal
        visible={showInviteModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowInviteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <ThemedText style={styles.modalTitle}>Enviar Convite</ThemedText>
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: theme.colors.border
              }]}
              placeholder="Email do convidado"
              placeholderTextColor={theme.colors.muted}
              value={inviteEmail}
              onChangeText={setInviteEmail}
              keyboardType="email-address"
            />
            
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: theme.colors.border
              }]}
              placeholder="Mensagem (opcional)"
              placeholderTextColor={theme.colors.muted}
              value={inviteMessage}
              onChangeText={setInviteMessage}
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.modalButtons}>
              <ActionButton
                label="Cancelar"
                onPress={() => setShowInviteModal(false)}
                style={[styles.cancelButton, { borderColor: theme.colors.border }]}
              />
              <ActionButton
                label="Enviar"
                onPress={sendInvite}
                style={styles.createButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Desafios */}
      <Modal
        visible={showChallengesModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowChallengesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <ThemedText style={styles.modalTitle}>Desafios Ativos</ThemedText>
            
            <ScrollView style={styles.challengesList}>
              {getActiveChallenges().map((challenge) => (
                <View key={challenge.id} style={[styles.challengeItem, { backgroundColor: theme.colors.card }]}>
                  <ThemedText style={styles.challengeName}>{challenge.name}</ThemedText>
                  <ThemedText style={styles.challengeDescription}>{challenge.description}</ThemedText>
                  <ThemedText style={styles.challengeStats}>
                    {challenge.levels.length} níveis • {challenge.totalParticipants} participantes
                  </ThemedText>
                </View>
              ))}
            </ScrollView>
            
            <ActionButton
              label="Fechar"
              onPress={() => setShowChallengesModal(false)}
              style={styles.createButton}
            />
          </View>
        </View>
      </Modal>

      {/* Modal Ações Sociais */}
      <Modal
        visible={showSocialActionsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSocialActionsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <ThemedText style={styles.modalTitle}>Ações Sociais</ThemedText>
            
            <ScrollView style={styles.socialActionsList}>
              {getActiveSocialActions().map((action) => (
                <View key={action.id} style={[styles.socialActionItem, { backgroundColor: theme.colors.card }]}>
                  <ThemedText style={styles.socialActionName}>{action.name}</ThemedText>
                  <ThemedText style={styles.socialActionDescription}>{action.description}</ThemedText>
                  <ThemedText style={styles.socialActionStats}>
                    {action.totalKmDonated}km doados • R$ {action.totalMoneyRaised.toFixed(2)} arrecadados
                  </ThemedText>
                </View>
              ))}
            </ScrollView>
            
            <ActionButton
              label="Fechar"
              onPress={() => setShowSocialActionsModal(false)}
              style={styles.createButton}
            />
          </View>
        </View>
      </Modal>

      {/* Modal Criar Evento Local */}
      <Modal
        visible={showCreateEventModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateEventModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <ThemedText style={styles.modalTitle}>Criar Evento Local</ThemedText>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.border }]}
              placeholder="Nome do evento"
              placeholderTextColor={theme.colors.muted}
              value={eventName}
              onChangeText={setEventName}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.border }]}
              placeholder="Data (YYYY-MM-DD)"
              placeholderTextColor={theme.colors.muted}
              value={eventDate}
              onChangeText={setEventDate}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.border }]}
              placeholder="Cidade"
              placeholderTextColor={theme.colors.muted}
              value={eventCity}
              onChangeText={setEventCity}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.border }]}
              placeholder="Endereço (opcional)"
              placeholderTextColor={theme.colors.muted}
              value={eventAddress}
              onChangeText={setEventAddress}
            />
            <View style={styles.modalButtons}>
              <ActionButton label="Cancelar" onPress={() => setShowCreateEventModal(false)} style={[styles.cancelButton, { borderColor: theme.colors.border }]} />
              <ActionButton label="Criar" onPress={() => {
                if (!eventName.trim() || !eventDate.trim() || !eventCity.trim()) { Alert.alert('Erro', 'Preencha nome, data e cidade'); return; }
                const id = `evt_${Date.now()}`;
                setLocalEvents([{ id, name: eventName.trim(), date: eventDate.trim(), city: eventCity.trim(), address: eventAddress.trim() || undefined, participants: 1 }, ...localEvents]);
                setShowCreateEventModal(false);
                setEventName(''); setEventDate(''); setEventCity(''); setEventAddress('');
                try { track('action_performed', { action_name: 'local_event_created', context: id }).catch(() => {}); } catch {}
              }} style={styles.createButton} />
            </View>
          </View>
        </View>
      </Modal>
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
  profileCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileLevel: {
    fontSize: 14,
    opacity: 0.7,
  },
  profileStats: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 20,
  },
  communityCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  communityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  communityInfo: {
    flex: 1,
  },
  communityName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  communityDescription: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 8,
    lineHeight: 20,
  },
  communityStats: {
    fontSize: 12,
    opacity: 0.6,
  },
  communityActions: {
    flexDirection: 'row',
    gap: 8,
  },
  joinButton: {
    backgroundColor: '#00B894',
  },
  createButton: {
    backgroundColor: '#6C63FF',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickAction: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    minWidth: 80,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  challengesList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  challengeItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  challengeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 8,
  },
  challengeStats: {
    fontSize: 12,
    opacity: 0.6,
  },
  socialActionsList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  socialActionItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  socialActionName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  socialActionDescription: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 8,
  },
  socialActionStats: {
    fontSize: 12,
    opacity: 0.6,
  },
});