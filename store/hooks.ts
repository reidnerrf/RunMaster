import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Hooks tipados para uso em toda a aplicação
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Hooks especializados para cada slice
export const useUser = () => useAppSelector((state) => state.user);
export const useWorkout = () => useAppSelector((state) => state.workout);
export const useTheme = () => useAppSelector((state) => state.theme);
export const useWellness = () => useAppSelector((state) => state.wellness);
export const useCommunity = () => useAppSelector((state) => state.community);
export const useMentorship = () => useAppSelector((state) => state.mentorship);
export const useExplorer = () => useAppSelector((state) => state.explorer);
export const useNotification = () => useAppSelector((state) => state.notification);
export const usePayment = () => useAppSelector((state) => state.payment);
export const useGamification = () => useAppSelector((state) => state.gamification);

// Hooks para dados específicos do usuário
export const useCurrentUser = () => useAppSelector((state) => state.user.currentUser);
export const useUserStats = () => useAppSelector((state) => state.user.stats);
export const useUserPreferences = () => useAppSelector((state) => state.user.preferences);
export const useUserAuth = () => useAppSelector((state) => ({
  isAuthenticated: state.user.isAuthenticated,
  isLoading: state.user.isLoading,
  error: state.user.error,
}));

// Hooks para dados de treino
export const useCurrentWorkout = () => useAppSelector((state) => state.workout.currentSession);
export const useWorkoutHistory = () => useAppSelector((state) => state.workout.sessions);
export const useWorkoutStats = () => useAppSelector((state) => state.workout.stats);
export const useWorkoutGoals = () => useAppSelector((state) => state.workout.goals);

// Hooks para tema
export const useCurrentTheme = () => useAppSelector((state) => state.theme.currentMode);
export const useThemeConfig = () => useAppSelector((state) => state.theme.currentTheme);
export const useAutoTheme = () => useAppSelector((state) => state.theme.isAutoThemeEnabled);

// Hooks para wellness
export const useNutritionPlan = () => useAppSelector((state) => state.wellness.currentNutritionPlan);
export const useHydrationReminders = () => useAppSelector((state) => state.wellness.hydrationReminders);
export const useSupplementRecommendations = () => useAppSelector((state) => state.wellness.supplementRecommendations);

// Hooks para comunidade
export const useCurrentCommunity = () => useAppSelector((state) => state.community.currentCommunity);
export const useCommunityMemberships = () => useAppSelector((state) => state.community.memberships);
export const useCommunityChallenges = () => useAppSelector((state) => state.community.challenges);

// Hooks para mentoria
export const useCurrentMentor = () => useAppSelector((state) => state.mentorship.currentMentor);
export const useMentorshipSubscriptions = () => useAppSelector((state) => state.mentorship.subscriptions);
export const useMentorshipSessions = () => useAppSelector((state) => state.mentorship.sessions);

// Hooks para explorador
export const useExplorerSession = () => useAppSelector((state) => state.explorer.activeSession);
export const useDiscoveredPoints = () => useAppSelector((state) => state.explorer.discoveredPoints);
export const useExplorerAchievements = () => useAppSelector((state) => state.explorer.achievements);

// Hooks para notificações
export const useNotificationTemplates = () => useAppSelector((state) => state.notification.templates);
export const useUserNotifications = () => useAppSelector((state) => state.notification.userNotifications);
export const useNotificationPreferences = () => useAppSelector((state) => state.notification.userPreferences);

// Hooks para pagamentos
export const usePaymentMethods = () => useAppSelector((state) => state.payment.paymentMethods);
export const usePaymentTransactions = () => useAppSelector((state) => state.payment.transactions);
export const usePaymentSubscriptions = () => useAppSelector((state) => state.payment.subscriptions);
export const usePaymentPlans = () => useAppSelector((state) => state.payment.plans);

// Hooks para gamificação
export const useAchievements = () => useAppSelector((state) => state.gamification.achievements);
export const useUserProfile = () => useAppSelector((state) => state.gamification.currentUserProfile);
export const useQuests = () => useAppSelector((state) => state.gamification.quests);
export const useLeaderboards = () => useAppSelector((state) => state.gamification.leaderboards);

// Hooks para estados de loading
export const useLoadingStates = () => useAppSelector((state) => ({
  user: state.user.isLoading,
  workout: state.workout.isLoading,
  theme: state.theme.isLoading,
  wellness: state.wellness.isLoading,
  community: state.community.isLoading,
  mentorship: state.mentorship.isLoading,
  explorer: state.explorer.isLoading,
  notification: state.notification.isLoading,
  payment: state.payment.isLoading,
  gamification: state.gamification.isLoading,
}));

// Hooks para erros
export const useErrorStates = () => useAppSelector((state) => ({
  user: state.user.error,
  workout: state.workout.error,
  theme: state.theme.error,
  wellness: state.wellness.error,
  community: state.community.error,
  mentorship: state.mentorship.error,
  explorer: state.explorer.error,
  notification: state.notification.error,
  payment: state.payment.error,
  gamification: state.gamification.error,
}));

// Hooks para mudanças pendentes
export const usePendingChanges = () => useAppSelector((state) => ({
  user: state.user.pendingChanges,
  workout: state.workout.pendingChanges,
  theme: state.theme.pendingChanges,
  wellness: state.wellness.pendingChanges,
  community: state.community.pendingChanges,
  mentorship: state.mentorship.pendingChanges,
  explorer: state.explorer.pendingChanges,
  notification: state.notification.pendingChanges,
  payment: state.payment.pendingChanges,
  gamification: state.gamification.pendingChanges,
}));

// Hooks para sincronização
export const useSyncStatus = () => useAppSelector((state) => ({
  user: state.user.syncStatus,
  workout: state.workout.syncStatus,
  theme: state.theme.syncStatus,
  wellness: state.wellness.syncStatus,
  community: state.community.syncStatus,
  mentorship: state.mentorship.syncStatus,
  explorer: state.explorer.syncStatus,
  notification: state.notification.syncStatus,
  payment: state.payment.syncStatus,
  gamification: state.gamification.syncStatus,
}));

// Hooks para estatísticas gerais
export const useAppStats = () => useAppSelector((state) => ({
  totalUsers: state.gamification.stats?.totalUsers || 0,
  totalAchievements: state.gamification.achievements.length,
  totalQuests: state.gamification.quests.length,
  totalCommunities: state.community.communities.length,
  totalMentors: state.mentorship.mentors.length,
  totalExplorerRoutes: state.explorer.routes.length,
  totalNotifications: state.notification.userNotifications.length,
  totalTransactions: state.payment.transactions.length,
  totalWorkouts: state.workout.sessions.length,
}));

// Hooks para dados específicos do usuário atual
export const useUserAchievements = () => {
  const userProfile = useUserProfile();
  const achievements = useAchievements();
  
  return achievements.filter(achievement => 
    userProfile?.achievements.includes(achievement.id)
  );
};

export const useUserQuests = () => {
  const userProfile = useUserProfile();
  const quests = useQuests();
  
  if (!userProfile) return { active: [], completed: [] };
  
  return {
    active: quests.filter(quest => 
      quest.isActive && !quest.progress.isCompleted
    ),
    completed: quests.filter(quest => 
      quest.progress.isCompleted
    ),
  };
};

export const useUserCommunityMemberships = () => {
  const user = useCurrentUser();
  const memberships = useCommunityMemberships();
  
  if (!user) return [];
  
  return memberships.filter(membership => 
    membership.userId === user.id
  );
};

export const useUserMentorshipSubscriptions = () => {
  const user = useCurrentUser();
  const subscriptions = useMentorshipSubscriptions();
  
  if (!user) return [];
  
  return subscriptions.filter(subscription => 
    subscription.userId === user.id
  );
};

export const useUserPaymentMethods = () => {
  const user = useCurrentUser();
  const paymentMethods = usePaymentMethods();
  
  if (!user) return [];
  
  return paymentMethods.filter(method => 
    method.userId === user.id
  );
};

export const useUserWorkoutStats = () => {
  const user = useCurrentUser();
  const workoutStats = useWorkoutStats();
  
  if (!user) return null;
  
  return workoutStats.find(stats => 
    stats.userId === user.id
  );
};

// Hooks para validação de dados
export const useDataValidation = () => {
  const user = useCurrentUser();
  const workout = useCurrentWorkout();
  const theme = useCurrentTheme();
  
  return {
    hasValidUser: !!user && !!user.id,
    hasValidWorkout: !workout || !!workout.id,
    hasValidTheme: ['light', 'dark', 'auto', 'custom'].includes(theme),
    isValid: !!user && !!user.id && (!workout || !!workout.id) && ['light', 'dark', 'auto', 'custom'].includes(theme),
  };
};

// Hooks para performance
export const usePerformanceMetrics = () => {
  const workout = useCurrentWorkout();
  const explorer = useExplorerSession();
  const payment = useAppSelector((state) => state.payment.processingPayment);
  
  return {
    hasActiveWorkout: !!workout,
    hasActiveExplorer: !!explorer,
    isProcessingPayment: payment,
    hasActiveProcesses: !!(workout || explorer || payment),
  };
};

// Hooks para notificações em tempo real
export const useRealTimeUpdates = () => {
  const workout = useCurrentWorkout();
  const explorer = useExplorerSession();
  const notifications = useUserNotifications();
  
  return {
    hasWorkoutUpdates: !!workout?.lastUpdate,
    hasExplorerUpdates: !!explorer?.lastUpdate,
    hasNewNotifications: notifications.some(n => !n.isRead),
    lastUpdate: Math.max(
      workout?.lastUpdate ? new Date(workout.lastUpdate).getTime() : 0,
      explorer?.lastUpdate ? new Date(explorer.lastUpdate).getTime() : 0,
      notifications.length > 0 ? new Date(notifications[0].createdAt).getTime() : 0
    ),
  };
};

// Hooks para configurações da aplicação
export const useAppSettings = () => {
  const theme = useTheme();
  const user = useUser();
  const notification = useNotification();
  
  return {
    theme: {
      mode: theme.currentMode,
      isAuto: theme.isAutoThemeEnabled,
      custom: theme.customTheme,
    },
    user: {
      isAuthenticated: user.isAuthenticated,
      hasProfile: !!user.currentUser,
      preferences: user.preferences,
    },
    notification: {
      isEnabled: notification.isEnabled,
      preferences: notification.userPreferences,
    },
  };
};

// Hooks para dados offline
export const useOfflineData = () => {
  const pendingChanges = usePendingChanges();
  const syncStatus = useSyncStatus();
  
  const totalPending = Object.values(pendingChanges).reduce(
    (total, changes) => total + changes.length, 
    0
  );
  
  const hasOfflineChanges = totalPending > 0;
  const isSyncing = Object.values(syncStatus).some(status => status === 'syncing');
  
  return {
    hasOfflineChanges,
    isSyncing,
    totalPending,
    pendingBySlice: pendingChanges,
    syncStatusBySlice: syncStatus,
  };
};

export default {
  useAppDispatch,
  useAppSelector,
  useUser,
  useWorkout,
  useTheme,
  useWellness,
  useCommunity,
  useMentorship,
  useExplorer,
  useNotification,
  usePayment,
  useGamification,
};