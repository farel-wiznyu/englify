import {
  Andika_400Regular,
  Andika_700Bold,
  useFonts,
} from '@expo-google-fonts/andika';
import { Bangers_400Regular } from '@expo-google-fonts/bangers';
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useSync } from '@/hooks/useSync';
import { AuthProvider } from '@/lib/auth';
import { useAppStore } from '@/store/useAppStore';

SplashScreen.preventAutoHideAsync();

function SyncRunner() {
  useSync();
  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Andika_400Regular,
    Andika_700Bold,
    LilitaOne_400Regular,
    Bangers_400Regular,
  });
  const [queryClient] = useState(() => new QueryClient());
  const [hydrated, setHydrated] = useState(useAppStore.persist.hasHydrated());

  useEffect(() => {
    const unsub = useAppStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);

  const ready = fontsLoaded && hydrated;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <SyncRunner />
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Colors.cream },
              }}
            />
          </QueryClientProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
