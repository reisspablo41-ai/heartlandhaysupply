import "server-only";

import { Resend } from "resend";

/**
 * Resend is optional. If it isn't configured the store still works —
 * orders are placed, enquiries are saved, nothing is lost. The only
 * difference is that nobody gets an email about it.
 */
export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

let client: Resend | null = null;

export function getResend(): Resend | null {
  if (!isEmailConfigured()) return null;
  client ??= new Resend(process.env.RESEND_API_KEY);
  return client;
}

/** `Store Name <orders@yourdomain.com>` — the verified sender. */
export const EMAIL_FROM = process.env.EMAIL_FROM ?? "";

/** Where customer replies land. */
export const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO || undefined;

/**
 * Inbox that new orders and enquiries are forwarded to.
 * Comma-separated for several recipients.
 */
export const STORE_INBOX = (process.env.STORE_NOTIFICATION_EMAIL ?? "")
  .split(",")
  .map((address) => address.trim())
  .filter(Boolean);
