import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: "#059669",
        tabBarInactiveTintColor: "#6b7280",
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
    </Tabs>
  );
}
