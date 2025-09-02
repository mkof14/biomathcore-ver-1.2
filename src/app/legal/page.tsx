// src/app/legal/page.tsx
import Link from "next/link";

export default function LegalIndex() {
  const items = [
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Terms of Service", href: "/legal/terms" },
    { label: "HIPAA Notice", href: "/legal/hipaa" },
    { label: "Security", href: "/legal/security" },
    { label: "Disclaimer", href: "/legal/disclaimer" },
  ];
  return (
    <main>
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-4xl font-bold mb-6">Legal</h1>
        <p className="text-gray-700 mb-6">
          Find our policies and notices below.
        </p>
        <ul className="space-y-3">
          {items.map((i) => (
            <li key={i.href}>
              <Link
                href={i.href}
                className="text-indigo-700 hover:text-indigo-900 underline"
              >
                {i.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
