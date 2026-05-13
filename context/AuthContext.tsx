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
    // Consume any pending redirect result and surface errors to the login page
    getSignInRedirectResult().catch((err: { code?: string }) => {
      if (err?.code !== 'auth/missing-initial-state') {
        setRedirectError('Sign in failed. Please try again.');
      }
    });

    return onAuthChange(async (u) => {
      setCurrentUid(u?.uid ?? null);
      if (u) {
        const hasCloudData = await hydrateFromFirestore(u.uid);
        if (!hasCloudData) {
          // User has no cloud data — if they completed onboarding locally first,
          // push that data up now so it's available on all devices.
          const hasLocalData = !!localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
          if (hasLocalData) {
            await pushToFirestore(u.uid);
          }
        }
      }
      setUser(u);
      setLoading(false);
    });
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
