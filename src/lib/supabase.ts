import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = !!url && !!anonKey;

type TokenGetter = () => Promise<string | null>;

/**
 * Clerk is registered in Supabase as a third-party auth provider, so every request
 * carries the Clerk session token and RLS reads `auth.jwt()->>'sub'`.
 * Returns null when env vars are missing so the app can run fully offline in dev.
 */
export function createSupabaseClient(getToken: TokenGetter) {
  if (!supabaseConfigured) return null;
  return createClient(url!, anonKey!, {
    accessToken: async () => (await getToken()) ?? null,
  });
}
