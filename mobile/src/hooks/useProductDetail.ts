import { useQuery } from '@tanstack/react-query';
import { fetchProductById } from '../api/productsApi';

/**
 * Fetches and caches a single product by ID from the BFF.
 * @param productId - The unique ID of the product to fetch
 */
export function useProductDetail(productId: string) {
  const query = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId),
    enabled: !!productId,
  });

  return {
    product: query.data,
    isLoadingProduct: query.isLoading,
    productLoadError: query.error,
  };
}
