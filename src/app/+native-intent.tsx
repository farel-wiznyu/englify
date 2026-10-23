import { logFlow } from '@/lib/authFlow';

/**
 * Android re-opens the app with `englify://` when Google hands control back after sign-in. Expo Router
 * would read that as a navigation to "/" and re-mount the sign-in screen, wiping the login that is still
 * in flight. While the app is already open we send that link to a neutral screen instead.
 *
 * The incoming `path` is not always a clean path: for the bare scheme it arrives as "englify:",
 * "englify://" or "/", so all of those count as the OAuth return link.
 */
export function redirectSystemPath({ path, initial }: { path: string; initial: boolean }) {
  try {
    // The query string carries a one-time token: only record whether it is there, never its value.
    const hasNonce = path.includes('rotating_token_nonce');
    const bare = path.split('?')[0];
    void logFlow(`deep link diterima initial=${initial} path=${bare || '/'} nonce=${hasNonce ? 'ada' : 'tidak'}`);
    const isSchemeOnly = /^(englify:\/{0,3})?\/?$/i.test(bare);
    if (!initial && isSchemeOnly) return '/sso-callback';
    return path;
  } catch {
    return path;
  }
}
