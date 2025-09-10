export default function Loading() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="h-7 w-40 bg-neutral-800 rounded" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0,1,2].map(i => (
          <div key={i} className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-4 space-y-3">
            <div className="h-5 w-24 bg-neutral-800 rounded" />
            <div className="h-10 w-28 bg-neutral-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
