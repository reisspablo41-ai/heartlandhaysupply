import type { Metadata } from "next";
import { HeaderSpacer } from "@/components/site/header";
import { CheckoutForm } from "@/components/cart/checkout-form";
import { flatDeliveryFeeCents, freeDeliveryThresholdCents } from "@/lib/shipping";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <>
      <HeaderSpacer />
      <div className="gutter pt-14 pb-24">
        <header className="border-b border-paper-line pb-8">
          <p className="eyebrow text-muted">Step 2 of 2</p>
          <h1 className="display mt-4 text-[clamp(2.4rem,6vw,4.5rem)]">Checkout</h1>
          <p className="mt-4 max-w-md text-sm text-muted-dark">
            No account required. Give us a delivery address and a number to reach you on,
            and we’ll confirm a freight window within one business day.
          </p>
        </header>

        <CheckoutForm
          flatDeliveryFeeCents={flatDeliveryFeeCents}
          freeDeliveryThresholdCents={freeDeliveryThresholdCents}
        />
      </div>
    </>
  );
}
