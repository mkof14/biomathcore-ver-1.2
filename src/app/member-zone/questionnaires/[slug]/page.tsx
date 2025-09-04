import QuestionnaireForm from "@/components/questionnaires/QuestionnaireForm";
import { notFound, redirect } from "next/navigation";
import { headers, cookies } from "next/headers";

async function fetchQuestionnaire(slug: string) {
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host  = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const base  = `${proto}://${host}`;

  const ck = await cookies();
  const cookieHeader = ck.toString();

  const res = await fetch(`${base}/api/questionnaires/${slug}`, {
    cache: "no-store",
    headers: { cookie: cookieHeader },
  });

  if (res.status === 401) {
    redirect(`/auth?callbackUrl=/member-zone/questionnaires/${slug}`);
  }
  if (res.status === 403) {
    notFound();
  }
  if (!res.ok) return null;
  return res.json();
}

export default async function QuestionnairePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const q = await fetchQuestionnaire(slug);
  if (!q) return notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{q.title}</h1>
        {q.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{q.description}</p>}
      </div>
      <QuestionnaireForm slug={q.slug} sections={q.sections || []} />
    </div>
  );
}
