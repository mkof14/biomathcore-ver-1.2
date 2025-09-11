export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

import React from "react";
export const metadata = { title: "Terms of Service • BioMath Core" };
export default function TermsPage() {
  return (
    <div className="legal-content text-gray-900 dark:text-gray-100 leading-relaxed">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold mb-6">Terms Of Service</h1>
        <h2 className="text-2xl font-bold mb-4">BioMath Core Terms of Service</h2>
        <p className="text-red-600 font-semibold mb-6">Important Note: BioMath Core is not a medical service and does not provide medical advice. Always consult with a qualified healthcare professional for any health concerns or conditions.</p>
        <h3 className="text-xl font-semibold mt-8 mb-2">Accounts</h3>
        <p className="mb-4">When you create an account with us, you represent that you are at least 18 years old and that the information you provide is accurate and complete. You are responsible for safeguarding your password.</p>
        <h3 className="text-xl font-semibold mt-8 mb-2">Use of the Service</h3>
        <ul className="list-disc ml-6 mb-4 space-y-1">
          <li>No unlawful or prohibited use</li>
          <li>No attempts to interfere with security or integrity</li>
          <li>No reverse engineering or unauthorized access</li>
        </ul>
        <h3 className="text-xl font-semibold mt-8 mb-2">Termination</h3>
        <p className="mb-4">We may terminate or suspend access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
        <p className="text-sm text-gray-900 mt-8">This is a demo page. The full Terms of Service will be available in the actual version of the site.</p>
      </div>
    </div>
  );
}
