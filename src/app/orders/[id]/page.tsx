"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Package, Clock, MapPin, Phone, User } from "lucide-react";
import { useOrders } from "@/lib/order-context";
import { formatPrice, getEffectivePrice } from "@/lib/format";
import { formatOrderDateTime, statusLabels } from "@/lib/order-status";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id ?? "");
  const { getOrder, hydrated } = useOrders();
  const order = hydrated ? getOrder(id) : undefined;

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <p className="text-sm text-forest/50">Loading order…</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <EmptyState
          icon={<Package className="h-16 w-16" aria-hidden />}
          title="Order not found"
          description={`We couldn't find ${id || "that order"} in this browser. Orders are stored locally on the device that placed them.`}
          action={
            <Link href="/orders">
              <Button>View all orders</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const status = statusLabels[order.status];
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-sm text-forest/60">
        <Link href="/orders" className="text-terracotta hover:underline">
          ← My Orders
        </Link>
      </p>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-forest">
            {order.id}
          </h1>
          <p className="mt-1 flex items-center gap-1 text-forest/60">
            <Clock className="h-4 w-4" aria-hidden />
            {formatOrderDateTime(order.date)}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}
        >
          {status.label}
        </span>
      </div>

      <section className="mt-8 rounded-2xl border border-sage/50 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-semibold text-forest">Items</h2>
        <ul className="mt-4 divide-y divide-sage/40">
          {order.items.map(({ product, quantity }) => (
            <li
              key={product.id}
              className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div>
                <Link
                  href={`/products/${product.slug}`}
                  className="font-medium text-forest hover:underline"
                >
                  {product.name}
                </Link>
                <p className="text-sm text-forest/60">
                  {product.unit} · Qty {quantity}
                </p>
              </div>
              <span className="shrink-0 font-medium text-forest">
                {formatPrice(getEffectivePrice(product) * quantity)}
              </span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-sage/50 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-forest/60">
              Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
            </dt>
            <dd>{formatPrice(order.subtotal)}</dd>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between">
              <dt className="text-forest/60">
                Discount{order.couponCode ? ` (${order.couponCode})` : ""}
              </dt>
              <dd className="text-forest-light">−{formatPrice(order.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-forest/60">
              {order.deliveryType === "collect" ? "Pickup" : "Delivery"}
            </dt>
            <dd>
              {order.deliveryFee === 0 ? "Free" : formatPrice(order.deliveryFee)}
            </dd>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <dt>Total</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 rounded-2xl border border-sage/50 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-semibold text-forest">
          {order.deliveryType === "collect" ? "Click & Collect" : "Delivery"}
        </h2>
        <ul className="mt-4 space-y-3 text-sm text-forest/80">
          <li className="flex items-start gap-2">
            <User className="mt-0.5 h-4 w-4 shrink-0 text-sage" aria-hidden />
            <span>{order.customer.name}</span>
          </li>
          <li className="flex items-start gap-2">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sage" aria-hidden />
            <span>{order.customer.phone}</span>
          </li>
          {order.deliveryType === "delivery" && (
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage" aria-hidden />
              <span>
                {order.customer.address}
                {order.customer.pincode ? ` — ${order.customer.pincode}` : ""}
              </span>
            </li>
          )}
          {order.deliveryType === "collect" && (
            <li className="text-forest/60">
              Pick up at 42 Market Street, Koramangala, Bengaluru 560034
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
