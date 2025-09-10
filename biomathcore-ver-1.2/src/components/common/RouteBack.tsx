"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  href?: string;
  label?: string;
  className?: string;
};

export default function RouteBack({ href, label = "Back", className = "" }: Props) {
  const router = useRouter();
  const onClick = (e: React.MouseEvent) => {
    if (!href) {
      e.preventDefault();
      router.back();
    }
  };
  return (
    <Link
      href={href || "#"}
      onClick={onClick}
      className={
        "inline-flex items-center gap-2 rounded-md border border-zinc-300/70 dark:border-zinc-700/70 " +
        "bg-white/80 dark:bg-zinc-900/70 px-3 py-1.5 text-sm backdrop-blur " +
        "hover:bg-white dark:hover:bg-zinc-800/80 transition " + className
      }
      aria-label="Go back"
    >
      <span aria-hidden>〈</span>
      {label}
    </Link>
  );
}