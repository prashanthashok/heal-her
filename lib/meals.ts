import RECIPES, { type Recipe, type MealType } from '@/data/meals';
import type { CyclePhase } from './types';

export type { Recipe, MealType };

// ── Lookup helpers ───────────────────────────────────────────────────────────

export function recipeById(id: string): Recipe | undefined {
  return RECIPES.find(r => r.id === id);
}

export function recipesByPhase(phase: CyclePhase): Recipe[] {
  return RECIPES.filter(r => r.phase === phase);
}

function recipesByPhaseAndType(phase: CyclePhase, mealType: MealType): Recipe[] {
  return RECIPES.filter(r => r.phase === phase && r.mealType === mealType);
}

// ── Meal plan data structure ──────────────────────────────────────────────────

export interface DayPlan {
  breakfast: string;
  lunch: string;
  dinner: string;
}

export interface WeekPlan {
  phase: CyclePhase;
  generatedAt: string;
  days: DayPlan[];
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export { DAY_LABELS };

/** Shuffle helper (Fisher-Yates) */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateWeekPlan(phase: CyclePhase): WeekPlan {
  const breakfasts = shuffle(recipesByPhaseAndType(phase, 'breakfast'));
  const lunches    = shuffle(recipesByPhaseAndType(phase, 'lunch'));
  const dinners    = shuffle(recipesByPhaseAndType(phase, 'dinner'));

  const days: DayPlan[] = Array.from({ length: 7 }, (_, i) => ({
    breakfast: breakfasts[i % breakfasts.length].id,
    lunch:     lunches[i % lunches.length].id,
    dinner:    dinners[i % dinners.length].id,
  }));

  return { phase, generatedAt: new Date().toISOString().split('T')[0], days };
}

/** Returns a random different recipe from the same phase + meal type */
export function swapRecipe(currentId: string, phase: CyclePhase, mealType: MealType): string {
  const pool = recipesByPhaseAndType(phase, mealType).filter(r => r.id !== currentId);
  if (pool.length === 0) return currentId;
  return pool[Math.floor(Math.random() * pool.length)].id;
}

// ── localStorage ─────────────────────────────────────────────────────────────

const STORAGE_KEY = 'mealPlan';

export function loadWeekPlan(): WeekPlan | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WeekPlan) : null;
  } catch {
    return null;
  }
}

export function saveWeekPlan(plan: WeekPlan): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
}

/**
 * Returns a valid week plan for the given phase.
 * Regenerates if the stored plan is for a different phase.
 */
export function getOrCreatePlan(phase: CyclePhase): WeekPlan {
  const stored = loadWeekPlan();
  if (stored && stored.phase === phase) return stored;
  const fresh = generateWeekPlan(phase);
  saveWeekPlan(fresh);
  return fresh;
}
