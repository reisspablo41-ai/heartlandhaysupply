/**
 * Hand-written types mirroring supabase/migrations/0001_init.sql.
 *
 * Once your project is live you can replace this file with generated types:
 *   npx supabase gen types typescript --project-id <ref> > src/lib/types/database.ts
 */

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export type PriceUnit = "bale" | "ton" | "bundle" | "pallet";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string | null;

  name: string;
  slug: string;
  summary: string | null;
  description: string | null;

  price_cents: number;
  compare_at_price_cents: number | null;
  unit: PriceUnit;
  sku: string | null;
  stock_quantity: number;
  min_order_quantity: number;

  hay_type: string | null;
  cut: string | null;
  bale_shape: string | null;
  bale_weight_kg: number | null;
  protein_percent: number | null;
  moisture_percent: number | null;
  harvest_year: number | null;
  origin: string | null;
  is_organic: boolean;

  is_active: boolean;
  is_featured: boolean;

  created_at: string;
  updated_at: string;
}

/** Product joined with its images and category — what the storefront reads. */
export interface ProductWithRelations extends Product {
  category: Pick<Category, "id" | "name" | "slug"> | null;
  product_images: ProductImage[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_slug: string | null;
  unit: PriceUnit;
  unit_price_cents: number;
  quantity: number;
  line_total_cents: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;

  customer_name: string;
  customer_email: string;
  customer_phone: string;
  company: string | null;

  delivery_address: string;
  delivery_city: string;
  delivery_region: string | null;
  delivery_postcode: string | null;
  delivery_country: string;
  delivery_notes: string | null;

  subtotal_cents: number;
  delivery_fee_cents: number;
  total_cents: number;
  currency: string;

  status: OrderStatus;
  payment_status: PaymentStatus;
  admin_notes: string | null;

  access_token: string;

  created_at: string;
  updated_at: string;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_handled: boolean;
  created_at: string;
}

export interface AdminUser {
  user_id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "owner";
  created_at: string;
}
