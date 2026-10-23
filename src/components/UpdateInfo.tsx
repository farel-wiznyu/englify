import * as Updates from 'expo-updates';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui';
import { Colors } from '@/constants/theme';

type State = 'idle' | 'checking' | 'downloading' | 'none' | 'error';

const stateText: Record<State, string> = {
  idle: 'Cek pembaruan',
  checking: 'Memeriksa...',
  downloading: 'Mengunduh pembaruan...',
  none: 'Sudah versi terbaru',
  error: 'Gagal memeriksa, coba lagi',
};

/**
 * Shows which build/update is running and lets the user pull an OTA update immediately instead of
 * waiting for the next two app launches. Does nothing in Expo Go / dev (expo-updates is disabled there).
 */
export function UpdateInfo({ color = Colors.ink }: { color?: string }) {
  const [state, setState] = useState<State>('idle');

  const running = !Updates.isEnabled
    ? 'mode pengembangan'
    : Updates.isEmbeddedLaunch
      ? 'APK bawaan (belum ada update)'
      : `update ${Updates.updateId?.slice(0, 8) ?? '?'}`;

  async function check() {
    if (!Updates.isEnabled || state === 'checking' || state === 'downloading') return;
    try {
      setState('checking');
      const result = await Updates.checkForUpdateAsync();
      if (!result.isAvailable) {
        setState('none');
        return;
      }
      setState('downloading');
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch {
      setState('error');
    }
  }

  return (
    <View style={{ alignItems: 'center', gap: 2 }}>
      <AppText variant="caption" color={color} center>
        Versi 1.0.0 · {running}
      </AppText>
      {Updates.isEnabled && (
        <Pressable accessibilityRole="button" onPress={check} hitSlop={12} style={{ minHeight: 36, justifyContent: 'center' }}>
          <AppText variant="caption" color={color} style={{ textDecorationLine: 'underline' }}>
            {stateText[state]}
          </AppText>
        </Pressable>
      )}
    </View>
  );
}
