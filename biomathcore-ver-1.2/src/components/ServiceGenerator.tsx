"use client";
import React, { useState } from "react";
import { jsPDF } from "jspdf";

export default function ServiceGenerator({
  serviceName,
}: {
  serviceName: string;
}) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleGenerate = () => {
    if (!input.trim()) {
      setOutput("⚠ Please enter some data for analysis.");
      return;
    }
    setOutput(
      `Generated report for “${serviceName}” based on your input:\n\n${input}\n\n— Demo output.`,
    );
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    alert("Copied to clipboard");
  };

  const handlePrint = () => {
    if (!output) return;
    const w = window.open("", "_blank");
    w?.document.write(
      `<pre style="font-family: ui-monospace, SFMono-Regular, Menlo, monospace">${output}</pre>`,
    );
    w?.print();
  };

  const handleEmail = () => {
    if (!output) return;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      serviceName + " Report",
    )}&body=${encodeURIComponent(output)}`;
  };

  const handlePDF = () => {
    if (!output) return;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const lines = doc.splitTextToSize(output, 520);
    doc.text(lines, 40, 60);
    doc.save(`${serviceName.replace(/\s+/g, "-").toLowerCase()}-report.pdf`);
  };

  return (
    <section className="mt-8 rounded-xl border border-gray-800/60 bg-gray-900/60 p-6 shadow-xl">
      <h3 className="mb-4 text-xl font-semibold text-purple-300">
        Generate Report
      </h3>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your data or query here…"
        rows={5}
        className="mb-4 w-full resize-y rounded-lg border border-gray-700 bg-gray-800 px-3 py-3 text-gray-100 placeholder-gray-400 focus:border-purple-500 focus:outline-none"
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <button
          onClick={handleGenerate}
          className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 font-medium text-white hover:from-purple-500 hover:to-pink-500"
        >
          Generate
        </button>
        <button
          onClick={handleCopy}
          className="rounded-lg bg-gray-700 px-4 py-2 font-medium text-white hover:bg-gray-600"
        >
          Copy
        </button>
        <button
          onClick={handlePrint}
          className="rounded-lg bg-gray-700 px-4 py-2 font-medium text-white hover:bg-gray-600"
        >
          Print
        </button>
        <button
          onClick={handleEmail}
          className="rounded-lg bg-gray-700 px-4 py-2 font-medium text-white hover:bg-gray-600"
        >
          Email
        </button>
        <button
          onClick={handlePDF}
          className="rounded-lg bg-gray-700 px-4 py-2 font-medium text-white hover:bg-gray-600"
        >
          PDF
        </button>
      </div>

      {output && (
        <div className="whitespace-pre-wrap rounded-lg border border-gray-800 bg-gray-800/60 p-4 text-gray-100">
          {output}
        </div>
      )}
    </section>
  );
}
