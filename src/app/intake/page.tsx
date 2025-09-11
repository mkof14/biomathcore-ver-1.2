export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

import Link from "next/link";
import { QUESTIONNAIRE_REGISTRY } from "@/lib/questionnaire/registry";

type Item = { key: string; title: string; description?: string };

function allForms(): Item[] {
  return Object.entries(QUESTIONNAIRE_REGISTRY).map(([key, s]: [string, any]) => ({
    key,
    title: s.title ?? key,
    description: s.description ?? "",
  }));
}

export default async function IntakeIndex() {
  const forms = allForms();
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-4"><BackButton href="/member-zone" /></div>
<h1 className="text-2xl font-semibold mb-2">Questionnaires</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        Choose a form to start or continue.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {forms.map((f) => (
          <div key={f.key} className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/80 p-5">
            <div className="font-medium">{f.title}</div>
            {f.description && (
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{f.description}</div>
            )}
            <div className="mt-4">
              <Link
                href={`/intake/${f.key}`}
                className="inline-flex items-center rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                Start
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
