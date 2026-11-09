"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { submitEnquiry } from "@/app/actions/checkout";
import { emptyActionState } from "@/lib/action-state";

export function EnquiryForm() {
  const [state, formAction] = useActionState(submitEnquiry, emptyActionState);
  const errors = state.fieldErrors ?? {};

  if (state.ok) {
    return (
      <div className="flex min-h-80 flex-col justify-center border border-paper-line p-10">
        <p className="display text-3xl">Message sent</p>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-dark">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-7">
      <h2 className="eyebrow border-b border-paper-line pb-4 text-muted">Send a message</h2>

      {state.message && (
        <p
          role="alert"
          className="border-l-2 border-danger bg-danger/5 px-4 py-3 text-sm text-danger"
        >
          {state.message}
        </p>
      )}

      <div className="grid gap-7 sm:grid-cols-2">
        <Field label="Name" htmlFor="name" required error={errors.name}>
          <Input id="name" name="name" autoComplete="name" required />
        </Field>
        <Field label="Email" htmlFor="email" required error={errors.email}>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </Field>
      </div>

      <Field label="Phone" htmlFor="phone" error={errors.phone} hint="Optional">
        <Input id="phone" name="phone" type="tel" autoComplete="tel" />
      </Field>

      <Field
        label="Message"
        htmlFor="message"
        required
        error={errors.message}
        hint="What are you feeding, how much, and where does it need to go?"
      >
        <Textarea id="message" name="message" rows={6} required />
      </Field>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? "Sending…" : "Send message"}
    </Button>
  );
}
