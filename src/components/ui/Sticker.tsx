import { useMemo } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import Svg, { Polygon } from 'react-native-svg';

import { AppText } from './AppText';
import { Colors } from '@/constants/theme';

interface Props {
  text: string;
  color?: string;
  size?: number;
  /** Tilt in degrees. */
  rotate?: number;
  /** Delay (ms) before it pops in. */
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

/** Comic starburst with a sound effect ("POW!"). Decorative, so hidden from screen readers. */
export function Sticker({ text, color = Colors.yellow, size = 96, rotate = -10, delay = 0, style }: Props) {
  const points = useMemo(() => {
    const spikes = 14;
    return Array.from({ length: spikes * 2 }, (_, i) => {
      const r = i % 2 === 0 ? 48 : 37;
      const a = (Math.PI * i) / spikes;
      return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
    }).join(' ');
  }, []);

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      entering={ZoomIn.delay(delay).springify().damping(8)}
      style={[{ width: size, height: size, transform: [{ rotate: `${rotate}deg` }] }, style]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Polygon points={points} fill={color} stroke={Colors.ink} strokeWidth={3.5} strokeLinejoin="round" />
      </Svg>
      <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
        <AppText variant="sfx" style={{ fontSize: size * 0.27, lineHeight: size * 0.3 }}>
          {text}
        </AppText>
      </View>
    </Animated.View>
  );
}
