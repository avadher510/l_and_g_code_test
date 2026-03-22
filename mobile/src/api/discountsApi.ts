import { apiClient } from './client';
import type { ApiResponse, Discount } from './types';

export const discountsApi = {
  getAll: async (): Promise<Discount[]> => {
    const response = await apiClient.get<ApiResponse<Discount[]>>('/discounts');
    return response.data.data;
  },
};
