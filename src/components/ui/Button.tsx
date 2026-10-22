import * as Haptics from 'expo-haptics';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from './AppText';
import { PressableScale } from './PressableScale';
import { Colors, Outline, Radius, TouchTarget } from '@/constants/theme';

type Kind = 'primary' | 'secondary' | 'yellow';

interface Props {
  label: string;
  onPress: () => void;
  kind?: Kind;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const fill: Record<Kind, string> = {
  primary: Colors.ink,
  secondary: Colors.white,
  yellow: Colors.yellow,
};

export function Button({ label, onPress, kind = 'primary', disabled, style }: Props) {
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress();
      }}
      style={[styles.base, { backgroundColor: fill[kind], opacity: disabled ? 0.45 : 1 }, style]}>
      <AppText variant="label" color={kind === 'primary' ? Colors.white : Colors.ink}>
        {label}
      </AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    ...Outline,
    // Thicker bottom edge gives a "pressable key" look without extra views or blurry shadows.
    borderBottomWidth: 6,
    minHeight: TouchTarget,
    borderRadius: Radius.pill,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
