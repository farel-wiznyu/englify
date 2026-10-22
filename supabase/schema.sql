-- Englify schema. Run in the Supabase SQL editor (or `supabase db push`).
-- Prerequisite: Clerk is added as a third-party auth provider in
-- Supabase Dashboard > Authentication > Sign In / Providers > Third-Party Auth.
-- Clerk user ids are TEXT (e.g. user_2abc...), so every owner column is text.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- helpers
create or replace function public.clerk_id() returns text
language sql stable as $$ select auth.jwt()->>'sub' $$;

-- ---------------------------------------------------------------- accounts
create table public.profiles (
  id             uuid primary key default gen_random_uuid(),
  clerk_user_id  text unique not null default public.clerk_id(),
  display_name   text,
  created_at     timestamptz not null default now()
);

create table public.child_profiles (
  id                  uuid primary key default gen_random_uuid(),
  owner_id            text not null default public.clerk_id(),
  nickname            text not null check (char_length(nickname) between 2 and 20),
  age_group           text not null check (age_group in ('4_6', '7_10')),
  avatar_key          text not null,
  daily_goal_minutes  int  not null default 10 check (daily_goal_minutes in (5, 10, 15)),
  created_at          timestamptz not null default now()
);
create index on public.child_profiles (owner_id);

-- ---------------------------------------------------------------- content (read-only for clients)
create table public.categories (
  id          text primary key,
  name        text not null,
  name_id     text not null,
  emoji       text not null,
  color_token text not null,
  sort_order  int  not null default 0
);

create table public.vocabulary_items (
  id               text primary key,
  category_id      text not null references public.categories (id),
  word             text not null,
  translation      text not null,
  emoji            text,
  example_sentence text,
  image_url        text,
  audio_url        text,
  difficulty       int not null default 1,
  sort_order       int not null default 0
);
create index on public.vocabulary_items (category_id);

create table public.lessons (
  id                text primary key,
  category_id       text not null references public.categories (id),
  title             text not null,
  description       text,
  estimated_minutes int  not null default 5,
  sort_order        int  not null default 0
);

create table public.lesson_items (
  lesson_id          text not null references public.lessons (id) on delete cascade,
  vocabulary_item_id text not null references public.vocabulary_items (id) on delete cascade,
  sort_order         int  not null default 0,
  primary key (lesson_id, vocabulary_item_id)
);

-- ---------------------------------------------------------------- child data
-- owner_id is denormalised onto every table so RLS is a single indexed comparison
-- instead of a join through child_profiles.

create table public.child_progress (
  child_id           uuid not null references public.child_profiles (id) on delete cascade,
  vocabulary_item_id text not null references public.vocabulary_items (id) on delete cascade,
  owner_id           text not null default public.clerk_id(),
  status             text not null default 'new' check (status in ('new', 'learning', 'mastered', 'review')),
  listen_count       int  not null default 0,
  practice_count     int  not null default 0,
  correct_count      int  not null default 0,
  wrong_count        int  not null default 0,
  mastery_score      real generated always as (
                       case when correct_count + wrong_count = 0 then 0
                            else correct_count::real / (correct_count + wrong_count) end) stored,
  last_practiced_at  timestamptz not null default now(),
  primary key (child_id, vocabulary_item_id)
);
create index on public.child_progress (owner_id);

create table public.lesson_progress (
  child_id     uuid not null references public.child_profiles (id) on delete cascade,
  lesson_id    text not null references public.lessons (id) on delete cascade,
  owner_id     text not null default public.clerk_id(),
  stars        int  not null check (stars between 1 and 3),
  completed_at timestamptz not null default now(),
  primary key (child_id, lesson_id)
);
create index on public.lesson_progress (owner_id);

-- Self-rated pronunciation practice. No audio is uploaded.
create table public.pronunciation_attempts (
  id                 uuid primary key default gen_random_uuid(),
  child_id           uuid not null references public.child_profiles (id) on delete cascade,
  vocabulary_item_id text not null references public.vocabulary_items (id) on delete cascade,
  owner_id           text not null default public.clerk_id(),
  self_rating        text not null check (self_rating in ('good', 'again')),
  created_at         timestamptz not null default now()
);
create index on public.pronunciation_attempts (owner_id, child_id);

create table public.game_sessions (
  id               uuid primary key default gen_random_uuid(),
  child_id         uuid not null references public.child_profiles (id) on delete cascade,
  owner_id         text not null default public.clerk_id(),
  game_type        text not null check (game_type in ('match', 'listen', 'memory')),
  category_id      text,
  score            int  not null,
  total_questions  int  not null,
  stars            int  not null check (stars between 1 and 3),
  duration_seconds int  not null default 0,
  completed_at     timestamptz not null default now()
);
create index on public.game_sessions (owner_id, child_id, completed_at desc);

-- Per-answer rows so the Parent Area can show which words need more practice.
create table public.game_answers (
  id                 uuid primary key default gen_random_uuid(),
  game_session_id    uuid not null references public.game_sessions (id) on delete cascade,
  vocabulary_item_id text not null references public.vocabulary_items (id) on delete cascade,
  owner_id           text not null default public.clerk_id(),
  correct            boolean not null
);
create index on public.game_answers (owner_id);

-- activity_date is the child's local calendar date (Asia/Jakarta), not a UTC timestamp,
-- so streaks do not break around midnight.
create table public.daily_activity (
  child_id      uuid not null references public.child_profiles (id) on delete cascade,
  activity_date date not null,
  owner_id      text not null default public.clerk_id(),
  seconds_spent int  not null default 0,
  lessons_completed int not null default 0,
  games_completed   int not null default 0,
  primary key (child_id, activity_date)
);
create index on public.daily_activity (owner_id);

-- ---------------------------------------------------------------- RLS
alter table public.profiles               enable row level security;
alter table public.child_profiles         enable row level security;
alter table public.categories             enable row level security;
alter table public.vocabulary_items       enable row level security;
alter table public.lessons                enable row level security;
alter table public.lesson_items           enable row level security;
alter table public.child_progress         enable row level security;
alter table public.lesson_progress        enable row level security;
alter table public.pronunciation_attempts enable row level security;
alter table public.game_sessions          enable row level security;
alter table public.game_answers           enable row level security;
alter table public.daily_activity         enable row level security;

-- Content: any signed-in user can read, nobody can write from the client
-- (seed with the service role / SQL editor).
create policy "content read" on public.categories       for select to authenticated using (true);
create policy "content read" on public.vocabulary_items for select to authenticated using (true);
create policy "content read" on public.lessons          for select to authenticated using (true);
create policy "content read" on public.lesson_items     for select to authenticated using (true);

-- profiles: a user sees and edits only their own row.
create policy "own profile select" on public.profiles for select to authenticated
  using (clerk_user_id = (select public.clerk_id()));
create policy "own profile insert" on public.profiles for insert to authenticated
  with check (clerk_user_id = (select public.clerk_id()));
create policy "own profile update" on public.profiles for update to authenticated
  using (clerk_user_id = (select public.clerk_id()))
  with check (clerk_user_id = (select public.clerk_id()));

create policy "own profile delete" on public.profiles for delete to authenticated
  using (clerk_user_id = (select public.clerk_id()));

-- child_profiles: full CRUD on own rows.
create policy "own children all" on public.child_profiles for all to authenticated
  using (owner_id = (select public.clerk_id()))
  with check (owner_id = (select public.clerk_id()));

-- Child data tables: same owner check, and the referenced child must also belong to the caller.
do $$
declare t text;
begin
  foreach t in array array[
    'child_progress', 'lesson_progress', 'pronunciation_attempts', 'game_sessions', 'daily_activity'
  ] loop
    execute format($f$
      create policy "own rows all" on public.%I for all to authenticated
      using (owner_id = (select public.clerk_id()))
      with check (
        owner_id = (select public.clerk_id())
        and exists (
          select 1 from public.child_profiles c
          where c.id = child_id and c.owner_id = (select public.clerk_id())
        )
      )$f$, t);
  end loop;
end $$;

create policy "own answers all" on public.game_answers for all to authenticated
  using (owner_id = (select public.clerk_id()))
  with check (
    owner_id = (select public.clerk_id())
    and exists (
      select 1 from public.game_sessions g
      where g.id = game_session_id and g.owner_id = (select public.clerk_id())
    )
  );

-- ---------------------------------------------------------------- storage
-- Public-read bucket for vocabulary audio/images (non-sensitive content). Writes need the service role.
insert into storage.buckets (id, name, public)
values ('vocab-audio', 'vocab-audio', true)
on conflict (id) do nothing;
