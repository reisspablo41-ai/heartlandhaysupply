import Image from "next/image";
import Link from "next/link";
import { AdminBody, AdminHeader, EmptyState } from "@/components/admin/page-shell";
import { buttonClass } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, formatUnit } from "@/lib/format";
import { toggleProductActive } from "@/app/actions/admin";
import type { ProductWithRelations } from "@/lib/types/database";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories (id, name, slug), product_images (*)")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <>
        <AdminHeader title="Products" />
        <AdminBody>
          <p className="text-sm text-danger">Could not load products: {error.message}</p>
        </AdminBody>
      </>
    );
  }

  const products = (data ?? []) as unknown as ProductWithRelations[];

  return (
    <>
      <AdminHeader
        title="Products"
        description={`${products.length} ${products.length === 1 ? "product" : "products"} in the catalogue.`}
        actions={
          <Link href="/admin/products/new" className={buttonClass("solid", "sm")}>
            New product
          </Link>
        }
      />

      <AdminBody>
        {products.length === 0 ? (
          <EmptyState
            title="No products yet"
            body="Add your first lot, or run supabase/seed.sql to load the demo catalogue."
            action={
              <Link href="/admin/products/new" className={buttonClass("solid", "md")}>
                Add a product
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-200 text-sm">
              <thead>
                <tr className="border-b border-paper-line text-left">
                  <th className="eyebrow px-3 pb-3 font-medium text-muted">Product</th>
                  <th className="eyebrow px-3 pb-3 font-medium text-muted">Category</th>
                  <th className="eyebrow px-3 pb-3 font-medium text-muted">Price</th>
                  <th className="eyebrow px-3 pb-3 font-medium text-muted">Stock</th>
                  <th className="eyebrow px-3 pb-3 font-medium text-muted">State</th>
                  <th className="eyebrow px-3 pb-3 text-right font-medium text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-line">
                {products.map((product) => {
                  const image = [...product.product_images].sort(
                    (a, b) => a.sort_order - b.sort_order,
                  )[0];

                  return (
                    <tr key={product.id} className="transition-colors hover:bg-paper-soft">
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 shrink-0 overflow-hidden bg-paper-soft">
                            {image && (
                              <Image
                                src={image.url}
                                alt=""
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/admin/products/${product.id}`}
                              className="block max-w-60 truncate font-medium underline-offset-4 hover:underline"
                            >
                              {product.name}
                            </Link>
                            <p className="truncate text-xs text-muted">/{product.slug}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-4 text-muted-dark">
                        {product.category?.name ?? "—"}
                      </td>

                      <td className="px-3 py-4 tabular-nums">
                        {formatPrice(product.price_cents)}
                        <span className="text-xs text-muted"> /{formatUnit(product.unit)}</span>
                      </td>

                      <td className="px-3 py-4">
                        <span
                          className={
                            product.stock_quantity === 0
                              ? "text-danger"
                              : product.stock_quantity <= 20
                                ? "text-hay"
                                : ""
                          }
                        >
                          {product.stock_quantity}
                        </span>
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          <span
                            className={`eyebrow px-2 py-1 ${
                              product.is_active
                                ? "bg-success/10 text-success"
                                : "bg-paper-soft text-muted"
                            }`}
                          >
                            {product.is_active ? "Live" : "Hidden"}
                          </span>
                          {product.is_featured && (
                            <span className="eyebrow bg-ink px-2 py-1 text-paper">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex justify-end gap-2">
                          <form action={toggleProductActive}>
                            <input type="hidden" name="id" value={product.id} />
                            <input
                              type="hidden"
                              name="next"
                              value={String(!product.is_active)}
                            />
                            <button
                              type="submit"
                              className="eyebrow border border-ink/15 px-3 py-2 transition-colors hover:border-ink"
                            >
                              {product.is_active ? "Hide" : "Publish"}
                            </button>
                          </form>
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="eyebrow border border-ink/15 px-3 py-2 transition-colors hover:border-ink"
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </AdminBody>
    </>
  );
}
