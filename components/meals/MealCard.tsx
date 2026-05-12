'use client';

import type { Recipe, MealType } from '@/lib/meals';

interface Props {
  recipe: Recipe;
  mealType: MealType;
  onOpen: () => void;
  onSwap: () => void;
}

const MEAL_LABEL: Record<MealType, { label: string; emoji: string; color: string }> = {
  breakfast: { label: 'Breakfast', emoji: '🌅', color: 'text-gold-dark' },
  lunch:     { label: 'Lunch',     emoji: '☀️',  color: 'text-terracotta' },
  dinner:    { label: 'Dinner',    emoji: '🌙',  color: 'text-sage-dark' },
};

export function MealCard({ recipe, mealType, onOpen, onSwap }: Props) {
  const meta = MEAL_LABEL[mealType];

  return (
    <div className="bg-white rounded-2xl border border-cream-dark/60 overflow-hidden
                    hover:shadow-sm transition-shadow duration-200">
      {/* Meal type header */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{meta.emoji}</span>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${meta.color}`}>
            {meta.label}
          </span>
        </div>
        <button
          type="button"
          onClick={e => { e.stopPropagation(); onSwap(); }}
          title="Swap this meal"
          className="text-[10px] font-semibold text-charcoal/40 hover:text-terracotta
                     transition-colors flex items-center gap-1"
        >
          <span className="text-sm">↺</span> Swap
        </button>
      </div>

      {/* Recipe content — clickable */}
      <button
        type="button"
        onClick={onOpen}
        className="w-full px-4 pb-4 pt-1 text-left"
      >
        <div className="flex items-start gap-3">
          <span className="text-3xl flex-shrink-0 leading-none">{recipe.emoji}</span>
          <div className="min-w-0">
            <p className="font-semibold text-charcoal text-sm leading-snug">{recipe.name}</p>
            <p className="text-xs text-charcoal/40 mt-1">⏱ {recipe.prepTime} min</p>
            <p className="text-xs text-charcoal/55 mt-1.5 line-clamp-2 leading-relaxed">
              {recipe.ayurvedicBenefit.split('.')[0]}.
            </p>
          </div>
        </div>
        <p className="text-[10px] text-terracotta font-medium mt-3">
          Tap to view recipe →
        </p>
      </button>
    </div>
  );
}
