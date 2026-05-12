'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isOnboardingComplete, getUserProfile } from '@/lib/storage';
import {
  getCycleDay,
  getCyclePhase,
  CYCLE_PHASE_META,
  getProgramPhase,
  getProgramDay,
  PROGRAM_PHASE_META,
} from '@/lib/cycleUtils';
import { DailyChecklist } from '@/components/dashboard/DailyChecklist';
import type { CyclePhase, ProgramPhase } from '@/lib/types';

const PHASE_BADGE_COLORS: Record<CyclePhase, string> = {
  power:         'bg-sage/15 text-sage-dark border-sage/25',
  manifestation: 'bg-gold/15 text-gold-dark border-gold/25',
  nurture:       'bg-terracotta/15 text-terracotta border-terracotta/25',
};

const PROGRAM_BADGE_COLORS: Record<ProgramPhase, string> = {
  1: 'bg-terracotta/10 text-terracotta-dark',
  2: 'bg-gold/10 text-gold-dark',
  3: 'bg-sage/10 text-sage-dark',
};

const PROGRAM_DESCRIPTIONS: Record<ProgramPhase, string> = {
  1: 'Focus on digestion, reducing inflammation, and establishing your daily rhythm.',
  2: 'Deepening hormonal balance through targeted nutrition and consistent fasting.',
  3: 'Cementing new rhythms and celebrating how far you have come.',
};

interface DashboardData {
  userName: string;
  cyclePhase: CyclePhase;
  cycleDay: number;
  programPhase: ProgramPhase;
  programDay: number;
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomePage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (!isOnboardingComplete()) {
      router.replace('/onboarding');
      return;
    }
    const profile = getUserProfile();
    if (!profile) {
      router.replace('/onboarding');
      return;
    }
    const cycleDay = getCycleDay(profile.lastPeriodDate);
    setData({
      userName: profile.name,
      cyclePhase: getCyclePhase(cycleDay),
      cycleDay,
      programPhase: getProgramPhase(profile.startDate),
      programDay: getProgramDay(profile.startDate),
    });
  }, [router]);

  if (!data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-terracotta border-t-transparent animate-spin" />
      </div>
    );
  }

  const cycleMeta   = CYCLE_PHASE_META[data.cyclePhase];
  const programMeta = PROGRAM_PHASE_META[data.programPhase];

  return (
    <div className="space-y-6 pb-4">
      {/* ── Greeting ────────────────────────────────────────────────── */}
      <div>
        <p className="text-xs font-medium text-charcoal/40 uppercase tracking-wide mb-1">
          {formatDate()}
        </p>
        <h1 className="text-2xl font-semibold text-charcoal">
          {greeting()}, {data.userName} ✦
        </h1>
      </div>

      {/* ── Program progress bar ────────────────────────────────────── */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-charcoal/45">90-Day Program</p>
          <p className="text-xs font-semibold text-charcoal/60">
            Day {data.programDay}
            <span className="font-normal text-charcoal/30"> of 90</span>
          </p>
        </div>
        <div className="h-2 w-full bg-cream-dark rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(100, (data.programDay / 90) * 100)}%`,
              background: 'linear-gradient(90deg, #C17A5A 0%, #C9A84C 60%, #7D9B76 100%)',
            }}
          />
        </div>
      </div>

      {/* ── Phase cards (2-col) ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Program phase */}
        <div className="card space-y-3">
          <div>
            <span className={`label-chip text-[10px] font-bold uppercase tracking-widest
                             ${PROGRAM_BADGE_COLORS[data.programPhase]}`}>
              {programMeta.label}
            </span>
          </div>
          <div>
            <p className="font-semibold text-charcoal text-sm leading-tight">
              {programMeta.subtitle}
            </p>
            <p className="text-xs text-charcoal/50 mt-1 leading-snug">
              {PROGRAM_DESCRIPTIONS[data.programPhase]}
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-charcoal">{data.programDay}</span>
              <span className="text-xs text-charcoal/40">/ 90 days</span>
            </div>
            <div className="h-1.5 w-full bg-cream-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-terracotta rounded-full transition-all duration-700"
                style={{ width: `${(data.programDay / 90) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Cycle phase */}
        <div className="card space-y-3">
          <div>
            <span className={`label-chip text-[10px] font-bold uppercase tracking-widest border
                             ${PHASE_BADGE_COLORS[data.cyclePhase]}`}>
              {cycleMeta.label}
            </span>
          </div>
          <div>
            <p className="font-semibold text-charcoal text-sm leading-tight">
              {cycleMeta.days}
            </p>
            <p className="text-xs text-charcoal/50 mt-1 leading-snug line-clamp-3">
              {cycleMeta.description}
            </p>
          </div>
          <div>
            <p className="text-xs text-charcoal/40">Cycle day</p>
            <p className="text-2xl font-bold text-charcoal">{data.cycleDay}</p>
          </div>
        </div>
      </div>

      {/* ── Fasting window banner ────────────────────────────────────── */}
      <div className={`rounded-2xl px-5 py-4 flex items-center justify-between
                      border ${PHASE_BADGE_COLORS[data.cyclePhase]}`}
           style={{ background: 'white' }}>
        <div className="space-y-0.5">
          <p className="text-xs font-medium text-charcoal/50 uppercase tracking-wide">
            Today&apos;s fasting window
          </p>
          <p className="text-xl font-bold text-charcoal">{cycleMeta.fastingWindow}</p>
          <p className="text-xs text-charcoal/50">
            Aligned with your {cycleMeta.label}
          </p>
        </div>
        <div className="text-4xl">⏱️</div>
      </div>

      {/* ── Daily checklist ──────────────────────────────────────────── */}
      <div className="space-y-3">
        <h2 className="section-title">Today&apos;s Ritual</h2>
        <DailyChecklist />
      </div>
    </div>
  );
}
