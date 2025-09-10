import BackFab from "@/components/BackFab";
export default function IntakeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative pt-4 pb-16">
      {children}
      <BackFab />
    </div>
  );
}
