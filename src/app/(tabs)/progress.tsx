import { Image } from 'expo-image';
import { View } from 'react-native';

import { AppText, Card, Screen } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { useStats } from '@/hooks/useStats';
import { badgeSource, type BadgeKey } from '@/lib/art';
import { dateKey } from '@/lib/progress';
import { useAppStore } from '@/store/useAppStore';

const DAY_LABELS = ['M', 'S', 'S', 'R', 'K', 'J', 'S'];

function lastSevenDays() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { key: dateKey(d), label: DAY_LABELS[d.getDay()] };
  });
}

type Stats = ReturnType<typeof useStats>;

const badges: { id: string; emoji: string; art: BadgeKey; title: string; test: (s: Stats) => boolean }[] = [
  { id: 'first', emoji: '🌱', art: 'star', title: 'Langkah Pertama', test: (s) => s.learned >= 1 },
  { id: 'ten', emoji: '📖', art: 'heart', title: '10 Kata', test: (s) => s.learned >= 10 },
  { id: 'lesson', emoji: '🎓', art: 'trophy', title: 'Lesson Selesai', test: (s) => s.lessonsDone >= 1 },
  { id: 'player', emoji: '🎮', art: 'lightning', title: 'Pemain Game', test: (s) => s.gamesPlayed >= 3 },
  { id: 'streak', emoji: '🔥', art: 'fire', title: '3 Hari Beruntun', test: (s) => s.streak >= 3 },
  { id: 'master', emoji: '🏅', art: 'crown', title: '10 Kata Dikuasai', test: (s) => s.mastered >= 10 },
];

function BadgeImage({ art, emoji, earned }: { art: BadgeKey; emoji: string; earned: boolean }) {
  const source = badgeSource(art);
  return (
    <View style={{ width: 84, height: 84, alignItems: 'center', justifyContent: 'center' }}>
      {source ? (
        <Image source={source} contentFit="contain" accessible={false} style={{ width: 84, height: 84 }} />
      ) : (
        <AppText style={{ fontSize: 44, lineHeight: 54 }}>{emoji}</AppText>
      )}
      {!earned && (
        <View style={{ position: 'absolute', right: 0, bottom: 0 }}>
          <AppText style={{ fontSize: 24, lineHeight: 30 }}>🔒</AppText>
        </View>
      )}
    </View>
  );
}

/** Child-facing: stars and badges only. Detailed weak spots live in the Parent Area. */
export default function Progress() {
  const stats = useStats();
  const activity = useAppStore((s) => s.activity);
  const days = lastSevenDays();

  return (
    <Screen tone="orange">
      <AppText variant="title">Bintangku</AppText>

      <Card tone="yellow" style={{ alignItems: 'center', gap: 4 }}>
        <AppText style={{ fontSize: 56, lineHeight: 68 }}>⭐</AppText>
        <AppText variant="hero">{stats.starsTotal}</AppText>
        <AppText variant="caption">bintang terkumpul</AppText>
      </Card>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Card tone="blue" style={{ flex: 1, alignItems: 'center' }}>
          <AppText variant="title">{stats.learned}</AppText>
          <AppText variant="caption" center>kata dipelajari</AppText>
        </Card>
        <Card tone="purple" style={{ flex: 1, alignItems: 'center' }}>
          <AppText variant="title">{stats.lessonsDone}/{stats.lessonsTotal}</AppText>
          <AppText variant="caption" center>lesson selesai</AppText>
        </Card>
      </View>

      <Card tone="white" style={{ gap: 12 }}>
        <AppText variant="heading">🔥 Minggu ini</AppText>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {days.map((d) => {
            const a = activity[d.key];
            const active = !!a && (a.seconds > 0 || a.lessons > 0 || a.games > 0);
            return (
              <View key={d.key} style={{ alignItems: 'center', gap: 6 }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    borderWidth: 2.5,
                    borderColor: Colors.ink,
                    backgroundColor: active ? Colors.yellow : Colors.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <AppText variant="caption">{active ? '✓' : ''}</AppText>
                </View>
                <AppText variant="caption">{d.label}</AppText>
              </View>
            );
          })}
        </View>
      </Card>

      <AppText variant="heading">Lencana</AppText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {badges.map((b) => {
          const earned = b.test(stats);
          return (
            <Card
              key={b.id}
              tone={earned ? 'pink' : 'white'}
              style={{ flexBasis: '47%', flexGrow: 1, alignItems: 'center', opacity: earned ? 1 : 0.55 }}>
              <BadgeImage art={b.art} emoji={b.emoji} earned={earned} />
              <AppText variant="caption" center>{b.title}</AppText>
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}
