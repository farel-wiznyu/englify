import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { AppText, Art, Card, PressableScale, Screen } from '@/components/ui';
import type { ArtKey } from '@/lib/art';
import { enterUp } from '@/lib/motion';
import { Colors, Outline, Radius, type ColorToken } from '@/constants/theme';
import { categories } from '@/data/content';
import type { GameType } from '@/data/types';

const games: { type: GameType; art: ArtKey; emoji: string; title: string; desc: string; tone: ColorToken }[] = [
  { type: 'match', art: 'game-match', emoji: '🖼️', title: 'Match the Picture', desc: 'Pasangkan kata dengan gambar', tone: 'yellow' },
  { type: 'listen', art: 'game-listen', emoji: '👂', title: 'Listen and Choose', desc: 'Dengar, lalu pilih gambar', tone: 'blue' },
  { type: 'memory', art: 'game-memory', emoji: '🃏', title: 'Memory Cards', desc: 'Cari pasangan kartu', tone: 'pink' },
];

export default function Games() {
  const [category, setCategory] = useState('all');
  const options = [{ id: 'all', name: 'Semua', emoji: '🌈' }, ...categories];

  return (
    <Screen tone="green">
      <AppText variant="title">Main Game</AppText>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {options.map((o) => (
          <PressableScale
            key={o.id}
            accessibilityRole="radio"
            accessibilityState={{ selected: category === o.id }}
            onPress={() => setCategory(o.id)}
            style={{
              ...Outline,
              borderBottomWidth: 5,
              minHeight: 48,
              paddingHorizontal: 16,
              borderRadius: Radius.pill,
              justifyContent: 'center',
              backgroundColor: category === o.id ? Colors.yellow : Colors.white,
            }}>
            <AppText variant="label">{o.emoji} {o.name}</AppText>
          </PressableScale>
        ))}
      </ScrollView>

      {games.map((g, i) => (
        <Animated.View key={g.type} entering={enterUp(i + 1)}>
          <Card
            tone={g.tone}
            accessibilityLabel={g.title}
            onPress={() => router.push({ pathname: '/game/[type]', params: { type: g.type, category } })}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <Art name={g.art} fallback={g.emoji} size={76} />
              <View style={{ flex: 1 }}>
                <AppText variant="heading">{g.title}</AppText>
                <AppText variant="caption">{g.desc}</AppText>
              </View>
            </View>
          </Card>
        </Animated.View>
      ))}
    </Screen>
  );
}
