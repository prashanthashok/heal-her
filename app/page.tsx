export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-charcoal">Good morning ✦</h1>
        <p className="text-charcoal/60 text-sm mt-1">Your 90-day healing journey begins here.</p>
      </div>

      {/* Coming soon card */}
      <div className="card flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center mb-4">
          <span className="text-3xl">🌿</span>
        </div>
        <h2 className="text-lg font-semibold text-charcoal mb-2">Dashboard coming soon</h2>
        <p className="text-sm text-charcoal/50 max-w-xs">
          Your daily checklist, cycle phase, and fasting window will appear here once onboarding is complete.
        </p>
      </div>

      {/* Quick nav cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { emoji: '📅', label: 'Tracker', sub: 'Log today', href: '/tracker', bg: 'bg-sage/10' },
          { emoji: '🍲', label: 'Meals', sub: 'This week\'s plan', href: '/meals', bg: 'bg-terracotta/10' },
          { emoji: '🌿', label: 'Herbs', sub: 'Daily schedule', href: '/herbs', bg: 'bg-gold/10' },
          { emoji: '📖', label: 'Learn', sub: 'PCOS + Ayurveda', href: '/learn', bg: 'bg-charcoal/5' },
        ].map(({ emoji, label, sub, href, bg }) => (
          <a
            key={href}
            href={href}
            className={`${bg} rounded-2xl p-4 flex flex-col gap-2 hover:shadow-md transition-shadow duration-200`}
          >
            <span className="text-2xl">{emoji}</span>
            <div>
              <p className="font-semibold text-charcoal text-sm">{label}</p>
              <p className="text-charcoal/50 text-xs">{sub}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
