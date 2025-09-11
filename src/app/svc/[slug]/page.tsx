export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

import { notFound } from "next/navigation";
import allCategories from "@/components/data/allCategories";
import BackToServices from "@/components/ui/BackToServices";
import { slugify } from "@/lib/slug";

type Plan = "free" | "pro" | "premium";
type Service = {
  title: string;
  description?: string;
  icon?: string;
  plan?: Plan;
};
type Category = {
  name: string;
  color?: string;
  icon?: string;
  description?: string;
  services: Service[];
};

function findBySlug(slug: string) {
  for (const cat of allCategories as Category[]) {
    const svc = (cat.services || []).find((s) => slugify(s.title) === slug);
    if (svc) return { category: cat, service: svc };
  }
  return null;
}

function bgGrad(color?: string) {
  switch (color) {
    case "indigo":
      return "from-indigo-800 to-indigo-900 dark:from-indigo-950 dark:to-black";
    case "red":
      return "from-red-800 to-red-900 dark:from-red-950 dark:to-black";
    case "green":
      return "from-green-800 to-green-900 dark:from-green-950 dark:to-black";
    case "yellow":
      return "from-yellow-800 to-yellow-900 dark:from-yellow-950 dark:to-black";
    case "blue":
      return "from-blue-800 to-blue-900 dark:from-blue-950 dark:to-black";
    case "pink":
      return "from-pink-800 to-pink-900 dark:from-pink-950 dark:to-black";
    case "teal":
      return "from-teal-800 to-teal-900 dark:from-teal-950 dark:to-black";
    case "rose":
      return "from-rose-800 to-rose-900 dark:from-rose-950 dark:to-black";
    case "orange":
      return "from-orange-800 to-orange-900 dark:from-orange-950 dark:to-black";
    case "cyan":
      return "from-cyan-800 to-cyan-900 dark:from-cyan-950 dark:to-black";
    case "lime":
      return "from-lime-800 to-lime-900 dark:from-lime-950 dark:to-black";
    case "amber":
      return "from-amber-800 to-amber-900 dark:from-amber-950 dark:to-black";
    case "violet":
      return "from-violet-800 to-violet-900 dark:from-violet-950 dark:to-black";
    case "fuchsia":
      return "from-fuchsia-800 to-fuchsia-900 dark:from-fuchsia-950 dark:to-black";
    case "gray":
      return "from-gray-800 to-gray-900 dark:from-gray-950 dark:to-black";
    case "sky":
      return "from-sky-800 to-sky-900 dark:from-sky-950 dark:to-black";
    case "emerald":
      return "from-emerald-800 to-emerald-900 dark:from-emerald-950 dark:to-black";
    default:
      return "from-gray-800 to-gray-900 dark:from-gray-950 dark:to-black";
  }
}

function PlanBadge({ plan }: { plan?: Plan }) {
  if (!plan) return null;
  const colors: Record<Plan, string> = {
    free: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
    pro: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200",
    premium:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200",
  };
  const label: Record<Plan, string> = {
    free: "Free",
    pro: "Pro",
    premium: "Premium",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${colors[plan]}`}
    >
      {label[plan]}
    </span>
  );
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const hit = findBySlug(slug);
  if (!hit) return notFound();

  const { category, service } = hit;
  const bigIcon = service.icon ?? category.icon ?? "🧩";
  const desc =
    service.description ??
    `Explore ${service.title} — part of the ${category.name} suite.`;
  const plan = service.plan ?? "free";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* top row */}
        <div className="flex items-center justify-between mb-6">
          <BackToServices />
          <div className="text-sm opacity-70">
            <span className="hidden sm:inline">Services</span>
            <span className="mx-2">/</span>
            <span className="hidden sm:inline">{category.name}</span>
            <span className="mx-2">/</span>
            <b>{service.title}</b>
          </div>
        </div>

        {/* hero */}
        <div
          className={`rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gradient-to-br ${bgGrad(
            category.color,
          )} p-6 mb-8`}
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl drop-shadow">{bigIcon}</div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow">
                {service.title}
              </h1>
              <div className="mt-2 inline-flex items-center gap-2">
                <PlanBadge plan={plan} />
                <span className="text-white/80 text-xs sm:text-sm">
                  {category.name}
                </span>
              </div>
            </div>
          </div>
          {desc && (
            <p className="mt-4 text-white/90 text-sm sm:text-base max-w-3xl">
              {desc}
            </p>
          )}
        </div>

        {/* content */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <section className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-white/10 p-5">
              <h2 className="text-lg font-semibold mb-2">What it does</h2>
              <p className="text-sm opacity-80">{desc}</p>
            </section>

            <section className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-white/10 p-5">
              <h2 className="text-lg font-semibold mb-2">How to use</h2>
              <ol className="list-decimal pl-5 space-y-2 text-sm opacity-90">
                <li>
                  Open <b>Services</b> and use <i>Quick Run</i> for instant
                  analysis.
                </li>
                <li>
                  Or paste your data in the modal and press <b>Generate</b>.
                </li>
                <li>Save the result or share it via email/PDF.</li>
              </ol>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-white/10 p-5">
              <h3 className="text-sm font-semibold mb-2">Privacy & Safety</h3>
              <p className="text-xs opacity-80">
                Your data is protected by the <b>Health Black Box</b>: E2E
                encryption, immutable audit log, and zero-knowledge processing.
              </p>
            </section>

            <section className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-white/10 p-5">
              <h3 className="text-sm font-semibold mb-2">Plan</h3>
              <div className="flex items-center gap-2">
                <PlanBadge plan={plan} />
                <span className="text-xs opacity-80">
                  This feature is available on your plan.
                </span>
              </div>
            </section>
          </aside>
        </div>

        <div className="mt-10">
          <BackToServices />
        </div>
      </div>
    </div>
  );
}
