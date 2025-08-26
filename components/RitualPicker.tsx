import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Alert
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { ThemedText } from './ThemedText';
import { ActionButton } from './ActionButton';
import { BlurCard } from './ui/BlurCard';
import { RitualPreset, RunnerProfileType } from '../Lib/rituals';
import { Clock, Zap, Mountain, Users, X } from 'lucide-react-native';

interface RitualPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (ritual: RitualPreset) => void;
  currentProfile: RunnerProfileType;
}

export default function RitualPicker({ visible, onClose, onSelect, currentProfile }: RitualPickerProps) {
  const { theme } = useTheme();
  const [selectedRitual, setSelectedRitual] = useState<RitualPreset | null>(null);

  const getProfileIcon = (profile: RunnerProfileType) => {
    switch (profile) {
      case 'speedster': return <Zap color={theme.colors.primary} size={20} />;
      case 'endurance': return <Clock color={theme.colors.primary} size={20} />;
      case 'trail': return <Mountain color={theme.colors.primary} size={20} />;
      case 'social': return <Users color={theme.colors.primary} size={20} />;
      default: return <Zap color={theme.colors.primary} size={20} />;
    }
  };

  const getProfileColor = (profile: RunnerProfileType) => {
    switch (profile) {
      case 'speedster': return '#FF6B6B';
      case 'endurance': return '#4ECDC4';
      case 'trail': return '#45B7D1';
      case 'social': return '#96CEB4';
      default: return theme.colors.primary;
    }
  };

  const handleSelectRitual = (ritual: RitualPreset) => {
    setSelectedRitual(ritual);
  };

  const handleConfirm = () => {
    if (selectedRitual) {
      onSelect(selectedRitual);
      onClose();
      setSelectedRitual(null);
    }
  };

  const ritualPresets: RitualPreset[] = [
    {
      id: 'speedster-basic',
      name: 'Explosão Rápida',
      profile: 'speedster',
      durationMin: 15,
      warmup: ['10min trot', '3x30s strides', 'A/B skips'],
      cooldown: ['5min walk', 'hamstrings stretch', 'hips mobility'],
      mobility: ['ankle mobility', 'hip openers']
    },
    {
      id: 'endurance-base',
      name: 'Base Consistente',
      profile: 'endurance',
      durationMin: 12,
      warmup: ['8min easy', 'drills form'],
      cooldown: ['8min easy', 'quads stretch'],
      mobility: ['thoracic rotation']
    },
    {
      id: 'trail-flow',
      name: 'Flow na Trilha',
      profile: 'trail',
      durationMin: 18,
      warmup: ['hike 5min', 'ankle hops', 'glute activation'],
      cooldown: ['downhill walk', 'calves stretch'],
      mobility: ['ankle/hip combo']
    },
    {
      id: 'social-fun',
      name: 'Social Leve',
      profile: 'social',
      durationMin: 10,
      warmup: ['chat jog', 'dynamic stretch'],
      cooldown: ['group walk', 'photos'],
      mobility: ['neck/shoulder relax']
    }
  ];

  const filteredPresets = ritualPresets.filter(r => r.profile === currentProfile);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: theme.colors.background }]}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.title}>Escolha seu Ritual</ThemedText>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X color={theme.colors.muted} size={24} />
            </Pressable>
          </View>

          {/* Profile Info */}
          <View style={[styles.profileInfo, { backgroundColor: theme.colors.card }]}>
            <View style={styles.profileHeader}>
              {getProfileIcon(currentProfile)}
              <ThemedText style={styles.profileName}>
                {currentProfile === 'speedster' ? 'Speedster' :
                 currentProfile === 'endurance' ? 'Endurance' :
                 currentProfile === 'trail' ? 'Trail' : 'Social'}
              </ThemedText>
            </View>
            <ThemedText style={styles.profileDescription}>
              {currentProfile === 'speedster' ? 'Foco em velocidade e explosão' :
               currentProfile === 'endurance' ? 'Construção de base aeróbica' :
               currentProfile === 'trail' ? 'Preparação para terrenos variados' : 'Corrida social e divertida'}
            </ThemedText>
          </View>

          {/* Ritual Options */}
          <ScrollView style={styles.ritualList} showsVerticalScrollIndicator={false}>
            {filteredPresets.map((ritual) => (
              <Pressable
                key={ritual.id}
                style={[
                  styles.ritualOption,
                  { backgroundColor: theme.colors.card },
                  selectedRitual?.id === ritual.id && {
                    borderColor: getProfileColor(ritual.profile),
                    borderWidth: 2
                  }
                ]}
                onPress={() => handleSelectRitual(ritual)}
              >
                <View style={styles.ritualHeader}>
                  <ThemedText style={styles.ritualName}>{ritual.name}</ThemedText>
                  <View style={[styles.durationBadge, { backgroundColor: getProfileColor(ritual.profile) }]}>
                    <ThemedText style={styles.durationText}>{ritual.durationMin}min</ThemedText>
                  </View>
                </View>

                <View style={styles.ritualDetails}>
                  <View style={styles.ritualSection}>
                    <ThemedText style={styles.sectionTitle}>Warm-up</ThemedText>
                    {ritual.warmup.map((item, index) => (
                      <ThemedText key={index} style={styles.ritualItem}>• {item}</ThemedText>
                    ))}
                  </View>

                  <View style={styles.ritualSection}>
                    <ThemedText style={styles.sectionTitle}>Cooldown</ThemedText>
                    {ritual.cooldown.map((item, index) => (
                      <ThemedText key={index} style={styles.ritualItem}>• {item}</ThemedText>
                    ))}
                  </View>

                  <View style={styles.ritualSection}>
                    <ThemedText style={styles.sectionTitle}>Mobilidade</ThemedText>
                    {ritual.mobility.map((item, index) => (
                      <ThemedText key={index} style={styles.ritualItem}>• {item}</ThemedText>
                    ))}
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <ActionButton
              label="Pular Ritual"
              onPress={onClose}
              style={[styles.skipButton, { borderColor: theme.colors.border }]}
            />
            <ActionButton
              label="Confirmar Ritual"
              onPress={handleConfirm}
              style={[styles.confirmButton, { backgroundColor: getProfileColor(currentProfile) }]}
              disabled={!selectedRitual}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  profileInfo: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  profileDescription: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
  ritualList: {
    flex: 1,
    marginBottom: 20,
  },
  ritualOption: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  ritualHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ritualName: {
    fontSize: 18,
    fontWeight: '600',
  },
  durationBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  ritualDetails: {
    gap: 16,
  },
  ritualSection: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  ritualItem: {
    fontSize: 12,
    opacity: 0.8,
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  skipButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  confirmButton: {
    flex: 1,
  },
});