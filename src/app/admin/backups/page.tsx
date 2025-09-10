import { SectionCard } from "@/components/admin/AdminShell";

/**  : .env     secrets.json */
export default function BackupsPage() {
  return (
    <div className="space-y-6">
      <SectionCard title="Backups" descr="    ">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="admin-card p-4">
            <div className="font-medium">Export .env</div>
            <div className="kicker"> .env   </div>
            <a className="btn btn-primary mt-2" href="/api/admin/secrets/export?filename=.env.local" aria-label="Download .env.local" title=" .env.local">
              Download .env.local
            </a>
          </div>
          <div className="admin-card p-4">
            <div className="font-medium">Export raw secrets</div>
            <div className="kicker"> var/secrets.json (  )</div>
            <a className="btn btn-ghost mt-2" href="/api/admin/backup/secrets" aria-label="Download secrets.json" title=" secrets.json">
              Download secrets.json
            </a>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
