import QuestionnaireForm from "@/components/questionnaires/QuestionnaireForm";
import { notFound, redirect } from "next/navigation";
import { headers, cookies } from "next/headers";

async function fetchQuestionnaire(slug: string) {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host  = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const base  = `${proto}://${host}`;

  const ck = await cookies();
  const res = await fetch(`${base}/api/questionnaires/${slug}`, {
    cache: "no-store",
    headers: { cookie: ck.toString() },
  });

  if (res.status === 401) {
    redirect(`/auth?callbackUrl=/member-zone/questionnaires/${slug}`);
  }
  if (res.status === 403) {
    const hint = await res.json().catch(() => ({}));
    const qp = new URLSearchParams({
      reason: "plan_required",
      plan: hint?.requiredPlans || "",
      from: `/member-zone/questionnaires/${slug}`,
    });
    redirect(`/pricing?${qp.toString()}`);
  }
  if (!res.ok) return null;
  return res.json();
}

export default async function QuestionnairePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const q = await fetchQuestionnaire(slug);
  if (!q) return notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <a href="/member-zone/questionnaires" className="rounded-xl px-3 py-1.5 border hover:bg-black/5 dark:hover:bg-white/5 text-sm">← Back</a>
        <h1 className="text-2xl font-semibold">{q.title}</h1>
      </div>
      {q.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{q.description}</p>}
      <QuestionnaireForm slug={q.slug} sections={q.sections || []} />
    </div>
  );
}
