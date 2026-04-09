"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  itemId: string;
  productId: string;
  variantId: string;
  quantity: number;
  name?: string;
  price?: number;
  image?: string;
  customDesignId?: string | null;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateItem: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      updateItem: (itemId, quantity) => set((state) => ({ items: state.items.map((item) => (item.itemId === itemId ? { ...item, quantity } : item)) })),
      removeItem: (itemId) => set((state) => ({ items: state.items.filter((item) => item.itemId !== itemId) })),
      clearCart: () => set({ items: [] }),
    }),
    { name: "cattleya-cart" }
  )
);
