import type {
  CartItem,
  DeliveryType,
  Order,
  OrderCustomer,
  OrderStatus,
} from "@/lib/types";

export const ORDERS_STORAGE_KEY = "freshlane-orders";

export interface PlaceOrderInput {
  items: CartItem[];
  deliveryType: DeliveryType;
  customer: OrderCustomer;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
}

const STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "ready",
  "delivered",
];

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function snapshotItems(items: CartItem[]): CartItem[] {
  return items.map((item) => ({
    product: { ...item.product },
    quantity: item.quantity,
  }));
}

function normalizeOrder(raw: unknown): Order | null {
  if (!isRecord(raw)) return null;
  if (typeof raw.id !== "string" || !raw.id.trim()) return null;
  if (typeof raw.date !== "string" || !raw.date) return null;
  if (!Array.isArray(raw.items)) return null;

  const customerRaw = isRecord(raw.customer) ? raw.customer : {};
  const status = STATUSES.includes(raw.status as OrderStatus)
    ? (raw.status as OrderStatus)
    : "pending";
  const subtotal =
    typeof raw.subtotal === "number" ? raw.subtotal : Number(raw.total) || 0;
  const deliveryFee =
    typeof raw.deliveryFee === "number" ? raw.deliveryFee : 0;
  const discount = typeof raw.discount === "number" ? raw.discount : 0;
  const total =
    typeof raw.total === "number"
      ? raw.total
      : Math.max(0, subtotal - discount) + deliveryFee;

  return {
    id: raw.id,
    date: raw.date,
    status,
    total,
    subtotal,
    deliveryFee,
    discount,
    items: snapshotItems(raw.items as CartItem[]),
    deliveryType: raw.deliveryType === "collect" ? "collect" : "delivery",
    customer: {
      name: typeof customerRaw.name === "string" ? customerRaw.name : "",
      phone: typeof customerRaw.phone === "string" ? customerRaw.phone : "",
      pincode:
        typeof customerRaw.pincode === "string" ? customerRaw.pincode : undefined,
      address:
        typeof customerRaw.address === "string" ? customerRaw.address : undefined,
    },
    couponCode:
      typeof raw.couponCode === "string" && raw.couponCode
        ? raw.couponCode
        : undefined,
  };
}

export function getOrders(): Order[] {
  if (!canUseStorage()) return [];
  try {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(normalizeOrder)
      .filter((order): order is Order => order !== null);
  } catch {
    return [];
  }
}

export function saveOrders(orders: Order[]): void {
  if (!canUseStorage()) return;
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

export function getOrder(id: string): Order | undefined {
  return getOrders().find((order) => order.id === id);
}

export function generateOrderId(existing: Order[] = getOrders()): string {
  const year = new Date().getFullYear();
  const prefix = `FL-${year}-`;
  let max = 0;
  for (const order of existing) {
    if (!order.id.startsWith(prefix)) continue;
    const n = Number.parseInt(order.id.slice(prefix.length), 10);
    if (!Number.isNaN(n) && n > max) max = n;
  }
  return `${prefix}${String(max + 1).padStart(4, "0")}`;
}

export function buildOrder(
  input: PlaceOrderInput,
  existing: Order[] = []
): Order {
  const subtotal = input.subtotal;
  const deliveryFee = input.deliveryFee;
  const discount = Math.max(0, input.discount);
  return {
    id: generateOrderId(existing),
    date: new Date().toISOString(),
    status: "pending",
    subtotal,
    deliveryFee,
    discount,
    total: Math.max(0, subtotal - discount) + deliveryFee,
    items: snapshotItems(input.items),
    deliveryType: input.deliveryType,
    customer: { ...input.customer },
    couponCode: input.couponCode?.trim() || undefined,
  };
}

export function placeOrder(input: PlaceOrderInput): Order {
  const existing = getOrders();
  const order = buildOrder(input, existing);
  saveOrders([order, ...existing]);
  return order;
}

export function updateOrderStatus(
  id: string,
  status: OrderStatus
): Order | undefined {
  const existing = getOrders();
  let updated: Order | undefined;
  const next = existing.map((order) => {
    if (order.id !== id) return order;
    updated = { ...order, status };
    return updated;
  });
  if (updated) saveOrders(next);
  return updated;
}

export function isSameLocalDay(iso: string, now = new Date()): boolean {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return false;
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}
