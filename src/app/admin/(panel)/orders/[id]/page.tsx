import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminBody, AdminHeader } from "@/components/admin/page-shell";
import { OrderStatusForm } from "@/components/admin/order-status-form";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime, formatPrice, formatUnit } from "@/lib/format";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from "@/lib/status";
import { SITE_URL } from "@/lib/env";
import type { OrderWithItems } from "@/lib/types/database";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function AdminOrderPage({ params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("orders")
    .select("*, order_items (*)")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  const order = data as unknown as OrderWithItems;

  return (
    <>
      <AdminHeader
        title={`Order ${order.order_number}`}
        backHref="/admin/orders"
        backLabel="Orders"
        description={`Placed ${formatDateTime(order.created_at)}`}
        actions={
          <span
            className={`eyebrow self-center px-3 py-2 ${ORDER_STATUS_STYLES[order.status]}`}
          >
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        }
      />

      <AdminBody>
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          <div className="space-y-12">
            {/* Items */}
            <section>
              <h2 className="eyebrow border-b border-paper-line pb-4 text-muted">Items</h2>
              <ul className="divide-y divide-paper-line">
                {order.order_items.map((item) => (
                  <li key={item.id} className="flex items-start justify-between gap-6 py-4">
                    <div className="min-w-0">
                      {item.product_slug ? (
                        <Link
                          href={`/products/${item.product_slug}`}
                          target="_blank"
                          className="text-sm font-medium underline-offset-4 hover:underline"
                        >
                          {item.product_name}
                        </Link>
                      ) : (
                        <p className="text-sm font-medium">{item.product_name}</p>
                      )}
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

              <dl className="space-y-3 border-t border-paper-line py-5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-dark">Subtotal</dt>
                  <dd className="tabular-nums">
                    {formatPrice(order.subtotal_cents, order.currency)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-dark">Delivery</dt>
                  <dd className="tabular-nums">
                    {formatPrice(order.delivery_fee_cents, order.currency)}
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

            {/* Customer */}
            <section className="grid gap-10 sm:grid-cols-2">
              <div>
                <h2 className="eyebrow border-b border-paper-line pb-4 text-muted">
                  Customer
                </h2>
                <div className="mt-4 space-y-1.5 text-sm">
                  <p>{order.customer_name}</p>
                  {order.company && <p className="text-muted-dark">{order.company}</p>}
                  <p>
                    <a
                      href={`mailto:${order.customer_email}`}
                      className="underline-offset-4 hover:underline"
                    >
                      {order.customer_email}
                    </a>
                  </p>
                  <p>
                    <a
                      href={`tel:${order.customer_phone}`}
                      className="underline-offset-4 hover:underline"
                    >
                      {order.customer_phone}
                    </a>
                  </p>
                </div>
              </div>

              <div>
                <h2 className="eyebrow border-b border-paper-line pb-4 text-muted">
                  Delivery address
                </h2>
                <address className="mt-4 text-sm leading-relaxed not-italic">
                  {order.delivery_address}
                  <br />
                  {[order.delivery_city, order.delivery_region, order.delivery_postcode]
                    .filter(Boolean)
                    .join(", ")}
                  <br />
                  {order.delivery_country}
                </address>
                {order.delivery_notes && (
                  <p className="mt-4 bg-paper-soft p-3 text-xs text-muted-dark">
                    {order.delivery_notes}
                  </p>
                )}
              </div>
            </section>

            {/* Customer-facing link */}
            <section>
              <h2 className="eyebrow border-b border-paper-line pb-4 text-muted">
                Customer link
              </h2>
              <p className="mt-4 text-xs text-muted-dark">
                The private confirmation page for this order. Resend it if the customer
                loses their email — treat it as confidential.
              </p>
              <code className="mt-3 block overflow-x-auto bg-paper-soft px-3 py-2.5 text-xs">
                {SITE_URL}/order/{order.access_token}
              </code>
            </section>
          </div>

          {/* Status panel */}
          <aside className="h-fit border border-paper-line p-7 lg:sticky lg:top-8">
            <h2 className="eyebrow border-b border-paper-line pb-4 text-muted">
              Fulfilment
            </h2>
            <div className="mt-7">
              <OrderStatusForm order={order} />
            </div>
          </aside>
        </div>
      </AdminBody>
    </>
  );
}
