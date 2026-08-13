import { offers } from "@/data/offers";
import { getEffectivePrice } from "@/lib/format";
import type { CartItem, Offer } from "@/lib/types";

export type CouponSuccess = {
  ok: true;
  code: string;
  discount: number;
  message: string;
  offer: Offer;
};

export type CouponFailure = {
  ok: false;
  message: string;
};

export type CouponResult = CouponSuccess | CouponFailure;

export function isOfferActive(offer: Offer, now = new Date()): boolean {
  const end = new Date(`${offer.validUntil}T23:59:59.999`);
  if (Number.isNaN(end.getTime())) return false;
  return now <= end;
}

export function findOfferByCode(code: string): Offer | undefined {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return undefined;
  return offers.find((offer) => offer.code.toUpperCase() === normalized);
}

export function applyCoupon(
  rawCode: string,
  subtotal: number,
  items: CartItem[] = [],
  now = new Date()
): CouponResult {
  const code = rawCode.trim().toUpperCase();
  if (!code) {
    return { ok: false, message: "Enter a coupon code." };
  }

  const offer = findOfferByCode(code);
  if (!offer) {
    return { ok: false, message: "That code isn't valid. Check Offers for current coupons." };
  }

  if (!isOfferActive(offer, now)) {
    return { ok: false, message: "This coupon has expired." };
  }

  if (code === "WELCOME100") {
    if (subtotal < 500) {
      return {
        ok: false,
        message: "WELCOME100 requires a subtotal of ₹500 or more.",
      };
    }
    return {
      ok: true,
      code: offer.code,
      discount: 100,
      message: "WELCOME100 applied — ₹100 off.",
      offer,
    };
  }

  if (code === "BAKE20") {
    const bakerySubtotal = items.reduce((sum, item) => {
      if (item.product.categoryId !== "cat-bakery") return sum;
      return sum + getEffectivePrice(item.product) * item.quantity;
    }, 0);
    if (bakerySubtotal <= 0) {
      return {
        ok: false,
        message: "BAKE20 applies only to bakery items in your cart.",
      };
    }
    const discount = Math.round(bakerySubtotal * (offer.discountPercent / 100));
    return {
      ok: true,
      code: offer.code,
      discount,
      message: `BAKE20 applied — ${offer.discountPercent}% off bakery items.`,
      offer,
    };
  }

  if (offer.discountPercent > 0) {
    const discount = Math.round(subtotal * (offer.discountPercent / 100));
    return {
      ok: true,
      code: offer.code,
      discount,
      message: `${offer.code} applied — ${offer.discountPercent}% off.`,
      offer,
    };
  }

  return {
    ok: true,
    code: offer.code,
    discount: 0,
    message: `${offer.code} noted — your in-store bonus will be added at pickup.`,
    offer,
  };
}

export function calcDeliveryFee(
  deliveryType: "delivery" | "collect",
  subtotal: number
): number {
  if (deliveryType === "collect") return 0;
  return subtotal > 500 ? 0 : 40;
}
