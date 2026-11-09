import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/format";

export function AdminHeader({
  title,
  description,
  backHref,
  backLabel,
  actions,
}: {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-5 border-b border-paper-line px-6 py-8 md:px-10">
      <div>
        {backHref && (
          <Link
            href={backHref}
            className="eyebrow text-muted transition-colors hover:text-ink"
          >
            ← {backLabel ?? "Back"}
          </Link>
        )}
        <h1 className={cn("display text-3xl md:text-4xl", backHref && "mt-3")}>{title}</h1>
        {description && (
          <p className="mt-2 max-w-xl text-sm text-muted-dark">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function AdminBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("px-6 py-8 md:px-10", className)}>{children}</div>;
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="border border-dashed border-paper-line px-8 py-20 text-center">
      <p className="display text-2xl">{title}</p>
      <p className="mx-auto mt-3 max-w-sm text-sm text-muted-dark">{body}</p>
      {action && <div className="mt-7 flex justify-center">{action}</div>}
    </div>
  );
}
