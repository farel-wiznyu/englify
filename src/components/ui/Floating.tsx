import { useEffect } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  children: React.ReactNode;
  distance?: number;
  duration?: number;
  /** Squash-and-stretch amount (0.04 = 4%): stretches on the way up, squashes on the way down. */
  squash?: number;
  style?: StyleProp<ViewStyle>;
}

/** Slow idle bob for mascots/avatars. Runs entirely on the UI thread. */
export function Floating({ children, distance = 5, duration = 1300, squash = 0, style }: Props) {
  const y = useSharedValue(0);
  useEffect(() => {
    const ease = Easing.inOut(Easing.quad);
    y.set(
      withRepeat(
        withSequence(
          withTiming(-distance, { duration, easing: ease }),
          withTiming(0, { duration, easing: ease }),
        ),
        -1,
      ),
    );
    return () => cancelAnimation(y);
  }, [y, distance, duration]);
  const animated = useAnimatedStyle(() => {
    const lift = distance === 0 ? 0 : -y.get() / distance; // 0 at rest, 1 at the top
    return {
      transform: [
        { translateY: y.get() },
        { scaleY: 1 + squash * lift },
        { scaleX: 1 - squash * 0.5 * lift },
      ],
    };
  });
  return <Animated.View style={[style, animated]}>{children}</Animated.View>;
}
