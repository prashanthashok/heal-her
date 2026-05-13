'use client';

import { useState } from 'react';

interface Preparation {
  time: string;
  icon: string;
  name: string;
  ingredients: string[];
  method: string;
  benefit: string;
  accentColor: string;
  borderColor: string;
}

const SPICE_PREPS: Preparation[] = [
  {
    time: 'Morning',
    icon: '🌅',
    name: 'Golden Milk',
    ingredients: ['1 cup warm milk (dairy or oat)', '½ tsp turmeric', '¼ tsp ginger powder', 'Pinch of black pepper', '¼ tsp cinnamon', '1 tsp ghee', '1 tsp raw honey (add after cooling slightly)'],
    method: 'Warm milk gently — do not boil. Whisk in turmeric, ginger, pepper, and cinnamon. Stir in ghee until melted. Pour into a mug. Once slightly cooled (below 40°C), stir in honey. Drink slowly before breakfast.',
    benefit: 'Turmeric\'s curcumin is activated by both fat (ghee) and piperine (black pepper), making this combination far more bioavailable than turmeric alone. This trio reduces systemic inflammation — the root driver of PCOS — and gently warms digestive fire to begin the day.',
    accentColor: 'text-gold-dark',
    borderColor: 'border-gold/30',
  },
  {
    time: 'With Meals',
    icon: '🍵',
    name: 'CCF Tea',
    ingredients: ['½ tsp cumin seeds (jeera)', '½ tsp coriander seeds (dhania)', '½ tsp fennel seeds (saunf)', '2 cups water'],
    method: 'Add seeds to cold water. Bring to a boil. Reduce heat and simmer 5 min. Strain into a thermos. Sip warm throughout meals — or drink a cup just before eating to kindle Agni (digestive fire).',
    benefit: 'CCF tea is the simplest and most powerful Ayurvedic digestive formula. Cumin kindles Agni; coriander is cooling and anti-inflammatory; fennel prevents bloating and balances hormones. Together they support detoxification pathways, reduce Ama (metabolic waste), and are specific for PCOS-related digestive sluggishness.',
    accentColor: 'text-sage-dark',
    borderColor: 'border-sage/30',
  },
  {
    time: 'Evening',
    icon: '🌙',
    name: 'Ashwagandha Milk',
    ingredients: ['1 cup warm full-fat milk', '½ tsp ashwagandha powder', '¼ tsp cardamom', '1 tsp ghee', '1 tsp jaggery or honey', 'Pinch of nutmeg (optional)'],
    method: 'Warm milk until steaming (not boiling). Add ashwagandha and cardamom. Whisk until frothy. Stir in ghee and sweeten with jaggery. Drink 30–45 min before sleep in a calm, dimly lit space.',
    benefit: 'Ashwagandha is an Ayurvedic adaptogen clinically shown to reduce cortisol by up to 28% — cortisol excess is a key driver of PCOS severity. Taken at night, it supports the HPA axis, improves deep sleep quality, and directly nourishes reproductive tissues (shukra dhatu) while you rest.',
    accentColor: 'text-terracotta',
    borderColor: 'border-terracotta/30',
  },
];

function SpiceCard({ prep }: { prep: Preparation }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`rounded-2xl bg-white border ${prep.borderColor} overflow-hidden transition-all duration-300`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
      >
        <span className="text-2xl flex-shrink-0">{prep.icon}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-bold uppercase tracking-widest ${prep.accentColor}`}>{prep.time}</p>
          <p className="text-sm font-semibold text-charcoal">{prep.name}</p>
        </div>
        <span className={`text-charcoal/30 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-cream-dark/50">
          {/* Ingredients */}
          <div className="pt-3 space-y-2">
            <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">Ingredients</p>
            <ul className="space-y-1">
              {prep.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-charcoal/70">
                  <span className={`mt-1.5 w-1 h-1 rounded-full flex-shrink-0 ${prep.accentColor.replace('text-', 'bg-')}`} />
                  {ing}
                </li>
              ))}
            </ul>
          </div>
          {/* Method */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">Method</p>
            <p className="text-xs text-charcoal/70 leading-relaxed">{prep.method}</p>
          </div>
          {/* Benefit */}
          <div className={`rounded-xl bg-cream-dark/40 p-3 border ${prep.borderColor}`}>
            <p className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-1">Why it works</p>
            <p className="text-xs text-charcoal/70 leading-relaxed">{prep.benefit}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function SpiceProtocol() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="section-title">Daily Spice Protocol</h2>
        <span className="text-[10px] font-medium text-charcoal/40 bg-cream-dark rounded-full px-2 py-0.5">
          Always
        </span>
      </div>
      <p className="text-xs text-charcoal/50 -mt-1">
        These three preparations support digestion, reduce inflammation, and nourish your hormones every day — regardless of cycle phase.
      </p>
      <div className="space-y-2">
        {SPICE_PREPS.map(prep => (
          <SpiceCard key={prep.time} prep={prep} />
        ))}
      </div>
    </div>
  );
}
