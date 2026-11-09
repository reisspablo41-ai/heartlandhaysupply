import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { OrderWithItems } from "@/lib/types/database";

/**
 * Look an order up by the secret token issued at checkout. This is the only
 * way a guest can see their own order — the token is unguessable (128 bits)
 * and is never listed anywhere public.
 */
export async function getOrderByToken(token: string): Promise<OrderWithItems | null> {
  if (!/^[a-f0-9]{32}$/i.test(token)) return null;

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items (*)")
    .eq("access_token", token)
    .maybeSingle();

  if (error) throw new Error(`Failed to load order: ${error.message}`);
  return (data as unknown as OrderWithItems) ?? null;
}
