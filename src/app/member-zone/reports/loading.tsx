export default function Loading() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="h-7 w-40 bg-neutral-800 rounded" />
      <div className="h-9 w-64 bg-neutral-800 rounded" />
      <div className="h-64 w-full bg-neutral-900 rounded-xl border border-neutral-800" />
    </div>
  );
}
