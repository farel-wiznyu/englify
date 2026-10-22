import { ClerkProvider, useAuth, useUser } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { createContext, useContext, useMemo } from 'react';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export const clerkConfigured = !!publishableKey;

interface AuthValue {
  /** false while Clerk is still restoring the session. */
  ready: boolean;
  signedIn: boolean;
  /** true when no Clerk key is set: the app runs locally without login. */
  devMode: boolean;
  userId: string | null;
  getToken: () => Promise<string | null>;
  signOut: () => Promise<void>;
  /** Deletes the Clerk user (requires "Allow users to delete their accounts" in the Clerk dashboard). */
  deleteClerkUser: () => Promise<void>;
}

const devValue: AuthValue = {
  ready: true,
  signedIn: true,
  devMode: true,
  userId: null,
  getToken: async () => null,
  signOut: async () => {},
  deleteClerkUser: async () => {},
};

const AuthContext = createContext<AuthValue>(devValue);

export const useAppAuth = () => useContext(AuthContext);

function ClerkBridge({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, userId, getToken, signOut } = useAuth();
  const { user } = useUser();
  const value = useMemo<AuthValue>(
    () => ({
      ready: isLoaded,
      signedIn: !!isSignedIn,
      devMode: false,
      userId: userId ?? null,
      getToken: () => getToken(),
      signOut: () => signOut(),
      deleteClerkUser: async () => {
        await user?.delete();
      },
    }),
    [isLoaded, isSignedIn, userId, getToken, signOut, user],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (!publishableKey) {
    return <AuthContext.Provider value={devValue}>{children}</AuthContext.Provider>;
  }
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkBridge>{children}</ClerkBridge>
    </ClerkProvider>
  );
}
