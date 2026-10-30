import type { NFT } from "@/types/nft";

export type PaymentMethod = "wallet" | "card";

export type OrderStatus = "completed" | "failed";

export interface OrderItem {
  nftId: string;
  name: string;
  image: string;
  unitPrice: string;
  quantity: number;
}

export interface Order {
  id: string;
  idempotencyKey: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  total: string;
  createdAt: string;
}

export interface CreateOrderRequest {
  items: {
    nftId: string;
    quantity: number;
  }[];
  paymentMethod: PaymentMethod;
  idempotencyKey: string;
}

export interface CreateOrderResponse {
  order: Order;
}

export interface OrderErrorResponse {
  message: string;
}

export function toOrderItem(nft: NFT, quantity: number): OrderItem {
  return {
    nftId: nft.id,
    name: nft.name,
    image: nft.image,
    unitPrice: nft.price,
    quantity,
  };
}
