"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { CartButton } from "@/components/site/cart-button";
import { SearchField } from "@/components/site/search-field";
import { CloseIcon, MenuIcon, UserIcon } from "@/components/ui/icons";
import { STORE_NAME } from "@/lib/env";
import { cn } from "@/lib/format";

const NAV = [
  { href: "/products?sort=price-asc", label: "Sale" },
  { href: "/categories/grass-hay", label: "Grass" },
  { href: "/categories/alfalfa", label: "Alfalfa" },
  { href: "/categories/straw-bedding", label: "Bedding" },
  { href: "/products", label: "All Hay" },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const [scrolled, setScrolled] = useState(false);

  // The home hero is a dark full-bleed image, so the header sits on top of it
  // in light-on-dark until the page scrolls past it.
  const overHero = pathname === "/" && !scrolled;

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        overHero
          ? "bg-transparent text-paper"
          : "border-b border-paper-line bg-paper/90 text-ink backdrop-blur-xl",
      )}
    >
      <div className="gutter flex h-18 items-center justify-between gap-6">
        {/* Left: wordmark + nav */}
        <div className="flex items-center gap-8 xl:gap-10">
          <Link href="/" className="wordmark text-base whitespace-nowrap xl:text-xl">
            {STORE_NAME}
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="link-underline text-sm whitespace-nowrap opacity-80 transition-opacity hover:opacity-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: search + actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <Suspense fallback={<div className="h-10 w-[260px]" />}>
              <SearchField dark={overHero} />
            </Suspense>
          </div>

          <Link
            href="/admin"
            aria-label="Admin panel"
            className={cn(
              "hidden size-10 place-items-center rounded-full border transition-colors sm:grid",
              overHero
                ? "border-paper/25 hover:bg-paper hover:text-ink"
                : "border-ink/15 hover:bg-ink hover:text-paper",
            )}
          >
            <UserIcon className="size-[18px]" />
          </Link>

          <CartButton dark={overHero} />

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className={cn(
              "grid size-10 place-items-center rounded-full border transition-colors lg:hidden",
              overHero ? "border-paper/25" : "border-ink/15",
            )}
          >
            {menuOpen ? <CloseIcon className="size-4" /> : <MenuIcon className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "overflow-hidden border-t bg-paper text-ink transition-[max-height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden",
          menuOpen ? "max-h-[70vh] border-paper-line" : "max-h-0 border-transparent",
        )}
      >
        <div className="gutter flex flex-col gap-1 py-5">
          <div className="mb-3 md:hidden">
            <Suspense fallback={null}>
              <SearchField />
            </Suspense>
          </div>
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={closeMenu}
              className="display border-b border-paper-line py-3 text-2xl"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/testimonials"
            onClick={closeMenu}
            className="display border-b border-paper-line py-3 text-2xl"
          >
            Reviews
          </Link>
          <Link
            href="/about"
            onClick={closeMenu}
            className="display border-b border-paper-line py-3 text-2xl"
          >
            About
          </Link>
          <Link href="/contact" onClick={closeMenu} className="display py-3 text-2xl">
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}

/** Spacer matching the fixed header height, for pages that don't start with a hero. */
export function HeaderSpacer() {
  return <div className="h-18" aria-hidden />;
}
