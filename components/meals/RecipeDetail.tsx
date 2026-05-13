'use client';

import { useEffect } from 'react';
import type { Recipe } from '@/lib/meals';
import { CYCLE_PHASE_META } from '@/lib/cycleUtils';

const DOSHA_CHIP: Record<string, string> = {
  vata:  'bg-gold/10 text-gold-dark border-gold/25',
  pitta: 'bg-terracotta/10 text-terracotta border-terracotta/25',
  kapha: 'bg-sage/10 text-sage-dark border-sage/25',
};

interface Props {
  recipe: Recipe;
  onClose: () => void;
}

export function RecipeDetail({ recipe, onClose }: Props) {
  // Trap body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const phaseMeta = CYCLE_PHASE_META[recipe.phase];

  return (
    <>
      {/* Backdrop — no backdrop-blur: Safari creates a compositing layer that hides siblings */}
      <div
        className="fixed inset-0 bg-charcoal/50 z-40"
        onClick={onClose}
        aria-hidden
      />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 max-h-[88vh] flex flex-col
                      bg-cream rounded-t-3xl shadow-2xl overflow-hidden animate-slide-up
                      md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
                      md:w-full md:max-w-xl md:rounded-3xl md:max-h-[85vh]">

        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 md:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-charcoal/20" />
        </div>

        {/* Header */}
        <div className="flex items-start gap-3 px-5 py-4 border-b border-cream-dark/50 flex-shrink-0">
          <span className="text-4xl">{recipe.emoji}</span>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-charcoal text-lg leading-tight">{recipe.name}</h2>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="label-chip bg-cream-dark text-charcoal/60 text-[10px]">
                ⏱ {recipe.prepTime} min
              </span>
              <span className={`label-chip text-[10px] border`}
                    style={{ background: '#FDF6EC', borderColor: '#C9A84C55', color: '#A88A38' }}>
                {phaseMeta.label}
              </span>
              <span className="label-chip bg-cream-dark text-charcoal/60 text-[10px] capitalize">
                {recipe.mealType}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-charcoal/40 hover:text-charcoal transition-colors text-xl leading-none flex-shrink-0 ml-1"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">

          {/* Dosha balance */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-charcoal/40 font-medium">Balances:</span>
            {recipe.doshaBalance.map(d => (
              <span key={d} className={`label-chip border capitalize ${DOSHA_CHIP[d]}`}>
                {d}
              </span>
            ))}
          </div>

          {/* Ingredients */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-charcoal uppercase tracking-widest">Ingredients</h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-charcoal/75">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-terracotta flex-shrink-0" />
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-charcoal uppercase tracking-widest">Method</h3>
            <ol className="space-y-4">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-terracotta/15 text-terracotta
                                   text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-charcoal/75 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Ayurvedic benefit */}
          <div className="rounded-2xl bg-white border border-gold/20 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span>🌿</span>
              <p className="text-xs font-bold text-gold-dark uppercase tracking-widest">Ayurvedic Benefit</p>
            </div>
            <p className="text-sm text-charcoal/70 leading-relaxed">{recipe.ayurvedicBenefit}</p>
          </div>

          <div className="h-4" /> {/* bottom breathing room */}
        </div>
      </div>
    </>
  );
}
