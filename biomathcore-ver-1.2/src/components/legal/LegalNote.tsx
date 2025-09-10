export default function LegalNote({ children }: { children?: React.ReactNode }) {
  return (
    <div className="mt-12 pt-4 border-t text-sm text-gray-800 dark:text-gray-200">
      {children ?? "This is a demo page. The full legal text will be provided in the production version of the site."}
    </div>
  );
}
