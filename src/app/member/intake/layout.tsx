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
