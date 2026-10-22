import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { spring } from '@/lib/motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props extends Omit<PressableProps, 'style'> {
  pressedScale?: number;
  /** Resting tilt in degrees (sticker look). Folded into the animated transform so it never conflicts with the press scale. */
  rotate?: number;
  style?: StyleProp<ViewStyle>;
}

/** Pressable that springs down on touch. The scale runs on the UI thread, so no re-render per press. */
export function PressableScale({
  pressedScale = 0.96,
  rotate = 0,
  style,
  onPressIn,
  onPressOut,
  ...rest
}: Props) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate}deg` }, { scale: scale.get() }],
  }));
  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        scale.set(withSpring(pressedScale, { damping: 15, stiffness: 420 }));
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.set(withSpring(1, spring));
        onPressOut?.(e);
      }}
      style={[style, animated]}
    />
  );
}
