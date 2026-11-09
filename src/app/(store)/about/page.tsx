import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/site/page-header";
import { Section } from "@/components/site/section";
import { ValueProps } from "@/components/site/value-props";
import { buttonClass } from "@/components/ui/button";
import { STORE_NAME } from "@/lib/env";

export const metadata: Metadata = {
  title: "About the farm",
  description:
    "Who we are, how we cure our hay, and why every lot is tested before it leaves the barn.",
};

const FIGURES = [
  { value: "1964", label: "Farming the same ground since" },
  { value: "2,400", label: "Acres under hay" },
  { value: "48", label: "States we freight to" },
  { value: "<12%", label: "Baling moisture ceiling" },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our story"
        title="Three generations, one crop, no shortcuts"
        lede="We grow, cut, cure and bale everything we sell. Nothing is bought in from a broker, which is why we can tell you exactly which field a bale came out of."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative aspect-4/5 overflow-hidden bg-paper-soft">
            <Image
              src="/products/hay-sunset-bales.jpg"
              alt="Round bales in a cut field at sunset"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="max-w-lg space-y-5 text-sm leading-relaxed text-muted-dark">
            <p>
              {STORE_NAME} started as a family operation putting up small squares for
              neighbouring horse yards. The ground has not changed and neither has the
              approach — cut at the right stage, dry it properly, store it dry.
            </p>
            <p>
              What has changed is how far the hay travels. We run flatbeds and palletised
              LTL across the lower 48, which means our bales have to survive weeks in
              transit and a winter in someone else’s barn. That is a higher bar than selling
              out of the back of a truck, and it is the reason we are strict about moisture.
            </p>
            <p>
              Every lot is probe-sampled before it is listed. Crude protein, moisture, cut
              and harvest year go on the product page. If the numbers are not good enough to
              publish, the lot does not get sold as premium.
            </p>
            <p>
              We are a small team and we read every message ourselves. If you are not
              sure what to feed, email us with the animal, the workload and what you are
              feeding now, and we will tell you honestly whether we have the right hay
              for it.
            </p>

            <div className="flex flex-wrap gap-3 pt-5">
              <Link href="/products" className={buttonClass("solid", "lg")}>
                Shop the barn
              </Link>
              <Link href="/contact" className={buttonClass("outline", "lg")}>
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <section className="border-y border-paper-line">
        <div className="grid gap-px bg-paper-line sm:grid-cols-2 lg:grid-cols-4">
          {FIGURES.map((figure) => (
            <div key={figure.label} className="bg-paper px-8 py-12">
              <p className="display text-4xl">{figure.value}</p>
              <p className="mt-3 text-xs leading-relaxed text-muted-dark">{figure.label}</p>
            </div>
          ))}
        </div>
      </section>

      <Section className="!py-0">
        <div className="py-20">
          <ValueProps />
        </div>
      </Section>
    </>
  );
}
