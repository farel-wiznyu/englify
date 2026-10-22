import { Image } from 'expo-image';
import { memo } from 'react';

import { AppText } from '@/components/ui';
import type { VocabItem } from '@/data/types';
import { vocabSource } from '@/lib/art';

interface Props {
  item: Pick<VocabItem, 'id' | 'emoji'>;
  size: number;
}

/** The picture for a vocabulary word: the illustration when it exists, otherwise its emoji. */
export const VocabArt = memo(function VocabArt({ item, size }: Props) {
  const source = vocabSource(item.id);
  if (source) {
    return <Image source={source} contentFit="contain" accessible={false} style={{ width: size, height: size }} />;
  }
  return (
    <AppText
      accessible={false}
      style={{ fontSize: size * 0.72, lineHeight: size, width: size, textAlign: 'center' }}>
      {item.emoji}
    </AppText>
  );
});
