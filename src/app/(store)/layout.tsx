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
    </CartProvider>
  );
}
