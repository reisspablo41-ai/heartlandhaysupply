import type { ZodError } from "zod";

/**
 * Shared shape for every server action's return value.
 *
 * This lives outside the "use server" modules on purpose: a "use server"
 * file may only export async functions, so constants and helpers have to
 * be defined somewhere else.
 */
export interface ActionState {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
}

export const emptyActionState: ActionState = { ok: false };

/** First error per field, keyed by dotted path. */
export function fieldErrorsFrom(error: ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    fieldErrors[key] ??= issue.message;
  }
  return fieldErrors;
}

/** Admin actions use the same shape; aliased for readability at call sites. */
export type AdminActionState = ActionState;
export const emptyAdminState: AdminActionState = emptyActionState;
