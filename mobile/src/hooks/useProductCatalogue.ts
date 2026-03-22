import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts } from '../api/productsApi';
import { PRODUCT_CATALOGUE_STALE_TIME_MS } from '../constants/appConfig';

/**
 * Fetches and caches the full product catalogue from the BFF.
 * Returns products with current stock availability included.
 */
export function useProductCatalogue() {
  const query = useQuery({
    queryKey: ['products'],
    queryFn: fetchAllProducts,
    staleTime: PRODUCT_CATALOGUE_STALE_TIME_MS,
  });

  return {
    products: query.data ?? [],
    isLoadingProducts: query.isLoading,
    productsLoadError: query.error,
    refetchProductCatalogue: query.refetch,
  };
}
