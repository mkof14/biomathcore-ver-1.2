export default function AdminHeader({
  title, desc, actions,
}: { title: string; desc?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="text-2xl font-semibold tracking-tight">{title}</div>
      {desc && <div className="text-sm text-neutral-400 mt-1">{desc}</div>}
      {actions && <div className="mt-3">{actions}</div>}
    </div>
  );
}
