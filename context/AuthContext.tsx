'use client';

import {
  createContext, useContext, useEffect, useState,
  type ReactNode,
} from 'react';
import type { User } from 'firebase/auth';
import { onAuthChange, signInWithGoogle, signOut } from '@/lib/auth';
import { setCurrentUid } from '@/lib/uid';
import { hydrateFromFirestore } from '@/lib/sync';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<User>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  signIn: signInWithGoogle,
  logOut: signOut,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthChange(async (u) => {
      setUser(u);
      setCurrentUid(u?.uid ?? null);
      if (u) {
        // Hydrate localStorage from Firestore on every session start.
        // This ensures cross-device data is available to all sync reads.
        await hydrateFromFirestore(u.uid);
      }
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn: signInWithGoogle, logOut: signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
