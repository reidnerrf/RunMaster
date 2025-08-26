import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme, Theme as NavTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import { AuthProvider, useAuth } from './hooks/useAuth';
import type { RootStackParamList } from './Types/Navigation';
import WelcomeScreen from './Screens/auth/WelcomeScreen';
import LoginScreen from './Screens/auth/LoginScreen';
import SignupScreen from './Screens/auth/SignupScreen';
import MainTabs from './Screens/MainTabs';
import RunScreen from './Screens/RunScreen';
import UpgradeScreen from './Screens/UpgradeScreen';
import ConnectSpotifyScreen from './Screens/ConnectSpotifyScreen';
import ConnectWatchScreen from './Screens/ConnectWatchScreen';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { GateProvider } from './hooks/useGate';
import { setApiBaseUrl } from './Lib/api';
import { API_BASE_URL } from './Lib/config';
import RunSummaryScreen from './Screens/RunSummaryScreen';
import RouteDetailScreen from './Screens/routes/RouteDetailScreen';
import SavedRoutesScreen from './Screens/routes/SavedRoutesScreen';
import { identify, funnelStep } from './Lib/analytics';
import { initObservability, trackEvent } from './Lib/observability';
import { iapSetup } from './Lib/iap';

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootStack() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  React.useEffect(() => {
    funnelStep('app_open');
  }, []);

  React.useEffect(() => {
    if (user?.id) identify(user.id);
  }, [user?.id]);

  if (loading) {
    return <View style={[styles.container, { backgroundColor: theme.colors.background }]} />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Run" component={RunScreen} />
          <Stack.Screen name="RunSummary" component={RunSummaryScreen} />
          <Stack.Screen name="RouteDetail" component={RouteDetailScreen} />
          <Stack.Screen name="SavedRoutes" component={SavedRoutesScreen} />
          <Stack.Screen name="Upgrade" component={UpgradeScreen} />
          <Stack.Screen name="ConnectSpotify" component={ConnectSpotifyScreen} />
          <Stack.Screen name="ConnectWatch" component={ConnectWatchScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Auth">
            {() => (
              <AuthStackScreens />
            )}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
}

function AuthStackScreens() {
  // Small nested stack for auth screens
  const AuthStack = createNativeStackNavigator();
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

export default function App() {
  React.useEffect(() => {
    setApiBaseUrl(API_BASE_URL);
  }, []);

  React.useEffect(() => {
    initObservability({ SENTRY_DSN: process.env.SENTRY_DSN as any, AMPLITUDE_API_KEY: process.env.AMPLITUDE_API_KEY as any }).catch(() => {});
    trackEvent('app_open');
    iapSetup(process.env.REVENUECAT_API_KEY as any).catch(() => {});
  }, []);

  return (
    <SafeAreaProvider style={styles.container}>
      <Toaster />
      <AuthProvider>
        <ThemeProvider>
          <ThemedNavigation />
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function ThemedNavigation() {
  const { theme, mode } = useTheme() as any;
  const navTheme: NavTheme = {
    ...DefaultTheme,
    dark: mode === 'dark',
    colors: {
      ...DefaultTheme.colors,
      background: theme.colors.background,
      card: theme.colors.card,
      border: theme.colors.border,
      text: theme.colors.text,
      primary: theme.colors.primary,
      notification: theme.colors.secondary,
    },
  };
  return (
    <NavigationContainer theme={navTheme}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <GateProvider group={'beta-planner'}>
          <RootStack />
        </GateProvider>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    userSelect: 'none' as const,
  },
});