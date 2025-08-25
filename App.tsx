import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme, Theme as NavTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import { AuthProvider, useAuth } from './hooks/useAuth';
import type { RootStackParamList } from './types/navigation';
import WelcomeScreen from './screens/auth/WelcomeScreen';
import LoginScreen from './screens/auth/LoginScreen';
import SignupScreen from './screens/auth/SignupScreen';
import MainTabs from './screens/MainTabs';
import RunScreen from './screens/RunScreen';
import UpgradeScreen from './screens/UpgradeScreen';
import ConnectSpotifyScreen from './screens/ConnectSpotifyScreen';
import ConnectWatchScreen from './screens/ConnectWatchScreen';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { GateProvider } from './hooks/useGate';
import { setApiBaseUrl } from './lib/api';
import { API_BASE_URL } from './lib/config';
import RunSummaryScreen from './screens/RunSummaryScreen';
import RouteDetailScreen from './screens/routes/RouteDetailScreen';
import SavedRoutesScreen from './screens/routes/SavedRoutesScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootStack() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

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
        <GateProvider>
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