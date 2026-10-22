import { Image } from 'expo-image';

import { AppText } from './AppText';
import { artSource, type ArtKey } from '@/lib/art';

interface Props {
  name: ArtKey;
  /** Emoji shown when the illustration has not been added yet. */
  fallback: string;
  size: number;
  label?: string;
}

/** Renders a registered illustration, or an emoji placeholder of the same footprint. */
export function Art({ name, fallback, size, label }: Props) {
  const source = artSource(name);
  if (source) {
    return (
      <Image
        source={source}
        contentFit="contain"
        accessibilityLabel={label}
        accessible={!!label}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <AppText
      accessibilityLabel={label}
      accessible={!!label}
      style={{ fontSize: size * 0.8, lineHeight: size, width: size, textAlign: 'center' }}>
      {fallback}
    </AppText>
  );
}
