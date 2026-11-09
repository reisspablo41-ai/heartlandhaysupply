"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, Textarea } from "@/components/ui/field";
import { TrashIcon } from "@/components/ui/icons";
import { slugify } from "@/lib/format";
import { ImageUpload } from "@/components/admin/image-upload";
import { deleteCategory, saveCategory } from "@/app/actions/admin";
import { emptyAdminState } from "@/lib/action-state";
import type { Category } from "@/lib/types/database";

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [editing, setEditing] = useState<Category | null>(null);

  return (
    <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
      {/* List */}
      <div>
        <h2 className="eyebrow border-b border-paper-line pb-4 text-muted">
          {categories.length} {categories.length === 1 ? "category" : "categories"}
        </h2>

        {categories.length === 0 ? (
          <p className="py-14 text-center text-sm text-muted">
            No categories yet — create one on the right.
          </p>
        ) : (
          <ul className="divide-y divide-paper-line">
            {categories.map((category) => (
              <li key={category.id} className="flex items-center gap-4 py-4">
                <div className="relative size-14 shrink-0 overflow-hidden bg-paper-soft">
                  {category.image_url && (
                    <Image
                      src={category.image_url}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{category.name}</p>
                  <p className="truncate text-xs text-muted">
                    /{category.slug} · order {category.sort_order}
                    {!category.is_active && " · hidden"}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => setEditing(category)}
                    className="eyebrow border border-ink/15 px-3 py-2 transition-colors hover:border-ink"
                  >
                    Edit
                  </button>
                  <form
                    action={deleteCategory}
                    onSubmit={(event) => {
                      if (
                        !confirm(
                          `Delete “${category.name}”? Products in it stay, but lose their category.`,
                        )
                      ) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <input type="hidden" name="id" value={category.id} />
                    <button
                      type="submit"
                      className="eyebrow border border-ink/15 px-3 py-2 text-danger transition-colors hover:border-danger"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Form */}
      <CategoryForm
        key={editing?.id ?? "new"}
        category={editing}
        onDone={() => setEditing(null)}
      />
    </div>
  );
}

function CategoryForm({
  category,
  onDone,
}: {
  category: Category | null;
  onDone: () => void;
}) {
  const [state, formAction] = useActionState(saveCategory, emptyAdminState);
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(category));
  const [imageUrl, setImageUrl] = useState(category?.image_url ?? "");

  const errors = state.fieldErrors ?? {};

  return (
    <aside className="h-fit border border-paper-line p-7 lg:sticky lg:top-8">
      <div className="flex items-center justify-between border-b border-paper-line pb-4">
        <h2 className="eyebrow text-muted">
          {category ? "Edit category" : "New category"}
        </h2>
        {category && (
          <button onClick={onDone} className="text-xs text-muted hover:text-ink">
            Cancel
          </button>
        )}
      </div>

      <form action={formAction} className="mt-7 space-y-6">
        {category && <input type="hidden" name="id" value={category.id} />}

        {state.message && (
          <p
            role="status"
            className={`border-l-2 px-3 py-2 text-xs ${
              state.ok
                ? "border-success bg-success/5 text-success"
                : "border-danger bg-danger/5 text-danger"
            }`}
          >
            {state.message}
          </p>
        )}

        <Field label="Name" htmlFor="cat-name" required error={errors.name}>
          <Input
            id="cat-name"
            name="name"
            value={name}
            required
            onChange={(e) => {
              setName(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
          />
        </Field>

        <Field label="Slug" htmlFor="cat-slug" required error={errors.slug}>
          <Input
            id="cat-slug"
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

        <Field label="Description" htmlFor="cat-description" error={errors.description}>
          <Textarea
            id="cat-description"
            name="description"
            rows={3}
            defaultValue={category?.description ?? ""}
          />
        </Field>

        <Field
          label="Banner image"
          htmlFor="cat-image"
          error={errors.imageUrl}
          hint="Used on the category banner and the homepage tile."
        >
          <Input
            id="cat-image"
            name="imageUrl"
            type="url"
            placeholder="https://… or upload below"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </Field>

        {imageUrl ? (
          <div className="relative aspect-video overflow-hidden bg-paper-soft">
            <Image src={imageUrl} alt="" fill sizes="400px" className="object-cover" />
            <button
              type="button"
              onClick={() => setImageUrl("")}
              aria-label="Remove banner image"
              className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-paper/90 text-ink"
            >
              <TrashIcon className="size-3.5" />
            </button>
          </div>
        ) : (
          <ImageUpload
            multiple={false}
            folder="categories"
            onUploaded={setImageUrl}
            hint="JPEG, PNG, WebP or AVIF · up to 5 MB"
          />
        )}

        <Field label="Sort order" htmlFor="cat-sort" required error={errors.sortOrder}>
          <Input
            id="cat-sort"
            name="sortOrder"
            type="number"
            min="0"
            required
            defaultValue={category?.sort_order ?? 0}
          />
        </Field>

        <label className="flex cursor-pointer items-center gap-3">
          <Checkbox name="isActive" defaultChecked={category?.is_active ?? true} />
          <span className="text-sm">Visible on the storefront</span>
        </label>

        <SubmitButton isEdit={Boolean(category)} />
      </form>
    </aside>
  );
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="md" disabled={pending} className="w-full">
      {pending ? "Saving…" : isEdit ? "Save category" : "Create category"}
    </Button>
  );
}
