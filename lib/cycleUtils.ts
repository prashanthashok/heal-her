import type { CyclePhase, ProgramPhase, Dosha } from './types';

export function getCycleDay(lastPeriodDate: string): number {
  const last = new Date(lastPeriodDate);
  last.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today.getTime() - last.getTime()) / 86_400_000);
  // Use double-modulo to guard against negative diffDays (future date entered via Settings)
  return ((diffDays % 28) + 28) % 28 + 1;
}

export function getCyclePhase(cycleDay: number): CyclePhase {
  if (cycleDay <= 10) return 'power';
  if (cycleDay <= 15) return 'manifestation';
  return 'nurture';
}

export const CYCLE_PHASE_META: Record<CyclePhase, {
  label: string;
  days: string;
  color: string;
  fastingWindow: string;
  description: string;
}> = {
  power: {
    label: 'Power Phase',
    days: 'Days 1–10',
    color: 'sage',
    fastingWindow: '16–17 hrs',
    description: 'Estrogen is rising and your body welcomes longer fasting windows. Focus on ketobiotic, cleansing foods.',
  },
  manifestation: {
    label: 'Manifestation Phase',
    days: 'Days 11–15',
    color: 'gold',
    fastingWindow: '13–15 hrs',
    description: 'You\'re at peak energy and clarity. This is your best window for focused fasting and intention-setting.',
  },
  nurture: {
    label: 'Nurture Phase',
    days: 'Days 16–28',
    color: 'terracotta',
    fastingWindow: '12–13 hrs',
    description: 'Progesterone is rising — keep fasting windows short and nourish with hormone-feasting foods.',
  },
};

export const PROGRAM_PHASE_META: Record<ProgramPhase, { label: string; subtitle: string }> = {
  1: { label: 'Phase 1', subtitle: 'Purify & Prime' },
  2: { label: 'Phase 2', subtitle: 'Regulate & Rebuild' },
  3: { label: 'Phase 3', subtitle: 'Consolidate & Thrive' },
};

export function getProgramPhase(startDate: string): ProgramPhase {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day = Math.floor((today.getTime() - start.getTime()) / 86_400_000);
  if (day < 30) return 1;
  if (day < 60) return 2;
  return 3;
}

export function getProgramDay(startDate: string): number {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(1, Math.min(90, Math.floor((today.getTime() - start.getTime()) / 86_400_000) + 1));
}

export const DOSHA_META: Record<Dosha, {
  title: string;
  emoji: string;
  tagline: string;
  description: string;
  tips: string[];
}> = {
  kapha: {
    title: 'Kapha Dominant',
    emoji: '🌊',
    tagline: 'Grounding · Nourishing · Steady',
    description:
      'Your earthy Kapha nature is a gift of endurance — but PCOS tends to show up as weight resistance, sluggish metabolism, and fatigue. Your program focuses on warming, stimulating digestion, reducing Ama (toxins), and invigorating movement.',
    tips: [
      'Favour light, warming, well-spiced foods',
      'Dry brushing and warm oil massage each morning',
      'Move your body before your first meal',
    ],
  },
  pitta: {
    title: 'Pitta Dominant',
    emoji: '🔥',
    tagline: 'Focused · Fierce · Transformative',
    description:
      'Your bright Pitta energy drives you — but PCOS often shows up as inflammation, acne, and intense mood swings. Your program centres on cooling the body, supporting liver detox, and bringing softness and ease into your rhythm.',
    tips: [
      'Cooling foods: coconut, coriander, fresh mint',
      'Avoid intense fasting during the Nurture Phase',
      'Evening wind-down rituals are non-negotiable',
    ],
  },
  vata: {
    title: 'Vata Dominant',
    emoji: '🌬️',
    tagline: 'Creative · Intuitive · Flowing',
    description:
      'Your light, creative Vata nature is beautiful — but PCOS often shows up as irregular cycles, anxiety, and unpredictable energy. Your program prioritises grounding routines, nourishing the nervous system, and building consistent daily rhythms.',
    tips: [
      'Warm, oily, nourishing foods every single day',
      'Consistent sleep and wake times — no skipping',
      'Keep fasting windows gentle; don\'t over-restrict',
    ],
  },
};
