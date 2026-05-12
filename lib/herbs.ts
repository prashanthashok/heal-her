import HERBS, { type Herb, type HerbTiming } from '@/data/herbs';
import type { ProgramPhase } from './types';

export type { Herb, HerbTiming };

// ── Lookup / filter helpers ──────────────────────────────────────────────────

/** Returns all herbs available in or before the given program month */
export function activeHerbs(month: ProgramPhase): Herb[] {
  return HERBS.filter(h => h.month <= month);
}

/** Sort order for timing groups */
const TIMING_RANK: Record<HerbTiming, number> = {
  'morning':           0,
  'morning & with meals': 1,
  'morning & evening': 2,
  'with meals':        3,
  'evening':           4,
};

export function primaryTiming(timing: HerbTiming): 'morning' | 'with meals' | 'evening' {
  if (timing.startsWith('morning')) return 'morning';
  if (timing === 'with meals')      return 'with meals';
  return 'evening';
}

export function sortedHerbs(herbs: Herb[]): Herb[] {
  return [...herbs].sort((a, b) => TIMING_RANK[a.timing] - TIMING_RANK[b.timing]);
}

export type TimingGroup = 'morning' | 'with meals' | 'evening';
export const TIMING_GROUPS: TimingGroup[] = ['morning', 'with meals', 'evening'];

export const TIMING_META: Record<TimingGroup, { label: string; emoji: string; color: string; bg: string }> = {
  'morning':    { label: 'Morning',     emoji: '🌅', color: 'text-gold-dark',       bg: 'bg-gold/10' },
  'with meals': { label: 'With Meals',  emoji: '🍽️', color: 'text-sage-dark',       bg: 'bg-sage/10' },
  'evening':    { label: 'Evening',     emoji: '🌙', color: 'text-terracotta',      bg: 'bg-terracotta/10' },
};

export const FORM_META: Record<string, { label: string; color: string }> = {
  'powder':          { label: 'Powder',    color: 'bg-gold/10 text-gold-dark' },
  'capsule':         { label: 'Capsule',   color: 'bg-charcoal/8 text-charcoal/60' },
  'tea':             { label: 'Tea',       color: 'bg-sage/10 text-sage-dark' },
  'food':            { label: 'Food',      color: 'bg-terracotta/10 text-terracotta' },
  'powder / capsule':{ label: 'Powder / Capsule', color: 'bg-gold/10 text-gold-dark' },
  'powder / food':   { label: 'Powder / Food',    color: 'bg-gold/10 text-gold-dark' },
  'food / tea':      { label: 'Food / Tea',        color: 'bg-sage/10 text-sage-dark' },
};

// ── localStorage ─────────────────────────────────────────────────────────────

const STORAGE_KEY = 'herbChecks';

function todayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function loadCheckedHerbs(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data: Record<string, string[]> = raw ? JSON.parse(raw) : {};
    return new Set(data[todayKey()] ?? []);
  } catch {
    return new Set();
  }
}

export function saveCheckedHerbs(ids: Set<string>): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data: Record<string, string[]> = raw ? JSON.parse(raw) : {};
    data[todayKey()] = Array.from(ids);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // silent
  }
}

export function toggleHerbCheck(id: string, current: Set<string>): Set<string> {
  const next = new Set(current);
  if (next.has(id)) next.delete(id); else next.add(id);
  saveCheckedHerbs(next);
  return next;
}
