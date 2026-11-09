import { CURRENCY, CURRENCY_LOCALE } from "@/lib/env";
import type { PriceUnit } from "@/lib/types/database";

export function formatPrice(cents: number, currency: string = CURRENCY): string {
  return new Intl.NumberFormat(CURRENCY_LOCALE, {
    style: "currency",
    currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

const UNIT_LABELS: Record<PriceUnit, string> = {
  bale: "bale",
  ton: "ton",
  bundle: "bundle",
  pallet: "pallet",
};

export function formatUnit(unit: PriceUnit): string {
  return UNIT_LABELS[unit] ?? unit;
}

export function formatPerUnit(cents: number, unit: PriceUnit, currency?: string): string {
  return `${formatPrice(cents, currency)} / ${formatUnit(unit)}`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(CURRENCY_LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat(CURRENCY_LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function discountPercent(price: number, compareAt: number | null): number | null {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Merge class names, dropping falsy entries. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
