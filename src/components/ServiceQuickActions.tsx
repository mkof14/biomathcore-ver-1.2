"use client";
export default function ServiceQuickActions({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/90">
      <div className="text-white/80">Quick actions for:</div>
      <div className="mt-1 text-base font-semibold text-white">{title}</div>
      {description ? (
        <div className="mt-2 text-white/70">{description}</div>
      ) : null}

      <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {[
          "Quick Run",
          "Custom Input",
          "Compare",
          "Export (Copy/Print/Email/PDF)",
          "Generate",
        ].map((item) => (
          <li
            key={item}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
