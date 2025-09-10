"use client";
import { useState } from "react";

export default function ReportGenerator({ onGenerate }) {
  const [report, setReport] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = () => {
    if (!isGenerating) {
      setIsGenerating(true);
      setTimeout(() => {
        setReport(
          "Отчет: Ваши метрики в норме. Рекомендуем консультацию с врачом.",
        );
        setIsGenerating(false);
        if (onGenerate) onGenerate();
      }, 1500);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h2 className="corporate-heading text-2xl mb-4">Generate Report</h2>
      <button
        onClick={generateReport}
        className="bg-green-500 text-white p-2 rounded mb-4"
        disabled={isGenerating}
      >
        {isGenerating ? "Генерация..." : "Сгенерировать отчет"}
      </button>
      {report && (
        <div className="bg-gray-800 p-4 rounded-lg text-white">
          <h3 className="text-xl font-bold">Ваш отчет</h3>
          <p>{report}</p>
        </div>
      )}
    </div>
  );
}
