import { create } from 'zustand';
import axios from 'axios';
import { backend_url } from '@/config'; 
interface CartItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  itemTotal: number;
}

interface CartState {
  cart: CartItem[];
  total: number;
  fetchCart: () => Promise<void>;
  updateItem: (itemId: string, change: number) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  total: 0,

  fetchCart: async () => {
    try {
      const res = await axios.get(`${backend_url}/user/cart`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });

      const items = res.data.cart;
      const total = res.data.totalCartPrice;

      set({ cart: items, total });
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  },

  updateItem: async (itemId, change) => {
    try {
      await axios.post(
        `${backend_url}/user/cart`,
        { itemId, quantity: change },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );

      await useCartStore.getState().fetchCart();
    } catch (err) {
      console.error("Error updating cart:", err);
    }
  },

  clearCart: () => {
    set({ cart: [], total: 0 });
  },
}));
