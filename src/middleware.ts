import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

// Note: /robots.txt and /sitemap.xml already bypass this middleware entirely
// via the matcher's `.*\..*` exclusion below. /opengraph-image does NOT —
// it's served at a clean, extension-less path — so it needs to be listed
// explicitly or link-preview crawlers get redirected to /login instead of
// the image.
const PUBLIC_PATHS = new Set([
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/contact",
  "/opengraph-image",
]);

// `/admin` covers every admin page (all nested under this prefix) and, in
// practice, every admin server action too — Next.js Server Actions are
// POSTed to the URL of the page that invoked them, which for every admin
// action is always some `/admin/*` route. `/api/admin` is included so any
// future admin-only Route Handler is covered automatically without needing
// this file to be touched again. This is a defense-in-depth layer, not the
// only one — every admin server action independently calls `requireAdmin()`
// as well, since a forged request can target a server action by ID
// regardless of URL.
function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/api/admin");
}

function forbiddenResponse(request: Request) {
  const acceptsJson = request.headers.get("accept")?.includes("application/json");
  const isApiPath = new URL(request.url).pathname.startsWith("/api/");

  if (acceptsJson || isApiPath) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>403 — Access denied</title>
<style>
  html,body{height:100%;margin:0;}
  body{
    display:flex;align-items:center;justify-content:center;
    background:#0a0a0b;color:#f5f5f4;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  }
  .card{text-align:center;padding:2.5rem;max-width:26rem;}
  .badge{
    display:inline-flex;align-items:center;justify-content:center;
    width:3.5rem;height:3.5rem;border-radius:9999px;
    background:rgba(212,175,55,0.12);color:#d4af37;margin-bottom:1.25rem;
    font-size:1.75rem;
  }
  h1{font-size:1.375rem;font-weight:600;margin:0 0 0.5rem;letter-spacing:-0.01em;}
  p{color:#a1a1aa;font-size:0.9rem;line-height:1.5;margin:0 0 1.5rem;}
  a{
    display:inline-block;padding:0.55rem 1.25rem;border-radius:0.5rem;
    background:#d4af37;color:#0a0a0b;text-decoration:none;font-weight:600;font-size:0.875rem;
  }
</style>
</head>
<body>
  <div class="card">
    <div class="badge">&#128274;</div>
    <h1>Access denied</h1>
    <p>You don't have permission to view this page.</p>
    <a href="/dashboard">Back to Dashboard</a>
  </div>
</body>
</html>`;

  return new NextResponse(html, { status: 403, headers: { "Content-Type": "text/html; charset=utf-8" } });
}

export default auth((req) => {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.has(pathname) || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const session = req.auth;

  if (!session?.user) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminPath(pathname) && session.user.role !== "ADMIN") {
    return forbiddenResponse(req);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
