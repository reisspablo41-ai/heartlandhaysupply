import type { Metadata } from "next";
import { PageHeader, Prose } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Delivery & freight",
  description: "How hay ships, what it costs and what you need on site to receive it.",
};

export default function DeliveryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Logistics"
        title="Delivery & freight"
        lede="Hay is bulky and heavy, so freight is a real part of the cost. Here is exactly how it works."
      />
      <Prose>
        <h2>How it ships</h2>
        <p>
          Small squares travel strapped and wrapped on pallets via LTL carrier. Large
          squares and round bales move by flatbed, which needs a tractor or telehandler at
          your end to unload. Small-animal bundles ship by parcel.
        </p>

        <h2>Cost</h2>
        <p>
          A flat delivery rate is applied at checkout and shown before you place the order.
          Orders above the free-freight threshold ship at no charge within the lower 48.
          Alaska, Hawaii and Canada are quoted individually — send an enquiry first.
        </p>

        <h2>Timing</h2>
        <ul>
          <li>Order confirmed by phone or email within one business day.</li>
          <li>Palletised LTL: typically 3–7 business days in transit.</li>
          <li>Flatbed loads: scheduled to an agreed window, usually 5–10 business days.</li>
        </ul>

        <h2>What you need on site</h2>
        <p>
          For LTL, a hard standing the truck can reach and someone to sign. Liftgate service
          is available on request. For flatbed loads you must have your own means of
          unloading — drivers do not carry equipment.
        </p>

        <h2>If a load arrives wet or mouldy</h2>
        <p>
          Photograph it before it comes off the truck and contact us the same day. We
          replace or refund affected bales, no argument. This almost never happens, but when
          it does it is on us.
        </p>
      </Prose>
    </>
  );
}
