// src/app/blackbox/page.tsx
import { redirect } from "next/navigation";
import { getServerSessionSafe, requireAuthRedirectURL } from "@/lib/auth";
import UploadPanel from "@/components/blackbox/UploadPanel";

export const runtime = "nodejs";

export default async function BlackBoxPage() {
  const session = await getServerSessionSafe();
  if (!session?.user?.email) {
    redirect(requireAuthRedirectURL());
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Health Black Box</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Upload health-related files or paste text to analyze. This is a
        placeholder; results are simulated.
      </p>

      <div className="mt-6">
        <UploadPanel />
      </div>
    </div>
  );
}
