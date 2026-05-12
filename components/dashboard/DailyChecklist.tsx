'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  CHECKLIST_ITEMS,
  SECTION_META,
  loadCompletedIds,
  saveCompletedIds,
  type ChecklistSection,
} from '@/lib/checklist';
import { ProgressRing } from './ProgressRing';

const SECTIONS: ChecklistSection[] = ['morning', 'daytime', 'evening'];

export function DailyChecklist() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCompleted(loadCompletedIds());
    setMounted(true);
  }, []);

  const toggle = useCallback((id: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      saveCompletedIds(next);
      return next;
    });
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 rounded-xl bg-white border border-cream-dark/30 animate-pulse" />
        ))}
      </div>
    );
  }

  const total = CHECKLIST_ITEMS.length;
  const doneCount = CHECKLIST_ITEMS.filter(item => completed.has(item.id)).length;

  return (
    <div className="space-y-6">
      {/* Progress header */}
      <div className="card">
        <ProgressRing completed={doneCount} total={total} />
        {/* Mini progress bar */}
        <div className="mt-4 h-1.5 w-full bg-cream-dark rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${total > 0 ? (doneCount / total) * 100 : 0}%`,
              backgroundColor: doneCount === total ? '#7D9B76' : '#C17A5A',
            }}
          />
        </div>
      </div>

      {/* Sections */}
      {SECTIONS.map(section => {
        const items = CHECKLIST_ITEMS.filter(i => i.section === section);
        const meta = SECTION_META[section];
        const sectionDone = items.filter(i => completed.has(i.id)).length;
        const allDone = sectionDone === items.length;

        return (
          <div key={section} className="space-y-2">
            {/* Section header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold uppercase tracking-widest ${meta.color}`}>
                  {meta.label}
                </span>
              </div>
              <span className={`text-xs font-medium ${allDone ? 'text-sage' : 'text-charcoal/35'}`}>
                {sectionDone}/{items.length}
                {allDone && ' ✓'}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-2">
              {items.map(item => {
                const done = completed.has(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggle(item.id)}
                    className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl border text-left
                                transition-all duration-200 group active:scale-[0.985]
                                ${done
                                  ? 'bg-white border-charcoal/8 opacity-75'
                                  : 'bg-white border-cream-dark/60 hover:border-terracotta/30 hover:shadow-sm'
                                }`}
                  >
                    {/* Checkbox */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                                  transition-all duration-250
                                  ${done
                                    ? 'bg-sage border-sage'
                                    : 'border-charcoal/20 group-hover:border-terracotta/50'
                                  }`}
                    >
                      {done && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                          <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.8"
                                strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>

                    {/* Emoji */}
                    <span className={`text-lg flex-shrink-0 transition-opacity ${done ? 'opacity-50' : ''}`}>
                      {item.emoji}
                    </span>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-medium leading-tight transition-all duration-200
                                    ${done ? 'line-through text-charcoal/40' : 'text-charcoal'}`}>
                        {item.label}
                      </p>
                      {item.sub && (
                        <p className={`text-xs mt-0.5 transition-opacity ${done ? 'opacity-0' : 'text-charcoal/40'}`}>
                          {item.sub}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* All-done celebration */}
      {doneCount === total && total > 0 && (
        <div className="card text-center py-6 bg-sage/5 border-sage/20 animate-fade-in-up">
          <p className="text-2xl mb-2">🌺</p>
          <p className="font-semibold text-charcoal text-sm">Your ritual is complete today</p>
          <p className="text-xs text-charcoal/50 mt-1">Every day you show up is a day you heal.</p>
        </div>
      )}
    </div>
  );
}
