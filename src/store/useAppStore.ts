import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { ChildProfile, GameResult, VocabProgress } from '@/data/types';
import { dateKey, deriveStatus, emptyProgress } from '@/lib/progress';

export interface DayActivity {
  seconds: number;
  lessons: number;
  games: number;
}

export interface RemoteSnapshot {
  childId: string;
  child: ChildProfile;
  vocab: Record<string, VocabProgress>;
  lessonStars: Record<string, 1 | 2 | 3>;
  games: GameResult[];
  activity: Record<string, DayActivity>;
}

interface AppState {
  child: ChildProfile | null;
  vocab: Record<string, VocabProgress>;
  lessonStars: Record<string, 1 | 2 | 3>;
  games: GameResult[];
  activity: Record<string, DayActivity>;

  /** Supabase child_profiles.id (client-generated uuid so retries are idempotent). */
  childId: string | null;
  /** ISO time of the last successful push; rows touched after it are pending. */
  lastSyncAt: string | null;

  setChild: (child: ChildProfile | null) => void;
  updateGoal: (minutes: ChildProfile['dailyGoalMinutes']) => void;
  markListened: (vocabId: string) => void;
  markPracticed: (vocabId: string) => void;
  recordAnswer: (vocabId: string, correct: boolean) => void;
  completeLesson: (lessonId: string, stars: 1 | 2 | 3) => void;
  addGameResult: (r: GameResult) => void;
  addSeconds: (seconds: number) => void;
  resetChildData: () => void;

  setChildId: (id: string) => void;
  markSynced: (at: string, gameIds: string[]) => void;
  hydrateFromRemote: (snapshot: RemoteSnapshot) => void;
  /** Wipes everything that belongs to the signed-in parent (logout / account deletion). */
  clearAll: () => void;
}

const touch = (p: VocabProgress | undefined, patch: Partial<VocabProgress>): VocabProgress => {
  const next = { ...(p ?? emptyProgress()), ...patch, lastPracticedAt: new Date().toISOString() };
  next.status = deriveStatus(next);
  return next;
};

const bumpDay = (
  activity: Record<string, DayActivity>,
  patch: Partial<DayActivity>,
): Record<string, DayActivity> => {
  const key = dateKey();
  const day = activity[key] ?? { seconds: 0, lessons: 0, games: 0 };
  return {
    ...activity,
    [key]: {
      seconds: day.seconds + (patch.seconds ?? 0),
      lessons: day.lessons + (patch.lessons ?? 0),
      games: day.games + (patch.games ?? 0),
    },
  };
};

const emptyData = {
  vocab: {},
  lessonStars: {},
  games: [],
  activity: {},
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      child: null,
      ...emptyData,
      childId: null,
      lastSyncAt: null,

      setChild: (child) => set({ child }),
      updateGoal: (minutes) =>
        set((s) => (s.child ? { child: { ...s.child, dailyGoalMinutes: minutes } } : s)),

      markListened: (id) =>
        set((s) => ({
          vocab: {
            ...s.vocab,
            [id]: touch(s.vocab[id], { listenCount: (s.vocab[id]?.listenCount ?? 0) + 1 }),
          },
        })),
      markPracticed: (id) =>
        set((s) => ({
          vocab: {
            ...s.vocab,
            [id]: touch(s.vocab[id], { practiceCount: (s.vocab[id]?.practiceCount ?? 0) + 1 }),
          },
        })),
      recordAnswer: (id, correct) =>
        set((s) => {
          const p = s.vocab[id] ?? emptyProgress();
          return {
            vocab: {
              ...s.vocab,
              [id]: touch(p, correct ? { correct: p.correct + 1 } : { wrong: p.wrong + 1 }),
            },
          };
        }),

      completeLesson: (lessonId, stars) =>
        set((s) => {
          const first = !s.lessonStars[lessonId];
          return {
            lessonStars: {
              ...s.lessonStars,
              [lessonId]: Math.max(stars, s.lessonStars[lessonId] ?? 0) as 1 | 2 | 3,
            },
            activity: bumpDay(s.activity, { lessons: first ? 1 : 0 }),
          };
        }),

      addGameResult: (r) =>
        set((s) => ({
          games: [r, ...s.games].slice(0, 200),
          activity: bumpDay(s.activity, { games: 1 }),
        })),

      addSeconds: (seconds) => set((s) => ({ activity: bumpDay(s.activity, { seconds }) })),

      resetChildData: () => set({ ...emptyData, lastSyncAt: null }),

      setChildId: (id) => set({ childId: id }),
      markSynced: (at, gameIds) =>
        set((s) => ({
          lastSyncAt: at,
          games: s.games.map((g) => (gameIds.includes(g.id) ? { ...g, synced: true } : g)),
        })),
      hydrateFromRemote: (snap) =>
        set({
          childId: snap.childId,
          child: snap.child,
          vocab: snap.vocab,
          lessonStars: snap.lessonStars,
          games: snap.games,
          activity: snap.activity,
          lastSyncAt: new Date().toISOString(),
        }),
      clearAll: () => set({ child: null, ...emptyData, childId: null, lastSyncAt: null }),
    }),
    {
      name: 'englify-store-v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
