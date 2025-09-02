"use client";
import { useEffect, useState } from 'react';

type Session = {
  id: string;
  questionnaireId: string;
  visibility: 'identified'|'anonymous';
  status: 'DRAFT'|'SUBMITTED';
  progress: number;
  createdAt: string;
};

export default function IntakeSessionsPage() {
  const [rows, setRows] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/responses?take=50')
      .then(r => r.json())
      .then(d => setRows(d?.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Intake Sessions
      </h1>

      <div className="grid gap-3">
        {loading && (
          <div className="rounded-xl border border-white/10 bg-black/40 text-white p-4">
            Loading...
          </div>
        )}
        {!loading && rows.length === 0 && (
          <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-black text-gray-700 dark:text-gray-200 p-6">
            No sessions yet.
          </div>
        )}
        {rows.map(s => (
          <a key={s.id} href={`/api/responses/${s.id}`} target="_blank" rel="noreferrer"
             className="block rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 p-4 hover:shadow transition">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{s.id}</div>
              <span className={`text-xs px-2 py-1 rounded-full ${s.status === 'SUBMITTED' ? 'bg-emerald-600 text-white' : 'bg-zinc-700 text-white'}`}>
                {s.status}
              </span>
            </div>
            <div className="mt-2 text-sm opacity-80">
              <div>Visibility: {s.visibility}</div>
              <div>Progress: {s.progress}%</div>
              <div>Created: {new Date(s.createdAt).toLocaleString()}</div>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
