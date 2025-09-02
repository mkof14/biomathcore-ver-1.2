import Link from "next/link";
import { QUESTIONNAIRE_REGISTRY } from "@/lib/questionnaire/registry";
import FormRenderer from "@/components/forms/FormRenderer";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page(p: PageProps) {
  const { id } = await p.params;
  const sp = await p.searchParams;
  const mode = (sp?.mode as string | undefined) ?? "identified";

  const schema = (QUESTIONNAIRE_REGISTRY as Record<string, any>)[id];

  if (!schema) {
    return (
      <main className="relative z-0 mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/80 p-6">
          <div className="text-lg font-semibold">Not found</div>
          <div className="text-sm opacity-70 mt-2">Unknown questionnaire key: {id}</div>
          <Link
            href="/intake"
            className="inline-block mt-4 rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-sm"
          >
            Back to Intake
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-0 mx-auto max-w-3xl px-4 py-8">
      {/* Sticky back bar that doesn't block clicks below */}
      <div className="sticky top-16 z-10 mb-4 pointer-events-none">
        <Link
          href="/member/intake"
          className="inline-flex items-center rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 pointer-events-auto"
          aria-label="Back to list"
        >
          ← Back
        </Link>
      </div>

      <FormRenderer
        schema={schema}
        questionnaireKey={id}
        visibility={mode === "anonymous" ? "anonymous" : "identified"}
      />
    </main>
  );
}