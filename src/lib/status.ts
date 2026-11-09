import type { OrderStatus, PaymentStatus } from "@/lib/types/database";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUSES = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  unpaid: "Unpaid",
  paid: "Paid",
  refunded: "Refunded",
};

export const PAYMENT_STATUSES = Object.keys(PAYMENT_STATUS_LABELS) as PaymentStatus[];

/** Tailwind classes for the status chip in the admin tables. */
export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-paper-soft text-muted-dark",
  confirmed: "bg-ink text-paper",
  processing: "bg-hay-soft text-ink",
  out_for_delivery: "bg-hay text-ink",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-danger/10 text-danger",
};
