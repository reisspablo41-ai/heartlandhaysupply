"use client";

import { useCart } from "@/components/cart/cart-provider";
import { BagIcon } from "@/components/ui/icons";

export function CartButton({ dark = false }: { dark?: boolean }) {
  const { itemCount, openCart, isHydrated } = useCart();

  return (
    <button
      onClick={openCart}
      aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
      className={`group relative grid size-10 place-items-center rounded-full border transition-colors ${
        dark
          ? "border-paper/25 text-paper hover:bg-paper hover:text-ink"
          : "border-ink/15 text-ink hover:bg-ink hover:text-paper"
      }`}
    >
      <BagIcon className="size-[18px]" />
      {isHydrated && itemCount > 0 && (
        <span
          className={`absolute -top-1 -right-1 grid size-5 place-items-center rounded-full text-[10px] font-medium tabular-nums ${
            dark ? "bg-paper text-ink" : "bg-ink text-paper"
          }`}
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </button>
  );
}
