'use client';

import { useEffect, useRef } from 'react';
import type { LearnArticle } from '@/lib/learn';

const CATEGORY_CHIP: Record<string, string> = {
  Hormones:  'bg-terracotta/10 text-terracotta',
  Fasting:   'bg-gold/10 text-gold-dark',
  Ayurveda:  'bg-sage/10 text-sage-dark',
  Lifestyle: 'bg-charcoal/8 text-charcoal/60',
};

function renderBody(body: string) {
  return body.split('\n\n').map((para, i) => {
    // Handle **bold** and *italic* inline
    const parts = para.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={j}>{part.slice(1, -1)}</em>;
      }
      return part;
    });

    // Bullet list items start with •, -, or numbered pattern
    if (para.trim().startsWith('- ') || para.trim().startsWith('• ')) {
      const items = para.split('\n').filter(Boolean);
      return (
        <ul key={i} className="space-y-1.5 pl-1">
          {items.map((item, k) => (
            <li key={k} className="flex items-start gap-2 text-sm text-charcoal/75 leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-terracotta/50 flex-shrink-0" />
              <span>{item.replace(/^[-•]\s*/, '')}</span>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p key={i} className="text-sm text-charcoal/75 leading-relaxed">
        {parts}
      </p>
    );
  });
}

interface Props {
  article: LearnArticle;
  onClose: () => void;
}

export function ArticleView({ article, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full md:max-w-2xl md:mx-4 bg-cream rounded-t-3xl md:rounded-3xl
                      max-h-[92vh] flex flex-col shadow-2xl animate-slide-up">

        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 md:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-charcoal/15" />
        </div>

        {/* Header */}
        <div className="px-5 pt-3 pb-4 flex items-start gap-3 border-b border-cream-dark flex-shrink-0">
          <span className="text-3xl flex-shrink-0">{article.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`label-chip text-[9px] font-bold uppercase tracking-wider ${CATEGORY_CHIP[article.category]}`}>
                {article.category}
              </span>
              <span className="text-[10px] text-charcoal/40">{article.readTime} min read</span>
            </div>
            <h2 className="text-base font-semibold text-charcoal leading-snug">{article.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-cream-dark flex items-center justify-center
                       text-charcoal/50 hover:text-charcoal transition-colors flex-shrink-0"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-4">
          {/* Key takeaway callout */}
          <div className="rounded-xl bg-terracotta/8 border border-terracotta/20 px-4 py-3 flex items-start gap-2.5">
            <span className="text-base flex-shrink-0">💡</span>
            <p className="text-xs font-medium text-terracotta leading-relaxed italic">
              {article.keyTakeaway}
            </p>
          </div>

          {/* Article body */}
          <div className="space-y-4">
            {renderBody(article.body)}
          </div>

          {/* Bottom spacer */}
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}
