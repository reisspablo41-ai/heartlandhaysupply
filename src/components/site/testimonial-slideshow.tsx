"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Stars } from "@/components/site/stars";
import { cn } from "@/lib/format";
import type { Testimonial } from "@/lib/testimonials";

const INTERVAL_MS = 7000;

/**
 * Auto-advancing quote carousel.
 *
 * Pauses on hover, on keyboard focus and when the tab is hidden, and does
 * not auto-advance at all for visitors who have asked for reduced motion —
 * an animation that moves text out from under someone mid-sentence is the
 * exact thing that setting is for. Manual controls always work.
 */
export function TestimonialSlideshow({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);

  const count = testimonials.length;

  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    function onVisibility() {
      setPaused(document.hidden);
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || count < 2) return;
    const timer = window.setInterval(
      () => setIndex((i) => (i + 1) % count),
      INTERVAL_MS,
    );
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, count]);

  if (count === 0) return null;

  return (
    <div
      ref={regionRef}
      role="group"
      aria-roledescription="carousel"
      aria-label="Customer reviews"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") go(index - 1);
        if (event.key === "ArrowRight") go(index + 1);
      }}
      className="relative"
    >
      {/* Quote */}
      <div className="min-h-[clamp(16rem,26vw,20rem)]" aria-live="polite" aria-atomic>
        {testimonials.map((testimonial, i) => (
          <figure
            key={testimonial.id}
            aria-hidden={i !== index}
            className={cn(
              "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
              i === index
                ? "relative opacity-100 blur-0"
                : "pointer-events-none absolute inset-0 opacity-0 blur-[2px]",
            )}
          >
            <Stars rating={testimonial.rating} size="md" className="mb-7" />

            <blockquote className="display max-w-4xl text-[clamp(1.4rem,3.2vw,2.5rem)] leading-[1.25] text-balance">
              “{testimonial.quote}”
            </blockquote>

            <figcaption className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
              <span className="font-medium">{testimonial.name}</span>
              <span className="text-muted-dark">{testimonial.role}</span>
              <span className="text-muted">· {testimonial.location}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Controls */}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-paper-line pt-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous review"
            className="grid size-10 place-items-center rounded-full border border-ink/15 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
          >
            <Chevron className="size-4 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next review"
            className="grid size-10 place-items-center rounded-full border border-ink/15 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
          >
            <Chevron className="size-4" />
          </button>

          <ol className="ml-3 flex items-center gap-1.5">
            {testimonials.map((testimonial, i) => (
              <li key={testimonial.id}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Review ${i + 1} of ${count}`}
                  aria-current={i === index}
                  className={cn(
                    "h-1 rounded-full transition-all duration-500",
                    i === index ? "w-7 bg-ink" : "w-2.5 bg-paper-line hover:bg-muted",
                  )}
                />
              </li>
            ))}
          </ol>
        </div>

        <Link
          href="/testimonials"
          className="group inline-flex items-center gap-2 border-b border-ink/25 pb-1.5 text-sm transition-colors hover:border-ink"
        >
          Read all 50 reviews
          <Chevron className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
