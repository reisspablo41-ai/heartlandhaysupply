import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/page-header";
import { TestimonialCard } from "@/components/site/testimonial-card";
import { Stars } from "@/components/site/stars";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/format";
import {
  SEGMENTS,
  SEGMENT_LABELS,
  TESTIMONIALS,
  averageRating,
  ratingBreakdown,
  segmentCounts,
  testimonialsBySegment,
  type Segment,
} from "@/lib/testimonials";

export const metadata: Metadata = {
  title: "Customer reviews",
  description:
    "What yards, ranches, rescues and small-animal keepers say about our hay, straw and freight.",
};

type SearchParams = Promise<{ segment?: string }>;

export default async function TestimonialsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { segment } = await searchParams;
  const active = SEGMENTS.includes(segment as Segment) ? (segment as Segment) : undefined;

  const list = testimonialsBySegment(active);
  const counts = segmentCounts();
  const average = averageRating();
  const breakdown = ratingBreakdown();

  return (
    <>
      <PageHeader
        eyebrow="Customer reviews"
        title="What people feed, and what they say about it"
        lede="Unedited reviews from the yards, ranches, rescues and kitchen-table rabbit keepers who buy from us."
      />

      {/* Rating summary */}
      <section className="gutter border-b border-paper-line py-12">
        <div className="grid gap-10 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-16">
          <div>
            <p className="display text-6xl tabular-nums">{average}</p>
            <Stars rating={Math.round(average)} size="md" className="mt-3" />
            <p className="mt-3 text-xs text-muted">
              {TESTIMONIALS.length} verified reviews
            </p>
          </div>

          <dl className="max-w-sm space-y-1.5">
            {breakdown.map((row) => (
              <div key={row.stars} className="flex items-center gap-3 text-xs">
                <dt className="w-10 shrink-0 text-muted-dark tabular-nums">
                  {row.stars} star
                </dt>
                <dd className="flex flex-1 items-center gap-3">
                  <span className="h-1 flex-1 overflow-hidden rounded-full bg-paper-line">
                    <span
                      className="block h-full rounded-full bg-ink"
                      style={{ width: `${row.percent}%` }}
                    />
                  </span>
                  <span className="w-6 shrink-0 text-right text-muted tabular-nums">
                    {row.count}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="max-w-xs text-sm leading-relaxed text-muted-dark">
            <p>
              We publish every review we receive, including the ones that cost us a
              star. If something went wrong with your order, tell us and it will end up
              on this page.
            </p>
            <Link href="/contact" className={buttonClass("outline", "sm", "mt-5")}>
              Leave a review
            </Link>
          </div>
        </div>
      </section>

      {/* Segment filter */}
      <div className="gutter border-b border-paper-line py-5">
        <div className="-mx-1 flex gap-1 overflow-x-auto px-1">
          <FilterPill href="/testimonials" active={!active}>
            All {TESTIMONIALS.length}
          </FilterPill>
          {SEGMENTS.map((value) => (
            <FilterPill
              key={value}
              href={`/testimonials?segment=${value}`}
              active={active === value}
            >
              {SEGMENT_LABELS[value]} {counts[value]}
            </FilterPill>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="gutter py-14">
        <div className="columns-1 gap-5 md:columns-2 xl:columns-3 [&>*]:mb-5">
          {list.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>

      {/* Closing CTA */}
      <section className="bg-ink text-paper">
        <div className="gutter py-20 text-center md:py-24">
          <h2 className="display mx-auto max-w-2xl text-[clamp(1.9rem,4.5vw,3.2rem)] text-balance">
            See whether we are as good as they say
          </h2>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/products" className={buttonClass("light", "lg")}>
              Shop the catalogue
            </Link>
            <Link href="/contact#bulk" className={buttonClass("outlineLight", "lg")}>
              Request a bulk quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function FilterPill({
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
        "eyebrow rounded-full border px-4 py-2.5 whitespace-nowrap transition-colors",
        active
          ? "border-ink bg-ink text-paper"
          : "border-ink/15 text-muted-dark hover:border-ink hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}
