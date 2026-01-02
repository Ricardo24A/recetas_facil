import { ThemedView } from '@/components/themed-view';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useAuthSession } from '@/hooks/useAuthSession';
import { Redirect, Stack, useSegments } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const { user, loadingAuth } = useAuthSession();
  const segments = useSegments();


  if (loadingAuth) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  const isAuthScreen = segments[0] === 'auth';
  const irtoAuth = !user || user.isAnonymous;

  if(irtoAuth && !isAuthScreen) {
    return <Redirect href={"/auth"} />
  }
  if(!irtoAuth && isAuthScreen) {
    return <Redirect href={"/(tabs)"} />
  }
  
  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
