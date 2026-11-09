import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HeaderSpacer } from "@/components/site/header";
import { buttonClass } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";
import { ClearCartOnMount } from "@/components/cart/clear-cart-on-mount";
import { formatDate, formatPrice, formatUnit } from "@/lib/format";
import { getOrderByToken } from "@/lib/orders";
import { ORDER_STATUS_LABELS } from "@/lib/status";

export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };
export const dynamic = "force-dynamic";

type Params = Promise<{ token: string }>;

export default async function OrderPage({ params }: { params: Params }) {
  const { token } = await params;
  const order = await getOrderByToken(token);
  if (!order) notFound();

  return (
    <>
      <ClearCartOnMount />
      <HeaderSpacer />

      <div className="gutter pt-16 pb-24">
        <div className="mx-auto max-w-3xl">
          <div className="grid size-12 place-items-center rounded-full bg-ink text-paper">
            <CheckIcon className="size-5" />
          </div>

          <h1 className="display mt-7 text-[clamp(2.2rem,5.5vw,3.8rem)]">
            Order {order.order_number} is in
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-dark">
            Thanks, {order.customer_name.split(" ")[0]}. A confirmation is on its way to{" "}
            <span className="text-ink">{order.customer_email}</span>. We’ll call{" "}
            {order.customer_phone} to confirm a freight window within one business day.
          </p>

          <p className="mt-6 rounded-sm bg-paper-soft px-4 py-3 text-xs text-muted-dark">
            Bookmark this page — it’s the only link to your order, and it works without an
            account.
          </p>

          {/* Status */}
          <dl className="mt-12 grid gap-px border border-paper-line bg-paper-line sm:grid-cols-3">
            <Stat label="Status" value={ORDER_STATUS_LABELS[order.status]} />
            <Stat label="Placed" value={formatDate(order.created_at)} />
            <Stat
              label="Payment"
              value={order.payment_status === "paid" ? "Paid" : "Invoice to follow"}
            />
          </dl>

          {/* Lines */}
          <section className="mt-12">
            <h2 className="eyebrow border-b border-paper-line pb-4 text-muted">Items</h2>
            <ul className="divide-y divide-paper-line">
              {order.order_items.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-6 py-5">
                  <div>
                    <p className="text-sm font-medium">{item.product_name}</p>
                    <p className="mt-1 text-xs text-muted">
                      {item.quantity} × {formatPrice(item.unit_price_cents, order.currency)} /{" "}
                      {formatUnit(item.unit)}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm tabular-nums">
                    {formatPrice(item.line_total_cents, order.currency)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="space-y-3 border-t border-paper-line py-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-dark">Subtotal</dt>
                <dd className="tabular-nums">
                  {formatPrice(order.subtotal_cents, order.currency)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-dark">Delivery</dt>
                <dd className="tabular-nums">
                  {order.delivery_fee_cents === 0
                    ? "Free"
                    : formatPrice(order.delivery_fee_cents, order.currency)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-paper-line pt-4">
                <dt className="eyebrow">Total</dt>
                <dd className="display text-2xl tabular-nums">
                  {formatPrice(order.total_cents, order.currency)}
                </dd>
              </div>
            </dl>
          </section>

          {/* Delivery */}
          <section className="mt-8 border-t border-paper-line pt-8">
            <h2 className="eyebrow text-muted">Delivering to</h2>
            <address className="mt-4 text-sm leading-relaxed not-italic text-muted-dark">
              {order.company && (
                <>
                  {order.company}
                  <br />
                </>
              )}
              {order.delivery_address}
              <br />
              {[order.delivery_city, order.delivery_region, order.delivery_postcode]
                .filter(Boolean)
                .join(", ")}
              <br />
              {order.delivery_country}
            </address>
            {order.delivery_notes && (
              <p className="mt-4 text-xs text-muted">Notes: {order.delivery_notes}</p>
            )}
          </section>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/products" className={buttonClass("solid", "lg")}>
              Keep shopping
            </Link>
            <Link href="/contact" className={buttonClass("outline", "lg")}>
              Question about this order
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-paper px-6 py-5">
      <dt className="eyebrow text-muted">{label}</dt>
      <dd className="mt-2 text-sm">{value}</dd>
    </div>
  );
}
