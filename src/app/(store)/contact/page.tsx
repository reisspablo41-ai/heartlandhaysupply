import type { Metadata } from "next";
import { PageHeader } from "@/components/site/page-header";
import { EnquiryForm } from "@/components/site/enquiry-form";

export const metadata: Metadata = {
  title: "Contact & bulk enquiries",
  description: "Talk to a forage specialist about tonnage, freight or feeding advice.",
};

const DETAILS = [
  { label: "Email", value: "contact@heartandhaysupply.com", href: "mailto:contact@heartandhaysupply.com" },
  { label: "Yard hours", value: "Mon–Sat, 7am – 6pm PT" },
  { label: "Address", value: "4120 County Road 12, Walla Walla, WA 99362" },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title="Talk to someone who has actually baled it"
        lede="Feeding advice, freight quotes, contract tonnage or a problem with a load — we'd rather hear about it than not."
      />

      <div className="gutter py-16">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-24">
          <div>
            <h2 className="eyebrow text-muted">Where to find us</h2>
            <dl className="mt-7 divide-y divide-paper-line border-y border-paper-line">
              {DETAILS.map((detail) => (
                <div key={detail.label} className="py-5">
                  <dt className="eyebrow text-muted">{detail.label}</dt>
                  <dd className="mt-2 text-sm">
                    {detail.href ? (
                      <a
                        href={detail.href}
                        className="underline-offset-4 hover:underline"
                      >
                        {detail.value}
                      </a>
                    ) : (
                      detail.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <div id="bulk" className="mt-12 scroll-mt-28 bg-paper-soft p-7">
              <h3 className="display text-xl">Bulk & contract tonnage</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-dark">
                Feeding over 50 ton a year? Reserve from a standing crop and we’ll hold your
                lots through the season at a fixed rate, delivered on a schedule you set.
                Use the form and mention your annual volume.
              </p>
            </div>
          </div>

          <EnquiryForm />
        </div>
      </div>
    </>
  );
}
