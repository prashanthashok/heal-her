'use client';

interface ProgressRingProps {
  completed: number;
  total: number;
}

const R = 30;
const STROKE = 5;
const SIZE = (R + STROKE) * 2 + 4; // 74
const CX = SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

function motivationalLabel(pct: number): string {
  if (pct === 0)   return 'Start your ritual ✦';
  if (pct < 0.5)   return 'Keep going ✦';
  if (pct < 1)     return 'Almost there ✦';
  return 'Ritual complete 🌺';
}

export function ProgressRing({ completed, total }: ProgressRingProps) {
  const pct = total > 0 ? completed / total : 0;
  const offset = CIRCUMFERENCE * (1 - pct);
  const isComplete = pct === 1;

  return (
    <div className="flex items-center gap-4">
      {/* Ring */}
      <div className="relative flex-shrink-0">
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="block"
          aria-label={`${completed} of ${total} items complete`}
        >
          {/* Track */}
          <circle
            cx={CX} cy={CX} r={R}
            fill="none"
            stroke="#F5E8D4"
            strokeWidth={STROKE}
          />
          {/* Progress arc */}
          <circle
            cx={CX} cy={CX} r={R}
            fill="none"
            stroke={isComplete ? '#7D9B76' : '#C17A5A'}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${CX} ${CX})`}
            style={{ transition: 'stroke-dashoffset 0.55s ease-out, stroke 0.3s' }}
          />
          {/* Center count */}
          <text
            x={CX} y={CX - 4}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="14"
            fontWeight="600"
            fill={isComplete ? '#627A5C' : '#C17A5A'}
            fontFamily="system-ui, sans-serif"
          >
            {completed}
          </text>
          <text
            x={CX} y={CX + 10}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="9"
            fill="#3D353580"
            fontFamily="system-ui, sans-serif"
          >
            of {total}
          </text>
        </svg>
      </div>

      {/* Label block */}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-charcoal leading-tight">
          {completed === total && total > 0
            ? 'All done today!'
            : `${completed} of ${total} complete`}
        </p>
        <p className={`text-xs mt-0.5 ${isComplete ? 'text-sage' : 'text-charcoal/50'}`}>
          {motivationalLabel(pct)}
        </p>
      </div>
    </div>
  );
}
