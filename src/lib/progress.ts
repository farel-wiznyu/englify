import type { VocabProgress, VocabStatus } from '@/data/types';

export const emptyProgress = (): VocabProgress => ({
  status: 'new',
  listenCount: 0,
  practiceCount: 0,
  correct: 0,
  wrong: 0,
  lastPracticedAt: new Date().toISOString(),
});

/** 0..1 — share of correct answers, 0 until the child has been tested. */
export function masteryScore(p: VocabProgress): number {
  const total = p.correct + p.wrong;
  return total === 0 ? 0 : p.correct / total;
}

/**
 * Status rules:
 * - mastered: at least 3 correct answers and >= 80% accuracy
 * - review: tested at least twice and accuracy below 50%
 * - learning: heard or practiced at least once
 * - new: untouched
 */
export function deriveStatus(p: VocabProgress): VocabStatus {
  const total = p.correct + p.wrong;
  if (p.correct >= 3 && masteryScore(p) >= 0.8) return 'mastered';
  if (total >= 2 && masteryScore(p) < 0.5) return 'review';
  if (p.listenCount > 0 || p.practiceCount > 0 || total > 0) return 'learning';
  return 'new';
}

export const dateKey = (d = new Date()) => {
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

/** Consecutive active days ending today (or yesterday, so an unfinished day does not reset the streak). */
export function computeStreak(activeDates: string[]): number {
  const set = new Set(activeDates);
  const cursor = new Date();
  if (!set.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (set.has(dateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function starsFor(score: number, total: number): 1 | 2 | 3 {
  const ratio = total === 0 ? 0 : score / total;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.6) return 2;
  return 1;
}
