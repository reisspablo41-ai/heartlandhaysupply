import type { Metadata } from "next";
import { SetupNotice } from "@/components/site/setup-notice";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

/**
 * Pass-through. The real chrome lives in (panel)/layout.tsx so that
 * /admin/login can render full-bleed without the sidebar.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-paper-soft">
      {isSupabaseConfigured() ? children : <SetupNotice />}
    </div>
  );
}
