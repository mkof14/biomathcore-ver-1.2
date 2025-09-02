// src/app/legal/security/page.tsx
import React from "react";

export const metadata = { title: "Security • BioMath Core" };

export default function SecurityPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold mb-6">Security</h1>

      <p className="mb-4">
        We use industry-standard safeguards to protect your data, including
        encryption in transit, strict access controls, auditing, and continuous
        monitoring. We regularly review our security posture and update controls
        to align with best practices.
      </p>

      <ul className="list-disc ml-6 mb-4 space-y-1">
        <li>Encryption in transit (TLS)</li>
        <li>Least-privilege access and audit logs</li>
        <li>Regular backups and disaster recovery procedures</li>
        <li>Vendor and third-party risk management</li>
      </ul>

      <p className="text-sm text-gray-600 mt-8">
        This is a demo page. The full Security documentation will be available
        in the actual version of the site.
      </p>
    </div>
  );
}
