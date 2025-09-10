"use client";
import * as React from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type HProps = React.HTMLAttributes<HTMLHeadingElement>;

function join(a?: string, b?: string) {
  return [a||"", b||""].filter(Boolean).join(" ");
}

export function Card(props: DivProps) {
  return <div {...props} className={join("rounded-xl border border-neutral-800 bg-neutral-950/50", props.className)} />;
}
export function CardHeader(props: DivProps) {
  return <div {...props} className={join("p-4 border-b border-neutral-800", props.className)} />;
}
export function CardTitle(props: HProps) {
  return <h3 {...props} className={join("text-lg font-semibold leading-none tracking-tight", props.className)} />;
}
export function CardContent(props: DivProps) {
  return <div {...props} className={join("p-5", props.className)} />;
}
export function CardFooter(props: DivProps) {
  return <div {...props} className={join("p-4 border-t border-neutral-800 flex items-center", props.className)} />;
}

export default Card;
