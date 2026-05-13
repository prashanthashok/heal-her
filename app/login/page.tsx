'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, redirectError, signIn } = useAuth();

  // Redirect to home once auth settles
  useEffect(() => {
    if (!loading && user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  if (loading) return null;

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

          {redirectError && (
            <p className="text-xs text-red-500 text-center">{redirectError}</p>
          )}

          <button
            type="button"
            onClick={signIn}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl
                       border border-cream-dark bg-white text-charcoal text-sm font-medium
                       hover:bg-cream transition-colors shadow-sm"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="text-center text-[10px] text-charcoal/30 leading-relaxed">
          Your data is stored securely and never shared.
        </p>
      </div>
    </div>
  );
}
