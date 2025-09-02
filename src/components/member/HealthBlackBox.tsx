"use client";
/**
 * HealthBlackBox — private notes & attachments UI.
 * Storage/crypto not wired here; this is a safe UI shell.
 */

export default function HealthBlackBox() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f1320] p-5">
      <h2 className="text-sm font-semibold text-white/90">Health Black Box</h2>
      <p className="text-xs text-gray-400 mt-1">
        Private space for sensitive health notes and attachments. In production,
        use local encryption and secure storage.
      </p>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Secure Note */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <label className="text-xs text-gray-400">Secure Note</label>
          <textarea
            className="mt-1 w-full rounded-md border border-white/10 bg-[#0f1320] p-2 text-sm text-gray-200 outline-none"
            rows={5}
            placeholder="Write a private note (encrypted at rest in production)…"
          />
          <div className="mt-2 flex gap-2">
            <button className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/10">
              Save
            </button>
            <button className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/10">
              Clear
            </button>
          </div>
        </div>

        {/* Attachments */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <label className="text-xs text-gray-400">Attach File</label>
          <div className="mt-1">
            <input
              type="file"
              className="text-xs text-gray-300 file:mr-2 file:rounded-md file:border file:border-white/10 file:bg-white/5 file:px-2 file:py-1 file:text-gray-200 file:hover:bg-white/10"
            />
          </div>
          <p className="mt-2 text-[11px] text-gray-400">
            Tip: anonymize filenames for privacy (e.g., “cbc_2025_08.pdf”).
          </p>
        </div>
      </div>
    </div>
  );
}
