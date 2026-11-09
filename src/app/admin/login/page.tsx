import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";
import { STORE_NAME } from "@/lib/env";

export const metadata: Metadata = {
  title: "Staff login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between bg-ink p-12 text-paper lg:flex">
        <p className="wordmark text-xl">{STORE_NAME}</p>
        <div>
          <h1 className="display text-[clamp(2.5rem,4vw,3.8rem)]">
            Admin
            <br />
            console
          </h1>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-paper/50">
            Manage the catalogue, process orders and answer bulk enquiries. Staff access
            only — customers never sign in.
          </p>
        </div>
        <p className="text-xs text-paper/30">
          Access is granted by adding your account to <code>admin_users</code>.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <p className="wordmark text-lg lg:hidden">{STORE_NAME}</p>
          <p className="eyebrow mt-10 text-muted lg:mt-0">Staff login</p>
          <h2 className="display mt-3 text-3xl">Sign in</h2>

          <Suspense fallback={<div className="h-64" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
