import { useMutation, useQuery } from "@tanstack/react-query";

import { createOrder, getOrder } from "./api";
import type { CreateOrderRequest } from "@/types/order";

export function useCreateOrder() {
  return useMutation({
    mutationFn: (payload: CreateOrderRequest) => createOrder(payload),
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => getOrder(orderId),
    enabled: Boolean(orderId),
  });
}
