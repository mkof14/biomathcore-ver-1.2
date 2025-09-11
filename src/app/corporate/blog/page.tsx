export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

// src/app/corporate/blog/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog • BioMath Core",
  description:
    "Company updates, product notes, and research highlights from BioMath Core.",
};

const posts = [
  {
    slug: "welcome-to-biomath-core",
    title: "Welcome to BioMath Core",
    excerpt:
      "Why we believe personalized biomathematics + AI will transform prevention, care, and longevity.",
    date: "2025-08-01",
  },
  {
    slug: "product-roadmap-q4",
    title: "Product Roadmap — Q4 Highlights",
    excerpt:
      "A look at what’s shipping next: improved Services, new health insights, and better onboarding.",
    date: "2025-07-20",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight">
          BioMath Core Blog
        </h1>
        <p className="mt-2 text-gray-600">
          Company news, product updates, and research stories.
        </p>

        <div className="mt-8 grid gap-6">
          {posts.map((p) => (
            <article
              key={p.slug}
              className="rounded-xl border border-gray-200 p-6 hover:shadow-sm transition"
            >
              <time className="text-xs uppercase tracking-wide text-gray-500">
                {new Date(p.date).toLocaleDateString()}
              </time>
              <h2 className="mt-2 text-xl font-semibold">
                <Link
                  href={`/corporate/blog/${p.slug}`}
                  className="hover:text-indigo-600"
                >
                  {p.title}
                </Link>
              </h2>
              <p className="mt-2 text-gray-700">{p.excerpt}</p>
              <div className="mt-4">
                <Link
                  href={`/corporate/blog/${p.slug}`}
                  className="inline-flex items-center gap-2 text-indigo-600"
                >
                  Read more <span aria-hidden>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
