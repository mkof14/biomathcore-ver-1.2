import React from "react";
import LegalNote from "@/components/legal/LegalNote";

export const metadata = { title: "Data Protection • BioMath Core" };

export default function DataProtectionPage() {
  return (
    <div className="legal-content text-gray-900 dark:text-gray-100 leading-relaxed">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold mb-6">Data Protection</h1>

        <h2 className="text-xl font-semibold mt-6 mb-2">Principles</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Lawfulness, fairness, transparency.</li>
          <li>Purpose limitation and data minimization.</li>
          <li>Accuracy, storage limitation, integrity and confidentiality.</li>
          <li>Accountability.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">Requests</h2>
        <p className="mb-4">Submit data subject requests to privacy@biomathcore.com. We verify identity before acting on requests.</p>

        <LegalNote>Note: Additional regional terms may apply; see GDPR section for EU/EEA specifics.</LegalNote>
      </div>
    </div>
  );
}
