import { DELIVERY_FEE_CENTS, FREE_DELIVERY_THRESHOLD_CENTS } from "@/lib/env";

/**
 * Flat-rate delivery, waived above a threshold. Both come from env so the
 * storefront and the checkout server action can never disagree.
 */
export function deliveryFeeFor(subtotalCents: number): number {
  if (subtotalCents <= 0) return 0;
  if (
    FREE_DELIVERY_THRESHOLD_CENTS !== null &&
    subtotalCents >= FREE_DELIVERY_THRESHOLD_CENTS
  ) {
    return 0;
  }
  return DELIVERY_FEE_CENTS;
}

export const freeDeliveryThresholdCents = FREE_DELIVERY_THRESHOLD_CENTS;
export const flatDeliveryFeeCents = DELIVERY_FEE_CENTS;
