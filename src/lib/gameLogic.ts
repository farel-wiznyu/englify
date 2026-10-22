import { getCategoryItems, vocabItems } from '@/data/content';
import type { AgeGroup, VocabItem } from '@/data/types';

export function shuffle<T>(list: readonly T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface Question {
  target: VocabItem;
  options: VocabItem[];
}

/** 4 options for older kids, 3 for the youngest, distractors drawn from the same pool. */
export function buildQuestions(pool: VocabItem[], count: number, ageGroup: AgeGroup): Question[] {
  const optionCount = ageGroup === '4_6' ? 3 : 4;
  const targets = shuffle(pool).slice(0, Math.min(count, pool.length));
  return targets.map((target) => {
    const distractors = shuffle(pool.filter((p) => p.id !== target.id)).slice(0, optionCount - 1);
    return { target, options: shuffle([target, ...distractors]) };
  });
}

export function poolFor(categoryId: string | undefined): VocabItem[] {
  if (!categoryId || categoryId === 'all') return vocabItems;
  return getCategoryItems(categoryId);
}

export interface MemoryCard {
  key: string;
  vocabId: string;
  kind: 'word' | 'picture';
  item: VocabItem;
}

export function buildMemoryDeck(pool: VocabItem[], pairs: number): MemoryCard[] {
  const chosen = shuffle(pool).slice(0, pairs);
  const cards: MemoryCard[] = chosen.flatMap((item) => [
    { key: `${item.id}-w`, vocabId: item.id, kind: 'word' as const, item },
    { key: `${item.id}-p`, vocabId: item.id, kind: 'picture' as const, item },
  ]);
  return shuffle(cards);
}
