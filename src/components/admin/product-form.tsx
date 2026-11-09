"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button, buttonClass } from "@/components/ui/button";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/field";
import { TrashIcon } from "@/components/ui/icons";
import { ImageUpload } from "@/components/admin/image-upload";
import { slugify } from "@/lib/format";
import { createProduct, deleteProduct, updateProduct } from "@/app/actions/admin";
import { emptyAdminState } from "@/lib/action-state";
import type { Category, ProductWithRelations } from "@/lib/types/database";

const UNITS = [
  { value: "bale", label: "Per bale" },
  { value: "bundle", label: "Per bundle" },
  { value: "pallet", label: "Per pallet" },
  { value: "ton", label: "Per ton" },
];

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: ProductWithRelations;
}) {
  const isEdit = Boolean(product);
  const [state, formAction] = useActionState(
    isEdit ? updateProduct : createProduct,
    emptyAdminState,
  );

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [images, setImages] = useState<string[]>(
    product
      ? [...product.product_images].sort((a, b) => a.sort_order - b.sort_order).map((i) => i.url)
      : [],
  );
  const [newImage, setNewImage] = useState("");

  const errors = state.fieldErrors ?? {};

  function addImageUrl(url: string) {
    setImages((current) =>
      current.includes(url) ? current : [...current, url].slice(0, 8),
    );
  }

  function addImage() {
    const url = newImage.trim();
    if (!url) return;
    addImageUrl(url);
    setNewImage("");
  }

  return (
    <form action={formAction} className="max-w-5xl space-y-12">
      {isEdit && <input type="hidden" name="id" value={product!.id} />}
      {images.map((url) => (
        <input key={url} type="hidden" name="imageUrls" value={url} />
      ))}

      {state.message && (
        <p
          role="status"
          className={`border-l-2 px-4 py-3 text-sm ${
            state.ok
              ? "border-success bg-success/5 text-success"
              : "border-danger bg-danger/5 text-danger"
          }`}
        >
          {state.message}
        </p>
      )}

      {/* Basics */}
      <Fieldset title="Basics">
        <div className="grid gap-7 sm:grid-cols-2">
          <Field label="Name" htmlFor="name" required error={errors.name}>
            <Input
              id="name"
              name="name"
              value={name}
              required
              onChange={(e) => {
                setName(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
            />
          </Field>

          <Field
            label="Slug"
            htmlFor="slug"
            required
            error={errors.slug}
            hint="The URL: /products/your-slug"
          >
            <Input
              id="slug"
              name="slug"
              value={slug}
              required
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              onBlur={(e) => setSlug(slugify(e.target.value))}
            />
          </Field>
        </div>

        <Field label="Category" htmlFor="categoryId" error={errors.categoryId}>
          <Select
            id="categoryId"
            name="categoryId"
            defaultValue={product?.category_id ?? ""}
          >
            <option value="">— None —</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Summary"
          htmlFor="summary"
          error={errors.summary}
          hint="One line, shown on cards and search results."
        >
          <Input id="summary" name="summary" defaultValue={product?.summary ?? ""} />
        </Field>

        <Field label="Description" htmlFor="description" error={errors.description}>
          <Textarea
            id="description"
            name="description"
            rows={6}
            defaultValue={product?.description ?? ""}
          />
        </Field>
      </Fieldset>

      {/* Pricing & stock */}
      <Fieldset title="Pricing & stock">
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Price" htmlFor="price" required error={errors.price} hint="Major units, e.g. 18.50">
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={product ? (product.price_cents / 100).toFixed(2) : ""}
            />
          </Field>

          <Field
            label="Compare at"
            htmlFor="compareAtPrice"
            error={errors.compareAtPrice}
            hint="Shows a strike-through"
          >
            <Input
              id="compareAtPrice"
              name="compareAtPrice"
              type="number"
              step="0.01"
              min="0"
              defaultValue={
                product?.compare_at_price_cents
                  ? (product.compare_at_price_cents / 100).toFixed(2)
                  : ""
              }
            />
          </Field>

          <Field label="Sold by" htmlFor="unit" error={errors.unit}>
            <Select id="unit" name="unit" defaultValue={product?.unit ?? "bale"}>
              {UNITS.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="SKU" htmlFor="sku" error={errors.sku}>
            <Input id="sku" name="sku" defaultValue={product?.sku ?? ""} />
          </Field>

          <Field label="Stock quantity" htmlFor="stockQuantity" required error={errors.stockQuantity}>
            <Input
              id="stockQuantity"
              name="stockQuantity"
              type="number"
              min="0"
              required
              defaultValue={product?.stock_quantity ?? 0}
            />
          </Field>

          <Field
            label="Min order qty"
            htmlFor="minOrderQuantity"
            required
            error={errors.minOrderQuantity}
          >
            <Input
              id="minOrderQuantity"
              name="minOrderQuantity"
              type="number"
              min="1"
              required
              defaultValue={product?.min_order_quantity ?? 1}
            />
          </Field>
        </div>
      </Fieldset>

      {/* Forage attributes */}
      <Fieldset title="Forage attributes" description="These render as the spec table on the product page.">
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Hay type" htmlFor="hayType" error={errors.hayType} hint="Timothy, Orchard Grass…">
            <Input id="hayType" name="hayType" defaultValue={product?.hay_type ?? ""} />
          </Field>
          <Field label="Cutting" htmlFor="cut" error={errors.cut} hint="1st, 2nd, 3rd">
            <Input id="cut" name="cut" defaultValue={product?.cut ?? ""} />
          </Field>
          <Field label="Bale shape" htmlFor="baleShape" error={errors.baleShape}>
            <Input id="baleShape" name="baleShape" defaultValue={product?.bale_shape ?? ""} />
          </Field>
          <Field label="Bale weight (kg)" htmlFor="baleWeightKg" error={errors.baleWeightKg}>
            <Input
              id="baleWeightKg"
              name="baleWeightKg"
              type="number"
              step="0.01"
              min="0"
              defaultValue={product?.bale_weight_kg ?? ""}
            />
          </Field>
          <Field label="Protein %" htmlFor="proteinPercent" error={errors.proteinPercent}>
            <Input
              id="proteinPercent"
              name="proteinPercent"
              type="number"
              step="0.1"
              min="0"
              max="100"
              defaultValue={product?.protein_percent ?? ""}
            />
          </Field>
          <Field label="Moisture %" htmlFor="moisturePercent" error={errors.moisturePercent}>
            <Input
              id="moisturePercent"
              name="moisturePercent"
              type="number"
              step="0.1"
              min="0"
              max="100"
              defaultValue={product?.moisture_percent ?? ""}
            />
          </Field>
          <Field label="Harvest year" htmlFor="harvestYear" error={errors.harvestYear}>
            <Input
              id="harvestYear"
              name="harvestYear"
              type="number"
              min="1900"
              max="2200"
              defaultValue={product?.harvest_year ?? ""}
            />
          </Field>
          <Field label="Origin" htmlFor="origin" error={errors.origin}>
            <Input id="origin" name="origin" defaultValue={product?.origin ?? ""} />
          </Field>
        </div>
      </Fieldset>

      {/* Images */}
      <Fieldset
        title="Images"
        description="Upload from your computer, or paste a URL. The first image is the one shown on cards and in search results."
      >
        {images.length > 0 && (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {images.map((url, index) => (
              <li key={url} className="group relative aspect-square overflow-hidden bg-paper-soft">
                <Image src={url} alt="" fill sizes="200px" className="object-cover" />
                {index === 0 && (
                  <span className="eyebrow absolute top-2 left-2 bg-ink px-2 py-1 text-paper">
                    Primary
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setImages((c) => c.filter((u) => u !== url))}
                  aria-label="Remove image"
                  className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-paper/90 text-ink opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <TrashIcon className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <ImageUpload
          multiple
          folder={slug || undefined}
          disabled={images.length >= 8}
          onUploaded={addImageUrl}
          hint={
            images.length >= 8
              ? "Maximum of 8 images reached."
              : `JPEG, PNG, WebP or AVIF · up to 5 MB each · ${8 - images.length} slot${
                  8 - images.length === 1 ? "" : "s"
                } left`
          }
        />

        <details className="group">
          <summary className="cursor-pointer text-xs text-muted hover:text-ink">
            Or add one by URL
          </summary>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <div className="min-w-64 flex-1">
              <Field label="Image URL" htmlFor="newImage">
                <Input
                  id="newImage"
                  type="url"
                  value={newImage}
                  placeholder="https://…"
                  onChange={(e) => setNewImage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addImage();
                    }
                  }}
                />
              </Field>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addImage}
              disabled={images.length >= 8}
            >
              Add image
            </Button>
          </div>
        </details>
      </Fieldset>

      {/* Visibility */}
      <Fieldset title="Visibility">
        <div className="space-y-4">
          <Toggle
            name="isActive"
            label="Live on the storefront"
            hint="Hidden products are invisible to shoppers and excluded by RLS."
            defaultChecked={product?.is_active ?? true}
          />
          <Toggle
            name="isFeatured"
            label="Feature on the homepage"
            defaultChecked={product?.is_featured ?? false}
          />
          <Toggle
            name="isOrganic"
            label="Certified organic"
            defaultChecked={product?.is_organic ?? false}
          />
        </div>
      </Fieldset>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-paper-line pt-8">
        <div className="flex gap-3">
          <SubmitButton isEdit={isEdit} />
          <Link href="/admin/products" className={buttonClass("ghost", "lg")}>
            Cancel
          </Link>
        </div>

        {isEdit && (
          <div className="flex items-center gap-4">
            <Link
              href={`/products/${product!.slug}`}
              target="_blank"
              className="text-xs underline-offset-4 hover:underline"
            >
              View on store ↗
            </Link>
            <DeleteButton name={product!.name} />
          </div>
        )}
      </div>
    </form>
  );
}

function Fieldset({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="space-y-7">
      <legend className="w-full border-b border-paper-line pb-4">
        <span className="eyebrow block text-muted">{title}</span>
        {description && <span className="mt-2 block text-xs text-muted">{description}</span>}
      </legend>
      {children}
    </fieldset>
  );
}

function Toggle({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <Checkbox name={name} defaultChecked={defaultChecked} className="mt-1" />
      <span>
        <span className="block text-sm">{label}</span>
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </span>
    </label>
  );
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? "Saving…" : isEdit ? "Save changes" : "Create product"}
    </Button>
  );
}

/**
 * Submits the surrounding product form to deleteProduct instead of
 * updateProduct. A nested <form> would be invalid HTML and breaks
 * hydration, and the hidden `id` field this action needs is already
 * in the parent form.
 *
 * formNoValidate skips the parent form’s `required` checks — you must be
 * able to delete a product even while the form holds an invalid edit.
 */
function DeleteButton({ name }: { name: string }) {
  return (
    <button
      type="submit"
      formAction={deleteProduct}
      formNoValidate
      onClick={(event) => {
        if (!confirm(`Delete “${name}”? This cannot be undone.`)) event.preventDefault();
      }}
      className="text-xs text-danger underline-offset-4 hover:underline"
    >
      Delete product
    </button>
  );
}
