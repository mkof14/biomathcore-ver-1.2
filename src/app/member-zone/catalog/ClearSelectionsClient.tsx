'use client';
import { useState } from 'react';

export default function ClearSelectionsClient() {
  const [busy, setBusy] = useState(false);

  const clearAll = async () => {
    if (!confirm('Clear all selected services?')) return;
    setBusy(true);
    try {
      const res = await fetch('/api/catalog/selections', { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed');
      alert(`Cleared ${data.deleted} selections`);
      location.reload();
    } catch (e: any) {
      alert(e?.message || 'Error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="sticky top-0 z-40 w-full border-b bg-white/70 dark:bg-neutral-950/70 backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:supports-[backdrop-filter]:bg-neutral-950/50">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-end">
        <button
          onClick={clearAll}
          disabled={busy}
          className="rounded-2xl px-4 py-2 bg-black text-white disabled:opacity-50 hover:opacity-90 transition"
        >
          {busy ? 'Clearing…' : 'Clear selections'}
        </button>
      </div>
    </div>
  );
}
