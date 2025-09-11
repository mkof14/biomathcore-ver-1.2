'use client';

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import useSWR from "swr";
import { useMemo } from "react";

type Answer = {
  questionId: string;
  isSensitive: boolean;
  payloadJson: any;
  updatedAt: string;
};
type Session = {
  id: string;
  questionnaireId: string;
  status: string;
  visibility: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string | null;
  anonymizedAt?: string | null;
  answers?: Answer[];
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function MemberIntakeDetails() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const { data, error, isLoading, mutate } = useSWR<{ ok: boolean; session?: Session }>(
    id ? `/api/responses/${encodeURIComponent(id)}` : null,
    fetcher,
    { refreshInterval: 15000 }
  );

  const s = data?.session;

  const meta = useMemo(() => {
    if (!s) return [];
    const toLocal = (d?: string | null) => (d ? new Date(d).toLocaleString() : "");
    return [
      ["Status", s.status],
      ["Visibility", s.visibility],
      ["Progress", `${s.progress}%`],
      ["Created", toLocal(s.createdAt)],
      ["Updated", toLocal(s.updatedAt)],
      s.submittedAt ? ["Submitted", toLocal(s.submittedAt)] : null,
      s.anonymizedAt ? ["Anonymized", toLocal(s.anonymizedAt)] : null,
    ].filter(Boolean) as [string, string][];
  }, [s]);

  const anonymize = async () => {
    if (!id) return;
    const res = await fetch(`/api/responses/${encodeURIComponent(id)}/anonymize`, { method: "POST" });
    if (res.ok) {
      mutate();
    }
  };

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-4">
        <Link
          href="/member/intake"
          className="inline-flex items-center rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
        >
          ← Back to list
        </Link>
      </div>

      <h1 className="text-xl font-semibold mb-4">Session details</h1>

      {!id && <div className="text-sm text-red-600">Missing session id</div>}
      {isLoading && <div className="text-sm opacity-70">Loading…</div>}
      {error && <div className="text-sm text-red-600">Failed to load</div>}
      {!s && !isLoading && id && <div className="text-sm opacity-70">Not found</div>}

      {s && (
        <>
          <div className="rounded-xl border border-black/10 dark:border-white/10 p-4 mb-6 bg-white dark:bg-zinc-900/80">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {meta.map(([k, v]) => (
                <div key={k}>
                  {k}: <b>{v}</b>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <a
              href={`/api/responses/${encodeURIComponent(id)}/export?format=json`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              Export JSON
            </a>
            <a
              href={`/api/responses/${encodeURIComponent(id)}/export?format=csv`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              Export CSV
            </a>
            <button
              onClick={anonymize}
              className="inline-flex items-center rounded-md border border-red-300 dark:border-red-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm hover:bg-red-50 dark:hover:bg-red-900/30"
            >
              Anonymize
            </button>
          </div>

          <div className="rounded-xl border border-black/10 dark:border-white/10 p-4 bg-white dark:bg-zinc-900/80">
            <div className="font-medium mb-2">Answers</div>
            <pre className="text-xs overflow-auto max-h-[60vh]">
{JSON.stringify(
  (s.answers ?? []).map((a: any) => ({
    questionId: a.questionId,
    isSensitive: a.isSensitive,
    payload: a.payloadJson,
    updatedAt: a.updatedAt
  })),
  null,
  2
)}
            </pre>
          </div>
        </>
      )}
    </main>
  );
}
