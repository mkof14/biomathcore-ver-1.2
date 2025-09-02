export const metadata = { title: "Developer Demos" };
export default function DevLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl p-6 space-y-8">
      <h1 className="text-3xl font-bold">Developer Demos</h1>
      {children}
    </div>
  );
}
