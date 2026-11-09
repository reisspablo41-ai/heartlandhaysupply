import { cn } from "@/lib/format";

export function Stars({
  rating,
  className,
  size = "sm",
}: {
  rating: number;
  className?: string;
  size?: "sm" | "md";
}) {
  const px = size === "md" ? "size-4" : "size-3";

  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          viewBox="0 0 20 20"
          aria-hidden
          className={cn(px, n <= rating ? "fill-hay" : "fill-paper-line")}
        >
          <path d="M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.2l-4.94 2.6.94-5.5-4-3.9 5.53-.8z" />
        </svg>
      ))}
    </span>
  );
}
