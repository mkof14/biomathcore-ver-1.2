// src/app/refer/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refer a Friend • BioMath Core",
  description: "Invite friends to BioMath Core and unlock benefits.",
};

export default function ReferPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Refer a Friend
        </h1>
        <p className="mt-2 text-gray-600">
          Share your referral link and help friends discover BioMath Core.
        </p>

        <div className="mt-8 rounded-xl border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700">
            Your referral link
          </label>
          <div className="mt-2 flex">
            <input
              className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 text-sm"
              defaultValue="https://biomathcore.com/ref/your-id"
              readOnly
            />
            <button
              className="rounded-r-md bg-indigo-600 px-4 text-white text-sm hover:bg-indigo-700"
              onClick={() =>
                navigator.clipboard.writeText(
                  "https://biomathcore.com/ref/your-id",
                )
              }
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
