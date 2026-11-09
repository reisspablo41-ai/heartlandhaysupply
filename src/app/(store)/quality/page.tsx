import type { Metadata } from "next";
import { PageHeader, Prose } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Quality & testing",
  description: "How we sample, what we measure and what the numbers on a listing mean.",
};

export default function QualityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Standards"
        title="Quality & testing"
        lede="Every lot is sampled before it is listed. Here's what we measure and why it matters."
      />
      <Prose>
        <h2>Sampling</h2>
        <p>
          We core-sample with a bale probe across at least twenty bales per lot, composite
          the sample and send it for forage analysis. Lots are kept physically separate in
          the barn so the result stays attached to the hay it came from.
        </p>

        <h2>Crude protein</h2>
        <p>
          The headline number. Our grass hay typically runs 8–12%, with second and third
          cuttings at the top of that range. Higher is not automatically better — an easy
          keeper on rich hay will put on weight you don’t want.
        </p>

        <h2>Moisture</h2>
        <p>
          The one that decides whether hay keeps. Above roughly 15% in a small square and
          you risk mould and heating. We bale below 12% and store under cover, and we do not
          list a lot that reads high.
        </p>

        <h2>What we reject</h2>
        <ul>
          <li>Rained-on windrows that bleached or lost leaf.</li>
          <li>Anything with visible mould, dust or a musty smell.</li>
          <li>Lots with weed or foreign material above trace levels.</li>
          <li>Bales that heated in the stack, whatever the probe says now.</li>
        </ul>

        <h2>Our guarantee</h2>
        <p>
          If a delivered lot does not match its published analysis, or arrives wet or
          mouldy, we replace it or refund it. Photograph it before unloading and contact us
          the same day.
        </p>
      </Prose>
    </>
  );
}
