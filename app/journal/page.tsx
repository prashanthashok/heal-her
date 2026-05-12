'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { isOnboardingComplete, getUserProfile } from '@/lib/storage';
import { getCyclePhase, getCycleDay, getProgramDay, CYCLE_PHASE_META } from '@/lib/cycleUtils';
import {
  loadEntries, saveEntry, deleteEntry, getActiveReflection,
  type JournalEntry, type ReflectionPrompt,
} from '@/lib/journal';

// ── Constants ────────────────────────────────────────────────────────────────

const MOOD_OPTIONS: { value: 1 | 2 | 3 | 4 | 5; emoji: string; label: string }[] = [
  { value: 1, emoji: '😔', label: 'Very low' },
  { value: 2, emoji: '😕', label: 'Low' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😊', label: 'Great' },
];

const PHASE_TAG: Record<string, string> = {
  power:         'bg-sage/10 text-sage-dark border-sage/25',
  manifestation: 'bg-gold/10 text-gold-dark border-gold/25',
  nurture:       'bg-terracotta/10 text-terracotta border-terracotta/25',
};

const REFLECTION_COLORS: Record<number, { bg: string; border: string; badge: string; bullet: string }> = {
  1: { bg: 'bg-terracotta/6',  border: 'border-terracotta/25', badge: 'bg-terracotta/15 text-terracotta', bullet: 'bg-terracotta/40' },
  2: { bg: 'bg-gold/6',        border: 'border-gold/25',       badge: 'bg-gold/15 text-gold-dark',        bullet: 'bg-gold/50' },
  3: { bg: 'bg-sage/6',        border: 'border-sage/25',       badge: 'bg-sage/15 text-sage-dark',        bullet: 'bg-sage/50' },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ReflectionCard({
  prompt,
  onWrite,
}: {
  prompt: ReflectionPrompt;
  onWrite: (text: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const c = REFLECTION_COLORS[prompt.month];
  const starter = prompt.prompts.map(p => `• ${p}\n\n`).join('').trimEnd();

  return (
    <div className={`rounded-2xl border ${c.bg} ${c.border} px-4 py-4 space-y-3 animate-fade-in-up`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xl">✨</span>
          <span className={`label-chip text-[10px] font-bold uppercase tracking-widest ${c.badge}`}>
            Month {prompt.month} Milestone
          </span>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(e => !e)}
          className="text-charcoal/35 hover:text-charcoal/60 transition-colors text-xs"
        >
          {expanded ? 'Less ▴' : 'More ▾'}
        </button>
      </div>

      <div>
        <p className="text-sm font-semibold text-charcoal">{prompt.title}</p>
        <p className="text-xs text-charcoal/55 mt-0.5 leading-snug">{prompt.intro}</p>
      </div>

      {expanded && (
        <div className="space-y-2 animate-fade-in-up">
          {prompt.prompts.map((p, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.bullet}`} />
              <p className="text-xs text-charcoal/65 leading-relaxed">{p}</p>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => onWrite(starter)}
        className="w-full rounded-xl border border-current/20 py-2.5 text-xs font-semibold
                   text-charcoal/70 hover:text-charcoal hover:bg-white/60 transition-all duration-150"
      >
        Write this reflection →
      </button>
    </div>
  );
}

function EntryCard({
  entry,
  onDelete,
}: {
  entry: JournalEntry;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const mood = MOOD_OPTIONS.find(m => m.value === entry.mood)!;
  const phaseMeta = CYCLE_PHASE_META[entry.cyclePhase];
  const preview = entry.body.slice(0, 100);
  const hasMore = entry.body.length > 100;

  return (
    <div className="rounded-2xl border border-cream-dark/70 bg-white overflow-hidden">
      {/* Header row */}
      <div className="px-4 pt-3.5 pb-3 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="text-xs font-semibold text-charcoal/70">{formatDate(entry.date)}</p>
            <span className={`label-chip text-[9px] font-bold uppercase tracking-wider border ${PHASE_TAG[entry.cyclePhase]}`}>
              {phaseMeta.label}
            </span>
            <span className="text-[10px] text-charcoal/35">Day {entry.programDay}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base">{mood.emoji}</span>
            <span className="text-xs text-charcoal/45 font-medium">{mood.label}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {confirming ? (
            <>
              <button
                type="button"
                onClick={() => { onDelete(); setConfirming(false); }}
                className="text-[10px] font-semibold text-terracotta hover:text-terracotta/70 transition-colors px-2 py-1"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="text-[10px] text-charcoal/40 hover:text-charcoal/60 transition-colors px-2 py-1"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              aria-label="Delete entry"
              className="w-6 h-6 rounded-full flex items-center justify-center
                         text-charcoal/20 hover:text-terracotta/60 hover:bg-terracotta/8
                         transition-all duration-150 text-sm"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pb-4 border-t border-cream-dark/50 pt-3">
        <p className="text-sm text-charcoal/70 leading-relaxed whitespace-pre-wrap">
          {expanded ? entry.body : preview}
          {!expanded && hasMore && '…'}
        </p>
        {hasMore && (
          <button
            type="button"
            onClick={() => setExpanded(e => !e)}
            className="mt-2 text-xs font-medium text-terracotta hover:text-terracotta/70 transition-colors"
          >
            {expanded ? 'Show less ▴' : 'Read more ▾'}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function JournalPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<'write' | 'timeline'>('write');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [reflection, setReflection] = useState<ReflectionPrompt | null>(null);

  // Composer state
  const [body, setBody] = useState('');
  const [mood, setMood] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Profile-derived
  const [cyclePhase, setCyclePhase] = useState<'power' | 'manifestation' | 'nurture'>('power');
  const [programDay, setProgramDay] = useState(1);

  useEffect(() => {
    if (!isOnboardingComplete()) { router.replace('/onboarding'); return; }
    const profile = getUserProfile();
    if (!profile) { router.replace('/onboarding'); return; }

    const day = getCycleDay(profile.lastPeriodDate);
    const phase = getCyclePhase(day);
    const progDay = getProgramDay(profile.startDate);

    setCyclePhase(phase);
    setProgramDay(progDay);
    setEntries(loadEntries());
    setReflection(getActiveReflection(progDay));
    setMounted(true);
  }, [router]);

  const handleSave = useCallback(() => {
    if (!body.trim()) return;
    setSaving(true);

    const entry: JournalEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: todayISO(),
      cyclePhase,
      programDay,
      mood,
      body: body.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = saveEntry(entry);
    setEntries(updated);
    setBody('');
    setMood(3);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setTab('timeline');
  }, [body, mood, cyclePhase, programDay]);

  const handleDelete = useCallback((id: string) => {
    setEntries(deleteEntry(id));
  }, []);

  const handleWriteReflection = useCallback((starter: string) => {
    setBody(starter);
    setTab('write');
    setTimeout(() => textareaRef.current?.focus(), 50);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-terracotta border-t-transparent animate-spin" />
      </div>
    );
  }

  const phaseMeta = CYCLE_PHASE_META[cyclePhase];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-charcoal">Journal</h1>
        <p className="text-charcoal/60 text-sm mt-1">Your private healing journal.</p>
      </div>

      {/* Monthly reflection prompt */}
      {reflection && (
        <ReflectionCard prompt={reflection} onWrite={handleWriteReflection} />
      )}

      {/* Tab switcher */}
      <div className="flex gap-1 bg-cream-dark rounded-xl p-1">
        {(['write', 'timeline'] as const).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-150 capitalize
                        ${tab === t
                          ? 'bg-white text-charcoal shadow-sm'
                          : 'text-charcoal/45 hover:text-charcoal/65'}`}
          >
            {t === 'write' ? '✏️ Write' : `📋 Timeline${entries.length > 0 ? ` (${entries.length})` : ''}`}
          </button>
        ))}
      </div>

      {/* ── Write tab ─────────────────────────────────────────────────────── */}
      {tab === 'write' && (
        <div className="space-y-5 animate-fade-in-up">
          {/* Context strip */}
          <div className="flex items-center gap-2 text-xs text-charcoal/50">
            <span className={`label-chip font-bold uppercase tracking-wider border
                              text-[9px] ${PHASE_TAG[cyclePhase]}`}>
              {phaseMeta.label}
            </span>
            <span>·</span>
            <span>Day {programDay} of 90</span>
            <span>·</span>
            <span>{formatDate(todayISO())}</span>
          </div>

          {/* Mood selector */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-charcoal/60 uppercase tracking-widest">
              How are you feeling today?
            </p>
            <div className="flex gap-2">
              {MOOD_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setMood(opt.value)}
                  title={opt.label}
                  className={`flex-1 py-2.5 rounded-xl text-lg transition-all duration-150 border
                              ${mood === opt.value
                                ? 'border-charcoal/25 bg-white shadow-sm scale-105'
                                : 'border-transparent bg-cream-dark/60 hover:bg-cream-dark'}`}
                >
                  {opt.emoji}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-charcoal/35 text-center font-medium">
              {MOOD_OPTIONS.find(m => m.value === mood)?.label}
            </p>
          </div>

          {/* Textarea */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-charcoal/60 uppercase tracking-widest">
              Your thoughts
            </p>
            <textarea
              ref={textareaRef}
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Write freely — how your body feels, what's shifting, what you noticed today…"
              rows={8}
              className="w-full rounded-xl border border-cream-dark bg-white px-4 py-3
                         text-sm text-charcoal placeholder:text-charcoal/30
                         focus:outline-none focus:border-terracotta/40 focus:ring-1 focus:ring-terracotta/20
                         resize-none leading-relaxed transition-all duration-150"
            />
            <p className="text-[10px] text-charcoal/30 text-right font-medium">
              {body.length > 0 ? `${body.length} characters` : 'No minimum — write as much or as little as you like'}
            </p>
          </div>

          {/* Save button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={!body.trim() || saving}
            className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200
                        ${saved
                          ? 'bg-sage text-white'
                          : body.trim()
                            ? 'bg-terracotta text-white hover:bg-terracotta/90 active:scale-[0.99]'
                            : 'bg-cream-dark text-charcoal/30 cursor-not-allowed'}`}
          >
            {saved ? '✓ Saved' : saving ? 'Saving…' : 'Save entry'}
          </button>
        </div>
      )}

      {/* ── Timeline tab ──────────────────────────────────────────────────── */}
      {tab === 'timeline' && (
        <div className="space-y-4 animate-fade-in-up">
          {entries.length === 0 ? (
            <div className="card text-center py-14 space-y-3">
              <p className="text-3xl">🖊️</p>
              <p className="font-semibold text-charcoal text-sm">No entries yet</p>
              <p className="text-xs text-charcoal/45 max-w-xs mx-auto leading-relaxed">
                Your first entry will appear here. Switch to the Write tab to begin.
              </p>
              <button
                type="button"
                onClick={() => setTab('write')}
                className="mt-1 text-xs font-semibold text-terracotta hover:text-terracotta/70 transition-colors"
              >
                Write your first entry →
              </button>
            </div>
          ) : (
            <>
              <p className="text-xs text-charcoal/40 font-medium">
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'} — most recent first
              </p>
              {entries.map(entry => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  onDelete={() => handleDelete(entry.id)}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
