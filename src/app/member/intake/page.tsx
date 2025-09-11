'use client';

import useSWR from "swr";
import Link from "next/link";

type Session = {
  id: string;
  questionnaireId: string;
  status: string;
  visibility: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  anonymizedAt?: string | null;
};

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function MemberIntakeList() {
  const { data, error, isLoading, mutate } = useSWR<{ ok: boolean; sessions: Session[] }>("/api/responses", fetcher, { refreshInterval: 15000 });

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Questionnaires</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Your saved and in-progress intake forms.</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
          Failed to load sessions.
        </div>
      )}

      {isLoading && <div className="text-sm text-zinc-500">Loading…</div>}

      <div className="space-y-4">
        {(data?.sessions ?? []).map((s) => (
          <div key={s.id} className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/80 px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm">
                <div className="font-medium">{s.questionnaireId}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  Status: <b>{s.status}</b> · Visibility: <b>{s.visibility}</b> · Progress: <b>{s.progress}%</b>
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  Updated: {new Date(s.updatedAt ?? s.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/intake/${s.questionnaireId}`}
                  className="inline-flex items-center rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  Open
                </Link>

                <Link
                  href={`/member/intake/${s.id}`}
                  className="inline-flex items-center rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  Details
                </Link>

                <a
                  href={`/api/responses/${s.id}/export?format=json`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  aria-label="Open raw JSON in a new tab"
                >
                  JSON
                </a>

                <a
                  href={`/api/responses/${s.id}/export?format=csv`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  CSV
                </a>

                <form
                  action={`/api/responses/${s.id}/anonymize`}
                  method="post"
                  onSubmit={() => setTimeout(() => mutate(), 400)}
                >
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-md border border-red-300 dark:border-red-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm hover:bg-red-50 dark:hover:bg-red-900/30"
                    title="Remove user link and mark as anonymous"
                  >
                    Anonymize
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}

        {(data?.sessions?.length ?? 0) === 0 && !isLoading && (
          <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/80 px-5 py-6">
            No questionnaires yet.
          </div>
        )}
      </div>
    </main>
  );
}
