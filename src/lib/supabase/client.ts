"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseAnonKey, supabaseUrl } from "@/lib/env";

/**
 * Browser client. Used by the admin login form and by any client component
 * that needs the current session. The storefront itself never needs it —
 * all catalogue reads happen on the server.
 */
export function createClient() {
  return createBrowserClient(supabaseUrl(), supabaseAnonKey());
}
