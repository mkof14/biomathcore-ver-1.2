export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

import Link from "next/link";
export default function LegalIndex() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 space-y-4">
      <h1 className="text-3xl font-bold">Legal</h1>
      <ul className="list-disc ml-6 space-y-2">
        <li><Link href="/legal/privacy" className="underline">Privacy Policy</Link></li>
        <li><Link href="/legal/terms" className="underline">Terms of Service</Link></li>
        <li><Link href="/legal/contacts" className="underline">Contact</Link></li>
      </ul>
    </main>
  );
}
