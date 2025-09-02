"use client";
import SearchBar from "@/components/reports/SearchBar";
import ResultsTable from "@/components/reports/ResultsTable";
import StatusBar from "@/components/reports/StatusBar";
import AutoRefreshControls from "@/components/reports/AutoRefreshControls";
import { useReportsSearch } from "@/hooks/useReportsSearch";
import { usePoll } from "@/hooks/usePoll";
import { useState } from "react";

export default function ReportsPanel() {
  const {
    q, setQ, from, setFrom, to, setTo,
    rows, loading, error, refresh
  } = useReportsSearch("", { limit: 50, sort: "createdAt:desc", autoRefreshSec: 15 });

  // Local control for polling
  const [autoSec, setAutoSec] = useState<number>(15);
  const [running, setRunning] = useState<boolean>(true);

  usePoll(() => { refresh(); }, autoSec * 1000, running);

  function doSearch(qq: string, ff: string, tt: string) {
    setQ(qq); setFrom(ff); setTo(tt);
    refresh();
  }

  const total = rows?.length ?? 0;
  const filtered = rows?.length ?? 0;

  return (
    <div>
      <AutoRefreshControls
        value={autoSec}
        running={running}
        onChangeValue={(sec)=>setAutoSec(sec)}
        onToggle={()=>setRunning(x=>!x)}
      />

      <SearchBar onSearch={doSearch} />
      <StatusBar total={total} filtered={filtered} />
      {loading ? <div style={{fontSize:12,opacity:0.7, marginTop:4}}>Loading…</div> : null}
      {error ? <div style={{fontSize:12,color:"#b00", marginTop:4}}>{String(error)}</div> : null}
      <ResultsTable rows={rows||[]} onChange={refresh} />
    </div>
  );
}
