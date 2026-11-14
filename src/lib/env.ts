/**
 * Small, explicit accessors for environment config.
 * Throwing early with a readable message beats a cryptic Supabase 401 later.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env.local and fill it in.`,
    );
  }
  return value;
}

/**
 * Whether the three Supabase variables are present. Used to degrade
 * gracefully before the project has been wired up, rather than throwing
 * from the proxy and 500-ing every route including the static ones.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export const supabaseUrl = () =>
  required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);

export const supabaseAnonKey = () =>
  required("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/** Server only. Never import this into a client component. */
export const supabaseServiceRoleKey = () =>
  required("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY);

export const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME || "Heartland Hay Supply";
/** "Heartland Hay Supply" → "HHS", for tight spaces like the collapsed sidebar. */
export const STORE_INITIALS =
  STORE_NAME.split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase() || "HH";

/** Public contact address — shown on the contact page and in the footer. */
export const STORE_EMAIL =
  process.env.NEXT_PUBLIC_STORE_EMAIL || "contact@heartandhaysupply.com";

export const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY || "USD";
export const CURRENCY_LOCALE = process.env.NEXT_PUBLIC_CURRENCY_LOCALE || "en-US";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const DELIVERY_FEE_CENTS = Number(process.env.DELIVERY_FEE_CENTS ?? 0) || 0;
export const FREE_DELIVERY_THRESHOLD_CENTS = process.env.FREE_DELIVERY_THRESHOLD_CENTS
  ? Number(process.env.FREE_DELIVERY_THRESHOLD_CENTS)
  : null;
