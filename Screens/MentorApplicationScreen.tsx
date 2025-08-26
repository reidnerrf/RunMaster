import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { createMentorshipManager } from '../Lib/mentorshipSystem';

const mentorshipManager = createMentorshipManager();

interface MentorApplication {
  name: string;
  bio: string;
  specialties: string[];
  experience: {
    years: number;
    certifications: string[];
    achievements: string[];
    completedRaces: {
      distance: string;
      count: number;
      bestTime?: string;
    }[];
  };
  pricing: {
    hourlyRate: number;
    packageRates: {
      name: string;
      sessions: number;
      price: number;
      discount: number;
    }[];
    subscriptionPlans: {
      name: string;
      price: number;
      sessionsPerMonth: number;
      features: string[];
    }[];
  };
  availability: {
    days: string[];
    timeSlots: string[];
    timezone: string;
    maxMentees: number;
  };
  verificationDocuments: string[];
}

export default function MentorApplicationScreen({ navigation }: any) {
  const [currentStep, setCurrentStep] = useState(1);
  const [application, setApplication] = useState<MentorApplication>({
    name: '',
    bio: '',
    specialties: [],
    experience: {
      years: 0,
      certifications: [],
      achievements: [],
      completedRaces: []
    },
    pricing: {
      hourlyRate: 0,
      packageRates: [],
      subscriptionPlans: []
    },
    availability: {
      days: [],
      timeSlots: [],
      timezone: 'America/Sao_Paulo',
      maxMentees: 5
    },
    verificationDocuments: []
  });

  const [newCertification, setNewCertification] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [newRace, setNewRace] = useState({ distance: '', count: 0, bestTime: '' });
  const [newPackageRate, setNewPackageRate] = useState({ name: '', sessions: 0, price: 0, discount: 0 });
  const [newSubscriptionPlan, setNewSubscriptionPlan] = useState({ name: '', price: 0, sessionsPerMonth: 0, features: [] });
  const [newFeature, setNewFeature] = useState('');

  const totalSteps = 5;

  const specialties = [
    'marathon', 'ultra_marathon', 'endurance', 'trail_running',
    '5k', '10k', 'beginner_training', 'weight_loss', 'speed_training',
    'strength_training', 'nutrition', 'recovery', 'injury_prevention'
  ];

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const timeSlots = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  const updateApplication = (field: keyof MentorApplication, value: any) => {
    setApplication(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent: keyof MentorApplication, field: string, value: any) => {
    setApplication(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return application.name.length > 0 && application.bio.length > 50 && application.specialties.length > 0;
      case 2:
        return application.experience.years > 0 && application.experience.certifications.length > 0;
      case 3:
        return application.pricing.hourlyRate > 0 && application.pricing.subscriptionPlans.length > 0;
      case 4:
        return application.availability.days.length > 0 && application.availability.timeSlots.length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    if (!validateStep(currentStep)) {
      Alert.alert('Erro', 'Por favor, complete todas as informações obrigatórias');
      return;
    }

    // Simular envio da aplicação
    Alert.alert(
      'Aplicação Enviada!',
      'Sua aplicação foi enviada com sucesso. Nossa equipe irá revisar e entrar em contato em até 48 horas.',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Mentorship')
        }
      ]
    );
  };

  const addSpecialty = (specialty: string) => {
    if (!application.specialties.includes(specialty)) {
      updateApplication('specialties', [...application.specialties, specialty]);
    }
  };

  const removeSpecialty = (specialty: string) => {
    updateApplication('specialties', application.specialties.filter(s => s !== specialty));
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      updateNestedField('experience', 'certifications', [...application.experience.certifications, newCertification.trim()]);
      setNewCertification('');
    }
  };

  const removeCertification = (index: number) => {
    const updated = application.experience.certifications.filter((_, i) => i !== index);
    updateNestedField('experience', 'certifications', updated);
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      updateNestedField('experience', 'achievements', [...application.experience.achievements, newAchievement.trim()]);
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    const updated = application.experience.achievements.filter((_, i) => i !== index);
    updateNestedField('experience', 'achievements', updated);
  };

  const addRace = () => {
    if (newRace.distance && newRace.count > 0) {
      updateNestedField('experience', 'completedRaces', [...application.experience.completedRaces, { ...newRace }]);
      setNewRace({ distance: '', count: 0, bestTime: '' });
    }
  };

  const removeRace = (index: number) => {
    const updated = application.experience.completedRaces.filter((_, i) => i !== index);
    updateNestedField('experience', 'completedRaces', updated);
  };

  const addPackageRate = () => {
    if (newPackageRate.name && newPackageRate.sessions > 0 && newPackageRate.price > 0) {
      updateApplication('pricing', {
        ...application.pricing,
        packageRates: [...application.pricing.packageRates, { ...newPackageRate }]
      });
      setNewPackageRate({ name: '', sessions: 0, price: 0, discount: 0 });
    }
  };

  const removePackageRate = (index: number) => {
    const updated = application.pricing.packageRates.filter((_, i) => i !== index);
    updateApplication('pricing', { ...application.pricing, packageRates: updated });
  };

  const addSubscriptionPlan = () => {
    if (newSubscriptionPlan.name && newSubscriptionPlan.price > 0 && newSubscriptionPlan.sessionsPerMonth > 0) {
      updateApplication('pricing', {
        ...application.pricing,
        subscriptionPlans: [...application.pricing.subscriptionPlans, { ...newSubscriptionPlan }]
      });
      setNewSubscriptionPlan({ name: '', price: 0, sessionsPerMonth: 0, features: [] });
    }
  };

  const removeSubscriptionPlan = (index: number) => {
    const updated = application.pricing.subscriptionPlans.filter((_, i) => i !== index);
    updateApplication('pricing', { ...application.pricing, subscriptionPlans: updated });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setNewSubscriptionPlan(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setNewSubscriptionPlan(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const toggleDay = (day: string) => {
    const updated = application.availability.days.includes(day)
      ? application.availability.days.filter(d => d !== day)
      : [...application.availability.days, day];
    updateNestedField('availability', 'days', updated);
  };

  const toggleTimeSlot = (time: string) => {
    const updated = application.availability.timeSlots.includes(time)
      ? application.availability.timeSlots.filter(t => t !== time)
      : [...application.availability.timeSlots, time];
    updateNestedField('availability', 'timeSlots', updated);
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <View key={index} style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            index + 1 <= currentStep && styles.stepCircleActive
          ]}>
            <Text style={[
              styles.stepNumber,
              index + 1 <= currentStep && styles.stepNumberActive
            ]}>
              {index + 1}
            </Text>
          </View>
          {index < totalSteps - 1 && (
            <View style={[
              styles.stepLine,
              index + 1 < currentStep && styles.stepLineActive
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Informações Básicas</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Nome Completo *</Text>
        <TextInput
          style={styles.textInput}
          value={application.name}
          onChangeText={(text) => updateApplication('name', text)}
          placeholder="Seu nome completo"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Biografia *</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          value={application.bio}
          onChangeText={(text) => updateApplication('bio', text)}
          placeholder="Conte sua história como corredor, suas conquistas e por que você quer ser mentor..."
          multiline
          numberOfLines={4}
        />
        <Text style={styles.charCount}>{application.bio.length}/500</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Especialidades *</Text>
        <Text style={styles.inputSubtitle}>Selecione suas áreas de expertise</Text>
        <View style={styles.specialtiesGrid}>
          {specialties.map((specialty) => (
            <TouchableOpacity
              key={specialty}
              style={[
                styles.specialtyChip,
                application.specialties.includes(specialty) && styles.specialtyChipActive
              ]}
              onPress={() => application.specialties.includes(specialty) 
                ? removeSpecialty(specialty) 
                : addSpecialty(specialty)
              }
            >
              <Text style={[
                styles.specialtyChipText,
                application.specialties.includes(specialty) && styles.specialtyChipTextActive
              ]}>
                {specialty.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.selectedCount}>
          {application.specialties.length} especialidade(s) selecionada(s)
        </Text>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Experiência e Credenciais</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Anos de Experiência *</Text>
        <Picker
          selectedValue={application.experience.years}
          onValueChange={(value) => updateNestedField('experience', 'years', value)}
          style={styles.picker}
        >
          {Array.from({ length: 30 }, (_, i) => i + 1).map(year => (
            <Picker.Item key={year} label={`${year} ano(s)`} value={year} />
          ))}
        </Picker>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Certificações *</Text>
        <Text style={styles.inputSubtitle}>Adicione suas certificações e cursos</Text>
        <View style={styles.addItemContainer}>
          <TextInput
            style={[styles.textInput, styles.addItemInput]}
            value={newCertification}
            onChangeText={setNewCertification}
            placeholder="Ex: Personal Trainer, Coach de Corrida..."
          />
          <TouchableOpacity style={styles.addButton} onPress={addCertification}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        {application.experience.certifications.map((cert, index) => (
          <View key={index} style={styles.itemChip}>
            <Text style={styles.itemChipText}>{cert}</Text>
            <TouchableOpacity onPress={() => removeCertification(index)}>
              <Ionicons name="close-circle" size={20} color="#ff4444" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Conquistas</Text>
        <Text style={styles.inputSubtitle}>Principais marcos na sua carreira</Text>
        <View style={styles.addItemContainer}>
          <TextInput
            style={[styles.textInput, styles.addItemInput]}
            value={newAchievement}
            onChangeText={setNewAchievement}
            placeholder="Ex: Boston Qualifier, Recorde pessoal..."
          />
          <TouchableOpacity style={styles.addButton} onPress={addAchievement}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        {application.experience.achievements.map((achievement, index) => (
          <View key={index} style={styles.itemChip}>
            <Text style={styles.itemChipText}>{achievement}</Text>
            <TouchableOpacity onPress={() => removeAchievement(index)}>
              <Ionicons name="close-circle" size={20} color="#ff4444" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Corridas Completadas</Text>
        <Text style={styles.inputSubtitle}>Adicione suas experiências em corridas</Text>
        <View style={styles.raceInputContainer}>
          <TextInput
            style={[styles.textInput, styles.raceInput]}
            value={newRace.distance}
            onChangeText={(text) => setNewRace(prev => ({ ...prev, distance: text }))}
            placeholder="Distância (ex: 5K, Maratona)"
          />
          <TextInput
            style={[styles.textInput, styles.raceInput]}
            value={newRace.count.toString()}
            onChangeText={(text) => setNewRace(prev => ({ ...prev, count: parseInt(text) || 0 }))}
            placeholder="Quantidade"
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.textInput, styles.raceInput]}
            value={newRace.bestTime}
            onChangeText={(text) => setNewRace(prev => ({ ...prev, bestTime: text }))}
            placeholder="Melhor tempo (opcional)"
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={addRace}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
        {application.experience.completedRaces.map((race, index) => (
          <View key={index} style={styles.itemChip}>
            <Text style={styles.itemChipText}>
              {race.distance} - {race.count}x {race.bestTime && `(${race.bestTime})`}
            </Text>
            <TouchableOpacity onPress={() => removeRace(index)}>
              <Ionicons name="close-circle" size={20} color="#ff4444" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Preços e Planos</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Taxa por Hora (R$) *</Text>
        <TextInput
          style={styles.textInput}
          value={application.pricing.hourlyRate.toString()}
          onChangeText={(text) => updateNestedField('pricing', 'hourlyRate', parseInt(text) || 0)}
          placeholder="100"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Pacotes de Sessões</Text>
        <Text style={styles.inputSubtitle}>Crie pacotes com desconto</Text>
        <View style={styles.packageInputContainer}>
          <TextInput
            style={[styles.textInput, styles.packageInput]}
            value={newPackageRate.name}
            onChangeText={(text) => setNewPackageRate(prev => ({ ...prev, name: text }))}
            placeholder="Nome do pacote"
          />
          <TextInput
            style={[styles.textInput, styles.packageInput]}
            value={newPackageRate.sessions.toString()}
            onChangeText={(text) => setNewPackageRate(prev => ({ ...prev, sessions: parseInt(text) || 0 }))}
            placeholder="Sessões"
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.textInput, styles.packageInput]}
            value={newPackageRate.price.toString()}
            onChangeText={(text) => setNewPackageRate(prev => ({ ...prev, price: parseInt(text) || 0 }))}
            placeholder="Preço total"
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.textInput, styles.packageInput]}
            value={newPackageRate.discount.toString()}
            onChangeText={(text) => setNewPackageRate(prev => ({ ...prev, discount: parseInt(text) || 0 }))}
            placeholder="Desconto %"
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={addPackageRate}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
        {application.pricing.packageRates.map((pkg, index) => (
          <View key={index} style={styles.itemChip}>
            <Text style={styles.itemChipText}>
              {pkg.name}: {pkg.sessions} sessões por R$ {pkg.price} ({pkg.discount}% desconto)
            </Text>
            <TouchableOpacity onPress={() => removePackageRate(index)}>
              <Ionicons name="close-circle" size={20} color="#ff4444" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Planos de Assinatura *</Text>
        <Text style={styles.inputSubtitle}>Crie planos mensais/anuais</Text>
        <View style={styles.subscriptionInputContainer}>
          <TextInput
            style={[styles.textInput, styles.subscriptionInput]}
            value={newSubscriptionPlan.name}
            onChangeText={(text) => setNewSubscriptionPlan(prev => ({ ...prev, name: text }))}
            placeholder="Nome do plano"
          />
          <TextInput
            style={[styles.textInput, styles.subscriptionInput]}
            value={newSubscriptionPlan.price.toString()}
            onChangeText={(text) => setNewSubscriptionPlan(prev => ({ ...prev, price: parseInt(text) || 0 }))}
            placeholder="Preço mensal"
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.textInput, styles.subscriptionInput]}
            value={newSubscriptionPlan.sessionsPerMonth.toString()}
            onChangeText={(text) => setNewSubscriptionPlan(prev => ({ ...prev, sessionsPerMonth: parseInt(text) || 0 }))}
            placeholder="Sessões/mês"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.featuresInputContainer}>
          <TextInput
            style={[styles.textInput, styles.featuresInput]}
            value={newFeature}
            onChangeText={setNewFeature}
            placeholder="Adicionar feature (ex: Suporte prioritário)"
          />
          <TouchableOpacity style={styles.addButton} onPress={addFeature}>
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        {newSubscriptionPlan.features.map((feature, index) => (
          <View key={index} style={styles.itemChip}>
            <Text style={styles.itemChipText}>{feature}</Text>
            <TouchableOpacity onPress={() => removeFeature(index)}>
              <Ionicons name="close-circle" size={20} color="#ff4444" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addButton} onPress={addSubscriptionPlan}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
        {application.pricing.subscriptionPlans.map((plan, index) => (
          <View key={index} style={styles.itemChip}>
            <Text style={styles.itemChipText}>
              {plan.name}: R$ {plan.price}/mês - {plan.sessionsPerMonth} sessões
            </Text>
            <TouchableOpacity onPress={() => removeSubscriptionPlan(index)}>
              <Ionicons name="close-circle" size={20} color="#ff4444" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Disponibilidade</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Dias da Semana *</Text>
        <Text style={styles.inputSubtitle}>Selecione os dias que você está disponível</Text>
        <View style={styles.daysGrid}>
          {days.map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayChip,
                application.availability.days.includes(day) && styles.dayChipActive
              ]}
              onPress={() => toggleDay(day)}
            >
              <Text style={[
                styles.dayChipText,
                application.availability.days.includes(day) && styles.dayChipTextActive
              ]}>
                {day === 'monday' ? 'Seg' : 
                 day === 'tuesday' ? 'Ter' : 
                 day === 'wednesday' ? 'Qua' : 
                 day === 'thursday' ? 'Qui' : 
                 day === 'friday' ? 'Sex' : 
                 day === 'saturday' ? 'Sáb' : 'Dom'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Horários *</Text>
        <Text style={styles.inputSubtitle}>Selecione os horários disponíveis</Text>
        <View style={styles.timeSlotsGrid}>
          {timeSlots.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeSlotChip,
                application.availability.timeSlots.includes(time) && styles.timeSlotChipActive
              ]}
              onPress={() => toggleTimeSlot(time)}
            >
              <Text style={[
                styles.timeSlotChipText,
                application.availability.timeSlots.includes(time) && styles.timeSlotChipTextActive
              ]}>
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Fuso Horário</Text>
        <Picker
          selectedValue={application.availability.timezone}
          onValueChange={(value) => updateNestedField('availability', 'timezone', value)}
          style={styles.picker}
        >
          <Picker.Item label="America/Sao_Paulo (GMT-3)" value="America/Sao_Paulo" />
          <Picker.Item label="America/New_York (GMT-5)" value="America/New_York" />
          <Picker.Item label="Europe/London (GMT+0)" value="Europe/London" />
          <Picker.Item label="Asia/Tokyo (GMT+9)" value="Asia/Tokyo" />
        </Picker>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Máximo de Mentees</Text>
        <Text style={styles.inputSubtitle}>Quantos alunos você pode atender simultaneamente</Text>
        <Picker
          selectedValue={application.availability.maxMentees}
          onValueChange={(value) => updateNestedField('availability', 'maxMentees', value)}
          style={styles.picker}
        >
          {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
            <Picker.Item key={num} label={`${num} mentee(s)`} value={num} />
          ))}
        </Picker>
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Revisão e Envio</Text>
      
      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>Informações Básicas</Text>
        <Text style={styles.reviewText}><Text style={styles.reviewLabel}>Nome:</Text> {application.name}</Text>
        <Text style={styles.reviewText}><Text style={styles.reviewLabel}>Especialidades:</Text> {application.specialties.join(', ')}</Text>
        <Text style={styles.reviewText}><Text style={styles.reviewLabel}>Bio:</Text> {application.bio.substring(0, 100)}...</Text>
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>Experiência</Text>
        <Text style={styles.reviewText}><Text style={styles.reviewLabel}>Anos:</Text> {application.experience.years}</Text>
        <Text style={styles.reviewText}><Text style={styles.reviewLabel}>Certificações:</Text> {application.experience.certifications.length}</Text>
        <Text style={styles.reviewText}><Text style={styles.reviewLabel}>Conquistas:</Text> {application.experience.achievements.length}</Text>
        <Text style={styles.reviewText}><Text style={styles.reviewLabel}>Corridas:</Text> {application.experience.completedRaces.length}</Text>
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>Preços</Text>
        <Text style={styles.reviewText}><Text style={styles.reviewLabel}>Taxa por hora:</Text> R$ {application.pricing.hourlyRate}</Text>
        <Text style={styles.reviewText}><Text style={styles.reviewLabel}>Pacotes:</Text> {application.pricing.packageRates.length}</Text>
        <Text style={styles.reviewText}><Text style={styles.reviewLabel}>Planos de assinatura:</Text> {application.pricing.subscriptionPlans.length}</Text>
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewSectionTitle}>Disponibilidade</Text>
        <Text style={styles.reviewText}><Text style={styles.reviewLabel}>Dias:</Text> {application.availability.days.length} dias por semana</Text>
        <Text style={styles.reviewText}><Text style={styles.reviewLabel}>Horários:</Text> {application.availability.timeSlots.length} horários disponíveis</Text>
        <Text style={styles.reviewText}><Text style={styles.reviewLabel}>Max mentees:</Text> {application.availability.maxMentees}</Text>
      </View>

      <View style={styles.termsContainer}>
        <TouchableOpacity style={styles.termsCheckbox}>
          <Ionicons name="checkbox-outline" size={24} color="#667eea" />
        </TouchableOpacity>
        <Text style={styles.termsText}>
          Concordo com os termos e condições de uso da plataforma de mentoria
        </Text>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return null;
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
        <Text style={styles.headerTitle}>Aplicar como Mentor</Text>
        <View style={styles.placeholder} />
      </View>

      {renderStepIndicator()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCurrentStep()}
      </ScrollView>

      <View style={styles.navigationButtons}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={prevStep}
          >
            <Text style={styles.secondaryButtonText}>Anterior</Text>
          </TouchableOpacity>
        )}

        {currentStep < totalSteps ? (
          <TouchableOpacity
            style={[
              styles.primaryButton,
              !validateStep(currentStep) && styles.disabledButton,
            ]}
            onPress={nextStep}
            disabled={!validateStep(currentStep)}
          >
            <Text style={styles.primaryButtonText}>Próximo</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.primaryButton,
              !validateStep(currentStep) && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={!validateStep(currentStep)}
          >
            <Text style={styles.primaryButtonText}>Enviar Aplicação</Text>
          </TouchableOpacity>
        )}
      </View>
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
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  stepCircleActive: {
    backgroundColor: '#667eea',
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
  },
  stepNumberActive: {
    color: '#fff',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#fff',
    opacity: 0.3,
  },
  stepLineActive: {
    backgroundColor: '#667eea',
    opacity: 1,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  specialtiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  specialtyChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 8,
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
  selectedCount: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '500',
  },
  addItemContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  addItemInput: {
    flex: 1,
    marginRight: 12,
  },
  addButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  itemChipText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  raceInputContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  raceInput: {
    flex: 1,
    marginRight: 8,
  },
  packageInputContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  packageInput: {
    flex: 1,
    marginRight: 8,
  },
  subscriptionInputContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  subscriptionInput: {
    flex: 1,
    marginRight: 8,
  },
  featuresInputContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  featuresInput: {
    flex: 1,
    marginRight: 12,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  dayChip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  dayChipActive: {
    backgroundColor: '#667eea',
  },
  dayChipText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  dayChipTextActive: {
    color: '#fff',
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  timeSlotChip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  timeSlotChipActive: {
    backgroundColor: '#667eea',
  },
  timeSlotChipText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  timeSlotChipTextActive: {
    color: '#fff',
  },
  reviewSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  reviewSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  reviewLabel: {
    fontWeight: '600',
    color: '#333',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  termsCheckbox: {
    marginRight: 12,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    lineHeight: 20,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 32,
    paddingVertical: 16,
    flex: 0.48,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 32,
    paddingVertical: 16,
    flex: 0.48,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
});