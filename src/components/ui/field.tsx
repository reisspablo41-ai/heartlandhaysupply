import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/format";

const control =
  "w-full rounded-none border-0 border-b border-ink/15 bg-transparent px-0 py-3 text-[15px] text-ink outline-none transition-colors placeholder:text-muted focus:border-ink disabled:opacity-50";

export function Label({ className, children, ...props }: ComponentProps<"label">) {
  return (
    <label className={cn("eyebrow block text-muted-dark", className)} {...props}>
      {children}
    </label>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(control, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(control, "resize-y", className)} rows={4} {...props} />;
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select className={cn(control, "cursor-pointer appearance-none", className)} {...props}>
      {children}
    </select>
  );
}

export function Checkbox({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      className={cn("size-4 cursor-pointer accent-ink", className)}
      {...props}
    />
  );
}

interface FieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="ml-1 text-danger">*</span>}
      </Label>
      {children}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
