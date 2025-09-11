export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

import React from "react";
import LegalNote from "@/components/legal/LegalNote";

export const metadata = { title: "Security • BioMath Core" };

export default function SecurityPage() {
  return (
    <div className="legal-content text-gray-900 dark:text-gray-100 leading-relaxed">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold mb-6">Security</h1>

        <p className="mb-4">
          We use industry-standard safeguards to protect your data, including encryption in transit,
          strict access controls, auditing, and continuous monitoring. We regularly review our security posture
          and update controls to align with best practices.
        </p>

        <ul className="list-disc ml-6 mb-4 space-y-1">
          <li>Encryption in transit (TLS)</li>
          <li>Least-privilege access and audit logs</li>
          <li>Regular backups and disaster recovery procedures</li>
          <li>Vendor and third-party risk management</li>
        </ul>

        <LegalNote />
      </div>
    </div>
  );
}
