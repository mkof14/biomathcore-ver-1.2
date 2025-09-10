"use client";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    // log if you want: console.error(error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-neutral-950 text-neutral-100">
        <div className="mx-auto max-w-xl p-8 text-center space-y-4">
          <div className="text-6xl">😵‍💫</div>
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="text-neutral-400 text-sm break-all">
            {error?.message || "Unexpected error"}{error?.digest ? ` • ${error.digest}` : ""}
          </p>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => reset()}
              className="border rounded px-4 py-2 hover:bg-neutral-900"
            >
              Try again
            </button>
            <a href="/" className="border rounded px-4 py-2 hover:bg-neutral-900">
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
