"use client";
import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import Link from "next/link";
import allCategories from "@/components/data/allCategories";

/** ────────────────────────────────────────────────────────────────────────────
 * Small utils
 * ─────────────────────────────────────────────────────────────────────────── */
function slugify(input: string) {
  return (input || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

type Category = {
  name: string;
  icon?: string;
  color?: string;
  description?: string;
  services: { title: string; description?: string; icon?: string }[];
};
type WithMeta = Category & { slug: string; count: number };

type RecentItem = {
  catName: string;
  catSlug: string;
  catColor?: string;
  title: string;
  icon?: string;
  href: string;
};

const RECENT_KEY = "bmc_recent_services_v1";

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
function textTone(color?: string) {
  switch (color) {
    case "indigo":
      return "text-indigo-200 dark:text-indigo-100";
    case "red":
      return "text-red-200 dark:text-red-100";
    case "green":
      return "text-green-200 dark:text-green-100";
    case "yellow":
      return "text-yellow-200 dark:text-yellow-100";
    case "blue":
      return "text-blue-200 dark:text-blue-100";
    case "pink":
      return "text-pink-200 dark:text-pink-100";
    case "teal":
      return "text-teal-200 dark:text-teal-100";
    case "rose":
      return "text-rose-200 dark:text-rose-100";
    case "orange":
      return "text-orange-200 dark:text-orange-100";
    case "cyan":
      return "text-cyan-200 dark:text-cyan-100";
    case "lime":
      return "text-lime-200 dark:text-lime-100";
    case "amber":
      return "text-amber-200 dark:text-amber-100";
    case "violet":
      return "text-violet-200 dark:text-violet-100";
    case "fuchsia":
      return "text-fuchsia-200 dark:text-fuchsia-100";
    case "gray":
      return "text-gray-200 dark:text-gray-100";
    case "sky":
      return "text-sky-200 dark:text-sky-100";
    case "emerald":
      return "text-emerald-200 dark:text-emerald-100";
    default:
      return "text-gray-200 dark:text-gray-100";
  }
}

/** ────────────────────────────────────────────────────────────────────────────
 * Inline Service Modal (AI actions)
 * ─────────────────────────────────────────────────────────────────────────── */
function ServiceModalInline({
  service,
  isOpen,
  onClose,
}: {
  service: any;
  isOpen: boolean;
  onClose: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [aiChannel, setAiChannel] = useState<"ai1" | "ai2">("ai1");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      const t = setTimeout(() => textareaRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!isOpen || !service) return null;

  const generate = async () => {
    setBusy(true);
    try {
     
      const demo = `AI (${aiChannel.toUpperCase()}) • Generated analysis for "${service.title}"\n\nUser input: ${input || "— no text provided —"}\n\nInsight: trends detected, next steps suggested.`;
      await new Promise((r) => setTimeout(r, 600));
      setResult(demo);
    } finally {
      setBusy(false);
    }
  };

  const copy = () =>
    (result || input) && navigator.clipboard.writeText(result || input);
  const print = () => window.print();
  const email = () =>
    window.location.assign(
      `mailto:?subject=${encodeURIComponent(`Report: ${service.title}`)}&body=${encodeURIComponent(
        result || input || "",
      )}`,
    );
  const downloadPDF = () => alert("PDF export (placeholder)");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50">
      <div className="relative w-full max-w-3xl mx-4 rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 rounded-md px-2.5 py-1.5 text-sm bg-zinc-800/70 hover:bg-zinc-800 text-white"
          aria-label="Close"
        >
          ×
        </button>

        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{service.icon ?? "🧩"}</span>
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {service.title}
          </h3>
        </div>
        {service.description && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            {service.description}
          </p>
        )}

        {/* AI channel + Generate */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs ${
                aiChannel === "ai1"
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-800/70 text-white hover:bg-zinc-800"
              }`}
              onClick={() => setAiChannel("ai1")}
            >
              {}
              <span>🤖</span> <span>AI‑1</span>
            </button>
            <button
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs ${
                aiChannel === "ai2"
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-800/70 text-white hover:bg-zinc-800"
              }`}
              onClick={() => setAiChannel("ai2")}
            >
              <span>🧠</span> <span>AI‑2</span>
            </button>
          </div>

          <button
            onClick={generate}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm"
          >
            {busy ? "Generating…" : "Generate"}
          </button>
        </div>

        {/* Input */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add context or a question…"
          className="w-full h-24 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-zinc-800 text-sm text-gray-800 dark:text-gray-200 resize-none mb-4"
        />

        {/* Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <ActionBtn onClick={copy} icon="📋" label="Copy" />
          <ActionBtn onClick={print} icon="🖨️" label="Print" />
          <ActionBtn onClick={email} icon="✉️" label="Email" />
          <ActionBtn onClick={downloadPDF} icon="📄" label="PDF" />
        </div>

        {/* Result */}
        {!!result && (
          <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3 text-sm text-zinc-800 dark:text-zinc-100">
            <div className="font-semibold mb-1">AI Analysis</div>
            <pre className="whitespace-pre-wrap leading-relaxed">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionBtn({
  onClick,
  icon,
  label,
}: {
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-lg bg-zinc-900 text-white px-3 py-2 text-xs hover:bg-zinc-800"
    >
      <span className="text-base leading-none">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

/** ────────────────────────────────────────────────────────────────────────────
 * Inline Service Card (click opens modal OR link opens page)
 * ─────────────────────────────────────────────────────────────────────────── */
function ServiceCardInline({
  categoryColor,
  service,
  onOpen,
}: {
  categoryColor?: string;
  service: any;
  onOpen: (svc: any) => void;
}) {
  const href = `/services/${slugify(service.title)}`;
  const desc =
    service.description ??
    `Explore ${service.title} — part of our precision‑health toolkit.`;

  return (
    <div
      className={`group relative block bg-gradient-to-br ${bgGrad(
        categoryColor,
      )} p-4 rounded-xl shadow hover:shadow-lg transition`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`text-2xl ${textTone(categoryColor)}`}>
          {service.icon ?? "🧩"}
        </div>
        <h3 className={`text-md font-semibold ${textTone(categoryColor)}`}>
          {service.title}
        </h3>
      </div>

      <p className="text-xs text-white/85 min-h-[38px]">{desc}</p>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => onOpen(service)}
          className="inline-flex items-center gap-1 rounded-md bg-white/90 hover:bg-white text-zinc-900 px-3 py-1.5 text-xs"
        >
          Details
        </button>

        <Link
          href={href}
          className="inline-flex items-center gap-1 rounded-md bg-black/70 hover:bg-black text-white px-3 py-1.5 text-xs"
        >
          Open page →
        </Link>
      </div>
    </div>
  );
}

/** ────────────────────────────────────────────────────────────────────────────
 * Page (monolith)
 * ─────────────────────────────────────────────────────────────────────────── */
export default function ServicesPageMonolith() {
  // URL state
  const [query, setQuery] = useState("");
  const [selectedCatSlug, setSelectedCatSlug] = useState<"all" | string>("all");

  // parse URL once
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") ?? "";
    const cat = params.get("cat") ?? "all";
    setQuery(q);
    setSelectedCatSlug(cat as any);
  }, []);

  // write URL on change
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (query) url.searchParams.set("q", query);
    else url.searchParams.delete("q");
    if (selectedCatSlug && selectedCatSlug !== "all")
      url.searchParams.set("cat", selectedCatSlug);
    else url.searchParams.delete("cat");
    window.history.replaceState({}, "", url.toString());
  }, [query, selectedCatSlug]);

  // categories meta
  const categoriesWithMeta: WithMeta[] = useMemo(() => {
    return (allCategories as Category[]).map((c) => ({
      ...c,
      slug: slugify(c.name),
      count: Array.isArray(c.services) ? c.services.length : 0,
    }));
  }, []);

  // filtering
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categoriesWithMeta
      .map((cat) => {
        if (!Array.isArray(cat.services))
          return { ...cat, services: [] as any[] };
        const services = cat.services.filter((s) => {
          const title = (s.title ?? "").toLowerCase();
          const desc = (s.description ?? "").toLowerCase();
          const matchQ = !q || title.includes(q) || desc.includes(q);
          const matchCat =
            selectedCatSlug === "all" || cat.slug === selectedCatSlug;
          return matchQ && matchCat;
        });
        return { ...cat, services };
      })
      .filter((cat) => cat.services.length > 0);
  }, [categoriesWithMeta, query, selectedCatSlug]);

  const totalFound = useMemo(
    () => filtered.reduce((sum, c) => sum + c.services.length, 0),
    [filtered],
  );

  // sidebar anchor
  const [activeAnchor, setActiveAnchor] = useState<string>("top");
  useEffect(() => {
    const handler = () => {
      let current = "top";
      for (const cat of categoriesWithMeta) {
        const el = document.getElementById(cat.slug);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120) current = cat.slug;
      }
      setActiveAnchor(current);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [categoriesWithMeta]);

  // recent
  const [recent, setRecent] = useState<RecentItem[]>([]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, []);
  const pushRecent = useCallback((item: RecentItem) => {
    setRecent((prev) => {
      const exists = prev.find((r) => r.href === item.href);
      const next = [
        item,
        ...(exists ? prev.filter((r) => r.href !== item.href) : prev),
      ];
      const limited = next.slice(0, 8);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(RECENT_KEY, JSON.stringify(limited));
        } catch {}
      }
      return limited;
    });
  }, []);

  // modal state
  const [selectedService, setSelectedService] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = (service: any) => {
    setSelectedService(service);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedService(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="container mx-auto px-4 pt-10 pb-6">
        <h1
          id="top"
          className="text-5xl font-extrabold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 drop-shadow-lg"
        >
          Service Categories
        </h1>
        <p className="text-lg text-center mb-6 text-gray-600 dark:text-gray-400">
          Explore a wide range of health services tailored to your needs.
        </p>
      </div>

      <div className="container mx-auto px-4 pb-16 grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block col-span-3">
          <div className="sticky top-24 bg-white/70 dark:bg-black/40 backdrop-blur-md border border-gray-200/50 dark:border-white/10 rounded-xl p-4">
            <div className="text-sm font-semibold mb-3 opacity-80">
              Categories
            </div>
            <nav className="space-y-1">
              <a
                href="#top"
                className={`block rounded-md px-3 py-2 text-sm transition ${
                  activeAnchor === "top"
                    ? "bg-purple-600 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-white/10"
                }`}
              >
                All
              </a>
              {categoriesWithMeta.map((cat) => (
                <a
                  key={cat.slug}
                  href={`#${cat.slug}`}
                  className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition ${
                    activeAnchor === cat.slug
                      ? "bg-purple-600 text-white"
                      : "hover:bg-gray-100 dark:hover:bg-white/10"
                  }`}
                >
                  <span className="truncate">
                    <span className="mr-2">{cat.icon ?? "🧩"}</span>
                    {cat.name}
                  </span>
                  <span className="text-xs opacity-70">{cat.count}</span>
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="col-span-12 lg:col-span-9">
          {/* Filters */}
          <div className="mb-6 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-white/10 p-4">
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wide mb-2 opacity-60">
                  Quick search
                </label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type service name or description…"
                  className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide mb-2 opacity-60">
                  Category
                </label>
                <select
                  value={selectedCatSlug}
                  onChange={(e) => setSelectedCatSlug(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All</option>
                  {categoriesWithMeta.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-3 text-sm">
              <span className="opacity-70">
                Found: <b>{totalFound}</b> services
              </span>
              {(query || selectedCatSlug !== "all") && (
                <button
                  onClick={() => {
                    setQuery("");
                    setSelectedCatSlug("all");
                  }}
                  className="text-purple-600 hover:underline"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>

          {/* Recently viewed */}
          {recent.length > 0 && (
            <div className="mb-8 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-white/10 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold opacity-80">
                  Recently viewed
                </div>
                <button
                  className="text-xs text-purple-600 hover:underline"
                  onClick={() => {
                    setRecent([]);
                    if (typeof window !== "undefined") {
                      try {
                        localStorage.removeItem(RECENT_KEY);
                      } catch {}
                    }
                  }}
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recent.map((r) => (
                  <Link
                    key={r.href}
                    href={r.href}
                    prefetch
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-br ${bgGrad(
                      r.catColor,
                    )} text-white text-xs`}
                  >
                    <span>{r.icon ?? "🧩"}</span>
                    <span className="truncate max-w-[220px]">{r.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Cards */}
          <section className="space-y-12">
            {filtered.length === 0 && (
              <div className="text-center py-16 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-white/10">
                <div className="text-2xl mb-2">Nothing found</div>
                <div className="opacity-70">
                  Try a different query or reset filters.
                </div>
              </div>
            )}

            {filtered.map((cat) => (
              <div key={cat.slug} id={cat.slug}>
                <div className="text-center">
                  <h2
                    className={`text-3xl font-bold mb-2 ${textTone(cat.color)}`}
                  >
                    {cat.icon ?? "🧩"} {cat.name} Services
                  </h2>
                  {cat.description && (
                    <p className="text-gray-700 dark:text-gray-300 text-sm max-w-2xl mx-auto">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
                  {cat.services.map((service, idx) => {
                    const href = `/services/${slugify(service.title)}`;
                    const icon = service.icon ?? "🧩";
                    const desc =
                      service.description ??
                      `Explore ${service.title} — part of the ${cat.name} suite.`;
                    return (
                      <div key={`${cat.slug}-${idx}`}>
                        <ServiceCardInline
                          categoryColor={cat.color}
                          service={service}
                          onOpen={(svc) => {
                            // track recent
                            const item: RecentItem = {
                              catName: cat.name,
                              catSlug: cat.slug,
                              catColor: cat.color,
                              title: svc.title,
                              icon: svc.icon,
                              href: href,
                            };
                            setTimeout(() => {
                             
                              const exists = recent.find(
                                (r) => r.href === item.href,
                              );
                              const next = [
                                item,
                                ...(exists
                                  ? recent.filter((r) => r.href !== item.href)
                                  : recent),
                              ];
                              const limited = next.slice(0, 8);
                              setRecent(limited);
                              try {
                                localStorage.setItem(
                                  RECENT_KEY,
                                  JSON.stringify(limited),
                                );
                              } catch {}
                            }, 0);
                            setSelectedService(svc);
                            setModalOpen(true);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>

          {/* Back to top */}
          <div className="mt-12 flex justify-end">
            <a
              href="#top"
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 transition"
            >
              ↑ Back to top
            </a>
          </div>
        </main>
      </div>

      {/* Inline modal */}
      <ServiceModalInline
        service={selectedService}
        isOpen={modalOpen}
        onClose={closeModal}
      />
    </div>
  );
}
