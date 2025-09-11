export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

import React from "react";
import LegalNote from "@/components/legal/LegalNote";

export const metadata = { title: "GDPR Compliance • BioMath Core" };

export default function GdprPage() {
  return (
    <div className="legal-content text-gray-900 dark:text-gray-100 leading-relaxed">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold mb-6">GDPR Compliance</h1>

        <h2 className="text-xl font-semibold mt-6 mb-2">Legal Bases</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Consent for optional features.</li>
          <li>Contract for providing subscribed services.</li>
          <li>Legitimate interests for security, fraud prevention, and improvements.</li>
          <li>Compliance with legal obligations.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">Your Rights</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Access, rectification, erasure, restriction, portability, objection.</li>
          <li>Right to withdraw consent at any time.</li>
          <li>Right to lodge a complaint with a supervisory authority.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">International Transfers</h2>
        <p className="mb-4">Where applicable, we use appropriate safeguards such as SCCs for data transfers.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
        <p className="mb-4">privacy@biomathcore.com</p>

        <LegalNote>Note: This page summarizes GDPR practices and will be supplemented with detailed records where required.</LegalNote>
      </div>
    </div>
  );
}
