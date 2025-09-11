export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

// src/app/corporate/news/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News • BioMath Core",
  description: "Press releases and announcements from BioMath Core.",
};

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight">News</h1>
        <p className="mt-2 text-gray-600">
          Press releases, partnerships, and milestones.
        </p>

        <div className="mt-8 rounded-xl border border-gray-200 p-6">
          <p className="text-gray-700">
            No public announcements yet. Check back soon.
          </p>
        </div>
      </div>
    </div>
  );
}
