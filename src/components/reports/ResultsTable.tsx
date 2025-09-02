"use client";
import DuplicateButton from "./DuplicateButton";
import ExportButtons from "./ExportButtons";

export default function ResultsTable({ rows, onChange }: { rows: any[]; onChange?: ()=>void }) {
  return (
    <table style={{ width:"100%", borderCollapse:"collapse", marginTop:8 }}>
      <thead>
        <tr>
          <th style={{ textAlign:"left", borderBottom:"1px solid #eee", padding:"6px" }}>Title</th>
          <th style={{ textAlign:"left", borderBottom:"1px solid #eee", padding:"6px" }}>Created</th>
          <th style={{ textAlign:"left", borderBottom:"1px solid #eee", padding:"6px" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r.id}>
            <td style={{ padding:"6px", borderBottom:"1px solid #fafafa" }}>{r.title || r.id}</td>
            <td style={{ padding:"6px", borderBottom:"1px solid #fafafa" }}>{r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}</td>
            <td style={{ padding:"6px", borderBottom:"1px solid #fafafa", display:"flex", gap:8 }}>
              <DuplicateButton id={r.id} onDone={onChange} />
              <ExportButtons id={r.id} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
