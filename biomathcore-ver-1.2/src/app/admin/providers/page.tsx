"use client";
import React from "react";

const providers = [
  { name: "Apple", keys: ["APPLE_CLIENT_ID","APPLE_CLIENT_SECRET"] },
  { name: "Google", keys: ["GOOGLE_CLIENT_ID","GOOGLE_CLIENT_SECRET"] },
  { name: "Microsoft", keys: ["MICROSOFT_CLIENT_ID","MICROSOFT_CLIENT_SECRET"] },
  { name: "Facebook", keys: ["FACEBOOK_CLIENT_ID","FACEBOOK_CLIENT_SECRET"] },
];

export default function ProvidersPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">OAuth Providers</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map(p => (
          <div key={p.name} className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="font-medium">{p.name}</div>
            <ul className="text-sm opacity-80 list-disc pl-5 mt-2">
              {p.keys.map(k => <li key={k}>{k}</li>)}
            </ul>
            <div className="text-xs opacity-60 mt-2">Add to secrets, export .env, restart.</div>
          </div>
        ))}
      </div>
    </div>
  );
}
