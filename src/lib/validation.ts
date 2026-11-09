import { z } from "zod";

const priceUnit = z.enum(["bale", "ton", "bundle", "pallet"]);

export const orderStatusSchema = z.enum([
  "pending",
  "confirmed",
  "processing",
  "out_for_delivery",
  "delivered",
  "cancelled",
]);

export const paymentStatusSchema = z.enum(["unpaid", "paid", "refunded"]);

/** One line the browser sends up at checkout. Prices are re-read server-side. */
export const cartLineSchema = z.object({
  productId: z.uuid(),
  quantity: z.number().int().min(1).max(999),
});

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Please enter your full name").max(120),
  customerEmail: z.email("Please enter a valid email address").max(200),
  customerPhone: z.string().trim().min(7, "Please enter a contact number").max(40),
  company: z.string().trim().max(160).optional().or(z.literal("")),

  deliveryAddress: z.string().trim().min(5, "Please enter a delivery address").max(300),
  deliveryCity: z.string().trim().min(2, "Please enter a city or town").max(120),
  deliveryRegion: z.string().trim().max(120).optional().or(z.literal("")),
  deliveryPostcode: z.string().trim().max(24).optional().or(z.literal("")),
  deliveryCountry: z.string().trim().min(2).max(120).default("United States"),
  deliveryNotes: z.string().trim().max(1000).optional().or(z.literal("")),

  items: z.array(cartLineSchema).min(1, "Your cart is empty"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.email("Please enter a valid email address").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell us a little more").max(2000),
});

const optionalNumber = (schema: z.ZodNumber) =>
  z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
    schema.optional(),
  );

const requiredNumber = (schema: z.ZodNumber) =>
  z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : Number(v)), schema);

const emptyToUndefined = (schema: z.ZodString) =>
  z.preprocess((v) => (v === "" ? undefined : v), schema.optional());

/** Admin product form. Prices arrive as major units and are converted to cents. */
export const productSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(200),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes only"),
  categoryId: z.union([z.uuid(), z.literal("")]).optional(),
  summary: emptyToUndefined(z.string().trim().max(300)),
  description: emptyToUndefined(z.string().trim().max(5000)),

  price: requiredNumber(z.number().min(0, "Price cannot be negative")),
  compareAtPrice: optionalNumber(z.number().min(0)),
  unit: priceUnit.default("bale"),
  sku: emptyToUndefined(z.string().trim().max(60)),
  stockQuantity: requiredNumber(z.number().int().min(0, "Stock cannot be negative")),
  minOrderQuantity: requiredNumber(z.number().int().min(1)),

  hayType: emptyToUndefined(z.string().trim().max(120)),
  cut: emptyToUndefined(z.string().trim().max(60)),
  baleShape: emptyToUndefined(z.string().trim().max(60)),
  baleWeightKg: optionalNumber(z.number().min(0)),
  proteinPercent: optionalNumber(z.number().min(0).max(100)),
  moisturePercent: optionalNumber(z.number().min(0).max(100)),
  harvestYear: optionalNumber(z.number().int().min(1900).max(2200)),
  origin: emptyToUndefined(z.string().trim().max(160)),

  isOrganic: z.boolean().default(false),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),

  imageUrls: z.array(z.url("Image must be a valid URL")).max(8).default([]),
});

export type ProductInput = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes only"),
  description: emptyToUndefined(z.string().trim().max(600)),
  imageUrl: z.union([z.url("Must be a valid URL"), z.literal("")]).optional(),
  sortOrder: requiredNumber(z.number().int().min(0)),
  isActive: z.boolean().default(true),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
