'use client';

import type { LearnArticle } from '@/lib/learn';

const CATEGORY_CHIP: Record<string, string> = {
  Hormones:  'bg-terracotta/10 text-terracotta border border-terracotta/25',
  Fasting:   'bg-gold/10 text-gold-dark border border-gold/25',
  Ayurveda:  'bg-sage/10 text-sage-dark border border-sage/25',
  Lifestyle: 'bg-charcoal/8 text-charcoal/60 border border-charcoal/15',
};

interface Props {
  article: LearnArticle;
  read: boolean;
  onClick: () => void;
}

export function LearnCard({ article, read, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-2xl border overflow-hidden transition-all duration-200
                  hover:shadow-md active:scale-[0.99]
                  ${read ? 'border-sage/30 bg-white' : 'border-cream-dark/70 bg-white'}`}
    >
      {/* Top accent bar */}
      <div className={`h-1 w-full ${read ? 'bg-sage/40' : 'bg-cream-dark'}`} />

      <div className="px-4 py-4 space-y-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <span className="text-2xl flex-shrink-0 mt-0.5">{article.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`label-chip text-[9px] font-bold uppercase tracking-wider ${CATEGORY_CHIP[article.category]}`}>
                {article.category}
              </span>
              <span className="text-[10px] text-charcoal/35 font-medium">
                {article.readTime} min read
              </span>
            </div>
            <h3 className={`text-sm font-semibold leading-snug transition-colors
                            ${read ? 'text-charcoal/60' : 'text-charcoal'}`}>
              {article.title}
            </h3>
          </div>
          {/* Read checkmark */}
          {read && (
            <div className="w-5 h-5 rounded-full bg-sage flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8"
                      strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>

        {/* Key takeaway */}
        <p className="text-xs text-charcoal/55 leading-relaxed italic border-l-2 border-cream-dark pl-3">
          {article.keyTakeaway}
        </p>

        {/* CTA */}
        <p className={`text-xs font-medium ${read ? 'text-charcoal/35' : 'text-terracotta'}`}>
          {read ? 'Read again ↗' : 'Read article ↗'}
        </p>
      </div>
    </button>
  );
}
