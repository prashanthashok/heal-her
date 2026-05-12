'use client';

import { useMemo } from 'react';
import { energyDotColor, type TrackerEntry } from '@/lib/tracker';

interface Props {
  year: number;
  month: number; // 0-based
  entries: Record<string, TrackerEntry>;
  selected: string | null;
  onSelect: (date: string) => void;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

function padDate(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export function MonthCalendar({ year, month, entries, selected, onSelect }: Props) {
  const today = new Date().toISOString().split('T')[0];

  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const result: Array<{ date: string; day: number } | null> = [];
    for (let i = 0; i < firstDay; i++) result.push(null);
    for (let d = 1; d <= daysInMonth; d++) result.push({ day: d, date: padDate(year, month, d) });
    return result;
  }, [year, month]);

  return (
    <div className="space-y-3">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map(w => (
          <div key={w} className="text-center text-[10px] font-bold text-charcoal/35 uppercase tracking-wide py-1">
            {w}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((cell, i) => {
          if (!cell) return <div key={`empty-${i}`} />;
          const { date, day } = cell;
          const entry = entries[date];
          const isToday = date === today;
          const isSelected = date === selected;
          const isFuture = date > today;

          return (
            <button
              key={date}
              type="button"
              disabled={isFuture}
              onClick={() => !isFuture && onSelect(date)}
              className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl
                          transition-all duration-150
                          ${isSelected ? 'bg-terracotta text-white shadow-sm' : ''}
                          ${isToday && !isSelected ? 'ring-2 ring-terracotta/50' : ''}
                          ${isFuture ? 'opacity-25 cursor-default' : 'cursor-pointer hover:bg-cream-dark'}
                          ${!isSelected && !isToday ? '' : ''}`}
            >
              <span className={`text-xs font-semibold leading-none
                                ${isSelected ? 'text-white'
                                  : isToday ? 'text-terracotta'
                                  : 'text-charcoal'}`}>
                {day}
              </span>
              {/* Entry dot */}
              {entry && (
                <span
                  className={`mt-1 w-1.5 h-1.5 rounded-full transition-all
                              ${isSelected ? 'bg-white/70' : energyDotColor(entry.energy)}`}
                />
              )}
              {!entry && !isFuture && (
                <span className="mt-1 w-1.5 h-1.5" /> // spacer for consistent height
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 pt-2 px-1">
        <span className="text-[10px] text-charcoal/40 font-medium">Energy:</span>
        {[
          { label: 'Low',  color: 'bg-terracotta' },
          { label: 'Mid',  color: 'bg-gold' },
          { label: 'High', color: 'bg-sage' },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-[10px] text-charcoal/40">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export { MONTH_NAMES };
