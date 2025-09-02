"use client";
type Props = {
  value: number;
  running: boolean;
  onChangeValue: (sec: number) => void;
  onToggle: () => void;
};

export default function AutoRefreshControls({ value, running, onChangeValue, onToggle }: Props) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, margin:"8px 0" }}>
      <label style={{ fontSize:12, opacity:0.8 }}>Auto-refresh</label>
      <button
        onClick={onToggle}
        style={{ padding:"4px 10px", border:"1px solid #ddd", borderRadius:8, background:"#fff", cursor:"pointer" }}
        aria-pressed={running}
      >
        {running ? "Stop" : "Start"}
      </button>
      <label style={{ fontSize:12, opacity:0.8 }}>Interval:</label>
      <select
        value={String(value)}
        onChange={(e)=>onChangeValue(Number(e.target.value))}
        style={{ padding:"4px 8px", border:"1px solid #ddd", borderRadius:8, background:"#fff" }}
      >
        <option value="5">5s</option>
        <option value="10">10s</option>
        <option value="15">15s</option>
        <option value="30">30s</option>
        <option value="60">60s</option>
      </select>
    </div>
  );
}
