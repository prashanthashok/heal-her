import { getCurrentUid } from './uid';
import { fsSaveChecklist } from './firestore';

export type ChecklistSection = 'morning' | 'daytime' | 'evening';

export interface ChecklistItem {
  id: string;
  label: string;
  sub?: string;
  emoji: string;
  section: ChecklistSection;
}

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  // Morning
  { id: 'warm_water',       label: 'Warm water with lemon & honey', sub: '8–10 oz upon waking',          emoji: '🍋', section: 'morning' },
  { id: 'tongue_scraping',  label: 'Tongue scraping',               sub: '7 strokes, rinse',              emoji: '🌿', section: 'morning' },
  { id: 'abhyanga',         label: 'Self-massage (abhyanga)',        sub: 'Warm sesame or coconut oil',    emoji: '🫧', section: 'morning' },
  { id: 'movement',         label: 'Morning movement',               sub: 'Walk, yoga, or gentle stretch', emoji: '🧘', section: 'morning' },
  // Daytime
  { id: 'fasting_window',   label: 'Complete fasting window',        sub: 'No calories until eating window opens', emoji: '⏱️', section: 'daytime' },
  { id: 'morning_herbs',    label: 'Take morning herbs',             sub: 'As per your herb schedule',    emoji: '🌱', section: 'daytime' },
  { id: 'ccf_tea',          label: 'CCF tea with lunch',             sub: 'Cumin, coriander & fennel',    emoji: '🍵', section: 'daytime' },
  { id: 'noon_meal',        label: 'Largest meal at noon',           sub: 'Digestive fire is strongest',  emoji: '🍽️', section: 'daytime' },
  // Evening
  { id: 'light_dinner',     label: 'Light dinner before 7 pm',      sub: 'Kitchari, soup, or sabzi',     emoji: '🌙', section: 'evening' },
  { id: 'evening_herb',     label: 'Ashwagandha milk',               sub: 'Warm milk + ashwagandha + ghee', emoji: '🥛', section: 'evening' },
  { id: 'meditation',       label: '10 min meditation / pranayama',  sub: 'Nadi shodhana or body scan',   emoji: '🙏', section: 'evening' },
  { id: 'screens_off',      label: 'Screens off by 9 pm',           sub: 'Protect melatonin production', emoji: '📵', section: 'evening' },
  { id: 'sleep',            label: 'Sleep by 10 pm',                 sub: 'Kapha hours begin at 10',      emoji: '😴', section: 'evening' },
];

export const SECTION_META: Record<ChecklistSection, { label: string; color: string; bgColor: string }> = {
  morning:  { label: 'Morning',  color: 'text-gold-dark',       bgColor: 'bg-gold/10' },
  daytime:  { label: 'Daytime',  color: 'text-sage-dark',       bgColor: 'bg-sage/10' },
  evening:  { label: 'Evening',  color: 'text-terracotta-dark', bgColor: 'bg-terracotta/10' },
};

// ── localStorage helpers ────────────────────────────────────────────────────

const STORAGE_KEY = 'checklistData';

function todayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function loadCompletedIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data: Record<string, string[]> = raw ? JSON.parse(raw) : {};
    return new Set(data[todayKey()] ?? []);
  } catch {
    return new Set();
  }
}

export function saveCompletedIds(ids: Set<string>): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data: Record<string, string[]> = raw ? JSON.parse(raw) : {};
    data[todayKey()] = Array.from(ids);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    const uid = getCurrentUid();
    if (uid) fsSaveChecklist(uid, data).catch(console.error);
  } catch {
    // localStorage unavailable — silently skip
  }
}
