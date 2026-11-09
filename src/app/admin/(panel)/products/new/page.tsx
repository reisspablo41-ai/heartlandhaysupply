import { AdminBody, AdminHeader } from "@/components/admin/page-shell";
import { ProductForm } from "@/components/admin/product-form";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types/database";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <>
      <AdminHeader
        title="New product"
        backHref="/admin/products"
        backLabel="Products"
        description="Add a lot to the catalogue. It goes live as soon as you save, unless you untick “Live”."
      />
      <AdminBody>
        <ProductForm categories={(data ?? []) as Category[]} />
      </AdminBody>
    </>
  );
}
