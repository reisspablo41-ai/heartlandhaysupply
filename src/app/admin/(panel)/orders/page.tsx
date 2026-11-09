import Link from "next/link";
import { AdminBody, AdminHeader, EmptyState } from "@/components/admin/page-shell";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime, formatPrice } from "@/lib/format";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_STYLES,
  PAYMENT_STATUS_LABELS,
} from "@/lib/status";
import type { Order, OrderStatus } from "@/lib/types/database";
import { cn } from "@/lib/format";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ status?: string }>;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { status } = await searchParams;
  const activeStatus = ORDER_STATUSES.includes(status as OrderStatus)
    ? (status as OrderStatus)
    : undefined;

  const supabase = await createClient();
  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (activeStatus) query = query.eq("status", activeStatus);

  const { data, error } = await query;
  const orders = (data ?? []) as Order[];

  return (
    <>
      <AdminHeader
        title="Orders"
        description="Guest orders placed on the storefront. Update the status as each load moves."
      />

      <AdminBody className="space-y-7">
        {/* Status filter */}
        <div className="flex flex-wrap gap-1.5">
          <FilterChip href="/admin/orders" active={!activeStatus}>
            All
          </FilterChip>
          {ORDER_STATUSES.map((value) => (
            <FilterChip
              key={value}
              href={`/admin/orders?status=${value}`}
              active={activeStatus === value}
            >
              {ORDER_STATUS_LABELS[value]}
            </FilterChip>
          ))}
        </div>

        {error && <p className="text-sm text-danger">Could not load orders: {error.message}</p>}

        {orders.length === 0 ? (
          <EmptyState
            title="No orders here"
            body={
              activeStatus
                ? "Nothing matches that status yet."
                : "Orders placed on the storefront will show up here."
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-200 text-sm">
              <thead>
                <tr className="border-b border-paper-line text-left">
                  <Th>Order</Th>
                  <Th>Customer</Th>
                  <Th>Destination</Th>
                  <Th>Placed</Th>
                  <Th>Status</Th>
                  <Th>Payment</Th>
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
                      <p className="max-w-40 truncate">{order.customer_name}</p>
                      <p className="max-w-40 truncate text-xs text-muted">
                        {order.customer_email}
                      </p>
                    </td>
                    <td className="px-3 py-4 text-xs text-muted-dark">
                      {[order.delivery_city, order.delivery_region].filter(Boolean).join(", ")}
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
                    <td className="px-3 py-4 text-xs">
                      {PAYMENT_STATUS_LABELS[order.payment_status]}
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
      </AdminBody>
    </>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={cn("eyebrow px-3 pb-3 font-medium text-muted", className)}>{children}</th>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "eyebrow border px-3 py-2 transition-colors",
        active
          ? "border-ink bg-ink text-paper"
          : "border-ink/15 text-muted-dark hover:border-ink hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}
