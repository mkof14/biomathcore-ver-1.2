export default function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center bg-neutral-950 text-neutral-100">
      <div className="text-center space-y-3">
        <div className="text-6xl">🔎</div>
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="text-neutral-400 text-sm">The page you’re looking for doesn’t exist or was moved.</p>
        <div className="mt-2">
          <a href="/" className="border rounded px-4 py-2 hover:bg-neutral-900">Back to home</a>
        </div>
      </div>
    </div>
  );
}
