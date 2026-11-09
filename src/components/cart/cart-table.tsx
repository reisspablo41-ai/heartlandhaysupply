"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
import { buttonClass } from "@/components/ui/button";
import { TrashIcon } from "@/components/ui/icons";
import { formatPrice, formatUnit } from "@/lib/format";

export function CartTable() {
  const { items, updateQuantity, removeItem, subtotalCents, clearCart, isHydrated } =
    useCart();

  if (!isHydrated) {
    return <div className="py-24" aria-busy="true" />;
  }

  if (items.length === 0) {
    return (
      <div className="border border-dashed border-paper-line px-8 py-28 text-center">
        <p className="display text-3xl">Nothing in the cart</p>
        <p className="mx-auto mt-4 max-w-sm text-sm text-muted-dark">
          Timothy, orchard grass, bermuda and straw — all baled this season and ready to
          ship.
        </p>
        <Link href="/products" className={buttonClass("solid", "lg", "mt-8")}>
          Shop the catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-14 pt-10 lg:grid-cols-[1.7fr_1fr] lg:gap-20">
      {/* Lines */}
      <div>
        <ul className="divide-y divide-paper-line border-b border-paper-line">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-5 py-7">
              <Link
                href={`/products/${item.slug}`}
                className="relative size-28 shrink-0 overflow-hidden bg-paper-soft sm:size-36"
              >
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="144px"
                    className="object-cover"
                  />
                )}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
                <div className="flex items-start justify-between gap-5">
                  <div className="min-w-0">
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-base font-medium hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-xs text-muted">
                      {formatPrice(item.priceCents)} / {formatUnit(item.unit)}
                    </p>
                  </div>
                  <p className="shrink-0 text-base tabular-nums">
                    {formatPrice(item.priceCents * item.quantity)}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <QuantityStepper
                    value={item.quantity}
                    max={item.maxQuantity}
                    onChange={(q) => updateQuantity(item.productId, q)}
                  />
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-danger"
                  >
                    <TrashIcon className="size-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between pt-6">
          <Link href="/products" className="text-sm underline-offset-4 hover:underline">
            ← Continue shopping
          </Link>
          <button
            onClick={clearCart}
            className="text-xs text-muted transition-colors hover:text-danger"
          >
            Clear cart
          </button>
        </div>
      </div>

      {/* Summary */}
      <aside className="h-fit border border-paper-line p-8 lg:sticky lg:top-28">
        <h2 className="eyebrow text-muted">Order summary</h2>

        <dl className="mt-7 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-dark">Subtotal</dt>
            <dd className="tabular-nums">{formatPrice(subtotalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-dark">Delivery</dt>
            <dd className="text-muted">Calculated at checkout</dd>
          </div>
        </dl>

        <div className="mt-7 flex items-baseline justify-between border-t border-paper-line pt-5">
          <span className="eyebrow">Total</span>
          <span className="display text-2xl tabular-nums">{formatPrice(subtotalCents)}</span>
        </div>

        <Link href="/checkout" className={buttonClass("solid", "lg", "mt-7 w-full")}>
          Proceed to checkout
        </Link>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          No account needed. We’ll email a confirmation and a tracking link as soon as the
          order is placed.
        </p>
      </aside>
    </div>
  );
}
