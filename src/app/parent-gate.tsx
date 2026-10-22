import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { TextInput, View } from 'react-native';

import { AppText, Button, Card, Screen } from '@/components/ui';
import { Colors, Fonts, Outline, Radius } from '@/constants/theme';

/** Adult-level challenge (two-digit multiplication) so young children cannot guess their way in. */
export default function ParentGate() {
  const [attempt, setAttempt] = useState(0);
  const { a, b } = useMemo(
    () => ({ a: 6 + Math.floor(Math.random() * 7), b: 6 + Math.floor(Math.random() * 7) }),
    [attempt],
  );
  const [value, setValue] = useState('');
  const [wrong, setWrong] = useState(false);

  function submit() {
    if (Number(value) === a * b) {
      router.replace('/parent');
    } else {
      setWrong(true);
      setValue('');
      setAttempt((n) => n + 1);
    }
  }

  return (
    <Screen tone="blue" decor={false}>
      <Button label="← Kembali" kind="secondary" onPress={() => router.back()} style={{ alignSelf: 'flex-start', minHeight: 48 }} />
      <Card tone="white" style={{ gap: 12, alignItems: 'center' }}>
        <AppText style={{ fontSize: 48, lineHeight: 60 }}>🔒</AppText>
        <AppText variant="title" center>Khusus orang tua</AppText>
        <AppText center>Jawab pertanyaan ini untuk masuk:</AppText>
        <AppText variant="hero">{a} × {b} = ?</AppText>
        <View style={{ width: '100%' }}>
          <TextInput
            value={value}
            onChangeText={(t) => setValue(t.replace(/[^0-9]/g, ''))}
            keyboardType="number-pad"
            maxLength={3}
            accessibilityLabel="Jawaban"
            style={{
              ...Outline,
              borderRadius: Radius.sm,
              minHeight: 56,
              textAlign: 'center',
              fontFamily: Fonts.bold,
              fontSize: 24,
              color: Colors.ink,
              backgroundColor: Colors.cream,
            }}
          />
        </View>
        {wrong && (
          <AppText variant="caption" color={Colors.danger}>Belum tepat. Coba soal baru ya.</AppText>
        )}
        <Button label="Masuk" onPress={submit} disabled={value.length === 0} />
      </Card>
    </Screen>
  );
}
