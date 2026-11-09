"use client";

import { cn } from "@/lib/format";
import { MinusIcon, PlusIcon } from "@/components/ui/icons";

interface Props {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
  compact?: boolean;
}

export function QuantityStepper({
  value,
  min = 1,
  max = 999,
  onChange,
  className,
  compact = false,
}: Props) {
  const size = compact ? "size-7" : "size-10";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-ink/15",
        compact ? "gap-0" : "gap-1",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className={cn(
          size,
          "grid place-items-center rounded-full transition-colors hover:bg-paper-soft disabled:opacity-30 disabled:hover:bg-transparent",
        )}
      >
        <MinusIcon className="size-3.5" />
      </button>

      <span
        aria-live="polite"
        className={cn(
          "min-w-7 text-center tabular-nums",
          compact ? "text-xs" : "text-sm",
        )}
      >
        {value}
      </span>

      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className={cn(
          size,
          "grid place-items-center rounded-full transition-colors hover:bg-paper-soft disabled:opacity-30 disabled:hover:bg-transparent",
        )}
      >
        <PlusIcon className="size-3.5" />
      </button>
    </div>
  );
}
