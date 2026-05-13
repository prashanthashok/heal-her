import {
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth } from './firebase';

const provider = new GoogleAuthProvider();

/** Redirects the whole page to Google sign-in. Returns void — result is handled on the next page load via getSignInRedirectResult(). */
export async function signInWithGoogle(): Promise<void> {
  await signInWithRedirect(auth, provider);
}

/** Call once on app load to retrieve the result of a pending redirect sign-in. Returns the user if returning from Google, null otherwise. */
export async function getSignInRedirectResult(): Promise<User | null> {
  const result = await getRedirectResult(auth);
  return result?.user ?? null;
}

export async function signOut(): Promise<void> {
  await fbSignOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}
