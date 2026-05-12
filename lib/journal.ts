import type { CyclePhase, ProgramPhase } from './types';

export interface JournalEntry {
  id: string;
  date: string;         // YYYY-MM-DD
  cyclePhase: CyclePhase;
  programDay: number;
  mood: 1 | 2 | 3 | 4 | 5;
  body: string;
  createdAt: string;    // ISO timestamp
}

export interface ReflectionPrompt {
  month: ProgramPhase;
  title: string;
  intro: string;
  prompts: string[];
}

export const REFLECTION_PROMPTS: Record<ProgramPhase, ReflectionPrompt> = {
  1: {
    month: 1,
    title: 'Month 1 Reflection',
    intro: 'You\'ve completed your first month of healing. Take 10 minutes to write honestly.',
    prompts: [
      'How have your PCOS symptoms changed since Day 1? (energy, skin, hair, mood, cravings)',
      'Has your cycle felt any different — in timing, flow, or how your body felt during it?',
      'What has your energy been like across this month? Were there patterns you noticed?',
      'How do you feel about your body today compared to when you started?',
      'What\'s one thing you\'re genuinely proud of from this first month?',
    ],
  },
  2: {
    month: 2,
    title: 'Month 2 Reflection',
    intro: 'You\'re halfway through the 90-day protocol. This is a good time to take stock.',
    prompts: [
      'What\'s the most noticeable change in your symptoms compared to Month 1?',
      'Has your cycle become more regular — in length, timing, or predictability?',
      'How have your energy and mood been tracking across the month?',
      'Which habits have become natural, and which are still a conscious effort?',
      'What\'s one thing you\'re proud of this month, and one thing you want to focus on in Month 3?',
    ],
  },
  3: {
    month: 3,
    title: 'Month 3 — Final Reflection',
    intro: 'You\'ve reached the end of the 90-day protocol. This entry is worth writing slowly.',
    prompts: [
      'How do your PCOS symptoms compare to Day 1? Be specific about what has changed.',
      'Describe your last two or three cycles — were they more regular, less painful, more predictable?',
      'How has your relationship with food, fasting, and your body shifted across these 90 days?',
      'What do you know now about your body and your cycle that you didn\'t know before?',
      'What are you most proud of? What will you carry forward beyond the 90 days?',
    ],
  },
};

/** Returns the reflection prompt to show, or null. Visible from Day 28/58/88 onwards, within a 7-day window. */
export function getActiveReflection(programDay: number): ReflectionPrompt | null {
  if (programDay >= 28 && programDay <= 34) return REFLECTION_PROMPTS[1];
  if (programDay >= 58 && programDay <= 64) return REFLECTION_PROMPTS[2];
  if (programDay >= 88) return REFLECTION_PROMPTS[3];
  return null;
}

const STORAGE_KEY = 'journalEntries';

export function loadEntries(): JournalEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEntry(entry: JournalEntry): JournalEntry[] {
  const entries = loadEntries();
  entries.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  return entries;
}

export function deleteEntry(id: string): JournalEntry[] {
  const entries = loadEntries().filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  return entries;
}
