import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addItemToCart } from '../api/cartApi';
import { useCartSessionStore } from '../store/cartSessionStore';

/**
 * Mutation hook for adding a product to the active cart.
 * Automatically invalidates the cart query on success to keep the UI in sync.
 */
export function useAddItemToActiveCart() {
  const queryClient = useQueryClient();
  const { cartId } = useCartSessionStore();

  const mutation = useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => addItemToCart(cartId!, productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', cartId] });
    },
  });

  return {
    addItemToActiveCart: mutation.mutateAsync,
    isAddingItemToCart: mutation.isPending,
    addItemError: mutation.error,
    wasItemSuccessfullyAdded: mutation.isSuccess,
    resetAddItemState: mutation.reset,
  };
}
