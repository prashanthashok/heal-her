'use client';

import {
  createContext, useContext, useEffect, useState,
  type ReactNode,
} from 'react';
import type { User } from 'firebase/auth';
import { onAuthChange, signInWithGoogle, signOut, getSignInRedirectResult } from '@/lib/auth';
import { setCurrentUid } from '@/lib/uid';
import { hydrateFromFirestore, pushToFirestore } from '@/lib/sync';
import { STORAGE_KEYS } from '@/lib/storage';

interface AuthState {
  user: User | null;
  loading: boolean;
  redirectError: string;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  redirectError: '',
  signIn: signInWithGoogle,
  logOut: signOut,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirectError, setRedirectError] = useState('');

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function init() {
      // IMPORTANT: await the redirect result BEFORE subscribing to onAuthStateChanged.
      // If we subscribe first, Firebase fires onAuthStateChanged(null) while still
      // processing the redirect — loading flips false, AppShell sees no user, and
      // redirects back to /login, which breaks the redirect state (infinite loop).
      try {
        await getSignInRedirectResult();
      } catch (err: unknown) {
        const code = (err as { code?: string })?.code;
        if (code && code !== 'auth/missing-initial-state') {
          setRedirectError('Sign in failed. Please try again.');
        }
      }

      // By the time we subscribe here, Firebase has finished processing the
      // redirect and onAuthStateChanged delivers the correct signed-in state.
      unsubscribe = onAuthChange(async (u) => {
        setCurrentUid(u?.uid ?? null);
        if (u) {
          const hasCloudData = await hydrateFromFirestore(u.uid);
          if (!hasCloudData) {
            // Completed onboarding locally before signing in — auto-upload
            const hasLocalData = !!localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
            if (hasLocalData) await pushToFirestore(u.uid);
          }
        }
        setUser(u);
        setLoading(false);
      });
    }

    init();
    return () => unsubscribe?.();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, redirectError, signIn: signInWithGoogle, logOut: signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
