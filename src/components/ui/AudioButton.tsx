import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { AppText } from './AppText';
import { PressableScale } from './PressableScale';
import { Colors, Outline } from '@/constants/theme';
import { usePulse } from '@/lib/motion';

interface Props {
  onPress: () => void;
  size?: number;
  label?: string;
}

export function AudioButton({ onPress, size = 72, label = 'Dengarkan' }: Props) {
  const icon = usePulse(1.25);
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      pressedScale={0.92}
      onPress={() => {
        icon.trigger();
        onPress();
      }}
      style={[styles.btn, { width: size, height: size, borderRadius: size / 2 }]}>
      <Animated.View style={icon.style}>
        <AppText style={{ fontSize: size * 0.45, lineHeight: size * 0.6 }}>🔊</AppText>
      </Animated.View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  btn: {
    ...Outline,
    borderBottomWidth: 5,
    backgroundColor: Colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
