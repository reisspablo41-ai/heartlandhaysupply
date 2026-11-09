import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AdminUser } from "@/lib/types/database";

/**
 * The admin identity for the current request, or null.
 *
 * Membership of public.admin_users is what grants access — simply having a
 * Supabase Auth account is not enough, and the same table backs every RLS
 * policy, so the UI check and the database check can't drift apart.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("admin_users")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return (data as AdminUser) ?? null;
}

/** Use at the top of every admin page / action. Redirects if not an admin. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login?error=unauthorised");
  return admin;
}
