"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useCart } from "@/components/cart/cart-provider";
import { Button, buttonClass } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { formatPrice, formatUnit } from "@/lib/format";
import { placeOrder } from "@/app/actions/checkout";
import { emptyActionState } from "@/lib/action-state";

interface Props {
  flatDeliveryFeeCents: number;
  freeDeliveryThresholdCents: number | null;
}

export function CheckoutForm({ flatDeliveryFeeCents, freeDeliveryThresholdCents }: Props) {
  const { items, subtotalCents, isHydrated } = useCart();
  const [state, formAction] = useActionState(placeOrder, emptyActionState);

  // On success placeOrder redirects to the confirmation page, which clears
  // the cart; everything below only ever renders the failure path.

  const deliveryFeeCents =
    subtotalCents <= 0
      ? 0
      : freeDeliveryThresholdCents !== null && subtotalCents >= freeDeliveryThresholdCents
        ? 0
        : flatDeliveryFeeCents;

  const totalCents = subtotalCents + deliveryFeeCents;
  const errors = state.fieldErrors ?? {};

  if (!isHydrated) return <div className="py-24" aria-busy="true" />;

  if (items.length === 0) {
    return (
      <div className="mt-10 border border-dashed border-paper-line px-8 py-28 text-center">
        <p className="display text-3xl">Your cart is empty</p>
        <p className="mx-auto mt-4 max-w-sm text-sm text-muted-dark">
          Add a few bales before checking out.
        </p>
        <Link href="/products" className={buttonClass("solid", "lg", "mt-8")}>
          Shop the catalogue
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-14 pt-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
      {/* The server re-prices these, so only ids and quantities are sent. */}
      <input
        type="hidden"
        name="items"
        value={JSON.stringify(
          items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        )}
      />

      <div className="space-y-12">
        {state.message && !state.ok && (
          <p
            role="alert"
            className="border-l-2 border-danger bg-danger/5 px-4 py-3 text-sm text-danger"
          >
            {state.message}
          </p>
        )}

        <fieldset className="space-y-7">
          <legend className="eyebrow mb-7 border-b border-paper-line pb-4 text-muted w-full">
            Contact details
          </legend>

          <div className="grid gap-7 sm:grid-cols-2">
            <Field label="Full name" htmlFor="customerName" required error={errors.customerName}>
              <Input id="customerName" name="customerName" autoComplete="name" required />
            </Field>
            <Field label="Company" htmlFor="company" error={errors.company} hint="Optional">
              <Input id="company" name="company" autoComplete="organization" />
            </Field>
            <Field label="Email" htmlFor="customerEmail" required error={errors.customerEmail}>
              <Input
                id="customerEmail"
                name="customerEmail"
                type="email"
                autoComplete="email"
                required
              />
            </Field>
            <Field label="Phone" htmlFor="customerPhone" required error={errors.customerPhone}>
              <Input id="customerPhone" name="customerPhone" type="tel" autoComplete="tel" required />
            </Field>
          </div>
        </fieldset>

        <fieldset className="space-y-7">
          <legend className="eyebrow mb-7 border-b border-paper-line pb-4 text-muted w-full">
            Delivery address
          </legend>

          <Field
            label="Street address"
            htmlFor="deliveryAddress"
            required
            error={errors.deliveryAddress}
            hint="Include the gate or barn number if the yard is hard to find."
          >
            <Input
              id="deliveryAddress"
              name="deliveryAddress"
              autoComplete="street-address"
              required
            />
          </Field>

          <div className="grid gap-7 sm:grid-cols-3">
            <Field label="City / town" htmlFor="deliveryCity" required error={errors.deliveryCity}>
              <Input
                id="deliveryCity"
                name="deliveryCity"
                autoComplete="address-level2"
                required
              />
            </Field>
            <Field label="State / region" htmlFor="deliveryRegion" error={errors.deliveryRegion}>
              <Input
                id="deliveryRegion"
                name="deliveryRegion"
                autoComplete="address-level1"
              />
            </Field>
            <Field label="Postcode" htmlFor="deliveryPostcode" error={errors.deliveryPostcode}>
              <Input
                id="deliveryPostcode"
                name="deliveryPostcode"
                autoComplete="postal-code"
              />
            </Field>
          </div>

          <Field label="Country" htmlFor="deliveryCountry" required error={errors.deliveryCountry}>
            <Input
              id="deliveryCountry"
              name="deliveryCountry"
              defaultValue="United States"
              autoComplete="country-name"
              required
            />
          </Field>

          <Field
            label="Delivery notes"
            htmlFor="deliveryNotes"
            error={errors.deliveryNotes}
            hint="Access restrictions, forklift availability, preferred days."
          >
            <Textarea id="deliveryNotes" name="deliveryNotes" />
          </Field>
        </fieldset>
      </div>

      {/* Summary */}
      <aside className="h-fit border border-paper-line p-8 lg:sticky lg:top-28">
        <h2 className="eyebrow text-muted">Your order</h2>

        <ul className="mt-7 space-y-5 border-b border-paper-line pb-7">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-4">
              <div className="relative size-16 shrink-0 overflow-hidden bg-paper-soft">
                {item.image && (
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                )}
                <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-ink text-[10px] text-paper tabular-nums">
                  {item.quantity}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{item.name}</p>
                <p className="text-xs text-muted">
                  {formatPrice(item.priceCents)} / {formatUnit(item.unit)}
                </p>
              </div>
              <p className="shrink-0 text-sm tabular-nums">
                {formatPrice(item.priceCents * item.quantity)}
              </p>
            </li>
          ))}
        </ul>

        <dl className="space-y-3 py-7 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-dark">Subtotal</dt>
            <dd className="tabular-nums">{formatPrice(subtotalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-dark">Delivery</dt>
            <dd className="tabular-nums">
              {deliveryFeeCents === 0 ? "Free" : formatPrice(deliveryFeeCents)}
            </dd>
          </div>
        </dl>

        <div className="flex items-baseline justify-between border-t border-paper-line pt-5">
          <span className="eyebrow">Total</span>
          <span className="display text-2xl tabular-nums">{formatPrice(totalCents)}</span>
        </div>

        <SubmitButton />

        <p className="mt-4 text-xs leading-relaxed text-muted">
          Placing the order reserves your lots. We’ll invoice on confirmation — nothing is
          charged here.
        </p>
      </aside>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="mt-7 w-full">
      {pending ? "Placing order…" : "Place order"}
    </Button>
  );
}
