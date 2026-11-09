"use server";

import { redirect } from "next/navigation";
import { after } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEnquiryEmails, sendOrderEmails } from "@/lib/email/send";
import { fieldErrorsFrom, type ActionState } from "@/lib/action-state";
import { checkoutSchema, enquirySchema } from "@/lib/validation";
import { deliveryFeeFor } from "@/lib/shipping";
import { CURRENCY } from "@/lib/env";
import type { Enquiry, OrderWithItems } from "@/lib/types/database";

/**
 * Place a guest order.
 *
 * Quantities come from the browser; prices do not. Every line is re-priced
 * against the database before the order is written, so a tampered cart
 * cannot change what anything costs.
 */
export async function placeOrder(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let rawItems: unknown;
  try {
    rawItems = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    return { ok: false, message: "Your cart could not be read. Please try again." };
  }

  const parsed = checkoutSchema.safeParse({
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone"),
    company: formData.get("company"),
    deliveryAddress: formData.get("deliveryAddress"),
    deliveryCity: formData.get("deliveryCity"),
    deliveryRegion: formData.get("deliveryRegion"),
    deliveryPostcode: formData.get("deliveryPostcode"),
    deliveryCountry: formData.get("deliveryCountry") || "United States",
    deliveryNotes: formData.get("deliveryNotes"),
    items: rawItems,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const input = parsed.data;
  const supabase = createAdminClient();

  // ---- Re-price from the database -------------------------------------
  const ids = [...new Set(input.items.map((i) => i.productId))];

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, slug, price_cents, unit, stock_quantity, min_order_quantity, is_active")
    .in("id", ids);

  if (productsError) {
    return { ok: false, message: "We couldn't price your order. Please try again." };
  }

  const byId = new Map((products ?? []).map((p) => [p.id, p]));

  const lines: Array<{
    product_id: string;
    product_name: string;
    product_slug: string;
    unit: string;
    unit_price_cents: number;
    quantity: number;
    line_total_cents: number;
  }> = [];

  for (const item of input.items) {
    const product = byId.get(item.productId);

    if (!product || !product.is_active) {
      return {
        ok: false,
        message: "One of the items in your cart is no longer available. Please review it.",
      };
    }

    if (item.quantity > product.stock_quantity) {
      return {
        ok: false,
        message: `Only ${product.stock_quantity} of “${product.name}” are left. Please lower the quantity.`,
      };
    }

    if (item.quantity < product.min_order_quantity) {
      return {
        ok: false,
        message: `“${product.name}” has a minimum order of ${product.min_order_quantity}.`,
      };
    }

    lines.push({
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      unit: product.unit,
      unit_price_cents: product.price_cents,
      quantity: item.quantity,
      line_total_cents: product.price_cents * item.quantity,
    });
  }

  const subtotalCents = lines.reduce((sum, l) => sum + l.line_total_cents, 0);
  const deliveryFeeCents = deliveryFeeFor(subtotalCents);
  const totalCents = subtotalCents + deliveryFeeCents;

  // ---- Write the order -------------------------------------------------
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: input.customerName,
      customer_email: input.customerEmail.toLowerCase(),
      customer_phone: input.customerPhone,
      company: input.company || null,
      delivery_address: input.deliveryAddress,
      delivery_city: input.deliveryCity,
      delivery_region: input.deliveryRegion || null,
      delivery_postcode: input.deliveryPostcode || null,
      delivery_country: input.deliveryCountry,
      delivery_notes: input.deliveryNotes || null,
      subtotal_cents: subtotalCents,
      delivery_fee_cents: deliveryFeeCents,
      total_cents: totalCents,
      currency: CURRENCY,
    })
    .select("id, access_token")
    .single();

  if (orderError || !order) {
    return { ok: false, message: "We couldn't place your order. Please try again." };
  }

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(lines.map((line) => ({ ...line, order_id: order.id })));

  if (itemsError) {
    // Don't leave a headless order behind.
    await supabase.from("orders").delete().eq("id", order.id);
    return { ok: false, message: "We couldn't save your order lines. Please try again." };
  }

  // ---- Notify ----------------------------------------------------------
  // after() runs once the response is on its way, so a slow or failing
  // email provider cannot delay the redirect or lose a placed order.
  after(async () => {
    const { data: full } = await supabase
      .from("orders")
      .select("*, order_items (*)")
      .eq("id", order.id)
      .single();

    if (full) await sendOrderEmails(full as unknown as OrderWithItems);
  });

  // ---- Decrement stock -------------------------------------------------
  // Best-effort: a failure here must not lose the order, so it's logged
  // rather than surfaced. Swap for an RPC in a transaction if you need
  // strict inventory guarantees.
  for (const line of lines) {
    const product = byId.get(line.product_id);
    if (!product) continue;
    const { error } = await supabase
      .from("products")
      .update({ stock_quantity: Math.max(0, product.stock_quantity - line.quantity) })
      .eq("id", line.product_id);
    if (error) console.error("Stock decrement failed", line.product_id, error.message);
  }

  redirect(`/order/${order.access_token}`);
}

/** Bulk / wholesale enquiry from the contact page. */
export async function submitEnquiry(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = enquirySchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const supabase = createAdminClient();
  const { data: enquiry, error } = await supabase
    .from("enquiries")
    .insert({
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone || null,
      message: parsed.data.message,
    })
    .select("*")
    .single();

  if (error || !enquiry) {
    return { ok: false, message: "We couldn't send your message. Please try again." };
  }

  after(() => sendEnquiryEmails(enquiry as Enquiry));

  return { ok: true, message: "Thanks — we'll be in touch within one business day." };
}
