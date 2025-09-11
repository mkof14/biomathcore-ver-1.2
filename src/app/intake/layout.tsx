export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

import BackFab from "@/components/BackFab";
export default function IntakeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative pt-4 pb-16">
      {children}
      <BackFab />
    </div>
  );
}
