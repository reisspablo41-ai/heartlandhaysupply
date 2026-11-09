import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/format";

type Variant = "solid" | "outline" | "outlineLight" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium uppercase tracking-[0.14em] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

const variants: Record<Variant, string> = {
  solid: "bg-ink text-paper hover:bg-ink-soft",
  outline: "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-paper",
  // For use on the dark (ink) sections — overriding `outline` with extra
  // classes would be a coin flip, since Tailwind utilities share specificity
  // and stylesheet order decides the winner, not class order.
  outlineLight:
    "border border-paper/30 text-paper hover:border-paper hover:bg-paper hover:text-ink",
  ghost: "text-ink hover:bg-paper-soft",
  light: "bg-paper text-ink hover:bg-paper-soft",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[10px]",
  md: "h-11 px-6 text-[11px]",
  lg: "h-14 px-8 text-[11px]",
};

export function buttonClass(variant: Variant = "solid", size: Size = "md", extra?: string) {
  return cn(base, variants[variant], sizes[size], extra);
}

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function Button({
  variant = "solid",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonClass(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function ButtonLink({
  variant = "solid",
  size = "md",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={buttonClass(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}

/** The circled arrow from the reference "Shop Now" pill. */
export function ArrowCircle({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid size-7 shrink-0 place-items-center rounded-full bg-ink text-paper transition-transform duration-500 group-hover:rotate-45",
        className,
      )}
      aria-hidden
    >
      <svg viewBox="0 0 16 16" fill="none" className="size-3">
        <path
          d="M4 12L12 4M12 4H5.5M12 4v6.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
