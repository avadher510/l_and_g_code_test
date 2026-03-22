import { apiClient } from './apiClient';
import { Cart } from '../types/sharedTypes';

/** Creates a new empty shopping cart and returns it. */
export async function createNewCart(): Promise<Cart> {
  const response = await apiClient.post<Cart>('/api/cart');
  return response.data;
}

/**
 * Fetches the current state of a cart by ID.
 * @param cartId - The active cart session ID
 */
export async function fetchCartById(cartId: string): Promise<Cart> {
  const response = await apiClient.get<Cart>(`/api/cart/${cartId}`);
  return response.data;
}

/**
 * Adds a product to the specified cart or increments its quantity if already present.
 * @param cartId - The active cart session ID
 * @param productId - The product to add
 * @param quantity - How many units to add
 */
export async function addItemToCart(
  cartId: string,
  productId: string,
  quantity: number,
): Promise<Cart> {
  const response = await apiClient.post<Cart>(`/api/cart/${cartId}/items`, {
    productId,
    quantity,
  });
  return response.data;
}

/**
 * Updates the quantity of a specific item already in the cart.
 * @param cartId - The active cart session ID
 * @param productId - The product whose quantity should change
 * @param quantity - The new desired quantity
 */
export async function updateCartItemQuantity(
  cartId: string,
  productId: string,
  quantity: number,
): Promise<Cart> {
  const response = await apiClient.patch<Cart>(
    `/api/cart/${cartId}/items/${productId}`,
    { quantity },
  );
  return response.data;
}

/**
 * Removes a specific item from the cart entirely; releases its stock reservation.
 * @param cartId - The active cart session ID
 * @param productId - The product to remove
 */
export async function removeItemFromCart(
  cartId: string,
  productId: string,
): Promise<Cart> {
  const response = await apiClient.delete<Cart>(
    `/api/cart/${cartId}/items/${productId}`,
  );
  return response.data;
}
