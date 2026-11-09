import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { FAQS } from "@/lib/faqs";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Common questions about cuts, storage, feeding rates, freight and returns.",
};


export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="Help"
        title="Frequently asked"
        lede="Cuts, storage, feeding rates, freight and returns."
      />

      <div className="gutter py-16">
        <div className="max-w-3xl divide-y divide-paper-line border-y border-paper-line">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                <h2 className="text-base font-medium">{faq.q}</h2>
                <span
                  aria-hidden
                  className="mt-1 shrink-0 text-xl leading-none text-muted transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-dark">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </>
  );
}
