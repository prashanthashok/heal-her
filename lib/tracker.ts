import { getCurrentUid } from './uid';
import { fsSaveTrackerLog } from './firestore';

export type BleedingLevel = 'none' | 'spotting' | 'light' | 'moderate' | 'heavy';
export type EnergyLevel   = 1 | 2 | 3 | 4 | 5;
export type MoodLevel     = 1 | 2 | 3 | 4 | 5;

export interface TrackerEntry {
  date: string;           // ISO YYYY-MM-DD
  cycleDay: number;
  bleeding: BleedingLevel;
  energy: EnergyLevel;
  mood: MoodLevel;
  symptoms: string[];
  fastingHours: number;
  notes: string;
}

const STORAGE_KEY = 'trackerLog';

// ── Symptom options ─────────────────────────────────────────────────────────

export const TRACKER_SYMPTOMS = [
  { id: 'cramps',             label: 'Cramps' },
  { id: 'bloating',           label: 'Bloating' },
  { id: 'headache',           label: 'Headache' },
  { id: 'brain_fog',          label: 'Brain fog' },
  { id: 'cravings',           label: 'Cravings' },
  { id: 'acne',               label: 'Acne' },
  { id: 'fatigue',            label: 'Fatigue' },
  { id: 'mood_swings',        label: 'Mood swings' },
  { id: 'irregular_cycles',   label: 'Irregular cycles' },
  { id: 'hair_growth',        label: 'Excess hair growth' },
  { id: 'insomnia',           label: 'Insomnia' },
  { id: 'breast_tenderness',  label: 'Breast tenderness' },
] as const;

// ── Display maps ─────────────────────────────────────────────────────────────

export const BLEEDING_META: Record<BleedingLevel, { label: string; color: string; dot: string }> = {
  none:     { label: 'None',     color: 'text-charcoal/40',  dot: 'bg-charcoal/15' },
  spotting: { label: 'Spotting', color: 'text-gold-dark',    dot: 'bg-gold/60' },
  light:    { label: 'Light',    color: 'text-terracotta',   dot: 'bg-terracotta/60' },
  moderate: { label: 'Moderate', color: 'text-terracotta',   dot: 'bg-terracotta' },
  heavy:    { label: 'Heavy',    color: 'text-terracotta-dark', dot: 'bg-terracotta-dark' },
};

export const ENERGY_EMOJIS: Record<EnergyLevel, string> = {
  1: '😴', 2: '😔', 3: '😐', 4: '😊', 5: '⚡',
};

export const MOOD_EMOJIS: Record<MoodLevel, string> = {
  1: '😢', 2: '😔', 3: '😐', 4: '😊', 5: '😄',
};

export function energyDotColor(energy: EnergyLevel): string {
  if (energy <= 2) return 'bg-terracotta';
  if (energy === 3) return 'bg-gold';
  return 'bg-sage';
}

// ── localStorage helpers ─────────────────────────────────────────────────────

export function loadLog(): TrackerEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TrackerEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveLog(entries: TrackerEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  const uid = getCurrentUid();
  if (uid) fsSaveTrackerLog(uid, entries).catch(console.error);
}

export function getEntry(date: string): TrackerEntry | null {
  return loadLog().find(e => e.date === date) ?? null;
}

export function upsertEntry(entry: TrackerEntry): void {
  const log = loadLog().filter(e => e.date !== entry.date);
  log.push(entry);
  log.sort((a, b) => a.date.localeCompare(b.date));
  saveLog(log);
}

export function logMap(): Record<string, TrackerEntry> {
  return Object.fromEntries(loadLog().map(e => [e.date, e]));
}

export function last30Days(): Array<{ date: string; label: string; energy: number | null; mood: number | null }> {
  const map = logMap();
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const key = d.toISOString().split('T')[0];
    const e = map[key];
    return {
      date: key,
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      energy: e ? e.energy : null,
      mood:   e ? e.mood   : null,
    };
  });
}
