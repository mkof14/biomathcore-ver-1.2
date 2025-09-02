// src/app/services/[slug]/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 text-center">
      <h1 className="text-2xl font-semibold text-gray-900">
        Service not found
      </h1>
      <p className="mt-2 text-gray-600">
        The service you’re looking for doesn’t exist or has been moved.
      </p>
      <div className="mt-6">
        <Link
          href="/services"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Back to Services
        </Link>
      </div>
    </div>
  );
}
