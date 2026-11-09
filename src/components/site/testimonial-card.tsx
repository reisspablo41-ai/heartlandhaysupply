import { Stars } from "@/components/site/stars";
import { cn } from "@/lib/format";
import type { Testimonial } from "@/lib/testimonials";

export function TestimonialCard({
  testimonial,
  className,
}: {
  testimonial: Testimonial;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "flex h-full break-inside-avoid flex-col border border-paper-line bg-paper p-7",
        className,
      )}
    >
      <Stars rating={testimonial.rating} />

      <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-ink">
        “{testimonial.quote}”
      </blockquote>

      <figcaption className="mt-6 border-t border-paper-line pt-5">
        <p className="text-sm font-medium">{testimonial.name}</p>
        <p className="mt-0.5 text-xs text-muted-dark">{testimonial.role}</p>
        <p className="mt-0.5 text-xs text-muted">{testimonial.location}</p>
        {testimonial.product && (
          <p className="eyebrow mt-3 inline-block bg-paper-soft px-2 py-1 text-muted-dark">
            {testimonial.product}
          </p>
        )}
      </figcaption>
    </figure>
  );
}
