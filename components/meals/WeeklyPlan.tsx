'use client';

import { useState, useCallback } from 'react';
import { MealCard } from './MealCard';
import { RecipeDetail } from './RecipeDetail';
import {
  recipeById, swapRecipe, saveWeekPlan,
  DAY_LABELS, type WeekPlan, type MealType,
} from '@/lib/meals';
import type { CyclePhase } from '@/lib/types';

interface Props {
  plan: WeekPlan;
  phase: CyclePhase;
  cycleDay: number;
}

type MealSlot = 'breakfast' | 'lunch' | 'dinner';
const MEAL_SLOTS: MealSlot[] = ['breakfast', 'lunch', 'dinner'];

function todayDayIndex(): number {
  // 0 = Monday, 6 = Sunday
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

export function WeeklyPlan({ plan, phase, cycleDay }: Props) {
  const [currentPlan, setCurrentPlan] = useState(plan);
  const [selectedDay, setSelectedDay] = useState(todayDayIndex);
  const [openRecipeId, setOpenRecipeId] = useState<string | null>(null);

  const dayPlan = currentPlan.days[selectedDay];
  const openRecipe = openRecipeId ? recipeById(openRecipeId) : null;

  const handleSwap = useCallback((slot: MealSlot) => {
    const currentId = dayPlan[slot];
    const newId = swapRecipe(currentId, phase, slot as MealType);
    if (newId === currentId) return;

    setCurrentPlan(prev => {
      const updated: WeekPlan = {
        ...prev,
        days: prev.days.map((d, i) =>
          i === selectedDay ? { ...d, [slot]: newId } : d
        ),
      };
      saveWeekPlan(updated);
      return updated;
    });
  }, [dayPlan, phase, selectedDay]);

  return (
    <div className="space-y-4">
      {/* Day selector */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {DAY_LABELS.map((label, i) => {
          const isToday = i === todayDayIndex();
          const isSelected = i === selectedDay;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setSelectedDay(i)}
              className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl
                          border transition-all duration-200 min-w-[52px]
                          ${isSelected
                            ? 'bg-terracotta border-terracotta text-white shadow-sm'
                            : isToday
                            ? 'bg-white border-terracotta/50 text-terracotta'
                            : 'bg-white border-cream-dark text-charcoal/60 hover:border-charcoal/30'
                          }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
              {isToday && (
                <span className={`mt-0.5 w-1 h-1 rounded-full ${isSelected ? 'bg-white/70' : 'bg-terracotta'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Day label */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-charcoal">
          {DAY_LABELS[selectedDay]}
          {selectedDay === todayDayIndex() && (
            <span className="ml-2 text-xs font-normal text-charcoal/40">— today</span>
          )}
        </p>
        <span className="text-xs text-charcoal/40">Cycle day {cycleDay}</span>
      </div>

      {/* Meal cards */}
      <div className="space-y-3">
        {MEAL_SLOTS.map(slot => {
          const recipe = recipeById(dayPlan[slot]);
          if (!recipe) return null;
          return (
            <MealCard
              key={slot}
              recipe={recipe}
              mealType={slot}
              onOpen={() => setOpenRecipeId(recipe.id)}
              onSwap={() => handleSwap(slot)}
            />
          );
        })}
      </div>

      {/* Recipe detail overlay */}
      {openRecipe && (
        <RecipeDetail
          recipe={openRecipe}
          onClose={() => setOpenRecipeId(null)}
        />
      )}
    </div>
  );
}
