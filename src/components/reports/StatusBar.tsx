"use client";
export default function StatusBar({ total, filtered }: { total: number; filtered: number }) {
  return (
    <div style={{ fontSize:12, opacity:0.8, marginTop:4 }}>
      <span>Reports: </span>
      <strong>{filtered}</strong>
      <span> / </span>
      <span>{total}</span>
    </div>
  );
}
