"use client";

import Link from "next/link";
import { Package, Clock } from "lucide-react";
import { useOrders } from "@/lib/order-context";
import { formatPrice } from "@/lib/format";
import { formatOrderDate, statusLabels } from "@/lib/order-status";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function OrdersPage() {
  const { orders, hydrated } = useOrders();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-forest">My Orders</h1>
      <p className="mt-1 text-forest/60">Track and review your order history</p>

      {!hydrated ? (
        <p className="mt-8 text-sm text-forest/50">Loading orders…</p>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<Package className="h-16 w-16" aria-hidden />}
          title="No orders yet"
          description="When you check out, your orders will show up here — saved in this browser."
          action={
            <Link href="/products">
              <Button size="lg">Shop Now</Button>
            </Link>
          }
        />
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => {
            const status = statusLabels[order.status];
            const itemCount = order.items.reduce(
              (sum, item) => sum + item.quantity,
              0
            );
            return (
              <article
                key={order.id}
                className="rounded-2xl border border-sage/50 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage/30 text-forest">
                      <Package className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <h2 className="font-medium text-forest">
                        <Link
                          href={`/orders/${order.id}`}
                          className="hover:underline"
                        >
                          {order.id}
                        </Link>
                      </h2>
                      <p className="flex items-center gap-1 text-sm text-forest/60">
                        <Clock className="h-3.5 w-3.5" aria-hidden />
                        {formatOrderDate(order.date)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}
                  >
                    {status.label}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-sage/50 pt-4 text-sm">
                  <span className="text-forest/60">
                    {itemCount} {itemCount === 1 ? "item" : "items"} ·{" "}
                    {order.deliveryType === "collect"
                      ? "Click & Collect"
                      : "Home Delivery"}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-forest">
                      {formatPrice(order.total)}
                    </span>
                    <Link
                      href={`/orders/${order.id}`}
                      className="font-medium text-terracotta hover:underline"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
