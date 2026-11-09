"use client";

import { useCart } from "@/components/cart/cart-provider";
import type { ProductWithRelations } from "@/lib/types/database";

/** The hover-reveal "Add to cart" bar on a product card. */
export function QuickAdd({ product }: { product: ProductWithRelations }) {
  const { addItem } = useCart();

  const image =
    [...product.product_images].sort((a, b) => a.sort_order - b.sort_order)[0]?.url ?? null;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        addItem(
          {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            priceCents: product.price_cents,
            unit: product.unit,
            image,
            maxQuantity: product.stock_quantity,
          },
          Math.max(1, product.min_order_quantity),
        );
      }}
      className="eyebrow h-11 w-full rounded-full bg-paper text-ink transition-colors hover:bg-ink hover:text-paper"
    >
      Add to cart
    </button>
  );
}
