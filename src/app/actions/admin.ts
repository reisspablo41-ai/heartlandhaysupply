"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { fieldErrorsFrom, type AdminActionState } from "@/lib/action-state";
import { createClient } from "@/lib/supabase/server";
import {
  categorySchema,
  orderStatusSchema,
  paymentStatusSchema,
  productSchema,
} from "@/lib/validation";

const toCents = (major: number) => Math.round(major * 100);
const bool = (formData: FormData, name: string) => formData.get(name) === "on";

function readProductForm(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    categoryId: formData.get("categoryId"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    price: formData.get("price"),
    compareAtPrice: formData.get("compareAtPrice"),
    unit: formData.get("unit") || "bale",
    sku: formData.get("sku"),
    stockQuantity: formData.get("stockQuantity"),
    minOrderQuantity: formData.get("minOrderQuantity") || 1,
    hayType: formData.get("hayType"),
    cut: formData.get("cut"),
    baleShape: formData.get("baleShape"),
    baleWeightKg: formData.get("baleWeightKg"),
    proteinPercent: formData.get("proteinPercent"),
    moisturePercent: formData.get("moisturePercent"),
    harvestYear: formData.get("harvestYear"),
    origin: formData.get("origin"),
    isOrganic: bool(formData, "isOrganic"),
    isActive: bool(formData, "isActive"),
    isFeatured: bool(formData, "isFeatured"),
    imageUrls: formData
      .getAll("imageUrls")
      .map((v) => String(v).trim())
      .filter(Boolean),
  });
}

function productRow(input: z.infer<typeof productSchema>) {
  return {
    name: input.name,
    slug: input.slug,
    category_id: input.categoryId || null,
    summary: input.summary ?? null,
    description: input.description ?? null,
    price_cents: toCents(input.price),
    compare_at_price_cents:
      input.compareAtPrice !== undefined ? toCents(input.compareAtPrice) : null,
    unit: input.unit,
    sku: input.sku ?? null,
    stock_quantity: input.stockQuantity,
    min_order_quantity: input.minOrderQuantity,
    hay_type: input.hayType ?? null,
    cut: input.cut ?? null,
    bale_shape: input.baleShape ?? null,
    bale_weight_kg: input.baleWeightKg ?? null,
    protein_percent: input.proteinPercent ?? null,
    moisture_percent: input.moisturePercent ?? null,
    harvest_year: input.harvestYear ?? null,
    origin: input.origin ?? null,
    is_organic: input.isOrganic,
    is_active: input.isActive,
    is_featured: input.isFeatured,
  };
}

/** Replace a product's image rows with the submitted list, in order. */
async function syncImages(productId: string, urls: string[]) {
  const supabase = await createClient();
  await supabase.from("product_images").delete().eq("product_id", productId);
  if (urls.length === 0) return;

  await supabase.from("product_images").insert(
    urls.map((url, index) => ({
      product_id: productId,
      url,
      sort_order: index,
    })),
  );
}

function revalidateStorefront() {
  revalidatePath("/", "layout");
}

// ─────────────────────────── Products ───────────────────────────

export async function createProduct(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  const parsed = readProductForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .insert(productRow(parsed.data))
    .select("id")
    .single();

  if (error || !data) {
    return {
      ok: false,
      message:
        error?.code === "23505"
          ? "That slug or SKU is already in use."
          : (error?.message ?? "Could not create the product."),
    };
  }

  await syncImages(data.id, parsed.data.imageUrls);
  revalidateStorefront();
  redirect(`/admin/products/${data.id}?created=1`);
}

export async function updateProduct(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, message: "Missing product id." };

  const parsed = readProductForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("products").update(productRow(parsed.data)).eq("id", id);

  if (error) {
    return {
      ok: false,
      message:
        error.code === "23505"
          ? "That slug or SKU is already in use."
          : error.message,
    };
  }

  await syncImages(id, parsed.data.imageUrls);
  revalidateStorefront();
  revalidatePath(`/admin/products/${id}`);

  return { ok: true, message: "Product saved." };
}

export async function deleteProduct(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", id);

  revalidateStorefront();
  redirect("/admin/products");
}

/** Quick toggle from the products table. */
export async function toggleProductActive(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const next = formData.get("next") === "true";
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("products").update({ is_active: next }).eq("id", id);

  revalidateStorefront();
  revalidatePath("/admin/products");
}

// ─────────────────────────── Categories ───────────────────────────

function readCategoryForm(formData: FormData) {
  return categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
    sortOrder: formData.get("sortOrder") || 0,
    isActive: bool(formData, "isActive"),
  });
}

export async function saveCategory(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  const parsed = readCategoryForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the highlighted fields.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const id = String(formData.get("id") ?? "");
  const row = {
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description ?? null,
    image_url: parsed.data.imageUrl || null,
    sort_order: parsed.data.sortOrder,
    is_active: parsed.data.isActive,
  };

  const supabase = await createClient();
  const { error } = id
    ? await supabase.from("categories").update(row).eq("id", id)
    : await supabase.from("categories").insert(row);

  if (error) {
    return {
      ok: false,
      message: error.code === "23505" ? "That slug is already in use." : error.message,
    };
  }

  revalidateStorefront();
  revalidatePath("/admin/categories");

  return { ok: true, message: id ? "Category updated." : "Category created." };
}

export async function deleteCategory(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  // Products keep existing; their category_id is set to null by the FK rule.
  await supabase.from("categories").delete().eq("id", id);

  revalidateStorefront();
  revalidatePath("/admin/categories");
}

// ─────────────────────────── Orders ───────────────────────────

export async function updateOrder(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, message: "Missing order id." };

  const status = orderStatusSchema.safeParse(formData.get("status"));
  const payment = paymentStatusSchema.safeParse(formData.get("paymentStatus"));

  if (!status.success || !payment.success) {
    return { ok: false, message: "Unrecognised status value." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({
      status: status.data,
      payment_status: payment.data,
      admin_notes: String(formData.get("adminNotes") ?? "") || null,
    })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);

  return { ok: true, message: "Order updated." };
}

// ─────────────────────────── Enquiries ───────────────────────────

export async function setEnquiryHandled(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const next = formData.get("next") === "true";
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("enquiries").update({ is_handled: next }).eq("id", id);

  revalidatePath("/admin/enquiries");
}
