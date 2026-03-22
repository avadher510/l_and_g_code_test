import { useQuery } from '@tanstack/react-query';
import { fetchCartById } from '../api/cartApi';
import { useCartSessionStore } from '../store/cartSessionStore';
import { CART_DATA_STALE_TIME_MS } from '../constants/appConfig';

/**
 * Fetches the current contents of the active cart session.
 * Returns undefined if no cart session has been initiated yet.
 */
export function useActiveCartContents() {
  const { cartId } = useCartSessionStore();

  const query = useQuery({
    queryKey: ['cart', cartId],
    queryFn: () => fetchCartById(cartId!),
    enabled: !!cartId,
    staleTime: CART_DATA_STALE_TIME_MS,
  });

  return {
    cart: query.data,
    isLoadingCart: query.isLoading,
    cartLoadError: query.error,
    refetchCart: query.refetch,
  };
}
