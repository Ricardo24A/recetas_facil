import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const { isDark, colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: "#059669",
        tabBarInactiveTintColor: colors.icon,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: isDark ? "#2d3134" : "#e5e7eb",
        },
      }}>

      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="shopping"
        options={{
          title: "Compras",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="planificador"
        options={{
          title: "Planificador",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={18} color={color} />
          ),
        }}
      />

    </Tabs>
  );
}
