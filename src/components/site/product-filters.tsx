"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/format";
import type { Category } from "@/lib/types/database";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
  { value: "name", label: "A–Z" },
] as const;

export function ProductFilters({
  categories,
  activeCategory,
  resultCount,
}: {
  categories: Category[];
  activeCategory?: string;
  resultCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const activeSort = params.get("sort") ?? "newest";

  function setSort(value: string) {
    const next = new URLSearchParams(params.toString());
    if (value === "newest") next.delete("sort");
    else next.set("sort", value);
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-5 border-b border-paper-line py-5">
      {/* Category pills */}
      <div className="-mx-1 flex flex-1 gap-1 overflow-x-auto px-1">
        <FilterPill href="/products" active={!activeCategory}>
          All
        </FilterPill>
        {categories.map((category) => (
          <FilterPill
            key={category.id}
            href={`/categories/${category.slug}`}
            active={activeCategory === category.slug}
          >
            {category.name}
          </FilterPill>
        ))}
      </div>

      <div className="flex items-center gap-5">
        <span className="eyebrow whitespace-nowrap text-muted">
          {resultCount} {resultCount === 1 ? "product" : "products"}
        </span>

        <div className="flex items-center gap-1">
          {SORTS.map((sort) => (
            <button
              key={sort.value}
              onClick={() => setSort(sort.value)}
              className={cn(
                "eyebrow rounded-full px-3 py-2 whitespace-nowrap transition-colors",
                activeSort === sort.value
                  ? "bg-ink text-paper"
                  : "text-muted-dark hover:bg-paper-soft",
              )}
            >
              {sort.label}
            </button>
          ))}
        </div>
      </div>
    </div>
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
