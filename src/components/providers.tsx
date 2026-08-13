import { CartProvider } from "@/lib/cart-context";
import { OrderProvider } from "@/lib/order-context";
import { AccountProvider } from "@/lib/account-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <OrderProvider>
        <AccountProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AccountProvider>
      </OrderProvider>
    </CartProvider>
  );
}
