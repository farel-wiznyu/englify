import type { ColorToken } from '@/constants/theme';

export type AgeGroup = '4_6' | '7_10';
export type VocabStatus = 'new' | 'learning' | 'mastered' | 'review';
export type GameType = 'match' | 'listen' | 'memory';

export interface Category {
  id: string;
  name: string;
  nameId: string;
  emoji: string;
  color: ColorToken;
}

export interface VocabItem {
  id: string;
  categoryId: string;
  word: string;
  translation: string;
  emoji: string;
  example?: string;
  /** Filled after running scripts/generate-audio.mjs; falls back to on-device TTS. */
  audioUrl?: string;
}

export interface Lesson {
  id: string;
  categoryId: string;
  title: string;
  itemIds: string[];
  estimatedMinutes: number;
}

export interface ChildProfile {
  nickname: string;
  ageGroup: AgeGroup;
  avatar: string;
  dailyGoalMinutes: 5 | 10 | 15;
}

export interface GameResult {
  id: string;
  gameType: GameType;
  categoryId: string;
  score: number;
  total: number;
  stars: 1 | 2 | 3;
  completedAt: string;
  /** true once the row reached Supabase. */
  synced?: boolean;
}

export interface VocabProgress {
  status: VocabStatus;
  listenCount: number;
  practiceCount: number;
  correct: number;
  wrong: number;
  lastPracticedAt: string;
}
