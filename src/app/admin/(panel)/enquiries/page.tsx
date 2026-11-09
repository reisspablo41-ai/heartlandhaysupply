import { AdminBody, AdminHeader, EmptyState } from "@/components/admin/page-shell";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/format";
import { setEnquiryHandled } from "@/app/actions/admin";
import type { Enquiry } from "@/lib/types/database";

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("enquiries")
    .select("*")
    .order("is_handled", { ascending: true })
    .order("created_at", { ascending: false });

  const enquiries = (data ?? []) as Enquiry[];
  const open = enquiries.filter((e) => !e.is_handled).length;

  return (
    <>
      <AdminHeader
        title="Enquiries"
        description={`${open} awaiting a reply out of ${enquiries.length} total.`}
      />

      <AdminBody>
        {enquiries.length === 0 ? (
          <EmptyState
            title="No enquiries"
            body="Bulk and wholesale messages from the contact form land here."
          />
        ) : (
          <ul className="max-w-4xl divide-y divide-paper-line border-y border-paper-line">
            {enquiries.map((enquiry) => (
              <li
                key={enquiry.id}
                className={enquiry.is_handled ? "py-6 opacity-50" : "py-6"}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">{enquiry.name}</p>
                    <p className="mt-1 text-xs text-muted">
                      <a
                        href={`mailto:${enquiry.email}`}
                        className="underline-offset-4 hover:underline"
                      >
                        {enquiry.email}
                      </a>
                      {enquiry.phone && (
                        <>
                          {" · "}
                          <a
                            href={`tel:${enquiry.phone}`}
                            className="underline-offset-4 hover:underline"
                          >
                            {enquiry.phone}
                          </a>
                        </>
                      )}
                      {" · "}
                      {formatDateTime(enquiry.created_at)}
                    </p>
                  </div>

                  <form action={setEnquiryHandled}>
                    <input type="hidden" name="id" value={enquiry.id} />
                    <input type="hidden" name="next" value={String(!enquiry.is_handled)} />
                    <button
                      type="submit"
                      className="eyebrow border border-ink/15 px-3 py-2 transition-colors hover:border-ink"
                    >
                      {enquiry.is_handled ? "Reopen" : "Mark handled"}
                    </button>
                  </form>
                </div>

                <p className="mt-4 max-w-2xl text-sm leading-relaxed whitespace-pre-line text-muted-dark">
                  {enquiry.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </AdminBody>
    </>
  );
}
