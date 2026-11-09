import type { Metadata } from "next";
import { HeaderSpacer } from "@/components/site/header";
import { CartTable } from "@/components/cart/cart-table";

export const metadata: Metadata = { title: "Your cart" };

export default function CartPage() {
  return (
    <>
      <HeaderSpacer />
      <div className="gutter pt-14 pb-24">
        <header className="border-b border-paper-line pb-8">
          <p className="eyebrow text-muted">Step 1 of 2</p>
          <h1 className="display mt-4 text-[clamp(2.4rem,6vw,4.5rem)]">Your cart</h1>
        </header>
        <CartTable />
      </div>
    </>
  );
}
