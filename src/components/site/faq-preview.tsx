import { FAQS } from "@/lib/faqs";

export function FaqPreview({ limit = 4 }: { limit?: number }) {
  return (
    <div className="divide-y divide-paper-line border-y border-paper-line">
      {FAQS.slice(0, limit).map((faq) => (
        <details key={faq.q} className="group py-6">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
            <h3 className="text-base font-medium">{faq.q}</h3>
            <span
              aria-hidden
              className="mt-1 shrink-0 text-xl leading-none text-muted transition-transform duration-300 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-dark">{faq.a}</p>
        </details>
      ))}
    </div>
  );
}
