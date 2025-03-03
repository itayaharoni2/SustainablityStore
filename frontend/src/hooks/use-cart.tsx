import { absoluteServerUrl } from "@/lib/utils";
import { Product } from "@/types";
import axios from "axios";
import { create } from "zustand";

export type CartItem = {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
  };
} & {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
};

type CartState = {
  items: CartItem[];
  fetchCart: () => Promise<void>;
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  emptyCard: () => void;
};

export const useCart = create<CartState>((set) => ({
  items: [],
  fetchCart: async () => {
    const response = await axios.get(absoluteServerUrl("/cart"), {
      withCredentials: true,
    });
    const { data } = response;
    if (data.success) {
      set({ items: data.items });
    }
  },
  addItem: async (product) => {
    const response = await axios.post(
      absoluteServerUrl("/cart"),
      {
        productId: product.id,
        quantity: 1,
      },
      { withCredentials: true }
    );
    const { data } = response;
    if (data.success) {
      set({ items: data.items });
    }
  },
  removeItem: async (productId) => {
    const response = await axios.delete(
      absoluteServerUrl(`/cart/${productId}`),
      { withCredentials: true }
    );
    const { data } = response;
    if (data.success) {
      set({ items: data.items });
    }
  },
  clearCart: async () => {
    const response = await axios.delete(absoluteServerUrl("/cart"), {
      withCredentials: true,
    });
    const { data } = response;
    if (data.success) {
      set({ items: data.items });
    }
  },
  emptyCard: () => {
    set({ items: [] });
  },
}));

// import { Product } from "@/types";
// import { create } from "zustand";

// export type CartItem = {
//   product: Product;
//   quantity: number;
// };

// type CartState = {
//   items: CartItem[];
//   fetchCart: () => Promise<void>;
//   addItem: (product: Product) => Promise<void>;
//   removeItem: (productId: string) => Promise<void>;
//   clearCart: () => Promise<void>;
// };

// export const useCart = create<CartState>((set) => ({
//   items: [],
//   fetchCart: async () => {
//     const response = await fetch('/cart');
//     const data = await response.json();
//     set({ items: data.items });
//   },
//   addItem: async (product) => {
//     const response = await fetch('/cart', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ productId: product.id, quantity: 1 })
//     });
//     const data = await response.json();
//     set({ items: data.items });
//   },
//   removeItem: async (productId) => {
//     const response = await fetch(`/cart/${productId}`, {
//       method: 'DELETE'
//     });
//     const data = await response.json();
//     set({ items: data.items });
//   },
//   clearCart: async () => {
//     const response = await fetch('/cart', {
//       method: 'DELETE'
//     });
//     const data = await response.json();
//     set({ items: data.items });
//   },
// }));
