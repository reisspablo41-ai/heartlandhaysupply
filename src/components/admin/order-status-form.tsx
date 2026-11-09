"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Field, Select, Textarea } from "@/components/ui/field";
import { updateOrder } from "@/app/actions/admin";
import { emptyAdminState } from "@/lib/action-state";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUSES,
  PAYMENT_STATUS_LABELS,
} from "@/lib/status";
import type { Order } from "@/lib/types/database";

export function OrderStatusForm({ order }: { order: Order }) {
  const [state, formAction] = useActionState(updateOrder, emptyAdminState);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="id" value={order.id} />

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

      <Field label="Order status" htmlFor="status">
        <Select id="status" name="status" defaultValue={order.status}>
          {ORDER_STATUSES.map((value) => (
            <option key={value} value={value}>
              {ORDER_STATUS_LABELS[value]}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Payment" htmlFor="paymentStatus">
        <Select id="paymentStatus" name="paymentStatus" defaultValue={order.payment_status}>
          {PAYMENT_STATUSES.map((value) => (
            <option key={value} value={value}>
              {PAYMENT_STATUS_LABELS[value]}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        label="Internal notes"
        htmlFor="adminNotes"
        hint="Staff only — never shown to the customer."
      >
        <Textarea
          id="adminNotes"
          name="adminNotes"
          rows={4}
          defaultValue={order.admin_notes ?? ""}
        />
      </Field>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="md" disabled={pending} className="w-full">
      {pending ? "Saving…" : "Update order"}
    </Button>
  );
}
