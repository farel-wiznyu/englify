import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { AppText, Screen } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { logFlow, useAuthFlow } from '@/lib/authFlow';

const TIMEOUT_MS = 25000;

function backToSignIn() {
  if (router.canGoBack()) router.back();
  else router.replace('/sign-in');
}

/**
 * Landing screen for the Google sign-in redirect. The original sign-in screen keeps running underneath;
 * it finishes the session and navigates on. If it reports a failure (or nothing happens) we go back.
 */
export default function SsoCallback() {
  const failed = useAuthFlow((s) => s.failed);

  useEffect(() => {
    void logFlow('layar sso-callback tampil');
    const timer = setTimeout(() => {
      void logFlow('sso-callback timeout 25 dtk, kembali ke login');
      backToSignIn();
    }, TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (failed) backToSignIn();
  }, [failed]);

  return (
    <Screen scroll={false} tone="purple">
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <ActivityIndicator size="large" color={Colors.ink} />
        <AppText variant="heading" center>Menyelesaikan login...</AppText>
      </View>
    </Screen>
  );
}
