"use client";
/**
 * UserProfile — basic profile form.
 * Replace with your real model + validation when wiring backend.
 */

export default function UserProfile() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f1320] p-5">
      <h2 className="text-sm font-semibold text-white/90">Your Profile</h2>

      <form className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <label className="text-xs text-gray-400">Full name</label>
          <input
            className="mt-1 w-full rounded-md border border-white/10 bg-[#0f1320] p-2 text-sm text-gray-200 outline-none"
            placeholder="John Smith"
          />
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <label className="text-xs text-gray-400">Email</label>
          <input
            type="email"
            className="mt-1 w-full rounded-md border border-white/10 bg-[#0f1320] p-2 text-sm text-gray-200 outline-none"
            placeholder="you@example.com"
          />
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 md:col-span-2">
          <label className="text-xs text-gray-400">Goals</label>
          <input
            className="mt-1 w-full rounded-md border border-white/10 bg-[#0f1320] p-2 text-sm text-gray-200 outline-none"
            placeholder="e.g., Reduce stress, improve sleep"
          />
        </div>
      </form>
    </div>
  );
}
