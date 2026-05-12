import { getCycleDay, getCyclePhase, CYCLE_PHASE_META } from '@/lib/cycleUtils';

interface Step2Props {
  lastPeriodDate: string;
  onChange: (date: string) => void;
}

export function Step2Period({ lastPeriodDate, onChange }: Step2Props) {
  const today = new Date().toISOString().split('T')[0];

  const cycleDay = lastPeriodDate ? getCycleDay(lastPeriodDate) : null;
  const phase = cycleDay ? getCyclePhase(cycleDay) : null;
  const phaseMeta = phase ? CYCLE_PHASE_META[phase] : null;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-sage/10 flex items-center justify-center text-2xl mb-4">
          🌙
        </div>
        <h2 className="text-2xl font-semibold text-charcoal">Your Cycle</h2>
        <p className="text-charcoal/60 text-sm leading-relaxed">
          Knowing where you are in your cycle lets us personalise your fasting windows and meal plan from day one.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-charcoal" htmlFor="periodDate">
            First day of your last period
          </label>
          <p className="text-xs text-charcoal/50">
            This is day 1 of the cycle that&apos;s most recently started
          </p>
          <input
            id="periodDate"
            type="date"
            value={lastPeriodDate}
            max={today}
            onChange={e => onChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-white text-charcoal
                       focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage
                       transition-all text-sm"
          />
        </div>

        {/* Live preview */}
        {phaseMeta && cycleDay && (
          <div className="rounded-2xl bg-white border border-cream-dark/50 p-4 space-y-3 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-charcoal/50 uppercase tracking-wide">
                You&apos;re currently in
              </span>
              <span className="text-xs font-semibold text-terracotta">
                Cycle day {cycleDay}
              </span>
            </div>
            <div>
              <p className="font-semibold text-charcoal">{phaseMeta.label}</p>
              <p className="text-xs text-charcoal/50 mt-0.5">{phaseMeta.days}</p>
            </div>
            <p className="text-xs text-charcoal/60 leading-relaxed">{phaseMeta.description}</p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-charcoal/40">Fasting window:</span>
              <span className="text-xs font-semibold text-sage">{phaseMeta.fastingWindow}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
