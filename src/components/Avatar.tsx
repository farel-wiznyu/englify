import { Image } from 'expo-image';
import { memo } from 'react';

import { AppText } from '@/components/ui';
import { avatarSource } from '@/lib/art';

interface Props {
  /** Avatar key ("bear"), or an emoji from profiles created before the illustrated avatars. */
  value: string | undefined | null;
  size: number;
}

export const Avatar = memo(function Avatar({ value, size }: Props) {
  const source = avatarSource(value);
  if (source) {
    return <Image source={source} contentFit="contain" accessible={false} style={{ width: size, height: size }} />;
  }
  return (
    <AppText accessible={false} style={{ fontSize: size * 0.7, lineHeight: size, width: size, textAlign: 'center' }}>
      {value || '🙂'}
    </AppText>
  );
});
