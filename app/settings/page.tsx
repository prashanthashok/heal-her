'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  isOnboardingComplete, getUserProfile, saveUserProfile, clearAllData,
} from '@/lib/storage';
import { DOSHA_META } from '@/lib/cycleUtils';
import { PCOS_SYMPTOMS } from '@/lib/types';
import type { UserProfile } from '@/lib/types';

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

// ── Confirmation dialog ───────────────────────────────────────────────────────

function ConfirmDialog({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl px-6 py-6 w-full max-w-sm space-y-4 animate-fade-in-up">
        <div className="text-center space-y-2">
          <p className="text-2xl">⚠️</p>
          <p className="text-base font-semibold text-charcoal">Clear all data?</p>
          <p className="text-sm text-charcoal/55 leading-relaxed">
            This will permanently delete your profile, journal, tracker logs, herb history,
            and all progress. This cannot be undone.
          </p>
        </div>
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full py-3 rounded-xl bg-red-500 text-white text-sm font-semibold
                       hover:bg-red-600 transition-colors duration-150"
          >
            Yes, clear everything
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-3 rounded-xl bg-cream-dark text-charcoal text-sm font-medium
                       hover:bg-cream-dark/80 transition-colors duration-150"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  // Edit form state
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [saved, setSaved] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!isOnboardingComplete()) { router.replace('/onboarding'); return; }
    const p = getUserProfile();
    if (!p) { router.replace('/onboarding'); return; }
    setProfile(p);
    setName(p.name);
    setStartDate(p.startDate);
    setLastPeriodDate(p.lastPeriodDate);
    setMounted(true);
  }, [router]);

  function handleSave() {
    if (!profile || !name.trim()) return;
    const updated: UserProfile = {
      ...profile,
      name: name.trim(),
      startDate,
      lastPeriodDate,
    };
    saveUserProfile(updated);
    setProfile(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleClearAll() {
    clearAllData();
    router.replace('/onboarding');
  }

  if (!mounted || !profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-terracotta border-t-transparent animate-spin" />
      </div>
    );
  }

  const doshaMeta = DOSHA_META[profile.dosha];

  return (
    <>
      <div className="space-y-8 pb-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">Settings</h1>
          <p className="text-charcoal/60 text-sm mt-1">
            Edit your profile and program details.
          </p>
        </div>

        {/* ── Profile section ──────────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="section-title text-base">Your Profile</h2>

          <div className="card space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-charcoal/60 uppercase tracking-widest">
                Your name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full rounded-xl border border-cream-dark bg-cream px-4 py-2.5
                           text-sm text-charcoal focus:outline-none focus:border-terracotta/40
                           focus:ring-1 focus:ring-terracotta/20 transition-all"
              />
            </div>

            {/* Dosha (read-only) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-charcoal/60 uppercase tracking-widest">
                Dosha constitution
              </label>
              <div className="flex items-center gap-2.5 rounded-xl border border-cream-dark bg-cream px-4 py-2.5">
                <span className="text-lg">{doshaMeta.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-charcoal capitalize">{profile.dosha}</p>
                  <p className="text-[11px] text-charcoal/45">{doshaMeta.tagline}</p>
                </div>
                <span className="ml-auto text-[10px] text-charcoal/30 font-medium">
                  Re-take quiz after clearing data
                </span>
              </div>
            </div>

            {/* Symptoms (read-only) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-charcoal/60 uppercase tracking-widest">
                Tracked symptoms
              </label>
              <div className="flex flex-wrap gap-2">
                {profile.symptoms.length === 0 ? (
                  <p className="text-xs text-charcoal/40">None selected</p>
                ) : (
                  profile.symptoms.map(id => {
                    const sym = PCOS_SYMPTOMS.find(s => s.id === id);
                    return sym ? (
                      <span key={id} className="label-chip bg-terracotta/10 text-terracotta text-[10px]">
                        {sym.label}
                      </span>
                    ) : null;
                  })
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Program dates ────────────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="section-title text-base">Program Dates</h2>

          <div className="card space-y-4">
            {/* Program start date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-charcoal/60 uppercase tracking-widest">
                Program start date
              </label>
              <p className="text-[11px] text-charcoal/40 leading-snug">
                Sets your 90-day counter and which herbs are active.
              </p>
              <input
                type="date"
                value={startDate}
                max={todayISO()}
                onChange={e => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-cream-dark bg-cream px-4 py-2.5
                           text-sm text-charcoal focus:outline-none focus:border-terracotta/40
                           focus:ring-1 focus:ring-terracotta/20 transition-all"
              />
            </div>

            {/* Last period date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-charcoal/60 uppercase tracking-widest">
                First day of last period
              </label>
              <p className="text-[11px] text-charcoal/40 leading-snug">
                Used to calculate your cycle phase and fasting windows. Update each cycle.
              </p>
              <input
                type="date"
                value={lastPeriodDate}
                max={todayISO()}
                onChange={e => setLastPeriodDate(e.target.value)}
                className="w-full rounded-xl border border-cream-dark bg-cream px-4 py-2.5
                           text-sm text-charcoal focus:outline-none focus:border-terracotta/40
                           focus:ring-1 focus:ring-terracotta/20 transition-all"
              />
            </div>
          </div>
        </section>

        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={!name.trim()}
          className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200
                      ${saved
                        ? 'bg-sage text-white'
                        : name.trim()
                          ? 'bg-terracotta text-white hover:bg-terracotta/90 active:scale-[0.99]'
                          : 'bg-cream-dark text-charcoal/30 cursor-not-allowed'}`}
        >
          {saved ? '✓ Changes saved' : 'Save changes'}
        </button>

        {/* ── Danger zone ──────────────────────────────────────────── */}
        <section className="space-y-3">
          <h2 className="section-title text-base text-red-500/80">Danger Zone</h2>
          <div className="rounded-2xl border border-red-200 bg-red-50/50 px-4 py-4 space-y-3">
            <div>
              <p className="text-sm font-semibold text-charcoal">Clear all data</p>
              <p className="text-xs text-charcoal/50 mt-0.5 leading-relaxed">
                Permanently deletes your profile, journal entries, tracker logs, herb history,
                meal plan, and all other app data. You&apos;ll restart from the onboarding screen.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="rounded-xl border border-red-300 bg-white px-4 py-2 text-xs font-semibold
                         text-red-500 hover:bg-red-50 transition-colors duration-150"
            >
              Clear all data…
            </button>
          </div>
        </section>

        {/* App info */}
        <div className="text-center space-y-1 pt-2">
          <p className="text-xs text-charcoal/30 font-medium">Heal Her · 90-Day PCOS Program</p>
          <p className="text-[10px] text-charcoal/25">All data stored locally on this device</p>
        </div>
      </div>

      {/* Confirmation dialog */}
      {showConfirm && (
        <ConfirmDialog
          onConfirm={handleClearAll}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
