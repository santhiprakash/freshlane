"use client";

import Link from "next/link";
import { Package, Boxes, BarChart3, Tag } from "lucide-react";
import { products } from "@/data/products";
import { offers } from "@/data/offers";
import { formatPrice, getEffectivePrice } from "@/lib/format";
import { isOfferActive } from "@/lib/coupons";
import { isSameLocalDay } from "@/lib/order-store";
import { useOrders } from "@/lib/order-context";
import { formatOrderDate, ORDER_STATUSES, statusLabels } from "@/lib/order-status";
import { EmptyState } from "@/components/ui/empty-state";
import type { OrderStatus } from "@/lib/types";

export default function AdminPage() {
  const { orders, hydrated, updateOrderStatus } = useOrders();
  const lowStock = products.filter((p) => !p.inStock);
  const activeOffers = offers.filter((offer) => isOfferActive(offer));
  const todaysOrders = orders.filter((order) => isSameLocalDay(order.date));
  const pendingCount = orders.filter((order) => order.status === "pending").length;

  const stats = [
    {
      label: "Today's Orders",
      value: hydrated ? String(todaysOrders.length) : "—",
      icon: Package,
    },
    { label: "Products", value: String(products.length), icon: Boxes },
    { label: "Low Stock", value: String(lowStock.length), icon: BarChart3 },
    {
      label: "Active Offers",
      value: String(activeOffers.length),
      icon: Tag,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-forest">
        Admin Dashboard
      </h1>
      <p className="mt-1 text-forest/60">
        Store operations for this browser — orders stay in local storage
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-sage/50 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-forest/60">{stat.label}</p>
              <stat.icon className="h-5 w-5 text-sage" aria-hidden />
            </div>
            <p className="mt-2 text-3xl font-semibold text-forest">{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-sage/50 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-semibold text-forest">
          Recent Orders
        </h2>
        {!hydrated ? (
          <p className="mt-4 text-sm text-forest/50">Loading orders…</p>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={<Package className="h-12 w-12" aria-hidden />}
            title="No orders yet"
            description="Orders placed from checkout will appear here so you can update their status."
          />
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sage/50 text-left text-forest/60">
                  <th className="pb-2 font-medium">Order</th>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Type</th>
                  <th className="pb-2 font-medium">Total</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-sage/30">
                    <td className="py-2.5">
                      <Link
                        href={`/orders/${order.id}`}
                        className="font-medium text-forest hover:underline"
                      >
                        {order.id}
                      </Link>
                    </td>
                    <td className="py-2.5 text-forest/80">
                      {formatOrderDate(order.date)}
                    </td>
                    <td className="py-2.5 text-forest/80">
                      {order.deliveryType === "collect"
                        ? "Collect"
                        : "Delivery"}
                    </td>
                    <td className="py-2.5 font-medium">
                      {formatPrice(order.total)}
                    </td>
                    <td className="py-2.5">
                      <label className="sr-only" htmlFor={`status-${order.id}`}>
                        Status for {order.id}
                      </label>
                      <select
                        id={`status-${order.id}`}
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(
                            order.id,
                            e.target.value as OrderStatus
                          )
                        }
                        className="rounded-lg border border-sage/50 bg-white px-2 py-1 text-forest focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {statusLabels[status].label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-sage/50 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-forest">
            Product Inventory
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sage/50 text-left text-forest/60">
                  <th className="pb-2 font-medium">Product</th>
                  <th className="pb-2 font-medium">Price</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 8).map((p) => (
                  <tr key={p.id} className="border-b border-sage/30">
                    <td className="py-2.5 text-forest">{p.name}</td>
                    <td className="py-2.5">{formatPrice(getEffectivePrice(p))}</td>
                    <td className="py-2.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          p.inStock
                            ? "bg-forest/10 text-forest"
                            : "bg-terracotta/10 text-terracotta"
                        }`}
                      >
                        {p.inStock ? "In Stock" : "Out"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-sage/50 bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-forest">Alerts</h2>
          <ul className="mt-4 space-y-3">
            {lowStock.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-lg bg-terracotta/5 px-3 py-2 text-sm"
              >
                <span className="text-forest">{p.name}</span>
                <span className="font-medium text-terracotta">Restock needed</span>
              </li>
            ))}
            {hydrated && pendingCount > 0 && (
              <li className="rounded-lg bg-sage/20 px-3 py-2 text-sm text-forest">
                {pendingCount}{" "}
                {pendingCount === 1 ? "order is" : "orders are"} pending
              </li>
            )}
            {hydrated && lowStock.length === 0 && pendingCount === 0 && (
              <li className="rounded-lg bg-sage/20 px-3 py-2 text-sm text-forest">
                No alerts right now
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
