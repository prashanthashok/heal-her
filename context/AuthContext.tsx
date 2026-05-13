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
    // Consume any pending redirect result; errors surface to the login page.
    // With the /__/auth/* same-origin proxy in next.config.js, this should
    // now reliably resolve the user on return from Google OAuth.
    getSignInRedirectResult().catch((err: { code?: string }) => {
      const code = err?.code;
      if (code && code !== 'auth/missing-initial-state') {
        setRedirectError('Sign in failed. Please try again.');
      }
    });

    // Auth state listener — fires once Firebase has processed the redirect.
    const unsubscribe = onAuthChange(async (u) => {
      setCurrentUid(u?.uid ?? null);
      if (u) {
        const hasCloudData = await hydrateFromFirestore(u.uid);
        if (!hasCloudData) {
          const hasLocalData = !!localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
          if (hasLocalData) await pushToFirestore(u.uid);
        }
      }
      setUser(u);
      setLoading(false);
    });

    return unsubscribe;
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
