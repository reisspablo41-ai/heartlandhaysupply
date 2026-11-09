"use client";

import { useId, useRef, useState, type DragEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn, slugify } from "@/lib/format";

const BUCKET = "product-images";

/** Must stay in step with supabase/migrations/0002_storage.sql. */
const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

interface Props {
  /** Called once per successfully uploaded file, with its public URL. */
  onUploaded: (url: string) => void;
  multiple?: boolean;
  disabled?: boolean;
  /** Folder inside the bucket, e.g. the product slug. */
  folder?: string;
  hint?: string;
}

/**
 * Uploads straight from the browser to Supabase Storage using the signed-in
 * admin's session.
 *
 * Deliberately not a server action: those cap request bodies at ~1 MB by
 * default, which most photos exceed. Going direct also means the bucket's
 * own RLS policy is what authorises the write, rather than a service-role
 * key that would have to be trusted with everything.
 */
export function ImageUpload({
  onUploaded,
  multiple = true,
  disabled,
  folder,
  hint,
}: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);

  function explain(message: string): string {
    const m = message.toLowerCase();
    if (m.includes("bucket not found")) {
      return `The "${BUCKET}" bucket doesn't exist yet — run supabase/migrations/0002_storage.sql.`;
    }
    if (m.includes("row-level security") || m.includes("unauthorized") || m.includes("403")) {
      return "Upload refused. Check your account is in admin_users and that 0002_storage.sql has been run.";
    }
    if (m.includes("exceeded") || m.includes("too large")) {
      return "That file is over the bucket's 5 MB limit.";
    }
    return message;
  }

  async function upload(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    setBusy(true);
    setErrors([]);
    const failures: string[] = [];
    const supabase = createClient();

    for (const [index, file] of files.entries()) {
      setStatus(
        files.length > 1
          ? `Uploading ${index + 1} of ${files.length}…`
          : `Uploading ${file.name}…`,
      );

      if (!ACCEPTED.includes(file.type)) {
        failures.push(`${file.name}: must be a JPEG, PNG, WebP or AVIF.`);
        continue;
      }
      if (file.size > MAX_BYTES) {
        failures.push(
          `${file.name}: ${(file.size / 1024 / 1024).toFixed(1)} MB exceeds the 5 MB limit.`,
        );
        continue;
      }

      // Unique path, but still readable in the Supabase dashboard.
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const stem = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";
      const unique = crypto.randomUUID().slice(0, 8);
      const path = [folder, `${stem}-${unique}.${ext}`].filter(Boolean).join("/");

      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        contentType: file.type,
        cacheControl: "31536000",
        upsert: false,
      });

      if (error) {
        failures.push(`${file.name}: ${explain(error.message)}`);
        continue;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET).getPublicUrl(path);

      onUploaded(publicUrl);
    }

    setErrors(failures);
    setStatus(null);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    if (disabled || busy) return;
    if (event.dataTransfer.files?.length) void upload(event.dataTransfer.files);
  }

  return (
    <div className="space-y-3">
      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled && !busy) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed px-6 py-10 text-center transition-colors",
          dragging ? "border-ink bg-paper-soft" : "border-ink/20 hover:border-ink/50",
          (disabled || busy) && "pointer-events-none opacity-50",
        )}
      >
        <UploadGlyph className="size-6 text-muted" />
        <span className="text-sm">
          {busy ? (
            status
          ) : (
            <>
              <span className="underline underline-offset-4">Choose {multiple ? "images" : "an image"}</span>
              {" or drag and drop"}
            </>
          )}
        </span>
        <span className="text-xs text-muted">
          {hint ?? "JPEG, PNG, WebP or AVIF · up to 5 MB each"}
        </span>
      </label>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPTED.join(",")}
        multiple={multiple}
        disabled={disabled || busy}
        className="sr-only"
        onChange={(e) => {
          if (e.target.files?.length) void upload(e.target.files);
        }}
      />

      {errors.length > 0 && (
        <ul role="alert" className="space-y-1">
          {errors.map((message) => (
            <li key={message} className="text-xs text-danger">
              {message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function UploadGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 16V4m0 0L8 8m4-4 4 4" />
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}
