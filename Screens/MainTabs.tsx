import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../types/navigation';
import HomeScreen from './home/HomeScreen';
import WorkoutsScreen from './workouts/WorkoutsScreen';
import SocialScreen from './social/SocialScreen';
import StatsScreen from './stats/StatsScreen';
import ProfileScreen from './profile/ProfileScreen';
import { Animated } from 'react-native';
import { Home, Dumbbell, Users, BarChart2, User } from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';

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
      <Tab.Screen name="Workouts" component={WorkoutsScreen} options={{ tabBarIcon: ({ color, focused }) => (
        <AnimatedIcon focused={focused}><Dumbbell color={color} size={22} /></AnimatedIcon>
      ) }} />
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