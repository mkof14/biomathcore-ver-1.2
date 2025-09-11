export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

import React from "react";
import LegalNote from "@/components/legal/LegalNote";

export const metadata = { title: "HIPAA Notice • BioMath Core" };

export default function HipaaPage() {
  return (
    <div className="legal-content text-gray-900 dark:text-gray-100 leading-relaxed">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold mb-6">HIPAA Notice</h1>

        <p className="mb-4">
          BioMath Core is a wellness platform and is not a covered entity or business associate under HIPAA in most contexts.
          If HIPAA applies to a particular integration or program, we implement appropriate safeguards and agreements.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">PHI Handling</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Limited collection of PHI where explicitly enabled.</li>
          <li>Secure storage and access controls.</li>
          <li>Incident response and breach notifications as required.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">User Responsibilities</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Do not upload sensitive medical data unless necessary and permitted.</li>
          <li>Review provider agreements when connecting third-party services.</li>
        </ul>

        <LegalNote>Note: This page provides general information and is not legal advice. Coverage may vary by integration and program.</LegalNote>
      </div>
    </div>
  );
}
