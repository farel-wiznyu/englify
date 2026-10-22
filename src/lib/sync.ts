import type { SupabaseClient } from '@supabase/supabase-js';

import type { AgeGroup, ChildProfile, GameResult, GameType, VocabProgress, VocabStatus } from '@/data/types';
import type { RemoteSnapshot } from '@/store/useAppStore';
import { useAppStore } from '@/store/useAppStore';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function check(label: string, error: { message: string } | null) {
  if (error) throw new Error(`${label}: ${error.message}`);
}

/** Creates the parent's profiles row on first login (RLS: clerk_user_id must equal the token sub). */
export async function ensureProfile(sb: SupabaseClient) {
  const { error } = await sb
    .from('profiles')
    .upsert({ display_name: null }, { onConflict: 'clerk_user_id', ignoreDuplicates: true });
  check('profiles', error);
}

/** Reads the parent's first child and all their progress. Returns null if none exists yet. */
export async function pullSnapshot(sb: SupabaseClient): Promise<RemoteSnapshot | null> {
  const { data: children, error } = await sb
    .from('child_profiles')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(1);
  check('child_profiles', error);
  const row = children?.[0];
  if (!row) return null;

  const [progress, lessons, days, games] = await Promise.all([
    sb.from('child_progress').select('*').eq('child_id', row.id),
    sb.from('lesson_progress').select('*').eq('child_id', row.id),
    sb.from('daily_activity').select('*').eq('child_id', row.id),
    sb.from('game_sessions').select('*').eq('child_id', row.id).order('completed_at', { ascending: false }).limit(50),
  ]);
  check('child_progress', progress.error);
  check('lesson_progress', lessons.error);
  check('daily_activity', days.error);
  check('game_sessions', games.error);

  const vocab: Record<string, VocabProgress> = {};
  for (const p of progress.data ?? []) {
    vocab[p.vocabulary_item_id] = {
      status: p.status as VocabStatus,
      listenCount: p.listen_count,
      practiceCount: p.practice_count,
      correct: p.correct_count,
      wrong: p.wrong_count,
      lastPracticedAt: p.last_practiced_at,
    };
  }
  const lessonStars: RemoteSnapshot['lessonStars'] = {};
  for (const l of lessons.data ?? []) lessonStars[l.lesson_id] = l.stars;
  const activity: RemoteSnapshot['activity'] = {};
  for (const d of days.data ?? []) {
    activity[d.activity_date] = { seconds: d.seconds_spent, lessons: d.lessons_completed, games: d.games_completed };
  }

  return {
    childId: row.id,
    child: {
      nickname: row.nickname,
      ageGroup: row.age_group as AgeGroup,
      avatar: row.avatar_key,
      dailyGoalMinutes: row.daily_goal_minutes,
    } satisfies ChildProfile,
    vocab,
    lessonStars,
    activity,
    games: (games.data ?? []).map(
      (g): GameResult => ({
        id: g.id,
        gameType: g.game_type as GameType,
        categoryId: g.category_id ?? 'all',
        score: g.score,
        total: g.total_questions,
        stars: g.stars,
        completedAt: g.completed_at,
        synced: true,
      }),
    ),
  };
}

/**
 * Pushes everything changed since the last successful push. All writes are upserts keyed on
 * stable ids, so a retry after a failure (or a half-finished push) is safe.
 */
export async function pushChanges(sb: SupabaseClient) {
  const startedAt = new Date().toISOString();
  const s = useAppStore.getState();
  if (!s.child || !s.childId) return;
  const childId = s.childId;
  const since = s.lastSyncAt;

  check(
    'child_profiles',
    (
      await sb.from('child_profiles').upsert({
        id: childId,
        nickname: s.child.nickname,
        age_group: s.child.ageGroup,
        avatar_key: s.child.avatar,
        daily_goal_minutes: s.child.dailyGoalMinutes,
      })
    ).error,
  );

  const progressRows = Object.entries(s.vocab)
    .filter(([, p]) => !since || p.lastPracticedAt > since)
    .map(([vocabId, p]) => ({
      child_id: childId,
      vocabulary_item_id: vocabId,
      status: p.status,
      listen_count: p.listenCount,
      practice_count: p.practiceCount,
      correct_count: p.correct,
      wrong_count: p.wrong,
      last_practiced_at: p.lastPracticedAt,
    }));
  if (progressRows.length) {
    check('child_progress', (await sb.from('child_progress').upsert(progressRows, { onConflict: 'child_id,vocabulary_item_id' })).error);
  }

  const lessonRows = Object.entries(s.lessonStars).map(([lessonId, stars]) => ({
    child_id: childId,
    lesson_id: lessonId,
    stars,
  }));
  if (lessonRows.length) {
    check('lesson_progress', (await sb.from('lesson_progress').upsert(lessonRows, { onConflict: 'child_id,lesson_id' })).error);
  }

  // Resend the day before the last sync too, in case the previous push landed mid-day.
  const sinceDay = since ? new Date(new Date(since).getTime() - 86400000) : null;
  const sinceKey = sinceDay
    ? `${sinceDay.getFullYear()}-${`${sinceDay.getMonth() + 1}`.padStart(2, '0')}-${`${sinceDay.getDate()}`.padStart(2, '0')}`
    : null;
  const dayRows = Object.entries(s.activity)
    .filter(([date]) => !sinceKey || date >= sinceKey)
    .map(([date, d]) => ({
      child_id: childId,
      activity_date: date,
      seconds_spent: d.seconds,
      lessons_completed: d.lessons,
      games_completed: d.games,
    }));
  if (dayRows.length) {
    check('daily_activity', (await sb.from('daily_activity').upsert(dayRows, { onConflict: 'child_id,activity_date' })).error);
  }

  const pending = s.games.filter((g) => !g.synced);
  const valid = pending.filter((g) => UUID.test(g.id));
  if (valid.length) {
    check(
      'game_sessions',
      (
        await sb.from('game_sessions').upsert(
          valid.map((g) => ({
            id: g.id,
            child_id: childId,
            game_type: g.gameType,
            category_id: g.categoryId === 'all' ? null : g.categoryId,
            score: g.score,
            total_questions: g.total,
            stars: g.stars,
            completed_at: g.completedAt,
          })),
          { onConflict: 'id' },
        )
      ).error,
    );
  }

  // Rows with legacy non-uuid ids can never be sent; mark them done so they do not block the queue.
  useAppStore.getState().markSynced(startedAt, pending.map((g) => g.id));
}

/** Clears the child's learning history on the server (profile row stays). */
export async function resetRemoteProgress(sb: SupabaseClient, childId: string) {
  for (const table of ['child_progress', 'lesson_progress', 'daily_activity', 'game_sessions'] as const) {
    check(table, (await sb.from(table).delete().eq('child_id', childId)).error);
  }
}

/** Deletes all of this parent's server-side data (RLS limits every delete to their own rows). */
export async function deleteRemoteData(sb: SupabaseClient) {
  check('child_profiles', (await sb.from('child_profiles').delete().not('id', 'is', null)).error);
  check('profiles', (await sb.from('profiles').delete().not('id', 'is', null)).error);
}
