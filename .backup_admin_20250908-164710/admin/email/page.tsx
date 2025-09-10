export default function EmailPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Email / Magic Link</h2>
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-sm opacity-90">
        <div>Required SMTP variables:</div>
        <ul className="list-disc pl-5">
          <li>EMAIL_SERVER_HOST</li>
          <li>EMAIL_SERVER_PORT</li>
          <li>EMAIL_SERVER_USER</li>
          <li>EMAIL_SERVER_PASSWORD</li>
        </ul>
        <div className="text-xs opacity-60">Add via Secrets → Export .env → restart dev server.</div>
      </div>
    </div>
  );
}
