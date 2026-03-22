import { apiClient } from './client';
import type { ApiResponse, Cart } from './types';

export const cartApi = {
  create: async (): Promise<Cart> => {
    const response = await apiClient.post<ApiResponse<Cart>>('/cart');
    return response.data.data;
  },

  getById: async (cartId: string): Promise<Cart> => {
    const response = await apiClient.get<ApiResponse<Cart>>(`/cart/${cartId}`);
    return response.data.data;
  },

  addItem: async (cartId: string, productId: string, quantity: number): Promise<Cart> => {
    const response = await apiClient.post<ApiResponse<Cart>>(`/cart/${cartId}/items`, {
      productId,
      quantity,
    });
    return response.data.data;
  },

  updateItemQuantity: async (cartId: string, productId: string, quantity: number): Promise<Cart> => {
    const response = await apiClient.patch<ApiResponse<Cart>>(`/cart/${cartId}/items/${productId}`, {
      quantity,
    });
    return response.data.data;
  },

  removeItem: async (cartId: string, productId: string): Promise<Cart> => {
    const response = await apiClient.delete<ApiResponse<Cart>>(`/cart/${cartId}/items/${productId}`);
    return response.data.data;
  },
};
