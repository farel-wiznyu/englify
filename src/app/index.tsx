import { Redirect } from 'expo-router';

import { useAppAuth } from '@/lib/auth';
import { useAppStore } from '@/store/useAppStore';

/** Entry gate: parent signs in first, then sets up the child profile, then the app opens. */
export default function Index() {
  const { ready, signedIn } = useAppAuth();
  const child = useAppStore((s) => s.child);

  if (!ready) return null;
  if (!signedIn) return <Redirect href="/sign-in" />;
  if (!child) return <Redirect href="/onboarding" />;
  return <Redirect href="/(tabs)" />;
}
