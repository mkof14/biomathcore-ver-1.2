export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

// src/app/services/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { slugify } from "@/lib/slug";

// ⚠️ Use your actual data location:
import { allCategories, findServiceBySlug } from "@/app/data/servicesData";

// Client subpanel for #run
import RunPanel from "@/components/RunPanel";

type Params = { slug: string };
type PageProps = { params: Promise<Params> };

// Metadata also must await params in Next 15+
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const hit = findServiceBySlug(slug);
  if (!hit) return { title: "Service not found • BioMath Core" };

  return {
    title: `${hit.service.title} • BioMath Core`,
    description:
      hit.service.description ||
      `Learn more about ${hit.service.title} on BioMath Core.`,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Find service (using your helper from servicesData)
  const hit = findServiceBySlug(slug);
  if (!hit) return notFound();

  const { category, service } = hit;

  // fallback emoji/icon
  const emoji = (service.icon as string) || (service.emoji as string) || "🧩";

  // link back to category anchor on /services
  const categorySlug = slugify(category.name || category.title || "category");
  const backHref = `/services#${categorySlug}`;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-10">
        {/* Breadcrumbs */}
        <nav className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          <Link href="/services" className="hover:underline">
            Services
          </Link>{" "}
          /{" "}
          <Link href={backHref} className="hover:underline">
            {category.name || category.title}
          </Link>{" "}
          /{" "}
          <span className="text-gray-900 dark:text-gray-100">
            {service.title}
          </span>
        </nav>

        {/* Header block */}
        <header className="rounded-2xl border border-white/10 bg-gradient-to-br from-[rgba(255,255,255,0.04)] to-[rgba(0,0,0,0.25)] p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_10px_30px_-12px_rgba(0,0,0,0.5)]">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10 text-2xl select-none">
              {emoji}
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-extrabold tracking-tight">
                {service.title}
              </h1>
              {service.description ? (
                <p className="mt-1 text-sm text-white/80">
                  {service.description}
                </p>
              ) : null}
            </div>
          </div>

          {/* CTA row */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Link
              href="#run"
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600/90 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset,0_6px_20px_-6px_rgba(139,92,246,0.45)]"
            >
              Run analysis
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              ← Back to Services
            </Link>
          </div>
        </header>

        {/* Content 2-col */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Main content */}
          <div className="md:col-span-8 space-y-6">
            {/* Overview */}
            <section className="rounded-2xl border border-white/10 bg-white/60 p-5 dark:bg-black/30">
              <h2 className="mb-2 text-lg font-semibold">Overview</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                This page summarizes the {service.title} module within the{" "}
                <span className="font-medium">
                  {category.name || category.title}
                </span>{" "}
                category. Use the <b>Run analysis</b> button to try an offline
                demo with your own input data. Later we can connect real AI
                endpoints and device data.
              </p>
            </section>

            {/* Run panel (client) */}
            <RunPanel
              serviceId={service.id || service.slug || slug}
              serviceTitle={service.title}
            />

            {/* Simple “How it works” */}
            <section className="rounded-2xl border border-white/10 bg-white/60 p-5 dark:bg-black/30">
              <h3 className="mb-2 text-base font-semibold">How it works</h3>
              <ol className="ml-4 list-decimal space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>Type your question or paste recent metrics.</li>
                <li>Select engine (AI•1 or AI•2).</li>
                <li>
                  Click <b>Generate</b> to get a structured demo reply.
                </li>
              </ol>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="md:col-span-4 space-y-6">
            {/* Mini info card */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[rgba(255,255,255,0.04)] to-[rgba(0,0,0,0.25)] p-5">
              <h4 className="text-sm font-semibold text-white/90">Module</h4>
              <div className="mt-2 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{emoji}</span>
                  <span>{service.title}</span>
                </div>
                {service.plan && (
                  <div className="mt-2 inline-block rounded-md bg-white/10 px-2 py-1 text-xs">
                    Plan: {String(service.plan)}
                  </div>
                )}
              </div>
            </div>

            {/* Optional image (chip/logo) */}
            <div className="rounded-2xl border border-white/10 bg-white/60 p-5 text-center dark:bg-black/30">
              <Image
                src="/images/bm-core-chip.png"
                alt="BioMath Core AI chip mark"
                width={420}
                height={240}
                className="mx-auto h-auto w-full max-w-[300px] rounded-md opacity-90"
                priority={false}
              />
              <div className="mt-3 text-xs text-gray-700 dark:text-gray-300">
                BioMath Core • AI Engine
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
