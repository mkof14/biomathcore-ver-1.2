// src/app/legal/terms-of-service/page.tsx
import React from "react";

export const metadata = { title: "Terms of Service • BioMath Core" };

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold mb-6">Terms Of Service</h1>

      <h2 className="text-2xl font-bold mb-4">BioMath Core Terms of Service</h2>

      <p className="text-red-600 font-semibold mb-6">
        Important Note: BioMath Core is not a medical service and does not
        provide medical advice. Always consult with a qualified healthcare
        professional for any health concerns or conditions.
      </p>

      <p className="mb-4">
        Welcome to BioMath Core! These Terms of Service (“Terms”) govern your
        use of our website and services at biomathcore.com (collectively, the
        “Service”). Your access to and use of the Service is conditioned on your
        acceptance of and compliance with these Terms.
      </p>

      <h3 className="text-xl font-semibold mt-8 mb-2">Accounts</h3>
      <p className="mb-4">
        When you create an account with us, you represent that you are at least
        18 years old and that the information you provide is accurate and
        complete. You are responsible for safeguarding the password that you use
        to access the Service and for any activities or actions under your
        password.
      </p>

      <h3 className="text-xl font-semibold mt-8 mb-2">Use of the Service</h3>
      <ul className="list-disc ml-6 mb-4 space-y-1">
        <li>No unlawful or prohibited use</li>
        <li>
          No attempt to interfere with the security or integrity of the Service
        </li>
        <li>No reverse engineering or unauthorized access</li>
      </ul>

      <h3 className="text-xl font-semibold mt-8 mb-2">Termination</h3>
      <p className="mb-4">
        We may terminate or suspend access immediately, without prior notice or
        liability, for any reason whatsoever, including without limitation if
        you breach the Terms.
      </p>

      <h3 className="text-xl font-semibold mt-8 mb-2">
        Limitation of Liability
      </h3>
      <p className="mb-4">
        In no event shall BioMath Core be liable for any indirect, incidental,
        special, consequential or punitive damages resulting from your access to
        or use of the Service.
      </p>

      <h3 className="text-xl font-semibold mt-8 mb-2">Changes</h3>
      <p className="mb-4">
        We reserve the right, at our sole discretion, to modify or replace these
        Terms at any time. What constitutes a material change will be determined
        at our sole discretion.
      </p>

      <p className="text-sm text-gray-600 mt-8">
        This is a demo page. The full Terms of Service will be available in the
        actual version of the site.
      </p>
    </div>
  );
}
