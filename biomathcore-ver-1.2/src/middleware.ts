import { NextResponse, NextRequest } from "next/server";

export const config = { matcher: ["/internal/:path*", "/admin/:path*"] };

export function middleware(req: NextRequest) {
  const isProd = process.env.NODE_ENV === "production";
  const path = req.nextUrl.pathname;

  // dev: allow through
  if (!isProd) return NextResponse.next();

  // choose creds by area
  const isAdmin = path.startsWith("/admin");
  const user = isAdmin
    ? (process.env.ADMIN_BASIC_USER || "")
    : (process.env.INTERNAL_BASIC_USER || "");
  const pass = isAdmin
    ? (process.env.ADMIN_BASIC_PASS || "")
    : (process.env.INTERNAL_BASIC_PASS || "");

  if (!user || !pass) {
    return new NextResponse("Restricted area disabled (missing credentials).", { status: 503 });
  }

  const auth = req.headers.get("authorization") || "";
  const expected = "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");
  if (auth === expected) return NextResponse.next();

  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": `Basic realm="${isAdmin ? "Admin" : "Internal"}"` },
  });
}
