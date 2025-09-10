"use client";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function Sparkline({ data, dataKey="value", height=48 }: { data: any[]; dataKey?: string; height?: number }) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" hide />
          <YAxis hide />
          <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #262626" }} />
          <Line type="monotone" dataKey={dataKey} stroke="#9CA3AF" strokeWidth={1.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
