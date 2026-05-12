import { PCOS_SYMPTOMS } from '@/lib/types';

interface Step3Props {
  selected: string[];
  onChange: (symptoms: string[]) => void;
}

export function Step3Symptoms({ selected, onChange }: Step3Props) {
  function toggle(id: string) {
    onChange(
      selected.includes(id)
        ? selected.filter(s => s !== id)
        : [...selected, id]
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-2xl mb-4">
          🌿
        </div>
        <h2 className="text-2xl font-semibold text-charcoal">Your Symptoms</h2>
        <p className="text-charcoal/60 text-sm leading-relaxed">
          Select everything that resonates. This helps us focus the program on what matters most for you.
        </p>
      </div>

      <div className="space-y-3">
        {PCOS_SYMPTOMS.map(({ id, label }) => {
          const checked = selected.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggle(id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border text-left
                          transition-all duration-200 group
                          ${checked
                            ? 'bg-terracotta/8 border-terracotta/40 shadow-sm'
                            : 'bg-white border-cream-dark hover:border-terracotta/30 hover:bg-terracotta/4'
                          }`}
            >
              {/* Checkbox */}
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0
                            transition-all duration-200
                            ${checked
                              ? 'bg-terracotta border-terracotta'
                              : 'border-charcoal/20 group-hover:border-terracotta/50'
                            }`}
              >
                {checked && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>

              <span className={`text-sm font-medium transition-colors duration-200
                ${checked ? 'text-charcoal' : 'text-charcoal/70'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <p className="text-xs text-charcoal/40 text-center">
          {selected.length} symptom{selected.length > 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  );
}
