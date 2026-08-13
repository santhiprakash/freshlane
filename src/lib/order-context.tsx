"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { Order, OrderStatus } from "@/lib/types";
import {
  getOrder as readOrder,
  getOrders as readOrders,
  placeOrder as writeOrder,
  updateOrderStatus as writeOrderStatus,
  type PlaceOrderInput,
} from "@/lib/order-store";
import { useBrowserHydrated } from "@/lib/use-browser-hydrated";

interface OrderContextValue {
  orders: Order[];
  hydrated: boolean;
  getOrder: (id: string) => Order | undefined;
  placeOrder: (input: PlaceOrderInput) => Order;
  updateOrderStatus: (id: string, status: OrderStatus) => Order | undefined;
}

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loaded, setLoaded] = useState(false);
  const hydrated = useBrowserHydrated();

  if (hydrated && !loaded) {
    setOrders(readOrders());
    setLoaded(true);
  }

  const getOrder = useCallback(
    (id: string) => {
      return orders.find((order) => order.id === id) ?? readOrder(id);
    },
    [orders]
  );

  const placeOrder = useCallback((input: PlaceOrderInput) => {
    const order = writeOrder(input);
    setOrders(readOrders());
    return order;
  }, []);

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    const updated = writeOrderStatus(id, status);
    setOrders(readOrders());
    return updated;
  }, []);

  const value = useMemo(
    () => ({
      orders,
      hydrated: loaded,
      getOrder,
      placeOrder,
      updateOrderStatus,
    }),
    [orders, loaded, getOrder, placeOrder, updateOrderStatus]
  );

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
}
