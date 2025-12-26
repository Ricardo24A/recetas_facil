import { ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { useAnonymousAuth } from '@/hooks/useAnonymousAuth';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
  const { user, loading } = useAnonymousAuth();
  
  if (loading) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if(!user){
    return (
      <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Stack.Screen
          options={{
            headerTitle: "Error de autenticación",
            headerShown: true,
          }}
        />
        <ThemedText>No se pudo autenticar al usuario.</ThemedText>
      </ThemedView>
    );
  } else {
    return (
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#d9f0e2ff' },
          headerTitleStyle: { color: '#16a34a', fontWeight: '600' },
          headerShadowVisible: true,
          headerTitle: 'Recetas Fácil',
          headerLeft: () => (
            <Ionicons
              name="restaurant-outline"
              size={24}
              color="#16a34a"
              style={{ marginLeft: 15 }}
            />
          ),
        }}
      />
    )
  }
}
