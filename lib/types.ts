export type Dosha = 'kapha' | 'pitta' | 'vata';
export type CyclePhase = 'power' | 'manifestation' | 'nurture';
export type ProgramPhase = 1 | 2 | 3;

export interface UserProfile {
  name: string;
  startDate: string;       // ISO date string (program start)
  lastPeriodDate: string;  // ISO date string (first day of last period)
  symptoms: string[];
  dosha: Dosha;
  doshaScores: { kapha: number; pitta: number; vata: number };
  createdAt: string;       // ISO datetime
}

export const PCOS_SYMPTOMS = [
  { id: 'irregular_cycles', label: 'Irregular cycles' },
  { id: 'acne',             label: 'Acne' },
  { id: 'hair_growth',      label: 'Excess hair growth' },
  { id: 'weight_gain',      label: 'Weight gain' },
  { id: 'fatigue',          label: 'Fatigue' },
  { id: 'mood_swings',      label: 'Mood swings' },
] as const;

export const DOSHA_QUESTIONS = [
  {
    question: 'How would you describe your natural body frame?',
    options: [
      { label: 'Slim or light — hard to gain weight', dosha: 'vata' as Dosha },
      { label: 'Medium and athletic — gain or lose weight fairly easily', dosha: 'pitta' as Dosha },
      { label: 'Larger or sturdy frame — tend to gain weight easily', dosha: 'kapha' as Dosha },
    ],
  },
  {
    question: 'How is your energy throughout the day?',
    options: [
      { label: 'Variable — bursts of energy followed by crashes', dosha: 'vata' as Dosha },
      { label: 'Intense and focused — strong but can burn out', dosha: 'pitta' as Dosha },
      { label: 'Slow to start but steady once going — love rest', dosha: 'kapha' as Dosha },
    ],
  },
  {
    question: 'When you feel stressed, you tend to…',
    options: [
      { label: 'Feel anxious, worried, or scattered', dosha: 'vata' as Dosha },
      { label: 'Get irritable, critical, or frustrated', dosha: 'pitta' as Dosha },
      { label: 'Withdraw, feel sluggish, or lose motivation', dosha: 'kapha' as Dosha },
    ],
  },
  {
    question: 'How is your digestion typically?',
    options: [
      { label: 'Irregular — bloating, gas, or constipation are common', dosha: 'vata' as Dosha },
      { label: 'Strong — you get headachy or irritable if you skip meals', dosha: 'pitta' as Dosha },
      { label: 'Slow — you can skip meals easily without feeling hungry', dosha: 'kapha' as Dosha },
    ],
  },
  {
    question: 'How do you sleep?',
    options: [
      { label: 'Light or disrupted — hard to fall or stay asleep', dosha: 'vata' as Dosha },
      { label: 'Sound, but sometimes wake feeling hot or restless', dosha: 'pitta' as Dosha },
      { label: 'Deep and heavy — love sleeping in, hard to wake up', dosha: 'kapha' as Dosha },
    ],
  },
] as const;
