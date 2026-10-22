import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';

import { PronounceStep } from '@/components/PronounceStep';
import { VocabArt } from '@/components/VocabArt';
import { AppText, Art, AudioButton, Button, Card, Floating, Screen, Stars, Sticker } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { getCategory, getLesson, getLessonItems } from '@/data/content';
import { useSessionTimer } from '@/hooks/useSessionTimer';
import { playWord, stopAudio } from '@/lib/audio';
import { enterSide, usePulse } from '@/lib/motion';
import { useAppStore } from '@/store/useAppStore';

type Phase = 'learn' | 'practice' | 'done';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = getLesson(id);
  const items = lesson ? getLessonItems(lesson) : [];
  const category = lesson ? getCategory(lesson.categoryId) : undefined;
  const ageGroup = useAppStore((s) => s.child?.ageGroup);
  const markListened = useAppStore((s) => s.markListened);
  const markPracticed = useAppStore((s) => s.markPracticed);
  const completeLesson = useAppStore((s) => s.completeLesson);

  const [phase, setPhase] = useState<Phase>('learn');
  const [index, setIndex] = useState(0);
  const [goodCount, setGoodCount] = useState(0);

  const emoji = usePulse(1.18);
  useSessionTimer();
  useEffect(() => stopAudio, []);

  if (!lesson || items.length === 0) {
    return (
      <Screen>
        <AppText variant="title">Materi tidak ditemukan</AppText>
        <Button label="Kembali" onPress={() => router.back()} />
      </Screen>
    );
  }

  const item = items[index];
  const last = index === items.length - 1;
  const progressText = `${index + 1} / ${items.length}`;

  function listen() {
    emoji.trigger();
    markListened(item.id);
    playWord(item);
  }

  function nextLearn() {
    if (last) {
      setPhase('practice');
      setIndex(0);
    } else {
      setIndex(index + 1);
    }
  }

  function afterPractice(rating: 'good' | 'again') {
    markPracticed(item.id);
    if (rating === 'good') setGoodCount((c) => c + 1);
    if (last) {
      const ratio = (goodCount + (rating === 'good' ? 1 : 0)) / items.length;
      completeLesson(lesson!.id, ratio >= 0.9 ? 3 : ratio >= 0.5 ? 2 : 1);
      setPhase('done');
    } else {
      setIndex(index + 1);
    }
  }

  if (phase === 'done') {
    const stars = useAppStore.getState().lessonStars[lesson.id] ?? 1;
    return (
      <Screen tone="yellow">
        <View style={{ alignItems: 'center', gap: 16, paddingTop: 40 }}>
          <View>
            <Animated.View entering={ZoomIn.springify().damping(9)}>
              <Floating distance={6}>
                <Art name="mascot-cheer" fallback="🎉" size={170} />
              </Floating>
            </Animated.View>
            <Sticker text="WOW!" color={Colors.pink} size={88} rotate={12} delay={400} style={{ position: 'absolute', top: -24, right: -56 }} />
          </View>
          <Animated.View entering={FadeInUp.delay(150).springify().damping(18)}>
            <AppText variant="title" center>Hebat sekali!</AppText>
          </Animated.View>
          <Stars count={stars} size={44} animate />
          <AppText center>Kamu sudah belajar {items.length} kata {category?.name}.</AppText>
          <Button label="Main game kata ini" kind="yellow" onPress={() => router.replace({ pathname: '/game/[type]', params: { type: 'match', category: lesson.categoryId } })} />
          <Button label="Selesai" kind="secondary" onPress={() => router.replace('/(tabs)')} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen tone={category?.color ?? 'purple'}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button label="← Kembali" kind="secondary" onPress={() => router.back()} style={{ minHeight: 48, paddingHorizontal: 16 }} />
        <AppText variant="label">{phase === 'learn' ? 'Belajar' : 'Latihan'} {progressText}</AppText>
      </View>

      {phase === 'learn' ? (
        <View style={{ gap: 16 }}>
          <Animated.View key={item.id} entering={enterSide}>
            <Card tone="white" style={{ alignItems: 'center', gap: 8, paddingVertical: 28 }}>
              <Animated.View style={emoji.style}>
                <VocabArt item={item} size={180} />
              </Animated.View>
              <AppText variant="hero">{item.word}</AppText>
              <AppText variant="heading">{item.translation}</AppText>
              {ageGroup === '7_10' && item.example && (
                <AppText variant="body" center style={{ marginTop: 8 }}>"{item.example}"</AppText>
              )}
              <View style={{ marginTop: 12 }}>
                <AudioButton size={84} onPress={listen} />
              </View>
            </Card>
          </Animated.View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Button
              style={{ flex: 1 }}
              kind="secondary"
              label="Sebelumnya"
              disabled={index === 0}
              onPress={() => setIndex(index - 1)}
            />
            <Button style={{ flex: 1 }} label={last ? 'Latihan' : 'Lanjut'} onPress={nextLearn} />
          </View>
        </View>
      ) : (
        <PronounceStep key={item.id} item={item} onDone={afterPractice} />
      )}
    </Screen>
  );
}
