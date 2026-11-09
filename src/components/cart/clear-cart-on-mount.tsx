"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart/cart-provider";

/** Empties the cart once the shopper lands on their confirmation page. */
export function ClearCartOnMount() {
  const { clearCart, isHydrated } = useCart();

  useEffect(() => {
    if (isHydrated) clearCart();
  }, [isHydrated, clearCart]);

  return null;
}
