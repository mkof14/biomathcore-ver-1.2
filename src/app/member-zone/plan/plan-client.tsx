"use client";
import { useEffect, useState } from "react";

type Category = { id: string; title: string; isCoreIncluded: boolean };

export default function PlanClient() {
  const [cats, setCats] = useState<Category[]>([]);
  useEffect(() => {
    fetch("/api/catalog/categories").then(r=>r.json()).then(d=> setCats(d.categories||[]));
  }, []);

  const core = cats.filter(c=>c.isCoreIncluded);
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Your Plan</h1>
      <div className="rounded-2xl border p-4">
        <h2 className="font-semibold mb-2">Core plan includes:</h2>
        <ul className="list-disc pl-6">
          {core.map(c=> <li key={c.id}>{c.title}</li>)}
        </ul>
      </div>
    </div>
  );
}
