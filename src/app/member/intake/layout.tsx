export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

import type { ReactNode } from "react";
import BackFab from "@/components/forms/BackFab";

export default function MemberIntakeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <BackFab />
    </div>
  );
}
