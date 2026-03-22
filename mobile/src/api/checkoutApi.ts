import { apiClient } from './apiClient';
import { CheckoutResult } from '../types/sharedTypes';

/**
 * Submits the specified cart for checkout.
 * Discounts are applied automatically; stock is deducted on success.
 * @param cartId - The cart to check out
 * @returns A CheckoutResult indicating success or failure with full detail
 */
export async function submitCartForCheckout(
  cartId: string,
): Promise<CheckoutResult> {
  const response = await apiClient.post<CheckoutResult>(
    `/api/cart/${cartId}/checkout`,
  );
  return response.data;
}
