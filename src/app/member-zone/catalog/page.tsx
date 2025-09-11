export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

import CatalogClient from "@/components/catalog/CatalogClient";

export default function Page() {
  return <CatalogClient />;
}
