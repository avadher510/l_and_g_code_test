import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCartItemQuantity } from '../api/cartApi';
import { useCartSessionStore } from '../store/cartSessionStore';

/**
 * Mutation hook for updating the quantity of an existing cart item.
 * Invalidates the cart query on success.
 */
export function useUpdateCartItemQuantity() {
  const queryClient = useQueryClient();
  const { cartId } = useCartSessionStore();

  const mutation = useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => updateCartItemQuantity(cartId!, productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', cartId] });
    },
  });

  return {
    updateItemQuantityInActiveCart: mutation.mutateAsync,
    isUpdatingItemQuantity: mutation.isPending,
  };
}
