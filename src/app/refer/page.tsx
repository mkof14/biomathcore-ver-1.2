import ReferClient from "@/components/refer/ReferClient";

export default function ReferPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 space-y-6">
      <h1 className="text-3xl font-bold">Refer a Friend</h1>
      <p>Share your link and earn rewards.</p>
      <ReferClient />
    </main>
  );
}
