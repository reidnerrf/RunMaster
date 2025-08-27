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
import { createWellnessManager, NutritionPlan, NutritionMeal, HydrationReminder } from '../Lib/wellness';

const wellnessManager = createWellnessManager();
const { width } = Dimensions.get('window');

export default function WellnessScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<'nutrition' | 'hydration' | 'supplements' | 'rest' | 'progress'>('nutrition');
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [hydrationReminders, setHydrationReminders] = useState<HydrationReminder[]>([]);
  const [userProfile, setUserProfile] = useState({
    gender: 'male',
    age: 30,
    weight: 70,
    height: 175,
    activityLevel: 'moderate',
    fitnessGoal: 'maintenance',
  });
  const [workoutSession, setWorkoutSession] = useState({
    duration: 45,
    intensity: 'moderate',
    caloriesBurned: 450,
    distance: 8.5,
    pace: '5:18',
  });
  const [showMealModal, setShowMealModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<NutritionMeal | null>(null);
  const [completedMeals, setCompletedMeals] = useState<string[]>([]);
  const [completedHydration, setCompletedHydration] = useState<number>(0);
  const [dailyProgress, setDailyProgress] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    hydration: 0,
  });

  const activityLevels = ['sedentary', 'light', 'moderate', 'active', 'very_active'];
  const fitnessGoals = ['weight_loss', 'maintenance', 'muscle_gain', 'endurance', 'performance'];

  useEffect(() => {
    loadWellnessData();
    generateDailyPlan();
  }, []);

  const loadWellnessData = () => {
    // Simular dados do usuário
    const profile = wellnessManager.createUserProfile({
      gender: 'male',
      age: 30,
      weight: 70,
      height: 175,
      activityLevel: 'moderate',
      fitnessGoal: 'maintenance',
    });

    const workout = wellnessManager.recordWorkoutSession({
      userId: 'current_user',
      type: 'running',
      duration: 45,
      intensity: 'moderate',
      distance: 8.5,
      caloriesBurned: 450,
      heartRate: { average: 145, max: 175 },
      terrain: 'mixed',
      weather: 'sunny',
      date: Date.now(),
    });

    setUserProfile(profile);
    setWorkoutSession(workout);
  };

  const generateDailyPlan = () => {
    const plan = wellnessManager.generateDailyNutritionPlan('current_user', Date.now());
    if (plan) {
      setNutritionPlan(plan);
      setHydrationReminders(plan.hydrationReminders);
    }
  };

  const completeMeal = (mealType: string) => {
    if (!nutritionPlan) return;

    const success = wellnessManager.completeMeal(nutritionPlan.id, mealType);
    if (success) {
      setCompletedMeals(prev => [...prev, mealType]);
      updateDailyProgress();
      Alert.alert('Refeição Registrada!', 'Ótimo trabalho mantendo sua nutrição em dia!');
    }
  };

  const completeHydration = (reminderId: string, amount: number) => {
    if (!nutritionPlan) return;

    const success = wellnessManager.completeHydration(nutritionPlan.id, reminderId, amount);
    if (success) {
      setCompletedHydration(prev => prev + amount);
      updateDailyProgress();
      Alert.alert('Hidratação Registrada!', 'Continue se hidratando!');
    }
  };

  const updateDailyProgress = () => {
    if (!nutritionPlan) return;

    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fats = 0;

    nutritionPlan.meals.forEach(meal => {
      if (completedMeals.includes(meal.type)) {
        calories += meal.calories;
        protein += meal.protein;
        carbs += meal.carbs;
        fats += meal.fats;
      }
    });

    setDailyProgress({
      calories,
      protein,
      carbs,
      fats,
      hydration: completedHydration,
    });
  };

  const getGenderBasedRecommendations = () => {
    const recommendations = wellnessManager.getUserRecommendations('current_user');
    return recommendations;
  };

  const renderNutritionCard = ({ item }: { item: NutritionMeal }) => {
    const isCompleted = completedMeals.includes(item.type);
    const progress = (dailyProgress.calories / nutritionPlan!.totalCalories) * 100;

    return (
      <TouchableOpacity
        style={[styles.mealCard, isCompleted && styles.completedMealCard]}
        onPress={() => {
          setSelectedMeal(item);
          setShowMealModal(true);
        }}
      >
        <View style={styles.mealHeader}>
          <View style={styles.mealInfo}>
            <Text style={styles.mealType}>{item.type}</Text>
            <Text style={styles.mealTime}>{item.timing}</Text>
          </View>
          <View style={styles.mealStatus}>
            {isCompleted ? (
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            ) : (
              <Ionicons name="ellipse-outline" size={24} color="#ccc" />
            )}
          </View>
        </View>

        <View style={styles.mealNutrition}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{item.calories}</Text>
            <Text style={styles.nutritionLabel}>kcal</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{item.protein}g</Text>
            <Text style={styles.nutritionLabel}>Proteína</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{item.carbs}g</Text>
            <Text style={styles.nutritionLabel}>Carboidratos</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>{item.fats}g</Text>
            <Text style={styles.nutritionLabel}>Gorduras</Text>
          </View>
        </View>

        <View style={styles.mealIngredients}>
          <Text style={styles.ingredientsTitle}>Ingredientes principais:</Text>
          <View style={styles.ingredientsList}>
            {item.ingredients.slice(0, 3).map((ingredient, index) => (
              <Text key={index} style={styles.ingredientText}>
                • {ingredient.name} ({ingredient.amount})
              </Text>
            ))}
            {item.ingredients.length > 3 && (
              <Text style={styles.moreIngredients}>+{item.ingredients.length - 3} mais</Text>
            )}
          </View>
        </View>

        {!isCompleted && (
          <TouchableOpacity
            style={styles.completeMealButton}
            onPress={() => completeMeal(item.type)}
          >
            <Text style={styles.completeMealButtonText}>Marcar como Completa</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const renderHydrationReminder = ({ item }: { item: HydrationReminder }) => {
    const isCompleted = completedHydration >= item.targetAmount;

    return (
      <View style={[styles.hydrationCard, isCompleted && styles.completedHydrationCard]}>
        <View style={styles.hydrationHeader}>
          <Ionicons name="water" size={24} color="#2196F3" />
          <View style={styles.hydrationInfo}>
            <Text style={styles.hydrationTitle}>{item.title}</Text>
            <Text style={styles.hydrationTime}>{item.timing}</Text>
          </View>
          <View style={styles.hydrationStatus}>
            {isCompleted ? (
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            ) : (
              <Ionicons name="ellipse-outline" size={24} color="#ccc" />
            )}
          </View>
        </View>

        <View style={styles.hydrationProgress}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${Math.min((completedHydration / item.targetAmount) * 100, 100)}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {completedHydration}ml / {item.targetAmount}ml
          </Text>
        </View>

        <Text style={styles.hydrationDescription}>{item.description}</Text>

        {!isCompleted && (
          <View style={styles.hydrationActions}>
            <TouchableOpacity
              style={styles.hydrationButton}
              onPress={() => completeHydration(item.id, 250)}
            >
              <Text style={styles.hydrationButtonText}>+250ml</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.hydrationButton}
              onPress={() => completeHydration(item.id, 500)}
            >
              <Text style={styles.hydrationButtonText}>+500ml</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'nutrition':
        return (
          <View style={styles.tabContent}>
            <View style={styles.nutritionHeader}>
              <View style={styles.caloriesCard}>
                <Text style={styles.caloriesTitle}>Calorias Diárias</Text>
                <View style={styles.caloriesProgress}>
                  <Text style={styles.caloriesValue}>{dailyProgress.calories}</Text>
                  <Text style={styles.caloriesTotal}>/ {nutritionPlan?.totalCalories || 0}</Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${Math.min((dailyProgress.calories / (nutritionPlan?.totalCalories || 1)) * 100, 100)}%` }
                    ]} 
                  />
                </View>
              </View>

              <View style={styles.macrosGrid}>
                <View style={styles.macroCard}>
                  <Text style={styles.macroValue}>{dailyProgress.protein}g</Text>
                  <Text style={styles.macroLabel}>Proteína</Text>
                  <Text style={styles.macroTarget}>Meta: {nutritionPlan?.targetProtein || 0}g</Text>
                </View>
                <View style={styles.macroCard}>
                  <Text style={styles.macroValue}>{dailyProgress.carbs}g</Text>
                  <Text style={styles.macroLabel}>Carboidratos</Text>
                  <Text style={styles.macroTarget}>Meta: {nutritionPlan?.targetCarbs || 0}g</Text>
                </View>
                <View style={styles.macroCard}>
                  <Text style={styles.macroValue}>{dailyProgress.fats}g</Text>
                  <Text style={styles.macroLabel}>Gorduras</Text>
                  <Text style={styles.macroTarget}>Meta: {nutritionPlan?.targetFats || 0}g</Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Refeições do Dia</Text>
            {nutritionPlan && (
              <FlatList
                data={nutritionPlan.meals}
                renderItem={renderNutritionCard}
                keyExtractor={(item) => item.type}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.mealsList}
              />
            )}
          </View>
        );

      case 'hydration':
        return (
          <View style={styles.tabContent}>
            <View style={styles.hydrationHeader}>
              <View style={styles.hydrationSummary}>
                <Ionicons name="water" size={48} color="#2196F3" />
                <Text style={styles.hydrationTitle}>Hidratação Diária</Text>
                <View style={styles.hydrationProgress}>
                  <Text style={styles.hydrationValue}>{completedHydration}ml</Text>
                  <Text style={styles.hydrationTotal}>/ {nutritionPlan?.targetHydration || 0}ml</Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${Math.min((completedHydration / (nutritionPlan?.targetHydration || 1)) * 100, 100)}%` }
                    ]} 
                  />
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Lembretes de Hidratação</Text>
            {hydrationReminders && (
              <FlatList
                data={hydrationReminders}
                renderItem={renderHydrationReminder}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.hydrationList}
              />
            )}
          </View>
        );

      case 'supplements':
        return (
          <View style={styles.tabContent}>
            <View style={styles.supplementsHeader}>
              <Text style={styles.sectionTitle}>Suplementos Recomendados</Text>
              <Text style={styles.sectionSubtitle}>
                Baseado no seu perfil ({userProfile.gender === 'male' ? 'masculino' : 'feminino'}) e treino
              </Text>
            </View>

            <View style={styles.supplementCards}>
              <View style={styles.supplementCard}>
                <View style={styles.supplementIcon}>
                  <Ionicons name="fitness" size={32} color="#FF9800" />
                </View>
                <View style={styles.supplementInfo}>
                  <Text style={styles.supplementName}>Proteína Whey</Text>
                  <Text style={styles.supplementDescription}>
                    Ideal para recuperação muscular pós-treino
                  </Text>
                  <Text style={styles.supplementDosage}>Dosagem: 20-30g pós-treino</Text>
                </View>
              </View>

              <View style={styles.supplementCard}>
                <View style={styles.supplementIcon}>
                  <Ionicons name="leaf" size={32} color="#4CAF50" />
                </View>
                <View style={styles.supplementInfo}>
                  <Text style={styles.supplementName}>Creatina</Text>
                  <Text style={styles.supplementDescription}>
                    Melhora performance e força muscular
                  </Text>
                  <Text style={styles.supplementDosage}>Dosagem: 5g/dia</Text>
                </View>
              </View>

              <View style={styles.supplementCard}>
                <View style={styles.supplementIcon}>
                  <Ionicons name="heart" size={32} color="#F44336" />
                </View>
                <View style={styles.supplementInfo}>
                  <Text style={styles.supplementName}>Ômega-3</Text>
                  <Text style={styles.supplementDescription}>
                    Suporte cardiovascular e anti-inflamatório
                  </Text>
                  <Text style={styles.supplementDosage}>Dosagem: 1-2g/dia</Text>
                </View>
              </View>

              {userProfile.gender === 'female' && (
                <View style={styles.supplementCard}>
                  <View style={styles.supplementIcon}>
                    <Ionicons name="medical" size={32} color="#9C27B0" />
                  </View>
                  <View style={styles.supplementInfo}>
                    <Text style={styles.supplementName}>Ferro + Vitamina D</Text>
                    <Text style={styles.supplementDescription}>
                      Suporte específico para mulheres ativas
                    </Text>
                    <Text style={styles.supplementDosage}>Dosagem: Conforme prescrição</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        );

      case 'rest':
        return (
          <View style={styles.tabContent}>
            <View style={styles.restHeader}>
              <Ionicons name="bed" size={64} color="#9C27B0" />
              <Text style={styles.restTitle}>Recuperação e Descanso</Text>
              <Text style={styles.restSubtitle}>
                Recomendações personalizadas para otimizar sua recuperação
              </Text>
            </View>

            <View style={styles.restRecommendations}>
              <View style={styles.restCard}>
                <Text style={styles.restCardTitle}>Sono Recomendado</Text>
                <Text style={styles.restCardValue}>7-9 horas</Text>
                <Text style={styles.restCardDescription}>
                  Baseado no seu treino de hoje ({workoutSession.duration}min, {workoutSession.caloriesBurned} kcal)
                </Text>
              </View>

              <View style={styles.restCard}>
                <Text style={styles.restCardTitle}>Tempo de Recuperação</Text>
                <Text style={styles.restCardValue}>24-48 horas</Text>
                <Text style={styles.restCardDescription}>
                  Para treinos de intensidade {workoutSession.intensity}
                </Text>
              </View>

              <View style={styles.restCard}>
                <Text style={styles.restCardTitle}>Alongamento</Text>
                <Text style={styles.restCardValue}>15-20 min</Text>
                <Text style={styles.restCardDescription}>
                  Foco em quadríceps, isquiotibiais e panturrilhas
                </Text>
              </View>

              {userProfile.gender === 'female' && (
                <View style={styles.restCard}>
                  <Text style={styles.restCardTitle}>Considerações Hormonais</Text>
                  <Text style={styles.restCardValue}>Fase Folicular</Text>
                  <Text style={styles.restCardDescription}>
                    Período ideal para treinos de alta intensidade
                  </Text>
                </View>
              )}
            </View>
          </View>
        );

      case 'progress':
        return (
          <View style={styles.tabContent}>
            <View style={styles.progressHeader}>
              <Text style={styles.sectionTitle}>Seu Progresso de Bem-estar</Text>
              <Text style={styles.sectionSubtitle}>
                Acompanhe sua evolução nutricional e de hidratação
              </Text>
            </View>

            <View style={styles.progressStats}>
              <View style={styles.progressCard}>
                <Text style={styles.progressCardTitle}>Meta de Calorias</Text>
                <Text style={styles.progressCardValue}>
                  {Math.round((dailyProgress.calories / (nutritionPlan?.totalCalories || 1)) * 100)}%
                </Text>
                <Text style={styles.progressCardSubtitle}>
                  {dailyProgress.calories} / {nutritionPlan?.totalCalories || 0} kcal
                </Text>
              </View>

              <View style={styles.progressCard}>
                <Text style={styles.progressCardTitle}>Hidratação</Text>
                <Text style={styles.progressCardValue}>
                  {Math.round((completedHydration / (nutritionPlan?.targetHydration || 1)) * 100)}%
                </Text>
                <Text style={styles.progressCardSubtitle}>
                  {completedHydration} / {nutritionPlan?.targetHydration || 0} ml
                </Text>
              </View>

              <View style={styles.progressCard}>
                <Text style={styles.progressCardTitle}>Refeições</Text>
                <Text style={styles.progressCardValue}>
                  {Math.round((completedMeals.length / (nutritionPlan?.meals.length || 1)) * 100)}%
                </Text>
                <Text style={styles.progressCardSubtitle}>
                  {completedMeals.length} / {nutritionPlan?.meals.length || 0} completas
                </Text>
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
        <Text style={styles.headerTitle}>Bem-estar</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'nutrition' && styles.activeTab]}
          onPress={() => setActiveTab('nutrition')}
        >
          <Ionicons 
            name="restaurant" 
            size={20} 
            color={activeTab === 'nutrition' ? '#667eea' : '#666'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'nutrition' && styles.activeTabText
          ]}>
            Nutrição
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'hydration' && styles.activeTab]}
          onPress={() => setActiveTab('hydration')}
        >
          <Ionicons 
            name="water" 
            size={20} 
            color={activeTab === 'hydration' ? '#667eea' : '#666'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'hydration' && styles.activeTabText
          ]}>
            Hidratação
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'supplements' && styles.activeTab]}
          onPress={() => setActiveTab('supplements')}
        >
          <Ionicons 
            name="medical" 
            size={20} 
            color={activeTab === 'supplements' ? '#667eea' : '#666'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'supplements' && styles.activeTabText
          ]}>
            Suplementos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'rest' && styles.activeTab]}
          onPress={() => setActiveTab('rest')}
        >
          <Ionicons 
            name="bed" 
            size={20} 
            color={activeTab === 'rest' ? '#667eea' : '#666'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'rest' && styles.activeTabText
          ]}>
            Descanso
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'progress' && styles.activeTab]}
          onPress={() => setActiveTab('progress')}
        >
          <Ionicons 
            name="trending-up" 
            size={20} 
            color={activeTab === 'progress' ? '#667eea' : '#666'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'progress' && styles.activeTabText
          ]}>
            Progresso
          </Text>
        </TouchableOpacity>
      </View>

      {renderTabContent()}

      {/* Modal de Detalhes da Refeição */}
      <Modal
        visible={showMealModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMealModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalhes da Refeição</Text>
              <TouchableOpacity
                onPress={() => setShowMealModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedMeal && (
              <ScrollView style={styles.modalBody}>
                <Text style={styles.modalMealType}>{selectedMeal.type}</Text>
                <Text style={styles.modalMealTime}>{selectedMeal.timing}</Text>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Informações Nutricionais</Text>
                  <View style={styles.nutritionGrid}>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>Calorias</Text>
                      <Text style={styles.nutritionValue}>{selectedMeal.calories} kcal</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>Proteína</Text>
                      <Text style={styles.nutritionValue}>{selectedMeal.protein}g</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>Carboidratos</Text>
                      <Text style={styles.nutritionValue}>{selectedMeal.carbs}g</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                      <Text style={styles.nutritionLabel}>Gorduras</Text>
                      <Text style={styles.nutritionValue}>{selectedMeal.fats}g</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Ingredientes</Text>
                  {selectedMeal.ingredients.map((ingredient, index) => (
                    <View key={index} style={styles.ingredientItem}>
                      <Text style={styles.ingredientName}>{ingredient.name}</Text>
                      <Text style={styles.ingredientAmount}>{ingredient.amount}</Text>
                      <Text style={styles.ingredientCalories}>{ingredient.calories} kcal</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Instruções</Text>
                  <Text style={styles.instructionsText}>{selectedMeal.instructions}</Text>
                </View>

                {!completedMeals.includes(selectedMeal.type) && (
                  <TouchableOpacity
                    style={styles.completeMealModalButton}
                    onPress={() => {
                      completeMeal(selectedMeal.type);
                      setShowMealModal(false);
                    }}
                  >
                    <Text style={styles.completeMealModalButtonText}>Marcar como Completa</Text>
                  </TouchableOpacity>
                )}
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
    paddingVertical: 8,
    borderRadius: 21,
  },
  activeTab: {
    backgroundColor: '#f0f0f0',
  },
  tabText: {
    marginLeft: 4,
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
  nutritionHeader: {
    marginBottom: 24,
  },
  caloriesCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  caloriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  caloriesProgress: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  caloriesValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#667eea',
  },
  caloriesTotal: {
    fontSize: 18,
    color: '#666',
    marginLeft: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  macrosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  macroValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  macroTarget: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  mealsList: {
    paddingBottom: 20,
  },
  mealCard: {
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
  completedMealCard: {
    backgroundColor: '#f8f9fa',
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mealInfo: {
    flex: 1,
  },
  mealType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  mealTime: {
    fontSize: 14,
    color: '#666',
  },
  mealStatus: {
    alignItems: 'center',
  },
  mealNutrition: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
  },
  mealIngredients: {
    marginBottom: 16,
  },
  ingredientsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  ingredientsList: {
    marginLeft: 8,
  },
  ingredientText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  moreIngredients: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '500',
    fontStyle: 'italic',
  },
  completeMealButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  completeMealButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  hydrationHeader: {
    marginBottom: 24,
  },
  hydrationSummary: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  hydrationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 16,
  },
  hydrationProgress: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  hydrationValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  hydrationTotal: {
    fontSize: 18,
    color: '#666',
    marginLeft: 8,
  },
  hydrationList: {
    paddingBottom: 20,
  },
  hydrationCard: {
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
  completedHydrationCard: {
    backgroundColor: '#f8f9fa',
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  hydrationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  hydrationInfo: {
    flex: 1,
    marginLeft: 16,
  },
  hydrationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  hydrationTime: {
    fontSize: 14,
    color: '#666',
  },
  hydrationStatus: {
    alignItems: 'center',
  },
  hydrationProgress: {
    marginBottom: 16,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  hydrationDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  hydrationActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  hydrationButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  hydrationButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  supplementsHeader: {
    marginBottom: 24,
  },
  supplementCards: {
    marginBottom: 20,
  },
  supplementCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  supplementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  supplementInfo: {
    flex: 1,
  },
  supplementName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  supplementDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  supplementDosage: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '500',
  },
  restHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  restTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  restSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  restRecommendations: {
    marginBottom: 20,
  },
  restCard: {
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
  restCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  restCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9C27B0',
    marginBottom: 8,
  },
  restCardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  progressHeader: {
    marginBottom: 24,
  },
  progressStats: {
    marginBottom: 20,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressCardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  progressCardSubtitle: {
    fontSize: 14,
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
  modalMealType: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalMealTime: {
    fontSize: 16,
    color: '#666',
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
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 16,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  ingredientName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  ingredientAmount: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 16,
  },
  ingredientCalories: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '500',
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  completeMealModalButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  completeMealModalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});