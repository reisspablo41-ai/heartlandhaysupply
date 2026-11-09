import { notFound } from "next/navigation";
import { AdminBody, AdminHeader } from "@/components/admin/page-shell";
import { ProductForm } from "@/components/admin/product-form";
import { createClient } from "@/lib/supabase/server";
import type { Category, ProductWithRelations } from "@/lib/types/database";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("*, category:categories (id, name, slug), product_images (*)")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("categories").select("*").order("sort_order", { ascending: true }),
  ]);

  if (!product) notFound();

  return (
    <>
      <AdminHeader
        title={(product as { name: string }).name}
        backHref="/admin/products"
        backLabel="Products"
      />
      <AdminBody>
        <ProductForm
          categories={(categories ?? []) as Category[]}
          product={product as unknown as ProductWithRelations}
        />
      </AdminBody>
    </>
  );
}
