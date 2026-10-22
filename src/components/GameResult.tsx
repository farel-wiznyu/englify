import { router } from 'expo-router';
import { View } from 'react-native';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';

import { AppText, Art, Button, Floating, Screen, Stars, Sticker } from '@/components/ui';
import { Colors } from '@/constants/theme';

interface Props {
  stars: 1 | 2 | 3;
  headline: string;
  detail: string;
  onReplay: () => void;
}

const sfx = { 3: 'POW!', 2: 'YAY!', 1: 'NICE!' } as const;

export function GameResultView({ stars, headline, detail, onReplay }: Props) {
  return (
    <Screen tone="yellow">
      <View style={{ alignItems: 'center', gap: 16, paddingTop: 48 }}>
        <View>
          <Animated.View entering={ZoomIn.springify().damping(9)}>
            <Floating distance={6}>
              <Art
                name={stars === 3 ? 'trophy' : stars === 2 ? 'medal' : 'balloon'}
                fallback={stars === 3 ? '🏆' : stars === 2 ? '🏅' : '🎈'}
                size={150}
              />
            </Floating>
          </Animated.View>
          <Sticker
            text={sfx[stars]}
            color={stars === 3 ? Colors.pink : Colors.blue}
            size={90}
            rotate={12}
            delay={450}
            style={{ position: 'absolute', top: -26, right: -62 }}
          />
        </View>
        <Animated.View entering={FadeInUp.delay(150).springify().damping(18)}>
          <AppText variant="title" center>{headline}</AppText>
        </Animated.View>
        <Stars count={stars} size={48} animate />
        <Animated.View
          entering={FadeInUp.delay(700).springify().damping(18)}
          style={{ alignItems: 'center', gap: 16, alignSelf: 'stretch' }}>
          <AppText center>{detail}</AppText>
          <Button label="Main lagi" kind="primary" onPress={onReplay} />
          <Button label="Pilih game lain" kind="secondary" onPress={() => router.replace('/(tabs)/games')} />
        </Animated.View>
      </View>
    </Screen>
  );
}
