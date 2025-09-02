"use client";
import { useState, useEffect } from "react";

export default function AnalyticsDashboard() {
  const [usageData, setUsageData] = useState([]);

  useEffect(() => {
   
    setUsageData([
      { service: "Risk Insight", count: 10 },
      { service: "Mindfulness Guide", count: 15 },
      { service: "VO₂-Max Assessment", count: 8 },
    ]);
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h2 className="corporate-heading text-2xl mb-4">Analytics Dashboard</h2>
      <div className="bg-gray-800 p-4 rounded-lg text-white">
        <h3 className="text-xl font-bold mb-2">Service Usage Chart</h3>
        <chartjs
          type="bar"
          data={{
            labels: usageData.map((d) => d.service),
            datasets: [
              {
                label: "Usage Count",
                data: usageData.map((d) => d.count),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                borderColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                borderWidth: 1,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } },
          }}
          style={{ height: "300px" }}
        />
      </div>
    </div>
  );
}
