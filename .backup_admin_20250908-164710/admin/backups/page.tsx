import { SectionCard } from "@/components/admin/AdminShell";

/** Бэкапы конфигураций: .env из секретов и сырой secrets.json */
export default function BackupsPage() {
  return (
    <div className="space-y-6">
      <SectionCard title="Backups" descr="Экспортируй конфиги для резервного хранения">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="admin-card p-4">
            <div className="font-medium">Export .env</div>
            <div className="kicker">Собирает .env из текущих секретов</div>
            <a className="btn btn-primary mt-2" href="/api/admin/secrets/export?filename=.env.local" aria-label="Download .env.local" title="Скачать .env.local">
              Download .env.local
            </a>
          </div>
          <div className="admin-card p-4">
            <div className="font-medium">Export raw secrets</div>
            <div className="kicker">Отдаёт var/secrets.json (в текущем хранилище)</div>
            <a className="btn btn-ghost mt-2" href="/api/admin/backup/secrets" aria-label="Download secrets.json" title="Скачать secrets.json">
              Download secrets.json
            </a>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
