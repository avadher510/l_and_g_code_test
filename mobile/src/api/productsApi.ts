import { apiClient } from './apiClient';
import { Product, ProductListResponse } from '../types/sharedTypes';

/**
 * Fetches the full product catalogue from the BFF.
 * @returns An array of all available products with current stock levels
 */
export async function fetchAllProducts(): Promise<Product[]> {
  const response = await apiClient.get<ProductListResponse>('/api/products');
  return response.data.products;
}

/**
 * Fetches a single product by its unique identifier.
 * @param productId - The unique product ID
 * @returns The matching product with current stock availability
 */
export async function fetchProductById(productId: string): Promise<Product> {
  const response = await apiClient.get<Product>(`/api/products/${productId}`);
  return response.data;
}
