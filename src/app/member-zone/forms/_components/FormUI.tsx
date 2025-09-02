"use client";
import React from "react";

export function Section({
  title, icon, tone="neutral", children,
}: { title:string; icon?:string; tone?: "neutral"|"mint"|"lemon"|"blush"; children:React.ReactNode }) {
  const tones:Record<string,string>={
    neutral:"bg-neutral-50 border border-neutral-200 shadow-sm",
    mint:"bg-emerald-50/60 border border-emerald-200/60 shadow-sm",
    lemon:"bg-amber-50/70 border border-amber-200/70 shadow-sm",
    blush:"bg-fuchsia-50/60 border border-fuchsia-200/60 shadow-sm",
  };
  return (
    <div className={`rounded-2xl p-5 md:p-6 ${tones[tone]}`}>
      <div className="mb-4 flex items-center gap-2">
        {icon && <span className="text-xl">{icon}</span>}
        <h3 className="text-lg md:text-xl font-semibold text-neutral-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function Label({children, required=false}:{children:React.ReactNode; required?:boolean}) {
  return <div className="text-sm font-medium text-neutral-800 mb-1.5">
    {children} {required && <span className="text-rose-600">*</span>}
  </div>;
}

const baseInput = "w-full rounded-lg bg-white text-neutral-900 placeholder-neutral-400 " +
  "border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-violet-400/70 px-3 py-2.5 transition";

export function Input(props:React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${baseInput} ${props.className??""}`} />;
}
export function Textarea(props:React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${baseInput} min-h-[92px] ${props.className??""}`} />;
}
export function Select(props:React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${baseInput} pr-9 ${props.className??""}`}>{props.children}</select>;
}
export function Chip({active, children, onClick}:{active?:boolean; children:React.ReactNode; onClick?:()=>void}) {
  return (
    <button type="button" onClick={onClick}
      className={"px-3 py-1.5 rounded-md text-sm border transition " + (active
        ? "bg-violet-600 border-violet-600 text-white"
        : "bg-white border-neutral-300 text-neutral-800 hover:bg-neutral-50")}>
      {children}
    </button>
  );
}
export function Segmented({
  value, onChange, options,
}:{value:string; onChange:(v:string)=>void; options:{value:string; label:string}[]}) {
  return (
    <div className="inline-flex rounded-lg border border-neutral-300 bg-white overflow-hidden">
      {options.map(o=>{
        const active = o.value===value;
        return <button key={o.value} type="button" onClick={()=>onChange(o.value)}
          className={"px-3.5 py-1.5 text-sm " + (active ? "bg-violet-600 text-white" : "bg-white text-neutral-800 hover:bg-neutral-50")}>
          {o.label}
        </button>;
      })}
    </div>
  );
}
