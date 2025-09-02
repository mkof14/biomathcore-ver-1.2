"use client";
/**
 * Pure CSS logo (no image file).
 * "BioMath" with gradient + "Core" solid white.
 */
export default function Logo({
  className = "",
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={[
        "select-none leading-none tracking-tight font-extrabold whitespace-nowrap",
        className,
      ].join(" ")}
      onClick={onClick}
      aria-label="BioMath Core"
    >
      <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
        BioMath
      </span>{" "}
      <span className="text-white">Core</span>
    </div>
  );
}
