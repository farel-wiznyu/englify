import { useSSO } from '@clerk/expo';
import * as AuthSession from 'expo-auth-session';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

import { UpdateInfo } from '@/components/UpdateInfo';
import { AppText, Art, Button, Floating, Screen, Sticker } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { clerkConfigured } from '@/lib/auth';
import { clearFlowLog, logFlow, readFlowLog, useAuthFlow } from '@/lib/authFlow';

WebBrowser.maybeCompleteAuthSession();

function GoogleSignIn() {
  const { startSSOFlow } = useSSO();
  const [busy, setBusy] = useState(false);
  const message = useAuthFlow((s) => s.message);
  const [log, setLog] = useState<string[]>([]);

  // The log lives on the device, so it is still here if the screen was re-created during the redirect.
  useEffect(() => {
    void readFlowLog().then(setLog);
  }, [message, busy]);

  const onPress = useCallback(async () => {
    const flow = useAuthFlow.getState();
    flow.reset();
    setBusy(true);
    await clearFlowLog();
    await logFlow('tombol Google ditekan');
    try {
      // Must be on Clerk's redirect allowlist, otherwise the callback lacks the rotating token
      // nonce and the session never completes (Expo Go uses exp://, a standalone build englify://).
      const redirectUrl = AuthSession.makeRedirectUri();
      await logFlow(`redirect=${redirectUrl}`);
      const { createdSessionId, setActive, authSessionResult, signIn, signUp } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl,
      });

      const type = authSessionResult?.type ?? 'null';
      const url = authSessionResult && 'url' in authSessionResult ? authSessionResult.url : undefined;
      await logFlow(
        `browser=${type} nonce=${url?.includes('rotating_token_nonce') ? 'ada' : 'tidak'} ` +
          `sesi=${createdSessionId ? 'ada' : 'tidak'} signIn=${signIn?.status ?? '-'}/` +
          `${signIn?.firstFactorVerification?.status ?? '-'} signUp=${signUp?.status ?? '-'}`,
      );

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        await logFlow('setActive berhasil, pindah ke halaman utama');
        router.replace('/');
      } else if (authSessionResult && authSessionResult.type !== 'success') {
        flow.setFailed('Login dibatalkan atau jendela Google ditutup. Coba lagi ya.');
      } else {
        flow.setFailed(`Login belum selesai. Pastikan alamat ini diizinkan di Clerk: ${redirectUrl}`);
      }
    } catch (e) {
      const detail =
        (e as { errors?: { longMessage?: string; message?: string }[] })?.errors?.[0]?.longMessage ??
        (e instanceof Error ? e.message : String(e));
      await logFlow(`error: ${detail}`);
      flow.setFailed(`Login gagal: ${detail}`);
    } finally {
      setBusy(false);
    }
  }, [startSSOFlow]);

  return (
    <>
      <Button label={busy ? 'Membuka Google...' : 'Lanjut dengan Google'} onPress={onPress} disabled={busy} />
      {message && (
        <AppText variant="caption" color={Colors.danger} center>
          {message}
        </AppText>
      )}
      {log.length > 0 && (
        <View style={{ gap: 2, paddingHorizontal: 8 }}>
          <AppText variant="caption">Catatan login terakhir:</AppText>
          {log.map((line, i) => (
            <AppText key={i} variant="caption" selectable style={{ fontSize: 11, lineHeight: 15 }}>
              {line}
            </AppText>
          ))}
        </View>
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
      <View style={{ paddingBottom: 24 }}>
        <UpdateInfo />
      </View>
    </Screen>
  );
}
