import { STORE_NAME, SITE_URL } from "@/lib/env";

/**
 * Email HTML is not web HTML. Outlook renders through Word, Gmail strips
 * <style> blocks in some clients, and flexbox/grid are unreliable
 * everywhere — so this is tables and inline styles on purpose.
 */

const INK = "#050505";
const PAPER = "#ffffff";
const SOFT = "#f4f3f0";
const LINE = "#e3e1dc";
const MUTED = "#6e6e6e";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Subjects are plain text, not HTML, so they are not escaped — but they do
 * get user input spliced in, so collapse any newlines. Resend posts JSON so
 * header injection is not reachable, and this keeps subjects on one line.
 */
export function subjectSafe(value: string, max = 120): string {
  const flat = value.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
}

export function button(href: string, label: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0;">
      <tr>
        <td style="background:${INK};border-radius:999px;">
          <a href="${escapeHtml(href)}"
             style="display:inline-block;padding:14px 30px;color:${PAPER};text-decoration:none;
                    font-family:Helvetica,Arial,sans-serif;font-size:11px;font-weight:500;
                    letter-spacing:0.14em;text-transform:uppercase;">${escapeHtml(label)}</a>
        </td>
      </tr>
    </table>`;
}

export function dataRow(label: string, value: string, strong = false): string {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${LINE};font-family:Helvetica,Arial,sans-serif;
                 font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${MUTED};">
        ${escapeHtml(label)}
      </td>
      <td align="right" style="padding:10px 0;border-bottom:1px solid ${LINE};
                 font-family:Helvetica,Arial,sans-serif;font-size:${strong ? "18px" : "14px"};
                 color:${INK};${strong ? "font-weight:600;" : ""}">
        ${value}
      </td>
    </tr>`;
}

/** Wraps body HTML in the branded shell. */
export function wrap({
  preheader,
  heading,
  body,
}: {
  preheader: string;
  heading: string;
  body: string;
}): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background:${SOFT};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    ${escapeHtml(preheader)}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background:${SOFT};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
               style="max-width:580px;background:${PAPER};">

          <tr>
            <td style="padding:32px 36px 0;">
              <a href="${SITE_URL}" style="text-decoration:none;color:${INK};
                 font-family:Georgia,'Times New Roman',serif;font-size:20px;
                 letter-spacing:0.14em;text-transform:uppercase;">${escapeHtml(STORE_NAME)}</a>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 36px 0;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-weight:400;
                         font-size:30px;line-height:1.15;color:${INK};">${escapeHtml(heading)}</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 36px 36px;font-family:Helvetica,Arial,sans-serif;
                       font-size:14px;line-height:1.65;color:${INK};">
              ${body}
            </td>
          </tr>

          <tr>
            <td style="padding:24px 36px 32px;border-top:1px solid ${LINE};
                       font-family:Helvetica,Arial,sans-serif;font-size:11px;
                       line-height:1.7;color:${MUTED};">
              ${escapeHtml(STORE_NAME)} ·
              <a href="${SITE_URL}" style="color:${MUTED};">${SITE_URL.replace(/^https?:\/\//, "")}</a><br>
              You are receiving this because you placed an order or sent us a message.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export const palette = { INK, PAPER, SOFT, LINE, MUTED };
