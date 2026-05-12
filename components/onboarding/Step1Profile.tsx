interface Step1Data {
  name: string;
  startDate: string;
}

interface Step1Props {
  data: Step1Data;
  onChange: (data: Step1Data) => void;
}

export function Step1Profile({ data, onChange }: Step1Props) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-terracotta/10 flex items-center justify-center text-2xl mb-4">
          🌸
        </div>
        <h2 className="text-2xl font-semibold text-charcoal">Welcome to Heal Her</h2>
        <p className="text-charcoal/60 text-sm leading-relaxed">
          This is your personal 90-day PCOS healing space. Let&apos;s start by getting to know you.
        </p>
      </div>

      <div className="space-y-5">
        {/* Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-charcoal" htmlFor="name">
            Your name
          </label>
          <input
            id="name"
            type="text"
            placeholder="e.g. Priya"
            value={data.name}
            onChange={e => onChange({ ...data, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-white text-charcoal
                       placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-terracotta/40
                       focus:border-terracotta transition-all text-sm"
          />
        </div>

        {/* Program start date */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-charcoal" htmlFor="startDate">
            Program start date
          </label>
          <p className="text-xs text-charcoal/50">Day 1 of your 90-day journey</p>
          <input
            id="startDate"
            type="date"
            value={data.startDate || today}
            max={today}
            onChange={e => onChange({ ...data, startDate: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-white text-charcoal
                       focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta
                       transition-all text-sm"
          />
        </div>
      </div>
    </div>
  );
}
