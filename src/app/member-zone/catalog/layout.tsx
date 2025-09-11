export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

import type { ReactNode } from 'react';
import ClearSelectionsClient from './ClearSelectionsClient';

export default function CatalogLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ClearSelectionsClient />
      <div className="pt-2">{children}</div>
    </>
  );
}
