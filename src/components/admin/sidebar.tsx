"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { STORE_INITIALS, STORE_NAME } from "@/lib/env";
import { cn } from "@/lib/format";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/enquiries", label: "Enquiries" },
];

export function AdminSidebar({ email, role }: { email: string; role: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    await createClient().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <aside className="sticky top-0 flex h-dvh w-16 shrink-0 flex-col justify-between border-r border-ink/10 bg-ink text-paper md:w-60">
      <div>
        <div className="flex h-18 items-center justify-center border-b border-paper/10 md:justify-start md:px-6">
          <Link href="/" className="wordmark text-xs md:text-sm">
            <span className="md:hidden">{STORE_INITIALS}</span>
            <span className="hidden md:inline">{STORE_NAME}</span>
          </Link>
        </div>

        <nav className="p-2 md:p-4">
          <ul className="space-y-1">
            {NAV.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    title={item.label}
                    className={cn(
                      "block truncate rounded-sm px-3 py-2.5 text-xs transition-colors md:text-sm",
                      active
                        ? "bg-paper text-ink"
                        : "text-paper/60 hover:bg-paper/10 hover:text-paper",
                    )}
                  >
                    <span className="md:hidden">{item.label.slice(0, 2)}</span>
                    <span className="hidden md:inline">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="space-y-3 border-t border-paper/10 p-4">
        <div className="hidden md:block">
          <p className="truncate text-xs text-paper/70">{email}</p>
          <p className="eyebrow mt-1 text-paper/35">{role}</p>
        </div>

        <Link
          href="/"
          className="block truncate text-xs text-paper/50 transition-colors hover:text-paper"
        >
          <span className="md:hidden">↗</span>
          <span className="hidden md:inline">View store ↗</span>
        </Link>

        <button
          onClick={signOut}
          disabled={signingOut}
          className="block truncate text-xs text-paper/50 transition-colors hover:text-paper disabled:opacity-40"
        >
          <span className="md:hidden">⏻</span>
          <span className="hidden md:inline">
            {signingOut ? "Signing out…" : "Sign out"}
          </span>
        </button>
      </div>
    </aside>
  );
}
