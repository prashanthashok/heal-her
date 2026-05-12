'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { isOnboardingComplete } from '@/lib/storage';
import { ARTICLES, loadReadArticles, markArticleRead } from '@/lib/learn';
import { LearnCard } from '@/components/learn/LearnCard';
import { ArticleView } from '@/components/learn/ArticleView';
import type { LearnCategory, LearnArticle } from '@/lib/learn';

const CATEGORIES: Array<LearnCategory | 'All'> = ['All', 'Hormones', 'Fasting', 'Ayurveda', 'Lifestyle'];

const FILTER_CHIP = {
  All:       'bg-charcoal text-cream',
  Hormones:  'bg-terracotta text-white',
  Fasting:   'bg-gold text-white',
  Ayurveda:  'bg-sage text-white',
  Lifestyle: 'bg-charcoal/70 text-white',
};

const FILTER_CHIP_INACTIVE = 'bg-cream-dark text-charcoal/55 hover:bg-cream-dark/80';

export default function LearnPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<LearnCategory | 'All'>('All');
  const [read, setRead] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<LearnArticle | null>(null);

  useEffect(() => {
    if (!isOnboardingComplete()) { router.replace('/onboarding'); return; }
    setRead(loadReadArticles());
    setMounted(true);
  }, [router]);

  const handleOpen = useCallback((article: LearnArticle) => {
    setOpen(article);
    setRead(markArticleRead(article.id));
  }, []);

  const handleClose = useCallback(() => {
    setOpen(null);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-terracotta border-t-transparent animate-spin" />
      </div>
    );
  }

  const filtered = filter === 'All' ? ARTICLES : ARTICLES.filter(a => a.category === filter);
  const readCount = ARTICLES.filter(a => read.has(a.id)).length;
  const allRead = readCount === ARTICLES.length;

  return (
    <>
      <div className="space-y-7 pb-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">Learn</h1>
          <p className="text-charcoal/60 text-sm mt-1">
            PCOS, fasting, and Ayurveda explained.
          </p>
        </div>

        {/* Progress banner */}
        <div className={`rounded-2xl border px-4 py-4 space-y-3
                        ${allRead ? 'bg-sage/5 border-sage/20' : 'bg-terracotta/5 border-terracotta/20'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-charcoal">Your reading progress</p>
              <p className="text-xs text-charcoal/50 mt-0.5">
                {allRead ? 'You\'ve read everything — well done 🌿' : `${ARTICLES.length - readCount} article${ARTICLES.length - readCount === 1 ? '' : 's'} left to read`}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${allRead ? 'text-sage' : 'text-charcoal'}`}>
                {readCount}<span className="text-base font-normal text-charcoal/30">/{ARTICLES.length}</span>
              </p>
              <p className="text-[10px] text-charcoal/40 font-medium">read</p>
            </div>
          </div>
          <div className="h-1.5 w-full bg-white/70 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.round((readCount / ARTICLES.length) * 100)}%`,
                backgroundColor: allRead ? '#7D9B76' : '#C17A5A',
              }}
            />
          </div>
        </div>

        {/* Category filter chips */}
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map(cat => {
            const active = filter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150
                            ${active ? FILTER_CHIP[cat] : FILTER_CHIP_INACTIVE}`}
              >
                {cat}
                {cat !== 'All' && (
                  <span className={`ml-1 text-[10px] ${active ? 'opacity-70' : 'text-charcoal/35'}`}>
                    {ARTICLES.filter(a => a.category === cat).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Article grid */}
        <div className="space-y-3">
          {filtered.map(article => (
            <LearnCard
              key={article.id}
              article={article}
              read={read.has(article.id)}
              onClick={() => handleOpen(article)}
            />
          ))}
        </div>

        {/* Completion message */}
        {allRead && (
          <div className="card text-center py-6 bg-sage/5 border-sage/20 animate-fade-in-up">
            <p className="text-2xl mb-2">📚</p>
            <p className="font-semibold text-charcoal text-sm">All articles read</p>
            <p className="text-xs text-charcoal/50 mt-1">Knowledge is the first medicine.</p>
          </div>
        )}
      </div>

      {/* Article reading overlay */}
      {open && (
        <ArticleView
          article={open}
          onClose={handleClose}
        />
      )}
    </>
  );
}
