import type { NFT } from "@/types/nft";
import type { Order } from "@/types/order";

import { nftFixtures as initialNFTs } from "@/mocks/fixtures/nfts";

const inventory = new Map<string, NFT>(
  initialNFTs.map((nft) => [nft.id, { ...nft }]),
);

const orders = new Map<string, Order>();

const idempotencyKeys = new Map<string, string>();

export const mockStore = {
  getNFTs(): NFT[] {
    return Array.from(inventory.values());
  },

  getNFTById(id: string): NFT | undefined {
    return inventory.get(id);
  },

  updateNFT(nft: NFT): void {
    inventory.set(nft.id, nft);
  },

  getOrder(id: string): Order | undefined {
    return orders.get(id);
  },

  getOrderByIdempotencyKey(key: string): Order | undefined {
    const orderId = idempotencyKeys.get(key);

    return orderId ? orders.get(orderId) : undefined;
  },

  saveOrder(order: Order): void {
    orders.set(order.id, order);
    idempotencyKeys.set(order.idempotencyKey, order.id);
  },
};
