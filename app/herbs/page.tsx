'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { isOnboardingComplete, getUserProfile } from '@/lib/storage';
import { getProgramPhase, getProgramDay, PROGRAM_PHASE_META } from '@/lib/cycleUtils';
import {
  activeHerbs, sortedHerbs, primaryTiming, toggleHerbCheck, loadCheckedHerbs,
  TIMING_GROUPS, TIMING_META,
  type TimingGroup,
} from '@/lib/herbs';
import { HerbCard } from '@/components/herbs/HerbCard';
import type { ProgramPhase } from '@/lib/types';
import type { Herb } from '@/lib/herbs';

const MONTH_INTRO: Record<ProgramPhase, string> = {
  1: 'Foundation herbs to purify digestion, build stress resilience, and establish your Ayurvedic rhythm.',
  2: 'Adding targeted herbs for insulin sensitivity, androgen reduction, and deeper hormonal rebalancing.',
  3: 'Completing the protocol with uterine tonics and cycle-regulating herbs to consolidate your healing.',
};

const BANNER_COLORS: Record<ProgramPhase, { bg: string; border: string; badge: string }> = {
  1: { bg: 'bg-terracotta/5', border: 'border-terracotta/20', badge: 'bg-terracotta/15 text-terracotta' },
  2: { bg: 'bg-gold/5',       border: 'border-gold/20',       badge: 'bg-gold/15 text-gold-dark' },
  3: { bg: 'bg-sage/5',       border: 'border-sage/20',       badge: 'bg-sage/15 text-sage-dark' },
};

function ProgressBanner({
  month, taken, total, programDay,
}: {
  month: ProgramPhase; taken: number; total: number; programDay: number;
}) {
  const colors = BANNER_COLORS[month];
  const phaseMeta = PROGRAM_PHASE_META[month];
  const pct = total > 0 ? Math.round((taken / total) * 100) : 0;
  const allDone = taken === total;

  return (
    <div className={`rounded-2xl border ${colors.bg} ${colors.border} px-4 py-4 space-y-3`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`label-chip text-[10px] font-bold uppercase tracking-widest ${colors.badge}`}>
              Month {month}
            </span>
            <span className="text-xs text-charcoal/40">Day {programDay} of 90</span>
          </div>
          <p className="text-sm font-semibold text-charcoal">
            {phaseMeta.subtitle} — herbs active
          </p>
          <p className="text-xs text-charcoal/50 mt-0.5 leading-snug">
            {MONTH_INTRO[month]}
          </p>
        </div>
        {/* Count badge */}
        <div className="text-right flex-shrink-0">
          <p className={`text-2xl font-bold ${allDone ? 'text-sage' : 'text-charcoal'}`}>
            {taken}<span className="text-base font-normal text-charcoal/30">/{total}</span>
          </p>
          <p className="text-[10px] text-charcoal/40 font-medium">taken today</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full bg-white/70 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: allDone ? '#7D9B76' : '#C17A5A',
          }}
        />
      </div>

      {allDone && total > 0 && (
        <p className="text-xs font-medium text-sage text-center">
          All herbs taken today 🌿
        </p>
      )}
    </div>
  );
}

export default function HerbsPage() {
  const router = useRouter();
  const [month, setMonth] = useState<ProgramPhase | null>(null);
  const [programDay, setProgramDay] = useState(1);
  const [herbs, setHerbs] = useState<Herb[]>([]);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isOnboardingComplete()) { router.replace('/onboarding'); return; }
    const profile = getUserProfile();
    if (!profile) { router.replace('/onboarding'); return; }

    const currentMonth = getProgramPhase(profile.startDate);
    const day = getProgramDay(profile.startDate);
    const sorted = sortedHerbs(activeHerbs(currentMonth));

    setMonth(currentMonth);
    setProgramDay(day);
    setHerbs(sorted);
    setChecked(loadCheckedHerbs());
    setMounted(true);
  }, [router]);

  const handleToggle = useCallback((id: string) => {
    setChecked(prev => toggleHerbCheck(id, prev));
  }, []);

  if (!mounted || !month) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-terracotta border-t-transparent animate-spin" />
      </div>
    );
  }

  const taken = herbs.filter(h => checked.has(h.id)).length;

  // Group herbs by primary timing
  const grouped: Record<TimingGroup, Herb[]> = {
    morning:      herbs.filter(h => primaryTiming(h.timing) === 'morning'),
    'with meals': herbs.filter(h => primaryTiming(h.timing) === 'with meals'),
    evening:      herbs.filter(h => primaryTiming(h.timing) === 'evening'),
  };

  return (
    <div className="space-y-7 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-charcoal">Herbs</h1>
        <p className="text-charcoal/60 text-sm mt-1">
          Your Ayurvedic herb and supplement schedule.
        </p>
      </div>

      {/* Progress banner */}
      <ProgressBanner
        month={month}
        taken={taken}
        total={herbs.length}
        programDay={programDay}
      />

      {/* Timing groups */}
      {TIMING_GROUPS.map(group => {
        const groupHerbs = grouped[group];
        if (groupHerbs.length === 0) return null;
        const meta = TIMING_META[group];
        const groupDone = groupHerbs.filter(h => checked.has(h.id)).length;

        return (
          <div key={group} className="space-y-3">
            {/* Section header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-7 h-7 rounded-lg ${meta.bg} flex items-center justify-center text-sm`}>
                  {meta.emoji}
                </span>
                <h2 className={`text-sm font-bold uppercase tracking-widest ${meta.color}`}>
                  {meta.label}
                </h2>
              </div>
              <span className={`text-xs font-medium ${groupDone === groupHerbs.length ? 'text-sage' : 'text-charcoal/35'}`}>
                {groupDone}/{groupHerbs.length}
                {groupDone === groupHerbs.length && ' ✓'}
              </span>
            </div>

            {/* Herb cards */}
            <div className="space-y-2">
              {groupHerbs.map(herb => (
                <HerbCard
                  key={herb.id}
                  herb={herb}
                  checked={checked.has(herb.id)}
                  onToggle={() => handleToggle(herb.id)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Future herbs teaser */}
      {month < 3 && (
        <div className="rounded-2xl border border-dashed border-charcoal/15 px-4 py-4 space-y-2">
          <p className="text-xs font-bold text-charcoal/35 uppercase tracking-widest">
            Coming in Month {month + 1}
          </p>
          <p className="text-xs text-charcoal/40 leading-relaxed">
            {month === 1
              ? 'Kanchanaar Guggul, Guduchi, Fenugreek seeds, and Spearmint tea will be added to deepen your protocol.'
              : 'Lodhra, Shatapushpa, and Amla will complete your 3-month Ayurvedic herb cycle.'}
          </p>
        </div>
      )}

      {/* Completion message */}
      {taken === herbs.length && herbs.length > 0 && (
        <div className="card text-center py-6 bg-sage/5 border-sage/20 animate-fade-in-up">
          <p className="text-2xl mb-2">🌿</p>
          <p className="font-semibold text-charcoal text-sm">All herbs taken today</p>
          <p className="text-xs text-charcoal/50 mt-1">Consistency is medicine.</p>
        </div>
      )}
    </div>
  );
}
