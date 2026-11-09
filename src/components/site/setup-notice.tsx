import { STORE_NAME } from "@/lib/env";

/**
 * Shown in place of the app until .env.local has real Supabase credentials.
 * Without this the first `npm run dev` is just a 500.
 */
export function SetupNotice() {
  const steps = [
    {
      title: "Create a Supabase project",
      body: "At supabase.com. Then open Project Settings → API.",
    },
    {
      title: "Fill in .env.local",
      body: "NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY. The service-role key is server-only — never prefix it with NEXT_PUBLIC_.",
    },
    {
      title: "Run the migrations",
      body: "Paste supabase/migrations/0001_init.sql then 0002_storage.sql into the Supabase SQL editor and run them.",
    },
    {
      title: "Seed a demo catalogue (optional)",
      body: "Run supabase/seed.sql for four categories and eight products.",
    },
    {
      title: "Create your admin account",
      body: "Authentication → Users → Add user, then insert that user's id into public.admin_users. See README.md for the exact SQL.",
    },
    {
      title: "Restart the dev server",
      body: "Next only reads .env.local at startup.",
    },
  ];

  return (
    <div className="gutter flex min-h-dvh items-center py-20">
      <div className="mx-auto w-full max-w-2xl">
        <p className="wordmark text-lg">{STORE_NAME}</p>

        <h1 className="display mt-8 text-[clamp(2.2rem,5vw,3.6rem)] text-balance">
          Six steps to a running store
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-muted-dark">
          The app is built and compiling — it just has no database behind it yet.
        </p>

        <ol className="mt-12 divide-y divide-paper-line border-y border-paper-line">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-5 py-5">
              <span className="eyebrow mt-1 shrink-0 text-muted tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-sm font-medium">{step.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-dark">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-10 text-xs text-muted">
          This screen disappears as soon as NEXT_PUBLIC_SUPABASE_URL and
          NEXT_PUBLIC_SUPABASE_ANON_KEY are set.
        </p>
      </div>
    </div>
  );
}
