import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { PressableScale } from './PressableScale';
import { Colors, Outline, Radius, type ColorToken } from '@/constants/theme';

interface Props {
  tone?: ColorToken | 'white';
  onPress?: () => void;
  /** Resting tilt in degrees, like a sticker stuck on the page. */
  tilt?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  accessibilityLabel?: string;
}

export function Card({ tone = 'white', onPress, tilt = 0, style, children, accessibilityLabel }: Props) {
  const base = [styles.card, { backgroundColor: Colors[tone] }, style];
  if (!onPress) {
    return <View style={[base, tilt ? { transform: [{ rotate: `${tilt}deg` }] } : null]}>{children}</View>;
  }
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      pressedScale={0.975}
      rotate={tilt}
      style={base}>
      {children}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: { ...Outline, borderBottomWidth: 6, borderRadius: Radius.lg, padding: 16 },
});
