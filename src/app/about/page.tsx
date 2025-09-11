export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

import Image from "next/image";
import Link from "next/link";
import { slugify } from "@/lib/slug";

export default function AboutPage() {
  const categories: { name: string; color: string }[] = [
    { name: "Critical Health", color: "from-[#4a0e12] to-[#2a0b0d]" },
    { name: "Everyday Wellness", color: "from-[#0f3520] to-[#0b1f16]" },
    { name: "Longevity & Anti-Aging & Anti-Aging", color: "from-[#0d2f2b] to-[#0a1c1a]" },
    { name: "Mental Wellness", color: "from-[#1a1f4f] to-[#0e1030]" },
    { name: "Fitness & Performance", color: "from-[#0b2452] to-[#0a1531]" },
    { name: "Women's Health", color: "from-[#4d0f2a] to-[#2c0b19]" },
    { name: "Men's Health", color: "from-[#0a2a36] to-[#081a22]" },
    { name: "Beauty & Skincare & Skincare", color: "from-[#4a0e1e] to-[#2a0b13]" },
    { name: "Nutrition & Diet & Diet", color: "from-[#263a0d] to-[#151f0a]" },
    { name: "Sleep & Recovery & Recovery", color: "from-[#2d184a] to-[#170e2a]" },
    { name: "Environmental Health Health", color: "from-[#103426] to-[#0c1f18]" },
    { name: "Family Health", color: "from-[#0c3138] to-[#081d22]" },
    {
      name: "Preventive Medicine & Longevity",
      color: "from-[#4a2a0e] to-[#2a180b]",
    },
    { name: "Biohacking & Performance", color: "from-[#3f2b05] to-[#231903]" },
    { name: "Senior Care", color: "from-[#2c2a28] to-[#191817]" },
    { name: "Eye-Health Suite", color: "from-[#0d2c3f] to-[#081b27]" },
    { name: "General Sexual Longevity & Anti-Aging", color: "from-[#3a0d3f] to-[#220825]" },
    { name: "Men's General Sexual Longevity & Anti-Aging", color: "from-[#171c4a] to-[#0e1130]" },
    { name: "Women's General Sexual Longevity & Anti-Aging", color: "from-[#4a1030] to-[#2a0c1d]" },
    {
      name: "Digital Therapeutics Store",
      color: "from-[#13381f] to-[#0c2316]",
    },
  ];

  return (
    <main className="px-6 sm:px-8 lg:px-12 py-10 bg-[#0b0f14] text-zinc-100">
      <h1 className="text-center text-4xl sm:text-5xl font-extrabold tracking-tight">
        <span className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
          About BioMath Core
        </span>
      </h1>

      <div className="max-w-4xl mx-auto mt-6 space-y-4 text-[1.05rem] leading-7 text-zinc-300">
        <p>
          We build trustworthy, practical wellness intelligence at the
          intersection of <strong>biomathematics</strong>,{" "}
          <strong>computational biology</strong>, and <strong>AI</strong>.
          BioMath Core helps people and professionals navigate complex health
          questions with precise, explainable guidance — focused on{" "}
          <em>оздоровление</em>, prevention, and long-term resilience.
        </p>
        <p>
          Today our platform spans <strong>20 categories</strong> with{" "}
          <strong>180+ services</strong> (and growing). We expand only when the
          signal is strong — based on real user needs and evidence.
        </p>
      </div>

      <div className="flex justify-center mt-8 mb-10">
        <Image
          src="/images/bm-core-chip.png"
          alt="BioMath Core AI — chip visual"
          width={560}
          height={360}
          className="rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.25)] ring-1 ring-white/10"
          priority
        />
      </div>

      <section className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
        <article className="rounded-2xl bg-[#0f141b] ring-1 ring-white/10 p-6 sm:p-7">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">
            The BioMath Core AI Engine
          </h2>
          <p className="text-zinc-300 mb-4">
            Our engine is a layered system that unifies biological priors,
            time-series, and context into a single, inspectable pipeline:
          </p>
          <ul className="list-disc pl-5 space-y-3 text-zinc-300">
            <li>
              <strong>Model-first design:</strong> biomathematical structures
              guide learning — reducing overfitting and improving stability.
            </li>
            <li>
              <strong>Multi-modal fusion:</strong> lab results, lifestyle
              inputs, wearable data, and clinical knowledge are aligned into
              explainable insights.
            </li>
            <li>
              <strong>Quality gates:</strong> validation, uncertainty flags, and
              human-in-the-loop review for sensitive areas.
            </li>
            <li>
              <strong>Outcome orientation:</strong> recommendations aim at{" "}
              <em>оздоровление</em>, prevention, and performance — not
              treatment.
            </li>
          </ul>
        </article>

        <article className="rounded-2xl bg-[#0f141b] ring-1 ring-white/10 p-6 sm:p-7">
          <h2 className="text-xl sm:text-2xl font-bold mb-3">Our Founder</h2>
          <p className="text-zinc-300">
            <strong>Michael Kofman</strong> — entrepreneur with over 15 years in
            AI, digital health, and computational biology. Through{" "}
            <Link
              href="https://digitalinvest.com/"
              target="_blank"
              className="text-sky-300 hover:underline"
            >
              Digital Invest Inc.
            </Link>{" "}
            and{" "}
            <Link
              href="https://www.biomathlife.com/"
              target="_blank"
              className="text-sky-300 hover:underline"
            >
              BioMath Life
            </Link>
            , he turns rigorous science into usable systems that scale.
          </p>

          <div className="mt-5 flex items-start gap-4">
            <Image
              src="/images/award-hto-2023.png"
              alt="Healthcare Tech Outlook Award"
              width={84}
              height={110}
              className="rounded-md ring-1 ring-white/10"
            />
            <p className="text-zinc-300">
              Recognized by{" "}
              <Link
                href="https://www.healthcaretechoutlook.com/digital-invest-inc"
                target="_blank"
                className="text-sky-300 hover:underline"
              >
                Healthcare Tech Outlook
              </Link>{" "}
              for innovation in precision wellness. Interview in the magazine
              tells how Digital Invest’s research shaped BioMath Core.
            </p>
          </div>
        </article>
      </section>

      <section className="max-w-6xl mx-auto mt-12">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-2xl font-bold">Scope & Service Library</h2>
          <span className="text-xs sm:text-sm text-zinc-400">
            20 categories • 180+ services (and growing)
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((c) => {
            const slug = slugify(c.name);
            return (
              <Link
                key={c.name}
                href={`/services?cat=${encodeURIComponent(slug)}#${encodeURIComponent(slug)}`}
                className={`rounded-xl p-4 bg-gradient-to-br ${c.color} ring-1 ring-white/10 hover:ring-violet-400/40 transition`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[1.05rem]">{c.name}</h3>
                  <span className="text-zinc-200/70 text-lg">→</span>
                </div>
                <p className="mt-1 text-sm text-zinc-200/80">
                  Explore curated tools and guidance for {c.name}.
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
