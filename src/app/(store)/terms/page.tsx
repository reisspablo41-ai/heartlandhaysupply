import type { Metadata } from "next";
import { PageHeader, Prose } from "@/components/site/page-header";
import { STORE_NAME } from "@/lib/env";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms of sale"
        lede="This is a starting point, not legal advice. Have it reviewed before you trade."
      />
      <Prose>
        <h2>Orders</h2>
        <p>
          Placing an order through this site is an offer to buy, and reserves the lots in
          question. A contract is formed when {STORE_NAME} confirms the order and the
          freight window. Nothing is charged at checkout; we invoice on confirmation.
        </p>

        <h2>Pricing</h2>
        <p>
          Prices are per bale, bundle, pallet or ton as stated on each listing, exclusive of
          tax where applicable. All line prices are recalculated against our database when
          the order is placed, so the price we invoice is the published price at that
          moment.
        </p>

        <h2>Availability</h2>
        <p>
          Hay is a seasonal crop. Where a lot sells out between your order and our
          confirmation, we will offer the nearest equivalent or cancel the line at no cost.
        </p>

        <h2>Delivery</h2>
        <p>
          Delivery estimates are estimates. Risk passes on unloading. For flatbed loads you
          are responsible for providing suitable access and unloading equipment; failed
          deliveries caused by inaccessible sites may be rechargeable.
        </p>

        <h2>Returns</h2>
        <p>
          We do not accept returns of opened or fed hay for biosecurity reasons. Loads that
          arrive wet, mouldy or materially not as described will be replaced or refunded
          where reported with photographs on the day of delivery.
        </p>

        <h2>Liability</h2>
        <p>
          Our liability for any order is limited to the value of that order. Feeding
          decisions are yours; published analyses are provided as information, not as
          veterinary or nutritional advice.
        </p>
      </Prose>
    </>
  );
}
