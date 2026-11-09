import type { Metadata } from "next";
import { Suspense } from "react";
import { HeaderSpacer } from "@/components/site/header";
import { ProductCard } from "@/components/site/product-card";
import { ProductFilters } from "@/components/site/product-filters";
import { getCategories, getProducts, type ProductQuery } from "@/lib/queries";

export const metadata: Metadata = {
  title: "All hay & forage",
  description:
    "Every lot in the barn — timothy, orchard grass, bermuda and straw.",
};

// Storefront pages render per-request: the Supabase server client reads
// cookies, which opts the route into dynamic rendering. Catalogue changes
// made in the admin panel are therefore visible immediately.

type SearchParams = Promise<{ q?: string; sort?: string }>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, sort } = await searchParams;

  const [products, categories] = await Promise.all([
    getProducts({ search: q, sort: sort as ProductQuery["sort"] }),
    getCategories(),
  ]);

  return (
    <>
      <HeaderSpacer />

      <div className="gutter pt-14 pb-24">
        <header className="max-w-3xl pb-10">
          <p className="eyebrow text-muted">The catalogue</p>
          <h1 className="display mt-4 text-[clamp(2.4rem,6vw,4.5rem)]">
            {q ? `Results for “${q}”` : "All hay & forage"}
          </h1>
          {!q && (
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-dark">
              Protein, moisture, cut and harvest year are listed on every lot. Filter by
              forage type, or sort by price if you’re feeding at volume.
            </p>
          )}
        </header>

        <Suspense fallback={<div className="h-20" />}>
          <ProductFilters categories={categories} resultCount={products.length} />
        </Suspense>

        {products.length === 0 ? (
          <div className="border border-dashed border-paper-line px-8 py-24 text-center">
            <p className="display text-2xl">Nothing matched</p>
            <p className="mx-auto mt-3 max-w-sm text-sm text-muted-dark">
              Try a broader search, or browse a forage type above.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-14 md:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
