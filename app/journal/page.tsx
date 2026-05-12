export default function JournalPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-charcoal">Journal</h1>
        <p className="text-charcoal/60 text-sm mt-1">Your private healing journal.</p>
      </div>
      <div className="card flex flex-col items-center justify-center py-16 text-center">
        <span className="text-4xl mb-4">🖊️</span>
        <h2 className="text-lg font-semibold text-charcoal mb-2">Progress Journal</h2>
        <p className="text-sm text-charcoal/50 max-w-xs">
          Date-stamped entries, monthly reflection prompts, and a scrollable timeline — coming in the next feature prompt.
        </p>
      </div>
    </div>
  );
}
