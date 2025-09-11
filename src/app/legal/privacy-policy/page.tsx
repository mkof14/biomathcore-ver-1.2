export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

import React from "react";
import Link from "next/link";
export const metadata = { title: "Privacy Policy • BioMath Core" };
export default function PrivacyPolicyPage() {
  return (
    <div className="legal-content text-gray-900 dark:text-gray-100 leading-relaxed">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold mb-6">Privacy Policy</h1>
        <h2 className="text-2xl font-bold mb-4">BioMath Core Privacy Policy</h2>
        <p className="text-red-600 font-semibold mb-6">Important Note: BioMath Core is not a medical service and does not provide medical advice. Always consult with a qualified healthcare professional for any health concerns or conditions.</p>
        <p className="mb-4">At BioMath Core (“we”, “us”, or “our”), we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>
        <h3 className="text-xl font-semibold mt-8 mb-2">Information Collection and Use</h3>
        <p className="mb-4">We collect several different types of information for various purposes to provide and improve our Service to you.</p>
        <h4 className="font-semibold mt-6 mb-2">Personal Data</h4>
        <ul className="list-disc ml-6 mb-4 space-y-1">
          <li>Email address</li>
          <li>First and last name</li>
          <li>Address</li>
          <li>Usage data</li>
        </ul>
        <h4 className="font-semibold mt-6 mb-2">Usage Data</h4>
        <p className="mb-4">We may also collect information on how the Service is accessed and used, including IP address, browser type and version, pages visited, time and date of visits, time spent on pages, unique device identifiers and other diagnostic data.</p>
        <h3 className="text-xl font-semibold mt-8 mb-2">Use of Data</h3>
        <ul className="list-disc ml-6 mb-4 space-y-1">
          <li>To provide and maintain the Service</li>
          <li>To notify you about changes to the Service</li>
          <li>To provide customer care and support</li>
          <li>To monitor usage and improve the Service</li>
          <li>To detect, prevent and address technical issues</li>
        </ul>
        <h3 className="text-xl font-semibold mt-8 mb-2">Contact Us</h3>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at{" "}
          <Link href="mailto:legal@biomathcore.com" className="text-blue-600 underline">legal@biomathcore.com</Link>.
        </p>
        <p className="text-sm text-gray-900 mt-8">This is a demo page. The full Privacy Policy will be available in the actual version of the site.</p>
      </div>
    </div>
  );
}
