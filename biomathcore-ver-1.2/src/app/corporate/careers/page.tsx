// src/app/corporate/careers/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers • BioMath Core",
  description:
    "Join BioMath Core and help build the future of personalized health.",
};

const openings = [
  {
    title: "Frontend Engineer (Next.js + Tailwind)",
    location: "Remote",
    type: "Full‑time",
  },
  { title: "ML Engineer (Healthcare)", location: "Remote", type: "Full‑time" },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight">Careers</h1>
        <p className="mt-2 text-gray-600">
          Build life‑changing health products with a small, focused team.
        </p>

        <div className="mt-8 grid gap-4">
          {openings.map((o, i) => (
            <div key={i} className="rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold">{o.title}</h2>
              <p className="mt-1 text-sm text-gray-600">
                {o.location} • {o.type}
              </p>
              <a
                href="mailto:careers@biomathcore.com?subject=Application"
                className="mt-4 inline-block text-indigo-600"
              >
                Apply →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
