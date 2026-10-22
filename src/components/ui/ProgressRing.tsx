import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { AppText } from './AppText';
import { Colors } from '@/constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  /** 0..1 */
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
}

/** The arc fills from its previous value to the new one instead of jumping. */
export function ProgressRing({ value, size = 88, stroke = 10, label }: Props) {
  const clamped = Math.max(0, Math.min(1, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.set(withTiming(clamped, { duration: 700, easing: Easing.out(Easing.cubic) }));
  }, [clamped, progress]);

  const arc = useAnimatedProps(() => ({ strokeDashoffset: c * (1 - progress.get()) }));

  return (
    <View
      style={{ width: size, height: size }}
      accessibilityLabel={`Progres ${Math.round(clamped * 100)} persen`}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={Colors.blue} strokeWidth={stroke} fill="none" />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={Colors.ink}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${c} ${c}`}
          animatedProps={arc}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.center}>
        <AppText variant="label">{label ?? `${Math.round(clamped * 100)}%`}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { ...StyleSheet.flatten(StyleSheet.absoluteFill), alignItems: 'center', justifyContent: 'center' },
});
