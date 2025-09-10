export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Payments (Stripe)</h2>
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-sm space-y-2">
        <div>Required:</div>
        <ul className="list-disc pl-5">
          <li>STRIPE_SECRET_KEY</li>
          <li>STRIPE_WEBHOOK_SECRET</li>
        </ul>
        <div className="text-xs opacity-60">Set in Secrets, export .env, configure webhook URL in Stripe dashboard.</div>
      </div>
    </div>
  );
}
