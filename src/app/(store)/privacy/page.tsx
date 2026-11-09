import type { Metadata } from "next";
import { PageHeader, Prose } from "@/components/site/page-header";
import { STORE_NAME } from "@/lib/env";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy"
        lede="This is a starting point, not legal advice. Have it reviewed before you trade."
      />
      <Prose>
        <h2>What we collect</h2>
        <p>
          There are no customer accounts on this site. When you place an order we collect
          only what is needed to fulfil it: your name, email, phone number, delivery
          address, any company name and the notes you leave. We also keep the contents and
          totals of the order itself.
        </p>

        <h2>What we don’t collect</h2>
        <p>
          No passwords, no stored payment details and no customer login history — because
          there is nothing to log in to. Your cart lives in your own browser and is never
          sent to us until you check out.
        </p>

        <h2>How it’s stored</h2>
        <p>
          Order data is held in a Supabase Postgres database with row level security. Order
          records are not publicly readable; the private link in your confirmation email is
          the only non-staff route to your own order, which is why that link should be
          treated as confidential.
        </p>

        <h2>Who sees it</h2>
        <p>
          {STORE_NAME} staff, and the carriers who need an address to deliver to. We do not
          sell or rent personal data.
        </p>

        <h2>Your rights</h2>
        <p>
          Contact us to request a copy of what we hold about you, a correction, or deletion
          of your records once any open order is complete and our tax retention obligations
          have lapsed.
        </p>
      </Prose>
    </>
  );
}
