import { create } from 'zustand';

interface CartStore {
  cartId: string | null;
  setCartId: (id: string) => void;
  clearCartId: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  cartId: null,
  setCartId: (id) => set({ cartId: id }),
  clearCartId: () => set({ cartId: null }),
}));
