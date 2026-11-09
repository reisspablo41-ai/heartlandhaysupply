-- ============================================================
-- Heartland Hay Supply — initial schema
-- Storefront is fully public (no customer accounts).
-- Only the admin panel is authenticated, via Supabase Auth +
-- an allowlist in public.admin_users.
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Enums
-- ------------------------------------------------------------
do $$ begin
  create type public.order_status as enum (
    'pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum ('unpaid', 'paid', 'refunded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.price_unit as enum ('bale', 'ton', 'bundle', 'pallet');
exception when duplicate_object then null; end $$;

-- ------------------------------------------------------------
-- updated_at helper
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ------------------------------------------------------------
-- admin_users — the allowlist that gates the admin panel
-- ------------------------------------------------------------
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  full_name  text,
  role       text not null default 'admin' check (role in ('admin', 'owner')),
  created_at timestamptz not null default now()
);

-- SECURITY DEFINER so policies can read admin_users without recursing
-- through admin_users' own RLS policies.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users a where a.user_id = auth.uid()
  );
$$;

-- ------------------------------------------------------------
-- categories
-- ------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  image_url   text,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists categories_slug_idx on public.categories (slug);
create index if not exists categories_active_idx on public.categories (is_active, sort_order);

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- products
-- ------------------------------------------------------------
create table if not exists public.products (
  id                      uuid primary key default gen_random_uuid(),
  category_id             uuid references public.categories (id) on delete set null,

  name                    text not null,
  slug                    text not null unique,
  summary                 text,                       -- one-liner for cards
  description             text,                       -- long copy for the PDP

  -- commerce
  price_cents             integer not null check (price_cents >= 0),
  compare_at_price_cents  integer check (compare_at_price_cents >= 0),
  unit                    public.price_unit not null default 'bale',
  sku                     text unique,
  stock_quantity          integer not null default 0 check (stock_quantity >= 0),
  min_order_quantity      integer not null default 1 check (min_order_quantity >= 1),

  -- hay-specific attributes
  hay_type                text,          -- Timothy, Orchard Grass, Bermuda, Fescue...
  cut                     text,          -- 1st Cut, 2nd Cut, 3rd Cut
  bale_shape              text,          -- Small Square, Large Square, Round
  bale_weight_kg          numeric(8, 2),
  protein_percent         numeric(5, 2),
  moisture_percent        numeric(5, 2),
  harvest_year            integer,
  origin                  text,          -- farm / region
  is_organic              boolean not null default false,

  -- merchandising
  is_active               boolean not null default true,
  is_featured             boolean not null default false,

  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists products_slug_idx          on public.products (slug);
create index if not exists products_category_idx      on public.products (category_id);
create index if not exists products_active_idx        on public.products (is_active, created_at desc);
create index if not exists products_featured_idx      on public.products (is_featured) where is_featured;
create index if not exists products_search_idx        on public.products
  using gin (to_tsvector('english', coalesce(name, '') || ' ' || coalesce(summary, '') || ' ' || coalesce(hay_type, '')));

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- product_images
-- ------------------------------------------------------------
create table if not exists public.product_images (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  url        text not null,
  alt        text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists product_images_product_idx on public.product_images (product_id, sort_order);

-- ------------------------------------------------------------
-- orders  (guest checkout — identified by email + access_token)
-- ------------------------------------------------------------
create sequence if not exists public.order_number_seq start 1000;

create table if not exists public.orders (
  id                  uuid primary key default gen_random_uuid(),
  order_number        text not null unique default ('HH-' || lpad(nextval('public.order_number_seq')::text, 6, '0')),

  -- the shopper is anonymous, so everything we know is captured here
  customer_name       text not null,
  customer_email      text not null,
  customer_phone      text not null,
  company             text,

  delivery_address    text not null,
  delivery_city       text not null,
  delivery_region     text,
  delivery_postcode   text,
  delivery_country    text not null default 'United States',
  delivery_notes      text,

  subtotal_cents      integer not null check (subtotal_cents >= 0),
  delivery_fee_cents  integer not null default 0 check (delivery_fee_cents >= 0),
  total_cents         integer not null check (total_cents >= 0),
  currency            text not null default 'USD',

  status              public.order_status   not null default 'pending',
  payment_status      public.payment_status not null default 'unpaid',
  admin_notes         text,

  -- lets a guest re-open their confirmation page without an account
  access_token        text not null unique default encode(gen_random_bytes(16), 'hex'),

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists orders_created_idx on public.orders (created_at desc);
create index if not exists orders_status_idx  on public.orders (status);
create index if not exists orders_email_idx   on public.orders (customer_email);
create index if not exists orders_token_idx   on public.orders (access_token);

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- order_items  (product details snapshotted at purchase time)
-- ------------------------------------------------------------
create table if not exists public.order_items (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references public.orders (id) on delete cascade,
  product_id       uuid references public.products (id) on delete set null,

  product_name     text not null,
  product_slug     text,
  unit             public.price_unit not null default 'bale',
  unit_price_cents integer not null check (unit_price_cents >= 0),
  quantity         integer not null check (quantity > 0),
  line_total_cents integer not null check (line_total_cents >= 0),

  created_at       timestamptz not null default now()
);

create index if not exists order_items_order_idx on public.order_items (order_id);

-- ------------------------------------------------------------
-- enquiries  (bulk / wholesale contact form)
-- ------------------------------------------------------------
create table if not exists public.enquiries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  message    text not null,
  is_handled boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists enquiries_created_idx on public.enquiries (is_handled, created_at desc);

-- ============================================================
-- Row Level Security
--
-- anon  : may READ active catalogue data only.
-- admin : full access (checked via public.is_admin()).
-- Orders and enquiries are WRITTEN from the server with the
-- service-role key, which bypasses RLS — so no anon insert
-- policy is needed, and no one can read other people's orders.
-- ============================================================

alter table public.admin_users    enable row level security;
alter table public.categories     enable row level security;
alter table public.products       enable row level security;
alter table public.product_images enable row level security;
alter table public.orders         enable row level security;
alter table public.order_items    enable row level security;
alter table public.enquiries      enable row level security;

-- admin_users ------------------------------------------------
drop policy if exists "admins read own row" on public.admin_users;
create policy "admins read own row" on public.admin_users
  for select to authenticated using (user_id = auth.uid());

-- categories -------------------------------------------------
drop policy if exists "public reads active categories" on public.categories;
create policy "public reads active categories" on public.categories
  for select to anon, authenticated using (is_active);

drop policy if exists "admins manage categories" on public.categories;
create policy "admins manage categories" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- products ---------------------------------------------------
drop policy if exists "public reads active products" on public.products;
create policy "public reads active products" on public.products
  for select to anon, authenticated using (is_active);

drop policy if exists "admins manage products" on public.products;
create policy "admins manage products" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- product_images ---------------------------------------------
drop policy if exists "public reads images of active products" on public.product_images;
create policy "public reads images of active products" on public.product_images
  for select to anon, authenticated using (
    exists (select 1 from public.products p where p.id = product_id and p.is_active)
  );

drop policy if exists "admins manage product images" on public.product_images;
create policy "admins manage product images" on public.product_images
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- orders -----------------------------------------------------
drop policy if exists "admins manage orders" on public.orders;
create policy "admins manage orders" on public.orders
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage order items" on public.order_items;
create policy "admins manage order items" on public.order_items
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- enquiries --------------------------------------------------
drop policy if exists "admins manage enquiries" on public.enquiries;
create policy "admins manage enquiries" on public.enquiries
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
