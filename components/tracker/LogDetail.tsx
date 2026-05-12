import {
  BLEEDING_META, ENERGY_EMOJIS, MOOD_EMOJIS, type TrackerEntry,
} from '@/lib/tracker';

interface Props {
  entry: TrackerEntry;
  onEdit: () => void;
}

export function LogDetail({ entry, onEdit }: Props) {
  const bleeding = BLEEDING_META[entry.bleeding];

  return (
    <div className="card space-y-5 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-charcoal/40 uppercase tracking-wide font-medium mb-0.5">
            Entry
          </p>
          <p className="font-semibold text-charcoal">
            {new Date(entry.date + 'T12:00:00').toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric',
            })}
          </p>
          <p className="text-xs text-charcoal/50 mt-0.5">Cycle day {entry.cycleDay}</p>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs font-medium text-terracotta hover:underline"
        >
          Edit
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {/* Bleeding */}
        <div className="rounded-xl bg-cream-dark/50 p-3 text-center space-y-1">
          <div className={`w-3 h-3 rounded-full mx-auto ${bleeding.dot}`} />
          <p className="text-[11px] text-charcoal/50 font-medium">Flow</p>
          <p className={`text-xs font-semibold ${bleeding.color}`}>{bleeding.label}</p>
        </div>
        {/* Energy */}
        <div className="rounded-xl bg-cream-dark/50 p-3 text-center space-y-1">
          <p className="text-xl">{ENERGY_EMOJIS[entry.energy]}</p>
          <p className="text-[11px] text-charcoal/50 font-medium">Energy</p>
          <p className="text-xs font-semibold text-charcoal">{entry.energy}/5</p>
        </div>
        {/* Mood */}
        <div className="rounded-xl bg-cream-dark/50 p-3 text-center space-y-1">
          <p className="text-xl">{MOOD_EMOJIS[entry.mood]}</p>
          <p className="text-[11px] text-charcoal/50 font-medium">Mood</p>
          <p className="text-xs font-semibold text-charcoal">{entry.mood}/5</p>
        </div>
      </div>

      {/* Fasting */}
      {entry.fastingHours > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-sage/8 border border-sage/20">
          <span>⏱️</span>
          <span className="text-sm font-medium text-sage-dark">{entry.fastingHours} hours fasted</span>
        </div>
      )}

      {/* Symptoms */}
      {entry.symptoms.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-charcoal/50 uppercase tracking-wide">Symptoms</p>
          <div className="flex flex-wrap gap-1.5">
            {entry.symptoms.map(s => (
              <span key={s} className="label-chip bg-terracotta/8 text-terracotta border border-terracotta/20">
                {s.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {entry.notes.trim() && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-charcoal/50 uppercase tracking-wide">Notes</p>
          <p className="text-sm text-charcoal/70 leading-relaxed whitespace-pre-line">
            {entry.notes}
          </p>
        </div>
      )}
    </div>
  );
}
