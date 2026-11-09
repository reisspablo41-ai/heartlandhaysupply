import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Category, ProductWithRelations } from "@/lib/types/database";

const PRODUCT_SELECT = `
  *,
  category:categories (id, name, slug),
  product_images (id, product_id, url, alt, sort_order, created_at)
`;

export interface ProductQuery {
  categorySlug?: string;
  search?: string;
  sort?: "newest" | "price-asc" | "price-desc" | "name";
  featuredOnly?: boolean;
  limit?: number;
}

export async function getProducts(query: ProductQuery = {}): Promise<ProductWithRelations[]> {
  const supabase = await createClient();

  let request = supabase.from("products").select(PRODUCT_SELECT).eq("is_active", true);

  if (query.categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", query.categorySlug)
      .maybeSingle();

    if (!category) return [];
    request = request.eq("category_id", category.id);
  }

  if (query.featuredOnly) request = request.eq("is_featured", true);

  if (query.search) {
    const term = `%${query.search.replace(/[%_]/g, "")}%`;
    request = request.or(`name.ilike.${term},summary.ilike.${term},hay_type.ilike.${term}`);
  }

  switch (query.sort) {
    case "price-asc":
      request = request.order("price_cents", { ascending: true });
      break;
    case "price-desc":
      request = request.order("price_cents", { ascending: false });
      break;
    case "name":
      request = request.order("name", { ascending: true });
      break;
    default:
      request = request.order("created_at", { ascending: false });
  }

  if (query.limit) request = request.limit(query.limit);

  const { data, error } = await request;
  if (error) throw new Error(`Failed to load products: ${error.message}`);

  return (data ?? []) as unknown as ProductWithRelations[];
}

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw new Error(`Failed to load product: ${error.message}`);
  return (data as unknown as ProductWithRelations) ?? null;
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`Failed to load categories: ${error.message}`);
  return (data ?? []) as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw new Error(`Failed to load category: ${error.message}`);
  return (data as Category) ?? null;
}

/** Resolve the cart's product ids back to trusted, server-side prices. */
export async function getProductsByIds(ids: string[]): Promise<ProductWithRelations[]> {
  if (ids.length === 0) return [];
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .in("id", ids)
    .eq("is_active", true);

  if (error) throw new Error(`Failed to load cart products: ${error.message}`);
  return (data ?? []) as unknown as ProductWithRelations[];
}
