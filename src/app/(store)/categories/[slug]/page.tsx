import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { HeaderSpacer } from "@/components/site/header";
import { ProductCard } from "@/components/site/product-card";
import { ProductFilters } from "@/components/site/product-filters";
import {
  getCategories,
  getCategoryBySlug,
  getProducts,
  type ProductQuery,
} from "@/lib/queries";

// Storefront pages render per-request: the Supabase server client reads
// cookies, which opts the route into dynamic rendering. Catalogue changes
// made in the admin panel are therefore visible immediately.

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ sort?: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };

  return {
    title: category.name,
    description: category.description ?? undefined,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const { sort } = await searchParams;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [products, categories] = await Promise.all([
    getProducts({ categorySlug: slug, sort: sort as ProductQuery["sort"] }),
    getCategories(),
  ]);

  return (
    <>
      <HeaderSpacer />

      {/* Dark banner, same language as the home hero but half height */}
      <section className="relative isolate flex h-[46vh] min-h-[340px] items-end overflow-hidden bg-ink text-paper">
        {category.image_url && (
          <Image
            src={category.image_url}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-55"
          />
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/60"
        />
        <div className="gutter relative w-full pb-12">
          <p className="eyebrow text-paper/55">Forage type</p>
          <h1 className="display mt-3 text-[clamp(2.4rem,6vw,4.5rem)]">{category.name}</h1>
          {category.description && (
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-paper/70">
              {category.description}
            </p>
          )}
        </div>
      </section>

      <div className="gutter pb-24">
        <Suspense fallback={<div className="h-20" />}>
          <ProductFilters
            categories={categories}
            activeCategory={slug}
            resultCount={products.length}
          />
        </Suspense>

        {products.length === 0 ? (
          <div className="border border-dashed border-paper-line px-8 py-24 text-center">
            <p className="display text-2xl">Nothing in this category yet</p>
            <p className="mx-auto mt-3 max-w-sm text-sm text-muted-dark">
              Check back after the next cutting, or browse another forage type.
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
