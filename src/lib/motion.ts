import { useCallback } from 'react';
import {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

/**
 * Motion rules for the app: short (<400 ms), spring-based, UI-thread only, transform/opacity only.
 * Reanimated honours the system "reduce motion" setting by default, so no extra checks are needed.
 */
export const spring = { damping: 14, stiffness: 260, mass: 0.7 } as const;

/** Staggered entrance for stacked cards. The delay is capped so long lists never feel slow. */
export const enterUp = (index = 0) =>
  FadeInDown.delay(Math.min(index, 7) * 60)
    .springify()
    .damping(18)
    .stiffness(170);

export const enterSide = FadeInRight.duration(260);

/** Quick scale bump, e.g. when an emoji or button is tapped. */
export function usePulse(peak = 1.15) {
  const s = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: s.get() }] }));
  const trigger = useCallback(() => {
    s.set(withSequence(withSpring(peak, { damping: 8, stiffness: 400 }), withSpring(1, spring)));
  }, [s, peak]);
  return { style, trigger };
}

/** Gentle horizontal shake for a wrong answer. */
export function useShake() {
  const x = useSharedValue(0);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }] }));
  const trigger = useCallback(() => {
    x.set(
      withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 80 }),
        withTiming(-6, { duration: 70 }),
        withTiming(6, { duration: 70 }),
        withTiming(0, { duration: 50 }),
      ),
    );
  }, [x]);
  return { style, trigger };
}
