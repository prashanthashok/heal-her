export type LearnCategory = 'Fasting' | 'Ayurveda' | 'Hormones' | 'Lifestyle';

export interface LearnArticle {
  id: string;
  title: string;
  category: LearnCategory;
  emoji: string;
  readTime: number; // minutes
  keyTakeaway: string;
  body: string; // markdown-lite: paragraphs separated by \n\n, **bold**, *italic*
}

const ARTICLES: LearnArticle[] = [
  {
    id: 'pcos-insulin-resistance',
    title: 'What Is PCOS — and Why Insulin Resistance Drives It',
    category: 'Hormones',
    emoji: '🔬',
    readTime: 4,
    keyTakeaway: 'PCOS is primarily a metabolic disorder — fix insulin, and the hormones follow.',
    body: `Polycystic Ovary Syndrome affects roughly 1 in 8 women of reproductive age, yet it remains one of the most misunderstood conditions in women's health. The name suggests the problem is in the ovaries — small cysts on the ovarian wall. But those cysts are a symptom, not the cause. The root driver, in 70–80% of cases, is **insulin resistance**.

When cells stop responding properly to insulin, the pancreas compensates by secreting more of it. This chronically elevated insulin directly stimulates the ovarian theca cells to produce excess androgens — primarily testosterone and DHEA-S. These androgens interfere with follicular development, preventing the monthly dominant follicle from maturing and releasing an egg. Instead, multiple immature follicles accumulate — the "cysts" visible on ultrasound.

Elevated androgens also suppress sex hormone-binding globulin (SHBG), the protein that mops up free testosterone in the blood. Lower SHBG means more free, biologically active testosterone circulating — intensifying symptoms like acne, oily skin, facial hair (hirsutism), and scalp hair thinning.

The insulin-androgen loop also disrupts the pituitary signals LH and FSH. In PCOS, LH is typically elevated relative to FSH, further shifting the hormonal environment towards androgen production over oestrogen-progesterone cycling. This is why many women with PCOS have long, irregular cycles or no period at all.

**The healing implication is profound**: this is not a condition you simply "manage" with the pill. Addressing insulin sensitivity through diet, movement, fasting timing, and targeted herbs like fenugreek and guduchi strikes at the actual root cause — and the downstream hormonal normalisation follows naturally.

This 90-day protocol is specifically designed around this understanding: restore metabolic function first, and the reproductive system recalibrates itself.`,
  },

  {
    id: 'fast-like-a-girl-phases',
    title: 'The Fast Like a Girl Cycle Phases Explained',
    category: 'Fasting',
    emoji: '⏱️',
    readTime: 4,
    keyTakeaway: 'Women\'s hormones shift every 7–10 days — your fasting window must shift with them.',
    body: `Dr. Mindy Pelz's core insight in *Fast Like a Girl* is deceptively simple: women are not small men. The standard fasting research was conducted almost entirely on male subjects, and the protocols — extended fasts, aggressive eating windows — were developed without regard for the cyclical hormonal reality of female physiology.

The key is that **oestrogen and progesterone are not static**. They rise and fall in a predictable rhythm across your 28-day cycle, and each phase creates a different metabolic and hormonal environment that either supports or sabotages fasting.

**The Power Phase (Days 1–10)** begins with menstruation and carries through the first week and a half. Oestrogen is rising and is highly compatible with extended fasting. This is when your metabolism is most fat-adapted, insulin sensitivity is at its best, and your body positively thrives on a 16–17 hour fasting window. This is the time for your most disciplined fasting practice.

**The Manifestation Phase (Days 11–15)** is the ovulatory window. Oestrogen peaks just before ovulation, then drops sharply as LH surges. You can still fast — 13–15 hours — but you want to shorten the window slightly to support the hormonal surge needed for ovulation. Longer fasting during this window can suppress LH and interfere with egg release.

**The Nurture Phase (Days 16–28)** is the luteal phase. Progesterone rises and dominates. This hormone is deeply incompatible with extended fasting — it requires glucose, stable blood sugar, and nourishment to be produced adequately. Fasting too long in this phase actively suppresses progesterone, contributing to the luteal phase defect so common in PCOS. Scale back to a gentle 12–13 hour overnight window and eat carbohydrate-rich, grounding foods.

Honouring this rhythm is not weakness — it is precision.`,
  },

  {
    id: 'dosha-pcos',
    title: 'Kapha, Pitta, Vata — and Their Role in Your PCOS',
    category: 'Ayurveda',
    emoji: '🌿',
    readTime: 4,
    keyTakeaway: 'PCOS is primarily a Kapha disorder — but your dominant dosha shapes how it expresses.',
    body: `In Ayurveda, there is no single disease called "PCOS" — instead, the ancient texts describe several overlapping conditions of the female reproductive system that map beautifully onto what modern medicine calls Polycystic Ovary Syndrome. Understanding your dosha helps you understand *why* your PCOS expresses the way it does.

**Kapha dosha** — heavy, slow, dense, cold — is the foundational imbalance in most PCOS presentations. Kapha governs all accumulation in the body: fluid, fat, mucus, cysts. When Kapha is elevated, it creates what the texts call *Ama* (metabolic waste) — a sticky, unprocessed residue that clogs the channels (*srotas*) of the body, including the reproductive channels. Follicles that should mature and release instead accumulate, surrounded by excess Kapha tissue. This is why Kapha-dominant PCOS tends to present with weight gain, insulin resistance, irregular heavy periods, and visible cysts on ultrasound.

**Pitta dosha** — sharp, hot, intense — when aggravated, drives the androgen-dominant presentation of PCOS. Pitta governs transformation, including the enzymatic pathways that produce hormones. Excess Pitta shows up as inflammation, acne (particularly cystic, along the jaw), heavy painful periods, and elevated liver enzymes. Stress is a major Pitta aggravator — cortisol is a Pitta hormone.

**Vata dosha** — light, dry, mobile, irregular — governs the nervous system and all movement in the body. Vata-type PCOS often presents with **absent or very irregular cycles**, anxiety, poor sleep, and low body weight. Vata is aggravated by irregular eating, fasting that is too aggressive, and chronic stress — all of which disrupt the Apana Vata (downward-moving energy) that governs menstruation.

Most women with PCOS have a combination of Kapha and Pitta involvement, with Vata sometimes underlying both. This protocol addresses all three — but knowing your dominant dosha helps you personalise which herbs, foods, and practices to emphasise.`,
  },

  {
    id: 'fasting-women-different',
    title: 'Why Fasting Timing Matters Differently for Women',
    category: 'Fasting',
    emoji: '🌙',
    readTime: 3,
    keyTakeaway: 'The *when* of fasting matters as much as the *how long* — especially around ovulation.',
    body: `The intermittent fasting literature is vast and largely positive — but almost none of it was conducted on women with PCOS. When you look at the female-specific research, a more nuanced picture emerges: the *timing* of your eating window may matter as much as its length.

**Morning-shifted eating windows consistently outperform evening-shifted ones for women's hormonal health.** A 2019 study in the *Journal of Clinical Endocrinology & Metabolism* found that women who ate the same calories within an 8-hour window, but shifted to 8am–4pm vs the more common 12pm–8pm, showed significantly better insulin sensitivity, lower androgens, and improved cholesterol — without changing caloric intake.

The mechanism is circadian. Your metabolism is most insulin-sensitive in the morning, when cortisol peaks naturally and primes your cells to receive glucose. Eating most of your food earlier in the day — and finishing dinner by 6–7pm — aligns your eating with this metabolic window. Late-night eating, even within the same total fasting hours, raises insulin, increases fat storage, and disrupts sleep quality.

For PCOS specifically, **the relationship between fasting and the hypothalamic-pituitary-ovarian (HPO) axis matters deeply**. Fasting triggers a small but real stress response — it elevates cortisol and adrenaline. In the first half of your cycle, this is well-tolerated and even beneficial (it improves autophagy and mitochondrial function). In the second half, when progesterone is trying to establish itself, this same stress response can suppress progesterone production directly.

This is why we don't extend fasts in the Nurture Phase. It is not a compromise — it is a biologically precise decision.`,
  },

  {
    id: 'nurture-phase-eating',
    title: 'The Nurture Phase — Why You Stop Fasting and What to Eat',
    category: 'Fasting',
    emoji: '🍠',
    readTime: 3,
    keyTakeaway: 'Progesterone needs glucose and nourishment — not restriction — to be produced adequately.',
    body: `The Nurture Phase (Days 16–28, the luteal phase) is where most women with PCOS unknowingly undermine their own healing. Having established a disciplined fasting practice in the first half of the cycle, they continue fasting aggressively into the second half — and wonder why their anxiety spikes, their cravings intensify, and their period arrives late, light, or not at all.

The culprit is **progesterone** — or rather, its absence.

Progesterone is produced by the corpus luteum, the temporary glandular structure that forms from the follicle after ovulation. Progesterone production is energetically expensive. The corpus luteum requires consistent glucose delivery and nutritional support to maintain adequate progesterone output throughout the 12–14 days of the luteal phase. When you fast for 16+ hours during this window, you deprive the corpus luteum of the raw material it needs. Progesterone drops. The cycle shortens. The period arrives prematurely — or the luteal phase is "deficient," contributing to infertility and premenstrual symptoms.

**What to eat in the Nurture Phase:** Root vegetables (sweet potato, beetroot, yam), whole grains (brown rice, oats, millet), warming legumes (lentil soup, dal), and healthy fats (ghee, coconut, avocado). These foods provide slow-release glucose that maintains stable blood sugar without spiking insulin — exactly what progesterone production requires.

Avoid aggressive caloric restriction, cold raw foods (they dampen Agni — digestive fire), and high-intensity exercise. This is the phase for walks, yoga, and rest. Your body is doing important internal work.

The Nurture Phase meals in this app are specifically built around these principles — root vegetables, warm wholesome grains, and hormone-feasting foods that give your body what it needs to close the cycle well.`,
  },

  {
    id: 'progesterone-underappreciated',
    title: 'Progesterone — The Underappreciated Hormone',
    category: 'Hormones',
    emoji: '🌸',
    readTime: 4,
    keyTakeaway: 'Almost every PCOS symptom can be traced back — directly or indirectly — to low progesterone.',
    body: `Oestrogen gets most of the cultural attention in women's health — hot flushes, mood, skin — but progesterone is arguably the more important hormone for women with PCOS. And it is almost universally low.

Progesterone is produced primarily in the second half of the cycle, after ovulation, by the corpus luteum. In PCOS, where ovulation is infrequent or absent, progesterone production is correspondingly low or zero. This creates a state called **oestrogen dominance** — not necessarily because oestrogen is too high in absolute terms, but because progesterone is too low to balance it.

The effects of oestrogen dominance are wide-ranging: irregular or absent periods, fibroids, heavy menstrual bleeding when periods do occur, PMS, breast tenderness, bloating, anxiety, and difficulty sleeping. Many women with PCOS have had every one of these symptoms without ever being told that low progesterone was the thread connecting them.

Progesterone also has profound effects on the brain. It converts to **allopregnanolone**, a potent neurosteroid that acts on GABA receptors — the same receptors targeted by benzodiazepines and alcohol. This is why the post-ovulatory phase of a healthy cycle feels calmer and more grounded: natural progesterone is actively soothing the nervous system. When progesterone is low, this calming signal is absent, and anxiety, poor sleep, and irritability result.

**How to support progesterone naturally:**
- Complete the cycle: regular ovulation is the only sustainable source of progesterone
- Vitamin C (amla is the richest natural source) has been shown to improve corpus luteum function and raise progesterone in clinical trials
- Magnesium supports progesterone synthesis — found in leafy greens, nuts, seeds
- Reduce cortisol: progesterone is "stolen" to make cortisol under chronic stress (the "pregnenolone steal")
- Shatavari and Lodhra (Month 3) both have specific evidence for supporting progesterone levels

This 90-day protocol builds towards progesterone restoration methodically — first fixing the insulin and androgen environment, then introducing the herbs that specifically support the ovulatory cycle.`,
  },

  {
    id: 'dinacharya',
    title: 'Ayurvedic Daily Rhythm (Dinacharya) Explained',
    category: 'Ayurveda',
    emoji: '🌅',
    readTime: 4,
    keyTakeaway: "A consistent daily rhythm is itself medicine — your body's hormones follow the clock you set.",
    body: `*Dinacharya* — literally "daily conduct" — is one of Ayurveda's most powerful and least glamorous prescriptions. It describes the ideal daily rhythm for a healthy body: when to wake, when to eat, when to exercise, when to rest. Modern chronobiology has independently arrived at the same conclusions through the science of circadian rhythms.

**Why rhythm matters for PCOS:** Every endocrine gland — the hypothalamus, pituitary, adrenal, thyroid, and ovaries — operates on a circadian clock. These clocks are set primarily by two signals: light (sunrise/sunset) and food timing. When you eat irregularly, sleep at random hours, and expose yourself to artificial light at night, you disrupt the hormonal cascade that governs everything from cortisol to oestrogen to insulin.

The classical Dinacharya for a woman with PCOS-type imbalance:

**Wake by 6am** — before the Kapha time of day (6–10am). Sleeping into Kapha hours increases heaviness, sluggishness, and Ama accumulation. Early rising also ensures you catch the cortisol awakening response at its natural peak.

**Drink warm water with lemon first** — stimulates the liver and bowels, gently kindles Agni (digestive fire), and begins the day alkaline rather than acidic.

**Self-massage (Abhyanga) with warm sesame oil** — 5–10 minutes 3× per week. This grounds Vata, stimulates lymphatic drainage, and has measurable effects on cortisol and anxiety.

**Eat the largest meal at midday** — when Agni is strongest and insulin sensitivity peaks. A light, early dinner (before 7pm where possible) aligns eating with your metabolic clock.

**Wind down from 9pm** — dim lights, stop screens, begin the nervous system's transition towards rest. Ashwagandha milk at this time is not just supplemental — it is a Dinacharya ritual that signals safety and restoration to the body.

Consistency is more powerful than perfection. A body with a reliable daily rhythm is a body that can regulate its hormones.`,
  },

  {
    id: 'cycle-as-health-report',
    title: 'How to Read Your Cycle as a Health Report Card',
    category: 'Lifestyle',
    emoji: '📋',
    readTime: 4,
    keyTakeaway: 'Your menstrual cycle is a monthly health report — its irregularities are messages, not problems.',
    body: `Hippocrates called menstruation "the health of women." Ayurveda describes the cycle as Artava — a sacred monthly cleansing that reflects the state of all three doshas, the quality of Rasa dhatu (plasma/nourishment), and the health of the reproductive system. Both traditions understood something modern gynaecology is slowly rediscovering: **the menstrual cycle is a vital sign**.

Learning to read your cycle is one of the most powerful tools you have for monitoring your own healing progress. Here's what the key variables tell you:

**Cycle length (28 ± 2–3 days is optimal):** A very long cycle (35+ days) typically indicates anovulation — you aren't ovulating, so the cycle stretches waiting for an egg to mature. A very short cycle (under 24 days) often indicates a shortened luteal phase and low progesterone. As your insulin resistance improves, cycles typically shorten towards normal before becoming regular.

**Period colour and consistency:** Bright red blood with no clots and moderate flow for 3–5 days is the ideal. Dark, thick, clotty blood indicates stagnant Kapha and possible excess oestrogen. Pale, watery, scanty flow suggests Vata dominance and insufficient Rasa dhatu (poor nourishment). Brownish spotting before the period starts is a classic sign of low progesterone and corpus luteum insufficiency.

**Premenstrual symptoms:** Moderate symptoms that resolve when bleeding begins are normal. Severe PMS — rage, despair, overwhelming anxiety — is Pitta and Vata derangement and typically reflects progesterone deficiency, elevated cortisol, or both.

**The pattern of improvement:** As this protocol takes effect, you'll typically notice: cycles begin to regularise (Month 1–2), premenstrual symptoms soften (Month 2–3), and flow normalises in colour and duration (Month 3). Track these changes in the Tracker. They are evidence that the deeper healing is working — even before any test result changes.

Your cycle is not your enemy. It is the most precise biofeedback mechanism you possess.`,
  },
];

export default ARTICLES;
