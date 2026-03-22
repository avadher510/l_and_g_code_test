import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeItemFromCart } from '../api/cartApi';
import { useCartSessionStore } from '../store/cartSessionStore';

/**
 * Mutation hook for removing an item from the active cart entirely.
 * Releases the stock reservation and invalidates the cart query on success.
 */
export function useRemoveItemFromActiveCart() {
  const queryClient = useQueryClient();
  const { cartId } = useCartSessionStore();

  const mutation = useMutation({
    mutationFn: ({ productId }: { productId: string }) =>
      removeItemFromCart(cartId!, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', cartId] });
    },
  });

  return {
    removeItemFromActiveCart: mutation.mutateAsync,
    isRemovingItemFromCart: mutation.isPending,
  };
}
