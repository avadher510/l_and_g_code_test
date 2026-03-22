import { apiClient } from './client';
import type { ApiResponse, CheckoutResult } from './types';

export const checkoutApi = {
  processCheckout: async (cartId: string): Promise<CheckoutResult> => {
    const response = await apiClient.post<ApiResponse<CheckoutResult>>(`/cart/${cartId}/checkout`);
    return response.data.data;
  },
};
