"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [activeKey, setActiveKey] = useState(pathname);

  useEffect(() => {
    // App Router: re-key content on path change to trigger CSS transitions
    setActiveKey(pathname);
  }, [pathname]);

  return (
    <div key={activeKey} className="page-transition">
      {children}
    </div>
  );
}
