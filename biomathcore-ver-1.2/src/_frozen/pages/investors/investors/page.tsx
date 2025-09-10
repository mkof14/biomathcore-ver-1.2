// src/app/investors/page.tsx
import Link from "next/link";
import type { Metadata } from "next";

// SEO
export const metadata: Metadata = {
  title: "Investors • BioMath Core",
  description:
    "BioMath Core — scalable precision-health platform. Clear business model, defensible tech, and disciplined roadmap for value creation.",
};

export default function InvestorsPage() {
  return (
    <div className="bg-white text-neutral-900">
      {}
      <section className="pt-28 pb-10 border-b border-neutral-200">
        <div className="container mx-auto max-w-6xl px-4">
          <p className="text-xs tracking-widest font-semibold text-blue-700/80">
            FOR INVESTORS
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold leading-tight text-neutral-900">
            Invest in a practical path to personalized health
          </h1>
          <p className="mt-4 text-lg md:text-xl text-neutral-700 max-w-3xl">
            BioMath Core is a precision-health platform that turns data into
            timely, human-readable guidance. We focus on prevention, everyday
            decisions, and long-horizon well-being — with rigor, privacy, and
            scalability at the center.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/about"
              className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 transition"
            >
              Learn about BioMath Core
            </Link>
            <Link
              href="/services"
              className="rounded-lg border border-neutral-300 px-4 py-2 text-neutral-800 hover:bg-neutral-50 transition"
            >
              Explore services
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-blue-200 text-blue-700 px-4 py-2 hover:bg-blue-50 transition"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      {}
      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-4 grid md:grid-cols-3 gap-6">
          <Card title="Clear need">
            Consumers and clinicians face noise, not signal. We distill
            multi-source inputs into actionable steps that people actually use.
          </Card>
          <Card title="Defensible tech">
            We combine biomathematical modeling with modern AI to build
            interpretable, privacy-first insights — not black-box promises.
          </Card>
          <Card title="Scalable design">
            The platform is modular: 20+ categories and 180+ services today,
            with a roadmap to expand as user needs evolve.
          </Card>
        </div>
      </section>

      {}
      <section className="py-12 border-t border-neutral-200">
        <div className="container mx-auto max-w-6xl px-4 grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
              The BioMath Core Engine
            </h2>
            <p className="mt-3 text-neutral-700">
              At the heart of BioMath Core is a modeling layer that transforms
              raw inputs into personalized, time-aware suggestions. It blends
              evidence-based rules, transparent heuristics, and AI assistance
              for ranking options and estimating benefit versus effort.
            </p>
            <ul className="mt-4 space-y-2 text-neutral-800">
              <li>• Multi-input: questionnaires, wearables, labs, context.</li>
              <li>• Explainable outputs: what matters now, and why.</li>
              <li>
                • Privacy by design: minimal data, user control, encryption.
              </li>
              <li>
                • Continuous updates: learn from engagement, not profiles.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-neutral-900">
              Why now (and why us)
            </h3>
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <Badge title="Execution first">
                We ship focused, useful features instead of hype.
              </Badge>
              <Badge title="Lower friction">
                Clear UX, fast answers, and practical recommendations.
              </Badge>
              <Badge title="Unit economics">
                A path to healthy margins through modular plans and add-ons.
              </Badge>
              <Badge title="Partnership-ready">
                Designed for integrations with clinics and wellness providers.
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
            Business model
          </h2>
          <div className="mt-5 grid md:grid-cols-3 gap-6">
            <SimpleTile
              title="Consumer plans"
              lines={[
                "Free tier with core tools",
                "Premium bundles by category",
                "Optional add-on analyses",
              ]}
            />
            <SimpleTile
              title="B2B services"
              lines={[
                "Licensing of modules",
                "Co-branded programs",
                "Privacy-first integrations",
              ]}
            />
            <SimpleTile
              title="Data services (opt-in)"
              lines={[
                "Aggregated, de-identified learnings",
                "Model improvement loops",
                "Strict user consent rules",
              ]}
            />
          </div>
        </div>
      </section>

      {}
      <section className="py-12 border-t border-neutral-200">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
            Trust, privacy, and clarity
          </h2>
          <p className="mt-3 text-neutral-700 max-w-3xl">
            Health guidance must respect people. We minimize data collection,
            keep explanations readable, and separate suggestions from diagnosis.
            Legal pages are public and plain-language. We grow through
            transparency, not promises of “miracles.”
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/legal/privacy"
              className="text-blue-700 hover:underline"
            >
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="text-blue-700 hover:underline">
              Terms of Use
            </Link>
            <Link
              href="/legal/disclaimer"
              className="text-blue-700 hover:underline"
            >
              Disclaimer
            </Link>
          </div>
        </div>
      </section>

      {}
      <section className="py-14">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900">
            Building a long-term, human-centered health platform
          </h2>
          <p className="mt-3 text-neutral-700 max-w-2xl mx-auto">
            If you share our focus on practical outcomes, measured delivery, and
            responsible growth, we’d like to talk.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 transition"
            >
              Contact the team
            </Link>
            <Link
              href="/about"
              className="rounded-lg border border-neutral-300 px-5 py-2.5 text-neutral-800 hover:bg-neutral-50 transition"
            >
              Read more about us
            </Link>
            <Link
              href="/services"
              className="rounded-lg border border-blue-200 text-blue-700 px-5 py-2.5 hover:bg-blue-50 transition"
            >
              Browse services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- small presentational helpers ---------- */

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-slate-50/60 p-5">
      <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
      <p className="mt-2 text-neutral-700">{children}</p>
    </div>
  );
}

function Badge({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
      <div className="text-sm font-semibold text-blue-800">{title}</div>
      <div className="mt-1 text-sm text-blue-900/80">{children}</div>
    </div>
  );
}

function SimpleTile({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
      <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
      <ul className="mt-3 space-y-1 text-neutral-700">
        {lines.map((l) => (
          <li key={l}>• {l}</li>
        ))}
      </ul>
    </div>
  );
}
