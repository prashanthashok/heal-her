import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/nav/Sidebar';
import { BottomNav } from '@/components/nav/BottomNav';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Heal Her — 90-Day PCOS Healing Program',
  description: 'A personalized 90-day PCOS healing program combining cycle-synced fasting with Ayurvedic principles.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-cream min-h-screen`}>
        <div className="flex min-h-screen">
          {/* Desktop Sidebar */}
          <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-20">
            <Sidebar />
          </aside>

          {/* Main content */}
          <main className="flex-1 md:ml-64 pb-20 md:pb-0">
            <div className="max-w-3xl mx-auto px-4 py-6 md:px-8">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-20">
          <BottomNav />
        </nav>
      </body>
    </html>
  );
}
