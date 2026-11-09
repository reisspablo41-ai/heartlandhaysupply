import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HeaderSpacer } from "@/components/site/header";
import { ProductGallery } from "@/components/site/product-gallery";
import { ProductCard } from "@/components/site/product-card";
import { AddToCart } from "@/components/cart/add-to-cart";
import { SectionHeading } from "@/components/site/section";
import { discountPercent, formatPrice, formatUnit } from "@/lib/format";
import { getProductBySlug, getProducts } from "@/lib/queries";
import { freeDeliveryThresholdCents } from "@/lib/shipping";

// Storefront pages render per-request: the Supabase server client reads
// cookies, which opts the route into dynamic rendering. Catalogue changes
// made in the admin panel are therefore visible immediately.

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  const image = [...product.product_images].sort((a, b) => a.sort_order - b.sort_order)[0];

  return {
    title: product.name,
    description: product.summary ?? product.description?.slice(0, 160) ?? undefined,
    openGraph: image ? { images: [{ url: image.url }] } : undefined,
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = (
    await getProducts({
      categorySlug: product.category?.slug,
      limit: 5,
    })
  )
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const off = discountPercent(product.price_cents, product.compare_at_price_cents);
  const inStock = product.stock_quantity > 0;
  const lowStock = inStock && product.stock_quantity <= 20;

  const specs: Array<[string, string]> = [
    product.hay_type ? ["Forage", product.hay_type] : null,
    product.cut ? ["Cutting", product.cut] : null,
    product.bale_shape ? ["Bale", product.bale_shape] : null,
    product.bale_weight_kg ? ["Weight", `${product.bale_weight_kg} kg`] : null,
    product.protein_percent ? ["Crude protein", `${product.protein_percent}%`] : null,
    product.moisture_percent ? ["Moisture", `${product.moisture_percent}%`] : null,
    product.harvest_year ? ["Harvest", String(product.harvest_year)] : null,
    product.origin ? ["Origin", product.origin] : null,
    product.sku ? ["SKU", product.sku] : null,
  ].filter((row): row is [string, string] => row !== null);

  return (
    <>
      <HeaderSpacer />

      <div className="gutter pt-8 pb-24">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="eyebrow flex items-center gap-2 text-muted">
          <Link href="/" className="transition-colors hover:text-ink">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="transition-colors hover:text-ink">
            Shop
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link
                href={`/categories/${product.category.slug}`}
                className="transition-colors hover:text-ink"
              >
                {product.category.name}
              </Link>
            </>
          )}
        </nav>

        <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.product_images} alt={product.name} />

          {/* Buy column */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="flex flex-wrap items-center gap-2">
              {product.is_organic && (
                <span className="eyebrow border border-ink/20 px-2.5 py-1.5">Organic</span>
              )}
              {off !== null && (
                <span className="eyebrow bg-ink px-2.5 py-1.5 text-paper">−{off}% off</span>
              )}
              {product.category && (
                <Link
                  href={`/categories/${product.category.slug}`}
                  className="eyebrow text-muted transition-colors hover:text-ink"
                >
                  {product.category.name}
                </Link>
              )}
            </div>

            <h1 className="display mt-4 text-[clamp(2.1rem,4.5vw,3.4rem)] text-balance">
              {product.name}
            </h1>

            {product.summary && (
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-dark">
                {product.summary}
              </p>
            )}

            <div className="mt-7 flex items-baseline gap-3">
              <span className="display text-3xl tabular-nums">
                {formatPrice(product.price_cents)}
              </span>
              {product.compare_at_price_cents && off !== null && (
                <span className="text-sm text-muted line-through tabular-nums">
                  {formatPrice(product.compare_at_price_cents)}
                </span>
              )}
              <span className="eyebrow text-muted">per {formatUnit(product.unit)}</span>
            </div>

            {/* Stock */}
            <p className="mt-3 flex items-center gap-2 text-xs">
              <span
                aria-hidden
                className={`size-1.5 rounded-full ${
                  inStock ? (lowStock ? "bg-hay" : "bg-success") : "bg-danger"
                }`}
              />
              {inStock
                ? lowStock
                  ? `Only ${product.stock_quantity} left in the barn`
                  : `${product.stock_quantity} in stock`
                : "Sold out — back after the next cutting"}
            </p>

            <div className="mt-8">
              <AddToCart product={product} fullWidth />
            </div>

            {product.min_order_quantity > 1 && (
              <p className="mt-3 text-xs text-muted">
                Minimum order: {product.min_order_quantity} {formatUnit(product.unit)}s.
              </p>
            )}

            {freeDeliveryThresholdCents !== null && (
              <p className="mt-3 text-xs text-muted">
                Free freight on orders over {formatPrice(freeDeliveryThresholdCents)}.
              </p>
            )}

            {/* Specs */}
            {specs.length > 0 && (
              <dl className="mt-10 divide-y divide-paper-line border-y border-paper-line">
                {specs.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-6 py-3.5">
                    <dt className="eyebrow text-muted">{label}</dt>
                    <dd className="text-sm">{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {product.description && (
              <div className="mt-10">
                <h2 className="eyebrow text-muted">Description</h2>
                <p className="mt-4 text-sm leading-relaxed whitespace-pre-line text-muted-dark">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-28">
            <SectionHeading
              eyebrow="You may also need"
              title="From the same barn"
              href={
                product.category ? `/categories/${product.category.slug}` : "/products"
              }
            />
            <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
