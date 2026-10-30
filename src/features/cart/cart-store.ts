import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { NFT } from "@/types/nft";

export interface CartItem {
  nft: NFT;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (nft: NFT) => void;
  removeItem: (nftId: string) => void;
  updateQuantity: (nftId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (nft) => {
        if (nft.availableQuantity <= 0) return;

        set((state) => {
          const existingItem = state.items.find(
            (item) => item.nft.id === nft.id,
          );

          if (existingItem) {
            if (existingItem.quantity >= nft.availableQuantity) {
              return state;
            }

            return {
              items: state.items.map((item) =>
                item.nft.id === nft.id
                  ? { ...item, quantity: item.quantity + 1, nft }
                  : item,
              ),
            };
          }

          return {
            items: [...state.items, { nft, quantity: 1 }],
          };
        });
      },

      removeItem: (nftId) => {
        set((state) => ({
          items: state.items.filter((item) => item.nft.id !== nftId),
        }));
      },

      updateQuantity: (nftId, quantity) => {
        set((state) => ({
          items: state.items
            .map((item) => {
              if (item.nft.id !== nftId) return item;

              const safeQuantity = Math.min(
                Math.floor(quantity),
                item.nft.availableQuantity,
              );

              return { ...item, quantity: safeQuantity };
            })
            .filter((item) => item.quantity > 0),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + Number(item.nft.price) * item.quantity,
          0,
        ),
    }),
    {
      name: "pixelvault-cart",
      version: 1,
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
