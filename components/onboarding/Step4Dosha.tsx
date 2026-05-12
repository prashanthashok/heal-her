import { DOSHA_QUESTIONS } from '@/lib/types';
import type { Dosha } from '@/lib/types';

interface Step4Props {
  answers: (Dosha | null)[];
  onChange: (answers: (Dosha | null)[]) => void;
}

const OPTION_STYLES: Record<Dosha, { selected: string; dot: string }> = {
  vata:  { selected: 'bg-gold/10 border-gold/50',       dot: 'bg-gold' },
  pitta: { selected: 'bg-terracotta/8 border-terracotta/40', dot: 'bg-terracotta' },
  kapha: { selected: 'bg-sage/10 border-sage/50',       dot: 'bg-sage' },
};

export function Step4Dosha({ answers, onChange }: Step4Props) {
  function pick(qIndex: number, dosha: Dosha) {
    const updated = [...answers];
    updated[qIndex] = dosha;
    onChange(updated);
  }

  const answered = answers.filter(Boolean).length;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-charcoal/5 flex items-center justify-center text-2xl mb-4">
          ✨
        </div>
        <h2 className="text-2xl font-semibold text-charcoal">Your Dosha</h2>
        <p className="text-charcoal/60 text-sm leading-relaxed">
          Answer these 5 questions honestly — go with your first instinct. There&apos;s no wrong answer.
        </p>
      </div>

      <div className="space-y-6">
        {DOSHA_QUESTIONS.map((q, qi) => (
          <div key={qi} className="space-y-3">
            {/* Question */}
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-terracotta/15 text-terracotta
                               text-xs font-bold flex items-center justify-center mt-0.5">
                {qi + 1}
              </span>
              <p className="text-sm font-medium text-charcoal leading-snug">{q.question}</p>
            </div>

            {/* Options */}
            <div className="space-y-2 pl-9">
              {q.options.map((opt, oi) => {
                const chosen = answers[qi] === opt.dosha;
                const styles = OPTION_STYLES[opt.dosha];
                return (
                  <button
                    key={oi}
                    type="button"
                    onClick={() => pick(qi, opt.dosha)}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border text-left
                                transition-all duration-200
                                ${chosen
                                  ? `${styles.selected} shadow-sm`
                                  : 'bg-white border-cream-dark hover:border-charcoal/20'
                                }`}
                  >
                    {/* Radio dot */}
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                                    transition-all duration-200
                                    ${chosen ? `${styles.dot} border-transparent` : 'border-charcoal/20'}`}>
                      {chosen && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-xs text-charcoal/75 leading-snug">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="text-center text-xs text-charcoal/40">
        {answered} of {DOSHA_QUESTIONS.length} answered
        {answered === DOSHA_QUESTIONS.length && (
          <span className="ml-2 text-sage font-medium">— all done ✓</span>
        )}
      </div>
    </div>
  );
}
