import { StyleSheet, Text, type TextProps } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';

type Variant = 'hero' | 'title' | 'heading' | 'body' | 'caption' | 'label' | 'sfx';

interface Props extends TextProps {
  variant?: Variant;
  color?: string;
  center?: boolean;
}

export function AppText({ variant = 'body', color, center, style, ...rest }: Props) {
  return (
    <Text
      {...rest}
      style={[styles[variant], { color: color ?? Colors.ink }, center && styles.center, style]}
    />
  );
}

const styles = StyleSheet.create({
  hero: { fontFamily: Fonts.display, fontSize: 46, lineHeight: 54, letterSpacing: 0.5 },
  title: { fontFamily: Fonts.display, fontSize: 30, lineHeight: 38, letterSpacing: 0.3 },
  heading: { fontFamily: Fonts.display, fontSize: 21, lineHeight: 28 },
  body: { fontFamily: Fonts.regular, fontSize: 17, lineHeight: 26 },
  caption: { fontFamily: Fonts.regular, fontSize: 14, lineHeight: 20 },
  label: { fontFamily: Fonts.display, fontSize: 18, lineHeight: 24, letterSpacing: 0.3 },
  sfx: { fontFamily: Fonts.sfx, fontSize: 30, lineHeight: 34, letterSpacing: 1.5 },
  center: { textAlign: 'center' },
});
