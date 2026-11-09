"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/format";
import type { ProductImage } from "@/lib/types/database";

export function ProductGallery({
  images,
  alt,
}: {
  images: ProductImage[];
  alt: string;
}) {
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const [active, setActive] = useState(0);

  if (sorted.length === 0) {
    return (
      <div className="grid aspect-4/5 place-items-center bg-paper-soft">
        <span className="eyebrow text-muted">No image</span>
      </div>
    );
  }

  const current = sorted[Math.min(active, sorted.length - 1)];

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row">
      {sorted.length > 1 && (
        <div className="flex gap-3 lg:w-20 lg:flex-col">
          {sorted.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={index === active}
              className={cn(
                "relative aspect-square w-20 shrink-0 overflow-hidden bg-paper-soft transition-opacity",
                index === active ? "opacity-100 ring-1 ring-ink" : "opacity-55 hover:opacity-90",
              )}
            >
              <Image src={image.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="relative aspect-4/5 flex-1 overflow-hidden bg-paper-soft">
        <Image
          key={current.id}
          src={current.url}
          alt={current.alt ?? alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
