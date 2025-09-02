"use client";
import { useState } from "react";

export default function SearchBar({ onSearch }: { onSearch: (q: string, from: string, to: string) => void }) {
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  return (
    <div style={{ display:"flex", gap:8, alignItems:"center", margin: "8px 0" }}>
      <input placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)}
             style={{ padding:"6px 8px", border:"1px solid #ddd", borderRadius:8, minWidth: 220 }} />
      <input type="date" value={from} onChange={e=>setFrom(e.target.value)} style={{ padding:"6px 8px", border:"1px solid #ddd", borderRadius:8 }} />
      <input type="date" value={to} onChange={e=>setTo(e.target.value)} style={{ padding:"6px 8px", border:"1px solid #ddd", borderRadius:8 }} />
      <button onClick={()=>onSearch(q, from, to)} style={{ padding:"6px 10px", border:"1px solid #ddd", borderRadius:8, cursor:"pointer" }}>
        Search
      </button>
    </div>
  );
}
