import { requireAdmin } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  // Belt and braces: middleware already blocks anonymous requests, this
  // also rejects a signed-in account that isn't on the allowlist.
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-dvh">
      <AdminSidebar email={admin.email} role={admin.role} />
      <div className="min-w-0 flex-1 bg-paper">{children}</div>
    </div>
  );
}
