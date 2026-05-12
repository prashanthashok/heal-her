'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isOnboardingComplete, getUserProfile } from '@/lib/storage';
import { getCycleDay, getCyclePhase, CYCLE_PHASE_META, getProgramPhase, getProgramDay, PROGRAM_PHASE_META } from '@/lib/cycleUtils';

export default function HomePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [userName, setUserName] = useState('');
  const [cyclePhaseLabel, setCyclePhaseLabel] = useState('');
  const [programPhaseLabel, setProgramPhaseLabel] = useState('');
  const [programDay, setProgramDay] = useState(0);
  const [fastingWindow, setFastingWindow] = useState('');

  useEffect(() => {
    if (!isOnboardingComplete()) {
      router.replace('/onboarding');
      return;
    }
    const profile = getUserProfile();
    if (profile) {
      setUserName(profile.name);
      const cycleDay = getCycleDay(profile.lastPeriodDate);
      const phase = getCyclePhase(cycleDay);
      const phaseMeta = CYCLE_PHASE_META[phase];
      setCyclePhaseLabel(phaseMeta.label);
      setFastingWindow(phaseMeta.fastingWindow);
      const pPhase = getProgramPhase(profile.startDate);
      const pMeta = PROGRAM_PHASE_META[pPhase];
      setProgramPhaseLabel(`${pMeta.label}: ${pMeta.subtitle}`);
      setProgramDay(getProgramDay(profile.startDate));
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-terracotta border-t-transparent animate-spin" />
      </div>
    );
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-charcoal">
          {greeting}{userName ? `, ${userName}` : ''} ✦
        </h1>
        <p className="text-charcoal/60 text-sm mt-1">{programPhaseLabel}</p>
      </div>

      {/* At-a-glance cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card space-y-1">
          <p className="text-xs text-charcoal/40 uppercase tracking-wide font-medium">Day</p>
          <p className="text-3xl font-semibold text-terracotta">{programDay}</p>
          <p className="text-xs text-charcoal/50">of 90</p>
        </div>
        <div className="card space-y-1">
          <p className="text-xs text-charcoal/40 uppercase tracking-wide font-medium">Cycle Phase</p>
          <p className="text-sm font-semibold text-charcoal leading-tight">{cyclePhaseLabel}</p>
          <p className="text-xs text-sage font-medium">Fast {fastingWindow}</p>
        </div>
      </div>

      {/* Quick nav cards */}
      <div>
        <h2 className="section-title mb-3">Today&apos;s Focus</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { emoji: '📅', label: 'Tracker',  sub: 'Log today',          href: '/tracker',  bg: 'bg-sage/10' },
            { emoji: '🍲', label: 'Meals',    sub: "This week's plan",    href: '/meals',    bg: 'bg-terracotta/10' },
            { emoji: '🌿', label: 'Herbs',    sub: 'Daily schedule',      href: '/herbs',    bg: 'bg-gold/10' },
            { emoji: '📖', label: 'Learn',    sub: 'PCOS + Ayurveda',     href: '/learn',    bg: 'bg-charcoal/5' },
          ].map(({ emoji, label, sub, href, bg }) => (
            <a
              key={href}
              href={href}
              className={`${bg} rounded-2xl p-4 flex flex-col gap-2 hover:shadow-md transition-shadow duration-200`}
            >
              <span className="text-2xl">{emoji}</span>
              <div>
                <p className="font-semibold text-charcoal text-sm">{label}</p>
                <p className="text-charcoal/50 text-xs">{sub}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Journal shortcut */}
      <a
        href="/journal"
        className="card flex items-center gap-4 hover:shadow-md transition-shadow duration-200"
      >
        <span className="text-2xl">🖊️</span>
        <div className="flex-1">
          <p className="font-semibold text-charcoal text-sm">Journal</p>
          <p className="text-xs text-charcoal/50">Write today&apos;s reflection</p>
        </div>
        <span className="text-charcoal/30 text-lg">→</span>
      </a>
    </div>
  );
}
