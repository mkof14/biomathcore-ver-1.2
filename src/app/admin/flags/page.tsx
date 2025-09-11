export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

export default function FlagsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Feature Flags</h2>
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-sm opacity-80">
        This is a stub for toggles/experiments. In future: DB-backed flags, per-user/per-org targeting.
      </div>
    </div>
  );
}
