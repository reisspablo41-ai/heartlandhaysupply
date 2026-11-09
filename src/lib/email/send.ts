import "server-only";

import {
  EMAIL_FROM,
  EMAIL_REPLY_TO,
  STORE_INBOX,
  getResend,
  isEmailConfigured,
} from "@/lib/email/client";
import {
  enquiryAcknowledgementEmail,
  enquiryNotificationEmail,
  newOrderNotificationEmail,
  orderConfirmationEmail,
} from "@/lib/email/templates";
import { SITE_URL } from "@/lib/env";
import type { Enquiry, OrderWithItems } from "@/lib/types/database";

/**
 * Every send here is best-effort and never throws.
 *
 * An order that is already in the database must not be reported as failed
 * because an email provider had a bad minute — the customer would re-submit
 * and we would have two orders. Failures are logged for the server operator
 * and the flow continues.
 */
async function deliver(
  to: string[],
  email: { subject: string; html: string; text: string },
  replyTo?: string,
): Promise<void> {
  const resend = getResend();

  if (!resend) {
    console.warn(
      `[email] Skipped "${email.subject}" — RESEND_API_KEY / EMAIL_FROM not configured.`,
    );
    return;
  }
  if (to.length === 0) {
    console.warn(`[email] Skipped "${email.subject}" — no recipient configured.`);
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: email.subject,
      html: email.html,
      text: email.text,
      replyTo: replyTo ?? EMAIL_REPLY_TO,
    });

    if (error) {
      console.error(`[email] Resend rejected "${email.subject}":`, error.message);
    }
  } catch (cause) {
    console.error(`[email] Failed to send "${email.subject}":`, cause);
  }
}

/** Confirmation to the shopper + a copy of the order to the store inbox. */
export async function sendOrderEmails(order: OrderWithItems): Promise<void> {
  if (!isEmailConfigured()) return;

  const adminUrl = `${SITE_URL}/admin/orders/${order.id}`;

  await Promise.allSettled([
    deliver([order.customer_email], orderConfirmationEmail(order)),
    deliver(
      STORE_INBOX,
      newOrderNotificationEmail(order, adminUrl),
      // Replying to the notification writes to the customer.
      order.customer_email,
    ),
  ]);
}

/** Forward the enquiry to the store, and acknowledge it to the sender. */
export async function sendEnquiryEmails(enquiry: Enquiry): Promise<void> {
  if (!isEmailConfigured()) return;

  await Promise.allSettled([
    deliver(STORE_INBOX, enquiryNotificationEmail(enquiry), enquiry.email),
    deliver([enquiry.email], enquiryAcknowledgementEmail(enquiry)),
  ]);
}
