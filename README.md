# Heartland Hay Supply — hay & forage e-commerce

A storefront and admin panel for selling hay, straw and forage.

Built with **Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Supabase**.

The design follows an editorial monochrome direction: near-black ground, paper-white
type, full-bleed dark hero with an oversized serif headline, hairline rules and pill
buttons.

---

## The one thing to know about auth

**Shoppers never sign in.** There are no customer accounts, no password resets, no
"my account" page. Checkout is guest-only: the shopper gives a delivery address and a
phone number, and gets back a private link (`/order/<token>`) that is the only way to
reopen their order.

**Only the admin panel is authenticated.** `/admin/*` uses Supabase Auth, and a
Supabase account alone is not enough — the user id must also be present in
`public.admin_users`. That same table backs every RLS policy, so the UI check and the
database check cannot drift apart.

---

## Setup

### 1. Install

```bash
npm install
```

### 2. Create a Supabase project

At [supabase.com](https://supabase.com). Then open **Project Settings → API** and copy
the three values into `.env.local` (already created, with everything else filled in):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

> The service-role key bypasses Row Level Security. It must never be prefixed with
> `NEXT_PUBLIC_`, and it is only imported by `src/lib/supabase/admin.ts`, which is
> marked `server-only` so a client-side import is a build error.

### 3. Run the migrations

In the Supabase **SQL Editor**, run in order:

1. `supabase/migrations/0001_init.sql` — tables, enums, triggers, indexes, RLS
2. `supabase/migrations/0002_storage.sql` — the `product-images` storage bucket

### 3b. Seed the demo catalogue (optional)

Product imagery is stored in the Supabase Storage bucket, not in this repo's
served assets, so seeding is two steps:

```bash
npm run seed:images
```

That uploads `public/products/*.jpg` into the `product-images` bucket and
writes `supabase/seed.generated.sql` with your project's real storage URLs
filled in. Run **that** file in the SQL editor — it creates 4 categories and
11 products.

`supabase/seed.sql` is the checked-in template; it carries a
`YOUR-PROJECT-REF` placeholder and is not meant to be run directly.

### 4. Create your admin account

**Authentication → Users → Add user** (email + password, confirm the email), then run:

```sql
insert into public.admin_users (user_id, email, full_name, role)
select id, email, 'Your Name', 'owner'
from auth.users
where email = 'you@example.com';
```

### 5. Run it

```bash
npm run dev
```

Storefront at `/`, admin at `/admin`.

Until the Supabase variables are set, every route shows a setup checklist instead of
crashing. Next only reads `.env.local` at startup, so restart after editing it.

---

## Data model

| Table            | Purpose                                                        |
| ---------------- | -------------------------------------------------------------- |
| `categories`     | Forage types — nav, homepage tiles, storefront filters          |
| `products`       | Lots, with hay-specific fields (cut, protein %, moisture %, …)  |
| `product_images` | Ordered gallery; `sort_order = 0` is the card image             |
| `orders`         | Guest orders. Auto `order_number` (`HH-001000`) + `access_token`|
| `order_items`    | Line items, with name/price **snapshotted** at purchase time    |
| `enquiries`      | Bulk / wholesale messages from the contact form                 |
| `admin_users`    | The allowlist that gates `/admin` and every write policy        |

### Row Level Security

| Role            | Can do                                                            |
| --------------- | ----------------------------------------------------------------- |
| `anon`          | `SELECT` on **active** categories, products and their images. Nothing else. |
| `authenticated` | The same, plus everything — but only if `public.is_admin()` is true. |
| service role    | Everything. Used for two things only: writing guest orders, and reading a guest's own order back by token. |

Orders have **no anon policy at all**. They are written with the service-role client in
a server action, so no shopper can read, list or tamper with anyone's orders — including
their own, except through the unguessable 128-bit token.

---

## How the money is kept honest

The cart lives in `localStorage` (there is no account to attach a server cart to), so
everything in it is attacker-controlled. `placeOrder` in
`src/app/actions/checkout.ts` therefore sends **only product ids and quantities** to the
server, and then:

1. re-reads every price from the database,
2. rejects inactive products, quantities above stock and quantities below the minimum,
3. computes the subtotal, delivery fee and total server-side,
4. writes the order, then the lines, deleting the order if the lines fail,
5. decrements stock.

A tampered cart cannot change what anything costs.

---

## Project structure

```
src/
  app/
    (store)/                 storefront — header, footer, cart, no auth
      page.tsx               home: hero, featured, categories, editorial, latest
      products/              catalogue + [slug] product detail
      categories/[slug]/     per-category listing
      cart/  checkout/       cart page and guest checkout
      order/[token]/         guest order confirmation (reached from checkout)
      about/ contact/ delivery/ faq/ quality/ privacy/ terms/
    admin/
      login/                 Supabase email+password sign-in
      (panel)/               guarded by requireAdmin() in the layout
        page.tsx             dashboard: revenue, open orders, low stock
        products/            list, new, [id] edit
        categories/          list + inline create/edit
        orders/              list, filter by status, [id] fulfilment
        enquiries/           bulk enquiry inbox
    actions/
      checkout.ts            placeOrder, submitEnquiry   (public, service role)
      admin.ts               product/category/order writes (requireAdmin + RLS)
  components/
    site/   cart/   admin/   ui/
  lib/
    email/                 client, layout, templates, send (Resend)
    supabase/client|server|admin|proxy.ts
    queries.ts  orders.ts  auth.ts  validation.ts  shipping.ts  format.ts
  proxy.ts                   session refresh + /admin gate (Next 16 `proxy`)
supabase/
  migrations/0001_init.sql  0002_storage.sql
  seed.sql
```

### Three Supabase clients, on purpose

| Module                     | Key          | RLS      | Used by                              |
| -------------------------- | ------------ | -------- | ------------------------------------ |
| `supabase/client.ts`       | anon         | enforced | Admin login form (browser)           |
| `supabase/server.ts`       | anon+cookies | enforced | Storefront reads, all admin queries  |
| `supabase/admin.ts`        | service role | bypassed | Guest order write, order-by-token read |

Admin writes deliberately go through the **cookie-bound** client, not the service-role
one, so every admin mutation is policy-checked by Postgres as well as by `requireAdmin()`.

---

## Email (Resend)

Four transactional emails, sent through [Resend](https://resend.com):

| Trigger | To the customer | To `STORE_NOTIFICATION_EMAIL` |
| --- | --- | --- |
| Order placed | Confirmation with items, totals and the private order link | Full order + a link to it in the admin |
| Contact form | "We got your message" acknowledgement | The enquiry, with reply-to set to the sender |

### Setup

1. Create a Resend account and **verify your sending domain** (Domains → Add
   Domain, then add the DKIM/SPF records it gives you to your DNS). Until the
   domain is verified you can only send to your own address.
2. Create an API key and fill in `.env.local`:

```bash
RESEND_API_KEY=re_...
EMAIL_FROM=Heartland Hay Supply <contact@heartandhaysupply.com>   # must be on the verified domain
EMAIL_REPLY_TO=contact@heartandhaysupply.com
STORE_NOTIFICATION_EMAIL=contact@heartandhaysupply.com  # comma-separate for several
```

3. Restart the dev server.

### How it behaves

**Email is optional.** With `RESEND_API_KEY` blank, orders and enquiries are
still saved exactly as before — the send is skipped and a line is logged. The
store never breaks because an email provider is down.

Sends run inside `after()` from `next/server`, so they happen once the
response is already on its way to the browser. A slow provider cannot delay
checkout, and a failed send cannot roll back an order that is already in the
database — which would otherwise cause duplicate orders when the customer
retried.

All user-supplied content is HTML-escaped in the body, and subject lines are
flattened to a single line.

### Replies

The store notification sets `reply-to` to the **customer's** address, so
hitting reply in your inbox writes to them, not to yourself.

## Configuration

Set in `.env.local`:

| Variable | Default | Effect |
| --- | --- | --- |
| `NEXT_PUBLIC_STORE_NAME` | `Heartland Hay Supply` | Wordmark, titles, footer |
| `NEXT_PUBLIC_CURRENCY` | `USD` | Price formatting |
| `NEXT_PUBLIC_CURRENCY_LOCALE` | `en-US` | Number and date formatting |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Metadata base, customer order links |
| `DELIVERY_FEE_CENTS` | `4500` | Flat delivery fee, in cents |
| `FREE_DELIVERY_THRESHOLD_CENTS` | `150000` | Subtotal above which delivery is free; blank to always charge |

---

## Product images

Product and category images live in the **`product-images` Storage bucket**
(created by `0002_storage.sql`: public read, admin-only write). The admin
product form takes image **URLs**, so to add a photo:

1. Upload it in the Supabase dashboard under **Storage → product-images**, or
   via `npm run seed:images` for a whole folder at once.
2. Copy its public URL and paste it into the product form's *Image URL* field.

The URL pattern is predictable:

```
https://<project-ref>.supabase.co/storage/v1/object/public/product-images/<file>
```

The copies under `public/products/` are the **upload source** for the seed
script, and a few double as site chrome (the homepage hero and the About
photo). They are not what the catalogue serves.

`next.config.ts` currently allows every HTTPS host. **Tighten
`images.remotePatterns` to your own Supabase hostname before production:**

```ts
remotePatterns: [{ protocol: "https", hostname: "<project-ref>.supabase.co" }]
```

---

## Not included

Deliberately out of scope for this build — each is a clean addition later:

- **Payments.** Orders are placed and invoiced manually; nothing is charged on the
  site. A Stripe Checkout session would slot into `placeOrder` after step 3.
- **Inbound email.** Outbound transactional email is wired up (see below), but
  receiving mail at your address is a DNS/mailbox concern, not an app one.
- **Stock in a transaction.** Stock is decremented after the order is written, on a
  best-effort basis. Under heavy concurrency, move steps 1–5 into a Postgres function
  and call it via RPC.

---

## Scripts

```bash
npm run dev          # dev server
npm run build        # production build
npm run start        # serve the production build
npm run lint         # eslint
npm run seed:images  # upload demo imagery to Storage + generate the seed
```
# heartlandhaysupply
