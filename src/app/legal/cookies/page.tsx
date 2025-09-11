export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

import React from "react";
import LegalNote from "@/components/legal/LegalNote";

export const metadata = { title: "Cookies • BioMath Core" };

export default function CookiesPage() {
  return (
    <div className="legal-content text-gray-900 dark:text-gray-100 leading-relaxed">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold mb-6">Cookies</h1>

        <h2 className="text-xl font-semibold mt-6 mb-2">What We Use</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Strictly necessary cookies for core functionality and security.</li>
          <li>Performance cookies to understand usage patterns.</li>
          <li>Preference cookies to remember settings.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">Managing Cookies</h2>
        <p className="mb-4">You can manage cookies in your browser settings. Disabling some cookies may impact functionality.</p>

        <LegalNote>Note: A detailed cookie table will be provided if required by applicable law.</LegalNote>
      </div>
    </div>
  );
}
