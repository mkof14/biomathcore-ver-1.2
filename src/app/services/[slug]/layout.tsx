// src/app/services/[slug]/layout.tsx

import type { ReactNode } from "react";

export default function ServiceSlugLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="min-h-screen">{children}</div>;
}
