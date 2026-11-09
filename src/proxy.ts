import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

/**
 * Next 16's `proxy` convention (the former `middleware`).
 *
 * Refreshes the Supabase auth cookie on every request and redirects
 * anonymous visitors away from /admin.
 */
export default async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Everything except static assets and image files. The storefront passes
     * straight through; only /admin is actually gated.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
  ],
};
