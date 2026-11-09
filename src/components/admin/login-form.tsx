"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { createClient } from "@/lib/supabase/client";
import { loginSchema } from "@/lib/validation";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";
  const initialError =
    params.get("error") === "unauthorised"
      ? "That account isn't on the admin allowlist."
      : null;

  const [error, setError] = useState<string | null>(initialError);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const parsed = loginSchema.safeParse({
      email: form.get("email"),
      password: form.get("password"),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your details.");
      return;
    }

    setPending(true);
    const supabase = createClient();

    const { data, error: signInError } = await supabase.auth.signInWithPassword(parsed.data);

    if (signInError || !data.user) {
      setPending(false);
      setError("Incorrect email or password.");
      return;
    }

    // Signing in is not enough — the account must also be on the allowlist.
    const { data: admin } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (!admin) {
      await supabase.auth.signOut();
      setPending(false);
      setError("That account isn't on the admin allowlist.");
      return;
    }

    router.replace(next.startsWith("/admin") ? next : "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-9 space-y-7">
      {error && (
        <p
          role="alert"
          className="border-l-2 border-danger bg-danger/5 px-4 py-3 text-sm text-danger"
        >
          {error}
        </p>
      )}

      <Field label="Email" htmlFor="email" required>
        <Input id="email" name="email" type="email" autoComplete="email" required autoFocus />
      </Field>

      <Field label="Password" htmlFor="password" required>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </Field>

      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>

      <Link href="/" className="block text-center text-xs text-muted hover:text-ink">
        ← Back to the store
      </Link>
    </form>
  );
}
