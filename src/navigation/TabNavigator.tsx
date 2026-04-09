import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Activity, Book, FileText, Utensils, LayoutDashboard, ActivitySquare } from 'lucide-react-native';

import DashboardScreen from '../screens/DashboardScreen';
import LogScreen from '../screens/LogScreen';
import TestsScreen from '../screens/TestsScreen';
import DietScreen from '../screens/DietScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import ReportsScreen from '../screens/ReportsScreen';

export type TabParamList = {
  Dashboard: undefined;
  Log: undefined;
  Tests: undefined;
  Diet: undefined;
  Workout: undefined;
  Reports: undefined;
};

// @ts-ignore
const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#3182CE' },
        headerTintColor: '#fff',
        tabBarActiveTintColor: '#E53E3E',
        tabBarInactiveTintColor: '#A0AEC0',
        tabBarStyle: { paddingBottom: 5, height: 60 },
        tabBarLabelStyle: { fontSize: 11 }
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{
          tabBarIcon: ({ color, size }: { color: string, size: number }) => <LayoutDashboard color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Log" 
        component={LogScreen} 
        options={{
          tabBarIcon: ({ color, size }: { color: string, size: number }) => <Book color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Tests" 
        component={TestsScreen} 
        options={{
          tabBarIcon: ({ color, size }: { color: string, size: number }) => <FileText color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Diet" 
        component={DietScreen} 
        options={{
          tabBarIcon: ({ color, size }: { color: string, size: number }) => <Utensils color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Workout" 
        component={WorkoutScreen} 
        options={{
          tabBarIcon: ({ color, size }: { color: string, size: number }) => <Activity color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Reports" 
        component={ReportsScreen} 
        options={{
          tabBarIcon: ({ color, size }: { color: string, size: number }) => <ActivitySquare color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
}
