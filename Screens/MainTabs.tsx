import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BarChart2, Dumbbell, Home as HomeIcon, Lock, User, Users, Heart, MapPin, CloudSun } from 'lucide-react-native';
import React from 'react';
import { Animated, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import type { MainTabParamList } from '../Types/Navigation';
const HomeScreen = React.lazy(() => import('./home/HomeScreen'));
const ProfileScreen = React.lazy(() => import('./profile/ProfileScreen'));
const SocialScreen = React.lazy(() => import('./Social/SocialScreen'));
const StatsScreen = React.lazy(() => import('./stats/StatsScreen'));
const WorkoutsScreen = React.lazy(() => import('./workouts/WorkoutScreen'));
const WellnessScreen = React.lazy(() => import('./WellnessScreen'));
const CommunityScreen = React.lazy(() => import('./CommunityScreen'));
const MentorshipScreen = React.lazy(() => import('./MentorshipScreen'));
const ExplorerScreen = React.lazy(() => import('./ExplorerScreen'));
const WeatherScreen = React.lazy(() => import('./WeatherScreen'));
import { useFlags, useGate } from '../hooks/useGate';
import TabBarBackground from '../components/ui/TabBarBackground';

const Tab = createBottomTabNavigator<MainTabParamList>();

function AnimatedIcon({ focused, children }: { focused: boolean; children: React.ReactNode }) {
  const scale = React.useRef(new Animated.Value(focused ? 1 : 0.9)).current;
  React.useEffect(() => {
    Animated.spring(scale, { toValue: focused ? 1 : 0.9, useNativeDriver: true, speed: 18, bounciness: 8 }).start();
  }, [focused, scale]);
  return <Animated.View style={{ transform: [{ scale }] }}>{children}</Animated.View>;
}

export default function MainTabs() {
  const { theme } = useTheme();
  const { flags } = useFlags();
  const { open } = useGate();
  const plannerEnabled = !!flags.feature_planner;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 16,
          backgroundColor: theme.colors.card,
          borderTopColor: 'transparent',
          borderRadius: 20,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 8,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarBackground: () => (
          <View style={{ flex: 1 }}>
            <TabBarBackground />
          </View>
        ),
        tabBarItemStyle: { borderRadius: 14, marginHorizontal: 6 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
      }}
    >
      <Tab.Screen name="Home" children={() => (<React.Suspense fallback={null}><HomeScreen /></React.Suspense>)} options={{ tabBarIcon: ({ color, focused }) => (
        <AnimatedIcon focused={focused}><HomeIcon color={color} size={22} /></AnimatedIcon>
      ) }} />
      {plannerEnabled ? (
        <Tab.Screen name="Workouts" children={() => (<React.Suspense fallback={null}><WorkoutsScreen /></React.Suspense>)} options={{ tabBarIcon: ({ color, focused }) => (
          <AnimatedIcon focused={focused}><Dumbbell color={color} size={22} /></AnimatedIcon>
        ) }} />
      ) : (
        <Tab.Screen name="Workouts" children={() => (<React.Suspense fallback={null}><WorkoutsScreen /></React.Suspense>)} listeners={{
          tabPress: (e) => { e.preventDefault(); open('planner_tab'); },
        }} options={{
          tabBarLabel: 'Planner',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon focused={focused}><Lock color={color} size={20} /></AnimatedIcon>
          ),
        }} />
      )}
      <Tab.Screen name="Weather" children={() => (<React.Suspense fallback={null}><WeatherScreen /></React.Suspense>)} options={{ 
        tabBarLabel: 'Clima',
        tabBarIcon: ({ color, focused }) => (
          <AnimatedIcon focused={focused}><CloudSun color={color} size={22} /></AnimatedIcon>
        )
      }} />
                          <Tab.Screen name="Wellness" children={() => (<React.Suspense fallback={null}><WellnessScreen /></React.Suspense>)} options={{ 
                      tabBarLabel: 'Bem-estar',
                      tabBarIcon: ({ color, focused }) => (
                        <AnimatedIcon focused={focused}><Heart color={color} size={22} /></AnimatedIcon>
                      ) 
                    }} />
                    <Tab.Screen name="Community" children={() => (<React.Suspense fallback={null}><CommunityScreen /></React.Suspense>)} options={{ 
                      tabBarLabel: 'Comunidades',
                      tabBarIcon: ({ color, focused }) => (
                        <AnimatedIcon focused={focused}><Users color={color} size={22} /></AnimatedIcon>
                      ) 
                    }} />
                    <Tab.Screen name="Mentorship" children={() => (<React.Suspense fallback={null}><MentorshipScreen /></React.Suspense>)} options={{ 
                      tabBarLabel: 'Mentoria',
                      tabBarIcon: ({ color, focused }) => (
                        <AnimatedIcon focused={focused}><User color={color} size={22} /></AnimatedIcon>
                      ) 
                    }} />
                    <Tab.Screen name="Explorer" children={() => (<React.Suspense fallback={null}><ExplorerScreen /></React.Suspense>)} options={{ 
                      tabBarLabel: 'Explorador',
                      tabBarIcon: ({ color, focused }) => (
                        <AnimatedIcon focused={focused}><MapPin color={color} size={22} /></AnimatedIcon>
                      ) 
                    }} />
                    <Tab.Screen name="Social" children={() => (<React.Suspense fallback={null}><SocialScreen /></React.Suspense>)} options={{ tabBarIcon: ({ color, focused }) => (
                      <AnimatedIcon focused={focused}><Users color={color} size={22} /></AnimatedIcon>
                    ) }} />
      <Tab.Screen name="Stats" children={() => (<React.Suspense fallback={null}><StatsScreen /></React.Suspense>)} options={{ tabBarIcon: ({ color, focused }) => (
        <AnimatedIcon focused={focused}><BarChart2 color={color} size={22} /></AnimatedIcon>
      ) }} />
      <Tab.Screen name="Profile" children={() => (<React.Suspense fallback={null}><ProfileScreen /></React.Suspense>)} options={{ tabBarIcon: ({ color, focused }) => (
        <AnimatedIcon focused={focused}><User color={color} size={22} /></AnimatedIcon>
      ) }} />
    </Tab.Navigator>
  );
}
