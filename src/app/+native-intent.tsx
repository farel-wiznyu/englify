import { logFlow } from '@/lib/authFlow';

/**
 * Android re-opens the app with `englify://` when Google hands control back after sign-in. Expo Router
 * would read that as a navigation to "/" and re-mount the sign-in screen, wiping the login that is still
 * in flight. While the app is already open we send that link to a neutral screen instead.
 */
export function redirectSystemPath({ path, initial }: { path: string; initial: boolean }) {
  try {
    // The query string can carry a one-time token: never log or inspect it.
    const bare = path.split('?')[0].replace(/^[a-z][a-z0-9+.-]*:\/\//i, '');
    void logFlow(`deep link diterima initial=${initial} path=${bare || '/'}`);
    if (!initial && (bare === '' || bare === '/')) return '/sso-callback';
    return path;
  } catch {
    return path;
  }
}
