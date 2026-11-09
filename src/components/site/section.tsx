import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/format";
import { ArrowRightIcon } from "@/components/ui/icons";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "View all",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-6 border-b border-paper-line pb-6",
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-3 text-muted">{eyebrow}</p>}
        <h2 className="display text-[clamp(1.9rem,4.2vw,3.1rem)] text-balance">{title}</h2>
        {description && (
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-dark">{description}</p>
        )}
      </div>

      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-2 border-b border-ink/25 pb-1.5 text-sm whitespace-nowrap transition-colors hover:border-ink"
        >
          {linkLabel}
          <ArrowRightIcon className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

export function Section({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={cn("gutter py-20 md:py-28", className)}>{children}</section>;
}
