'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithGoogle } from '@/lib/auth';
import { fsGetProfile } from '@/lib/firestore';
import { pushToFirestore } from '@/lib/sync';
import { STORAGE_KEYS } from '@/lib/storage';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [showMigration, setShowMigration] = useState(false);
  const [pendingUid, setPendingUid] = useState<string | null>(null);
  const [error, setError] = useState('');

  // If already logged in, redirect to home
  useEffect(() => {
    if (!loading && user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  async function handleSignIn() {
    setSigningIn(true);
    setError('');
    try {
      const u = await signInWithGoogle();

      // Check if this user already has cloud data
      const cloudProfile = await fsGetProfile(u.uid);

      if (cloudProfile) {
        // AuthContext will hydrate localStorage; just go home
        router.replace('/');
        return;
      }

      // No cloud data — check if there's existing local data to migrate
      const hasLocalData = !!localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (hasLocalData) {
        setPendingUid(u.uid);
        setShowMigration(true);
      } else {
        router.replace('/onboarding');
      }
    } catch {
      setError('Sign in failed. Please try again.');
      setSigningIn(false);
    }
  }

  async function handleMigrate() {
    if (!pendingUid) return;
    setMigrating(true);
    try {
      await pushToFirestore(pendingUid);
      router.replace('/');
    } catch {
      setError('Migration failed. Please try again.');
      setMigrating(false);
    }
  }

  function handleSkipMigration() {
    router.replace('/onboarding');
  }

  if (loading) return null;

  if (showMigration) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-5">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-8 space-y-5 text-center">
          <span className="text-4xl">📲</span>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-charcoal">Upload your existing data?</h2>
            <p className="text-sm text-charcoal/60 leading-relaxed">
              We found existing Heal Her data on this device. Upload it to the cloud so
              it&apos;s accessible on any device you sign into.
            </p>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleMigrate}
              disabled={migrating}
              className="w-full py-3 rounded-xl bg-terracotta text-white text-sm font-semibold
                         hover:bg-terracotta/90 transition-colors disabled:opacity-60"
            >
              {migrating ? 'Uploading…' : 'Yes, upload my data'}
            </button>
            <button
              type="button"
              onClick={handleSkipMigration}
              disabled={migrating}
              className="w-full py-3 rounded-xl bg-cream-dark text-charcoal text-sm font-medium
                         hover:bg-cream-dark/80 transition-colors"
            >
              Start fresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm space-y-8">

        {/* Branding */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-terracotta flex items-center justify-center mx-auto shadow-md">
            <span className="text-white text-2xl font-bold">H</span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-charcoal">Heal Her</h1>
            <p className="text-charcoal/55 text-sm mt-1">90-Day PCOS Healing Program</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6">
          <div className="text-center space-y-1.5">
            <h2 className="text-base font-semibold text-charcoal">Sign in to sync your data</h2>
            <p className="text-xs text-charcoal/50 leading-relaxed">
              Your progress, journal, and tracker stay with you across any device or browser.
            </p>
          </div>

          {error && (
            <p className="text-xs text-red-500 text-center">{error}</p>
          )}

          <button
            type="button"
            onClick={handleSignIn}
            disabled={signingIn}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl
                       border border-cream-dark bg-white text-charcoal text-sm font-medium
                       hover:bg-cream transition-colors disabled:opacity-60 shadow-sm"
          >
            {/* Google logo */}
            <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {signingIn ? 'Signing in…' : 'Continue with Google'}
          </button>
        </div>

        <p className="text-center text-[10px] text-charcoal/30 leading-relaxed">
          Your data is stored securely and never shared.
        </p>
      </div>
    </div>
  );
}
