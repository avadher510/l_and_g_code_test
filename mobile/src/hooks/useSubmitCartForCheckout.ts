import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitCartForCheckout } from '../api/checkoutApi';
import { useCartSessionStore } from '../store/cartSessionStore';

/**
 * Mutation hook for submitting the active cart for checkout.
 * On success, invalidates all cart-related queries.
 * Returns the full CheckoutResult including order summary or failure detail.
 */
export function useSubmitCartForCheckout() {
  const queryClient = useQueryClient();
  const { cartId } = useCartSessionStore();

  const mutation = useMutation({
    mutationFn: () => submitCartForCheckout(cartId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  return {
    submitCartForCheckout: mutation.mutate,
    isProcessingCheckout: mutation.isPending,
    checkoutResult: mutation.data,
    checkoutError: mutation.error,
    hasCheckoutCompleted: mutation.isSuccess || mutation.isError,
  };
}
