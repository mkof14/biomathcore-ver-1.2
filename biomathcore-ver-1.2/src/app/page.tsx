// src/app/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import AskAiButton from "@/components/AskAiButton";

// Icons (mapped by iconKey coming from API)
import {
  Activity,
  Apple,
  Brain,
  Dumbbell,
  Eye,
  Flower,
  HeartPulse,
  Microscope,
  Moon,
  Scale,
  ShieldPlus,
  Smile,
  Sprout,
  Stethoscope,
  SunMedium,
  TestTube,
  Users2,
  Stars,
  Syringe,
} from "lucide-react";

/* ---------- Page metadata ---------- */
export const metadata: Metadata = {
  title: "BioMath Core",
  description:
    "Personalized, math-driven health insights, daily guidance, and high-quality services—built for real life.",
};

/* ---------- Types ---------- */
type CategoryApi = {
  slug: string;
  name: string;
  blurb: string | null;
  iconKey: string | null;
};

type CategoryUi = {
  slug: string;
  name: string;
  blurb: string;
  Icon: React.ElementType;
  tint: string;
};

/* ---------- Icon map (iconKey -> component) ---------- */
const ICONS: Record<string, React.ElementType> = {
  ShieldPlus,
  Activity,
  Sprout,
  Brain,
  Dumbbell,
  Smile,
  SunMedium,
  Stars,
  Apple,
  Moon,
  Microscope,
  Users2,
  Stethoscope,
  TestTube,
  Syringe,
  Eye,
  HeartPulse,
  Scale,
  Flower,
};

/* ---------- Tint map (slug -> gradient + border) ---------- */
const TINTS: Record<string, string> = {
  "critical-health": "from-[#1f2937] to-[#111827] border-white/10",
  "everyday-wellness": "from-[#0ea5e9]/20 to-[#0b0f1a] border-cyan-500/20",
  "longevity-anti-aging": "from-[#f59e0b]/25 to-[#0b0f1a] border-amber-400/25",
  "mental-wellness": "from-[#a78bfa]/25 to-[#0b0f1a] border-violet-400/25",
  "fitness-performance": "from-[#ef4444]/20 to-[#0b0f1a] border-rose-400/25",
  "womens-health": "from-[#f472b6]/25 to-[#0b0f1a] border-pink-400/25",
  "mens-health": "from-[#60a5fa]/25 to-[#0b0f1a] border-blue-400/25",
  "beauty-skincare": "from-[#f9a8d4]/25 to-[#0b0f1a] border-fuchsia-300/25",
  "nutrition-diet": "from-[#34d399]/25 to-[#0b0f1a] border-emerald-400/25",
  "sleep-recovery": "from-[#818cf8]/25 to-[#0b0f1a] border-indigo-400/25",
  "environmental-health": "from-[#7dd3fc]/25 to-[#0b0f1a] border-sky-400/25",
  "family-health": "from-[#93c5fd]/25 to-[#0b0f1a] border-blue-300/25",
  "preventive-medicine": "from-[#22d3ee]/25 to-[#0b0f1a] border-cyan-300/25",
  "biohacking-performance": "from-[#fb7185]/25 to-[#0b0f1a] border-rose-300/25",
  "senior-care": "from-[#fbbf24]/25 to-[#0b0f1a] border-amber-300/25",
  "eye-health-suite": "from-[#86efac]/25 to-[#0b0f1a] border-lime-300/25",
  "general-sexual-longevity":
    "from-[#fb7185]/25 to-[#0b0f1a] border-rose-300/25",
  "mens-sexual-health": "from-[#60a5fa]/25 to-[#0b0f1a] border-blue-300/25",
  "womens-sexual-health": "from-[#f472b6]/25 to-[#0b0f1a] border-pink-300/25",
  "digital-therapeutics":
    "from-[#a7f3d0]/25 to-[#0b0f1a] border-emerald-300/25",
};

/* ---------- UI bits ---------- */
function SectionTitle({
  kicker,
  title,
  subtitle,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="mx-auto max-w-5xl text-center pb-6">
      {kicker && (
        <p className="text-sm tracking-widest uppercase text-white/50">
          {kicker}
        </p>
      )}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 text-brand-gradient">
        {title}
      </h1>
      {subtitle && (
        <p className="text-base sm:text-lg text-white/70 max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </header>
  );
}

function CategoryCard({ c }: { c: CategoryUi }) {
  const Icon = c.Icon;
  return (
    <Link
      href={`/services#${c.slug}`}
      className={
        "group relative flex items-start gap-4 rounded-2xl border p-5 sm:p-6 " +
        "bg-gradient-to-br " +
        c.tint +
        " hover:border-white/20 transition outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
      }
    >
      <div
        className={
          "mt-0.5 grid place-items-center rounded-xl h-10 w-10 flex-shrink-0 " +
          "bg-white/8 text-white"
        }
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <h3 className="text-white font-semibold text-lg leading-tight mb-1">
          {c.name}
        </h3>
        <p className="text-white/70 text-sm leading-relaxed">{c.blurb}</p>
      </div>
      <span className="pointer-events-none absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-white/10" />
    </Link>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-5 text-center"
      role="listitem"
    >
      <div className="text-4xl sm:text-5xl font-extrabold text-white">
        {value}
      </div>
      <div className="mt-2 text-white/70">{label}</div>
    </div>
  );
}

const ADVANTAGES = [
  {
    title: "Personalization",
    body: "Your biology is the brief. We tailor guidance, reports, and plans to how you actually live.",
    tint: "from-cyan-400/15 to-transparent border-cyan-400/20",
    emoji: "✨",
  },
  {
    title: "Precision & Prediction",
    body: "Beyond averages. We use applied math and AI to detect patterns and suggest the next best move.",
    tint: "from-emerald-400/15 to-transparent border-emerald-400/20",
    emoji: "📈",
  },
  {
    title: "Data Security",
    body: "End-to-end encryption and modern zero-trust design. HIPAA & SOC 2 aligned.",
    tint: "from-violet-400/15 to-transparent border-violet-400/20",
    emoji: "🔒",
  },
  {
    title: "Unified Integration",
    body: "Wearables, labs, genetics, and lifestyle—one clear picture to act on, not twenty apps.",
    tint: "from-sky-400/15 to-transparent border-sky-400/20",
    emoji: "🧩",
  },
  {
    title: "Proactive Care",
    body: "Early signals and practical nudges, so you can fix small problems before they grow.",
    tint: "from-pink-400/15 to-transparent border-pink-400/20",
    emoji: "⏱️",
  },
  {
    title: "Continuous Innovation",
    body: "We keep pace with the best in biology, AI, and medicine—so you don’t have to.",
    tint: "from-amber-400/15 to-transparent border-amber-400/20",
    emoji: "💡",
  },
];

/* ---------- Data loader (API-based) ---------- */
async function fetchCategories(): Promise<CategoryUi[]> {
  // Note: using a relative URL works in Next.js App Router on the server
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/categories`,
    {
      // Revalidate every 5 minutes; adjust as needed
      next: { revalidate: 300 },
      // You can also pass { cache: "no-store" } to always fetch fresh data
    },
  ).catch((e) => {
    console.error("Fetch /api/categories failed:", e);
    throw e;
  });

  if (!res.ok) {
    console.error("Fetch /api/categories status:", res.status);
    throw new Error("Failed to fetch categories");
  }

  const data: { ok: boolean; categories?: CategoryApi[] } = await res.json();
  if (!data.ok || !data.categories) {
    throw new Error("Invalid categories payload");
  }

  // Map API rows into UI-ready structs
  return data.categories.map((r) => {
    const Icon = (r.iconKey && ICONS[r.iconKey]) || Stars;
    const tint =
      TINTS[r.slug] || "from-white/10 to-transparent border-white/10";
    return {
      slug: r.slug,
      name: r.name,
      blurb: r.blurb ?? "",
      Icon,
      tint,
    };
  });
}

/* ---------- Page (Server Component) ---------- */
export default async function HomePage() {
  // For server environments without NEXT_PUBLIC_BASE_URL, fall back to relative fetch
  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    // Relative fetch variant
    const res = await fetch("/api/categories", { next: { revalidate: 300 } });
    if (!res.ok) throw new Error("Failed to fetch categories");
    const data: { ok: boolean; categories?: CategoryApi[] } = await res.json();
    const categories = (data.categories ?? []).map((r) => {
      const Icon = (r.iconKey && ICONS[r.iconKey]) || Stars;
      const tint =
        TINTS[r.slug] || "from-white/10 to-transparent border-white/10";
      return {
        slug: r.slug,
        name: r.name,
        blurb: r.blurb ?? "",
        Icon,
        tint,
      };
    });

    return <HomePageView categories={categories} />;
  }

  const categories = await fetchCategories();
  return <HomePageView categories={categories} />;
}

/* ---------- View extracted so we can reuse rendering ---------- */
function HomePageView({ categories }: { categories: CategoryUi[] }) {
  return (
    <div className="relative">
      {/* dotted bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:18px_18px]"
      />

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-14">
        <SectionTitle
          title="Welcome to BioMath Core"
          subtitle="Real guidance. Real results. Modern health tools that fit your day and help you feel great longer."
        />
      </section>

      {/* Categories */}
      <section className="relative mx-auto max-w-6xl px-4 sm:px-6 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {categories.map((c) => (
            <CategoryCard key={c.slug} c={c} />
          ))}
        </div>
      </section>

      {/* Advantages */}
      <section className="relative mx-auto max-w-6xl px-4 sm:px-6 mt-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-white">
          Our Advantages
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {ADVANTAGES.map((a) => (
            <div
              key={a.title}
              className={
                "rounded-2xl border bg-gradient-to-br p-5 sm:p-6 " + a.tint
              }
            >
              <div className="text-3xl mb-3">{a.emoji}</div>
              <h3 className="text-white font-semibold text-lg mb-1 leading-tight">
                {a.title}
              </h3>
              <p className="text-white/75 text-sm leading-relaxed">{a.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="relative mx-auto max-w-6xl px-4 sm:px-6 mt-12">
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
          role="list"
        >
          <Stat value="180+" label="AI-Powered Services" />
          <Stat value="3M+" label="Health Insights Generated" />
          <Stat value="98%" label="Accuracy Rate" />
          <Stat value="24/7" label="AI Health Assistant" />
        </div>
      </section>

      {/* CTA row */}
      <section className="relative mx-auto max-w-6xl px-4 sm:px-6 mt-12 mb-16">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-cyan-300 hover:bg-cyan-200 text-black font-semibold shadow-elev-1 transition"
          >
            Explore Services
          </Link>
          <AskAiButton />
        </div>
      </section>
    </div>
  );
}
