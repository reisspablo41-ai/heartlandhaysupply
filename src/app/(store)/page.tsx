import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/site/hero";
import { Marquee } from "@/components/site/marquee";
import { Section, SectionHeading } from "@/components/site/section";
import { CategoryGrid } from "@/components/site/category-grid";
import { ProductCard } from "@/components/site/product-card";
import { ValueProps } from "@/components/site/value-props";
import { HowItWorks } from "@/components/site/how-it-works";
import { FeedingGuide } from "@/components/site/feeding-guide";
import { FaqPreview } from "@/components/site/faq-preview";
import { TestimonialSlideshow } from "@/components/site/testimonial-slideshow";
import { FEATURED_TESTIMONIALS, TESTIMONIALS, averageRating } from "@/lib/testimonials";
import { buttonClass } from "@/components/ui/button";
import { getCategories, getProducts } from "@/lib/queries";

// Storefront pages render per-request: the Supabase server client reads
// cookies, which opts the route into dynamic rendering. Catalogue changes
// made in the admin panel are therefore visible immediately.

export default async function HomePage() {
  const [featured, latest, categories] = await Promise.all([
    getProducts({ featuredOnly: true, limit: 4 }),
    getProducts({ limit: 8 }),
    getCategories(),
  ]);

  // Fall back to the newest products if nothing has been flagged as featured yet.
  const highlight = featured.length > 0 ? featured : latest.slice(0, 4);

  return (
    <>
      <Hero
        eyebrow="Now shipping nationwide"
        headline={["Feed Better with", "First & Second Cutting"]}
        callout="Up to 20% off your first pallet. Free freight on orders over $1,500 across the lower 48."
        imageUrl="/hero-hay-field.jpg"
        imageAlt="Rows of baled hay in a field at dusk"
        ctaHref="/products"
        ctaLabel="Shop Now"
      />

      <Marquee />

      {/* Featured */}
      <Section>
        <SectionHeading
          eyebrow="Selected lots"
          title="This season's best bales"
          description="Hand-picked from the lots we'd feed our own stock. Probe-tested, barn-stored and ready to ship."
          href="/products"
        />

        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
          {highlight.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 2} />
          ))}
        </div>

        {highlight.length === 0 && (
          <EmptyCatalogue />
        )}
      </Section>

      {/* Categories */}
      <section className="border-y border-paper-line">
        <div className="gutter py-20 md:py-24">
          <SectionHeading
            eyebrow="By forage type"
            title="Pick the right hay for the animal"
            description="Protein, fibre and moisture shift with the grass, the cutting and the season. If you're unsure, start here."
          />
        </div>
        <CategoryGrid categories={categories} />
      </section>

      {/* Editorial split */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative aspect-[4/5] overflow-hidden bg-paper-soft">
            <Image
              src="/products/hay-stacked-bales.jpg"
              alt="Round bales stacked in the shade of the barn"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div className="max-w-lg">
            <p className="eyebrow text-muted">From the barn</p>
            <h2 className="display mt-4 text-[clamp(2rem,4.5vw,3.4rem)] text-balance">
              Hay is a crop, not a commodity
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-muted-dark">
              Two bales of timothy off the same farm can be a world apart depending on when
              they were cut, how fast they dried and where they spent the winter. We publish
              the cut, the harvest year, the protein and the moisture for every lot, so you
              are buying a known quantity rather than a photograph.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-dark">
              Everything ships out of covered storage on pallets, strapped and wrapped. If a
              load arrives wet or mouldy, we replace it.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/about" className={buttonClass("solid", "lg")}>
                About the farm
              </Link>
              <Link href="/contact#bulk" className={buttonClass("outline", "lg")}>
                Bulk enquiry
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Value props */}
      <section className="border-y border-paper-line">
        <ValueProps />
      </section>

      {/* How it works */}
      <Section>
        <SectionHeading
          eyebrow="Ordering"
          title="How buying hay here works"
          description="No account, no deposit, no haggling. Four steps from the listing to the barn."
        />
        <div className="mt-10">
          <HowItWorks />
        </div>
      </Section>

      {/* Testimonials */}
      <section className="border-y border-paper-line bg-paper-soft">
        <div className="gutter py-20 md:py-28">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-muted">Customer reviews</p>
              <h2 className="display mt-3 text-[clamp(1.6rem,3vw,2.2rem)]">
                {averageRating()} out of 5, across {TESTIMONIALS.length} reviews
              </h2>
            </div>
          </div>
          <TestimonialSlideshow testimonials={FEATURED_TESTIMONIALS} />
        </div>
      </section>

      {/* Feeding guide */}
      <Section>
        <SectionHeading
          eyebrow="Not sure what to buy?"
          title="Which hay for which animal"
          description="A starting point, not a prescription. Tell us the animal and the workload and we will narrow it down properly."
          href="/contact"
          linkLabel="Ask us"
        />
        <div className="mt-10">
          <FeedingGuide />
        </div>
      </Section>

      {/* Latest */}
      <Section>
        <SectionHeading
          eyebrow="Fresh off the field"
          title="Latest arrivals"
          href="/products?sort=newest"
          linkLabel="Shop all"
        />
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
          {latest.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {latest.length === 0 && <EmptyCatalogue />}
      </Section>

      {/* FAQ */}
      <section className="border-t border-paper-line">
        <div className="gutter py-20 md:py-24">
          <SectionHeading
            eyebrow="Before you order"
            title="Questions we get asked most"
            href="/faq"
            linkLabel="All questions"
          />
          <div className="mt-10 max-w-3xl">
            <FaqPreview />
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-ink text-paper">
        <div className="gutter py-24 text-center md:py-32">
          <p className="eyebrow text-paper/50">Feeding more than a few head?</p>
          <h2 className="display mx-auto mt-5 max-w-3xl text-[clamp(2.2rem,5.5vw,4.2rem)] text-balance">
            Contract tonnage, locked-in pricing
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-paper/60">
            Reserve from a standing crop and we’ll hold your lots through the season at a
            fixed rate, delivered on a schedule you set.
          </p>
          <Link href="/contact#bulk" className={buttonClass("light", "lg", "mt-10")}>
            Request a quote
          </Link>
        </div>
      </section>
    </>
  );
}

function EmptyCatalogue() {
  return (
    <div className="mt-12 border border-dashed border-paper-line px-8 py-20 text-center">
      <p className="display text-2xl">No products yet</p>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted-dark">
        Run the migration and seed file in <code>supabase/</code>, or add your first product
        from the admin panel.
      </p>
      <Link href="/admin/products/new" className={buttonClass("outline", "md", "mt-7")}>
        Add a product
      </Link>
    </div>
  );
}
