export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

import React from "react";
import LegalNote from "@/components/legal/LegalNote";

export const metadata = { title: "Disclaimer • BioMath Core" };

export default function DisclaimerPage() {
  return (
    <div className="legal-content text-gray-900 dark:text-gray-100 leading-relaxed">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold mb-6">Disclaimer</h1>

        <p className="mb-4">
          BioMath Core provides wellness and lifestyle information only. It is not medical advice and is not a substitute
          for professional diagnosis or treatment. Always seek the advice of qualified healthcare professionals.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">No Warranties</h2>
        <p className="mb-4">Content is provided “as is” without warranties of any kind, express or implied.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Limitation of Liability</h2>
        <p className="mb-4">To the extent permitted by law, we are not liable for damages arising from use of the platform.</p>

        <LegalNote>Note: This disclaimer may be complemented by jurisdiction-specific notices.</LegalNote>
      </div>
    </div>
  );
}
