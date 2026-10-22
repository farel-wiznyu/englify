import { useMemo } from 'react';

import { lessons, vocabItems } from '@/data/content';
import { computeStreak, dateKey } from '@/lib/progress';
import { useAppStore } from '@/store/useAppStore';

export function useStats() {
  const vocab = useAppStore((s) => s.vocab);
  const lessonStars = useAppStore((s) => s.lessonStars);
  const activity = useAppStore((s) => s.activity);
  const games = useAppStore((s) => s.games);
  const goal = useAppStore((s) => s.child?.dailyGoalMinutes ?? 10);

  return useMemo(() => {
    const entries = Object.entries(vocab);
    const learned = entries.filter(([, p]) => p.status !== 'new').length;
    const mastered = entries.filter(([, p]) => p.status === 'mastered').length;
    const needsReview = entries.filter(([, p]) => p.status === 'review').map(([id]) => id);

    const todaySeconds = activity[dateKey()]?.seconds ?? 0;
    const todayMinutes = Math.floor(todaySeconds / 60);
    const goalRatio = Math.min(1, todaySeconds / 60 / goal);

    const activeDates = Object.entries(activity)
      .filter(([, d]) => d.seconds > 0 || d.lessons > 0 || d.games > 0)
      .map(([k]) => k);

    const lessonsDone = Object.keys(lessonStars).length;
    const nextLesson = lessons.find((l) => !lessonStars[l.id]) ?? lessons[0];

    const perCategory = new Map<string, { total: number; mastered: number; learned: number }>();
    for (const item of vocabItems) {
      const row = perCategory.get(item.categoryId) ?? { total: 0, mastered: 0, learned: 0 };
      row.total += 1;
      const status = vocab[item.id]?.status ?? 'new';
      if (status === 'mastered') row.mastered += 1;
      if (status !== 'new') row.learned += 1;
      perCategory.set(item.categoryId, row);
    }

    return {
      learned,
      mastered,
      needsReview,
      todayMinutes,
      goalRatio,
      streak: computeStreak(activeDates),
      lessonsDone,
      lessonsTotal: lessons.length,
      nextLesson,
      perCategory,
      gamesPlayed: games.length,
      starsTotal: Object.values(lessonStars).reduce<number>((a, s) => a + s, 0) +
        games.reduce((a, g) => a + g.stars, 0),
    };
  }, [vocab, lessonStars, activity, games, goal]);
}
