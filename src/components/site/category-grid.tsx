import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types/database";
import { ArrowRightIcon } from "@/components/ui/icons";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <div className="grid gap-px bg-paper-line sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.slug}`}
          className="group relative isolate flex aspect-[3/4] flex-col justify-end overflow-hidden bg-ink p-7 text-paper"
        >
          {category.image_url && (
            <Image
              src={category.image_url}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="-z-10 object-cover opacity-55 transition-all duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:opacity-75"
            />
          )}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/35 to-transparent"
          />

          <h3 className="display text-2xl">{category.name}</h3>
          {category.description && (
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-paper/60">
              {category.description}
            </p>
          )}
          <span className="mt-5 inline-flex items-center gap-2 text-xs">
            <span className="eyebrow">Shop</span>
            <ArrowRightIcon className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
          </span>
        </Link>
      ))}
    </div>
  );
}
