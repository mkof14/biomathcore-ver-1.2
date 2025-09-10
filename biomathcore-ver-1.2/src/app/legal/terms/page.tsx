import React from "react";
import LegalNote from "@/components/legal/LegalNote";

export const metadata = { title: "Terms of Service • BioMath Core" };

export default function TermsPage() {
  return (
    <div className="legal-content text-gray-900 dark:text-gray-100 leading-relaxed">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold mb-6">Terms of Service</h1>

        <h2 className="text-xl font-semibold mt-6 mb-2">Acceptance</h2>
        <p className="mb-4">By using the platform you agree to these Terms and our Privacy Policy.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Accounts</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Provide accurate information and safeguard credentials.</li>
          <li>You are responsible for activities under your account.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">Use of Services</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>No unlawful, harmful, or abusive activity.</li>
          <li>No reverse engineering or interference with the service.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">Subscriptions & Billing</h2>
        <p className="mb-4">Recurring charges are processed by our payment provider. You may cancel according to your plan terms.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Disclaimers</h2>
        <p className="mb-4">Services are provided “as is” without warranties. To the extent permitted by law, our liability is limited.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Changes</h2>
        <p className="mb-4">We may update these Terms. Continued use means acceptance of changes.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
        <p className="mb-4">info@biomathcore.com</p>

        <LegalNote>Note: These Terms summarize key rules for service use. Specific product terms may apply to certain features.</LegalNote>
      </div>
    </div>
  );
}
