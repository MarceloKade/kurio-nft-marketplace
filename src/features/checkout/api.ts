import { api } from "@/lib/api";
import type { CreateOrderRequest, CreateOrderResponse } from "@/types/order";

export async function createOrder(
  payload: CreateOrderRequest,
): Promise<CreateOrderResponse> {
  const { data } = await api.post<CreateOrderResponse>("/orders", payload, {
    headers: {
      "Idempotency-Key": payload.idempotencyKey,
    },
  });

  return data;
}

export async function getOrder(orderId: string): Promise<CreateOrderResponse> {
  const { data } = await api.get<CreateOrderResponse>(`/orders/${orderId}`);

  return data;
}
