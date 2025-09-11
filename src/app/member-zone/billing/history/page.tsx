'use client';

import { useEffect, useState } from "react";

type Row = {
  id: string;
  amountCents: number;
  currency: string;
  status: string;
  createdAt: string;
  hostedInvoiceUrl?: string;
  invoicePdf?: string;
};

export default function BillingHistoryPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/billing/invoices");
        const j = await r.json();
        setRows(Array.isArray(j?.data) ? j.data : []);
      } catch {}
      setLoading(false);
    })();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Billing History</h1>
      {loading && <div>Loading…</div>}
      {!loading && rows.length === 0 && <div>No invoices</div>}
      {rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2 border">Date</th>
                <th className="text-left p-2 border">Amount</th>
                <th className="text-left p-2 border">Status</th>
                <th className="text-left p-2 border">Links</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="p-2 border">
                    {(r.amountCents/100).toLocaleString(undefined, { style: "currency", currency: r.currency })}
                  </td>
                  <td className="p-2 border">{r.status}</td>
                  <td className="p-2 border">
                    <div className="flex gap-3">
                      {r.hostedInvoiceUrl && <a className="underline" href={r.hostedInvoiceUrl}>View</a>}
                      {r.invoicePdf && <a className="underline" href={r.invoicePdf}>PDF</a>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
