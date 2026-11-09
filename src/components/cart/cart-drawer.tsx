"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
import { CloseIcon, TrashIcon } from "@/components/ui/icons";
import { buttonClass } from "@/components/ui/button";
import { formatPrice, formatUnit } from "@/lib/format";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotalCents, itemCount } =
    useCart();

  return (
    <>
      {/* Scrim */}
      <div
        aria-hidden
        onClick={closeCart}
        className={`fixed inset-0 z-60 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed top-0 right-0 z-70 flex h-dvh w-full max-w-[460px] flex-col bg-paper transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-paper-line px-6 py-5">
          <h2 className="eyebrow">
            Cart{itemCount > 0 && <span className="ml-2 text-muted">({itemCount})</span>}
          </h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="grid size-9 place-items-center rounded-full transition-colors hover:bg-paper-soft"
          >
            <CloseIcon className="size-4" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <p className="display text-2xl">Your cart is empty</p>
            <p className="max-w-xs text-sm text-muted-dark">
              Browse the barn — timothy, orchard grass, straw and more, baled this season.
            </p>
            <Link href="/products" onClick={closeCart} className={buttonClass("outline", "md")}>
              Shop the catalogue
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-paper-line overflow-y-auto px-6">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4 py-5">
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeCart}
                    className="relative size-24 shrink-0 overflow-hidden bg-paper-soft"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : null}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeCart}
                          className="block truncate text-sm font-medium hover:underline"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-muted">
                          {formatPrice(item.priceCents)} / {formatUnit(item.unit)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        aria-label={`Remove ${item.name}`}
                        className="shrink-0 text-muted transition-colors hover:text-danger"
                      >
                        <TrashIcon className="size-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <QuantityStepper
                        compact
                        value={item.quantity}
                        max={item.maxQuantity}
                        onChange={(q) => updateQuantity(item.productId, q)}
                      />
                      <span className="text-sm tabular-nums">
                        {formatPrice(item.priceCents * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="space-y-4 border-t border-paper-line px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="eyebrow text-muted-dark">Subtotal</span>
                <span className="display text-2xl tabular-nums">
                  {formatPrice(subtotalCents)}
                </span>
              </div>
              <p className="text-xs text-muted">
                Delivery is calculated at checkout. Taxes where applicable.
              </p>
              <div className="grid gap-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className={buttonClass("solid", "lg", "w-full")}
                >
                  Checkout
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className={buttonClass("ghost", "md", "w-full")}
                >
                  View full cart
                </Link>
              </div>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
