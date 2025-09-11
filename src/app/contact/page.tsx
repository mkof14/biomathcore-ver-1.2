export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

export default function Contact() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 prose prose-neutral dark:prose-invert">
      <h1>Contact</h1>
      <p><strong>Last updated:</strong> 2025-09-06</p>
      <h2>General</h2>
      <p><a href="mailto:hello@biomathcore.com">hello@biomathcore.com</a></p>
      <h2>Support</h2>
      <p><a href="mailto:support@biomathcore.com">support@biomathcore.com</a></p>
      <h2>Privacy</h2>
      <p><a href="mailto:privacy@biomathcore.com">privacy@biomathcore.com</a></p>
      <h2>Security</h2>
      <p><a href="mailto:security@biomathcore.com">security@biomathcore.com</a></p>
      <h2>Partnerships</h2>
      <p><a href="mailto:partners@biomathcore.com">partners@biomathcore.com</a></p>
    </main>
  );
}
