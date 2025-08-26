import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BarChart2, Dumbbell, Home, Lock, User, Users, Heart } from 'lucide-react-native';
import React from 'react';
import { Animated, Pressable } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import type { MainTabParamList } from '../Types/Navigation';
import HomeScreen from './home/HomeScreen';
import ProfileScreen from './profile/ProfileScreen';
import SocialScreen from './Social/SocialScreen';
import StatsScreen from './stats/StatsScreen';
import WorkoutsScreen from './workouts/WorkoutScreen';
import WellnessScreen from './WellnessScreen';
import { useFlags, useGate } from '../hooks/useGate';

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
        tabBarStyle: { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ color, focused }) => (
        <AnimatedIcon focused={focused}><Home color={color} size={22} /></AnimatedIcon>
      ) }} />
      {plannerEnabled ? (
        <Tab.Screen name="Workouts" component={WorkoutsScreen} options={{ tabBarIcon: ({ color, focused }) => (
          <AnimatedIcon focused={focused}><Dumbbell color={color} size={22} /></AnimatedIcon>
        ) }} />
      ) : (
        <Tab.Screen name="Workouts" component={WorkoutsScreen} listeners={{
          tabPress: (e) => { e.preventDefault(); open('planner_tab'); },
        }} options={{
          tabBarLabel: 'Planner',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon focused={focused}><Lock color={color} size={20} /></AnimatedIcon>
          ),
        }} />
      )}
      <Tab.Screen name="Wellness" component={WellnessScreen} options={{ 
        tabBarLabel: 'Bem-estar',
        tabBarIcon: ({ color, focused }) => (
          <AnimatedIcon focused={focused}><Heart color={color} size={22} /></AnimatedIcon>
        ) 
      }} />
      <Tab.Screen name="Social" component={SocialScreen} options={{ tabBarIcon: ({ color, focused }) => (
        <AnimatedIcon focused={focused}><Users color={color} size={22} /></AnimatedIcon>
      ) }} />
      <Tab.Screen name="Stats" component={StatsScreen} options={{ tabBarIcon: ({ color, focused }) => (
        <AnimatedIcon focused={focused}><BarChart2 color={color} size={22} /></AnimatedIcon>
      ) }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color, focused }) => (
        <AnimatedIcon focused={focused}><User color={color} size={22} /></AnimatedIcon>
      ) }} />
    </Tab.Navigator>
  );
}
