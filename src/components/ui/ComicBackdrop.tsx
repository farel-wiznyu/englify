import { memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Path, Pattern, Rect } from 'react-native-svg';

const SPARKLE = 'M0,-14 Q0,0 14,0 Q0,0 0,14 Q0,0 -14,0 Q0,0 0,-14Z';

function Sparkle({ left, top, size, delay }: { left: `${number}%`; top: `${number}%`; size: number; delay: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.set(
      withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }),
            withTiming(0, { duration: 900, easing: Easing.inOut(Easing.quad) }),
          ),
          -1,
        ),
      ),
    );
    return () => cancelAnimation(t);
  }, [t, delay]);
  const style = useAnimatedStyle(() => ({
    opacity: 0.35 + t.get() * 0.65,
    transform: [{ scale: 0.75 + t.get() * 0.35 }, { rotate: `${t.get() * 25}deg` }],
  }));
  return (
    <Animated.View style={[{ position: 'absolute', left, top }, style]}>
      <Svg width={size} height={size} viewBox="-16 -16 32 32">
        <Path d={SPARKLE} fill="#FFFFFF" />
      </Svg>
    </Animated.View>
  );
}

/**
 * Static comic stage behind a screen: big soft blobs, a halftone dot field and a few twinkling
 * sparkles. Blobs and dots are one SVG drawn once; only the three sparkles animate.
 */
export const ComicBackdrop = memo(function ComicBackdrop() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
        <Defs>
          <Pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse">
            <Circle cx="4" cy="4" r="2.4" fill="#FFFFFF" fillOpacity={0.3} />
          </Pattern>
        </Defs>
        <Circle cx="380" cy="60" r="130" fill="#FFFFFF" fillOpacity={0.16} />
        <Circle cx="-20" cy="640" r="170" fill="#FFFFFF" fillOpacity={0.14} />
        <Path d="M0,720 Q100,680 200,730 T400,700 L400,800 L0,800Z" fill="#1B1340" fillOpacity={0.08} />
        <Rect x="0" y="520" width="400" height="280" fill="url(#dots)" />
      </Svg>
      <Sparkle left="12%" top="9%" size={26} delay={0} />
      <Sparkle left="84%" top="22%" size={20} delay={500} />
      <Sparkle left="70%" top="62%" size={24} delay={1000} />
    </View>
  );
});
