import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/productsApi';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getAll,
  });
}

export function useProduct(productId: string) {
  return useQuery({
    queryKey: ['products', productId],
    queryFn: () => productsApi.getById(productId),
    enabled: !!productId,
  });
}
