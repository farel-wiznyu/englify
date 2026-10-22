import { router } from 'expo-router';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import { AppText, Card, ProgressRing, Screen, Stars } from '@/components/ui';
import { categories, getCategoryLessons } from '@/data/content';
import { useStats } from '@/hooks/useStats';
import { enterUp } from '@/lib/motion';
import { useAppStore } from '@/store/useAppStore';

export default function Learn() {
  const stats = useStats();
  const lessonStars = useAppStore((s) => s.lessonStars);

  return (
    <Screen tone="yellow">
      <AppText variant="title">Belajar Kata</AppText>
      {categories.map((c, i) => {
        const s = stats.perCategory.get(c.id);
        const lesson = getCategoryLessons(c.id)[0];
        const stars = lesson ? (lessonStars[lesson.id] ?? 0) : 0;
        return (
          <Animated.View key={c.id} entering={enterUp(i)}>
            <Card
              tone={c.color}
              accessibilityLabel={`${c.name}, ${c.nameId}`}
              onPress={() => lesson && router.push({ pathname: '/lesson/[id]', params: { id: lesson.id } })}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <AppText style={{ fontSize: 48, lineHeight: 60 }}>{c.emoji}</AppText>
                <View style={{ flex: 1, gap: 2 }}>
                  <AppText variant="heading">{c.name}</AppText>
                  <AppText variant="caption">{c.nameId} · {s?.total ?? 0} kata</AppText>
                  <Stars count={stars} size={20} />
                </View>
                <ProgressRing value={s && s.total ? s.learned / s.total : 0} size={60} stroke={7} />
              </View>
            </Card>
          </Animated.View>
        );
      })}
    </Screen>
  );
}
