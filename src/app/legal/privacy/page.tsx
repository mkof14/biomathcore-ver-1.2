import React from "react";
import LegalNote from "@/components/legal/LegalNote";

export const metadata = { title: "Privacy Policy • BioMath Core" };

export default function PrivacyPage() {
  return (
    <div className="legal-content text-gray-900 dark:text-gray-100 leading-relaxed">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold mb-6">Privacy Policy</h1>

        <h2 className="text-xl font-semibold mt-6 mb-2">Overview</h2>
        <p className="mb-4">
          This Privacy Policy explains how we collect, use, disclose, and protect personal information when you use the BioMath Core platform.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Data We Collect</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Account data: name, email, authentication identifiers.</li>
          <li>Usage data: app interactions, device and browser metadata.</li>
          <li>Payment data: limited billing details processed via our payment provider.</li>
          <li>Wellness inputs you choose to provide to the platform.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Data</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>To provide and improve platform features and personalization.</li>
          <li>To process payments and manage subscriptions.</li>
          <li>To communicate updates, security alerts, and support responses.</li>
          <li>To comply with legal obligations and enforce terms.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">Sharing</h2>
        <p className="mb-4">
          We share data with service providers under contract (e.g., hosting, analytics, payments). We do not sell personal data. We disclose information when required by law or to protect users and services.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Security</h2>
        <p className="mb-4">
          We apply administrative, technical, and physical safeguards. No method of transmission or storage is 100% secure.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Retention</h2>
        <p className="mb-4">
          We retain data for as long as necessary for the purposes described or as required by law. We may anonymize data for analytics.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Your Rights</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Access, correction, deletion, and portability.</li>
          <li>Objection and restriction where applicable.</li>
          <li>Withdraw consent where processing is based on consent.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
        <p className="mb-4">info@biomathcore.com</p>

        <LegalNote>Note: This summary is provided for transparency and may be updated. For specific regional notices see GDPR and Data Protection sections.</LegalNote>
      </div>
    </div>
  );
}
