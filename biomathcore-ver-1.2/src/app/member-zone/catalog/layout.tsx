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
