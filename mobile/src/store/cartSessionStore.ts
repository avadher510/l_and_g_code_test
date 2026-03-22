import { create } from 'zustand';
import { createNewCart } from '../api/cartApi';

interface CartSessionState {
  cartId: string | null;
  /**
   * Creates a new cart via the API if no session currently exists;
   * does nothing if a cartId is already stored.
   */
  initiateNewShoppingCartIfNoneExists: () => Promise<void>;
  /** Stores the provided cart session ID as the active session. */
  setActiveCartSessionId: (cartId: string) => void;
  /** Clears the cart session after a successful checkout; resets cartId to null. */
  clearCartSessionAfterSuccessfulCheckout: () => void;
}

export const useCartSessionStore = create<CartSessionState>((set, get) => ({
  cartId: null,

  initiateNewShoppingCartIfNoneExists: async () => {
    if (get().cartId !== null) return;
    const cart = await createNewCart();
    set({ cartId: cart.id });
  },

  setActiveCartSessionId: (cartId) => set({ cartId }),

  clearCartSessionAfterSuccessfulCheckout: () => set({ cartId: null }),
}));
