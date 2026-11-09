import Link from "next/link";
import { AdminBody, AdminHeader } from "@/components/admin/page-shell";
import { buttonClass } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime, formatPrice } from "@/lib/format";
import { ORDER_STATUS_LABELS, ORDER_STATUS_STYLES } from "@/lib/status";
import type { Order } from "@/lib/types/database";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: productCount },
    { count: activeCount },
    { count: lowStockCount },
    { count: openOrderCount },
    { count: enquiryCount },
    { data: recentOrders },
    { data: revenueRows },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("products").select("*", { count: "exact", head: true }).lte("stock_quantity", 20),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .in("status", ["pending", "confirmed", "processing", "out_for_delivery"]),
    supabase.from("enquiries").select("*", { count: "exact", head: true }).eq("is_handled", false),
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(8),
    supabase.from("orders").select("total_cents").neq("status", "cancelled"),
  ]);

  const revenueCents = (revenueRows ?? []).reduce(
    (sum, row: { total_cents: number }) => sum + row.total_cents,
    0,
  );

  const orders = (recentOrders ?? []) as Order[];

  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="Everything that needs attention, in one place."
        actions={
          <>
            <Link href="/admin/products/new" className={buttonClass("solid", "sm")}>
              New product
            </Link>
            <Link href="/admin/orders" className={buttonClass("outline", "sm")}>
              All orders
            </Link>
          </>
        }
      />

      <AdminBody className="space-y-10">
        <div className="grid gap-px bg-paper-line sm:grid-cols-2 lg:grid-cols-5">
          <Stat label="Lifetime revenue" value={formatPrice(revenueCents)} />
          <Stat label="Open orders" value={String(openOrderCount ?? 0)} href="/admin/orders" />
          <Stat
            label="Active products"
            value={`${activeCount ?? 0} / ${productCount ?? 0}`}
            href="/admin/products"
          />
          <Stat label="Low stock (≤20)" value={String(lowStockCount ?? 0)} href="/admin/products" />
          <Stat
            label="New enquiries"
            value={String(enquiryCount ?? 0)}
            href="/admin/enquiries"
          />
        </div>

        <section>
          <div className="flex items-end justify-between border-b border-paper-line pb-4">
            <h2 className="eyebrow text-muted">Recent orders</h2>
            <Link href="/admin/orders" className="text-xs underline-offset-4 hover:underline">
              View all
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="py-14 text-center text-sm text-muted">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-150 text-sm">
                <thead>
                  <tr className="border-b border-paper-line text-left">
                    <Th>Order</Th>
                    <Th>Customer</Th>
                    <Th>Placed</Th>
                    <Th>Status</Th>
                    <Th className="text-right">Total</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-paper-line">
                  {orders.map((order) => (
                    <tr key={order.id} className="transition-colors hover:bg-paper-soft">
                      <td className="px-3 py-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-medium underline-offset-4 hover:underline"
                        >
                          {order.order_number}
                        </Link>
                      </td>
                      <td className="px-3 py-4">
                        <p>{order.customer_name}</p>
                        <p className="text-xs text-muted">{order.customer_email}</p>
                      </td>
                      <td className="px-3 py-4 text-xs text-muted-dark">
                        {formatDateTime(order.created_at)}
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className={`eyebrow inline-block px-2.5 py-1.5 ${ORDER_STATUS_STYLES[order.status]}`}
                        >
                          {ORDER_STATUS_LABELS[order.status]}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-right tabular-nums">
                        {formatPrice(order.total_cents, order.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </AdminBody>
    </>
  );
}

function Stat({ label, value, href }: { label: string; value: string; href?: string }) {
  const content = (
    <div className="h-full bg-paper px-6 py-7 transition-colors hover:bg-paper-soft">
      <p className="eyebrow text-muted">{label}</p>
      <p className="display mt-3 text-3xl tabular-nums">{value}</p>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={`eyebrow px-3 pb-3 font-medium text-muted ${className ?? ""}`}>{children}</th>;
}
