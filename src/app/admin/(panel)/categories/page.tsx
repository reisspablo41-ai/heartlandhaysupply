import { AdminBody, AdminHeader } from "@/components/admin/page-shell";
import { CategoryManager } from "@/components/admin/category-manager";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types/database";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <>
      <AdminHeader
        title="Categories"
        description="Forage types shown in the nav, on the homepage tiles and as storefront filters."
      />
      <AdminBody>
        <CategoryManager categories={(data ?? []) as Category[]} />
      </AdminBody>
    </>
  );
}
