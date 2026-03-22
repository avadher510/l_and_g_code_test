import { apiClient } from './client';
import type { ApiResponse, Product } from './types';

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<{ products: Product[]; totalCount: number }>>('/products');
    return response.data.data.products;
  },

  getById: async (productId: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${productId}`);
    return response.data.data;
  },
};
