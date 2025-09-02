export default function InternalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <main className="max-w-6xl mx-auto p-6">{children}</main>
    </div>
  );
}
