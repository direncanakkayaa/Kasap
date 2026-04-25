"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  name: string;
  price: number;        // base price per KG or per ADET
  imageUrl: string;
  unit: string;         // "KG" | "ADET" | "GR"
  quantity: number;     // Multiplier (how many items of this weight)
  weight: number;       // The amount (e.g. 0.250 for 250gr, 1.0 for 1kg, 1 for 1 piece)
  serviceType: "RAW" | "COOKED";
  cookingPrice: number; // extra price if cooked
  butcherNote: string;
  selectedAdditions: {
    id: string;
    name: string;
    price: number;
  }[];
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity" | "weight"> & { quantity?: number; weight?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateWeight: (productId: string, weight: number) => void;
  updateNote: (productId: string, note: string) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getItemCount: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          // Check if same product with same serviceType AND same weight already exists
          const existingIdx = state.items.findIndex(
            (i) =>
              i.productId === newItem.productId &&
              i.serviceType === newItem.serviceType &&
              i.weight === (newItem.weight || 1)
          );

          if (existingIdx >= 0) {
            const updated = [...state.items];
            updated[existingIdx] = {
              ...updated[existingIdx],
              quantity: updated[existingIdx].quantity + (newItem.quantity || 1),
              selectedAdditions: newItem.selectedAdditions,
              butcherNote: newItem.butcherNote || updated[existingIdx].butcherNote,
            };
            return { items: updated };
          }

          return {
            items: [
              ...state.items,
              { 
                ...newItem, 
                quantity: newItem.quantity || 1,
                weight: newItem.weight || (newItem.unit === "KG" ? 1.0 : 1)
              },
            ],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        }));
      },

      updateWeight: (productId, weight) => {
        if (weight <= 0) return;
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, weight } : i
          ),
        }));
      },

      updateNote: (productId, note) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, butcherNote: note } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalAmount: () => {
        const { items } = get();
        return items.reduce((sum, item) => {
          // Calculation: (BasePrice * Weight + CookingPrice) * Quantity + Additions
          // Note: Additions might be per item or per line. Let's assume per item for now.
          const unitPrice = (item.price * item.weight) + (item.serviceType === "COOKED" ? item.cookingPrice : 0);
          const additionsTotal = item.selectedAdditions.reduce(
            (s, a) => s + a.price,
            0
          );
          return sum + (unitPrice + additionsTotal) * item.quantity;
        }, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    {
      name: "erdogan-kasap-cart",
    }
  )
);
