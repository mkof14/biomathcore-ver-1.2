"use client";
import useSWR from "swr";
import Link from "next/link";

type Questionnaire = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  category?: string | null;
  visibility: "PUBLIC"|"LOGGED_IN"|"PLAN_GATED";
  requiredPlans: string;
};

const fetcher = (url: string) => fetch(url).then(r => r.json());

function PlanBadge({ visibility, requiredPlans }: { visibility: Questionnaire["visibility"]; requiredPlans: string }) {
  if (visibility === "PUBLIC") return <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">Public</span>;
  if (visibility === "LOGGED_IN") return <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">Members</span>;
  return (
    <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">
      Requires plan: {requiredPlans || "Any premium"}
    </span>
  );
}

export default function QuestionnairesPage() {
  const { data, error } = useSWR<Questionnaire[]>("/api/questionnaires", fetcher);

  if (error) return <div className="p-6">Failed to load questionnaires.</div>;
  const questionnaires = data || [];
  const grouped = questionnaires.reduce((acc: Record<string, Questionnaire[]>, q) => {
    const k = q.category || "General";
    acc[k] = acc[k] || [];
    acc[k].push(q);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Questionnaires</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Complete your profile to unlock personalized AI-driven reports.
          </p>
        </div>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No questionnaires available.</p>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <section key={category} className="space-y-4">
            <h2 className="text-lg font-medium">{category}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {items.map((q) => (
                <Link key={q.id} href={`/member-zone/questionnaires/${q.slug}`} className="rounded-2xl border hover:shadow-sm transition p-4 block">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{q.title}</h3>
                    <PlanBadge visibility={q.visibility} requiredPlans={q.requiredPlans} />
                  </div>
                  {q.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">{q.description}</p>}
                </Link>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
