import { useRouter } from 'next/navigation';
import type { UserProfile } from '@/lib/types';
import { DOSHA_META } from '@/lib/cycleUtils';
import { getCycleDay, getCyclePhase, CYCLE_PHASE_META } from '@/lib/cycleUtils';

interface WelcomeScreenProps {
  profile: UserProfile;
}

export function WelcomeScreen({ profile }: WelcomeScreenProps) {
  const router = useRouter();
  const dosha = DOSHA_META[profile.dosha];
  const cycleDay = getCycleDay(profile.lastPeriodDate);
  const phase = getCyclePhase(cycleDay);
  const phaseMeta = CYCLE_PHASE_META[phase];

  const phaseColors: Record<string, string> = {
    power: 'bg-sage/10 text-sage-dark border-sage/20',
    manifestation: 'bg-gold/10 text-gold-dark border-gold/20',
    nurture: 'bg-terracotta/10 text-terracotta border-terracotta/20',
  };

  return (
    <div className="space-y-8 animate-fade-in-up text-center">
      {/* Greeting */}
      <div className="space-y-3 pt-4">
        <div className="text-5xl mb-2">🌺</div>
        <h2 className="text-3xl font-semibold text-charcoal">
          Welcome, {profile.name} ✦
        </h2>
        <p className="text-charcoal/60 text-sm leading-relaxed max-w-xs mx-auto">
          Your healing journey begins today. Here&apos;s a glimpse of what we know about you so far.
        </p>
      </div>

      {/* Dosha card */}
      <div className="rounded-2xl bg-white border border-cream-dark/50 p-5 text-left space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{dosha.emoji}</span>
          <div>
            <p className="font-semibold text-charcoal">{dosha.title}</p>
            <p className="text-xs text-charcoal/50">{dosha.tagline}</p>
          </div>
        </div>
        <p className="text-sm text-charcoal/70 leading-relaxed">{dosha.description}</p>
        <div className="space-y-2 pt-1">
          {dosha.tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="text-terracotta mt-0.5 text-xs">✦</span>
              <span className="text-xs text-charcoal/60 leading-snug">{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cycle phase card */}
      <div className="rounded-2xl bg-white border border-cream-dark/50 p-5 text-left space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-charcoal">Current Cycle Phase</p>
          <span className={`label-chip border ${phaseColors[phase]}`}>
            Day {cycleDay}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-charcoal">{phaseMeta.label}</p>
          <p className="text-xs text-charcoal/50 mt-0.5">{phaseMeta.days}</p>
        </div>
        <p className="text-xs text-charcoal/60 leading-relaxed">{phaseMeta.description}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-charcoal/40">Today&apos;s fasting window:</span>
          <span className="text-xs font-semibold text-sage">{phaseMeta.fastingWindow}</span>
        </div>
      </div>

      {/* Symptoms summary */}
      {profile.symptoms.length > 0 && (
        <div className="rounded-2xl bg-white border border-cream-dark/50 p-4 text-left space-y-2.5 shadow-sm">
          <p className="text-sm font-semibold text-charcoal">Symptoms we&apos;ll address</p>
          <div className="flex flex-wrap gap-2">
            {profile.symptoms.map(s => (
              <span key={s} className="label-chip bg-cream-dark text-charcoal/70">
                {s.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={() => router.replace('/')}
        className="w-full btn-primary py-4 text-base rounded-2xl shadow-sm"
      >
        Begin my 90-day journey →
      </button>

      <p className="text-xs text-charcoal/30 pb-4">
        All data is stored privately on your device only.
      </p>
    </div>
  );
}
