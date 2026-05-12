'use client';

import { useState, useEffect, useCallback } from 'react';
import { MonthCalendar, MONTH_NAMES } from '@/components/tracker/MonthCalendar';
import { LogDetail } from '@/components/tracker/LogDetail';
import { DailyLogForm } from '@/components/tracker/DailyLogForm';
import { TrendCharts } from '@/components/tracker/TrendCharts';
import { logMap, type TrackerEntry } from '@/lib/tracker';

type Tab = 'log' | 'history';

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

export default function TrackerPage() {
  const [tab, setTab] = useState<Tab>('log');
  const [logDate, setLogDate] = useState(todayISO());
  const [entries, setEntries] = useState<Record<string, TrackerEntry>>({});

  // Calendar navigation
  const now = new Date();
  const [calYear,  setCalYear]  = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState<string | null>(null);

  const refreshEntries = useCallback(() => {
    setEntries(logMap());
  }, []);

  useEffect(() => { refreshEntries(); }, [refreshEntries]);

  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  }
  function nextMonth() {
    const isCurrentMonth = calYear === now.getFullYear() && calMonth === now.getMonth();
    if (isCurrentMonth) return;
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  }

  function handleDaySelect(date: string) {
    setSelected(date === selected ? null : date);
  }

  function handleEditFromDetail() {
    if (selected) {
      setLogDate(selected);
      setTab('log');
    }
  }

  const isCurrentMonth = calYear === now.getFullYear() && calMonth === now.getMonth();

  return (
    <div className="space-y-5">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-semibold text-charcoal">Tracker</h1>
        <p className="text-charcoal/60 text-sm mt-1">Log your daily cycle, energy, and symptoms.</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 bg-cream-dark rounded-xl">
        {(['log', 'history'] as Tab[]).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                        ${tab === t
                          ? 'bg-white text-charcoal shadow-sm'
                          : 'text-charcoal/50 hover:text-charcoal/80'
                        }`}
          >
            {t === 'log' ? "Today's Log" : 'History'}
          </button>
        ))}
      </div>

      {/* ── Log tab ─────────────────────────────────────────────────── */}
      {tab === 'log' && (
        <div className="space-y-4">
          {/* Date selector */}
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={logDate}
              max={todayISO()}
              onChange={e => setLogDate(e.target.value)}
              className="px-3 py-2 rounded-xl border border-cream-dark bg-white text-charcoal text-sm
                         focus:outline-none focus:ring-2 focus:ring-terracotta/40"
            />
            {logDate !== todayISO() && (
              <button
                type="button"
                onClick={() => setLogDate(todayISO())}
                className="text-xs text-terracotta hover:underline font-medium"
              >
                Jump to today
              </button>
            )}
          </div>

          <DailyLogForm
            date={logDate}
            onSaved={() => {
              refreshEntries();
            }}
          />
        </div>
      )}

      {/* ── History tab ──────────────────────────────────────────────── */}
      {tab === 'history' && (
        <div className="space-y-6">
          {/* Calendar card */}
          <div className="card space-y-4">
            {/* Month nav */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={prevMonth}
                className="w-8 h-8 flex items-center justify-center rounded-lg
                           text-charcoal/60 hover:bg-cream-dark transition-colors text-sm"
              >
                ‹
              </button>
              <p className="font-semibold text-charcoal text-sm">
                {MONTH_NAMES[calMonth]} {calYear}
              </p>
              <button
                type="button"
                onClick={nextMonth}
                disabled={isCurrentMonth}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors
                            ${isCurrentMonth
                              ? 'text-charcoal/20 cursor-default'
                              : 'text-charcoal/60 hover:bg-cream-dark'
                            }`}
              >
                ›
              </button>
            </div>

            <MonthCalendar
              year={calYear}
              month={calMonth}
              entries={entries}
              selected={selected}
              onSelect={handleDaySelect}
            />
          </div>

          {/* Selected day detail */}
          {selected && entries[selected] && (
            <LogDetail
              entry={entries[selected]}
              onEdit={handleEditFromDetail}
            />
          )}

          {selected && !entries[selected] && (
            <div className="card text-center py-8 space-y-2">
              <p className="text-2xl">📋</p>
              <p className="text-sm font-medium text-charcoal">No entry for this day</p>
              <button
                type="button"
                onClick={() => { setLogDate(selected); setTab('log'); }}
                className="text-xs text-terracotta hover:underline font-medium"
              >
                Log this day →
              </button>
            </div>
          )}

          {/* Trend charts */}
          <TrendCharts />
        </div>
      )}
    </div>
  );
}
