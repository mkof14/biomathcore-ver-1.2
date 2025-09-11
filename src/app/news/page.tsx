export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

// src/app/news/page.tsx
import React from "react";

export default function NewsPage() {
  return (
    <main className="bg-white text-gray-800 min-h-screen py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4">
          BioMath Core News
        </h1>
        <p className="mb-8">
          Stay informed with the latest developments, partnerships, and
          innovations from BioMath Core.
        </p>

        <article className="mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            BioMath Core Launches New AI-Driven Health Prediction Tool
          </h2>
          <p className="text-sm text-gray-500 mb-2">August 2025</p>
          <p>
            Our latest AI service delivers advanced biomathematical predictions
            for improved health outcomes. This innovation aligns with our
            mission to bring cutting-edge health intelligence to everyone.
          </p>
        </article>

        <article className="mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Strategic Partnership with Global Health Organization
          </h2>
          <p className="text-sm text-gray-500 mb-2">July 2025</p>
          <p>
            BioMath Core has entered into a strategic alliance to accelerate AI
            adoption in healthcare systems worldwide.
          </p>
        </article>
      </div>
    </main>
  );
}
