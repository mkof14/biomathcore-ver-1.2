"use client";
import {
  ResponsiveContainer, AreaChart as RCAreaChart, Area, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
} from "recharts";

export default function AreaChart({ data }: { data: Array<{date:string; ai:number; voice:number; dg:number}> }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RCAreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="ai" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} name="AI" />
          <Area type="monotone" dataKey="voice" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} name="Voice" />
          <Area type="monotone" dataKey="dg" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} name="Drug–Gene" />
        </RCAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
