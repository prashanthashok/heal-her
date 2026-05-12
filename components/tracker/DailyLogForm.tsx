'use client';

import { useState, useEffect } from 'react';
import {
  upsertEntry, getEntry, TRACKER_SYMPTOMS,
  BLEEDING_META, ENERGY_EMOJIS, MOOD_EMOJIS,
  type BleedingLevel, type EnergyLevel, type MoodLevel, type TrackerEntry,
} from '@/lib/tracker';
import { getCycleDay } from '@/lib/cycleUtils';
import { getUserProfile } from '@/lib/storage';

interface Props {
  date: string; // YYYY-MM-DD
  onSaved?: () => void;
}

const BLEEDING_LEVELS: BleedingLevel[] = ['none', 'spotting', 'light', 'moderate', 'heavy'];
const SCALE: (1 | 2 | 3 | 4 | 5)[] = [1, 2, 3, 4, 5];

const EMPTY: Omit<TrackerEntry, 'date'> = {
  cycleDay: 1,
  bleeding: 'none',
  energy: 3,
  mood: 3,
  symptoms: [],
  fastingHours: 0,
  notes: '',
};

export function DailyLogForm({ date, onSaved }: Props) {
  const [form, setForm] = useState<Omit<TrackerEntry, 'date'>>(EMPTY);
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const existing = getEntry(date);
    if (existing) {
      const { date: _d, ...rest } = existing;
      setForm(rest);
    } else {
      const profile = getUserProfile();
      const cycleDay = profile ? getCycleDay(profile.lastPeriodDate) : 1;
      setForm({ ...EMPTY, cycleDay });
    }
    setSaved(false);
    setLoaded(true);
  }, [date]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm(f => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function toggleSymptom(id: string) {
    set(
      'symptoms',
      form.symptoms.includes(id)
        ? form.symptoms.filter(s => s !== id)
        : [...form.symptoms, id]
    );
  }

  function handleSave() {
    upsertEntry({ date, ...form });
    setSaved(true);
    onSaved?.();
  }

  if (!loaded) return null;

  const isToday = date === new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Date header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-charcoal/40 uppercase tracking-wide font-medium">
            {isToday ? "Today's log" : "Editing entry"}
          </p>
          <p className="font-semibold text-charcoal">
            {new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric',
            })}
          </p>
        </div>
        {saved && (
          <span className="text-xs font-medium text-sage flex items-center gap-1">
            <span>✓</span> Saved
          </span>
        )}
      </div>

      {/* Cycle day */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-charcoal">Cycle day</label>
        <input
          type="number"
          min={1}
          max={60}
          value={form.cycleDay}
          onChange={e => set('cycleDay', Math.max(1, Number(e.target.value)))}
          className="w-24 px-3 py-2 rounded-xl border border-cream-dark bg-white text-charcoal text-sm
                     focus:outline-none focus:ring-2 focus:ring-terracotta/40"
        />
        <p className="text-xs text-charcoal/40">Auto-calculated — adjust if needed</p>
      </div>

      {/* Bleeding */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-charcoal">Bleeding</label>
        <div className="flex flex-wrap gap-2">
          {BLEEDING_LEVELS.map(level => {
            const meta = BLEEDING_META[level];
            const chosen = form.bleeding === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => set('bleeding', level)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border
                            transition-all duration-200
                            ${chosen
                              ? 'bg-terracotta/10 border-terracotta/40 text-terracotta'
                              : 'bg-white border-cream-dark text-charcoal/60 hover:border-charcoal/30'
                            }`}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${meta.dot}`} />
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Energy */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-charcoal">
          Energy level
          <span className="text-charcoal/40 font-normal ml-2 text-xs">
            {form.energy}/5 — {ENERGY_EMOJIS[form.energy as EnergyLevel]}
          </span>
        </label>
        <div className="flex gap-2">
          {SCALE.map(n => (
            <button
              key={n}
              type="button"
              onClick={() => set('energy', n as EnergyLevel)}
              className={`flex-1 aspect-square rounded-xl flex flex-col items-center justify-center gap-1
                          border transition-all duration-200 text-xl
                          ${form.energy === n
                            ? 'bg-gold/15 border-gold/50 scale-105 shadow-sm'
                            : 'bg-white border-cream-dark hover:border-gold/40'
                          }`}
            >
              <span>{ENERGY_EMOJIS[n as EnergyLevel]}</span>
              <span className="text-[10px] font-medium text-charcoal/40">{n}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mood */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-charcoal">
          Mood
          <span className="text-charcoal/40 font-normal ml-2 text-xs">
            {form.mood}/5 — {MOOD_EMOJIS[form.mood as MoodLevel]}
          </span>
        </label>
        <div className="flex gap-2">
          {SCALE.map(n => (
            <button
              key={n}
              type="button"
              onClick={() => set('mood', n as MoodLevel)}
              className={`flex-1 aspect-square rounded-xl flex flex-col items-center justify-center gap-1
                          border transition-all duration-200 text-xl
                          ${form.mood === n
                            ? 'bg-sage/15 border-sage/50 scale-105 shadow-sm'
                            : 'bg-white border-cream-dark hover:border-sage/40'
                          }`}
            >
              <span>{MOOD_EMOJIS[n as MoodLevel]}</span>
              <span className="text-[10px] font-medium text-charcoal/40">{n}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Symptoms */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-charcoal">
          Symptoms today
          <span className="text-charcoal/40 font-normal ml-1 text-xs">(optional)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {TRACKER_SYMPTOMS.map(({ id, label }) => {
            const on = form.symptoms.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleSymptom(id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200
                            ${on
                              ? 'bg-terracotta/10 border-terracotta/40 text-terracotta'
                              : 'bg-white border-cream-dark text-charcoal/60 hover:border-charcoal/30'
                            }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fasting hours */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-charcoal">Fasting hours completed</label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={0}
            max={24}
            step={0.5}
            value={form.fastingHours}
            onChange={e => set('fastingHours', Math.min(24, Math.max(0, Number(e.target.value))))}
            className="w-24 px-3 py-2 rounded-xl border border-cream-dark bg-white text-charcoal text-sm
                       focus:outline-none focus:ring-2 focus:ring-sage/40"
          />
          <span className="text-sm text-charcoal/50">hours</span>
          {form.fastingHours > 0 && (
            <span className="text-xs font-medium text-sage">{form.fastingHours}h fasted ✓</span>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-charcoal">
          Notes
          <span className="text-charcoal/40 font-normal ml-1 text-xs">(optional)</span>
        </label>
        <textarea
          rows={3}
          placeholder="How are you feeling? Any observations…"
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-white text-charcoal text-sm
                     placeholder:text-charcoal/30 resize-none
                     focus:outline-none focus:ring-2 focus:ring-terracotta/40"
        />
      </div>

      {/* Save */}
      <button
        type="button"
        onClick={handleSave}
        className={`w-full py-4 rounded-2xl text-sm font-semibold transition-all duration-200
                    ${saved
                      ? 'bg-sage text-white'
                      : 'bg-terracotta text-white hover:bg-terracotta-dark active:scale-[0.98]'
                    }`}
      >
        {saved ? '✓ Entry saved' : 'Save today\'s log'}
      </button>
    </div>
  );
}
