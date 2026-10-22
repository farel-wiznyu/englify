import type { ImageSource } from 'expo-image';

import { artSources, avatarSources, badgeSources, vocabSources } from './art.generated';

/**
 * Illustrated assets live in `assets/art` and `assets/vocab`. `art.generated.ts` is rewritten by
 * `scripts/process-assets.mjs` and only lists files that exist, so anything not drawn yet simply
 * returns null here and the UI falls back to an emoji.
 */
export type ArtKey =
  | 'mascot-happy'
  | 'mascot-cheer'
  | 'mascot-think'
  | 'mascot-listen'
  | 'mascot-speak'
  | 'signin-scene'
  | 'ollie-base'
  | 'onboard-vocab'
  | 'onboard-speak'
  | 'onboard-games'
  | 'state-offline'
  | 'state-mic'
  | 'state-empty'
  | 'trophy'
  | 'balloon'
  | 'medal'
  | 'game-match'
  | 'game-listen'
  | 'game-memory'
  | 'memory-card-back';

export type AvatarKey = 'bear' | 'cat' | 'dog' | 'fox' | 'lion' | 'panda';
export const avatarKeys: AvatarKey[] = ['bear', 'cat', 'dog', 'fox', 'lion', 'panda'];

export type BadgeKey = 'crown' | 'fire' | 'heart' | 'lightning' | 'star' | 'trophy';

export const artSource = (key: ArtKey): ImageSource | null => artSources[key] ?? null;

/** `value` is an avatar key (e.g. "bear"); profiles saved earlier hold an emoji instead, which has no source. */
export const avatarSource = (value: string | undefined | null): ImageSource | null =>
  value ? (avatarSources[`avatar-${value}`] ?? null) : null;

export const badgeSource = (key: BadgeKey): ImageSource | null => badgeSources[`badge-${key}`] ?? null;

export const vocabSource = (id: string): ImageSource | null => vocabSources[id] ?? null;
