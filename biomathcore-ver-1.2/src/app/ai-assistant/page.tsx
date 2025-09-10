import AssistantCore from "@/components/ai/AssistantCore";

export const metadata = { title: "Pulse AI • BioMath Core" };

export default function Page() {
  return (
    <main className="pt-24 min-h-[70vh]">
      <div className="mx-auto h-[70vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 shadow-2xl">
        <AssistantCore />
      </div>
    </main>
  );
}
