import type { Dosha } from '@/lib/types';

export type HerbMonth   = 1 | 2 | 3;
export type HerbForm    = 'powder' | 'capsule' | 'tea' | 'food' | 'powder / capsule' | 'powder / food' | 'food / tea';
export type HerbTiming  = 'morning' | 'with meals' | 'evening' | 'morning & evening' | 'morning & with meals';

export interface Herb {
  id: string;
  name: string;
  sanskritName?: string;
  month: HerbMonth;       // when introduced (cumulative — Month 2 also includes Month 1)
  timing: HerbTiming;
  form: HerbForm;
  dose: string;
  purpose: string;        // one sentence
  description: string;    // 2–3 sentences
  dosha: Dosha[];
  emoji: string;
}

const HERBS: Herb[] = [

  // ── MONTH 1 ──────────────────────────────────────────────────────────────

  {
    id: 'shatavari',
    name: 'Shatavari',
    sanskritName: 'Asparagus racemosus',
    month: 1,
    timing: 'morning & evening',
    form: 'powder / capsule',
    dose: '500 mg capsule or ½ tsp powder in warm milk, twice daily',
    purpose: 'Nourishes the reproductive system and supports healthy oestrogen balance.',
    description:
      'Shatavari — literally "she who possesses a hundred husbands" — is Ayurveda\'s premier female reproductive tonic, deeply nourishing to the uterus, ovaries, and hormonal intelligence of the body. As an adaptogen, it modulates the HPA (stress) axis to prevent cortisol-driven hormonal disruption. Clinically, it supports healthy LH/FSH ratios, promotes follicular development, and has shown ovulation-inducing effects in PCOS in multiple studies.',
    dosha: ['vata', 'pitta'],
    emoji: '🌱',
  },

  {
    id: 'ashwagandha',
    name: 'Ashwagandha',
    sanskritName: 'Withania somnifera',
    month: 1,
    timing: 'evening',
    form: 'powder / capsule',
    dose: '½ tsp powder in warm milk (your evening ashwagandha milk) or 300–500 mg capsule',
    purpose: 'Reduces cortisol, builds stress resilience, and supports thyroid function.',
    description:
      'Ashwagandha (Winter Cherry) is the most clinically researched Ayurvedic adaptogen, with multiple trials confirming it reduces serum cortisol by up to 28% — critical because elevated cortisol is a primary driver of PCOS, directly suppressing ovulation and increasing androgen production. Taken at night it also improves deep sleep quality, which is when the most important hormonal repair happens. It has specific thyroid-stimulating activity and supports a healthy TSH range without pharmaceutical side effects.',
    dosha: ['vata', 'kapha'],
    emoji: '🍂',
  },

  {
    id: 'turmeric_ginger',
    name: 'Turmeric + Ginger',
    sanskritName: 'Curcuma longa + Zingiber officinale',
    month: 1,
    timing: 'morning & with meals',
    form: 'food / tea',
    dose: '½ tsp turmeric + ¼ tsp ginger daily — golden milk in the morning, in cooking throughout the day',
    purpose: 'Reduces systemic inflammation and supports liver-mediated hormone clearance.',
    description:
      'Curcumin (from turmeric) directly inhibits the NF-κB inflammatory pathway — the same pathway responsible for insulin resistance and androgen excess in PCOS — and has shown blood-sugar-lowering effects comparable to metformin in some trials. Ginger amplifies curcumin\'s bioavailability by up to 20× when combined, while adding its own potent anti-androgenic, anti-nausea, and circulation-enhancing effects. The black pepper in your golden milk further enhances absorption via piperine — these three together are far more powerful than any one alone.',
    dosha: ['kapha', 'vata'],
    emoji: '🌿',
  },

  {
    id: 'triphala',
    name: 'Triphala',
    sanskritName: 'Amalaki + Bibhitaki + Haritaki',
    month: 1,
    timing: 'evening',
    form: 'powder / capsule',
    dose: '½ tsp powder in warm water 30–45 min before bed, or 2 capsules with warm water',
    purpose: 'Cleanses the digestive tract, reduces Ama (metabolic waste), and supports oestrogen excretion via the gut.',
    description:
      'Triphala — three fruits in one — is the most prescribed formulation in Ayurveda because it gently cleanses all three doshas simultaneously without depleting the body\'s reserves. In PCOS specifically, it addresses the root cause: Ama (unprocessed metabolic waste) accumulating in the channels (srotas) and clogging hormonal signalling. By optimising bowel transit time and liver detoxification phases I and II, it ensures that excess oestrogen metabolites are actually eliminated rather than recirculated — a key driver of oestrogen dominance and cyst formation.',
    dosha: ['vata', 'pitta', 'kapha'],
    emoji: '🍃',
  },

  // ── MONTH 2 ADDITIONS ────────────────────────────────────────────────────

  {
    id: 'kanchanaar_guggul',
    name: 'Kanchanaar Guggul',
    sanskritName: 'Bauhinia variegata + Commiphora mukul',
    month: 2,
    timing: 'morning',
    form: 'capsule',
    dose: '2 tablets before breakfast and 2 before dinner, or as directed by an Ayurvedic practitioner',
    purpose: 'Specifically indicated in Ayurveda for cysts, glandular growths, and thyroid support.',
    description:
      'Kanchanaar Guggul is the most important Ayurvedic formula for PCOS — classical texts prescribe it explicitly for "granthi" (cystic growths) in the reproductive organs. Kanchanaar bark has a specific affinity for glandular tissue, reducing the Kapha-dominant accumulation that underlies follicular cysts on the ovaries. Guggul (Commiphora mukul resin) is a clinically validated thyroid stimulant and lipid-lowering agent that also reduces AMH levels — the hormone elevated in most PCOS presentations.',
    dosha: ['kapha', 'vata'],
    emoji: '🌸',
  },

  {
    id: 'guduchi',
    name: 'Guduchi (Giloy)',
    sanskritName: 'Tinospora cordifolia',
    month: 2,
    timing: 'morning',
    form: 'powder / capsule',
    dose: '500 mg capsule or ½ tsp powder in warm water on an empty stomach',
    purpose: 'Modulates immunity, reduces insulin resistance, and resolves deep-seated chronic inflammation.',
    description:
      'Guduchi (Amrita — "divine nectar") is classified as a Rasayana: a rejuvenating herb that acts at the cellular level to improve immune intelligence and reduce oxidative stress throughout the body. Research shows its active alkaloids improve insulin sensitivity and reduce fasting blood glucose through mechanisms similar to metformin, without affecting the gut microbiome negatively. It specifically addresses the immune-mediated chronic inflammation that underlies both PCOS and autoimmune thyroid conditions like Hashimoto\'s.',
    dosha: ['vata', 'pitta', 'kapha'],
    emoji: '🍀',
  },

  {
    id: 'fenugreek_seeds',
    name: 'Fenugreek Seeds',
    sanskritName: 'Trigonella foenum-graecum (Methi dana)',
    month: 2,
    timing: 'with meals',
    form: 'food / tea',
    dose: '1 tsp soaked seeds with breakfast, or 1 glass of methi water (soak 1 tsp overnight, drink water in the morning)',
    purpose: 'Directly improves insulin sensitivity and lowers free testosterone in PCOS.',
    description:
      'Fenugreek seeds contain 4-hydroxyisoleucine — a rare amino acid that directly stimulates insulin secretion and improves peripheral insulin sensitivity. Multiple clinical trials confirm that 10 g of fenugreek seeds daily reduces fasting blood glucose, lowers free testosterone, and improves menstrual regularity in PCOS within 8 weeks. This is a daily food, not a supplement — include it liberally in your cooking as methi dal, thepla, and parathas for cumulative therapeutic benefit.',
    dosha: ['kapha', 'vata'],
    emoji: '🌾',
  },

  {
    id: 'spearmint_tea',
    name: 'Spearmint Tea',
    sanskritName: 'Mentha spicata',
    month: 2,
    timing: 'with meals',
    form: 'tea',
    dose: '1–2 cups daily of fresh spearmint tea (use spearmint specifically — not peppermint)',
    purpose: 'Clinically proven to reduce free testosterone and improve hirsutism and acne in PCOS.',
    description:
      'Spearmint is the most well-researched herbal anti-androgen in conventional science. A landmark 2010 randomised controlled trial found that two cups of spearmint tea daily for 30 days significantly reduced free testosterone and LH levels in women with PCOS. Unlike pharmaceutical anti-androgens, spearmint achieves this without systemic side effects — it works by inhibiting 5-alpha reductase activity locally. It is gentle enough to drink daily and pairs beautifully with the CCF tea protocol after meals.',
    dosha: ['pitta', 'kapha'],
    emoji: '🫖',
  },

  // ── MONTH 3 ADDITIONS ────────────────────────────────────────────────────

  {
    id: 'lodhra',
    name: 'Lodhra',
    sanskritName: 'Symplocos racemosa',
    month: 3,
    timing: 'morning',
    form: 'powder / capsule',
    dose: '500 mg capsule or ½ tsp powder in warm water, morning on empty stomach',
    purpose: 'A classical uterine tonic that modulates FSH and LH balance and promotes ovarian health.',
    description:
      'Lodhra is one of Ayurveda\'s most important herbs for female reproductive disorders — classical texts mention it specifically for "yonivyapad" (diseases of the uterus and ovaries). Modern research has validated this ancient knowledge: lodhra bark alkaloids (loturine, colloturine) have been shown to modulate FSH and LH secretion, directly addressing the hormonal imbalance at the core of PCOS. It also has mild anti-androgenic activity and supports the development of healthy endometrial tissue — particularly valuable in Month 3 as you consolidate cycle regularity.',
    dosha: ['pitta', 'kapha'],
    emoji: '🌺',
  },

  {
    id: 'shatapushpa',
    name: 'Shatapushpa',
    sanskritName: 'Anethum sowa (Dill seeds)',
    month: 3,
    timing: 'with meals',
    form: 'food / tea',
    dose: '½ tsp seeds chewed after meals, or steeped 5 min as a post-meal tea',
    purpose: 'Regulates menstrual cycles and inhibits 5-alpha reductase to reduce DHT-driven symptoms.',
    description:
      'Shatapushpa ("hundred flowers") is the Ayurvedic name for dill seed — a herb used for thousands of years for menstrual regulation that modern science is now validating. Its flavonoids inhibit 5-alpha reductase, the enzyme that converts testosterone to the more potent DHT — the androgen responsible for acne, hair thinning, and facial hair growth in PCOS. Research also shows d-carvone (a constituent of dill) has demonstrated anti-cystic activity on ovarian tissue. As a digestive herb it also alleviates the bloating and cramping of the luteal phase.',
    dosha: ['vata', 'kapha'],
    emoji: '🌼',
  },

  {
    id: 'amla',
    name: 'Amla',
    sanskritName: 'Emblica officinalis (Indian Gooseberry)',
    month: 3,
    timing: 'morning',
    form: 'powder / food',
    dose: '1 tsp amla powder in water or juice, or 1–2 fresh/dried amla berries daily',
    purpose: 'The richest natural source of Vitamin C — supports collagen, liver detox, and progesterone production.',
    description:
      'Amla is considered the crown jewel of Ayurvedic Rasayana therapy — the single herb most associated with longevity, cellular renewal, and hormonal resilience. It contains 20× the Vitamin C of an orange, and unlike synthetic ascorbic acid, this naturally complexed form is heat-stable and remains active even after cooking. Vitamin C has been shown in clinical trials to improve progesterone levels by supporting corpus luteum function post-ovulation — directly addressing the progesterone deficiency characteristic of PCOS. As a liver tonic, amla also enhances Phase II liver detoxification pathways needed to properly clear excess oestrogen.',
    dosha: ['vata', 'pitta', 'kapha'],
    emoji: '🫐',
  },

];

export default HERBS;
