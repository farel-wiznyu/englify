import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Colors, Fonts } from '@/constants/theme';
import { spring } from '@/lib/motion';

/** Icon that hops up and grows slightly when its tab becomes active. */
function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  const lift = useSharedValue(focused ? 1 : 0);
  useEffect(() => {
    lift.set(withSpring(focused ? 1 : 0, spring));
  }, [focused, lift]);
  const style = useAnimatedStyle(() => ({
    opacity: 0.55 + lift.get() * 0.45,
    transform: [{ translateY: -3 * lift.get() }, { scale: 1 + 0.18 * lift.get() }],
  }));
  return <Animated.Text style={[{ fontSize: 24 }, style]}>{emoji}</Animated.Text>;
}

const icon = (emoji: string) =>
  function renderIcon({ focused }: { focused: boolean }) {
    return <TabIcon emoji={emoji} focused={focused} />;
  };

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.ink,
        tabBarInactiveTintColor: Colors.inkSoft,
        tabBarLabelStyle: { fontFamily: Fonts.display, fontSize: 12, letterSpacing: 0.3 },
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 3,
          borderTopColor: Colors.ink,
          height: 70,
          paddingTop: 6,
        },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: icon('🏠') }} />
      <Tabs.Screen name="learn" options={{ title: 'Belajar', tabBarIcon: icon('📚') }} />
      <Tabs.Screen name="games" options={{ title: 'Game', tabBarIcon: icon('🎮') }} />
      <Tabs.Screen name="progress" options={{ title: 'Bintang', tabBarIcon: icon('⭐') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil', tabBarIcon: icon('🙂') }} />
    </Tabs>
  );
}
