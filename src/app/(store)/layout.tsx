import Script from "next/script";
import { CartProvider } from "@/components/cart/cart-provider";
import { SetupNotice } from "@/components/site/setup-notice";
import { isSupabaseConfigured } from "@/lib/env";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";

/**
 * Storefront shell. The admin panel sits outside this group so it gets
 * neither the shop chrome nor the cart.
 */
export default function StoreLayout({ children }: { children: React.ReactNode }) {
  // One check at the top of the tree, so a fresh clone shows setup
  // instructions instead of a 500 on every route.
  if (!isSupabaseConfigured()) return <SetupNotice />;

  return (
    <CartProvider>
      <Header />
      <main className="min-h-dvh">{children}</main>
      <Footer />
      <CartDrawer />

      {/*
        Jivo live chat. `lazyOnload` defers it to browser idle time, after the
        page's own resources have been fetched — the strategy Next documents
        for chat widgets, so the widget never competes with the hero image.
        Loaded here rather than in the root layout so it stays off the admin
        panel. Widget id comes from the Jivo dashboard.
      */}
      <Script src="https://code.jivosite.com/widget/E2UAXdXYto" strategy="lazyOnload" />
    </CartProvider>
  );
}
