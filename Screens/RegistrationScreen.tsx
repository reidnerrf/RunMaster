import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface UserProfile {
  // Informações básicas
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  
  // Informações físicas
  height: number;
  weight: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  
  // Informações de treino
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  fitnessGoal: 'weight_loss' | 'maintenance' | 'muscle_gain' | 'endurance' | 'performance';
  preferredDistance: '5k' | '10k' | 'half_marathon' | 'marathon' | 'ultra';
  weeklyTrainingDays: number;
  averageWeeklyDistance: number;
  
  // Informações médicas
  hasInjuries: boolean;
  injuryHistory: string[];
  chronicConditions: string[];
  medications: string[];
  allergies: string[];
  
  // Preferências de treino
  preferredTerrain: 'flat' | 'hilly' | 'mountainous' | 'mixed';
  preferredTime: 'morning' | 'afternoon' | 'evening' | 'night';
  weatherPreferences: string[];
  
  // Objetivos específicos
  targetRace?: string;
  targetTime?: string;
  targetWeight?: number;
  targetBodyFat?: number;
  
  // Preferências de notificação
  notificationPreferences: {
    trainingReminders: boolean;
    nutritionReminders: boolean;
    recoveryReminders: boolean;
    achievementAlerts: boolean;
    communityUpdates: boolean;
  };
  
  // Configurações de privacidade
  privacySettings: {
    shareProgress: boolean;
    shareLocation: boolean;
    allowConnections: boolean;
    publicProfile: boolean;
  };
}

export default function RegistrationScreen({ navigation }: any) {
  const [currentStep, setCurrentStep] = useState(1);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: 'other',
    height: 0,
    weight: 0,
    experienceLevel: 'beginner',
    fitnessGoal: 'maintenance',
    preferredDistance: '5k',
    weeklyTrainingDays: 3,
    averageWeeklyDistance: 15,
    hasInjuries: false,
    injuryHistory: [],
    chronicConditions: [],
    medications: [],
    allergies: [],
    preferredTerrain: 'flat',
    preferredTime: 'morning',
    weatherPreferences: [],
    notificationPreferences: {
      trainingReminders: true,
      nutritionReminders: true,
      recoveryReminders: true,
      achievementAlerts: true,
      communityUpdates: true,
    },
    privacySettings: {
      shareProgress: true,
      shareLocation: false,
      allowConnections: true,
      publicProfile: false,
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const totalSteps = 6;

  const updateProfile = (field: keyof UserProfile, value: any) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateNestedField = (parent: keyof UserProfile, field: string, value: any) => {
    setUserProfile(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return userProfile.name.length > 0 && 
               userProfile.email.length > 0 && 
               userProfile.password.length >= 8 &&
               userProfile.password === userProfile.confirmPassword;
      case 2:
        return userProfile.dateOfBirth.length > 0 && 
               userProfile.gender !== 'other' &&
               userProfile.height > 0 && 
               userProfile.weight > 0;
      case 3:
        return userProfile.experienceLevel !== 'beginner' ||
               (userProfile.weeklyTrainingDays > 0 && userProfile.averageWeeklyDistance > 0);
      case 4:
        return true; // Opcional
      case 5:
        return true; // Opcional
      case 6:
        return true; // Opcional
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      // Aqui você enviaria os dados para o backend
      Alert.alert(
        'Cadastro Completo!',
        'Seu perfil foi criado com sucesso. O AI Coach agora pode personalizar suas experiências!',
        [
          {
            text: 'Começar',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } else {
      Alert.alert('Erro', 'Por favor, complete todos os campos obrigatórios.');
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <View
          key={index}
          style={[
            styles.stepDot,
            index + 1 === currentStep && styles.activeStepDot,
            index + 1 < currentStep && styles.completedStepDot,
          ]}
        />
      ))}
      <Text style={styles.stepText}>
        Passo {currentStep} de {totalSteps}
      </Text>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Informações Básicas</Text>
      <Text style={styles.stepDescription}>
        Comece criando sua conta para acessar todas as funcionalidades
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Nome Completo *</Text>
        <TextInput
          style={styles.textInput}
          value={userProfile.name}
          onChangeText={(text) => updateProfile('name', text)}
          placeholder="Digite seu nome completo"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>E-mail *</Text>
        <TextInput
          style={styles.textInput}
          value={userProfile.email}
          onChangeText={(text) => updateProfile('email', text)}
          placeholder="seu@email.com"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Senha *</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.textInput, styles.passwordInput]}
            value={userProfile.password}
            onChangeText={(text) => updateProfile('password', text)}
            placeholder="Mínimo 8 caracteres"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Confirmar Senha *</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.textInput, styles.passwordInput]}
            value={userProfile.confirmPassword}
            onChangeText={(text) => updateProfile('confirmPassword', text)}
            placeholder="Confirme sua senha"
            placeholderTextColor="#999"
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Perfil Físico</Text>
      <Text style={styles.stepDescription}>
        Essas informações ajudam o AI Coach a personalizar seus treinos
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Data de Nascimento *</Text>
        <TextInput
          style={styles.textInput}
          value={userProfile.dateOfBirth}
          onChangeText={(text) => updateProfile('dateOfBirth', text)}
          placeholder="DD/MM/AAAA"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Gênero *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={userProfile.gender}
            onValueChange={(value) => updateProfile('gender', value)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione o gênero" value="other" />
            <Picker.Item label="Masculino" value="male" />
            <Picker.Item label="Feminino" value="female" />
          </Picker>
        </View>
      </View>

      <View style={styles.rowContainer}>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={styles.inputLabel}>Altura (cm) *</Text>
          <TextInput
            style={styles.textInput}
            value={userProfile.height.toString()}
            onChangeText={(text) => updateProfile('height', parseInt(text) || 0)}
            placeholder="170"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={styles.inputLabel}>Peso (kg) *</Text>
          <TextInput
            style={styles.textInput}
            value={userProfile.weight.toString()}
            onChangeText={(text) => updateProfile('weight', parseFloat(text) || 0)}
            placeholder="70.5"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.rowContainer}>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={styles.inputLabel}>% Gordura Corporal</Text>
          <TextInput
            style={styles.textInput}
            value={userProfile.bodyFatPercentage?.toString() || ''}
            onChangeText={(text) => updateProfile('bodyFatPercentage', parseFloat(text) || undefined)}
            placeholder="20"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={styles.inputLabel}>Massa Muscular (kg)</Text>
          <TextInput
            style={styles.textInput}
            value={userProfile.muscleMass?.toString() || ''}
            onChangeText={(text) => updateProfile('muscleMass', parseFloat(text) || undefined)}
            placeholder="45"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Experiência e Objetivos</Text>
      <Text style={styles.stepDescription}>
        Conte-nos sobre sua experiência e o que você quer alcançar
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Nível de Experiência *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={userProfile.experienceLevel}
            onValueChange={(value) => updateProfile('experienceLevel', value)}
            style={styles.picker}
          >
            <Picker.Item label="Iniciante" value="beginner" />
            <Picker.Item label="Intermediário" value="intermediate" />
            <Picker.Item label="Avançado" value="advanced" />
            <Picker.Item label="Expert" value="expert" />
          </Picker>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Objetivo Principal *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={userProfile.fitnessGoal}
            onValueChange={(value) => updateProfile('fitnessGoal', value)}
            style={styles.picker}
          >
            <Picker.Item label="Perda de Peso" value="weight_loss" />
            <Picker.Item label="Manutenção" value="maintenance" />
            <Picker.Item label="Ganho de Massa" value="muscle_gain" />
            <Picker.Item label="Resistência" value="endurance" />
            <Picker.Item label="Performance" value="performance" />
          </Picker>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Distância Preferida</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={userProfile.preferredDistance}
            onValueChange={(value) => updateProfile('preferredDistance', value)}
            style={styles.picker}
          >
            <Picker.Item label="5K" value="5k" />
            <Picker.Item label="10K" value="10k" />
            <Picker.Item label="Meia Maratona" value="half_marathon" />
            <Picker.Item label="Maratona" value="marathon" />
            <Picker.Item label="Ultra" value="ultra" />
          </Picker>
        </View>
      </View>

      <View style={styles.rowContainer}>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={styles.inputLabel}>Dias de Treino/Semana</Text>
          <TextInput
            style={styles.textInput}
            value={userProfile.weeklyTrainingDays.toString()}
            onChangeText={(text) => updateProfile('weeklyTrainingDays', parseInt(text) || 0)}
            placeholder="3"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={styles.inputLabel}>Distância Semanal (km)</Text>
          <TextInput
            style={styles.textInput}
            value={userProfile.averageWeeklyDistance.toString()}
            onChangeText={(text) => updateProfile('averageWeeklyDistance', parseFloat(text) || 0)}
            placeholder="15"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Histórico Médico</Text>
      <Text style={styles.stepDescription}>
        Essas informações ajudam a personalizar treinos seguros
      </Text>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Possui lesões atuais?</Text>
        <Switch
          value={userProfile.hasInjuries}
          onValueChange={(value) => updateProfile('hasInjuries', value)}
          trackColor={{ false: '#ddd', true: '#4CAF50' }}
          thumbColor={userProfile.hasInjuries ? '#fff' : '#f4f3f4'}
        />
      </View>

      {userProfile.hasInjuries && (
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Descreva suas lesões</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={userProfile.injuryHistory.join(', ')}
            onChangeText={(text) => updateProfile('injuryHistory', text.split(', ').filter(Boolean))}
            placeholder="Ex: Joelho direito, tornozelo esquerdo"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
          />
        </View>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Condições Crônicas</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          value={userProfile.chronicConditions.join(', ')}
          onChangeText={(text) => updateProfile('chronicConditions', text.split(', ').filter(Boolean))}
          placeholder="Ex: Asma, diabetes, hipertensão"
          placeholderTextColor="#999"
          multiline
          numberOfLines={2}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Medicamentos em Uso</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          value={userProfile.medications.join(', ')}
          onChangeText={(text) => updateProfile('medications', text.split(', ').filter(Boolean))}
          placeholder="Ex: Ventolin, insulina"
          placeholderTextColor="#999"
          multiline
          numberOfLines={2}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Alergias</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          value={userProfile.allergies.join(', ')}
          onChangeText={(text) => updateProfile('allergies', text.split(', ').filter(Boolean))}
          placeholder="Ex: Pólen, frutos do mar, medicamentos"
          placeholderTextColor="#999"
          multiline
          numberOfLines={2}
        />
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Preferências de Treino</Text>
      <Text style={styles.stepDescription}>
        Personalize sua experiência de treino
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Terreno Preferido</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={userProfile.preferredTerrain}
            onValueChange={(value) => updateProfile('preferredTerrain', value)}
            style={styles.picker}
          >
            <Picker.Item label="Plano" value="flat" />
            <Picker.Item label="Com subidas" value="hilly" />
            <Picker.Item label="Montanhoso" value="mountainous" />
            <Picker.Item label="Misto" value="mixed" />
          </Picker>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Horário Preferido</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={userProfile.preferredTime}
            onValueChange={(value) => updateProfile('preferredTime', value)}
            style={styles.picker}
          >
            <Picker.Item label="Manhã" value="morning" />
            <Picker.Item label="Tarde" value="afternoon" />
            <Picker.Item label="Noite" value="evening" />
            <Picker.Item label="Madrugada" value="night" />
          </Picker>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Condições Climáticas Preferidas</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          value={userProfile.weatherPreferences.join(', ')}
          onChangeText={(text) => updateProfile('weatherPreferences', text.split(', ').filter(Boolean))}
          placeholder="Ex: Sol, chuva leve, temperatura amena"
          placeholderTextColor="#999"
          multiline
          numberOfLines={2}
        />
      </View>

      <View style={styles.rowContainer}>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={styles.inputLabel}>Corrida Alvo</Text>
          <TextInput
            style={styles.textInput}
            value={userProfile.targetRace || ''}
            onChangeText={(text) => updateProfile('targetRace', text)}
            placeholder="Ex: São Silvestre 2024"
            placeholderTextColor="#999"
          />
        </View>

        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={styles.inputLabel}>Tempo Alvo</Text>
          <TextInput
            style={styles.textInput}
            value={userProfile.targetTime || ''}
            onChangeText={(text) => updateProfile('targetTime', text)}
            placeholder="Ex: 2h30min"
            placeholderTextColor="#999"
          />
        </View>
      </View>
    </View>
  );

  const renderStep6 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Configurações e Privacidade</Text>
      <Text style={styles.stepDescription}>
        Configure suas notificações e privacidade
      </Text>

      <View style={styles.sectionTitle}>
        <Text style={styles.sectionTitleText}>Notificações</Text>
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Lembretes de Treino</Text>
        <Switch
          value={userProfile.notificationPreferences.trainingReminders}
          onValueChange={(value) => updateNestedField('notificationPreferences', 'trainingReminders', value)}
          trackColor={{ false: '#ddd', true: '#4CAF50' }}
          thumbColor={userProfile.notificationPreferences.trainingReminders ? '#fff' : '#f4f3f4'}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Lembretes de Nutrição</Text>
        <Switch
          value={userProfile.notificationPreferences.nutritionReminders}
          onValueChange={(value) => updateNestedField('notificationPreferences', 'nutritionReminders', value)}
          trackColor={{ false: '#ddd', true: '#4CAF50' }}
          thumbColor={userProfile.notificationPreferences.nutritionReminders ? '#fff' : '#f4f3f4'}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Lembretes de Recuperação</Text>
        <Switch
          value={userProfile.notificationPreferences.recoveryReminders}
          onValueChange={(value) => updateNestedField('notificationPreferences', 'recoveryReminders', value)}
          trackColor={{ false: '#ddd', true: '#4CAF50' }}
          thumbColor={userProfile.notificationPreferences.recoveryReminders ? '#fff' : '#f4f3f4'}
        />
      </View>

      <View style={styles.sectionTitle}>
        <Text style={styles.sectionTitleText}>Privacidade</Text>
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Compartilhar Progresso</Text>
        <Switch
          value={userProfile.privacySettings.shareProgress}
          onValueChange={(value) => updateNestedField('privacySettings', 'shareProgress', value)}
          trackColor={{ false: '#ddd', true: '#4CAF50' }}
          thumbColor={userProfile.privacySettings.shareProgress ? '#fff' : '#f4f3f4'}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Compartilhar Localização</Text>
        <Switch
          value={userProfile.privacySettings.shareLocation}
          onValueChange={(value) => updateNestedField('privacySettings', 'shareLocation', value)}
          trackColor={{ false: '#ddd', true: '#4CAF50' }}
          thumbColor={userProfile.privacySettings.shareLocation ? '#fff' : '#f4f3f4'}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Permitir Conexões</Text>
        <Switch
          value={userProfile.privacySettings.allowConnections}
          onValueChange={(value) => updateNestedField('privacySettings', 'allowConnections', value)}
          trackColor={{ false: '#ddd', true: '#4CAF50' }}
          thumbColor={userProfile.privacySettings.allowConnections ? '#fff' : '#f4f3f4'}
        />
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      case 6:
        return renderStep6();
      default:
        return renderStep1();
    }
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Criar Conta</Text>
          <View style={styles.placeholder} />
        </View>

        {renderStepIndicator()}

        <View style={styles.content}>
          {renderCurrentStep()}
        </View>

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
              <Text style={styles.primaryButtonText}>Criar Conta</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  activeStepDot: {
    backgroundColor: '#fff',
    transform: [{ scale: 1.2 }],
  },
  completedStepDot: {
    backgroundColor: '#4CAF50',
  },
  stepText: {
    marginLeft: 15,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 25,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f8f9fa',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
  },
  passwordInput: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#333',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginRight: 15,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginLeft: currentStep > 1 ? 10 : 0,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginRight: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});