"use client";
/**
 * AccountSettings — basic settings UI for theme, reminders, privacy.
 * Hook these selects to your app state when ready.
 */

export default function AccountSettings() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f1320] p-5">
      <h2 className="text-sm font-semibold text-white/90">Account Settings</h2>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Theme */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <label className="text-xs text-gray-400">Theme</label>
          <select
            className="mt-1 w-full rounded-md border border-white/10 bg-[#0f1320] p-2 text-sm text-gray-200 outline-none"
            defaultValue="system"
            aria-label="Theme"
          >
            <option value="system">System</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>

        {/* Reminders */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <label className="text-xs text-gray-400">Reminders</label>
          <select
            className="mt-1 w-full rounded-md border border-white/10 bg-[#0f1320] p-2 text-sm text-gray-200 outline-none"
            defaultValue="important"
            aria-label="Reminders"
          >
            <option value="all">All</option>
            <option value="important">Important only</option>
            <option value="off">Off</option>
          </select>
        </div>

        {/* Privacy */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <label className="text-xs text-gray-400">Privacy</label>
          <select
            className="mt-1 w-full rounded-md border border-white/10 bg-[#0f1320] p-2 text-sm text-gray-200 outline-none"
            defaultValue="standard"
            aria-label="Privacy"
          >
            <option value="standard">Standard</option>
            <option value="strict">Strict</option>
          </select>
        </div>
      </div>

      {/* Save area */}
      <div className="mt-4 flex gap-2">
        <button className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/10">
          Save changes
        </button>
        <button className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300 hover:bg-white/10">
          Reset
        </button>
      </div>
    </div>
  );
}
