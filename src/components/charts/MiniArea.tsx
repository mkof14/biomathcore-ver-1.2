"use client";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function MiniArea({ data, dataKey }: { data: any[]; dataKey: string }) {
  return (
    <div className="h-28 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`g-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.9}/>
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="day" hide />
          <YAxis hide />
          <Tooltip />
          <Area type="monotone" dataKey={dataKey} stroke="#60a5fa" fillOpacity={1} fill={`url(#g-${dataKey})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
