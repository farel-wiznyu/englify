import manifest from './audio-manifest.json';
import raw from './vocabulary.json';

import type { Category, Lesson, VocabItem } from './types';
import type { ColorToken } from '@/constants/theme';

const audioById = manifest as Record<string, string>;

export const categories = raw.categories as Category[];
export const vocabItems: VocabItem[] = (raw.items as VocabItem[]).map((v) => ({
  ...v,
  audioUrl: audioById[v.id],
}));
export const lessons = raw.lessons as Lesson[];

const itemMap = new Map(vocabItems.map((v) => [v.id, v]));
const catMap = new Map(categories.map((c) => [c.id, c]));

export const getItem = (id: string) => itemMap.get(id);
export const getCategory = (id: string) => catMap.get(id);
export const getLesson = (id: string) => lessons.find((l) => l.id === id);
export const getLessonItems = (lesson: Lesson) =>
  lesson.itemIds.map((id) => itemMap.get(id)).filter((v): v is VocabItem => !!v);
export const getCategoryItems = (categoryId: string) =>
  vocabItems.filter((v) => v.categoryId === categoryId);
export const getCategoryLessons = (categoryId: string) =>
  lessons.filter((l) => l.categoryId === categoryId);
export const categoryColor = (id: string): ColorToken => getCategory(id)?.color ?? 'blue';
