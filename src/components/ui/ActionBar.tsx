"use client";
import EndpointBadge from "@/components/ui/EndpointBadge";

export default function ActionBar({
  title,
  onCreate,
  endpointPath,
}: {
  title: string;
  onCreate?: () => void;
  endpointPath: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <EndpointBadge path={endpointPath} />
      </div>
      <div className="flex items-center gap-2">
        {onCreate && (
          <button
            type="button"
            onClick={onCreate}
            className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm hover:bg-neutral-700"
          >
            Create
          </button>
        )}
      </div>
    </div>
  );
}
