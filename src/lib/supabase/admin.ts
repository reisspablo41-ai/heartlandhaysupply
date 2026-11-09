import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { supabaseServiceRoleKey, supabaseUrl } from "@/lib/env";

/**
 * Service-role client. Bypasses Row Level Security.
 *
 * Used for exactly two things:
 *   1. writing guest orders at checkout (the shopper has no session), and
 *   2. reading a guest's own order back by its secret access token.
 *
 * `server-only` makes importing this from a client component a build error.
 */
export function createAdminClient() {
  return createSupabaseClient(supabaseUrl(), supabaseServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
