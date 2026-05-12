'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isOnboardingComplete, getUserProfile } from '@/lib/storage';
import { getCycleDay, getCyclePhase, CYCLE_PHASE_META } from '@/lib/cycleUtils';
import { getOrCreatePlan, type WeekPlan } from '@/lib/meals';
import { SpiceProtocol } from '@/components/meals/SpiceProtocol';
import { WeeklyPlan } from '@/components/meals/WeeklyPlan';
import type { CyclePhase } from '@/lib/types';

const PHASE_DESCRIPTION: Record<CyclePhase, string> = {
  power:         'Ketobiotic meals this week — high protein, healthy fat, low refined carb.',
  manifestation: 'Balanced, energising meals aligned with your peak-clarity phase.',
  nurture:       'Hormone-feasting meals — root vegetables, whole grains, warming spices.',
};

const PHASE_BADGE: Record<CyclePhase, string> = {
  power:         'bg-sage/15 text-sage-dark border-sage/25',
  manifestation: 'bg-gold/15 text-gold-dark border-gold/25',
  nurture:       'bg-terracotta/15 text-terracotta border-terracotta/25',
};

export default function MealsPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<CyclePhase | null>(null);
  const [cycleDay, setCycleDay] = useState(1);
  const [plan, setPlan] = useState<WeekPlan | null>(null);

  useEffect(() => {
    if (!isOnboardingComplete()) { router.replace('/onboarding'); return; }
    const profile = getUserProfile();
    if (!profile) { router.replace('/onboarding'); return; }

    const day = getCycleDay(profile.lastPeriodDate);
    const currentPhase = getCyclePhase(day);
    setCycleDay(day);
    setPhase(currentPhase);
    setPlan(getOrCreatePlan(currentPhase));
  }, [router]);

  if (!phase || !plan) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-terracotta border-t-transparent animate-spin" />
      </div>
    );
  }

  const phaseMeta = CYCLE_PHASE_META[phase];

  return (
    <div className="space-y-8 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-charcoal">Meals</h1>
        <p className="text-charcoal/60 text-sm mt-1">
          Cycle-synced Ayurvedic meal planning.
        </p>
      </div>

      {/* Phase context banner */}
      <div className={`rounded-2xl border px-4 py-3.5 flex items-center gap-3 ${PHASE_BADGE[phase]}`}
           style={{ background: 'white' }}>
        <span className="text-2xl flex-shrink-0">🌿</span>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-xs font-bold uppercase tracking-widest text-charcoal/50">
              {phaseMeta.label}
            </p>
            <span className={`label-chip text-[10px] border ${PHASE_BADGE[phase]}`}>
              {phaseMeta.days}
            </span>
          </div>
          <p className="text-sm font-medium text-charcoal">{PHASE_DESCRIPTION[phase]}</p>
        </div>
      </div>

      {/* Daily Spice Protocol */}
      <SpiceProtocol />

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-cream-dark" />
        <span className="text-xs text-charcoal/30 font-medium">This week</span>
        <div className="flex-1 h-px bg-cream-dark" />
      </div>

      {/* Weekly plan */}
      <div className="space-y-3">
        <h2 className="section-title">Weekly Meal Plan</h2>
        <p className="text-xs text-charcoal/50">
          Meals auto-generated for your {phaseMeta.label}. Tap any card to read the full recipe, or use Swap ↺ to change a meal.
        </p>
        <WeeklyPlan plan={plan} phase={phase} cycleDay={cycleDay} />
      </div>
    </div>
  );
}
