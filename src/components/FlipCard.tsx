import { memo, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { PressableScale } from '@/components/ui';
import { Colors, Outline, Radius } from '@/constants/theme';
import { usePulse } from '@/lib/motion';

interface Props {
  faceUp: boolean;
  matched: boolean;
  label: string;
  cover: React.ReactNode;
  /** The cover is a finished card illustration: drop the placeholder fill and outline. */
  bare?: boolean;
  children: React.ReactNode;
  onPress: () => void;
}

/** Card that turns around its Y axis. Both faces rotate on the UI thread; nothing re-renders mid-flip. */
export const FlipCard = memo(function FlipCard({ faceUp, matched, label, cover, bare, children, onPress }: Props) {
  const turn = useSharedValue(0);
  const pulse = usePulse(1.08);
  const { trigger } = pulse;

  useEffect(() => {
    turn.set(withTiming(faceUp ? 1 : 0, { duration: 260 }));
  }, [faceUp, turn]);

  useEffect(() => {
    if (matched) trigger();
  }, [matched, trigger]);

  const coverStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 700 }, { rotateY: `${interpolate(turn.get(), [0, 1], [0, 180])}deg` }],
  }));
  const faceStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 700 }, { rotateY: `${interpolate(turn.get(), [0, 1], [180, 360])}deg` }],
  }));

  return (
    <Animated.View style={[styles.slot, pulse.style]}>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={label}
        pressedScale={0.95}
        onPress={onPress}
        style={styles.fill}>
        <Animated.View style={[styles.face, bare ? styles.bare : { backgroundColor: Colors.purple }, coverStyle]}>
          {cover}
        </Animated.View>
        <Animated.View
          style={[styles.face, { backgroundColor: matched ? Colors.successBg : Colors.white }, faceStyle]}>
          {children}
        </Animated.View>
      </PressableScale>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  slot: { flexBasis: '30%', flexGrow: 1, height: 104 },
  fill: { flex: 1 },
  bare: { backgroundColor: 'transparent', borderWidth: 0, borderBottomWidth: 0 },
  face: {
    ...StyleSheet.flatten(StyleSheet.absoluteFill),
    ...Outline,
    borderBottomWidth: 5,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
});
