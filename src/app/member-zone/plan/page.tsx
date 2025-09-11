export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

import Client from "./plan-client";

export default function Page(){ return <Client/>; }
