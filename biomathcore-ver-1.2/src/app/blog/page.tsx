// src/app/blog/page.tsx
import React from "react";

export default function BlogPage() {
  return (
    <main className="bg-white text-gray-800 min-h-screen py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4">
          BioMath Core Blog
        </h1>
        <p className="mb-8">
          Insights, stories, and perspectives from the BioMath Core team.
        </p>

        <article className="mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            How AI is Transforming Preventive Medicine
          </h2>
          <p className="text-sm text-gray-500 mb-2">July 2025</p>
          <p>
            We explore the role of AI in identifying potential health risks
            before they become critical, and how BioMath Core is leading this
            transformation.
          </p>
        </article>

        <article className="mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Behind the Scenes of Our AI Models
          </h2>
          <p className="text-sm text-gray-500 mb-2">June 2025</p>
          <p>
            A closer look at the data science and biomathematics powering our
            personalized health predictions.
          </p>
        </article>
      </div>
    </main>
  );
}
