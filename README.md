# Englify (mobile)

English learning app for kids 4–10. Expo SDK 57 + TypeScript + Expo Router, Clerk (OAuth), Supabase.
Runs in **Expo Go** (no dev build needed for the MVP).

## Run

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go. The Expo Go version on the phone must match the SDK.

Without any `.env` the app runs in **local mode**: no login, progress saved on-device (AsyncStorage),
pronunciation audio falls back to on-device TTS. Add keys to switch on the real services.

## Configure services

1. Copy `.env.example` to `.env` and fill `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`,
   `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
2. Clerk: enable Google under *User & Authentication > Social connections*. In development the
   Google sign-in uses Clerk's shared credentials, so it works in Expo Go.
3. Supabase: run `supabase/schema.sql`, then `supabase/seed.sql` in the SQL editor. Add Clerk as a
   *Third-Party Auth* provider (Authentication > Sign In / Providers).
4. Audio: copy `scripts/.env.example` to `scripts/.env` (Google TTS key + Supabase service role key),
   then `node --env-file=scripts/.env scripts/generate-audio.mjs`. Afterwards run
   `node scripts/build-seed.mjs` to refresh `seed.sql` with the audio URLs.

## Sync (local-first)

The UI always reads the on-device store. When signed in with Clerk and Supabase is configured,
`src/hooks/useSync.ts` pushes changes 8 s after the last change, when the app goes to the
background, and before logout. Pushes are idempotent upserts, so retries are safe. On a new phone
the child profile and progress are pulled from the server. Parent Area shows the sync status and
has *Keluar akun*, *Hapus progres* (also clears the server copy) and *Hapus akun & semua data*.

Clerk -> Supabase checklist:
1. Clerk dashboard > Integrations > Supabase > activate (adds the `role: authenticated` claim) and
   copy the Clerk domain.
2. Supabase > Authentication > Sign In / Providers > Third-Party Auth > add Clerk with that domain.
3. Clerk > User & Authentication > enable "Allow users to delete their accounts" (needed for
   account deletion).
4. Run `supabase/schema.sql`, then `supabase/seed.sql`.

Not synced yet: individual pronunciation attempts and per-answer game rows (the aggregate counts
in `child_progress` are synced).

## Content

`src/data/vocabulary.json` is the single source of truth (64 words, 8 categories, 8 lessons).
It is generated from `scripts/build-vocab.mjs`. Pictures are emoji placeholders until real
illustrations are added (`image_url` column is ready).

## Status of the PRD

Done in code: onboarding + child profile, Clerk Google sign-in (when keyed), Home, Learn, lesson
cards with audio, self-rated pronunciation practice, 3 games (Match, Listen & Choose, Memory),
stars/badges/streak, parent gate (multiplication), Parent Area (summary, daily goal, reset, logout).

Not wired yet: syncing progress to Supabase (progress is local-first for now), real illustrations,
privacy policy / terms links, account deletion.
