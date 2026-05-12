interface StepIndicatorProps {
  current: number; // 1-based
  total: number;
  labels: string[];
}

export function StepIndicator({ current, total, labels }: StepIndicatorProps) {
  const pct = Math.round(((current - 1) / (total - 1)) * 100);

  return (
    <div className="w-full space-y-3">
      {/* Step label */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-charcoal/60">
          Step {current} of {total}
        </span>
        <span className="font-semibold text-terracotta">{labels[current - 1]}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full bg-cream-dark rounded-full overflow-hidden">
        <div
          className="h-full bg-terracotta rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Dots */}
      <div className="flex items-center justify-between px-0.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i < current
                ? 'w-2 h-2 bg-terracotta'
                : i === current
                ? 'w-2 h-2 bg-terracotta/30'
                : 'w-1.5 h-1.5 bg-charcoal/15'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
