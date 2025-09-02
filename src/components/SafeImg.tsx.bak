"use client";
import React from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
};

export default function SafeImg({
  src,
  alt,
  className = "",
  width = 800,
  height = 600,
  loading = "lazy",
}: Props) {
  const placeholder =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
         <rect width="100%" height="100%" fill="#f3f4f6"/>
         <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
           font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto" font-size="14" fill="#9ca3af">
           Image placeholder
         </text>
       </svg>`,
    );

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={loading}
      onError={(e) => {
        const el = e.currentTarget as HTMLImageElement;
        if (el.src !== placeholder) el.src = placeholder;
      }}
    />
  );
}
