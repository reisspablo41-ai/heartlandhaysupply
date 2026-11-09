import Image from "next/image";
import Link from "next/link";
import { discountPercent, formatPrice, formatUnit } from "@/lib/format";
import type { ProductWithRelations } from "@/lib/types/database";
import { QuickAdd } from "@/components/site/quick-add";

export function ProductCard({
  product,
  priority = false,
}: {
  product: ProductWithRelations;
  priority?: boolean;
}) {
  const images = [...product.product_images].sort((a, b) => a.sort_order - b.sort_order);
  const primary = images[0];
  const secondary = images[1];
  const off = discountPercent(product.price_cents, product.compare_at_price_cents);
  const soldOut = product.stock_quantity <= 0;

  return (
    <article className="group relative">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-paper-soft">
          {primary ? (
            <Image
              src={primary.url}
              alt={primary.alt ?? product.name}
              fill
              priority={priority}
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            />
          ) : (
            <div className="grid size-full place-items-center">
              <span className="eyebrow text-muted">No image</span>
            </div>
          )}

          {secondary && (
            <Image
              src={secondary.url}
              alt=""
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
          )}

          {/* Badges */}
          <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1.5">
            {soldOut && (
              <span className="eyebrow bg-ink px-2.5 py-1.5 text-paper">Sold out</span>
            )}
            {!soldOut && off !== null && (
              <span className="eyebrow bg-ink px-2.5 py-1.5 text-paper">−{off}%</span>
            )}
            {product.is_organic && (
              <span className="eyebrow border border-ink/20 bg-paper/90 px-2.5 py-1.5">
                Organic
              </span>
            )}
          </div>

          {/* Quick add slides up on hover (desktop) */}
          {!soldOut && (
            <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100 max-lg:hidden">
              <QuickAdd product={product} />
            </div>
          )}
        </div>
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Link href={`/products/${product.slug}`}>
            <h3 className="truncate text-sm font-medium">{product.name}</h3>
          </Link>
          <p className="mt-1 truncate text-xs text-muted">
            {[product.hay_type, product.cut, product.bale_shape].filter(Boolean).join(" · ") ||
              product.category?.name ||
              "Forage"}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-sm tabular-nums">{formatPrice(product.price_cents)}</p>
          {product.compare_at_price_cents && off !== null && (
            <p className="text-xs text-muted line-through tabular-nums">
              {formatPrice(product.compare_at_price_cents)}
            </p>
          )}
          <p className="eyebrow mt-0.5 text-muted">per {formatUnit(product.unit)}</p>
        </div>
      </div>
    </article>
  );
}
