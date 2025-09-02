export default function Loading() {
  return (
    <div className="p-6 space-y-5 animate-pulse">
      <div className="h-7 w-40 bg-neutral-800 rounded" />
      <div className="h-9 w-72 bg-neutral-800 rounded" />
      <div className="h-72 w-full bg-neutral-900 rounded-xl border border-neutral-800" />
    </div>
  );
}
