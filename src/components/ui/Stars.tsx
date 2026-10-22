import { View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { AppText } from './AppText';

interface Props {
  count: number;
  max?: number;
  size?: number;
  /** Pop the earned stars in one after another (result screens only). */
  animate?: boolean;
}

export function Stars({ count, max = 3, size = 28, animate = false }: Props) {
  return (
    <View style={{ flexDirection: 'row', gap: 4 }} accessibilityLabel={`${count} dari ${max} bintang`}>
      {Array.from({ length: max }, (_, i) => {
        const earned = i < count;
        const star = (
          <AppText style={{ fontSize: size, lineHeight: size * 1.25, opacity: earned ? 1 : 0.25 }}>⭐</AppText>
        );
        if (!animate || !earned) return <View key={i}>{star}</View>;
        return (
          <Animated.View key={i} entering={ZoomIn.delay(350 + i * 200).springify().damping(9)}>
            {star}
          </Animated.View>
        );
      })}
    </View>
  );
}
