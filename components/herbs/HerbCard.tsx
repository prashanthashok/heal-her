'use client';

import { useState } from 'react';
import type { Herb } from '@/lib/herbs';
import { FORM_META } from '@/lib/herbs';

const DOSHA_CHIP: Record<string, string> = {
  vata:  'bg-gold/10 text-gold-dark border border-gold/25',
  pitta: 'bg-terracotta/10 text-terracotta border border-terracotta/25',
  kapha: 'bg-sage/10 text-sage-dark border border-sage/25',
};

const MONTH_BADGE: Record<number, string> = {
  1: 'bg-terracotta/10 text-terracotta',
  2: 'bg-gold/10 text-gold-dark',
  3: 'bg-sage/10 text-sage-dark',
};

interface Props {
  herb: Herb;
  checked: boolean;
  onToggle: () => void;
}

export function HerbCard({ herb, checked, onToggle }: Props) {
  const [expanded, setExpanded] = useState(false);
  const formMeta = FORM_META[herb.form] ?? { label: herb.form, color: 'bg-cream-dark text-charcoal/60' };

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all duration-200
                    ${checked ? 'border-sage/30 bg-white' : 'border-cream-dark/70 bg-white'}
                    ${expanded ? 'shadow-sm' : 'hover:shadow-sm'}`}>

      {/* ── Main row ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3.5">
        {/* Expand toggle (emoji + name area) */}
        <button
          type="button"
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-3 flex-1 min-w-0 text-left"
          aria-expanded={expanded}
        >
          <span className="text-2xl flex-shrink-0">{herb.emoji}</span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className={`text-sm font-semibold leading-tight transition-colors
                            ${checked ? 'text-charcoal/50' : 'text-charcoal'}`}>
                {herb.name}
              </p>
              {herb.month > 1 && (
                <span className={`label-chip text-[9px] font-bold uppercase tracking-wider
                                  ${MONTH_BADGE[herb.month]}`}>
                  Month {herb.month}
                </span>
              )}
            </div>
            <p className={`text-xs mt-0.5 leading-snug transition-colors
                          ${checked ? 'text-charcoal/35 line-through' : 'text-charcoal/55'}`}>
              {herb.purpose}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              <span className={`label-chip text-[9px] font-semibold uppercase tracking-wider ${formMeta.color}`}>
                {formMeta.label}
              </span>
              <span className="text-[10px] text-charcoal/35 font-medium capitalize">
                {herb.timing}
              </span>
            </div>
          </div>

          {/* Expand chevron */}
          <span className={`text-charcoal/25 transition-transform duration-200 flex-shrink-0 text-base ml-1
                            ${expanded ? 'rotate-180' : ''}`}>
            ▾
          </span>
        </button>

        {/* Checkbox */}
        <button
          type="button"
          onClick={onToggle}
          aria-label={checked ? `Uncheck ${herb.name}` : `Check ${herb.name}`}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                      transition-all duration-200
                      ${checked
                        ? 'bg-sage border-sage shadow-sm'
                        : 'border-charcoal/20 hover:border-sage/60'
                      }`}
        >
          {checked && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Expanded content ──────────────────────────────────────────── */}
      {expanded && (
        <div className="px-4 pb-5 space-y-4 border-t border-cream-dark/50 animate-fade-in-up pt-4">

          {/* Sanskrit / botanical name */}
          {herb.sanskritName && (
            <p className="text-[11px] italic text-charcoal/40">{herb.sanskritName}</p>
          )}

          {/* Full description */}
          <p className="text-sm text-charcoal/70 leading-relaxed">{herb.description}</p>

          {/* Dose */}
          <div className="flex items-start gap-2.5 rounded-xl bg-cream-dark/50 px-3.5 py-3">
            <span className="text-base flex-shrink-0">💊</span>
            <div>
              <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-0.5">
                Suggested Dose
              </p>
              <p className="text-xs text-charcoal/70 leading-snug">{herb.dose}</p>
            </div>
          </div>

          {/* Dosha */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-medium text-charcoal/40">Balances:</span>
            {herb.dosha.map(d => (
              <span key={d} className={`label-chip capitalize text-[10px] ${DOSHA_CHIP[d]}`}>
                {d}
              </span>
            ))}
          </div>

          {/* Collapse button */}
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="text-xs text-charcoal/35 hover:text-charcoal/60 transition-colors"
          >
            Show less ▴
          </button>
        </div>
      )}
    </div>
  );
}
