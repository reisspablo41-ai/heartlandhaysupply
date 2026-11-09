"use client";

import Link from "next/link";
import { useEffect } from "react";
import { buttonClass } from "@/components/ui/button";

/**
 * Storefront error boundary. In development it shows the real message,
 * which is almost always "Supabase isn't configured yet".
 */
export default function StoreError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const looksLikeSetup =
    error.message.includes("Missing environment variable") ||
    error.message.includes("fetch failed");

  return (
    <div className="gutter grid min-h-dvh place-items-center py-24">
      <div className="max-w-xl">
        <p className="eyebrow text-muted">Something went wrong</p>

        {looksLikeSetup ? (
          <>
            <h1 className="display mt-4 text-[clamp(2.2rem,5vw,3.6rem)]">
              The store isn’t connected to Supabase yet
            </h1>
            <ol className="mt-7 space-y-3 text-sm leading-relaxed text-muted-dark">
              <li>
                <strong className="text-ink">1.</strong> Create a project at
                supabase.com and copy its URL, anon key and service-role key into{" "}
                <code className="bg-paper-soft px-1.5 py-0.5">.env.local</code>.
              </li>
              <li>
                <strong className="text-ink">2.</strong> Run{" "}
                <code className="bg-paper-soft px-1.5 py-0.5">
                  supabase/migrations/0001_init.sql
                </code>{" "}
                and{" "}
                <code className="bg-paper-soft px-1.5 py-0.5">0002_storage.sql</code>{" "}
                in the SQL editor.
              </li>
              <li>
                <strong className="text-ink">3.</strong> Optionally run{" "}
                <code className="bg-paper-soft px-1.5 py-0.5">supabase/seed.sql</code>{" "}
                for a demo catalogue, then restart the dev server.
              </li>
            </ol>
          </>
        ) : (
          <h1 className="display mt-4 text-[clamp(2.2rem,5vw,3.6rem)]">
            We hit an unexpected error
          </h1>
        )}

        {process.env.NODE_ENV === "development" && (
          <pre className="mt-7 overflow-x-auto bg-paper-soft p-4 text-xs text-danger">
            {error.message}
          </pre>
        )}

        <div className="mt-9 flex flex-wrap gap-3">
          <button onClick={reset} className={buttonClass("solid", "lg")}>
            Try again
          </button>
          <Link href="/" className={buttonClass("outline", "lg")}>
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
