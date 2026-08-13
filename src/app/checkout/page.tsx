"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Truck, Store, CheckCircle } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useOrders } from "@/lib/order-context";
import { useAccount } from "@/lib/account-context";
import { getDefaultAddress } from "@/lib/account-store";
import { applyCoupon, calcDeliveryFee } from "@/lib/coupons";
import { formatPrice, getEffectivePrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import type { DeliveryType, Order } from "@/lib/types";

const inputClass =
  "w-full rounded-lg border border-sage/50 px-3 py-2 text-forest placeholder:text-forest/40 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const { profile, hydrated: accountHydrated } = useAccount();

  const [deliveryType, setDeliveryType] = useState<DeliveryType>("delivery");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | undefined>();
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formError, setFormError] = useState("");
  const [placed, setPlaced] = useState<Order | null>(null);
  const [prefilled, setPrefilled] = useState(false);

  if (accountHydrated && !prefilled) {
    setPrefilled(true);
    if (profile) {
      const last = getDefaultAddress(profile);
      if (last) {
        setSelectedAddressId(last.id);
        setName(last.name || profile.displayName);
        setPhone(last.phone || profile.phone);
        setPincode(last.pincode);
        setAddress(last.address);
      } else {
        setName((prev) => prev || profile.displayName);
        setPhone((prev) => prev || profile.phone);
      }
    }
  }

  const deliveryFee = calcDeliveryFee(deliveryType, subtotal);
  const total = Math.max(0, subtotal - discount) + deliveryFee;

  const savedAddresses = profile?.addresses ?? [];

  const applyAddress = (id: string) => {
    setSelectedAddressId(id);
    const match = savedAddresses.find((addr) => addr.id === id);
    if (!match) return;
    setName(match.name);
    setPhone(match.phone);
    setPincode(match.pincode);
    setAddress(match.address);
  };

  const handleApplyCoupon = () => {
    const result = applyCoupon(couponInput, subtotal, items);
    if (!result.ok) {
      setAppliedCode(undefined);
      setDiscount(0);
      setCouponMessage({ type: "error", text: result.message });
      return;
    }
    setAppliedCode(result.code);
    setDiscount(result.discount);
    setCouponMessage({ type: "success", text: result.message });
  };

  const validate = () => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    if (!trimmedName) return "Please enter your name.";
    if (!trimmedPhone) return "Please enter your phone number.";
    const digits = trimmedPhone.replace(/\D/g, "");
    if (digits.length < 10) return "Enter a valid 10-digit phone number.";
    if (deliveryType === "delivery") {
      if (!pincode.trim()) return "Please enter your pincode.";
      if (!address.trim()) return "Please enter your delivery address.";
    }
    return "";
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setFormError(error);
      return;
    }
    setFormError("");
    const order = placeOrder({
      items,
      deliveryType,
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        pincode: deliveryType === "delivery" ? pincode.trim() : undefined,
        address: deliveryType === "delivery" ? address.trim() : undefined,
      },
      subtotal,
      deliveryFee,
      discount,
      couponCode: appliedCode,
    });
    clearCart();
    setPlaced(order);
  };

  const itemLines = useMemo(
    () =>
      items.map(({ product, quantity }) => ({
        id: product.id,
        name: product.name,
        quantity,
        lineTotal: getEffectivePrice(product) * quantity,
      })),
    [items]
  );

  if (items.length === 0 && !placed) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <p className="text-forest/60">Your cart is empty.</p>
        <Link href="/products" className="mt-4 inline-block">
          <Button>Shop Now</Button>
        </Link>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <CheckCircle className="mx-auto h-16 w-16 text-forest-light" aria-hidden />
        <h1 className="mt-4 font-display text-2xl font-semibold text-forest">
          Order Placed!
        </h1>
        <p className="mt-2 text-forest/60">
          Thank you for shopping at FreshLane. Your order is saved in this
          browser.
        </p>
        <p className="mt-4 font-display text-xl font-semibold text-forest">
          {placed.id}
        </p>
        <p className="mt-1 text-sm text-forest/50">
          Save this order number to track it later.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href={`/orders/${placed.id}`}>
            <Button variant="secondary">Track Order</Button>
          </Link>
          <Link href="/products">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-forest">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-2xl border border-sage/50 bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-forest">
              Delivery Method
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors ${
                  deliveryType === "delivery"
                    ? "border-forest bg-sage/20"
                    : "border-sage/50 hover:border-sage"
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  value="delivery"
                  checked={deliveryType === "delivery"}
                  onChange={() => setDeliveryType("delivery")}
                  className="mt-1"
                />
                <div>
                  <span className="flex items-center gap-2 font-medium text-forest">
                    <Truck className="h-4 w-4" aria-hidden />
                    Home Delivery
                  </span>
                  <p className="mt-1 text-sm text-forest/60">Delivered within 2 hours</p>
                </div>
              </label>
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors ${
                  deliveryType === "collect"
                    ? "border-forest bg-sage/20"
                    : "border-sage/50 hover:border-sage"
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  value="collect"
                  checked={deliveryType === "collect"}
                  onChange={() => setDeliveryType("collect")}
                  className="mt-1"
                />
                <div>
                  <span className="flex items-center gap-2 font-medium text-forest">
                    <Store className="h-4 w-4" aria-hidden />
                    Click & Collect
                  </span>
                  <p className="mt-1 text-sm text-forest/60">Ready in 30 minutes</p>
                </div>
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-sage/50 bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-forest">
              Contact
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                autoComplete="name"
                className={`${inputClass} sm:col-span-2`}
              />
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                type="tel"
                autoComplete="tel"
                className={`${inputClass} sm:col-span-2`}
              />
            </div>
          </section>

          {deliveryType === "delivery" && (
            <section className="rounded-2xl border border-sage/50 bg-white p-6">
              <h2 className="font-display text-lg font-semibold text-forest">
                Delivery Address
              </h2>
              {savedAddresses.length > 0 && (
                <label className="mt-4 block text-sm text-forest/70">
                  Use a saved address
                  <select
                    value={selectedAddressId}
                    onChange={(e) => applyAddress(e.target.value)}
                    className={`${inputClass} mt-1`}
                  >
                    {savedAddresses.map((addr) => (
                      <option key={addr.id} value={addr.id}>
                        {addr.label} — {addr.pincode}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <input
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Pincode"
                  autoComplete="postal-code"
                  className={inputClass}
                />
                <textarea
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Full address"
                  rows={3}
                  autoComplete="street-address"
                  className={`${inputClass} sm:col-span-2`}
                />
              </div>
            </section>
          )}

          <section className="rounded-2xl border border-sage/50 bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-forest">
              Coupon Code
            </h2>
            <div className="mt-3 flex gap-2">
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Enter code (e.g. FRESH15)"
                className={inputClass}
                aria-label="Coupon code"
              />
              <Button type="button" variant="outline" onClick={handleApplyCoupon}>
                Apply
              </Button>
            </div>
            {couponMessage && (
              <p
                className={`mt-2 text-sm ${
                  couponMessage.type === "error"
                    ? "text-terracotta"
                    : "text-forest-light"
                }`}
                role="status"
              >
                {couponMessage.text}
              </p>
            )}
          </section>
        </div>

        <div className="h-fit rounded-2xl border border-sage/50 bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-forest">Summary</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {itemLines.map((line) => (
              <li key={line.id} className="flex justify-between text-forest/80">
                <span className="truncate pr-2">
                  {line.name} × {line.quantity}
                </span>
                <span className="shrink-0 font-medium">
                  {formatPrice(line.lineTotal)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-sage/50 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-forest/60">Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <dt className="text-forest/60">Discount ({appliedCode})</dt>
                <dd className="text-forest-light">−{formatPrice(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-forest/60">
                {deliveryType === "collect" ? "Pickup" : "Delivery"}
              </dt>
              <dd>{deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}</dd>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
          {formError && (
            <p className="mt-4 text-sm text-terracotta" role="alert">
              {formError}
            </p>
          )}
          <Button type="submit" size="lg" className="mt-6 w-full">
            Place Order
          </Button>
          <p className="mt-3 text-center text-xs text-forest/50">
            By placing this order, you agree to our{" "}
            <Link href="/terms" className="text-terracotta hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-terracotta hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
          <p className="mt-1 text-center text-xs text-forest/50">
            Payment is cash on delivery / collect for this demo
          </p>
        </div>
      </form>
    </div>
  );
}
