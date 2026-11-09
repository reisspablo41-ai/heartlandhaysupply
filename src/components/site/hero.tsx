import Image from "next/image";
import Link from "next/link";
import { ArrowCircle } from "@/components/ui/button";

interface HeroProps {
  eyebrow?: string;
  headline: string[];
  callout?: string;
  imageUrl: string;
  imageAlt: string;
  ctaHref?: string;
  ctaLabel?: string;
}

/**
 * Full-bleed dark hero: oversized display headline bottom-left, a hairline
 * leader with a dot linking out to a short callout on the right, and a white
 * pill CTA — the structure of the reference layout.
 */
export function Hero({
  eyebrow,
  headline,
  callout,
  imageUrl,
  imageAlt,
  ctaHref = "/products",
  ctaLabel = "Shop Now",
}: HeroProps) {
  return (
    <section className="relative isolate h-[94vh] min-h-[620px] w-full overflow-hidden bg-ink text-paper">
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-85"
      />

      {/* Vignette: light at the top so the image reads, black at the bottom for type */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/10 to-ink"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink/60 to-transparent" />

      <div className="gutter relative flex h-full flex-col justify-end pb-14 md:pb-20">
        {/* Right-hand callout with leader line */}
        {callout && (
          <div className="absolute right-6 bottom-[42%] hidden max-w-[260px] items-start gap-5 md:flex xl:right-14">
            <div className="flex flex-col items-center pt-1">
              <div className="leader-line h-20" />
              <span className="mt-2 grid size-6 place-items-center rounded-full border border-paper/35">
                <span className="size-2 rounded-full bg-paper" />
              </span>
            </div>
            <p className="pt-1 text-[13px] leading-relaxed text-paper/85">{callout}</p>
          </div>
        )}

        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="fade-up max-w-3xl">
            {eyebrow && <p className="eyebrow mb-5 text-paper/60">{eyebrow}</p>}
            <h1 className="display text-[clamp(2.6rem,7.5vw,5.75rem)]">
              {headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
          </div>

          <Link
            href={ctaHref}
            className="group inline-flex h-14 shrink-0 items-center gap-3 rounded-full bg-paper py-2 pr-2 pl-7 text-ink transition-colors hover:bg-paper-soft"
          >
            <span className="eyebrow">{ctaLabel}</span>
            <ArrowCircle />
          </Link>
        </div>
      </div>
    </section>
  );
}
