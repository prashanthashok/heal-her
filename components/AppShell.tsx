'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/nav/Sidebar';
import { BottomNav } from '@/components/nav/BottomNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOnboarding = pathname.startsWith('/onboarding');

  if (isOnboarding) {
    return (
      <div className="min-h-screen bg-cream">
        {children}
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
          {children}
        </div>
      </main>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20">
        <BottomNav />
      </nav>
    </div>
  );
}
