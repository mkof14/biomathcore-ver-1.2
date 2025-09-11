export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

import type { Metadata } from "next";
import Link from "next/link";
import AutoOpenAssistant from "./AutoOpenAssistant";

export const metadata: Metadata = {
  title: "Pulse AI — BioMath Core",
  description: "Chat with BioMath Core Pulse AI.",
};

export default function AssistantPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <AutoOpenAssistant />
      <h1 className="text-3xl font-semibold mb-4">Pulse AI</h1>
      <p className="text-gray-400 mb-6 max-w-2xl">
        Our Pulse AI is available on every page (bottom-right chat bubble).
        You can start a conversation here as well.
      </p>
      <div className="rounded-xl border border-white/10 p-6">
        <p className="text-sm text-gray-300">
          Tip: if you don’t see the floating chat bubble, try reloading the page
          or make sure the window isn’t blocking popups.
        </p>
      </div>
      <div className="mt-6 text-sm text-gray-400">
        <Link className="underline hover:text-white" href="/member-zone/catalog">
          ← Back to Catalog
        </Link>
      </div>
    </main>
  );
}
