import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, TextInput, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { AppText, Art, Button, Card, PressableScale, Screen } from '@/components/ui';
import { Colors, Fonts, Outline, Radius, type ColorToken } from '@/constants/theme';
import type { AgeGroup, ChildProfile } from '@/data/types';
import { Avatar } from '@/components/Avatar';
import { avatarKeys, type ArtKey } from '@/lib/art';
import { useAppStore } from '@/store/useAppStore';

const slides: { emoji: string; art: ArtKey; title: string; text: string; tone: ColorToken }[] = [
  { emoji: '📚', art: 'onboard-vocab', title: 'Kenali Kata', text: 'Belajar kata Bahasa Inggris lewat gambar dan suara.', tone: 'purple' },
  { emoji: '🎤', art: 'onboard-speak', title: 'Ucapkan', text: 'Dengar contoh, lalu tirukan sendiri.', tone: 'yellow' },
  { emoji: '🎮', art: 'onboard-games', title: 'Main & Belajar', text: 'Game singkat untuk mengingat kata baru.', tone: 'pink' },
];

const avatars = avatarKeys;
const goals: ChildProfile['dailyGoalMinutes'][] = [5, 10, 15];

function Choice({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <PressableScale
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={{
        ...Outline,
        flex: 1,
        minHeight: 56,
        borderRadius: Radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: selected ? Colors.yellow : Colors.white,
      }}>
      <AppText variant="label">{label}</AppText>
    </PressableScale>
  );
}

export default function Onboarding() {
  const setChild = useAppStore((s) => s.setChild);
  const existingChild = useAppStore((s) => s.child);
  const [step, setStep] = useState(0);

  // A profile restored from the server (new phone, reinstall) skips setup.
  useEffect(() => {
    if (existingChild) router.replace('/(tabs)');
  }, [existingChild]);
  const [nickname, setNickname] = useState('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('4_6');
  const [avatar, setAvatar] = useState(avatars[0]);
  const [goal, setGoal] = useState<ChildProfile['dailyGoalMinutes']>(10);

  if (step < slides.length) {
    const s = slides[step];
    return (
      <Screen scroll={false} tone={s.tone}>
        <Animated.View
          key={step}
          entering={FadeIn.duration(250)}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <Animated.View entering={ZoomIn.springify().damping(10)}>
            <Art name={s.art} fallback={s.emoji} size={230} />
          </Animated.View>
          <AppText variant="title" center>{s.title}</AppText>
          <AppText center>{s.text}</AppText>
        </Animated.View>
        <View style={{ paddingBottom: 32, gap: 12 }}>
          <Button label={step === slides.length - 1 ? 'Siapkan Profil' : 'Lanjut'} onPress={() => setStep(step + 1)} />
          {step < slides.length - 1 && (
            <Button label="Lewati" kind="secondary" onPress={() => setStep(slides.length)} />
          )}
        </View>
      </Screen>
    );
  }

  const canSave = nickname.trim().length >= 2;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen tone="blue">
        <AppText variant="title">Profil si kecil</AppText>
        <AppText variant="caption">Orang tua/wali bisa membantu mengisi bagian ini.</AppText>

        <Card tone="white" style={{ gap: 12 }}>
          <AppText variant="label">Nama panggilan</AppText>
          <TextInput
            value={nickname}
            onChangeText={setNickname}
            placeholder="Contoh: Dina"
            maxLength={20}
            accessibilityLabel="Nama panggilan"
            style={{
              ...Outline,
              borderRadius: Radius.sm,
              paddingHorizontal: 14,
              minHeight: 52,
              fontFamily: Fonts.regular,
              fontSize: 18,
              color: Colors.ink,
              backgroundColor: Colors.cream,
            }}
          />
        </Card>

        <Card tone="white" style={{ gap: 12 }}>
          <AppText variant="label">Usia</AppText>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Choice label="4–6 tahun" selected={ageGroup === '4_6'} onPress={() => setAgeGroup('4_6')} />
            <Choice label="7–10 tahun" selected={ageGroup === '7_10'} onPress={() => setAgeGroup('7_10')} />
          </View>
        </Card>

        <Card tone="white" style={{ gap: 12 }}>
          <AppText variant="label">Avatar</AppText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {avatars.map((a) => (
              <PressableScale
                key={a}
                accessibilityRole="radio"
                accessibilityState={{ selected: avatar === a }}
                accessibilityLabel={`Avatar ${a}`}
                onPress={() => setAvatar(a)}
                style={{
                  ...Outline,
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: avatar === a ? Colors.yellow : Colors.white,
                }}>
                <Avatar value={a} size={50} />
              </PressableScale>
            ))}
          </View>
        </Card>

        <Card tone="white" style={{ gap: 12 }}>
          <AppText variant="label">Target belajar harian</AppText>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {goals.map((g) => (
              <Choice key={g} label={`${g} menit`} selected={goal === g} onPress={() => setGoal(g)} />
            ))}
          </View>
        </Card>

        <Button
          label="Mulai Belajar"
          disabled={!canSave}
          onPress={() => {
            setChild({ nickname: nickname.trim(), ageGroup, avatar, dailyGoalMinutes: goal });
            router.replace('/(tabs)');
          }}
        />
      </Screen>
    </KeyboardAvoidingView>
  );
}
