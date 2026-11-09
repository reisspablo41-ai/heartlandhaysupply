-- ============================================================
-- Demo catalogue. Safe to re-run (idempotent on slug).
-- Run AFTER 0001_init.sql / 0002_storage.sql.
--
-- Product imagery lives in the `product-images` Supabase Storage
-- bucket. Upload it first:
--
--     npm run seed:images
--
-- That uploads public/products/*.jpg to the bucket AND writes
-- supabase/seed.generated.sql with the URLs below already pointing
-- at your project — run that file rather than this one.
--
-- To use this file directly instead, replace every occurrence of
-- YOUR-PROJECT-REF with your Supabase project ref.
-- Licensing for the demo photos: public/products/CREDITS.md
-- ============================================================

insert into public.categories (name, slug, description, image_url, sort_order) values
  ('Grass Hay',       'grass-hay',     'Timothy, orchard, bermuda, fescue, brome and teff — the everyday forage most animals live on.', 'https://YOUR-PROJECT-REF.supabase.co/storage/v1/object/public/product-images/hay-green-field-bale.jpg', 1),
  ('Alfalfa',         'alfalfa',       'High protein, high calcium. Fed as part of a ration for performance animals and hard keepers.', 'https://YOUR-PROJECT-REF.supabase.co/storage/v1/object/public/product-images/hay-mountain-field.jpg', 2),
  ('Straw & Bedding', 'straw-bedding', 'Clean wheat and barley straw for stalls, coops and pens.', 'https://YOUR-PROJECT-REF.supabase.co/storage/v1/object/public/product-images/hay-baling-windrows.jpg', 3),
  ('Small Animal',    'small-animal',  'Hand-sorted, dust-extracted forage for rabbits, guinea pigs and chinchillas.', 'https://YOUR-PROJECT-REF.supabase.co/storage/v1/object/public/product-images/small-animal-rabbit.jpg', 4)
on conflict (slug) do nothing;

insert into public.products (
  category_id, name, slug, summary, description,
  price_cents, compare_at_price_cents, unit, sku, stock_quantity,
  hay_type, cut, bale_shape, bale_weight_kg, protein_percent, moisture_percent,
  harvest_year, origin, is_organic, is_featured
) values
  -- ── Grass hay ───────────────────────────────────────────
  (
    (select id from public.categories where slug = 'grass-hay'),
    'Premium Timothy — 2nd Cut', 'premium-timothy-2nd-cut',
    'Soft, leafy second cutting with a clean green colour and almost no stem.',
    'Our flagship grass hay. Cut at the pre-bloom stage, field-cured and baled dry under cover, so it keeps its colour and aroma right through winter. Second cutting means a finer stem and a higher leaf-to-stem ratio than first cut — the usual choice for horses in light to moderate work.',
    8500, 10100, 'bale', 'TIM-2C-SQ', 420,
    'Timothy', '2nd Cut', 'Small Square', 23.00, 9.50, 11.00,
    2025, 'Walla Walla, WA', false, true
  ),
  (
    (select id from public.categories where slug = 'grass-hay'),
    'Orchard Grass — 1st Cut', 'orchard-grass-1st-cut',
    'Palatable, mid-protein grass hay that most horses will clean up.',
    'A little higher in protein than timothy and softer than first-cut, which makes it an easy transition hay for picky eaters. Baled at 11% moisture and stored on pallets in a closed barn.',
    7800, null, 'bale', 'ORC-1C-SQ', 310,
    'Orchard Grass', '1st Cut', 'Small Square', 22.00, 11.20, 11.00,
    2025, 'Ellensburg, WA', false, false
  ),
  (
    (select id from public.categories where slug = 'grass-hay'),
    'Coastal Bermuda Round Bale', 'coastal-bermuda-round-bale',
    'Economical round bales for pasture feeding through the cold months.',
    'Fine-stemmed coastal bermuda, net-wrapped and stored under cover. Sold per 4x5 round bale — roughly the equivalent of 35 small squares. Loader or tractor required at delivery.',
    7500, 8400, 'bale', 'BER-RND-45', 95,
    'Bermuda', '2nd Cut', 'Round', 480.00, 10.80, 12.00,
    2025, 'Tifton, GA', false, false
  ),
  (
    (select id from public.categories where slug = 'grass-hay'),
    'Tall Fescue — Endophyte-Free', 'tall-fescue-endophyte-free',
    'Tested endophyte-free, so it is safe to feed to pregnant mares.',
    'Fescue is tough, drought-tolerant and cheap to grow, but wild stands carry an endophyte fungus that causes serious foaling problems in broodmares. This is a certified endophyte-free variety, lab-tested per lot, so it carries none of that risk. Coarser in the stem than timothy and best suited to cattle, sheep, goats and horses at maintenance.',
    7200, null, 'bale', 'FES-EF-SQ', 260,
    'Fescue', '1st Cut', 'Small Square', 24.00, 10.40, 11.00,
    2025, 'Lebanon, OR', false, false
  ),
  (
    (select id from public.categories where slug = 'grass-hay'),
    'Smooth Brome — 2nd Cut', 'smooth-brome-2nd-cut',
    'Leafy, sweet-smelling brome. A northern-plains staple that horses rarely refuse.',
    'Smooth brome holds its leaf better than most grasses, which keeps the protein up and the waste down. The second cutting is softer and finer than the first. A good middle ground if timothy is too lean for your stock but you do not want the calcium load of straight alfalfa.',
    8900, 10300, 'bale', 'BRM-2C-SQ', 190,
    'Brome', '2nd Cut', 'Small Square', 24.00, 11.60, 10.80,
    2025, 'Dickinson, ND', false, true
  ),
  (
    (select id from public.categories where slug = 'grass-hay'),
    'Teff Hay — Low Sugar', 'teff-hay-low-sugar',
    'Low non-structural carbohydrate. The hay to feed a laminitic or insulin-resistant horse.',
    'Teff is a warm-season annual that runs low in sugar and starch, typically under 10% NSC, which makes it one of the few hays safe for horses with laminitis, PPID or equine metabolic syndrome. Fine-stemmed, soft and dust-free. Every lot ships with its NSC analysis.',
    9500, null, 'bale', 'TEF-2C-SQ', 140,
    'Teff', '2nd Cut', 'Small Square', 21.00, 10.20, 10.50,
    2025, 'Parma, ID', false, true
  ),
  (
    (select id from public.categories where slug = 'grass-hay'),
    'Oat Hay — Soft Dough Stage', 'oat-hay-soft-dough',
    'Cereal hay cut with the grain still in the head. Bulky, sweet and filling.',
    'Cut at the soft dough stage, when the oat head has filled but not hardened, so the grain stays in the bale instead of shattering out on the field. High in fibre and palatable enough that it works well for cattle and for horses that need gut fill without much protein. Watch nitrate levels with drought-stressed oat hay — ours is tested on every lot.',
    6200, null, 'bale', 'OAT-1C-LG', 120,
    'Oat', '1st Cut', 'Large Square', 280.00, 9.00, 11.50,
    2025, 'Twin Falls, ID', false, false
  ),
  (
    (select id from public.categories where slug = 'grass-hay'),
    'Meadow Mix — Mixed Grass', 'meadow-mix-grass',
    'Native meadow grasses baled together. Our most economical feeding hay.',
    'Whatever the meadow grew — a changing mix of brome, fescue, bluegrass and timothy cut from permanent pasture. Protein varies a point or two between lots, so we test and publish each one. The cheapest way to put clean, honest forage in front of stock at maintenance.',
    6800, 7800, 'bale', 'MDW-1C-SQ', 380,
    'Meadow Grass', '1st Cut', 'Small Square', 23.00, 9.80, 11.00,
    2025, 'Burns, OR', false, false
  ),

  -- ── Alfalfa ─────────────────────────────────────────────
  (
    (select id from public.categories where slug = 'alfalfa'),
    'Alfalfa — Premium 3rd Cut', 'alfalfa-premium-3rd-cut',
    'High-protein alfalfa for broodmares, growing stock and dairy herds.',
    'Dense, deep-green alfalfa with the leaf retained — the leaf is where the protein lives, so a lot that has shattered on the field is worth far less than it looks. Tested above 18% crude protein and high in calcium, which means it is best fed as part of a ration rather than free choice. Shipped in large squares for operations feeding at volume.',
    8900, null, 'bale', 'ALF-3C-LG', 180,
    'Alfalfa', '3rd Cut', 'Large Square', 320.00, 18.40, 10.50,
    2025, 'Imperial Valley, CA', false, true
  ),

  -- ── Straw & bedding ─────────────────────────────────────
  (
    (select id from public.categories where slug = 'straw-bedding'),
    'Wheat Straw Bedding', 'wheat-straw-bedding',
    'Bright, hollow-stemmed straw. Absorbent, low dust, easy to muck out.',
    'Not a feed — bedding. Hollow wheat stems trap air and moisture, which keeps stalls drier and makes mucking faster. Combed and dust-extracted before baling.',
    6200, null, 'bale', 'STR-WHT-SQ', 600,
    'Wheat Straw', null, 'Small Square', 18.00, null, 10.00,
    2025, 'Great Bend, KS', false, false
  ),

  -- ── Small animal ────────────────────────────────────────
  (
    (select id from public.categories where slug = 'small-animal'),
    'Western Timothy — Small Animal', 'western-timothy-small-animal',
    'Hand-sorted, dust-extracted timothy in a 2 kg resealable bundle.',
    'The same second-cut timothy we bale for horses, run through a dust extractor and hand-sorted for coarse stems, then packed in a resealable 2 kg bundle. Suitable for rabbits, guinea pigs, chinchillas and tortoises.',
    1290, 1590, 'bundle', 'TIM-SA-2KG', 850,
    'Timothy', '2nd Cut', null, 2.00, 9.20, 10.00,
    2025, 'Walla Walla, WA', true, true
  )
on conflict (slug) do nothing;

-- One hero image per product.
insert into public.product_images (product_id, url, alt, sort_order)
select p.id, i.url, p.name, 0
from public.products p
join (values
  ('premium-timothy-2nd-cut',      'https://YOUR-PROJECT-REF.supabase.co/storage/v1/object/public/product-images/hay-field-sunset.jpg'),
  ('orchard-grass-1st-cut',        'https://YOUR-PROJECT-REF.supabase.co/storage/v1/object/public/product-images/hay-mowing-tractor.jpg'),
  ('coastal-bermuda-round-bale',   'https://YOUR-PROJECT-REF.supabase.co/storage/v1/object/public/product-images/hay-round-bale.jpg'),
  ('tall-fescue-endophyte-free',   'https://YOUR-PROJECT-REF.supabase.co/storage/v1/object/public/product-images/hay-green-field-bale.jpg'),
  ('smooth-brome-2nd-cut',         'https://YOUR-PROJECT-REF.supabase.co/storage/v1/object/public/product-images/hay-sunset-bales.jpg'),
  ('teff-hay-low-sugar',           'https://YOUR-PROJECT-REF.supabase.co/storage/v1/object/public/product-images/hay-mountain-field.jpg'),
  ('oat-hay-soft-dough',           'https://YOUR-PROJECT-REF.supabase.co/storage/v1/object/public/product-images/hay-stacked-bales.jpg'),
  ('meadow-mix-grass',             'https://YOUR-PROJECT-REF.supabase.co/storage/v1/object/public/product-images/hay-red-barn.jpg'),
  ('alfalfa-premium-3rd-cut',      'https://YOUR-PROJECT-REF.supabase.co/storage/v1/object/public/product-images/hay-wrapped-bales.jpg'),
  ('wheat-straw-bedding',          'https://YOUR-PROJECT-REF.supabase.co/storage/v1/object/public/product-images/hay-golden-stubble.jpg'),
  ('western-timothy-small-animal', 'https://YOUR-PROJECT-REF.supabase.co/storage/v1/object/public/product-images/small-animal-rabbit.jpg')
) as i(slug, url) on i.slug = p.slug
where not exists (
  select 1 from public.product_images pi where pi.product_id = p.id
);
