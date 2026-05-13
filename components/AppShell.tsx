'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/nav/Sidebar';
import { BottomNav } from '@/components/nav/BottomNav';
import { useAuth } from '@/context/AuthContext';
import { isOnboardingComplete } from '@/lib/storage';

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/login', '/onboarding'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  const isPublic = PUBLIC_ROUTES.some(r => pathname.startsWith(r));

  useEffect(() => {
    if (loading || isPublic) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (!isOnboardingComplete()) {
      router.replace('/onboarding');
    }
  }, [user, loading, isPublic, router]);

  // Public routes render without nav or auth checks
  if (isPublic) {
    return (
      <div className="min-h-screen bg-cream">
        {children}
      </div>
    );
  }

  // Show spinner while auth + hydration completes
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-7 h-7 rounded-full border-2 border-terracotta border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-20">
        <Sidebar />
      </aside>
      <main className="flex-1 md:ml-64 pb-20 md:pb-0">
        <div className="max-w-3xl mx-auto px-4 py-6 md:px-8">
          <div key={pathname} className="animate-page-in">
            {children}
          </div>
        </div>
      </main>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20">
        <BottomNav />
      </nav>
    </div>
  );
}
