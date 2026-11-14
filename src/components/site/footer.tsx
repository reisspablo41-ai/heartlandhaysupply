import Link from "next/link";
import { STORE_EMAIL, STORE_NAME } from "@/lib/env";
import { ArrowRightIcon } from "@/components/ui/icons";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/products", label: "All hay" },
      { href: "/categories/grass-hay", label: "Grass hay" },
      { href: "/categories/alfalfa", label: "Alfalfa" },
      { href: "/categories/straw-bedding", label: "Straw & bedding" },
      { href: "/categories/small-animal", label: "Small animal" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About the farm" },
      { href: "/testimonials", label: "Customer reviews" },
      { href: "/contact", label: "Contact" },
      { href: "/contact#bulk", label: "Bulk & wholesale" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/delivery", label: "Delivery & freight" },
      { href: "/faq", label: "FAQ" },
      { href: "/quality", label: "Quality & testing" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="gutter py-20">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_2fr]">
          {/* Wordmark + pitch */}
          <div className="max-w-sm">
            <p className="wordmark text-2xl sm:text-3xl">{STORE_NAME}</p>
            <p className="mt-5 text-sm leading-relaxed text-paper/55">
              Field-cured forage, baled dry and stored under cover. Shipped direct from
              the barn to the yard — no brokers, no mystery bales.
            </p>

            <Link
              href="/contact"
              className="group mt-8 inline-flex items-center gap-3 border-b border-paper/25 pb-2 text-sm transition-colors hover:border-paper"
            >
              Talk to a forage specialist
              <ArrowRightIcon className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <p className="eyebrow text-paper/40">{column.title}</p>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-paper/70 transition-colors hover:text-paper"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-paper/10 pt-8 text-xs text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {STORE_NAME}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a
              href={`mailto:${STORE_EMAIL}`}
              className="transition-colors hover:text-paper"
            >
              {STORE_EMAIL}
            </a>
            <Link href="/privacy" className="transition-colors hover:text-paper">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-paper">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
