import { useSSO } from '@clerk/expo';
import * as AuthSession from 'expo-auth-session';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

import { AppText, Art, Button, Floating, Screen, Sticker } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { clerkConfigured } from '@/lib/auth';

WebBrowser.maybeCompleteAuthSession();

function GoogleSignIn() {
  const { startSSOFlow } = useSSO();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPress = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: AuthSession.makeRedirectUri(),
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace('/');
      } else {
        setError('Login belum selesai. Coba lagi ya.');
      }
    } catch {
      setError('Login gagal. Periksa koneksi internet lalu coba lagi.');
    } finally {
      setBusy(false);
    }
  }, [startSSOFlow]);

  return (
    <>
      <Button label={busy ? 'Membuka Google...' : 'Lanjut dengan Google'} onPress={onPress} disabled={busy} />
      {error && (
        <AppText variant="caption" color={Colors.danger} center>
          {error}
        </AppText>
      )}
    </>
  );
}

export default function SignIn() {
  return (
    <Screen scroll={false} tone="purple">
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 }}>
        <View>
          <Floating distance={8} duration={1400}>
            <Art name="signin-scene" fallback="🦉" size={230} />
          </Floating>
          <Sticker text="HELLO!" color={Colors.yellow} size={92} rotate={14} delay={300} style={{ position: 'absolute', top: -20, right: -64 }} />
        </View>
        <AppText variant="hero" color={Colors.white} style={{ textShadowColor: Colors.ink, textShadowOffset: { width: 3, height: 4 }, textShadowRadius: 0 }}>
          Englify
        </AppText>
        <AppText variant="body" center>
          Belajar Bahasa Inggris sambil bermain.{'\n'}Masuk dulu dengan akun orang tua/wali ya.
        </AppText>
        {clerkConfigured ? (
          <GoogleSignIn />
        ) : (
          <Button label="Mode lokal (tanpa login)" onPress={() => router.replace('/')} />
        )}
      </View>
    </Screen>
  );
}
