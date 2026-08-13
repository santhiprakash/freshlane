export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  productCount: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  unit: string;
  categoryId: string;
  image: string;
  inStock: boolean;
  featured?: boolean;
  offerPrice?: number;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  code: string;
  discountPercent: number;
  validUntil: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = "pending" | "confirmed" | "ready" | "delivered";
export type DeliveryType = "delivery" | "collect";

export interface OrderCustomer {
  name: string;
  phone: string;
  pincode?: string;
  address?: string;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  items: CartItem[];
  deliveryType: DeliveryType;
  customer: OrderCustomer;
  couponCode?: string;
}

export interface SavedAddress {
  id: string;
  label: string;
  name: string;
  phone: string;
  pincode: string;
  address: string;
}

export interface AccountProfile {
  displayName: string;
  email: string;
  phone: string;
  addresses: SavedAddress[];
}
