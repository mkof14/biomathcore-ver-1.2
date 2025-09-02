"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl border border-neutral-800 bg-neutral-950/50", props.className)} {...props} />;
}

export function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 border-b border-neutral-800", props.className)} {...props} />;
}

export function CardTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold leading-none tracking-tight", props.className)} {...props} />;
}

export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", props.className)} {...props} />;
}

export function CardFooter(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 border-t border-neutral-800 flex items-center", props.className)} {...props} />;
}

export default Card;
