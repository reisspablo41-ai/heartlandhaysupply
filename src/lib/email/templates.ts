import { formatPrice, formatUnit } from "@/lib/format";
import { SITE_URL, STORE_NAME } from "@/lib/env";
import { button, dataRow, escapeHtml, palette, subjectSafe, wrap } from "@/lib/email/layout";
import type { Enquiry, OrderWithItems } from "@/lib/types/database";

export interface Email {
  subject: string;
  html: string;
  text: string;
}

function itemsTable(order: OrderWithItems): string {
  const rows = order.order_items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid ${palette.LINE};
                   font-family:Helvetica,Arial,sans-serif;font-size:14px;color:${palette.INK};">
          ${escapeHtml(item.product_name)}<br>
          <span style="font-size:12px;color:${palette.MUTED};">
            ${item.quantity} × ${formatPrice(item.unit_price_cents, order.currency)} /
            ${escapeHtml(formatUnit(item.unit))}
          </span>
        </td>
        <td align="right" style="padding:12px 0;border-bottom:1px solid ${palette.LINE};
                   font-family:Helvetica,Arial,sans-serif;font-size:14px;color:${palette.INK};">
          ${formatPrice(item.line_total_cents, order.currency)}
        </td>
      </tr>`,
    )
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="margin:8px 0 4px;">
      ${rows}
      ${dataRow("Subtotal", formatPrice(order.subtotal_cents, order.currency))}
      ${dataRow(
        "Delivery",
        order.delivery_fee_cents === 0
          ? "Free"
          : formatPrice(order.delivery_fee_cents, order.currency),
      )}
      ${dataRow("Total", formatPrice(order.total_cents, order.currency), true)}
    </table>`;
}

function addressBlock(order: OrderWithItems): string {
  return [
    order.company,
    order.delivery_address,
    [order.delivery_city, order.delivery_region, order.delivery_postcode]
      .filter(Boolean)
      .join(", "),
    order.delivery_country,
  ]
    .filter(Boolean)
    .map((line) => escapeHtml(String(line)))
    .join("<br>");
}

function itemsText(order: OrderWithItems): string {
  return order.order_items
    .map(
      (i) =>
        `  ${i.quantity} × ${i.product_name} — ${formatPrice(i.line_total_cents, order.currency)}`,
    )
    .join("\n");
}

// ── To the customer ──────────────────────────────────────────

export function orderConfirmationEmail(order: OrderWithItems): Email {
  const orderUrl = `${SITE_URL}/order/${order.access_token}`;
  const firstName = order.customer_name.split(" ")[0];

  const html = wrap({
    preheader: `Order ${order.order_number} received — we'll confirm your delivery window within one business day.`,
    heading: `Order ${order.order_number} is in`,
    body: `
      <p style="margin:0 0 16px;">Thanks, ${escapeHtml(firstName)}.</p>
      <p style="margin:0 0 16px;">
        We have your order and nothing has been charged yet. We will call
        ${escapeHtml(order.customer_phone)} within one business day to confirm a
        freight window, and invoice from there.
      </p>

      ${button(orderUrl, "View your order")}

      <p style="margin:0 0 24px;font-size:12px;color:${palette.MUTED};">
        That link is private and works without an account — keep it somewhere safe.
      </p>

      <h2 style="margin:28px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:11px;
                 letter-spacing:0.14em;text-transform:uppercase;color:${palette.MUTED};">Items</h2>
      ${itemsTable(order)}

      <h2 style="margin:28px 0 8px;font-family:Helvetica,Arial,sans-serif;font-size:11px;
                 letter-spacing:0.14em;text-transform:uppercase;color:${palette.MUTED};">
        Delivering to</h2>
      <p style="margin:0;line-height:1.7;">${addressBlock(order)}</p>
      ${
        order.delivery_notes
          ? `<p style="margin:14px 0 0;font-size:12px;color:${palette.MUTED};">
               Notes: ${escapeHtml(order.delivery_notes)}</p>`
          : ""
      }
    `,
  });

  const text = `Order ${order.order_number} is in

Thanks, ${firstName}.

We have your order and nothing has been charged yet. We will call
${order.customer_phone} within one business day to confirm a freight window.

View your order (private link):
${orderUrl}

ITEMS
${itemsText(order)}

Subtotal: ${formatPrice(order.subtotal_cents, order.currency)}
Delivery: ${order.delivery_fee_cents === 0 ? "Free" : formatPrice(order.delivery_fee_cents, order.currency)}
Total:    ${formatPrice(order.total_cents, order.currency)}

DELIVERING TO
${[order.company, order.delivery_address, [order.delivery_city, order.delivery_region, order.delivery_postcode].filter(Boolean).join(", "), order.delivery_country].filter(Boolean).join("\n")}

— ${STORE_NAME}
${SITE_URL}`;

  return {
    subject: subjectSafe(`Order ${order.order_number} received — ${STORE_NAME}`),
    html,
    text,
  };
}

// ── Forwarded to the store ───────────────────────────────────

export function newOrderNotificationEmail(
  order: OrderWithItems,
  adminUrl: string,
): Email {
  const html = wrap({
    preheader: `${order.customer_name} — ${formatPrice(order.total_cents, order.currency)}`,
    heading: `New order ${order.order_number}`,
    body: `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${dataRow("Customer", escapeHtml(order.customer_name))}
        ${dataRow("Email", `<a href="mailto:${escapeHtml(order.customer_email)}" style="color:${palette.INK};">${escapeHtml(order.customer_email)}</a>`)}
        ${dataRow("Phone", `<a href="tel:${escapeHtml(order.customer_phone)}" style="color:${palette.INK};">${escapeHtml(order.customer_phone)}</a>`)}
        ${dataRow("Destination", escapeHtml([order.delivery_city, order.delivery_region].filter(Boolean).join(", ")))}
      </table>

      ${button(adminUrl, "Open in admin")}

      <h2 style="margin:20px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:11px;
                 letter-spacing:0.14em;text-transform:uppercase;color:${palette.MUTED};">Items</h2>
      ${itemsTable(order)}

      <h2 style="margin:28px 0 8px;font-family:Helvetica,Arial,sans-serif;font-size:11px;
                 letter-spacing:0.14em;text-transform:uppercase;color:${palette.MUTED};">
        Delivery address</h2>
      <p style="margin:0;line-height:1.7;">${addressBlock(order)}</p>
      ${
        order.delivery_notes
          ? `<p style="margin:14px 0 0;font-size:13px;">
               <strong>Notes:</strong> ${escapeHtml(order.delivery_notes)}</p>`
          : ""
      }
    `,
  });

  const text = `NEW ORDER ${order.order_number}

${order.customer_name}
${order.customer_email}
${order.customer_phone}

${itemsText(order)}

Total: ${formatPrice(order.total_cents, order.currency)}

Delivery:
${[order.company, order.delivery_address, [order.delivery_city, order.delivery_region, order.delivery_postcode].filter(Boolean).join(", "), order.delivery_country].filter(Boolean).join("\n")}
${order.delivery_notes ? `\nNotes: ${order.delivery_notes}` : ""}

Admin: ${adminUrl}`;

  return {
    subject: subjectSafe(
      `New order ${order.order_number} · ${formatPrice(order.total_cents, order.currency)} · ${order.customer_name}`,
    ),
    html,
    text,
  };
}

export function enquiryNotificationEmail(enquiry: Enquiry): Email {
  const html = wrap({
    preheader: enquiry.message.slice(0, 110),
    heading: "New enquiry",
    body: `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${dataRow("From", escapeHtml(enquiry.name))}
        ${dataRow("Email", `<a href="mailto:${escapeHtml(enquiry.email)}" style="color:${palette.INK};">${escapeHtml(enquiry.email)}</a>`)}
        ${enquiry.phone ? dataRow("Phone", escapeHtml(enquiry.phone)) : ""}
      </table>

      <p style="margin:24px 0 0;padding:18px;background:${palette.SOFT};
                white-space:pre-line;line-height:1.7;">${escapeHtml(enquiry.message)}</p>

      ${button(`mailto:${enquiry.email}`, "Reply")}
    `,
  });

  const text = `NEW ENQUIRY

From:  ${enquiry.name}
Email: ${enquiry.email}
${enquiry.phone ? `Phone: ${enquiry.phone}\n` : ""}
${enquiry.message}`;

  return {
    subject: subjectSafe(`Enquiry from ${enquiry.name}`),
    html,
    text,
  };
}

// ── Acknowledgement to the enquirer ──────────────────────────

export function enquiryAcknowledgementEmail(enquiry: Enquiry): Email {
  const firstName = enquiry.name.split(" ")[0];

  const html = wrap({
    preheader: "We have your message and will reply within one business day.",
    heading: "Message received",
    body: `
      <p style="margin:0 0 16px;">Thanks, ${escapeHtml(firstName)}.</p>
      <p style="margin:0 0 16px;">
        Your message is with us and someone will reply within one business day.
        If it is urgent, reply to this email and it will come straight back to the yard.
      </p>
      <p style="margin:24px 0 0;padding:18px;background:${palette.SOFT};
                white-space:pre-line;line-height:1.7;font-size:13px;color:${palette.MUTED};">${escapeHtml(enquiry.message)}</p>
    `,
  });

  const text = `Message received

Thanks, ${firstName}. Your message is with us and someone will reply within
one business day.

You wrote:
${enquiry.message}

— ${STORE_NAME}
${SITE_URL}`;

  return { subject: subjectSafe(`We got your message — ${STORE_NAME}`), html, text };
}
