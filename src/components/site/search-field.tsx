"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { SearchIcon } from "@/components/ui/icons";

export function SearchField({ dark = false }: { dark?: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("q") ?? "");

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const q = value.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  }

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      className={`flex h-10 w-full max-w-[260px] items-center gap-2 rounded-full border px-4 transition-colors ${
        dark
          ? "border-paper/25 text-paper focus-within:border-paper"
          : "border-ink/15 text-ink focus-within:border-ink"
      }`}
    >
      <SearchIcon className="size-4 shrink-0 opacity-60" />
      <input
        type="search"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search hay"
        aria-label="Search products"
        className="w-full bg-transparent text-xs outline-none placeholder:text-muted"
      />
    </form>
  );
}
