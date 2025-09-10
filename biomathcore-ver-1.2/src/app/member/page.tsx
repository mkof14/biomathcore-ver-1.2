import React from "react";

export const metadata = { title: "Member Zone • BioMath Core" };

export default function MemberPage() {
  return (
    <div className="text-gray-900 dark:text-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold mb-6">Member Zone</h1>
        <p className="mb-4">
          Welcome to the member area. This section will host personalized content, subscriptions,
          and preferences once your account is fully enabled.
        </p>
        <ul className="list-disc ml-6 space-y-1">
          <li>Profile & preferences</li>
          <li>Subscriptions & billing</li>
          <li>Downloads & resources</li>
        </ul>
      </div>
    </div>
  );
}
