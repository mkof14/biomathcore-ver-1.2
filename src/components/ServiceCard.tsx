import Link from "next/link";

type Service = {
  title: string;
  description: string;
  icon?: string;
  slug: string;
};

type Props = {
  service: Service;
};

export default function ServiceCard({ service }: Props) {
  return (
    <div className="rounded-2xl p-6 bg-gradient-to-b from-black/20 to-black/5 hover:from-black/10 hover:to-black/0 border border-white/10 transition-all">
      <div className="flex items-center gap-3 mb-3">
        {service.icon && (
          <span className="text-2xl" aria-hidden>
            {service.icon}
          </span>
        )}
        <h3 className="text-lg font-semibold leading-tight">{service.title}</h3>
      </div>
      <p className="text-sm text-white/70 mb-4">{service.description}</p>
      <Link
        href={`/services/${service.slug}`}
        className="inline-flex items-center gap-1 text-sm underline underline-offset-4 decoration-white/40 hover:decoration-white"
      >
        Open service →
      </Link>
    </div>
  );
}
