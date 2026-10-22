import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import Animated from 'react-native-reanimated';

import {
  AppText,
  Art,
  Button,
  Card,
  Floating,
  ProgressRing,
  Screen,
  SpeechBubble,
  Sticker,
} from '@/components/ui';
import { Colors } from '@/constants/theme';
import { categories, getCategory } from '@/data/content';
import { useStats } from '@/hooks/useStats';
import { speakIndonesian } from '@/lib/audio';
import { enterUp } from '@/lib/motion';
import { useAppStore } from '@/store/useAppStore';

export default function Home() {
  const child = useAppStore((s) => s.child);
  const stats = useStats();
  const next = stats.nextLesson;
  const nextCat = getCategory(next.categoryId);

  return (
    <Screen tone="purple">
      <Animated.View entering={enterUp(0)} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Floating distance={5} duration={1500} squash={0.04}>
          <Art name="mascot-happy" fallback="🦉" size={104} label="Ollie si burung hantu" />
        </Floating>
        <SpeechBubble tail="left" style={{ flex: 1 }}>
          <AppText variant="heading">Hai, {child?.nickname}!</AppText>
          <AppText variant="caption">Ayo belajar kata baru hari ini</AppText>
        </SpeechBubble>
        <Card tone="yellow" tilt={4} style={{ paddingVertical: 8, paddingHorizontal: 12 }}>
          <AppText variant="label">🔥 {stats.streak}</AppText>
        </Card>
      </Animated.View>

      <Animated.View entering={enterUp(1)}>
        <Card tone="yellow" style={{ gap: 12 }}>
          <AppText variant="caption">Belajar hari ini</AppText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <AppText style={{ fontSize: 56, lineHeight: 68 }}>{nextCat?.emoji}</AppText>
            <View style={{ flex: 1 }}>
              <AppText variant="title">{nextCat?.name}</AppText>
              <AppText variant="caption">{next.itemIds.length} kata · {next.estimatedMinutes} menit</AppText>
            </View>
            <ProgressRing value={stats.goalRatio} label={`${stats.todayMinutes}m`} />
          </View>
          <Button
            label="Mulai"
            onPress={() => {
              speakIndonesian('Ayo mulai belajar!');
              router.push({ pathname: '/lesson/[id]', params: { id: next.id } });
            }}
          />
          <Sticker
            text="AYO!"
            color={Colors.pink}
            size={78}
            rotate={14}
            delay={500}
            style={{ position: 'absolute', top: -34, right: -10 }}
          />
        </Card>
      </Animated.View>

      <Animated.View entering={enterUp(2)} style={{ flexDirection: 'row', gap: 12 }}>
        <Card tone="pink" tilt={-1.5} style={{ flex: 1, alignItems: 'center' }} onPress={() => router.push('/(tabs)/learn')}>
          <AppText style={{ fontSize: 32, lineHeight: 40 }}>📚</AppText>
          <AppText variant="label">Kata</AppText>
        </Card>
        <Card tone="blue" tilt={1.5} style={{ flex: 1, alignItems: 'center' }} onPress={() => router.push('/(tabs)/games')}>
          <AppText style={{ fontSize: 32, lineHeight: 40 }}>🎮</AppText>
          <AppText variant="label">Game</AppText>
        </Card>
      </Animated.View>

      <Animated.View entering={enterUp(3)} style={{ gap: 12 }}>
        <AppText variant="title">Pilih tema</AppText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingBottom: 8, paddingTop: 6, paddingHorizontal: 4 }}>
          {categories.map((c, i) => {
            const s = stats.perCategory.get(c.id);
            return (
              <Card
                key={c.id}
                tone={c.color}
                tilt={i % 2 === 0 ? -2 : 2}
                accessibilityLabel={c.name}
                style={{ width: 142, alignItems: 'center', gap: 4 }}
                onPress={() => router.push({ pathname: '/lesson/[id]', params: { id: `${c.id}-1` } })}>
                <AppText style={{ fontSize: 44, lineHeight: 56 }}>{c.emoji}</AppText>
                <AppText variant="label">{c.name}</AppText>
                <AppText variant="caption">{s?.mastered ?? 0}/{s?.total ?? 0} dikuasai</AppText>
              </Card>
            );
          })}
        </ScrollView>
      </Animated.View>
    </Screen>
  );
}
