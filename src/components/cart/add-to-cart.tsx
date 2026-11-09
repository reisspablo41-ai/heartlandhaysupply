"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
import { useCart } from "@/components/cart/cart-provider";
import type { ProductWithRelations } from "@/lib/types/database";

interface Props {
  product: ProductWithRelations;
  showQuantity?: boolean;
  fullWidth?: boolean;
}

export function AddToCart({ product, showQuantity = true, fullWidth }: Props) {
  const { addItem } = useCart();
  const min = Math.max(1, product.min_order_quantity);
  const [quantity, setQuantity] = useState(min);

  const soldOut = product.stock_quantity <= 0;
  const image =
    [...product.product_images].sort((a, b) => a.sort_order - b.sort_order)[0]?.url ?? null;

  function handleAdd() {
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
      quantity,
    );
  }

  if (soldOut) {
    return (
      <Button disabled size="lg" className={fullWidth ? "w-full" : undefined}>
        Sold out
      </Button>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 ${fullWidth ? "w-full" : ""}`}>
      {showQuantity && (
        <QuantityStepper
          value={quantity}
          min={min}
          max={product.stock_quantity}
          onChange={setQuantity}
        />
      )}
      <Button
        onClick={handleAdd}
        size="lg"
        className={fullWidth ? "flex-1 min-w-48" : undefined}
      >
        Add to cart
      </Button>
    </div>
  );
}
