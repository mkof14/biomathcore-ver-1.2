// src/app/legal/hipaa-notice/page.tsx
import React from "react";

export const metadata = { title: "HIPAA Notice • BioMath Core" };

export default function HipaaPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold mb-6">HIPAA Notice</h1>

      <h2 className="text-2xl font-bold mb-4">
        Notice of HIPAA Privacy Practices
      </h2>

      <p className="text-red-600 font-semibold mb-6">
        Important Note: BioMath Core is not a medical service and does not
        provide medical advice. Always consult with a qualified healthcare
        professional for any health concerns or conditions.
      </p>

      <p className="mb-4">
        This Notice describes how medical information about you may be used and
        disclosed and how you can access this information. Please review it
        carefully.
      </p>

      <h3 className="text-xl font-semibold mt-8 mb-2">
        How We May Use and Disclose Your PHI
      </h3>
      <ul className="list-disc ml-6 mb-4 space-y-1">
        <li>
          <b>Treatment</b> — to provide you with healthcare services
        </li>
        <li>
          <b>Payment</b> — to bill for and receive payment for services
        </li>
        <li>
          <b>Operations</b> — to support quality care and service improvements
        </li>
      </ul>

      <h3 className="text-xl font-semibold mt-8 mb-2">Your Rights</h3>
      <ul className="list-disc ml-6 mb-4 space-y-1">
        <li>Right to inspect and copy PHI</li>
        <li>Right to request an amendment</li>
        <li>Right to request restrictions and confidential communications</li>
        <li>Right to an accounting of disclosures</li>
      </ul>

      <p className="text-sm text-gray-600 mt-8">
        This is a demo page. The full HIPAA Notice will be available in the
        actual version of the site.
      </p>
    </div>
  );
}
