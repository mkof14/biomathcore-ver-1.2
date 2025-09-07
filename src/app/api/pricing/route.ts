import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";

const CORE_TITLES = [
  "Critical Health",
  "Longevity & Anti-Aging",
  "General Sexual Longevity & Anti-Aging",
  "Diagnostics & Labs",
  "Nutrition & Diet & Lifestyle",
];

const PRICE_TABLE: Record<string,{mo:number;yr:number}> = {
  "Critical Health": { mo: 0,  yr: 0 },
  "Longevity & Anti-Aging": { mo: 0,  yr: 0 },
  "General Sexual Longevity & Anti-Aging": { mo: 0,  yr: 0 },
  "Diagnostics & Labs": { mo: 0,  yr: 0 },
  "Nutrition & Diet & Lifestyle": { mo: 0,  yr: 0 },
};

const DEFAULT_ADDON_MO = 7;
const DEFAULT_ADDON_YR = 70;
const BASE_MO = 19;
const BASE_YR = 190;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cats = await prisma.category.findMany({
    orderBy: { title: "asc" },
    select: { id: true, title: true },
  });

  const coreIds = new Set(cats.filter(c => CORE_TITLES.includes(c.title)).map(c => c.id));

  const selections = await prisma.serviceSelection.findMany({
    where: { userId: user.id },
    select: { categoryId: true },
  });
  const selectedIds = new Set(selections.map(s => s.categoryId));

  const items = cats.map(c => {
    const included = coreIds.has(c.id);
    const selected = selectedIds.has(c.id);
    const price = PRICE_TABLE[c.title] ?? { mo: DEFAULT_ADDON_MO, yr: DEFAULT_ADDON_YR };
    return {
      id: c.id,
      title: c.title,
      included,
      selected,
      priceMonthly: price.mo,
      priceYearly: price.yr,
    };
  });

  const addOnMonthly = items
    .filter(i => i.selected && !i.included)
    .reduce((s, i) => s + i.priceMonthly, 0);
  const addOnYearly = items
    .filter(i => i.selected && !i.included)
    .reduce((s, i) => s + i.priceYearly, 0);

  const totalMonthly = BASE_MO + addOnMonthly;
  const totalYearly = BASE_YR + addOnYearly;

  // IMPORTANT: keep both "items" and legacy "categories"
  return NextResponse.json({
    baseMonthly: BASE_MO,
    baseYearly: BASE_YR,
    addOnMonthly,
    addOnYearly,
    totalMonthly,
    totalYearly,
    items,
    categories: items, // legacy alias for UI expecting pricing.categories
  });
}
