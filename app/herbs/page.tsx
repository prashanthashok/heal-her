export default function HerbsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-charcoal">Herbs</h1>
        <p className="text-charcoal/60 text-sm mt-1">Your daily herb & supplement schedule.</p>
      </div>
      <div className="card flex flex-col items-center justify-center py-16 text-center">
        <span className="text-4xl mb-4">🌿</span>
        <h2 className="text-lg font-semibold text-charcoal mb-2">Herb & Supplement Reminders</h2>
        <p className="text-sm text-charcoal/50 max-w-xs">
          3-month Ayurvedic herb schedule with daily check-offs — coming in the next feature prompt.
        </p>
      </div>
    </div>
  );
}
