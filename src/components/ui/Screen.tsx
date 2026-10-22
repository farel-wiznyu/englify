import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ComicBackdrop } from './ComicBackdrop';
import { Colors, type ColorToken } from '@/constants/theme';

interface Props {
  children: React.ReactNode;
  scroll?: boolean;
  /** Page colour. Cream is the calm default; saturated tones get the comic backdrop. */
  tone?: ColorToken;
  /** Override for the backdrop (defaults to on for every tone except cream). */
  decor?: boolean;
  padded?: boolean;
}

export function Screen({ children, scroll = true, tone = 'cream', decor, padded = true }: Props) {
  const insets = useSafeAreaInsets();
  const showDecor = decor ?? tone !== 'cream';
  const pad = { paddingTop: insets.top + 8, paddingHorizontal: padded ? 20 : 0 };
  return (
    <View style={[styles.flex, { backgroundColor: Colors[tone] }]}>
      {showDecor && <ComicBackdrop />}
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[pad, { paddingBottom: 32, gap: 16 }]}
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, pad, { gap: 16 }]}>{children}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
