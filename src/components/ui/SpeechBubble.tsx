import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Colors, Outline, Radius } from '@/constants/theme';

interface Props {
  children: React.ReactNode;
  /** Which side the tail points to (towards the speaker). */
  tail?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
}

/** Comic speech bubble: outlined white box with a diamond tail. */
export function SpeechBubble({ children, tail = 'left', style }: Props) {
  return (
    <View style={[styles.bubble, style]}>
      {children}
      <View style={[styles.tail, tail === 'left' ? { left: -10 } : { right: -10 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    ...Outline,
    borderBottomWidth: 5,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  tail: {
    position: 'absolute',
    bottom: 18,
    width: 18,
    height: 18,
    backgroundColor: Colors.white,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: Colors.ink,
    transform: [{ rotate: '45deg' }],
  },
});
